# Global evaluation and model card

**15 November 2026 · portable-rolling-support-v2**

The worldwide viewer shows recent observations across 242 countries/territories. Historical reconstruction is evaluated in four South Asian areas. This model card describes that historical workflow, not worldwide model accuracy or emergency forecasting.

## Reconstruction method

The detector-only reconstruction combines a negative-binomial regression with a five-seed LightGBM model. If MODIS exceeds the maximum count in the pooled fitting data, the tree contribution uses a fitted multiplicative factor instead. The rule is identical in all areas. Each test year has a model fitted only to older labels, with an independent preceding year for interval calibration.

NASA acquisition outages are treated as a source-quality issue. For example, the 2–6 November 2024 S-NPP GPS outage interrupts the reference during part of Punjab's fire season. The published quality manifest separates acquisition loss from production delay and retains backfilled observations.

## Chronological protocol

| Target year | Point-model fit | Independent interval calibration | Eligible calibration weeks | Raw / comparable test weeks |
| --- | --- | --- | ---: | ---: |
| 2022 | 2013–2020 | 2021 | 51 | 52 / 49 |
| 2023 | 2013–2021 | 2022 | 49 | 52 / 50 |
| 2024 | 2013–2022 | 2023 | 50 | 52 / 43 |

The model remains 30% negative-binomial regression plus 70% five-seed LightGBM, with the strict support guard above. Detector-only features describe MODIS count, FRP, observation mix, geometry, season and neighbouring weeks. Weather is excluded. Features are built within each year. Following-week MODIS information is appropriate to retrospective reconstruction, not an issue-time forecast.

Each case is fitted locally. Earlier test-year labels intentionally become available to later vintages. This is **annual walk-forward evaluation**, rather than a single fixed fit for the entire period. Every target year keeps point fitting and interval calibration earlier than that year's labels. The years were already known during development and several alternatives were explored. This is a known historical replay, **not an untouched final holdout or unseen-country transfer**.

Pre-2012 historical reconstruction uses the latest evaluated vintage: fit 2013–2022, calibrate 2023. Test-year chart rows use their own chronological vintages. Moving the switch slider joins precomputed values; it does not retrain a model in the browser. The workflow scores do not establish nominal interval coverage decades before the calibration period.

## Current-method comparison: all 156 reference weeks

Weekly MAE is the mean absolute difference from raw S-NPP counts. Lower is better. Every method is scored on the same 156 weeks, including incomplete references; the quality-comparable table below gives a separate view.

| Area | Reconstruction | Fitted factor | Monthly factors |
| --- | ---: | ---: | ---: |
| Bangladesh | 46.926 | 58.316 | 49.839 |
| Nepal | 115.232 | 158.516 | 131.390 |
| Chin, Myanmar | 88.530 | 97.283 | 75.525 |
| Punjab & Haryana, India | 246.265 | 262.017 | 291.339 |

The reconstruction has lower weekly MAE than the fitted single factor in these four cases. Monthly factors have lower error in Chin. No method is claimed to win every area or metric. Methods were not switched per area after inspecting test results. The research record preserves the development experiments separately from this final-product comparison.

The fixed 4.4× reference also remains visible. Its PRD provenance uses a 2024 ratio, so it is a historical comparison, not an independently preselected model candidate. All baselines, the unguarded annual workflow and per-year/regional results are included in the packages.

## Comparable references: the same 142 weeks for every method

The [source-linked quality manifest](../pipeline/reference_quality.json) preserves 172 NASA-listed intervals in the 2013–2024 study scope. A fixed rule flags every ISO week overlapping a documented acquisition outage lasting at least 24 hours. Nine long intervals affect 14 test weeks and one earlier calibration week. The same mask applies to every area, model, fit, calibration and comparable score. Raw labels are never overwritten in the public data.

| Area | Reconstruction | Fitted factor | Monthly factors | Measured 80% coverage |
| --- | ---: | ---: | ---: | ---: |
| Bangladesh | 51.201 | 63.785 | 54.523 | 78.2% |
| Nepal | 125.792 | 173.297 | 143.696 | 79.6% |
| Chin, Myanmar | 97.198 | 106.860 | 82.957 | 74.6% |
| Punjab & Haryana, India | 209.497 | 237.311 | 260.711 | 82.4% |

This quality comparison is a correction to reference comparability, **not itself an accuracy gain**. Removing quiet incomplete weeks can raise MAE, as the tables show. Raw counts, all 156-week results, every omitted week and the [development experiment archive](../web/public/data/global/v1/) remain inspectable. Calendar and reference-line gaps mark incomplete weeks; CSV retains the raw value with its quality flag.

The total-count metric groups each year's **identical included weeks**. A total over eligible weeks is not a complete annual total. Every baseline is evaluated on the same set. The 80% intervals have only 49–51 calibration residual weeks per vintage; coverage is empirical, temporally dependent and not guaranteed. It is not tuned using target-year labels.

## Source and coverage limits

Confidence thresholds are MODIS ≥30% and nominal/high VIIRS; FIRMS types 2/3 are excluded. No learned static-cell filter is used in these portable cases. Industrial heat can remain. Sensor-span zero filling does not prove cloud-free observation, daily retrieval completeness or absence of fire. The long-outage rule does not certify complete coverage: shorter granule gaps and cloud/overpass differences still matter.

The older Bangladesh weather-assisted LOYO benchmark is separate. Its independence, filtering and forecast concerns remain in the [original scientific audit](SCIENTIFIC_REVIEW.md). Its scores are not substituted for this detector-only workflow.

## Reproduce without a NASA key

```powershell
python -m pip install -e ".[dev]"
python -m pipeline.global_cases --from-packages
python -m pytest -q tests/test_global_cases.py tests/test_continuity.py
```

The command verifies public feature CSV checksums, reads the versioned NASA quality manifest, refits all annual vintages and baselines, calibrates their bands and exports the complete comparisons. It reproduces the research's final workflow results in this environment. Library/platform versions may cause numerical differences. This is not an independent audit of raw-to-feature preprocessing. To rebuild features from downloaded country/neighbour snapshots, run without `--from-packages`.

Each case records raw-input and feature hashes, source dates, vintage ranges, guard usage and the quality-manifest checksum. The [implementation](../pipeline/global_cases.py), [packages](../web/public/data/global/), [research record](MODEL_OPTIMIZATION_RESEARCH.md) and [verification](VERIFICATION.md) expose the details. Fresh locked evaluation, independent source labels, practitioner testing and prospective forecast evidence remain necessary.

Primary sources: [NASA acquisition outage table](https://modaps.modaps.eosdis.nasa.gov/services/production/outages_suomi_npp.html), [FIRMS outage notices](https://firms2.modaps.eosdis.nasa.gov/content/notifications/firms/outages.html), [NASA FIRMS](https://www.earthdata.nasa.gov/data/tools/firms). No NASA endorsement is implied.
