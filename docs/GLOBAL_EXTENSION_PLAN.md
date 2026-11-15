# Global extension: delivered work and next research

**15 November 2026 · Team KUETaguns**

[Typeset PDF](pdf/GLOBAL_EXTENSION_PLAN.pdf) · [Project brief](PROJECT_BRIEF.md) · [Item-by-item delivery status](IMPLEMENTATION_STATUS.md) · [Original 29 October proposal](archive/GLOBAL_EXTENSION_PLAN-2026-10-29.md)

[Live capabilities and screenshots](../README.md) · [User guide](USER_GUIDE.md) · [Data packages](DATA_GUIDE.md) · [All documents](README.md)

The original proposal asked us to make sensor comparability inspectable and evaluate it beyond Bangladesh. That work now has a public implementation: worldwide recent observations, four historical cases, a sensor-switch experiment, source-rich exports and a phone-friendly PWA. This document records what those additions establish and what still needs research.

## Delivered in this build

| Original priority | Implementation | Acceptance evidence |
| --- | --- | --- |
| A reliable dated public product | GitHub Pages, separate static publishing and six-hour global refresh, feed dates and stale notices | Hosted global refresh/deploy succeeds; software verification is recorded separately from model validity |
| Evaluation with separated calibration | Fixed detector-only model; annual fit through Y−2, independent calibration Y−1, test Y | Four complete area packages, all baselines, regional failures and nominal-80% coverage |
| Contrasting additional areas | Nepal, Chin and Punjab–Haryana alongside Bangladesh | Updated annual workflow beats the matched fitted factor in four cases; Chin still loses to monthly factors; no worldwide accuracy extrapolation |
| A visible sensor-switch experiment | Test-year/week controls, raw/factor/model curves and revealable VIIRS | Precomputed chronological test predictions; reference hidden only by the interaction, not retraining |
| Continuity and missing-source integrity | Shared national/local/neighbour handover, per-week map source, bridge bounds | Nonidentity-factor, zero, missing-sensor, outage and boundary-week tests |
| Portable evidence briefs | Historical PNG/JSON/CSV/print; recent-country PNG/JSON/daily CSV | Dates, sources, hashes, uncertainty and limitations accompany outputs |
| Accessible global discovery | Spin/tap/zoom globe, keyboard/flat-map alternatives, daily playback | Responsive browser checks, reduced motion and explicit rendering-sample notice |
| Useful repeat mobile visits | Local watchlist, installable PWA, offline reference packages | Chromium installability criteria and real service-worker offline checks |
| Reproducible public methods | Compact checksum-verified feature CSVs and a no-key refit command | All four published evaluations reproduced in the release environment |
| A compliant presentation package | Seven English slides, 29-second captioned demo, project-page draft and credits | Page-count, duration, public-link and visual checks; team submission still required |

## What people can do with it

A visitor can choose their country on the Earth, read a dated snapshot in plain words and save that place for a return visit. A student can investigate the seasonal pattern. A community group can share a brief that keeps source dates with its figures. Researchers can inspect how a historical reconstruction compares with NASA observations.

The eight-step introduction and 85 on-demand help topics explain the full application without requiring a visitor to finish a long tour. English/Bangla, keyboard and flat-map alternatives, reduced motion and cached reference pages support different ways of using it.

The historical workflow has three past-only evaluation vintages and an explicit source-quality rule. Current-method comparisons, all reference weeks and uncertainty coverage are available in the [model card](GLOBAL_EVALUATION.md). These establish inspectable historical experiments; practitioner outcomes and broader independent evaluation remain research work.

## Next research gates

| Work package | Method and deliverable | Evidence needed before the claim |
| --- | --- | --- |
| Locked final evaluation | Freeze preprocessing, model choices and primary metrics; pre-register new temporal/geographic evaluation; refit calibration inside each permitted training partition | Report every baseline and area, seasonal/regional errors, bootstrap uncertainty where justified, and failures. A reviewer agrees the lock precedes access to the final labels. |
| Industrial-source labels | Collect fresh blind positive/negative/uncertain labels independently of the filter; include likely vegetation fires | Precision/recall and retained-fire sensitivity with uncertainty; do not infer accuracy from a small hand-picked imagery sample. |
| Coverage and observation quality | Track retrieval success, source availability and relevant cloud/quality context at the intended scale | Distinguish real zero, no retrieval and obscured observation; measure interval coverage across activity/season/sensor regimes. |
| Scale and geographic transport | Test additional independently chosen fire regimes; compare fixed/simple baselines and region-specific fits | Evidence before extending historical reconstruction to arbitrary polygons or more countries. Worldwide recent observations can remain available meanwhile. |
| Human comprehension pilot | Run the existing task protocol with real students/practitioners: identify source, date, observed vs estimated, interval meaning and next action | Anonymized task outcomes, observed interpretation errors, consent and documented revisions. No invented participant rows or adoption claims. |
| Prospective outlooks | Archive actual issue-time weather and model outputs; use rolling-origin fits and independently calibrated intervals | Forecast error/coverage against honest baselines, alert usefulness and delivery monitoring before operational warning claims. |
| Field/mobile resilience | Test physical low-end Android/iPhone, limited connectivity and assistive technologies | Recorded device/browser results, memory/interaction performance and accessible task completion; emulation is only preliminary. |

## Practical product priorities after review

Keep the country watchlist and dated brief as the main repeat-use journey. Add notifications or agency integrations only if a practitioner identifies a decision they improve and the source quality supports it. Broad multilingual support should follow reviewed translations; automatically generated scientific language is not evidence of accessibility.

Arbitrary-polygon input is optional in the challenge and is deliberately withheld for historical inference until the model is validated at that scale. The current globe provides global recent-data discovery, and four explicit packages provide historical evidence. No extra visual control should imply unsupported local precision.

## Suggested academic review

We would value a decision on one primary research question, the final evaluation design and one stakeholder task. A mentor could help recruit a remote-sensing reviewer, identify an appropriate practitioner and review the distinction between reconstruction and forecasting. A paper should follow the missing independent evidence rather than assume it from a polished interface.

## Submission and claims

Use the [current official research note](GLOBAL_JUDGING_RESEARCH.md), [project-page draft](submission/PROJECT_PAGE_DRAFT.md), [sources](SOURCES_AND_SUBMISSION.md) and [assistance disclosure](DATA_AND_AI_DISCLOSURE.md). The demo alternatives satisfy the file-format limits, but the team still needs to review names, public links, originality/credits and the official Submit for Judging confirmation. The older local video exceeds the global short-demo limit.

The original full proposal is preserved in the archive. [Implementation status](IMPLEMENTATION_STATUS.md) maps each item to the current delivery or the evidence that remains uncollected.
