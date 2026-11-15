# Data directory and interpretation guide

**15 November 2026** · [Model card](GLOBAL_EVALUATION.md) · [Sources and credits](SOURCES_AND_SUBMISSION.md) · [Reproduction](DEVELOPMENT.md)

The browser consumes static exports in [`web/public/data/`](../web/public/data/). Raw downloads and most intermediates are ignored under `data/`. Keep the source dates and units with any reused file. No browser API key is required.

## Recent observations worldwide

| Path | Contents |
| --- | --- |
| [world/summary.json](../web/public/data/world/summary.json) | 242 country/territory summaries, separate satellite/daily totals, build time, source windows, retrieval URLs, hashes and unassigned-row accounting |
| [world/countries.geojson](../web/public/data/world/countries.geojson) | Natural Earth generalized country/territory geometry at 1:50 million map scale, used for selection and assignment |
| [world/](../web/public/data/world/) `{country}-{source}.json` | Per-country sampled point packages; source is `modis`, `noaa20` or `noaa21` |
| `world/overview-{source}.json` | Sampled global point views for the selected satellite |

Counts use all retained rows after the pipeline's confidence rules. Drawn points are capped samples for browser performance. Separate satellites can observe the same heat source; summing their totals does not yield unique fires. Boundaries, clouds, retrieval/overpass coverage and industrial heat limit interpretation. Static Earth/cloud textures are unrelated to current cloud conditions.

The source feed is rolling seven-day data, with its actual observation window exported. A scheduled deployment can serve newer data than the Git snapshot. [Refresh behavior](DEPLOYMENT.md).

## Four evaluated historical areas

| Path | Contents |
| --- | --- |
| [global/catalog.json](../web/public/data/global/catalog.json) | Bangladesh, Nepal, Chin and Punjab–Haryana package index and method metadata |
| [Bangladesh](../web/public/data/global/bangladesh.json) · [Nepal](../web/public/data/global/nepal.json) · [Chin](../web/public/data/global/chin.json) · [Punjab–Haryana](../web/public/data/global/punjab_haryana.json) | Weekly history, yearly past-only test vintages, predictions/intervals, baseline scores, source quality and provenance |
| [global/features/](../web/public/data/global/features/) | Public aggregated region-week feature CSVs for no-key model/evaluation reproduction |
| [global/reference_quality.json](../web/public/data/global/reference_quality.json) | Versioned NASA acquisition intervals; checksum-matched to [pipeline source](../pipeline/reference_quality.json) |
| [global/v1/](../web/public/data/global/v1/) | Initial development experiment archive, dated 14 November; current results are the parent-directory packages |

The target scale is VIIRS S-NPP weekly detections. Each target year uses fitting through Y−2 and interval calibration on Y−1. Following-week features support retrospective reconstruction. Quality flags distinguish acquisition loss from a valid reference; 156 raw test weeks and 142 comparable weeks per area are both reported. The known historical replay is not a new untouched evaluation. Read the [complete protocol](GLOBAL_EVALUATION.md) before extracting a headline score.

## Bangladesh almanac and supporting analysis

| Path | Contents and scope |
| --- | --- |
| [manifest.json](../web/public/data/manifest.json) | Main export index: five analysis regions, 64 districts, source/build metadata |
| [national.json](../web/public/data/national.json) · [region/](../web/public/data/region/) | Weekly records, seasonal context and regional summaries |
| [districts/](../web/public/data/districts/) · [districts.geojson](../web/public/data/districts.geojson) | District series and map geometry |
| [local/](../web/public/data/local/) | CHT local calendars; early small-area values include apportioned estimates |
| [points/](../web/public/data/points/) · [static_cells.json](../web/public/data/static_cells.json) | Selected-period observation coordinates/source metadata and heuristic static-source context |
| [bridge.json](../web/public/data/bridge.json) | Successor handover/correction metadata and uncertainty |
| [validation.json](../web/public/data/validation.json) · [partner.json](../web/public/data/partner.json) | Bangladesh model checks and separate ESA burned-area plausibility context |
| [fireweather.json](../web/public/data/fireweather.json) · [forecast.json](../web/public/data/forecast.json) | Weather context and dated experimental outlooks; not an operational warning service |
| [neighbours.json](../web/public/data/neighbours.json) | Neighbouring seasonal and aerosol context, not a causal transport attribution |
| [download/](../web/public/data/download/) | Tabular exports exposed through the Method page |
| [alerts_cap.xml](../web/public/data/alerts_cap.xml) · [English RSS](../web/public/data/alerts.rss) · [Bangla RSS](../web/public/data/alerts_bn.rss) | Experimental research export formats; file presence does not establish an operational delivery service |

The older weather-assisted Bangladesh model and the portable detector-only four-case model are distinct experiments. Their validation protocols and metrics must not be interchanged. The [project brief](PROJECT_BRIEF.md) and [model card](GLOBAL_EVALUATION.md) explain the distinction.

## Contracts and reuse

- Python schema: [pipeline/schema/region.schema.json](../pipeline/schema/region.schema.json). Frontend contracts: [types.ts](../web/src/lib/types.ts) and [data.ts](../web/src/lib/data.ts).
- Preserve source, date, scale, geography and quality flags. A detection count, modeled VIIRS-scale count and burned area are different quantities.
- Preserve null/missing versus zero. Incomplete references and expired outlooks must not be converted into reassuring values.
- Include hashes and interval meaning when sharing scientific evidence. Nominal-80% bounds have measured coverage reported in the model card, not a guaranteed probability for every week.
- Public feature refitting reproduces the model/evaluation from aggregated inputs. Auditing raw-to-feature construction requires the raw sources and preprocessing separately.

Original code uses Apache 2.0; source data and third-party assets retain their terms. [Attribution and upstream links](SOURCES_AND_SUBMISSION.md) · [Assistance disclosure](DATA_AND_AI_DISCLOSURE.md).
