# Current application captures and scientific figures

Prepared 29 October 2026 from the restored Soft Earth production build. The original design delta through `62c129d` was integrated onto the current main baseline; the pipeline and scientific exports were unchanged. The screenshots show the actual restored interface, including the textured Three.js Earth.

## Application gallery

| View | Full-size capture | What to inspect |
| --- | --- | --- |
| Overview | [Desktop](screenshots/home-desktop.png), [mobile](screenshots/home-mobile.png), [mobile Bangla](screenshots/home-mobile-bn.png) | Area/year/week selection, geographic sphere, cumulative activity and normal range |
| Calendar | [Desktop](screenshots/calendar-desktop.png) | Year/week comparison, selected week and estimated-year marks |
| Sensors | [Desktop](screenshots/sensors-desktop.png) | Raw/factor/harmonized comparison, uncertainty and reported internal results |
| Map | [Desktop](screenshots/map-desktop.png) | Archived detections, districts and spatial controls |
| Outlook | [Desktop](screenshots/outlook-desktop.png) | Experimental activity/weather products using the saved snapshot |
| Borders | [Desktop](screenshots/borders-desktop.png) | Neighbouring-area and aerosol timing comparisons, without causal attribution |

Captures are copied byte-for-byte from the successful production browser checks and showcase capture script. The desktop Soft Earth showcase uses 1440 x 1080, light theme and English; the mobile showcase uses 390 x 1100. The Bangla/dark capture uses width 360. Other desktop views use width 1440, light theme and English. The restored desktop showcase matches the saved original Soft Earth reference byte-for-byte. Route selections use Bangladesh, 2024, week 14 where supported. The underlying export timestamps remain October 2026; the screenshots are not evidence of live feeds or current forecasts. [Verification matrix](verification-2026-10-29.json)

## Internal reconstruction benchmark

![Internal national weekly error comparison](figures/model-comparison.png)

**Caption:** National weekly mean absolute error, averaged across internal leave-one-year-out folds over 2012–2025. The ensemble reports 36.964 detections versus 49.450 for a single factor fitted within each fold, a 25.25% reduction. No error bars are shown because this chart summarizes the committed aggregate values, not a newly estimated confidence interval. The comparison is not an untouched final evaluation or operational forecasting result.

Source: [validation.json](../../web/public/data/validation.json). [PNG](figures/model-comparison.png) · [editable SVG](figures/model-comparison.svg) · [vector PDF](figures/model-comparison.pdf)

## Annual continuity cross-check

![Annual normalized ESA burned area and active-fire detection series](figures/continuity-crosscheck.png)

**Caption:** Annual ESA burned area, harmonized detections and raw stitched detections for 2003–2024, each divided by its own 2012–2024 mean. Markers indicate the 2012 VIIRS transition and the 2019 ESA product change. ESA uses MRBA v6.0 through 2018 and Sentinel-3 SYN v1.1 from 2019. The lines measure different observables; agreement in broad variability supports plausibility rather than ground-truth fire-count accuracy or proof of a bias-free record.

Source: [partner.json](../../web/public/data/partner.json). [PNG](figures/continuity-crosscheck.png) · [editable SVG](figures/continuity-crosscheck.svg) · [vector PDF](figures/continuity-crosscheck.pdf)

## Reproduction and historical assets

Run `python notebooks/review_figures.py` from the repository root with matplotlib installed. The script produces the files above from committed JSON without downloading or retraining. [Full verification/reproduction instructions](../VERIFICATION.md)

Older assets in `docs/figures/`, `docs/screenshots/` and `docs/readme-assets/` are retained as historical records. Some have old evaluation-year or preview captions; use this directory's figures and current project brief for the 29 October review package.
