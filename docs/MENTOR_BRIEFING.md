# Reading guide for our mentor

**Agun Panjika · Team KUETaguns · 15 November 2026**

The shortest route is the [live application](https://polymathicx.github.io/Agun-Panjika/) and [seven-slide overview](pdf/GLOBAL_DEMO_SLIDES.pdf). The [project-brief PDF](pdf/PROJECT_BRIEF.pdf) explains the whole project; the [global-roadmap PDF](pdf/GLOBAL_EXTENSION_PLAN.pdf) separates delivered extensions from research still requiring evidence.

For technical review, read the [model card](GLOBAL_EVALUATION.md) and inspect a [public area package](../web/public/data/global/). `python -m pipeline.global_cases --from-packages` refits the four experiments without a NASA key. It reproduces model fitting and evaluation from public aggregated features, not an independent raw-data audit.

## Feedback we would value most

1. **Evaluation design:** What new locked temporal/geographic test would support a defensible reconstruction claim, given that the current test years were known during development?
2. **Failure analysis:** How should we test the tree-support guard, annual updating, Chin's stronger monthly baseline and seasonal and regional interpretation on a new locked period?
3. **Uncertainty and filtering:** How should we validate interval calibration, observation completeness and industrial-source filtering independently?
4. **Practical use:** Could a remote-sensing practitioner or land manager help us run a small comprehension/workflow pilot? We have a task protocol but no completed field study.

The worldwide view shows recent observations across 242 countries/territories. It does not claim worldwide calibrated historical reconstruction. Forecasts remain experimental; following-week reconstruction features and observed-future-weather experiments cannot establish prospective skill.

The [verification record](VERIFICATION.md), [delivery checklist](IMPLEMENTATION_STATUS.md), [earlier scientific audit](SCIENTIFIC_REVIEW.md) and [source/assistance credits](SOURCES_AND_SUBMISSION.md) support a deeper review. Text feedback on any one of the questions above would be useful before arranging a meeting.
