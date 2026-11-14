<div align="center">

# Agun Panjika · আগুন পঞ্জিকা

**A fire history you can inspect.**

Team **KUETaguns** · NASA Space Apps Challenge 2026<br>
*Harmonization of MODIS and VIIRS Hot Spots*

[Open the app](https://polymathicx.github.io/Agun-Panjika/) · [29-second demo](https://polymathicx.github.io/Agun-Panjika/demo/) · [Seven slides](docs/pdf/GLOBAL_DEMO_SLIDES.pdf)

[Project brief PDF](docs/pdf/PROJECT_BRIEF.pdf) · [Global roadmap PDF](docs/pdf/GLOBAL_EXTENSION_PLAN.pdf) · [Model card](docs/GLOBAL_EVALUATION.md) · [Mentor reading guide](docs/MENTOR_BRIEFING.md)

[Video teammate handoff: story, recording links and assets](docs/submission/VIDEO_TEAMMATE_HANDOFF.md)

<img src="docs/review/screenshots/world-hero.png" alt="Actual Soft Earth interface with textured interactive globe, recent NASA observations and satellite-specific counts" width="100%">

</div>

Agun Panjika brings two questions together: **What are satellites observing in my country now?** And **how can we compare fire activity when the observing instruments change?** Spin the Earth, zoom in and tap a country. Then inspect a dated observation brief or explore a historical calendar whose sensor correction can be checked against real VIIRS measurements.

MODIS and VIIRS have different resolutions and sensitivities. Joining raw counts can make a change of instrument look like a change in burning. Our historical pipeline estimates earlier weekly activity on a VIIRS S-NPP detection scale and keeps observations, estimates and uncertainty distinguishable.

> **15 November 2026 release:** recent observations cover **242 Natural Earth countries and territories**, with MODIS, NOAA-20 and NOAA-21 kept separate. Historical reconstruction is evaluated in **four South Asian areas**, not worldwide. The Soft Earth design remains. Static Earth/cloud textures are geographic context, not live weather. The app shows each feed's observation window and flags stale snapshots.

## Start with a place

First visit? Choose **Show me around** for an optional, action-led eight-step tutorial. It teaches the real controls and can be replayed later.

1. **Spin, zoom and tap.** Explore recent observations on a textured 3D Earth. No country search is needed; keyboard selection and a flat map are available as alternatives.
2. **Read the source.** Change the satellite or day, play the timeline and inspect the country's counts. Detections are not unique fires; repeat observations and industrial heat can remain.
3. **Keep the evidence.** Save a country locally, export its dated PNG/JSON/daily CSV, or open a supported historical case and reveal the reference observations.
4. **Return on a phone.** Install the PWA through the browser's install/share menu. Global summaries and historical cases work offline after installation; country points are cached on visit. New observations and external map tiles need connectivity.

<table><tr>
<td width="67%"><img src="docs/review/screenshots/global-experiment.png" alt="Actual sensor-switch experiment showing model, factor, raw join and withheld VIIRS reference" width="100%"><br><b>Inspect the correction.</b> Choose a test year, move the sensor-switch week and reveal VIIRS.</td>
<td><img src="docs/review/screenshots/world-phone.png" alt="Actual responsive phone interface with the interactive Earth" width="100%"><br><b>Keep a country close.</b> Local watchlist, dated reports and cached reference data.</td>
</tr></table>

## What the project delivers

| Capability | Scope and interpretation |
| --- | --- |
| Worldwide observations | Recent seven-day NASA FIRMS feeds; 242 country/territory summaries, daily playback, per-satellite totals, source timestamps and SHA-256 provenance |
| Historical evidence workbench | Bangladesh, Nepal, Chin in Myanmar, and Punjab–Haryana in India; annual past-only temporal experiments, full baselines, interval coverage, source-quality flags, calendars and exports |
| Bangladesh fire almanac | Weekly history from 2001, five analysis regions, 64 districts, seasonal normals, local CHT calendars, maps and sensor comparisons |
| Successor continuity | Shared monthly correction and handover/outage rules for main/local/neighbour series; actual zero and missing source stay distinct |
| Experimental research views | Two-week outlooks, fire-weather context, ESA burned-area comparison and cross-border/aerosol timing; expired outlooks are suppressed |
| Access | English/Bangla, light/dark themes, reduced motion, keyboard/table alternatives, responsive layout and installable PWA |
| Public evidence | Refit-ready feature files, model card, academic briefs, seven-slide deck, 29-second captioned demo and submission-page draft |

The intended benefit is easier access to comparable fire-season evidence for students, communities, researchers and land managers. **A practitioner pilot, adoption and measured prevention benefits have not been established.** This is a research and communication prototype, not an emergency warning service.

## What changed after validation

The updated workflow retrains once per historical test year using only older labels, and guards against direct-count trees saturating beyond their fitted MODIS range. NASA-documented acquisition gaps are flagged separately. **All 156 original test weeks remain in this before/after comparison.**

| Area | Previous release | Updated model | Same-workflow factor | Monthly factors |
| --- | ---: | ---: | ---: | ---: |
| Bangladesh | 45.970 | 46.926 | 58.316 | 49.839 |
| Nepal | 113.001 | 115.232 | 158.516 | 131.390 |
| Chin, Myanmar | 136.414 | 88.530 | 97.283 | 75.525 |
| Punjab & Haryana, India | 313.525 | 246.265 | 262.017 | 291.339 |

Chin's weekly MAE falls **35.10%** and Punjab–Haryana's **21.45%** against the previous release. Chin's monthly baseline is still better; Bangladesh and Nepal are about 2% worse than before. We keep those outcomes visible.

<img src="docs/latex/figures/global-transfer.png" alt="Change from the previous release on all 156 original weeks: Chin and Punjab improve, Bangladesh and Nepal worsen slightly" width="800">

For each year Y, point fitting uses 2013 through Y−2 and interval calibration uses Y−1. The app also compares every method on the **same 142 weeks** after flagging long NASA acquisition outages, while retaining raw counts and all-week scores. Partial reference weeks appear as gaps, not as complete zero observations. These are known development replays, not an untouched final holdout or worldwide calibrated accuracy.

[Protocol, all results and limitations](docs/GLOBAL_EVALUATION.md) · [What caused the errors and the rejected experiments](docs/MODEL_OPTIMIZATION_RESEARCH.md) · [Original frozen benchmark](web/public/data/global/v1/)


## Run locally

Frontend: **Node.js 22.12+**. Python is unnecessary to view committed exports.

```powershell
cd web
npm ci
npm run dev
```

Open the URL Vite prints. For a production/PWA check, run `npm run build`, then `npm run preview -- --host 127.0.0.1 --port 4173 --strictPort`. PWA installation requires HTTPS or localhost. The browser receives no FIRMS secret.

Python: **3.11+**. From the repository root:

```powershell
python -m pip install -e ".[dev]"
python -m pipeline.global_cases --from-packages
python -m pytest -q
python -m ruff check pipeline tests
```

`--from-packages` refits all four experiments from checksum-verified public feature CSVs without downloading raw observations or using a key. It does not independently rebuild the raw-to-feature preprocessing. Numerical differences between library/platform versions remain possible. [Complete reproduction and checks](docs/VERIFICATION.md).

## Refresh and free hosting

The app is a static site on **GitHub Pages**. `.github/workflows/daily.yml` publishes pushes to `main`. Its six-hour schedule refreshes worldwide public feeds; **Actions → Publish app and refresh NASA observations → Run workflow → refresh_data** also refreshes them. The first hosted global refresh and deployment succeeded on 14 November ([run](https://github.com/polymathicX/Agun-Panjika/actions/runs/43594804856)). Failed data retrieval fails explicitly; ordinary code publishing does not depend on retraining the science pipeline.

```powershell
python -m pipeline.world_snapshot
# Or reproduce the locally cached source snapshot:
python -m pipeline.world_snapshot --cached
```

Bangladesh/scientific regeneration is a separate, heavier process: `python -m pipeline.run_all --help`. Store optional `FIRMS_MAP_KEY` only in the ignored root `.env` or CI secrets. Raw/intermediate files are ignored. Feature fixtures and browser exports are public. Scheduled builds may serve newer recent observations than the committed repository snapshot.

## How it is built

```mermaid
flowchart LR
  A[NASA FIRMS archives and public recent feeds] --> B[Confidence and geography rules]
  B --> C[Recent country summaries and sampled points]
  B --> D[Weekly sensor features]
  D --> E[Reconstruction, baselines and calibration]
  E --> F[Historical evidence packages]
  C --> G[Static React application and PWA]
  F --> G
  G --> H[Interactive Earth, calendars and dated exports]
```

`pipeline/` contains ingestion, geography, aggregation and evaluation. `web/` contains React/TypeScript, Three.js, D3, MapLibre and the service worker. `web/public/data/` is the export contract. `tests/` and `web/scripts/upgrade/` verify scientific and browser behavior. `docs/` contains the mentor and submission package. [Graphify map](graphify-out/GRAPH_REPORT.md).

## Read, review or present

| Material | Purpose |
| --- | --- |
| [Project brief](docs/PROJECT_BRIEF.md) · [PDF](docs/pdf/PROJECT_BRIEF.pdf) | Complete product, methods, sources, results, architecture and limits |
| [Global roadmap](docs/GLOBAL_EXTENSION_PLAN.md) · [PDF](docs/pdf/GLOBAL_EXTENSION_PLAN.pdf) | Delivered extensions, remaining research and acceptance criteria |
| [Model card](docs/GLOBAL_EVALUATION.md) | Reproducible protocol and complete failure reporting |
| [Mentor guide](docs/MENTOR_BRIEFING.md) | Reading order and concrete academic questions |
| [Verification](docs/VERIFICATION.md) | Executed checks, deployment evidence and reproduction |
| [29-second demo](https://polymathicx.github.io/Agun-Panjika/demo/) · [seven-slide PDF](docs/pdf/GLOBAL_DEMO_SLIDES.pdf) | English demo alternatives; submit one compliant demo format |
| [Project-page draft](docs/submission/PROJECT_PAGE_DRAFT.md) | Submission fields, team, data sources and assistance statement |
| [Sources and credits](docs/SOURCES_AND_SUBMISSION.md) · [AI disclosure](docs/DATA_AND_AI_DISCLOSURE.md) | Judge-visible provenance, software and assistance acknowledgments |
| [Implementation status](docs/IMPLEMENTATION_STATUS.md) · [all documents](docs/README.md) | Delivery record and original plans |

The [older 2:42 local video](https://youtu.be/9FMIzcXhqB4) remains background material; it is not the compliant global short demo. The team must review the project page, confirm membership and click **Submit for Judging** in the official interface. Publishing this repository does not perform that submission.

## Team and credits

**Sohaib Hasan Niloy** (Team Owner), **Ayesha Mehereen**, **Sarwad Hasan Siddiqui**, **Adiba Tahsin**, **Abdullah Al Saif**, **Md. Rafsani Shazid**. KUETaguns, Bangladesh.

We acknowledge NASA FIRMS, part of LANCE and ESDIS, for the fire observations. NASA POWER, ESA Fire_cci, geoBoundaries, Natural Earth and other credited sources support the research/geography. Earth/cloud textures: [Solar System Scope](https://www.solarsystemscope.com/textures/), [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). NASA does not endorse this project. [Full attribution](docs/SOURCES_AND_SUBMISSION.md).

AI assisted implementation, review, plotting, editorial work and demo assembly. NASA observations remain measured source data; NB/LightGBM outputs are labeled estimates. [Disclosure](docs/DATA_AND_AI_DISCLOSURE.md). Original code is [Apache 2.0](LICENSE); third-party assets retain their terms ([NOTICE](NOTICE), [dependency notices](web/public/THIRD_PARTY_NOTICES.txt)).
