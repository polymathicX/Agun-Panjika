# Sources, credits and submission

**14 November 2026 · Team KUETaguns**

[Live project](https://polymathicx.github.io/Agun-Panjika/) · [Source](https://github.com/polymathicX/Agun-Panjika) · [29-second demo](https://polymathicx.github.io/Agun-Panjika/demo/) · [Seven slides](pdf/GLOBAL_DEMO_SLIDES.pdf).

The registered challenge is [Harmonization of MODIS and VIIRS Hot Spots](https://www.spaceappschallenge.org/2026/challenges/modis-and-viirs-hot-spots/). The older [2:42 local video](https://youtu.be/9FMIzcXhqB4) remains background material; it exceeds the global short-demo limit. No official team-page URL or confirmed global nomination is asserted here.

## NASA data

We acknowledge NASA's Fire Information for Resource Management System (FIRMS), part of the Land, Atmosphere Near real-time Capability for Earth observations (LANCE) and Earth Science Data and Information System (ESDIS), for the fire observations. [FIRMS](https://www.earthdata.nasa.gov/data/tools/firms) · [LANCE](https://www.earthdata.nasa.gov/data/projects/lance).

Historical analysis uses FIRMS MODIS C6.1 Terra/Aqua and VIIRS 375 m S-NPP/NOAA-20/NOAA-21 archives and optional API updates. The worldwide viewer reads these separate public rolling feeds:

- [MODIS C6.1 global seven-day CSV](https://firms.modaps.eosdis.nasa.gov/data/active_fire/modis-c6.1/csv/MODIS_C6_1_Global_7d.csv).
- [NOAA-20 VIIRS global seven-day CSV](https://firms.modaps.eosdis.nasa.gov/data/active_fire/noaa-20-viirs-c2/csv/J1_VIIRS_C2_Global_7d.csv).
- [NOAA-21 VIIRS global seven-day CSV](https://firms.modaps.eosdis.nasa.gov/data/active_fire/noaa-21-viirs-c2/csv/J2_VIIRS_C2_Global_7d.csv).

Source URLs, retrieval/observation windows and hashes are exported in the [world summary](../web/public/data/world/summary.json). Totals are separate satellite detections, not unique fires or measured fire intensity. Rendering samples do not change summary counts. Retrieval/cloud completeness and industrial-source removal are not guaranteed. Source availability includes the [announced S-NPP end](https://www.earthdata.nasa.gov/data/alerts-outages/reminder-new-suomi-npp-observations-cease-november-2-2026).

[NASA POWER](https://power.larc.nasa.gov/) supplies Bangladesh historical weather, FWI inputs and aerosol context. These are regional sampled/reanalysis data, not local station observations. NASA data use does not imply NASA endorsement. FIRMS/LANCE data are provided as is; retain the [upstream disclaimer](https://www.earthdata.nasa.gov/data/projects/lance/disclaimer).

## Other data and method references

| Source | Actual use and credit |
| --- | --- |
| [ESA Climate Change Initiative Fire](https://climate.esa.int/en/projects/fire/), [CEDA archive](https://data.ceda.ac.uk/neodc/esacci/fire/data/burned_area) | Separate burned-area plausibility check: MRBA v6.0, 2003–2018; Sentinel-3 SYN v1.1, 2019–2024. Area differs from detection counts; retain the product change. |
| [geoBoundaries](https://www.geoboundaries.org/) | gbOpen administrative polygons, CC BY 4.0. Preserve downloaded boundary metadata/source attribution. |
| [Natural Earth](https://www.naturalearthdata.com/about/terms-of-use/) | Public-domain 50 m countries/territories for the globe and point assignment. Generalized boundaries are not jurisdictional precision. |
| [Open-Meteo](https://open-meteo.com/) | Experimental forecast weather inputs; retain its attribution/service terms. |
| [NOAA CPC ONI](https://www.cpc.ncep.noaa.gov/products/analysis_monitoring/ensostuff/ensoyears.shtml) | Experimental ENSO covariate, not evidence of improved forecast skill. |
| [Farukh, Islam and Hayasaka (2023), Atmosphere 14(1):97](https://www.mdpi.com/2073-4433/14/1/97) | Bangladesh fire-season background; external findings are not this project's validation. |
| [Van Wagner (1987), Canadian Forest Fire Weather Index System](https://cfs.nrcan.gc.ca/publications?id=19927) | FWI formulation; local weather substitutions/danger calibration still need review. |

No first/only-method or formal originality claim is made. Related-work and research claims need academic review.

## Imagery, maps, fonts and software

- Textured Earth/cloud imagery: [Solar System Scope textures](https://www.solarsystemscope.com/textures/), [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). These are static context, not live satellite/weather imagery. [Asset notes](../web/public/earth/README.md).
- Map attribution: [OpenFreeMap](https://openfreemap.org/), [OpenMapTiles](https://openmaptiles.org/) and [OpenStreetMap contributors](https://www.openstreetmap.org/copyright). External tiles are subject to availability and provider terms.
- Earlier static-source imagery inspections retain **Esri, Maxar and Earthstar Geographics** credits. They are small manual examples, not independent field truth.
- Web fonts include Inter and Noto Sans Bengali; retain their upstream font licenses. The PDF build uses installed Cambria/Calibri/Consolas/Nirmala UI; font files are not distributed as source assets.
- Core software: Python, NumPy, pandas, GeoPandas, SciPy, LightGBM, React, TypeScript, Vite, Three.js, D3, MapLibre and Playwright. The build generates [frontend dependency license/notices](../web/public/THIRD_PARTY_NOTICES.txt) from the locked installation. Python dependencies are declared in [pyproject.toml](../pyproject.toml) and retain upstream licenses.
- Original project code is [Apache 2.0](../LICENSE); [NOTICE](../NOTICE) preserves attribution and the distinction from third-party terms. The NASA participant terms' default distribution license is Apache 2.0 when no specific compliant license is chosen.

New screenshots and interaction footage are recordings of the real app. Publication figures are plotted from exports by [the presentation builder](submission/build.py). AI assisted implementation, review, plotting, editorial work and assembly. The short video/deck includes visible assistance acknowledgment; metadata and the [public disclosure](DATA_AND_AI_DISCLOSURE.md) explain it. No synthetic raw fire observations, participant results or narrator are used.

## Current official submission requirements

The [official judging guide](https://www.spaceappschallenge.org/resources/judging-awards-guide/), [submission guide](https://www.spaceappschallenge.org/resources/project-submission-guide/) and [participant terms](https://www.spaceappschallenge.org/legal/) were reviewed for this release. The [source-by-source research note](GLOBAL_JUDGING_RESEARCH.md) records dates, scope and access details.

- Global rubric: Impact, Creativity, Validity, Relevance and Presentation, each 1–5.
- Demo: **at most seven slides including the title/intro, or a video at most 30 seconds**. Use public links requiring no login. English materials/subtitles are required.
- Describe NASA data and all external resources. Disclose ML and development assistance as SI. The form's SI answer is hidden from judges, so keep a visible acknowledgment in linked artifacts too.
- The published submission window is **14 November 09:00 to 15 November 23:59 in the applicable event time zone**. Local judging may require an earlier cutoff. Confirm the team's exact local deadline with the Local Lead.
- Review the complete project page, membership and declarations, click **Submit for Judging**, and verify its success confirmation. Saving progress or publishing Git does not submit the project.

The user-supplied [Bangladesh participant guide](https://docs.google.com/document/d/1mSOxplyht5kii8GcCnFaGA-vMHIAVypjl4N6PobnaYQ/edit?usp=sharing) is additional local context. Its earlier conflicts do not supersede final official guidance. The [NotebookLM FAQ](https://notebook.google.com/notebook/44e5e9a3-5387-4191-8687-b44766aee09e) required login and the [Claude artifact](https://claude.ai/artifact/PUnJNpKuEXRbvKafSgU6fA) did not expose content; neither was used to invent requirements.

The code includes an existing local prototype plus new global work. The team should represent that history honestly, review all claims and perform the official submission. An award, final eligibility or global nomination is not implied by this repository.
