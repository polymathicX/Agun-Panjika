# Academic review guide

**Agun Panjika ? Team KUETaguns, KUET ? 29 October 2026**

This package explains the working project, its evidence and the next research questions. The proposed extensions are future work. The scientific numbers are saved internal results; a documentation refresh does not create new independent validation.

## Suggested reading order

| Time / purpose | Material |
| --- | --- |
| Two-minute orientation | [Repository overview](../README.md) and [project video](https://youtu.be/9FMIzcXhqB4) |
| Complete technical understanding | [Project brief](PROJECT_BRIEF.md), including data, methods, results and limits |
| Assess scientific validity | [Scientific review](SCIENTIFIC_REVIEW.md) and [validation notebook](../notebooks/validation.ipynb) |
| Discuss the global-round direction | [Global extension plan](GLOBAL_EXTENSION_PLAN.md) |
| Reproduce or inspect the prototype | [Verification instructions](VERIFICATION.md), [current captures/figures](review/README.md) and [recorded checks](review/verification-2026-10-29.json) |
| Check attribution and submission context | [Sources and submission notes](SOURCES_AND_SUBMISSION.md) |

## The central idea

MODIS and VIIRS have different observation characteristics. A raw joined history can therefore make a sensor change look like a change in burning. Agun Panjika reconstructs a comparable weekly detection history, shows uncertainty and connects it to a bilingual fire calendar. The intended user question is: **?Is this fire season normal for this area??**

Bangladesh is the present case study. The application includes five analysis regions, 64 districts and CHT calendars for 25 upazilas and 124 unions. Current merged features include charts, map/sphere controls, local calendars, reports, shared navigation state, a guided demo, recovery behavior and cached offline access.

## Current evidence at a glance

| Observation | Interpretation |
| --- | --- |
| Internal weekly national MAE 36.964 versus 49.450 for a fitted factor, over 2012?2025 | Promising reconstruction result; stronger independent evaluation is still needed |
| ESA continuity and NOAA successor comparisons | Aggregate plausibility/continuity checks, not ground-truth wildfire validation |
| 59 Python tests, production typecheck/build and 10 browser groups passed | Working behavior under the recorded local setup, not field or operational performance |
| No completed field-user study; committed observations end 9 October | Usability, impact and freshness are open work |

## Questions for academic guidance

1. **Evaluation independence:** How should temporal splits, model selection, static filtering and uncertainty calibration be separated? Is a locked final-year or geographic holdout the best next experiment?
2. **Scientific contribution:** Which prior work and strong baselines should frame the contribution? What ablations are necessary before a research claim?
3. **Transfer:** Should the next milestone be a stronger Bangladesh case or an independently evaluated second-country case? Which contrasting setting would test the method meaningfully?
4. **Practical use:** Which forest/community decision should the interface support? Could a relevant practitioner or remote-sensing reviewer help shape a small pilot?
5. **Publication potential:** After the missing evidence is collected, is there a focused research question worth developing into a paper or technical report?

## Specific issues worth reviewing

- Reconstruction uses a following-week MODIS feature, so retrospective availability must be distinguished from issue-time prediction.
- The current interval-coverage procedure is not strictly nested; calibration residual models may include the evaluation year in training.
- Forecast hindcasts use an already-reconstructed record, and the stronger weather experiment uses observed future FWI. Neither establishes prospective operational skill.
- Main/local/neighbour/point products need consistent handover and missing-data tests, especially beyond the currently selected identity bridge.
- Historical small-area estimates are apportioned. Arbitrary polygons and global validity cannot be obtained solely by adding a drawing control.
- User-study rows remain blank. Local wording, union names and uncertainty comprehension need actual participant review.

The [scientific review](SCIENTIFIC_REVIEW.md) identifies exact source locations. The [roadmap](GLOBAL_EXTENSION_PLAN.md) proposes interventions and exit criteria rather than treating these questions as already solved.

## What feedback would enable

A useful first outcome is an agreed validation protocol, one primary user journey and the next bounded deliverable. That could lead to a reproducible transfer case, a completed practitioner/comprehension pilot, or a stronger independent Bangladesh benchmark. Team responsibilities and timing should follow those decisions.

The repository and documentation can be reviewed without running the app. Existing static exports support local startup without a FIRMS key. A working public app deployment has not yet been verified; the latest inspected hosted refresh failed. See [verification](VERIFICATION.md) for the dated status and limits.
