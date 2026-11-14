# Portable reconstruction optimization research

Date: 15 November 2026 (Asia/Dhaka). Scope: checksum-verified public region-week fixtures for Bangladesh, Nepal, Chin and Punjab-Haryana. Application source and public datasets were not changed by this research. Experiments and machine-readable outputs are ignored under `data/processed/`.

## Outcome

The final source-motivated repair and annual retraining produce real reductions in the known historical replay: Chin weekly MAE falls from 136.414 to 88.530 (35.10%), and Punjab-Haryana from 313.525 to 246.265 (21.45%), using every original test week. These are changed-prediction gains, not gains obtained by deleting difficult weeks.

The results are mixed. Chin still loses to the contemporaneous monthly-factor baseline (75.525); the guard worsens Bangladesh; Nepal's rolling result is slightly worse than its original frozen result. No per-area method was selected after inspecting test scores. Independently documented NASA acquisition outages reveal incomplete S-NPP reference weeks; a globally frozen quality rule provides a matched 142-week comparison alongside all 156 raw weeks, without overwriting source observations. Quality filtering is a reference-comparability correction and is not itself advertised as better predictions.

The first two broad candidate protocols failed to establish a convincing replacement and are preserved below. The later strict-support intervention and final annual-update protocol were explicitly requested after those failures, frozen before their own replay scoring, and disclosed as development on already-known historical years. A new locked evaluation period is still needed for an independent improved-method claim.

## Source diagnosis

The existing portable audit fits 30% negative-binomial regression plus 70% five-seed direct-count LightGBM on 2013-2018, calibrates 2019-2021 and evaluates 2022-2024. It uses local training for each case and detector-only features, not spatial transfer to an unseen country. Source: [`evaluate_case`](../pipeline/global_cases.py#L90), [model construction](../pipeline/harmonise.py#L268), [published original model card](GLOBAL_EVALUATION.md).

Chin has only 313 fitted region-weeks and strongly seasonal counts: median MODIS weekly count is zero. The 2023-W15 MODIS count is 3,148 versus maximum 1,583 in fitting; S-NPP reference is 18,059 versus fitted reference maximum 7,101. The old GBM predicts 6,595.43, NB 14,795.78 and ensemble 9,055.53. This one error contributes about 42.3% of the full three-year absolute error. The 2023 replay MAE is 232.622, versus 45.239 in 2024. This is a peak extrapolation failure in addition to mismatched observation ratios in particular weeks.

Punjab-Haryana is a different failure: the test MODIS peak is below fitting peaks, but the observation relationship changes. Fitted November total V/M is 5.40, versus 3.65 in the replay. Annual V/M declines to about 3.76 in 2024, while fitting-year ratios are approximately 4.30-5.09. At 2024-W45, MODIS is 1,096, observed S-NPP 1,654 and the old ensemble predicts 6,345.62. The old 2024 predicted total is 41,330.52 versus observed 30,436. Source attribution to agricultural practices, sensor timing, cloud, outages or source completeness was not established; these require acquisition-level investigation rather than a causal story inferred from count ratios.

Raw-to-feature preprocessing remains a separate uncertainty. The portable pipeline zero-fills within a sensor span; the fixture alone cannot establish valid retrieval coverage on every day. Fixed confidence/type filtering also does not eliminate all industrial heat. Source implementation: [`portable_features`](../pipeline/global_cases.py#L45), [`to_district_week`](../pipeline/aggregate.py#L33).

A synthetic fixed-composition extrapolation probe of the highest fitted week confirms structural tree saturation. In Chin, doubling all MODIS count/FRP-related inputs changes GBM 6,470 to 6,464 and ensemble 6,950 to 9,186, while the selected linear-count alternative doubles 6,734 to 13,468. Quadrupling yields GBM 6,197 and linear 26,937. These are structural probes, not observed ground truth or an accuracy score. The better scaling property alone did not ensure lower replay error.

## Candidate families

All preprocessing and fitting were performed within the declared training partition. No extra dependencies were added.

- Existing single-factor, monthly-factor, fixed ensemble baselines.
- Regularized Poisson rate models: exposure proxy `e = M + 1`, target `V/e`, sample weight `e`, predicted count `e * predicted_rate`. Six seasonal sine/cosine terms and region indicators; alpha fixed at 0.1 or 1. One richer alpha-1 variant adds MODIS FRP/observation shares/geometry. Median filling and scaling fitted on training rows only. This is a count-scaling design, not a claim that MODIS counts are literal observation exposure.
- Small rate LightGBM: same target/weight/scale, calendar, region and MODIS composition features, 200 trees, learning rate .03, seven leaves, minimum 20 rows, lambda L2 10, seed 2026. Objectives Poisson or L1; counts scale outside tree-supported magnitude ranges.
- Robust monthly factors: the M-weighted median of `V/M` among M>0 weeks, with a fixed pseudo-observation of weight 50 at the global weighted median in each month. This directly targets absolute count error; zeros get zero prediction. This is an interpretable heuristic and can miss VIIRS-only detections.
- Regularized median count regression: counts M, F, Aqua, night, low-FRP and high-confidence counts; M times first/second seasonal sine/cosine terms; previous/next MODIS counts and region indicators. Training standard deviations scale columns. `QuantileRegressor(quantile=.5, alpha=.01 or .1, solver='highs')`; predictions clipped at zero.
- Second protocol adds one global robust rate, the `(M+1)`-weighted median of `V/(M+1)`.

Rate fitting follows the exposure-weighted formulation demonstrated in the [official scikit-learn Poisson example](https://scikit-learn.org/stable/auto_examples/linear_model/plot_poisson_regression_non_normal_loss.html). The [PoissonRegressor API](https://scikit-learn.org/stable/modules/generated/sklearn.linear_model.PoissonRegressor.html) documents its log link and L2 penalty. [LightGBM parameters](https://lightgbm.readthedocs.io/en/stable/Parameters.html) document Poisson and absolute-loss objectives. These sources justify the implementations; they do not establish performance on these fire datasets.

## First experiment: retain as a rejected result

Development folds: fit 2013-2014, validate 2015-2016; fit 2013-2016, validate 2017-2018. Select minimum average national weekly MAE across the two folds. Refit on 2013-2018; independently calibrate intervals on 2019-2021; evaluate the selected method once on the known 2022-2024 replay.

Twelve bounded candidates were considered. Two linear-count candidates were added after examining only development results, before final replay evaluation. The fixed 4.4 factor appeared in this development set, but was selected for no case. Its code provenance references the 2024 PRD ratio; this makes it unsuitable as an independently selected model. It was excluded from the second protocol's candidate set and retained only as a labeled historical reference.

Frozen first selection, normalized JSON SHA-256: `90ca3ce54b10202515b22ac384943a25939b61734adce043bf1d9a295a02be04`.

Development MAE (country columns are fixed, absolute values should not be ranked across area scales):

| Candidate | Bangladesh | Nepal | Chin | Punjab-Haryana |
| --- | ---: | ---: | ---: | ---: |
| naive | 44.439 | 132.107 | 81.389 | 388.562 |
| monthly | 33.666 | 134.145 | 81.767 | 388.710 |
| fixed4.4 | 45.302 | 204.424 | 60.563 | 387.590 |
| ensemble | 30.140 | 108.780 | 65.291 | 387.620 |
| offset0.1 | 29.845 | 141.107 | 81.398 | 369.966 |
| offset1 | 33.126 | 135.988 | 83.669 | 372.296 |
| offset_rich1 | 31.645 | 157.013 | 71.104 | 372.435 |
| ratio_poisson | 28.050 | 133.350 | 76.538 | 363.654 |
| ratio_l1 | 30.553 | 102.430 | 67.332 | 346.902 |
| robust_monthly | 32.363 | 113.899 | 80.536 | 353.113 |
| linear_l1_0.01 | 32.392 | 113.462 | 60.840 | 378.769 |
| linear_l1_0.1 | 61.341 | 138.093 | 57.556 | 445.137 |

Selected-method replay, not the best replay candidate:

| Area | Pre-test-selected model | Development MAE | Replay MAE | Old ensemble MAE | 80% interval empirical coverage |
| --- | --- | ---: | ---: | ---: | ---: |
| bangladesh | ratio_poisson | 28.050 | 49.487 | 45.970 | 83.3% |
| nepal | ratio_l1 | 102.430 | 129.649 | 113.001 | 78.2% |
| chin | linear_l1_0.1 | 57.556 | 122.570 | 136.414 | 76.3% |
| punjab_haryana | ratio_l1 | 346.902 | 308.026 | 313.525 | 75.0% |

This replacement is rejected: it worsens Bangladesh and Nepal, and its modest improvements in the failing areas still lose to simple baselines. It is not permissible to keep only the favorable case-by-case replay outcomes.

## Second declared experiment: later training and recent development

After reviewing the first failure and its regime diagnosis, the parent requested one additional bounded protocol. It selects on 2019-2020 predictions from models fitted 2013-2018, refits the selected family on 2013-2020, calibrates on 2021 only, and evaluates once on the same already-known 2022-2024 replay. All comparison baselines are refitted on the same 2013-2020 data; the original trained-through-2018 results remain separate.

The candidate set was the first families excluding fixed 4.4, plus one global weighted-median rate. No stacking or additional parameter search was performed. Selection was frozen before this protocol's final replay scoring. Frozen selection SHA-256: `b6e36d6aee2a9168afd3d771a91b085326420b6c32cb784b6e13d8e28833461e`. A Windows line-ending checksum mismatch stopped the first final invocation before evaluation; normalizing the already-frozen JSON to UTF-8 LF restored this exact digest without changing scores, models or protocol.

| Candidate | Bangladesh | Nepal | Chin | Punjab-Haryana |
| --- | ---: | ---: | ---: | ---: |
| naive | 66.690 | 93.779 | 119.232 | 246.081 |
| monthly | 48.985 | 78.242 | 112.295 | 296.808 |
| ensemble | 33.724 | 86.626 | 72.714 | 329.881 |
| offset0.1 | 43.532 | 69.197 | 115.059 | 289.844 |
| offset1 | 45.683 | 69.143 | 117.545 | 271.905 |
| offset_rich1 | 43.733 | 73.063 | 94.529 | 269.972 |
| ratio_poisson | 40.451 | 83.509 | 80.814 | 253.855 |
| ratio_l1 | 35.367 | 65.243 | 90.234 | 224.196 |
| robust_monthly | 36.416 | 82.160 | 119.503 | 223.642 |
| linear_l1_0.01 | 33.931 | 75.351 | 88.841 | 247.690 |
| linear_l1_0.1 | 92.323 | 184.863 | 97.789 | 291.917 |
| robust_factor | 40.933 | 94.088 | 119.065 | 234.239 |

Frozen selections: ensemble for Bangladesh and Chin; rate L1 LightGBM for Nepal; robust monthly factor for Punjab-Haryana. Independent final replay comparison:

| Area | Selected | Selected MAE | Updated fixed ensemble | Updated fitted factor | Updated monthly factor | Old fixed ensemble |
| --- | --- | ---: | ---: | ---: | ---: | ---: |
| bangladesh | ensemble | 44.786 | 44.786 | 58.180 | 50.430 | 45.970 |
| nepal | ratio_l1 | 125.356 | 119.094 | 157.962 | 126.762 | 113.001 |
| chin | ensemble | 132.951 | 132.951 | 99.410 | 78.191 | 136.414 |
| punjab_haryana | robust_monthly | 280.024 | 255.237 | 263.547 | 301.465 | 313.525 |

| Area | Selected mean absolute annual-total error | Old ensemble annual error | Empirical 80% interval coverage | Median interval width |
| --- | ---: | ---: | ---: | ---: |
| bangladesh | 17.604% | 16.952% | 72.4% | 30.05 |
| nepal | 7.157% | 10.119% | 78.2% | 68.43 |
| chin | 9.257% | 9.951% | 69.9% | 2.48 |
| punjab_haryana | 6.769% | 22.422% | 72.4% | 187.93 |

The selected Punjab method lowers weekly MAE from 313.525 to 280.024 (10.69%) and annual-total error from 22.422% to 6.769% relative to the old ensemble. It still loses weekly MAE to the updated factor 263.547 and updated fixed ensemble 255.237. Updating the fixed ensemble alone gives an 18.59% reduction versus the old ensemble, but selecting it specifically for Punjab after seeing replay scores would be a post-test choice. Chin still strongly favors the monthly baseline on this replay (78.191 versus 132.951), despite recent development selecting the ensemble. Nepal's selected method still degrades the original ensemble weekly MAE. There is no honest universal-winner result.

Only 52 national weekly calibration examples remain in 2021. Some activity/season groups lack the 20 residuals needed by `ConformalBands` and fall back to pooled residuals. Measured coverages are approximately 70-78%, below the 80% target. Autocorrelation, sparse peaks and temporal shift further limit exchangeability. Do not reduce calibration to one year merely to advertise more recent training. [Time-series validation guidance](https://scikit-learn.org/stable/modules/cross_validation.html#time-series-split) supports chronological partitions; it supplies no guarantee that these particular selected models will generalize.

## Recommendation after the first two experiments

These first two trials alone do not justify a production model replacement. Preserve the v1 published results and add an explicitly labeled later-training comparison only if useful. The smallest useful next source change is protocol infrastructure in `pipeline/global_cases.py`: record candidate names, selection years, refit years, calibration years, chosen family, development scores and a freeze digest; prohibit fixed-4.4 from selection; fit every comparison baseline on the same final period; persist all failures as well as gains. This avoids implying that a post-test best baseline was selected prospectively.

If the research family is retained for a new locked evaluation, the exact robust-monthly implementation is:

```python
def weighted_median(values, weights):
    order = np.argsort(values)
    values, weights = np.asarray(values)[order], np.asarray(weights)[order]
    return float(values[np.searchsorted(np.cumsum(weights), .5 * weights.sum())])

# fit on designated point-model fit years only
positive = train[train.M > 0]
global_factor = weighted_median(positive.V / positive.M, positive.M)
monthly = {
    int(month): weighted_median(np.r_[g.V / g.M, global_factor], np.r_[g.M, 50.])
    for month, g in positive.groupby('month')
}
# predict without consuming VIIRS labels
prediction = frame.M.to_numpy() * frame.month.map(monthly).fillna(global_factor).to_numpy()
```

The exact small rate-GBM settings and training/prediction transformations are in `data/processed/model_research.py::RatioGBM`; they add no dependency beyond existing LightGBM. They are reproducible research candidates, not accepted model upgrades. A future source-motivated extrapolation guard could replace the direct-tree component outside fitted count support with a learned seasonal count rate, then test against an untouched period. That proposed guard was subsequently investigated as the explicitly requested source-motivated intervention below.

## Reproduction, audit trail and runtime

```powershell
python data/processed/model_research.py select
python data/processed/model_research.py final
python data/processed/model_research_recent.py select
python data/processed/model_research_recent.py final
```

The two stage split intentionally makes the freeze reviewable before evaluation. Inputs are loaded with the existing SHA-256 verification. Artifacts:

- `data/processed/model_research/selection.json` and `final.json`: first full development scores and selected final results.
- `data/processed/model_research/recent/selection.json`, `frozen_sha256.txt`, `final.json`: second declared protocol and results.
- `*_selected_predictions.csv` and `recent/*_predictions.csv`: weekly selected predictions and independent calibration intervals.
- `chin_baseline_diagnostics.csv`, `punjab_haryana_baseline_diagnostics.csv`, `diagnostics.json`, `extrapolation.json`: source/model diagnosis.
- `data/processed/model_research*.log`: execution logs.

First selection runtime was about 10.7 seconds, final selected evaluation 0.7 seconds excluding Python startup. Second selection was 7.0 seconds and final comparison 10.9 seconds, on this machine. Runtime is an observation, not a portable guarantee. Some baseline LightGBM refits use available CPU threading; changing environments can introduce small numeric changes.

Research script SHA-256:

- `model_research.py`: `283c56914c0f50aefe5253b6385e9835ea9de8f1b831eb7feea634a4160a8af4`
- `model_research_recent.py`: `25e6a1c18447e68dde92a21d5086502e0cf6a1c026ed38c04b0ed287af7c0c06`

Both experiments reuse known historical years. Changing the protocol after the first result is explicitly disclosed; per-protocol temporal separation is not an untouched final holdout, and repeated research on these years cannot become one. Scores quantify S-NPP detection agreement, not unique fires or ground-truth fire extent. No model family was chosen from 2022-2024 labels within either frozen protocol. Two subsequent source-motivated interventions, explicitly requested after those failed trials, are documented below with the same known-replay limitation.

## Third intervention: the direct-tree extrapolation cap

This is a specific model-behavior repair proposed from the inspected source and peak diagnostic, not another hyperparameter search. The NB contribution remains 30%. For rows whose MODIS count exceeds the largest MODIS count in the entire pooled GBM fitting input, replace only the 70% direct-tree contribution with a learned multiplicative count factor. That threshold has no numerical tuning parameter. Because `GBMModel` fits one pooled model with categorical regions, the final definition uses the pooled maximum, not each region's maximum.

The initial regional-support probe is preserved under `data/processed/model_research/guard/`. It gave Bangladesh MAE50.307 and Chin93.909. The parent pointed out that regional support is an additional assumption rather than the numeric support of the actual pooled GBM. The source-faithful pooled definition was then frozen before its evaluation; it was not chosen separately for favorable areas. It still worsens Bangladesh, which remains visible.

Two fallback forms were considered: existing fitted global factor versus existing fitted monthly factors. One form was selected across all four areas using equal weighting of each area-fold's relative MAE on the original pre-test rolling folds. The global factor scored 1.017823 relative to the unguarded model; monthly fallback scored1.047769. Both worsen aggregate development loss, so the guard's rationale is structural extrapolation behavior, not a demonstrated validation advantage. Global factor was frozen for every area. Normalized selection SHA-256: `5abc248141624bc4676606a4b5adce540bcde5e4072b80af8c832971e57541b5`.

| Area | Fit end / validation | Guard-triggered rows | Original development MAE | Global-factor guard MAE | Monthly guard MAE |
| --- | --- | ---: | ---: | ---: | ---: |
| bangladesh | 2014 / 2015-2016 | 0 | 29.142 | 29.142 | 29.142 |
| bangladesh | 2016 / 2017-2018 | 0 | 31.138 | 31.138 | 31.138 |
| nepal | 2014 / 2015-2016 | 4 | 142.460 | 134.439 | 178.632 |
| nepal | 2016 / 2017-2018 | 0 | 75.100 | 75.100 | 75.100 |
| chin | 2014 / 2015-2016 | 1 | 78.281 | 93.850 | 88.320 |
| chin | 2016 / 2017-2018 | 0 | 52.301 | 52.301 | 52.301 |
| punjab_haryana | 2014 / 2015-2016 | 0 | 475.627 | 475.627 | 475.627 |
| punjab_haryana | 2016 / 2017-2018 | 0 | 299.613 | 299.613 | 299.613 |

The final point-model period remains2013-2018. This intervention does not make partial observations valid labels. The independent NASA reference-quality rule below is applied before fitting and calibration, with original labels retained for full-raw sensitivity. None of the selected long outages overlap2013-2018, so point-fit rows happen to remain unchanged in these fixtures.

## Actual reference-data defect: NASA acquisition outages

NASA's [MODAPS S-NPP data-outage table](https://modaps.modaps.eosdis.nasa.gov/services/production/outages_suomi_npp.html), retrieved 15 November 2026, identifies acquisition/data-quality interruptions. Its November 2024 row gives2024-11-02T22:12UTC through2024-11-06T17:36UTC. The [FIRMS outage notice](https://firms2.modaps.eosdis.nasa.gov/content/notifications/firms/outages.html) separately says the GPS problem caused production suspension, and processing resumedNovember 9 after geolocation recovery. Those are different intervals: resumed processing is not the first post-gap acquisition.

Local raw acquisition timestamps prove the relevant distinction. In Punjab-Haryana, the last S-NPP detection before the NASA acquisition gap is2024-11-02T20:32UTC and the first afterward is2024-11-06T20:56UTC. No raw S-NPP detection falls within the listed gap. OnNovember 3, 4 and 5, raw S-NPP counts are0,0,0 while raw MODIS counts are293,17,215. November 6 has11raw S-NPP detections; November 7/8 have551/632. Therefore archivedNovember 7-8 observations were present despite processing resumingNovember 9. Masking through the processing-resumption date would be wrong. The gap also contains no raw S-NPP rows in Bangladesh and Nepal; Chin is seasonally quiet then, so its empty rows alone would not prove a gap.

All nine selected long acquisition-outage intervals below have zero S-NPP raw detections inside them in each of the four stored case inputs. This corroborates the source-driven missing-reference diagnosis; absence of fire detections alone was not used to infer outages. Source-parquet input sizes were3,739,610neighbor detections,471,002Bangladesh detections and711,321Nepal detections. Raw source inputs were not edited.

### Globally frozen quality rule

The finite manifest retains all 172 NASA-listed intervals beginning in2013-2024. Before rescoring, the rule was frozen: for every area and every fit/calibration/test partition, mask the VIIRS reference label for an ISO week if it overlaps a listed S-NPP acquisition/data-quality outage of at least24hours. Preserve the original label and prediction rows. Compare every model on exactly the same eligible weeks. The24hour threshold is a conservative one-full-day sensor-loss rule, not a threshold chosen from errors. Short granule gaps need local overpass/coverage analysis and are retained in the manifest but not treated as proven full-day loss.

This is an explicitly labeled documented-long-outage subset. It is not a certificate of cloud-free or complete retrieval for the remaining weeks, and not a claim that all discarded weeks had no valid observations. Partial weeks can contain valid counts while being unsuitable as a complete seven-day reference. Every full156-week score remains published beside the subset.

Frozen quality manifest SHA-256: `f289664f31cdf39d94e13010aece6df6240aff063efdaa6b5e5715ad2928a790`. Source-linked full manifest: `data/processed/model_research/quality_global/manifest.json`. Only these nine intervals meet the rule:

| Acquisition/data-quality start UTC | End UTC | Duration hours | NASA description |
| --- | --- | ---: | --- |
| 2021-08-03T12:48:00+00:00 | 2021-08-04T15:48:00+00:00 | 27.0 | Safe-Mode outage |
| 2022-07-27T15:48:00+00:00 | 2022-08-11T00:00:00+00:00 | 344.2 | SNPP Lock-up |
| 2023-07-26T02:00:00+00:00 | 2023-07-27T19:54:00+00:00 | 41.9 | SNPP Lock-up outage |
| 2023-11-01T14:00:00+00:00 | 2023-11-02T14:54:00+00:00 | 24.9 | CDP Reset L0 outage |
| 2024-05-30T00:00:00+00:00 | 2024-06-04T00:00:00+00:00 | 120.0 | GPS Anomaly Outage (C2) 5/30/24 through 6/3/24 |
| 2024-07-09T21:42:00+00:00 | 2024-07-16T17:42:00+00:00 | 164.0 | GPS Anomaly Outage |
| 2024-07-24T05:24:00+00:00 | 2024-07-29T15:24:00+00:00 | 130.0 | CDP Reset Anomaly |
| 2024-09-26T00:00:00+00:00 | 2024-09-27T17:36:00+00:00 | 41.6 | GPS Anomaly Outage |
| 2024-11-02T22:12:00+00:00 | 2024-11-06T17:36:00+00:00 | 91.4 | GPS Anomaly outage (11/2/24 22:12 - 11/6/24 17:30, inclusive) |

No fitting weeks are excluded. Calibration excludes2021-W31, leaving156 weekly examples. Replay excludes14 weeks identically across the four areas:

- 2022:W30,W31,W32.
- 2023:W30,W44.
- 2024:W22,W23,W28,W29,W30,W31,W39,W44,W45.

The common eligible replay has142 weeks:49 in 2022,50 in 2023 and43 in 2024. The exact interval bounds come from NASA's acquisition table, not the processing-resumption notices. All 172 intervals, source URL/hash and exact exclusions are retained for inspection. The FIRMS missing-data web table failed to load during this investigation; no claim is made that its database independently supplied this mask.

### Full raw comparison and matched quality subset

All methods use the same fitting years and appropriate quality mask before fitting/calibration. All full raw point-prediction scores remain available. Full156raw weeks:

| Area | Global-support guard | Original ensemble | Fitted factor | Monthly factors | Fixed4.4 historical reference |
| --- | ---: | ---: | ---: | ---: | ---: |
| bangladesh | 49.981 | 45.970 | 61.571 | 52.658 | 63.797 |
| nepal | 113.001 | 113.001 | 158.019 | 134.809 | 277.927 |
| chin | 93.909 | 136.414 | 101.030 | 86.088 | 131.081 |
| punjab_haryana | 313.525 | 313.525 | 271.623 | 326.209 | 233.117 |

Same 142 eligible weeks for every method:

| Area | Global-support guard | Original ensemble | Fitted factor | Monthly factors | Fixed4.4 historical reference |
| --- | ---: | ---: | ---: | ---: | ---: |
| bangladesh | 54.549 | 50.142 | 67.353 | 57.596 | 69.793 |
| nepal | 123.318 | 123.318 | 172.727 | 147.419 | 304.751 |
| chin | 103.105 | 149.801 | 110.976 | 94.561 | 143.990 |
| punjab_haryana | 269.628 | 269.628 | 245.071 | 290.913 | 212.204 |

The guard lowers Chin full MAE 136.414 to 93.909 (31.16%) and eligible MAE 149.801 to 103.105 (31.17%). This is a real changed-prediction result, retained with its full data and its remaining loss to monthly factors. It changes only one Chin replay row, the extreme2023-W15, because only that row exceeds fitted MODIS support. It still worsens Bangladesh from 45.970 to 49.981; Nepal and Punjab point predictions are unchanged. Do not apply it only where the known replay looks favorable and call that independent selection.

Punjab raw MAE of 313.525 versus eligible MAE of 269.628 describes a reference-comparability correction, not improved predictions. On the same eligible weeks the fitted factor of 245.071 still beats the ensemble at 269.628. Identifying a genuine NASA outage does not justify claiming that all Punjab model errors are explained by outages or hiding the complete raw result.

Per-year eligible scores:

| Area | Year | Eligible / raw weeks | Guard | Original ensemble | Fitted factor | Monthly factors |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| bangladesh | 2022 | 49 / 52 | 73.568 | 73.568 | 87.806 | 81.475 |
| bangladesh | 2023 | 50 / 52 | 43.309 | 30.795 | 64.016 | 48.136 |
| bangladesh | 2024 | 43 / 52 | 45.944 | 45.944 | 47.927 | 41.385 |
| nepal | 2022 | 49 / 52 | 66.205 | 66.205 | 115.540 | 89.334 |
| nepal | 2023 | 50 / 52 | 121.193 | 121.193 | 150.826 | 104.769 |
| nepal | 2024 | 43 / 52 | 190.872 | 190.872 | 263.360 | 263.203 |
| chin | 2022 | 49 / 52 | 139.405 | 139.405 | 159.947 | 151.976 |
| chin | 2023 | 50 / 52 | 109.292 | 241.908 | 93.307 | 68.909 |
| chin | 2024 | 43 / 52 | 54.546 | 54.546 | 75.718 | 58.963 |
| punjab_haryana | 2022 | 49 / 52 | 194.974 | 194.974 | 253.765 | 271.760 |
| punjab_haryana | 2023 | 50 / 52 | 355.039 | 355.039 | 267.282 | 339.824 |
| punjab_haryana | 2024 | 43 / 52 | 255.384 | 255.384 | 209.338 | 255.864 |

After excluding the same calibration week for all areas, guard interval coverages on142eligibleweeks are81.7%Bangladesh,76.1%Nepal,74.6%Chin and77.5%Punjab. These remain empirical replay results below the nominal 80% target in three cases. Metric fields called `abs_total_pct_err` in the ignored subset outputs describe totals over matched eligible weeks, not full annual totals; any interface should label this distinction.

### Exact minimal repair and integration contract

```python
# fit: same paired, quality-eligible point-fit rows as every other model
model = EnsembleModel().fit(train)
factor = NaiveFactor().fit(train)
max_modis = float(train.M.max())  # pooled numeric support of this GBM fit

# predict: every prediction is independent of the corresponding VIIRS label
gbm = model.gbm.predict(frame)
outside_support = frame.M.to_numpy() > max_modis
gbm = np.where(outside_support, factor.predict(frame), gbm)
prediction = .3 * model.nb.predict(frame) + .7 * gbm
```

For load-time quality handling, retain`V_raw`, calculate an explicit source-linked `reference_quality_ok` flag, and set only the working`V`label toNaN on excluded weeks. Fit/candidate-selection/calibration filters must require that working label. Public reference observations must not be rewritten, interpolated or scaled to make a score lower. Export both complete raw and identical-eligible-subset scores for every baseline, their week counts, exclusion reasons, support threshold, guard-trigger count and the protocol manifest hash. Name the subset as documented-long-outage filtered, not ground truth. A separate future locked evaluation remains necessary.

Artifacts added for this source-motivated stage:

- `data/processed/model_research_guard.py`and`guard/`: original regional-support probe, preserved including losses.
- `data/processed/model_research_guard_global.py`and`guard_global/selection.json`: final pooled-support definition and all development-fold scores.
- `data/processed/model_research_quality.py`and`quality_global/`: frozen source mask, all raw/eligible scores, per-year scores and every weekly prediction.
- `data/processed/model_research/snpp_outages_source.html`and`snpp_outage_rows.csv`: NASA source snapshot and parsed rows.
- `raw_acquisition_evidence.json`,`outage_raw_counts.json`,`*_nov2024_daily.csv`: direct source-parquet acquisition corroboration.

Reproduce the final declared stage:

```powershell
python data/processed/model_research_guard_global.py select
python data/processed/model_research_quality.py manifest
python data/processed/model_research_quality.py final
```

The regional guard ran about 10.3 seconds; global development selection about 16.8 seconds. Quality-aware final fitting/scoring timing is in`data/processed/model_research_quality_final.log`. All model/quality refinements were explicitly disclosed after earlier known-replay inspection. They repair identified structural/reference problems but cannot restore untouched-holdout status to the same historical years.

## Final bounded protocol: annual past-only retraining

The final protocol addresses the observed regime drift. This changes the update schedule, not the architecture or its hyperparameters. Every target year uses only older labels: point-fit 2013 through Y - 2, independent interval calibration Y - 1, evaluate Y. The same acquisition-quality mask is applied to all periods and all four methods. Earlier test-year labels may legitimately become training data for later target years; this intentionally differs from the original single frozen model over156 weeks. It remains a known historical replay and is not called an untouched holdout.

No candidate choice or hyperparameter selection uses target-year results. Architecture, guard fallback and threshold rule remain fixed. Both guarded and unguarded ensemble are reported with the same-year fitted-factor and monthly-factor baselines. Frozen protocol SHA-256: `aaffb1b396b696a4d8a854cf4cb0b7db35a02f76e71263c74dbb5b86f67da8df`.

| Target year | Point-model fit | Independent interval calibration | Eligible calibration weeks | Raw / eligible test weeks |
| --- | --- | --- | ---: | ---: |
|2022|2013-2020|2021|51|52 /49|
|2023|2013-2021|2022|49|52 /50|
|2024|2013-2022|2023|50|52 /43|

All 156 raw weeks:

| Area | Rolling guard | Rolling ensemble | Rolling fitted factor | Rolling monthly factors | Original frozen ensemble |
| --- | ---: | ---: | ---: | ---: | ---: |
| bangladesh | 46.926 | 45.134 | 58.316 | 49.839 | 45.970 |
| nepal | 115.232 | 115.232 | 158.516 | 131.390 | 113.001 |
| chin | 88.530 | 131.945 | 97.283 | 75.525 | 136.414 |
| punjab_haryana | 246.265 | 246.265 | 262.017 | 291.339 | 313.525 |

Same 142 eligible weeks:

| Area | Rolling guard | Rolling ensemble | Rolling fitted factor | Rolling monthly factors |
| --- | ---: | ---: | ---: | ---: |
| bangladesh | 51.201 | 49.232 | 63.785 | 54.523 |
| nepal | 125.792 | 125.792 | 173.297 | 143.696 |
| chin | 97.198 | 144.894 | 106.860 | 82.957 |
| punjab_haryana | 209.497 | 209.497 | 237.311 | 260.711 |

This delivers a genuine Punjab prediction improvement without removing its bad weeks: raw MAE falls from 313.525 to 246.265, a 21.45% reduction relative to the original frozen ensemble. The rolling ensemble also beats a factor refitted to the same available past data:246.265 versus 262.017 on all raw weeks, and209.497 versus 237.311 on matched eligible weeks (11.72% lower). The guard triggers no Punjab rows, so this gain comes from scheduled retraining with older data, not the extrapolation intervention or quality-based rescoring.

For Chin, rolling guard raw MAE of 88.530 is 35.10% below the original136.414. It beats the contemporaneous single factor at 97.283 but still loses to monthly factors at 75.525. Bangladesh's rolling plain ensemble improves from 45.970 to 45.134, but the fixed global-support guard worsens that to 46.926. Nepal at 115.232 is 1.97% worse than its original 113.001. Those adverse outcomes are part of the result. A method must not be switched per area after looking at these replay results and then presented as independently selected.

Eligible interval coverages for the rolling guard are 78.2% for Bangladesh, 79.6% for Nepal, 74.6% for Chin and 82.4% for Punjab. Each calibration year has only 49-51 eligible weekly residuals. This is small, temporally dependent calibration evidence; wider bands or improved calibration should be evaluated separately against new locked data rather than adjusted using these same replay results.

Per-year matched eligible MAE:

| Area | Year | Guard | Ensemble | Fitted factor | Monthly factors |
| --- | ---: | ---: | ---: | ---: | ---: |
| bangladesh | 2022 | 73.336 | 73.336 | 87.221 | 80.484 |
| bangladesh | 2023 | 40.108 | 34.518 | 56.176 | 41.491 |
| bangladesh | 2024 | 38.875 | 38.875 | 45.927 | 40.091 |
| nepal | 2022 | 64.874 | 64.874 | 116.162 | 89.106 |
| nepal | 2023 | 119.808 | 119.808 | 158.114 | 108.060 |
| nepal | 2024 | 202.167 | 202.167 | 256.058 | 247.340 |
| chin | 2022 | 121.121 | 121.121 | 162.067 | 150.196 |
| chin | 2023 | 94.602 | 230.058 | 82.812 | 55.652 |
| chin | 2024 | 72.955 | 72.955 | 71.914 | 38.085 |
| punjab_haryana | 2022 | 182.196 | 182.196 | 240.390 | 235.943 |
| punjab_haryana | 2023 | 223.753 | 223.753 | 258.120 | 309.269 |
| punjab_haryana | 2024 | 224.033 | 224.033 | 209.606 | 232.471 |

Minimal annual-update implementation:

```python
for target_year in (2022, 2023, 2024):
    fit = paired_quality_rows[paired_quality_rows.iso_year.between(2013, target_year -2)]
    calibration = paired_quality_rows[paired_quality_rows.iso_year == target_year -1]
    test = original_rows[original_rows.iso_year == target_year]
    model = fit_fixed_architecture(fit)
    # Calibrate residual bands on calibration only; never on target-year labels.
    prediction = model.predict(test)
    # Compare all methods on identical raw and quality-eligible target weeks.
```

The existing fixed architecture plus pooled strict-support intervention above is sufficient; no new dependency is needed. The actual experiment implements every original baseline on the identical fit/calibration/test chronology. `data/processed/model_research_walkforward.py` contains the complete code; `walkforward/protocol.json` and `walkforward/final.json` contain the freeze and results, including fold fit ranges, row counts, support maxima, triggered rows, full and eligible per-year scores. Predictions for every target week are exported as ignored CSVs. This is the final requested protocol; earlier rejected trials remain available.

Reproduction:

```powershell
python data/processed/model_research_walkforward.py freeze
python data/processed/model_research_walkforward.py final
```

The practical recommendation after all stages is to implement the acquisition-quality flags and preserve complete raw comparisons, expose the global-support guard with its mixed outcomes, and use the explicitly labeled annual past-only update schedule when claiming this Punjab improvement. Keep Chin's superior monthly baseline visible. Freeze the release procedure before collecting a genuinely new evaluation period; do not advertise these development replays as prospective operational validation.

## Adopted integration contract

After reviewing all disclosed outcomes, the parent chose the final annual update workflow for the next version, with the following boundaries. This decision adopts the stated procedure; it does not turn the replay into an independent untouched evaluation.

- Preserve the original frozen experiment JSONs before generating the next version. Keep their original full 156-week metrics and protocol visible as a historical reference.
- Use the new workflow's common 142 documented-long-outage-eligible weeks for primary comparison. Publish its complete 156 raw-week results for all methods beside those results, with week counts, source-linked excluded intervals and exact excluded week lists. Call any subset total metric a matched-period total error, never annual-total error.
- Keep original VIIRS reference counts in every calendar row, even in a quality-excluded week. Add an explicit reference-quality boolean/reason. Missing reference coverage is not a genuine zero-fire observation, but valid partial counts must not be erased or fabricated.
- For older historical reconstruction, fit the final available vintage on 2013-2022 and calibrate on 2023. This is the latest 2024-fold model. Its history projections have different provenance from the rolling evaluation rows; do not suggest that historical-year predictions were made using a model available in that historical year.
- Overwrite 2022, 2023 and 2024 evaluation predictions and bands using their own chronological vintages. The evaluated object is an annually updated workflow, not one frozen fit. Each row/year must retain the applicable point-fit range and calibration year.
- Keep the frozen architecture and pooled-support rule. Expose the scientific result and limitations; do not present the dozen discarded development candidates as public configuration choices.
- Empirical interval coverage belongs to the evaluated workflow. The 2023 calibration year has only 50 eligible national weekly residuals, and its uncertainty behavior is not an established coverage guarantee for pre-2012 projections.

A clean minimal helper, extracted from the exact experiment implementation, is available at `data/processed/portable_reconstruction_helper.py`. It contains only `PortableReconstruction.fit/predict/outside_support`, `mark_reference_quality`, and `vintage_rows`. It has no new dependency, no candidate-selection machinery and no source-data mutation. It is an ignored review artifact; production source remains for the parent to implement.

Source manifest to promote into a tracked, stable project path: `data/processed/model_research/quality_global/manifest.json`. It records all 172 parsed source rows, the nine long outages actually used, source URL, source-HTML SHA-256, retrieval date, exact UTC intervals, applied rule, exclusions and the guard-selection reference. The original NASA HTML and raw-acquisition corroboration remain under the same ignored research artifact directory. A tracked name such as `pipeline/reference_quality_outages.json` would make the scientific rule reproducible; the parent chooses final module placement.

Guard usage in the final walk-forward test, counted as region-week model rows rather than national aggregates:

| Area | Triggered region-weeks | Evaluated region-weeks | Fraction |
| --- | ---: | ---: | ---: |
| bangladesh | 2 | 780 | 0.256% |
| nepal | 0 | 312 | 0.000% |
| chin | 1 | 156 | 0.641% |
| punjab_haryana | 0 | 156 | 0.000% |

Minimal integration sequence: load and verify original features; preserve raw reference labels and add quality flags; fit/calibrate the latest historical vintage; fit/calibrate the three causal evaluation vintages; build complete raw and matched-quality comparison metrics for every baseline; export both protocols and provenance; validate row-level reconstruction of every published score. Do not retrain, choose a fallback, change the outage threshold or resize bands when a user changes a demonstration slider.

Final walk-forward runtime was approximately 21.0 seconds, excluding Python startup, on this machine. The quality-aware original-period comparison ran approximately 16.4 seconds. No further protocol search was performed after the final walk-forward result.

## Released implementation

The final protocol is implemented in `pipeline/global_cases.py`; the NASA source manifest is versioned in `pipeline/reference_quality.json`. Run `python -m pipeline.global_cases --from-packages` to reproduce the released annual vintages and all baseline comparisons without a key. The exploratory scripts above are local research records under the ignored processing directory, not required release commands. The original frozen packages are preserved at `web/public/data/global/v1/`.
