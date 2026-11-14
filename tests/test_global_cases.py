import hashlib
import json
from datetime import datetime, timedelta
from types import SimpleNamespace

import numpy as np
import pandas as pd
import pytest

from pipeline.config import ROOT
from pipeline.global_cases import (
    QUALITY_PATH,
    SPLITS,
    PortableReconstruction,
    load_features,
    mark_reference_quality,
    national,
    partition,
    vintage_rows,
)


def test_temporal_splits_are_disjoint_and_exact():
    frame = pd.DataFrame({"iso_year": range(2010, 2027)})
    groups = [set(partition(frame, key).iso_year) for key in SPLITS]
    assert groups == [set(range(2013, 2021)), {2021}, set(range(2022, 2025))]
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
    assert len(rows) == 156
    for included, scores in ((rows, doc['evaluation']['all_weeks']),
                             ([r for r in rows if r['reference_ok']], doc['evaluation']['models'])):
        mae = sum(abs(r['viirs'] - r['model']) for r in included) / len(included)
        assert abs(mae - scores['ensemble']['mae_week']) < .02
        assert len(included) == scores['ensemble']['weeks']
    old = json.loads((ROOT / f'web/public/data/global/v1/{area}.json').read_text(encoding='utf-8'))
    old_values = {(r['y'], r['w']): r['viirs'] for r in old['weeks'] if 'viirs' in r}
    assert doc['evaluation']['development_reference_mae'] == old['evaluation']['models']['ensemble']['mae_week']
    assert 'previous_release_mae' not in doc['evaluation']
    assert all(r['viirs'] == old_values[r['y'], r['w']] for r in rows)
    assert len(doc["snapshot_sha256"]) == 64
    assert all("fixed" in r and r["lo"] <= r["model"] <= r["hi"] for r in rows)
    assert doc["splits"] == SPLITS


@pytest.mark.parametrize("area", ["bangladesh", "nepal", "chin", "punjab_haryana"])
def test_public_features_are_complete_and_checksum_verified(area):
    output = ROOT / "web/public/data/global"
    doc = json.loads((output / f"{area}.json").read_text(encoding="utf-8"))
    feat = load_features(output, doc)
    assert len(feat) == doc["features"]["rows"]
    assert not {"cloud", "precip", "rh", "fwi", "dc"}.intersection(feat)
    paired = feat[feat.M.notna() & feat.V.notna()]
    for split, minimum in [('fit', 416), ('calibration', 52), ('test', 156)]:
        assert len(partition(national(paired), split)) >= minimum
    with pytest.raises(ValueError, match="checksum mismatch"):
        load_features(output, {**doc, "features": {**doc["features"], "sha256": "0" * 64}})


def test_tree_extrapolation_guard_preserves_nb_and_uses_strict_pooled_support():
    model = PortableReconstruction()
    model.maximum_modis = 10
    model.factor = SimpleNamespace(predict=lambda frame: frame.M.to_numpy() * 4)
    model.ensemble = SimpleNamespace(
        gbm=SimpleNamespace(predict=lambda frame: np.full(len(frame), 2.)),
        nb=SimpleNamespace(predict=lambda frame: np.full(len(frame), 6.)),
    )
    frame = pd.DataFrame({'M': [0., 10., 11.]})
    assert model.outside_support(frame).tolist() == [False, False, True]
    np.testing.assert_allclose(model.predict(frame), [.3*6+.7*2, .3*6+.7*2, .3*6+.7*44])


def test_reference_outage_is_not_a_true_zero_and_never_changes_raw_observations():
    quality = json.loads(QUALITY_PATH.read_text(encoding='utf-8'))
    frame = pd.DataFrame({'iso_year': [2024, 2024], 'iso_week': [45, 46], 'M': [1, 1], 'V': [0, 0]})
    flagged = mark_reference_quality(frame, quality)
    assert flagged.V_raw.tolist() == [0, 0]
    assert pd.isna(flagged.V.iloc[0]) and flagged.V.iloc[1] == 0
    assert frame.V.tolist() == [0, 0]


def test_every_vintage_uses_only_older_quality_eligible_labels():
    frame = pd.DataFrame({'iso_year': range(2013, 2025), 'iso_week': 31, 'M': 1., 'V': 2.})
    marked = mark_reference_quality(frame, json.loads(QUALITY_PATH.read_text(encoding='utf-8')))
    for year in range(2022, 2025):
        fit, cal = vintage_rows(marked, year)
        assert fit.iso_year.max() <= year - 2
        assert set(cal.iso_year) <= {year - 1}
        assert fit.reference_ok.all() and cal.reference_ok.all()
        assert not set(fit.index).intersection(cal.index)


def test_source_quality_rule_is_global_and_published_consistently():
    quality = json.loads(QUALITY_PATH.read_text(encoding='utf-8'))
    assert len(quality['intervals']) == 172
    assert len([row for row in quality['intervals'] if row['used_by_rule']]) == 9
    assert all(row['used_by_rule'] == (row['hours'] >= 24) for row in quality['intervals'])
    derived = set()
    for interval in quality['intervals']:
        if not interval['used_by_rule']:
            continue
        day = datetime.fromisoformat(interval['start_utc']).date()
        last = (datetime.fromisoformat(interval['end_utc']) - timedelta(microseconds=1)).date()
        while day <= last:
            derived.add(tuple(day.isocalendar()[:2]))
            day += timedelta(days=1)
    assert derived == set(map(tuple, quality['excluded_iso_weeks']))
    assert QUALITY_PATH.read_bytes() == (ROOT / 'web/public/data/global/reference_quality.json').read_bytes()
    manifest_bytes = QUALITY_PATH.read_bytes()
    assert b'\r\n' not in manifest_bytes
    manifest_hash = hashlib.sha256(manifest_bytes).hexdigest()
    expected = {tuple(pair) for pair in quality['excluded_iso_weeks'] if 2022 <= pair[0] <= 2024}
    assert len(expected) == 14
    for name in ['bangladesh', 'nepal', 'chin', 'punjab_haryana']:
        doc = json.loads((ROOT / f'web/public/data/global/{name}.json').read_text(encoding='utf-8'))
        assert doc['quality_manifest_sha256'] == manifest_hash
        assert set(map(tuple, doc['evaluation']['excluded_test_weeks'])) == expected
        assert doc['historical_vintage']['fit'] == [2013, 2022]
        assert [doc['folds'][str(y)]['calibration_weeks'] for y in (2022, 2023, 2024)] == [51, 49, 50]
