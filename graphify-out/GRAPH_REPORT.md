# Graph Report - Harmonic-Fire  (2026-10-29)

## Corpus Check
- 267 files · ~100,429 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 17 file(s) not represented in the graph (top: .csv 5, .tex 3, .css 3)

## Summary
- 1279 nodes · 2668 edges · 101 communities (85 shown, 16 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 41 edges (avg confidence: 0.88)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `fa6b7e4e`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- pandas
- export.py
- Ingestion and Neighbour Data
- Browser Regression Checks
- Refresh and Pages Deployment
- Scientific Charts and Comparisons
- ndarray
- Outlooks and Alert Feeds
- Application Navigation and Language
- Weekly Fire Calendars
- Data Loading and Map
- Home.tsx
- DataFrame
- Outlook Data Contracts
- Historical Normals and Reconstruction
- hero.py
- Fire Weather Index
- Geographic Sphere and Selection
- Region Document Structure
- Annual Series Schema
- Frontend Runtime Dependencies
- TypeScript Compiler Settings
- devDependencies
- Agun Panjika: 240-second video script
- Weekly Detection Aggregation
- Proposed global extension and evidence plan
- Successor Sensor Continuity
- Web Package Metadata
- Export Manifest Metadata
- Season Calendar Schema
- Region Identity Schema
- Season Status Schema
- Sensor Freshness Metadata
- interval_coverage
- Frontend Build Commands
- LightGBM Validation Summary
- Vite Build Configuration
- Country Metadata
- Ensemble Validation Summary
- Monthly Factor Validation
- Single Factor Validation
- Negative Binomial Validation
- Fixed Factor Validation
- ISO Week Schema
- Upper Interval Schema
- Lower Interval Schema
- MODIS Count Schema
- Static Removal Schema
- VIIRS Count Schema
- Weekly Series Schema
- ISO Year Schema
- Agun Panjika: project brief for academic review
- Agun Panjika — Product Requirements Document
- harmonise.py
- External checks for the mentor reply
- Python Package Metadata
- Agun Panjika — Hot Spots Implementation Plan
- docs/README.md
- Agun Panjika · আগুন পঞ্জিকা
- Product and presentation research for the mentor briefing
- Agun Panjika Upgrade Progress
- feat/3d-geospatial-experience
- feat/accessibility-performance
- feat/charts-calendar-polish
- feat/demo-storytelling
- feat/loading-reliability
- feat/map-exploration
- feat/navigation-state
- feat/ui-design-system
- Agun Panjika: video and story ideas
- Scientific evidence for the mentor briefing
- numpy
- Harmonic-Fire / Agun Panjika
- Academic review guide
- Scientific review: implementation, evidence and open questions
- SERIAL_MERGE_REVIEW.md
- Typeset mentor reports
- Final regression matrix: original versus preview
- Verification and reproduction
- PRDFactor
- Sources, credits and submission notes
- Current application captures and scientific figures
- Agun Panjika: user test protocol (PRD success metric)
- json
- Documentation
- globe-architecture.md
- kilns.py
- local.py
- TerraFactor
- geo/README.md
- review_figures.py
- three
- @types/d3-format
- @types/react
- @types/react-dom
- earth/README.md

## God Nodes (most connected - your core abstractions)
1. `useFmt()` - 61 edges
2. `react` - 26 edges
3. `main()` - 22 edges
4. `useAsync()` - 21 edges
5. `App()` - 20 edges
6. `RequestStatus()` - 20 edges
7. `useWidth()` - 19 edges
8. `GlobePanel()` - 18 edges
9. `useTooltip()` - 17 edges
10. `SeasonView()` - 17 edges

## Surprising Connections (you probably didn't know these)
- `Frontend spec` --references--> `series()`  [INFERRED]
  docs/Agun Panjika — Product Requirements Document.md → pipeline/neighbours.py
- `Important limitations and improvement opportunities` --references--> `interval_coverage()`  [INFERRED]
  docs/MENTOR_SCIENCE_RESEARCH.md → pipeline/harmonise.py
- `Important limitations and improvement opportunities` --references--> `interval_coverage()`  [INFERRED]
  docs/SCIENTIFIC_REVIEW.md → pipeline/harmonise.py
- `Important limitations and improvement opportunities` --references--> `series()`  [INFERRED]
  docs/MENTOR_SCIENCE_RESEARCH.md → pipeline/neighbours.py
- `Important limitations and improvement opportunities` --references--> `series()`  [INFERRED]
  docs/SCIENTIFIC_REVIEW.md → pipeline/neighbours.py

## Import Cycles
- None detected.

## Communities (101 total, 16 thin omitted)

### Community 0 - "pandas"
Cohesion: 0.24
Nodes (14): annual_national(), fig_calendar(), fig_feature_importance(), fig_fire_weather(), fig_harmonised(), fig_hills(), fig_monthly_ratio(), fig_outlook_skill() (+6 more)

### Community 1 - "export.py"
Cohesion: 0.15
Nodes (17): Important limitations and improvement opportunities, Important limitations and improvement opportunities, annual_block(), _dump(), main(), _num(), rain_block(), unit_json() (+9 more)

### Community 2 - "Ingestion and Neighbour Data"
Cohesion: 0.07
Nodes (25): main(), EnsembleModel, append_api(), append_api_range(), data_availability(), dedupe(), fetch_api(), fetch_api_range() (+17 more)

### Community 3 - "Browser Regression Checks"
Cohesion: 0.07
Nodes (25): playwright, grid, [base, output = 'test-results/upgrade'], [base, output = 'test-results/upgrade'], out, publicData, canvas, errors (+17 more)

### Community 4 - "Refresh and Pages Deployment"
Cohesion: 0.05
Nodes (40): runs-on, steps, concurrency, cancel-in-progress, group, environment, needs, runs-on (+32 more)

### Community 5 - "Scientific Charts and Comparisons"
Cohesion: 0.12
Nodes (36): d3-scale, d3-shape, AnnualChart(), Props, SERIES_STYLE, EarthCanvas(), PartnerCheck(), Stat() (+28 more)

### Community 6 - "ndarray"
Cohesion: 0.25
Nodes (4): _bin(), ConformalBands, _cq(), test_conformal_quantile_is_conservative_for_small_n()

### Community 7 - "Outlooks and Alert Feeds"
Cohesion: 0.12
Nodes (21): add_climatology(), _auc(), _bn(), build_table(), _clf(), conformal_bounds(), feed_items(), hindcast() (+13 more)

### Community 8 - "Application Navigation and Language"
Cohesion: 0.11
Nodes (24): react, App(), Borders, Home, MapScreen, Method, OutlookScreen, Panjika (+16 more)

### Community 9 - "Weekly Fire Calendars"
Cohesion: 0.18
Nodes (24): CalendarHeatmap(), CalendarLegend(), CalendarTable(), Props, WeekTip(), loadLocal(), loadRegion(), annual() (+16 more)

### Community 10 - "Data Loading and Map"
Cohesion: 0.12
Nodes (29): RequestStatus(), cache, dataUrl(), fetchJson(), loadBridge(), loadDistrictYear(), loadGeo(), loadManifest() (+21 more)

### Community 11 - "Home.tsx"
Cohesion: 0.20
Nodes (10): react-i18next, LevelBadge(), LevelIcon(), ShareButton(), MONTHS_BN, MONTHS_EN, useAsync(), LEVEL_COLOR (+2 more)

### Community 12 - "DataFrame"
Cohesion: 0.19
Nodes (5): GBMModel, MonthlyFactors, NegBinModel, fit_at(), TerraModel

### Community 13 - "Outlook Data Contracts"
Cohesion: 0.15
Nodes (21): AlertList(), DANGER_COLOR, DangerChart(), OUTLOOK_COLOR, OutlookCard(), outlookMeaningful(), loadFireWeather(), loadForecast() (+13 more)

### Community 14 - "Historical Normals and Reconstruction"
Cohesion: 0.19
Nodes (10): _bridge_bands(), _bridged(), build_harmonised(), complete_years(), level_for(), main(), percentiles_by_week(), _unit_tables() (+2 more)

### Community 15 - "hero.py"
Cohesion: 0.39
Nodes (4): font(), main(), rounded(), shadow()

### Community 16 - "Fire Weather Index"
Cohesion: 0.17
Nodes (17): bui_of(), danger_class(), dc_step(), dmc_step(), ffmc_step(), forecast_inputs(), fwi_of(), isi_of() (+9 more)

### Community 17 - "Geographic Sphere and Selection"
Cohesion: 0.14
Nodes (21): Earth3D(), earthPosition(), Props, SceneHandle, Props, Earth3D, EarthCanvas, GlobePanel() (+13 more)

### Community 18 - "Region Document Structure"
Cohesion: 0.12
Nodes (16): type, required, type, required, type, properties, annual, handover (+8 more)

### Community 19 - "Annual Series Schema"
Cohesion: 0.13
Nodes (17): items, minimum, type, additionalProperties, properties, required, type, minimum (+9 more)

### Community 20 - "Frontend Runtime Dependencies"
Cohesion: 0.11
Nodes (19): d3-array, d3-format, d3-geo, html-to-image, i18next, maplibre-gl, react-dom, dependencies (+11 more)

### Community 21 - "TypeScript Compiler Settings"
Cohesion: 0.12
Nodes (16): compilerOptions, isolatedModules, jsx, lib, module, moduleResolution, noEmit, noFallthroughCasesInSwitch (+8 more)

### Community 22 - "devDependencies"
Cohesion: 0.12
Nodes (16): autoprefixer, @axe-core/playwright, postcss, @types/d3-array, @types/d3-geo, @types/d3-shape, typescript, devDependencies (+8 more)

### Community 23 - "Agun Panjika: 240-second video script"
Cohesion: 0.07
Nodes (27): 0:00 – 0:12 · Cold open, 0:12 – 0:22 · The fire, 0:22 – 0:30 · The landslide, 0:30 – 0:35 · The smog, 0:35 – 0:47 · NASA has watched it all, 0:47 – 1:05 · Two eyes that disagree, 1:05 – 1:20 · The record breaks, 1:20 – 1:35 · The deadline (+19 more)

### Community 24 - "Weekly Detection Aggregation"
Cohesion: 0.29
Nodes (4): iso_weeks_between(), main(), to_district_week(), wide()

### Community 25 - "Proposed global extension and evidence plan"
Cohesion: 0.11
Nodes (19): Decisions to take to the mentor, Distinctive sensor-transition comparison, Global extension that can be demonstrated honestly, How the plan strengthens a submission, Present foundation, Priority and scope, Product direction, Proposed global extension and evidence plan (+11 more)

### Community 26 - "Successor Sensor Continuity"
Cohesion: 0.57
Nodes (4): evaluate(), factors_for(), main(), national_weeks()

### Community 27 - "Web Package Metadata"
Cohesion: 0.18
Nodes (10): tailwindcss, @types/d3-scale, @types/three, tailwindcss@^3.4.15, @types/d3-scale@^4.0.8, @types/three@^0.186.0, name, private (+2 more)

### Community 28 - "Export Manifest Metadata"
Cohesion: 0.18
Nodes (10): baseline_years, districts, handover, bridge_overlap_years, snpp_end_utc, model_version, naive_factor, regions (+2 more)

### Community 29 - "Season Calendar Schema"
Cohesion: 0.20
Nodes (10): properties, required, type, pattern, type, ^\\d{4}$, lv, seasons (+2 more)

### Community 30 - "Region Identity Schema"
Cohesion: 0.20
Nodes (10): type, type, type, id, name_bn, name_en, region, properties (+2 more)

### Community 31 - "Season Status Schema"
Cohesion: 0.20
Nodes (10): enum, maximum, minimum, type, level, pct, season, properties (+2 more)

### Community 32 - "Sensor Freshness Metadata"
Cohesion: 0.25
Nodes (8): modis, noaa20, noaa21, snpp, data_through, by_sensor, iso_week, iso_year

### Community 33 - "interval_coverage"
Cohesion: 0.25
Nodes (4): AnnualBands, interval_coverage(), _national(), predict_with_interval()

### Community 34 - "Frontend Build Commands"
Cohesion: 0.33
Nodes (6): scripts, build, dev, preview, test:upgrade, typecheck

### Community 35 - "LightGBM Validation Summary"
Cohesion: 0.33
Nodes (6): abs_total_pct_err, mae_vs_naive_pct, mae_week, mae_week_offseason, validation_headline, gbm

### Community 36 - "Vite Build Configuration"
Cohesion: 0.40
Nodes (4): vite, @vitejs/plugin-react, vite@^5.4.11, @vitejs/plugin-react@^4.3.4

### Community 37 - "Country Metadata"
Cohesion: 0.40
Nodes (5): country, bbox, iso3, name_bn, name_en

### Community 38 - "Ensemble Validation Summary"
Cohesion: 0.40
Nodes (5): abs_total_pct_err, mae_vs_naive_pct, mae_week, mae_week_offseason, ensemble

### Community 39 - "Monthly Factor Validation"
Cohesion: 0.40
Nodes (5): abs_total_pct_err, mae_vs_naive_pct, mae_week, mae_week_offseason, monthly

### Community 40 - "Single Factor Validation"
Cohesion: 0.40
Nodes (5): abs_total_pct_err, mae_vs_naive_pct, mae_week, mae_week_offseason, naive

### Community 41 - "Negative Binomial Validation"
Cohesion: 0.40
Nodes (5): abs_total_pct_err, mae_vs_naive_pct, mae_week, mae_week_offseason, negbin

### Community 42 - "Fixed Factor Validation"
Cohesion: 0.40
Nodes (5): abs_total_pct_err, mae_vs_naive_pct, mae_week, mae_week_offseason, prd_4.4x

### Community 43 - "ISO Week Schema"
Cohesion: 0.50
Nodes (4): w, maximum, minimum, type

### Community 44 - "Upper Interval Schema"
Cohesion: 0.67
Nodes (3): minimum, type, hi

### Community 45 - "Lower Interval Schema"
Cohesion: 0.67
Nodes (3): minimum, type, lo

### Community 46 - "MODIS Count Schema"
Cohesion: 0.67
Nodes (3): minimum, type, modis

### Community 47 - "Static Removal Schema"
Cohesion: 0.67
Nodes (3): static_removed, minimum, type

### Community 48 - "VIIRS Count Schema"
Cohesion: 0.67
Nodes (3): viirs, minimum, type

### Community 49 - "Weekly Series Schema"
Cohesion: 0.67
Nodes (3): weeks, minItems, type

### Community 50 - "ISO Year Schema"
Cohesion: 0.67
Nodes (3): y, minimum, type

### Community 51 - "Agun Panjika: project brief for academic review"
Cohesion: 0.11
Nodes (19): 10. Claim-to-evidence and academic self-review, 1. Problem and intended use, 2. Contribution and research positioning, 3. Data, geography and current snapshot, 4.1 Cleaning and aggregation, 4.2 Harmonization, 4.3 Uncertainty and continuity, 4.4 Normals, outlooks and cross-checks (+11 more)

### Community 52 - "Agun Panjika — Product Requirements Document"
Cohesion: 0.12
Nodes (17): Agun Panjika — Product Requirements Document, Backend and pipeline spec, Data sources, Delivery plan, Executive summary, Frontend spec, Goals, non-goals and success metrics, Impact (+9 more)

### Community 53 - "harmonise.py"
Cohesion: 0.14
Nodes (11): add_weather(), build_features(), disaggregate_to_districts(), _irls_nb2(), loyo_predictions(), loyo_validate(), main(), _metrics() (+3 more)

### Community 54 - "External checks for the mentor reply"
Cohesion: 0.15
Nodes (12): Challenge and competition context, Conflicts and limits that affect planning, Criteria lens for extension priorities, External checks for the mentor reply, Mentor and appropriate emphasis, Primary-source check for the sensor explanation, Public links checked, Public release status and licensing (+4 more)

### Community 61 - "Agun Panjika — Hot Spots Implementation Plan"
Cohesion: 0.18
Nodes (11): Agun Panjika — Hot Spots Implementation Plan, Architecture and stack, Data sources, Method, Product, Risks and honest limits, Sources, Summary (+3 more)

### Community 63 - "Agun Panjika · আগুন পঞ্জিকা"
Cohesion: 0.17
Nodes (12): Agun Panjika · আগুন পঞ্জিকা, Data sources, credits and citation, Getting started, Internal results, Proposed global extension, Repository map, Scientific methodology, See the application (+4 more)

### Community 64 - "Product and presentation research for the mentor briefing"
Cohesion: 0.18
Nodes (10): Coverage inventory, Evidence of quality and remaining impact work, Follow-up: actual team video, Follow-up: focused global product extension, Message the implementation supports, Present product inventory, Present source versus historical documents, Presentation claims to retire or qualify (+2 more)

### Community 65 - "Agun Panjika Upgrade Progress"
Cohesion: 0.18
Nodes (11): Agun Panjika Upgrade Progress, Completed Work, Current Status, Feature Status, Files Changed, Git History, Regression and scientific safeguards, Remaining and Known Issues (+3 more)

### Community 66 - "feat/3d-geospatial-experience"
Cohesion: 0.20
Nodes (10): Completed Work, Current Status, feat/3d-geospatial-experience, Files Changed, Git History, Known Issues, Next Steps, Regression Checks (+2 more)

### Community 67 - "feat/accessibility-performance"
Cohesion: 0.18
Nodes (10): Completed Work, Current Status, feat/accessibility-performance, Files Changed, Git History, Known Issues, Next Steps, Regression Checks (+2 more)

### Community 68 - "feat/charts-calendar-polish"
Cohesion: 0.20
Nodes (10): Completed Work, Current Status, feat/charts-calendar-polish, Files Changed, Git History, Known Issues, Next Steps, Regression Checks (+2 more)

### Community 69 - "feat/demo-storytelling"
Cohesion: 0.18
Nodes (10): Completed Work, Current Status, feat/demo-storytelling, Files Changed, Git History, Known Issues, Next Steps, Regression Checks (+2 more)

### Community 70 - "feat/loading-reliability"
Cohesion: 0.18
Nodes (10): Completed Work, Current Status, feat/loading-reliability, Files Changed, Git History, Known Issues, Next Steps, Regression Checks (+2 more)

### Community 71 - "feat/map-exploration"
Cohesion: 0.18
Nodes (10): Completed Work, Current Status, feat/map-exploration, Files Changed, Git History, Known Issues, Next Steps, Regression Checks (+2 more)

### Community 72 - "feat/navigation-state"
Cohesion: 0.20
Nodes (10): Completed Work, Current Status, feat/navigation-state, Files Changed, Git History, Known Issues, Next Steps, Regression Checks (+2 more)

### Community 73 - "feat/ui-design-system"
Cohesion: 0.18
Nodes (10): Completed Work, Current Status, feat/ui-design-system, Files Changed, Git History, Known Issues, Next Steps, Regression Checks (+2 more)

### Community 74 - "Agun Panjika: video and story ideas"
Cohesion: 0.29
Nodes (7): Agun Panjika: video and story ideas, Numbers worth saying on camera, Shooting notes, Video 1: 240-second prescreen (story-first), Video 2: local demo (product-first, after 2 Nov), Video 3: 30 seconds (global), What makes us different (pick 3 per video)

### Community 75 - "Scientific evidence for the mentor briefing"
Cohesion: 0.25
Nodes (7): Manual static-source evidence, Pipeline coverage and implementation, Results that can be quoted, with their scope, Scientific evidence for the mentor briefing, Suggested scientific asks for the mentor, Tests and read-only checks, What the project actually does

### Community 76 - "numpy"
Cohesion: 0.20
Nodes (7): cross_check(), main(), test_negbin_interval_draws_shape(), test_seasonal_models_beat_naive_on_seasonal_ratio(), _toy_region_weeks(), test_annual_bands_contain_prediction(), test_conformal_bands_cover_simulated_errors()

### Community 77 - "Harmonic-Fire / Agun Panjika"
Cohesion: 0.29
Nodes (6): Data and interface constraints, Development and verification, graphify, Harmonic-Fire / Agun Panjika, Navigation, Working context

### Community 78 - "Academic review guide"
Cohesion: 0.29
Nodes (7): Academic review guide, Current evidence at a glance, Questions for academic guidance, Specific issues worth reviewing, Suggested reading order, The central idea, What feedback would enable

### Community 79 - "Scientific review: implementation, evidence and open questions"
Cohesion: 0.29
Nodes (7): Manual static-source evidence, Pipeline coverage and implementation, Results that can be quoted, with their scope, Scientific review: implementation, evidence and open questions, Suggested scientific asks for the mentor, Tests and read-only checks, What the project actually does

### Community 80 - "SERIAL_MERGE_REVIEW.md"
Cohesion: 0.09
Nodes (15): Conflict resolutions, Known limits, Manual order, Serial merge review — 11 October 2026 (Asia/Dhaka), Soft Earth, Verification, Agun Panjika upgrade baseline, Architecture and preserved inventory (+7 more)

### Community 81 - "Typeset mentor reports"
Cohesion: 0.50
Nodes (4): Build, Files, Review before sharing, Typeset mentor reports

### Community 82 - "Final regression matrix: original versus preview"
Cohesion: 0.29
Nodes (7): Final regression matrix: original versus preview, Git/review, Limitations and release work, Original feature inventory, Performance, Verification evidence, Visual review and fixes

### Community 83 - "Verification and reproduction"
Cohesion: 0.25
Nodes (8): Browser coverage, Executed checks, Hosted status and remaining release work, Repeat the checks, Reproduce the documentation figures, Scientific reproduction versus software verification, Soft Earth restoration evidence, Verification and reproduction

### Community 85 - "Sources, credits and submission notes"
Cohesion: 0.33
Nodes (6): Data and method references, Maps, graphics and imagery, Project materials, Publication checklist, Sources, credits and submission notes, Supplied 2026 guidance and access limits

### Community 86 - "Current application captures and scientific figures"
Cohesion: 0.40
Nodes (5): Annual continuity cross-check, Application gallery, Current application captures and scientific figures, Internal reconstruction benchmark, Reproduction and historical assets

### Community 87 - "Agun Panjika: user test protocol (PRD success metric)"
Cohesion: 0.50
Nodes (4): Agun Panjika: user test protocol (PRD success metric), Bangla wording check (native speaker and CHT reviewer), Load test (Lighthouse), Timing test

### Community 88 - "json"
Cohesion: 0.30
Nodes (10): test_district_documents_sum_to_regions(), test_exported_intervals_contain_estimate(), test_irls_recovers_known_coefficients(), test_modis_total_matches_farukh_2023(), test_normalise_modis_and_viirs(), test_record_starts_2001_and_has_unfiltered_totals(), test_region_json_validates_against_schema(), test_regions_sum_to_national() (+2 more)

### Community 89 - "Documentation"
Cohesion: 0.67
Nodes (3): Current review package, Documentation, Original plans and historical evidence

### Community 91 - "kilns.py"
Cohesion: 0.20
Nodes (9): apply_filters(), _cells(), flag_static_cells(), main(), write_spotcheck(), _det(), test_daytime_repeat_burning_is_not_a_kiln(), test_firms_type_2_dropped() (+1 more)

### Community 92 - "local.py"
Cohesion: 0.08
Nodes (28): _boundaries(), main(), tag(), units(), upazila_bn(), _cell_weights(), download_all(), _fetch_month() (+20 more)

### Community 98 - "review_figures.py"
Cohesion: 0.20
Nodes (5): main(), continuity_comparison(), main(), model_comparison(), save()

## Knowledge Gaps
- **1 isolated node(s):** `agun-panjika`
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 588 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **16 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Scientific review: implementation, evidence and open questions` connect `Scientific review: implementation, evidence and open questions` to `export.py`, `docs/README.md`?**
  _High betweenness centrality (0.101) - this node is a cross-community bridge._
- **What connects `agun-panjika` to the rest of the system?**
  _1 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `export.py` be split into smaller, more focused modules?**
  _Cohesion score 0.14814814814814814 - nodes in this community are weakly interconnected._
- **Why does `Important limitations and improvement opportunities` connect `export.py` to `interval_coverage`, `Ingestion and Neighbour Data`, `Scientific review: implementation, evidence and open questions`?**
  _High betweenness centrality (0.101) - this node is a cross-community bridge._
- **Should `Ingestion and Neighbour Data` be split into smaller, more focused modules?**
  _Cohesion score 0.07231638418079096 - nodes in this community are weakly interconnected._
- **Why does `series()` connect `Ingestion and Neighbour Data` to `pandas`, `export.py`, `numpy`, `Agun Panjika — Product Requirements Document`, `harmonise.py`?**
  _High betweenness centrality (0.058) - this node is a cross-community bridge._
- **Should `Browser Regression Checks` be split into smaller, more focused modules?**
  _Cohesion score 0.06666666666666667 - nodes in this community are weakly interconnected._