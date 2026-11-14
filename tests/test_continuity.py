"""Synthetic handover tests use nonidentity factors, zeros and missing observations."""
import json

import numpy as np
import pandas as pd

from pipeline import export
from pipeline.bridge import reference_series
from pipeline.local import unit_series

BRIDGE = {"snpp_end_utc": "2026-11-02T13:00:00Z",
          "noaa20_to_snpp_monthly": {str(m): 2.0 for m in range(1, 13)},
          "noaa21_to_snpp_monthly": {str(m): 0.5 for m in range(1, 13)}}


def test_reference_handover_outage_zero_and_no_coverage():
    t = pd.DataFrame({"iso_year": [2026] * 6, "iso_week": [43, 43, 44, 45, 46, 47],
                      "V": [10, np.nan, 0, 99, np.nan, np.nan],
                      "J": [2, 0, 8, 2, np.nan, np.nan], "K": [np.nan, 4, 4, 8, 0, np.nan]})
    value, src = reference_series(t, pd.Series([7.] * 6), BRIDGE)
    assert value.tolist() == [10, 1, 0, 4, 0, 7]
    assert src.tolist() == ["observed", "bridged", "observed", "bridged", "bridged", "estimated"]


def test_points_switch_within_year_and_keep_week_sensor(tmp_path, monkeypatch):
    monkeypatch.setattr(export, "WEB_DATA", tmp_path)
    dates = ["2026-10-26", "2026-10-26", "2026-11-02", "2026-11-02"]
    d = pd.DataFrame({"district_id": ["a"] * 4, "sensor": ["snpp", "noaa20"] * 2,
                      "acq_datetime_utc": pd.to_datetime(dates, utc=True), "static_flag": [False] * 4,
                      "keep": [True] * 4, "lon": [90, 91, 92, 93], "lat": [23] * 4})
    export.write_points(d)
    doc = json.loads((tmp_path / "points/2026.json").read_text())
    assert doc["sensor"] == "mixed"
    assert doc["sensor_by_week"] == {"44": "snpp", "45": "noaa20"}
    assert doc["pts"][::4] == [90, 93]


def test_local_successors_include_real_zeros_and_apply_factors():
    d = pd.DataFrame({"union_id": ["a", "b", "a", "a"], "district_id": ["d"] * 4,
                      "sensor": ["noaa20", "noaa20", "snpp", "modis"],
                      "acq_datetime_utc": pd.to_datetime(["2026-11-02"] * 4, utc=True), "keep": [True] * 4})
    estimate = pd.DataFrame({"district_id": ["d"], "iso_year": [2026], "iso_week": [45], "dist_est": [20]})
    result = unit_series(d, "union_id", estimate, BRIDGE).set_index("union_id")
    assert result.value.to_dict() == {"a": 2., "b": 2.}
    assert set(result.src) == {"b"}
