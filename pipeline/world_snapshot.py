"""Latest worldwide FIRMS observations, kept separate from historical reconstruction.

Downloads the public seven-day MODIS, NOAA-20 and NOAA-21 CSV feeds, assigns points
to Natural Earth country/territory polygons, and exports phone-sized area files.
Run with --cached to reproduce using the downloaded snapshots.
"""
from __future__ import annotations

import argparse
import hashlib
import json
from concurrent.futures import ThreadPoolExecutor
from datetime import UTC, datetime

import geopandas as gpd
import numpy as np
import pandas as pd
import requests

from pipeline.config import ROOT, WEB_DATA
from pipeline.ingest import normalise_columns

CACHE = ROOT / "data/raw/world"
COUNTRIES_URL = "https://naciscdn.org/naturalearth/50m/cultural/ne_50m_admin_0_countries.zip"
SOURCES = {
    "modis": "https://firms.modaps.eosdis.nasa.gov/data/active_fire/modis-c6.1/csv/MODIS_C6_1_Global_7d.csv",
    "noaa20": "https://firms.modaps.eosdis.nasa.gov/data/active_fire/noaa-20-viirs-c2/csv/J1_VIIRS_C2_Global_7d.csv",
    "noaa21": "https://firms.modaps.eosdis.nasa.gov/data/active_fire/noaa-21-viirs-c2/csv/J2_VIIRS_C2_Global_7d.csv",
}


def download(url: str, filename: str, cached: bool) -> None:
    path = CACHE / filename
    if cached and path.exists():
        return
    response = requests.get(url, timeout=180)
    response.raise_for_status()
    if len(response.content) < 100:
        raise ValueError(f"Empty world snapshot: {filename}")
    tmp = path.with_suffix(path.suffix + ".tmp")
    tmp.write_bytes(response.content)
    tmp.replace(path)


def country_stats(frame: pd.DataFrame, dates: list[str], latest: pd.Timestamp) -> dict:
    daily = frame.groupby(frame.acq_datetime_utc.dt.strftime("%Y-%m-%d")).size()
    return {"total": len(frame), "last24h": int((frame.acq_datetime_utc > latest - pd.Timedelta(days=1)).sum()),
            "latest_utc": frame.acq_datetime_utc.max().isoformat() if len(frame) else None,
            "daily": [int(daily.get(d, 0)) for d in dates]}


def point_document(frame: pd.DataFrame, dates: list[str], cap: int | None = None) -> dict:
    ordered = frame.sort_values(["acq_datetime_utc", "lat", "lon"])
    total = len(ordered)
    if cap and total > cap:
        ordered = ordered.iloc[np.linspace(0, total - 1, cap, dtype=int)]
    index = {d: i for i, d in enumerate(dates)}
    values = []
    for r in ordered.itertuples():
        values.extend([round(r.lon, 3), round(r.lat, 3), index[r.acq_datetime_utc.strftime("%Y-%m-%d")]])
    return {"stride": 3, "dates": dates, "total": total, "sampled": len(ordered) < total, "points": values}


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--cached", action="store_true")
    args = parser.parse_args()
    CACHE.mkdir(parents=True, exist_ok=True)
    jobs = [(COUNTRIES_URL, "countries.zip"), *[(url, f"{sensor}_7d.csv") for sensor, url in SOURCES.items()]]
    with ThreadPoolExecutor(max_workers=3) as pool:
        list(pool.map(lambda job: download(*job, args.cached), jobs))
    countries = gpd.read_file(CACHE / "countries.zip").to_crs(4326)
    countries["id"] = countries.ADM0_A3.str.lower()
    countries["name"] = countries.NAME_EN.fillna(countries.ADMIN)
    boundaries = countries[["id", "name", "geometry"]].copy()
    output = WEB_DATA / "world"
    output.mkdir(parents=True, exist_ok=True)
    built = datetime.now(UTC).replace(microsecond=0).isoformat()
    summary = {"built_utc": built, "boundary_source": COUNTRIES_URL, "boundary_version": "Natural Earth 1:50m",
               "note": "Raw detections, per sensor; never add sensors to count unique fires. Nominal/high VIIRS "
               "and MODIS confidence >=30 kept. Static heat can remain. Country assignment uses generalized "
               "boundaries; unmatched coastal/offshore points are reported separately. Coverage and fire absence "
               "are not established by these counts.", "sensors": {}, "countries": []}
    by_country: dict[str, dict] = {r.id: {} for r in countries.itertuples()}
    for sensor, url in SOURCES.items():
        path = CACHE / f"{sensor}_7d.csv"
        d = normalise_columns(pd.read_csv(path), sensor_hint=sensor)
        d = d[d.confidence_norm >= (.3 if sensor == "modis" else .5)].copy()
        if d.empty:
            raise ValueError(f"No usable observations in {sensor}")
        latest = d.acq_datetime_utc.max()
        dates = pd.date_range(d.acq_datetime_utc.min().normalize(), latest.normalize(), freq="D")
        dates = dates.strftime("%Y-%m-%d").tolist()
        points = gpd.GeoDataFrame(d, geometry=gpd.points_from_xy(d.lon, d.lat), crs=4326)
        assigned = gpd.sjoin(points, boundaries[["id", "geometry"]], how="left", predicate="intersects")
        assigned = assigned[~assigned.index.duplicated()].drop(columns=["geometry", "index_right"])
        summary["sensors"][sensor] = {"url": url, "sha256": hashlib.sha256(path.read_bytes()).hexdigest(),
                                       "from_utc": d.acq_datetime_utc.min().isoformat(),
                                       "through_utc": latest.isoformat(),
                                       "dates": dates, "total": len(d), "unassigned": int(assigned.id.isna().sum())}
        overview = point_document(d, dates, cap=12000)
        (output / f"overview-{sensor}.json").write_text(json.dumps(overview, separators=(",", ":")))
        grouped = {uid: g for uid, g in assigned.dropna(subset=["id"]).groupby("id")}
        for uid in by_country:
            g = grouped.get(uid, assigned.iloc[:0])
            by_country[uid][sensor] = country_stats(g, dates, latest)
            # The chart and counts use all detections; point rendering is an explicit sample.
            doc = point_document(g, dates, cap=12000)
            (output / f"{uid}-{sensor}.json").write_text(json.dumps(doc, separators=(",", ":")))
        print(sensor, summary["sensors"][sensor], flush=True)
    for r in countries.itertuples():
        summary["countries"].append({"id": r.id, "name": r.name, "focus": [round(r.LABEL_X, 3), round(r.LABEL_Y, 3)],
                                     "sensors": by_country[r.id]})
    summary["countries"].sort(key=lambda c: c["name"])
    simple = boundaries.copy()
    simple["geometry"] = simple.geometry.simplify(.04, preserve_topology=True)
    (output / "countries.geojson").write_text(simple.to_json(drop_id=True), encoding="utf-8")
    (output / "summary.json").write_text(json.dumps(summary, ensure_ascii=False, allow_nan=False,
                                                  separators=(",", ":")), encoding="utf-8")
    print(f"World snapshot: {len(countries)} countries/territories; three separate sensor feeds")


if __name__ == "__main__":
    main()
