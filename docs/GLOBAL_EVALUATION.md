# Global evaluation and model card

Release: 14 November 2026. The worldwide observation viewer and the historical reconstruction experiments answer different questions. The viewer shows recent NASA measurements across 242 countries and territories. The experiments test whether an earlier fire record can be put on the VIIRS S-NPP scale in four named areas.

## Reproduce the experiments

```powershell
python -m pip install -e ".[dev]"
python -m pipeline.global_cases --from-packages
python -m pytest -q tests/test_global_cases.py tests/test_continuity.py
```

The no-key command refits models, calibration and scoring from the [public aggregated feature CSVs](../web/public/data/global/features/). Each area JSON records the feature-file SHA-256, row count and raw input SHA-256. Checksums are verified before refitting. The release environment reproduced every published evaluation exactly; library/platform versions may introduce numerical differences.

To independently rebuild features from local downloaded FIRMS snapshots, run `python -m pipeline.global_cases` without the flag. Bangladesh and Nepal use their country-pipeline detections; Chin and Punjab–Haryana use archived neighbour inputs. Refit from public features does **not** independently validate raw-to-feature preprocessing. The browser runs from committed exports without credentials.

## Protocol

The model is fixed before this replay: 30% negative-binomial regression and 70% five-seed LightGBM Poisson regression. Each area is fitted separately. Inputs describe MODIS counts, FRP, observation mix, geometry, season and neighbouring weeks. Weather features are excluded so all four cases use the same portable detector-only method. Neighbouring-week features are constructed within each year. This is retrospective reconstruction, not a forecast available at the start of a week.

| Partition | Years | Use |
| --- | --- | --- |
| Fit | 2013–2018 | Fit the ensemble, single-factor and monthly-factor baselines |
| Calibration | 2019–2021 | Calibrate national weekly 80% intervals; 157 weeks |
| Test | 2022–2024 | Evaluate frozen predictions; 156 weeks per area |

VIIRS nominal/high detections and MODIS confidence ≥30% are retained; FIRMS types 2/3 are excluded. The learned Bangladesh industrial-cell filter is **not** used in these experiments, avoiding its use of future test-period detections. Residual industrial heat may remain. Aggregation fills zeros inside each sensor's observed span. This does not establish cloud-free observation or daily retrieval completeness.

Fit labels and interval-calibration labels never include the test period. Nevertheless, these years were already available during project development. These are disjoint temporal replay experiments, **not an untouched final holdout**, a spatial transfer to unseen countries, or prospective deployment evidence. Each country's model has its own local training data.

## Results

Weekly MAE is the mean absolute difference from observed S-NPP detection counts. The annual metric is the mean absolute percentage error of the three yearly totals. Lower values are better. Absolute MAE should not be ranked between differently sized areas.

| Area | Ensemble weekly MAE | Fitted-factor MAE | Change in weekly error | Measured coverage of 80% interval |
| --- | ---: | ---: | ---: | ---: |
| Bangladesh | 45.970 | 61.571 | 25.34% lower | 81.4% |
| Nepal | 113.001 | 158.019 | 28.49% lower | 75.6% |
| Chin, Myanmar | 136.414 | 101.030 | 35.02% higher | 73.7% |
| Punjab & Haryana, India | 313.525 | 271.623 | 15.43% higher | 76.3% |

All fixed 4.4×, fitted single-factor and monthly-factor results, annual errors and regional failures are published in the area JSON and in the application. Nepal's lower weekly error does not imply better annual totals: its fitted single factor has lower annual-total error. We retain that result.

The application withholds reconstructed pre-VIIRS calendar rows for Chin and Punjab–Haryana because this model lost to a fitted factor there. Their observed calendars and experiment results remain inspectable. This is a comparison of the fixed ensemble with the fitted single factor; it is not an automatic claim that the ensemble beats every alternative. Observed calendar colors are scaled within each area, not across countries.

## Sensor-switch experiment

Choose a test year and a switch week. Before the switch, the corrected line uses the frozen model and the factor line uses the training-fitted single factor. After it, both use observed VIIRS. The uncorrected line joins raw MODIS to VIIRS. Reveal the withheld reference to inspect the reconstruction, calibrated intervals and error. Changing the slider does not retrain the model. Errors displayed beside the slider refer only to its hidden part of the selected year; the evidence brief reports the complete test period.

## Continuity and missing data

Main, local and neighbouring series now share the same monthly successor-factor and handover/outage selection functions. A real zero participates in the successor average; a missing sensor does not. Map points select their source by ISO week, including within-year handover. Bridged bounds survive the regional JSON export. Synthetic tests exercise nonidentity factors, zeros, missing sources and the switch week.

Requested FIRMS API chunks fail explicitly when retrieval fails. Requests stop at each source's declared availability, including S-NPP's retirement. This prevents silently treating a failed requested chunk as zero, but does not repair all historical coverage assumptions or supply per-pixel cloud masks. Bridge residual bands remain an internal calibration and are not a coverage guarantee.

## Remaining scientific work

A domain reviewer should review area scale and thresholds; a new locked evaluation period should test the method after choices are fixed; industrial-source filtering needs fresh blind labels; forecasts need archived issue-time weather and independently calibrated rolling evaluation. The old Bangladesh leave-one-year-out benchmark is a separate weather-assisted model and evaluation. Do not substitute its numbers for the portable replay results above.

Sources: [NASA FIRMS](https://www.earthdata.nasa.gov/data/tools/firms), [experiment implementation](../pipeline/global_cases.py), [published packages](../web/public/data/global/catalog.json), [continuity implementation](../pipeline/bridge.py), [original source audit](SCIENTIFIC_REVIEW.md).
