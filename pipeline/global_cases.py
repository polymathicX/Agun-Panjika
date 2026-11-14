"""Reproducible detector-only temporal audits and portable area packages.

Run after the country pipelines and neighbour ingestion, or use --from-packages
to refit from public checksum-verified feature CSVs without raw inputs or a key.
These are retrospective replays, not untouched final holdouts or forecast skill.
"""
from __future__ import annotations

import argparse
import hashlib
import json
from datetime import UTC, datetime
from pathlib import Path

import numpy as np
import pandas as pd

from pipeline.aggregate import to_district_week
from pipeline.config import ROOT, WEB_DATA
from pipeline.harmonise import ConformalBands, EnsembleModel, MonthlyFactors, NaiveFactor, PRDFactor, build_features

VERSION = "portable-detector-ensemble-v1"
SPLITS = {"fit": [2013, 2018], "calibration": [2019, 2021], "test": [2022, 2024]}
CASES = [
    {"id": "bangladesh", "name_en": "Bangladesh", "name_bn": "বাংলাদেশ", "iso3": "BGD",
     "setting": "National reference case", "bbox": [88, 20.5, 92.7, 26.7],
     "input": "data/processed/detections.parquet"},
    {"id": "nepal", "name_en": "Nepal", "name_bn": "নেপাল", "iso3": "NPL",
     "setting": "Himalayan foothills and plains", "bbox": [80, 26.3, 88.3, 30.5],
     "input": "data/npl/processed/detections.parquet"},
    {"id": "chin", "name_en": "Chin, Myanmar", "name_bn": "চিন, মিয়ানমার", "iso3": "MMR",
     "setting": "Cross-border hill landscape", "bbox": [92.5, 20.5, 94.5, 24.5],
     "input": "data/processed/neighbour_detections.parquet", "unit": "chin"},
    {"id": "punjab_haryana", "name_en": "Punjab & Haryana, India", "name_bn": "পাঞ্জাব ও হরিয়ানা, ভারত",
     "iso3": "IND", "setting": "Contrasting agricultural landscape", "bbox": [73.8, 27.5, 77.6, 32.6],
     "input": "data/processed/neighbour_detections.parquet", "unit": "punjab_haryana"},
]


def partition(frame: pd.DataFrame, name: str) -> pd.DataFrame:
    first, last = SPLITS[name]
    return frame[frame.iso_year.between(first, last)].copy()


def portable_features(det: pd.DataFrame) -> pd.DataFrame:
    d = det.copy()
    if "unit_id" in d:
        d["district_id"], d["region_id"] = d["unit_id"], d["unit_id"]
    # Fixed confidence/type rules only: no static-cell learning from test years.
    d["keep"] = np.where(d.sensor == "modis", d.confidence_norm >= .30, d.confidence_norm >= .5)
    d["keep"] &= ~d["type"].isin([2, 3])
    dw = to_district_week(d)
    # Compute neighbours separately within every year; no fit-period feature reads a test-period row.
    frames = [build_features(g) for _, g in dw.groupby("iso_year")]
    feat = pd.concat(frames, ignore_index=True)
    return feat.drop(columns=["cloud", "precip", "rh", "fwi", "dc"], errors="ignore")


def national(frame: pd.DataFrame) -> pd.DataFrame:
    cols = [c for c in ("M", "V", "ensemble", "naive", "monthly", "prd_4.4x") if c in frame]
    # min_count keeps a missing sensor distinct from a measured zero.
    out = frame.groupby(["iso_year", "iso_week"])[cols].sum(min_count=1).reset_index()
    out["month"] = pd.to_datetime(pd.Series([
        f"{int(y)}-W{int(w):02d}-4" for y, w in zip(out.iso_year, out.iso_week, strict=True)
    ]), format="%G-W%V-%u").dt.month
    return out


def metrics(frame: pd.DataFrame, column: str) -> dict:
    delta = frame[column] - frame.V
    annual = frame.groupby("iso_year")[[column, "V"]].sum()
    valid = annual.V > 0
    return {"mae_week": round(float(delta.abs().mean()), 3),
            "abs_total_pct_err": round(float((100 * (annual.loc[valid, column] / annual.loc[valid, "V"] - 1))
                                             .abs().mean()), 3),
            "weeks": len(frame)}


def load_features(output: Path, doc: dict) -> pd.DataFrame:
    path = output / "features" / f"{doc['id']}.csv.gz"
    if hashlib.sha256(path.read_bytes()).hexdigest() != doc["features"]["sha256"]:
        raise ValueError(f"{doc['id']}: public feature checksum mismatch")
    feat = pd.read_csv(path, float_precision="round_trip")
    required = {"region_id", "iso_year", "iso_week", "M", "V", "F", "lM", "lF", "month", "rm"}
    if not required.issubset(feat) or feat.duplicated(["region_id", "iso_year", "iso_week"]).any():
        raise ValueError(f"{doc['id']}: invalid public feature schema")
    return feat


def evaluate_case(spec: dict, feat: pd.DataFrame, source_hash: str, dates: dict) -> dict:
    feat = feat.copy()
    paired = feat[feat.M.notna() & feat.V.notna()]
    train, cal, test = (partition(paired, split) for split in ("fit", "calibration", "test"))
    if min(len(train), len(cal), len(test)) < 104 or train.V.sum() < 100:
        raise ValueError(f"{spec['id']}: insufficient paired observations for the declared temporal audit")
    models = {"ensemble": EnsembleModel(), "naive": NaiveFactor(),
              "monthly": MonthlyFactors(), "prd_4.4x": PRDFactor()}
    for name, model in models.items():
        model.fit(train)
        feat[name] = model.predict(feat.fillna({"M": 0, "F": 0, "lM": 0, "lF": 0}))
        feat.loc[feat.M.isna(), name] = np.nan
    nat = national(feat)
    cal_nat = partition(nat, "calibration").dropna(subset=["V", "ensemble"])
    bands = ConformalBands().fit(cal_nat.ensemble.to_numpy(), cal_nat.V.to_numpy(), cal_nat.month.to_numpy())
    lo, hi = bands.bounds(nat.ensemble.fillna(0).to_numpy(), nat.month.to_numpy())
    nat["lo"], nat["hi"] = lo, hi
    test_nat = partition(nat, "test").dropna(subset=["V", "ensemble", "naive"])
    scores = {name: metrics(test_nat, name) for name in models}
    coverage = float(((test_nat.V >= test_nat.lo) & (test_nat.V <= test_nat.hi)).mean())
    by_region = []
    for uid, g in partition(feat, "test").dropna(subset=["V", "ensemble"]).groupby("region_id"):
        by_region.append({"id": uid, "ensemble": metrics(g, "ensemble"), "naive": metrics(g, "naive")})
    rows = []
    for _, r in nat[nat.iso_year >= 2003].iterrows():
        row = {"y": int(r.iso_year), "w": int(r.iso_week)}
        for key, col in (("modis", "M"), ("viirs", "V"), ("model", "ensemble"), ("factor", "naive"),
                         ("monthly", "monthly"), ("fixed", "prd_4.4x"), ("lo", "lo"), ("hi", "hi")):
            value = r.get(col)
            if value is not None and pd.notna(value):
                row[key] = round(float(value), 2)
        rows.append(row)
    improve = 100 * (1 - scores["ensemble"]["mae_week"] / scores["naive"]["mae_week"])
    return {**{k: v for k, v in spec.items() if k not in ("input", "unit")},
            "version": VERSION, "snapshot_sha256": source_hash, "data_through": dates,
            "assistance": "LLM-assisted implementation. NB/LightGBM values are model estimates; "
            "reference observations come from NASA FIRMS, not synthetic data.",
            "splits": SPLITS, "filter": "Confidence >=30% MODIS, nominal/high VIIRS; FIRMS types 2/3 excluded. "
            "No learned static-source filter; residual industrial heat may remain.",
            "evaluation": {"models": scores, "per_region": by_region, "coverage80": round(coverage, 3),
                           "median_width80": round(float((test_nat.hi - test_nat.lo).median()), 2),
                           "improvement_pct": round(improve, 2), "calibration_weeks": len(cal_nat),
                           "status": "model_advantage" if improve > 0 else "baseline_preferred"},
            "weeks": rows}


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--from-packages", action="store_true",
                        help="Refit from checksum-verified public feature CSVs; no raw data or key required")
    args = parser.parse_args()
    output = WEB_DATA / "global"
    output.mkdir(parents=True, exist_ok=True)
    (output / "features").mkdir(exist_ok=True)
    built = datetime.now(UTC).replace(microsecond=0).isoformat()
    catalog = {"built_utc": built, "version": VERSION, "areas": [],
               "protocol": "Fixed 30% NB / 70% five-seed LightGBM; detector-only features. Fit 2013–2018, "
               "calibrate 2019–2021, replay test 2022–2024. Each area is fitted separately. "
               "Test periods were known during development: this is a disjoint temporal audit, "
               "not an untouched final holdout. Sensor-span zero filling cannot establish "
               "daily retrieval completeness.",
               "sources": ["https://www.earthdata.nasa.gov/data/tools/firms",
                           "https://www.earthdata.nasa.gov/data/alerts-outages/"
                           "reminder-new-suomi-npp-observations-cease-november-2-2026"]}
    loaded: dict[Path, pd.DataFrame] = {}
    for spec in CASES:
        if args.from_packages:
            original = json.loads((output / f"{spec['id']}.json").read_text(encoding="utf-8"))
            feat = load_features(output, original)
            source_hash, dates = original["snapshot_sha256"], original["data_through"]
            features = original["features"]
        else:
            path = ROOT / spec["input"]
            if path not in loaded:
                loaded[path] = pd.read_parquet(path)
            det = loaded[path]
            if "unit" in spec:
                det = det[det.unit_id == spec["unit"]]
            feat = portable_features(det)
            source_hash = hashlib.sha256(path.read_bytes()).hexdigest()
            dates = det.groupby("sensor").acq_datetime_utc.max().dt.strftime("%Y-%m-%d").to_dict()
            fixture = output / "features" / f"{spec['id']}.csv.gz"
            feat.to_csv(fixture, index=False, float_format="%.17g", compression={"method": "gzip", "mtime": 0})
            features = {"path": f"features/{spec['id']}.csv.gz", "rows": len(feat),
                        "sha256": hashlib.sha256(fixture.read_bytes()).hexdigest(),
                        "description": "Detector-only region-week features, including VIIRS reference labels"}
        doc = evaluate_case(spec, feat, source_hash, dates)
        doc["features"] = features
        doc["built_utc"] = built
        (output / f"{spec['id']}.json").write_text(json.dumps(doc, ensure_ascii=False, allow_nan=False,
                                                           separators=(",", ":")), encoding="utf-8")
        catalog["areas"].append({k: doc[k] for k in ("id", "name_en", "name_bn", "iso3", "setting", "bbox",
                                                    "data_through", "evaluation")})
        print(spec["id"], doc["evaluation"], flush=True)
    (output / "catalog.json").write_text(json.dumps(catalog, ensure_ascii=False, allow_nan=False,
                                                  separators=(",", ":")), encoding="utf-8")


if __name__ == "__main__":
    main()
