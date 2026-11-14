import json

import pandas as pd
import pytest

from pipeline.config import ROOT
from pipeline.global_cases import SPLITS, national, partition


def test_temporal_splits_are_disjoint_and_exact():
    frame = pd.DataFrame({"iso_year": range(2010, 2027)})
    groups = [set(partition(frame, key).iso_year) for key in SPLITS]
    assert groups == [set(range(2013, 2019)), set(range(2019, 2022)), set(range(2022, 2025))]
    assert not (groups[0] & groups[1] or groups[1] & groups[2] or groups[0] & groups[2])


def test_national_keeps_missing_sensor_distinct_from_zero():
    f = pd.DataFrame({"iso_year": [2024] * 4, "iso_week": [1, 1, 2, 2],
                      "M": [0, 0, None, None], "V": [None, None, 0, 0]})
    n = national(f)
    assert n.M.iloc[0] == 0 and pd.isna(n.M.iloc[1])
    assert pd.isna(n.V.iloc[0]) and n.V.iloc[1] == 0


@pytest.mark.parametrize("area", ["bangladesh", "nepal", "chin", "punjab_haryana"])
def test_published_case_reproduces_its_test_metrics(area):
    doc = json.loads((ROOT / f"web/public/data/global/{area}.json").read_text(encoding="utf-8"))
    rows = [r for r in doc["weeks"] if 2022 <= r["y"] <= 2024 and "viirs" in r and "model" in r]
    mae = sum(abs(r["viirs"] - r["model"]) for r in rows) / len(rows)
    assert len(rows) == 156
    assert abs(mae - doc["evaluation"]["models"]["ensemble"]["mae_week"]) < .02
    assert len(doc["snapshot_sha256"]) == 64
    assert all("fixed" in r and r["lo"] <= r["model"] <= r["hi"] for r in rows)
    assert doc["splits"] == SPLITS
