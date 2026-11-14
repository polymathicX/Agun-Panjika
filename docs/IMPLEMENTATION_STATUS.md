# Global roadmap: delivery and evidence

15 November 2026. This is the acceptance record for the [original global plan](GLOBAL_EXTENSION_PLAN.md). It separates software delivered in this hackathon build from evidence that needs people or future observations.

| Original plan item | Current delivery | Evidence / remaining condition |
| --- | --- | --- |
| Reliable dated public product | Worldwide app, dated source windows, stale-snapshot notice, expired-outlook suppression, public deployment and a refresh workflow separate from static publishing | Browser and deployment evidence in [verification](VERIFICATION.md). Each feed keeps its own date; cloud/overpass completeness is not claimed. |
| Independent evaluation/calibration | Four reproducible annual walk-forward cases with chronological point fitting, independent prior-year calibration, source-quality flags and all-week comparisons; full baseline and failure tables | [Protocol and results](GLOBAL_EVALUATION.md). A truly untouched final holdout and fully nested assessment of the older LOYO model remain research work. |
| Additional evaluated areas | Nepal, Chin and Punjab–Haryana alongside Bangladesh | Each area is fitted separately; the updated workflow beats a matched fitted factor in all four. Chin’s monthly baseline is still better; the original failures and rejected alternatives remain archived. These are four South Asian cases, not worldwide calibrated accuracy. |
| Sensor-transition comparison | Test-year/week controls, raw join/factor/model curves, revealable VIIRS reference, uncertainty and CSV/JSON/PNG/PDF outputs | Actual precomputed predictions and calibration bounds from each year's past-only vintage. |
| Consistent successor handover | Shared factor/source selection in main, local and neighbour records; weekly point provenance; exported bridge bounds; zero/outage tests | [Continuity tests](../tests/test_continuity.py). Coarse sensor-span coverage assumptions remain explicit. |
| Supported-area selection | Country selection by spinning/tapping/zooming the 3D Earth; keyboard/flat-map alternatives; four historical area packages | Recent observations cover 242 Natural Earth countries/territories. Custom polygon reconstruction remains unsupported: the region-trained model has not been validated at arbitrary scales. The official challenge makes drawn AOI optional. |
| Shareable dated evidence | Historical case PNG/JSON/CSV/print briefs with raw values, acquisition-quality flags and model vintages; recent-country PNG/JSON/daily CSV; source windows, uncertainty/limits and reproducible links | Scientific exports distinguish observed counts and model outputs. Country assignment uses generalized boundaries; unassigned points are reported. |
| Useful mobile experience | Optional eight-step introduction, 85 on-demand help topics across all nine pages, plain-language data readings, shaped skeletons, reliable history/retry behavior, responsive globe, reduced-motion behavior, bounded point rendering, local watchlist, installable PWA and offline reference packages | Chromium installation criteria and emulated mobile checks. Physical Android/iPhone and assistive-technology testing are still needed; no push-notification delivery is claimed. |
| Stakeholder/comprehension pilot | Existing task protocol and acceptance questions retained, with uncertainty/source interpretation now directly testable in the product | **Not completed.** Real participants/practitioners must supply responses. No adoption, comprehension score, fires prevented or lives saved is invented. |
| Industrial-filter validation | Current heuristic documented; portable replay avoids learned static-cell decisions | **Not independently validated.** New blind positive/negative/uncertain labels and retained-fire sensitivity are needed. |
| Operational warning integration | Experimental outlooks identified and expired products withheld | **Not operationally established.** Need issue-time forecasts, prospective evaluation, domain partnership and delivery monitoring. |
| Submission presentation | Seven English slides, a captioned video under 30 seconds, project-page draft, sources and visible assistance disclosure | Team must review and perform the official submission. Saving files or pushing Git does not click Submit for Judging. |

## Why the scope stops here

Worldwide observations are useful without pretending every location has a calibrated historical model. The current product lets a person inspect their country, revisit a watchlist, compare days, and share a dated source. The historical work adds something more demanding: a record whose sensor correction can be checked. Both are visible, with their different limits.

Arbitrary-polygon precision, independently verified field impact, blind labels and future forecast performance cannot be created by a UI change. Those remain concrete research tasks for the mentor and team. The evidence scope is documented in the model card and research roadmap.

## Pilot to run with real people

Use five participants, including a domain practitioner if possible. Ask each to: select their country on the globe; identify the feed/date; distinguish detections from unique fires; interpret an observed versus reconstructed calendar; reveal a test year's reference; and share a brief preserving uncertainty. Record correctness, time, misunderstanding and the action they would take. Proposed targets remain four of five correct interpretations and a median response under ten seconds; no results have been collected in this release.

## Branch delivery

The science foundation, global evidence workbench, world/PWA and release fixes have separate branches and explicit merges to `main`. The final storytelling/package branch holds the current presentation and release documentation. Commits use the repository's configured user identity; no assistant coauthor trailer is added.
