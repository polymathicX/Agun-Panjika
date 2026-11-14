from datetime import date

import pandas as pd
import pytest

from pipeline import ingest


def test_refresh_stops_at_sensor_end_instead_of_requesting_retired_days(tmp_path, monkeypatch):
    monkeypatch.setattr(ingest, "RAW", tmp_path)
    requests = []

    def fetch(source, **kwargs):
        requests.append((source, kwargs["day"], kwargs["days"]))
        return pd.DataFrame()

    monkeypatch.setattr(ingest, "fetch_api", fetch)
    avail = {"VIIRS_SNPP_NRT": (date(2026, 8, 1), date(2026, 11, 2))}
    ingest.fetch_api_range("snpp", date(2026, 11, 1), date(2026, 11, 14), avail)
    assert requests == [("VIIRS_SNPP_NRT", date(2026, 11, 1), 2)]


def test_failed_chunk_cannot_silently_become_zero_detections(tmp_path, monkeypatch):
    monkeypatch.setattr(ingest, "RAW", tmp_path)
    monkeypatch.setattr(ingest, "fetch_api", lambda *args, **kwargs: None)
    avail = {"MODIS_NRT": (date(2026, 9, 1), date(2026, 11, 14))}
    with pytest.raises(RuntimeError, match="Incomplete FIRMS retrieval"):
        ingest.fetch_api_range("modis", date(2026, 11, 10), date(2026, 11, 14), avail)
    assert not list((tmp_path / "api").glob("*.csv"))
