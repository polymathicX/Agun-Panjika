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

VERSION = "portable-rolling-support-v2"
# First fold only. Every target year has its own chronological fit and calibration.
SPLITS = {"fit": [2013, 2020], "calibration": [2021, 2021], "test": [2022, 2024]}
QUALITY_PATH = ROOT / "pipeline/reference_quality.json"
PROTOCOL = ("Annual past-only replay: for year Y, fit 2013..Y-2 and calibrate intervals on Y-1. "
            "30% NB / 70% five-seed LightGBM; above the pooled fitted MODIS maximum, replace the tree "
            "component by its training-fitted factor. NASA long-acquisition-outage weeks have incomplete "
            "VIIRS references. Publish identical eligible-week comparisons and all raw weeks. "
            "Known development replay after disclosed experiments, not an untouched holdout.")
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
    cols = [c for c in ("M", "V", "ensemble", "unguarded", "naive", "monthly", "prd_4.4x") if c in frame]
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


class PortableReconstruction:
    """A direct-count tree cannot extrapolate beyond its pooled fitted support."""

    def fit(self, frame: pd.DataFrame) -> PortableReconstruction:
        self.ensemble = EnsembleModel().fit(frame)
        self.factor = NaiveFactor().fit(frame)
        self.maximum_modis = float(frame.M.max())
        return self

    def outside_support(self, frame: pd.DataFrame) -> np.ndarray:
        return frame.M.to_numpy() > self.maximum_modis

    def predict(self, frame: pd.DataFrame) -> np.ndarray:
        tree = self.ensemble.gbm.predict(frame)
        tree = np.where(self.outside_support(frame), self.factor.predict(frame), tree)
        return .3 * self.ensemble.nb.predict(frame) + .7 * tree


def mark_reference_quality(frame: pd.DataFrame, quality: dict) -> pd.DataFrame:
    excluded = {tuple(pair) for pair in quality['excluded_iso_weeks']}
    out = frame.copy()
    out['V_raw'] = out.V
    out['reference_ok'] = [(int(y), int(w)) not in excluded
                           for y, w in zip(out.iso_year, out.iso_week, strict=True)]
    out.loc[~out.reference_ok, 'V'] = np.nan
    return out


def vintage_rows(frame: pd.DataFrame, year: int) -> tuple[pd.DataFrame, pd.DataFrame]:
    paired = frame[frame.M.notna() & frame.V.notna()]
    return (paired[paired.iso_year.between(2013, year - 2)].copy(),
            paired[paired.iso_year == year - 1].copy())


def predict_frame(frame: pd.DataFrame, models: dict) -> pd.DataFrame:
    out = frame.copy()
    clean = out.fillna({'M': 0, 'F': 0, 'lM': 0, 'lF': 0})
    for name, model in models.items():
        out[name] = model.predict(clean)
        out.loc[out.M.isna(), name] = np.nan
    # Observations stay intact in exports, including incomplete reference weeks.
    out['V'] = out.V_raw
    return out


def evaluate_case(spec: dict, feat: pd.DataFrame, source_hash: str, dates: dict) -> dict:
    quality_bytes = QUALITY_PATH.read_bytes()
    quality = json.loads(quality_bytes)
    marked = mark_reference_quality(feat, quality)
    excluded = {tuple(pair) for pair in quality['excluded_iso_weeks']}
    tables, region_tables, folds = [], [], {}
    for year in range(2022, 2025):
        train, calibration = vintage_rows(marked, year)
        if len(train) < 104 or train.V.sum() < 100:
            raise ValueError(f"{spec['id']}: insufficient fit data for {year}")
        model = PortableReconstruction().fit(train)
        models = {'ensemble': model, 'unguarded': model.ensemble, 'naive': model.factor,
                  'monthly': MonthlyFactors().fit(train), 'prd_4.4x': PRDFactor()}
        held = marked[(marked.iso_year == year) & marked.M.notna() & marked.V_raw.notna()]
        prediction = predict_frame(held, models)
        nat = national(prediction)
        cal_nat = national(predict_frame(calibration, models)).dropna(subset=['V', 'ensemble'])
        if len(cal_nat) < 40:
            raise ValueError(f"{spec['id']}: insufficient independent calibration weeks for {year}")
        bands = ConformalBands().fit(cal_nat.ensemble.to_numpy(), cal_nat.V.to_numpy(), cal_nat.month.to_numpy())
        nat['lo'], nat['hi'] = bands.bounds(nat.ensemble.to_numpy(), nat.month.to_numpy())
        nat['reference_ok'] = [(int(y), int(w)) not in excluded
                               for y, w in zip(nat.iso_year, nat.iso_week, strict=True)]
        tables.append(nat)
        region_tables.append(prediction)
        folds[str(year)] = {'fit': [2013, year - 2], 'calibration': [year - 1, year - 1],
                            'calibration_weeks': len(cal_nat), 'raw_test_weeks': len(nat),
                            'eligible_test_weeks': int(nat.reference_ok.sum()),
                            'maximum_modis': model.maximum_modis,
                            'guarded_region_weeks': int(model.outside_support(held).sum())}
    # The latest vintage supplies earlier reconstructions; test years retain their causal vintages.
    history = national(predict_frame(marked, models))
    history['lo'], history['hi'] = bands.bounds(history.ensemble.fillna(0).to_numpy(), history.month.to_numpy())
    replay = pd.concat(tables, ignore_index=True)
    history = pd.concat([history[~history.iso_year.between(2022, 2024)], replay], ignore_index=True)
    history = history.sort_values(['iso_year', 'iso_week'])
    eligible = replay[replay.reference_ok]
    def score(rows: pd.DataFrame) -> dict:
        return {name: metrics(rows, name) for name in models}

    def coverage(rows: pd.DataFrame) -> float:
        return round(float(((rows.V >= rows.lo) & (rows.V <= rows.hi)).mean()), 3)

    scores, raw_scores = score(eligible), score(replay)
    by_region = []
    regional = pd.concat(region_tables, ignore_index=True)
    for uid, rows in regional[regional.reference_ok].groupby('region_id'):
        by_region.append({'id': uid, 'ensemble': metrics(rows, 'ensemble'), 'naive': metrics(rows, 'naive')})
    rows = []
    for _, row in history[history.iso_year >= 2003].iterrows():
        item = {'y': int(row.iso_year), 'w': int(row.iso_week)}
        for key, column in (('modis', 'M'), ('viirs', 'V'), ('model', 'ensemble'), ('unguarded', 'unguarded'),
                            ('factor', 'naive'), ('monthly', 'monthly'), ('fixed', 'prd_4.4x'),
                            ('lo', 'lo'), ('hi', 'hi')):
            value = row.get(column)
            if pd.notna(value):
                item[key] = round(float(value), 2)
        if 'viirs' in item:
            item['reference_ok'] = (item['y'], item['w']) not in excluded
        rows.append(item)
    improvement = 100 * (1 - scores['ensemble']['mae_week'] / scores['naive']['mae_week'])
    original = json.loads((WEB_DATA / 'global/v1' / f"{spec['id']}.json").read_text(encoding='utf-8'))
    previous_mae = original['evaluation']['models']['ensemble']['mae_week']
    return {**{k: v for k, v in spec.items() if k not in ('input', 'unit')},
            'version': VERSION, 'snapshot_sha256': source_hash, 'data_through': dates,
            'assistance': 'LLM-assisted implementation. Model estimates are distinct from NASA observations.',
            'splits': SPLITS, 'split_note': 'First fold only; folds are authoritative for each target year.',
            'folds': folds, 'historical_vintage': {'target': 2024, **folds['2024']},
            'protocol': PROTOCOL, 'quality_manifest_sha256': hashlib.sha256(quality_bytes).hexdigest(),
            'filter': 'Confidence >=30% MODIS, nominal/high VIIRS; FIRMS types 2/3 excluded. '
            'No learned static-source filter. Raw observations retained; documented long acquisition '
            'outage references excluded identically from fitting, calibration and comparable scoring.',
            'evaluation': {'models': scores, 'all_weeks': raw_scores, 'per_region': by_region,
                           'coverage80': coverage(eligible), 'coverage80_all_weeks': coverage(replay),
                           'median_width80': round(float((eligible.hi - eligible.lo).median()), 2),
                           'improvement_pct': round(improvement, 2), 'calibration_weeks': len(cal_nat),
                           'status': 'model_advantage' if improvement > 0 else 'baseline_preferred',
                           'excluded_test_weeks': [[int(r.iso_year), int(r.iso_week)]
                                                   for _, r in replay[~replay.reference_ok].iterrows()],
                           'total_error_scope': 'Mean error of matched eligible-week totals within each test year',
                           'previous_release_mae': previous_mae,
                           'raw_change_from_previous_pct': round(100 * (1 - raw_scores['ensemble']['mae_week']
                                                                      / previous_mae), 2),
                           'per_year': {str(y): {'eligible': score(g[g.reference_ok]), 'all_weeks': score(g)}
                                        for y, g in replay.groupby('iso_year')}}, 'weeks': rows}


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--from-packages", action="store_true",
                        help="Refit from checksum-verified public feature CSVs; no raw data or key required")
    args = parser.parse_args()
    output = WEB_DATA / "global"
    output.mkdir(parents=True, exist_ok=True)
    (output / "features").mkdir(exist_ok=True)
    built = datetime.now(UTC).replace(microsecond=0).isoformat()
    (output / 'reference_quality.json').write_bytes(QUALITY_PATH.read_bytes())
    catalog = {"built_utc": built, "version": VERSION, "areas": [], "protocol": PROTOCOL,
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
