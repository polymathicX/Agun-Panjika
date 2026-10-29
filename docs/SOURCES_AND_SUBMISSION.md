# Sources, credits and submission notes

Reviewed 29 October 2026. This page records data provenance and the status of supplied guidance; it is not a replacement for the organizers' final rules.

## Project materials

- [Public source repository](https://github.com/polymathicX/Agun-Panjika)
- [Team project video](https://youtu.be/9FMIzcXhqB4), titled *Agun Panjika - Nasa Space Apps Challenge*. Public metadata gives a 2:42 duration; narration was not transcript-audited during this review.
- [Official challenge: Harmonization of MODIS and VIIRS Hot Spots](https://www.spaceappschallenge.org/2026/challenges/harmonization-of-modis-and-viirs-hot-spots/)
- [Complete project brief](PROJECT_BRIEF.md), [global proposal](GLOBAL_EXTENSION_PLAN.md) and [academic review agenda](MENTOR_BRIEFING.md)

The user-supplied project context is preparation for the global stage. This documentation does not establish or claim a distinct Global Nominee, Finalist or Winner designation. An official team submission-page URL has not been supplied here.

## Data and method references

| Source | Used for | Credit / limit |
| --- | --- | --- |
| [NASA FIRMS](https://firms.modaps.eosdis.nasa.gov/), [country archive](https://firms.modaps.eosdis.nasa.gov/country/), [web-service documentation](https://firms.modaps.eosdis.nasa.gov/mapserver/wms-info/) | MODIS C6.1 Terra/Aqua and VIIRS 375 m S-NPP/NOAA successor detections | Retain sensor, collection and retrieval metadata; NASA data use does not imply NASA endorsement |
| [NASA POWER](https://power.larc.nasa.gov/) | Historical weather and aerosol context | Regional sampled/reanalysis data; distinguish from station observations |
| [ESA Climate Change Initiative Fire](https://climate.esa.int/en/projects/fire/), [CEDA burned-area archive](https://data.ceda.ac.uk/neodc/esacci/fire/data/burned_area) | MRBA v6.0, 2003–2018; Sentinel-3 SYN v1.1, 2019–2024 | Area is a different observable from detection counts; preserve product/version attribution |
| [geoBoundaries](https://www.geoboundaries.org/) | gbOpen administrative polygons | CC BY 4.0; preserve boundary source/version and attribution |
| [Open-Meteo](https://open-meteo.com/) | Forecast weather inputs | Observe upstream attribution and service terms; the app's forecast skill requires separate evaluation |
| [NOAA CPC ONI](https://www.cpc.ncep.noaa.gov/products/analysis_monitoring/ensostuff/ensoyears.shtml) | ENSO experimental covariate | Inclusion in experiments is not evidence of improved skill |
| [Farukh, Islam and Hayasaka (2023), Atmosphere 14(1):97](https://www.mdpi.com/2073-4433/14/1/97) | Bangladesh fire-season research context | External paper findings are not the project's model-validation results |
| [Van Wagner (1987), Canadian Forest Fire Weather Index System](https://cfs.nrcan.gc.ca/publications?id=19927) | FWI formulation | Project weather substitutions and local danger calibration still need review |

The repository's existing Method/PRD also lists MODIS/VIIRS fusion literature. A formal related-work review and originality claim remain work for academic discussion; no “first” or “only” claim is made in the current brief.

## Maps, graphics and imagery

Map attribution includes [OpenFreeMap](https://openfreemap.org/), [OpenMapTiles](https://openmaptiles.org/) and [OpenStreetMap contributors](https://www.openstreetmap.org/copyright). The current Canvas sphere uses the geographic assets and credits documented in [web/public/geo/README.md](../web/public/geo/README.md).

Static-source inspection examples retain **Esri, Maxar and Earthstar Geographics** imagery credits. Their use in a small manual sample does not establish an independent field inventory.

The current review screenshots are unchanged browser captures from the application, not generated mockups. New review figures are generated from committed result JSON by [review_figures.py](../notebooks/review_figures.py). Captions, snapshot dates and export links are in [review/README.md](review/README.md).

The older textured Soft Earth screenshots use [Solar System Scope textures](https://www.solarsystemscope.com/textures/) under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). They remain historical feature-preview assets; they do not show the current main app or live satellite/cloud imagery.

## Supplied 2026 guidance and access limits

The team supplied a [2026 Bangladesh Participants Guide](https://docs.google.com/document/d/1mSOxplyht5kii8GcCnFaGA-vMHIAVypjl4N6PobnaYQ/edit?usp=sharing), accessible through its [public text export](https://docs.google.com/document/d/1mSOxplyht5kii8GcCnFaGA-vMHIAVypjl4N6PobnaYQ/export?format=txt). It distinguishes a local 240-second presentation from a global under-30-second video or seven-slide alternative, and calls for public links, English presentation/subtitles, NASA-data attribution and AI/third-party disclosures. Its deadline text conflicts in places, so confirm the applicable format, cutoff and permitted edits against final official guidance and the Local Lead. Local scoring should not be presented as a verified global NASA rubric.

The supplied [NotebookLM FAQ](https://notebook.google.com/notebook/44e5e9a3-5387-4191-8687-b44766aee09e) required login, and the [Claude build-guide artifact](https://claude.ai/artifact/PUnJNpKuEXRbvKafSgU6fA) did not expose its content to this review. Neither was used to infer rules. An AI-generated FAQ/build guide should in any case be checked against its authoritative source.

Use the [official Space Apps event site](https://www.spaceappschallenge.org/2026/) and actual submission interface to confirm current requirements. This page is deliberately not a deadline calendar.

## Publication checklist

- Confirm competition stage, permitted updates and final submission format.
- Verify all project/demo/video links without an authenticated team session.
- Trace numerical claims to versioned results and distinguish planned work from delivered work.
- Include the actual AI tools, prompts, input data and human contributions required by the applicable guide.
- Credit datasets, libraries, basemaps, imagery and any external assets in their required form.
- Choose an explicit software license with the team before making a project-wide open-source licensing claim.

Documentation preparation used AI assistance to inspect source/results, draft explanatory text and prepare a plotting script from saved JSON. No new scientific training results were generated in that documentation task. This statement is not a complete disclosure of the original project's development; the team should supply its actual development/tool record for submission.
