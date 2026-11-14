import json

import pandas as pd

from pipeline.config import WEB_DATA
from pipeline.world_snapshot import country_stats, point_document


def test_global_sampling_preserves_full_counts_and_dates():
    f = pd.DataFrame({"lon": [90.] * 10, "lat": [23.] * 10,
                      "acq_datetime_utc": pd.date_range("2026-11-10", periods=10, freq="12h", tz="UTC")})
    dates = ["2026-11-10", "2026-11-11", "2026-11-12", "2026-11-13", "2026-11-14"]
    doc = point_document(f, dates, cap=3)
    assert doc["total"] == 10 and doc["sampled"]
    assert len(doc["points"]) == 9
    assert country_stats(f, dates, f.acq_datetime_utc.max())["last24h"] == 2
    assert sum(country_stats(f, dates, f.acq_datetime_utc.max())["daily"]) == 10


def test_world_country_totals_reconcile_with_unassigned():
    doc = json.loads((WEB_DATA / "world/summary.json").read_text(encoding="utf-8"))
    assert len(doc["countries"]) > 200
    for sensor, info in doc["sensors"].items():
        assert sum(c["sensors"][sensor]["total"] for c in doc["countries"]) + info["unassigned"] == info["total"]
        assert all(sum(c["sensors"][sensor]["daily"]) == c["sensors"][sensor]["total"] for c in doc["countries"])
