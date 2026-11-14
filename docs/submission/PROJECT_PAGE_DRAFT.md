# Project-page copy for team review

Use this as a draft, not proof of submission. Confirm the registered challenge, team, local cutoff and original-work/resource declarations. The code includes a pre-existing local prototype plus the global features implemented during this hackathon; describe that history honestly if asked.

## Project name

Agun Panjika — Fire Almanac

## High-level summary

Different satellites can make the same fire season look different. Agun Panjika makes that record inspectable. Our web app combines a worldwide view of recent NASA MODIS/VIIRS observations with evaluated historical fire calendars. Spin the Earth, select a country, follow the days, and open a sensor-switch experiment to compare corrected history with withheld observations. Dated evidence exports retain sources and limitations. The app is installable on a phone and supports offline reference data.

## Demo and final project

- **Demo video (under 30 seconds):** https://polymathicx.github.io/Agun-Panjika/demo/agun-panjika-29s.mp4
- **Final application:** https://polymathicx.github.io/Agun-Panjika/
- **Source and documentation:** https://github.com/polymathicX/Agun-Panjika
- **Seven-slide alternative:** https://polymathicx.github.io/Agun-Panjika/demo/agun-panjika-slides.pdf

Choose one compliant format for the demo field. The earlier 2:42 local video is background material, not the short global demo.

## Detailed description

NASA has more than two decades of active-fire observations, but MODIS and VIIRS have different resolutions and sensitivities. A raw joined count series can confuse a change in instruments with a change in burning. Our historical pipeline reconstructs MODIS-era weekly detection activity on a VIIRS S-NPP scale, distinguishes observations from estimates, retains uncertainty, and continues through successor satellites.

The worldwide viewer uses separate public seven-day MODIS, NOAA-20 and NOAA-21 feeds. A 3D Earth supports country taps, rotation and zooming; 242 Natural Earth country/territory packages provide dated counts and daily charts. A local watchlist, reduced-motion behavior, keyboard and flat-map alternatives, evidence downloads and an installable PWA make repeated use practical. Recent worldwide observations are not represented as a globally calibrated historical reconstruction.

For the scientific extension we publish four detector-only temporal experiments: fit 2013–2018, calibrate 2019–2021 and test 2022–2024. Each area is fitted separately. The fixed 30% negative-binomial / 70% bagged LightGBM model has 25.34% lower national weekly error than a training-fitted single factor in Bangladesh and 28.49% lower in Nepal. It performs worse in Chin and Punjab–Haryana, and the interface withholds reconstructed calendar rows for those cases. All baseline results, annual errors and measured interval coverage remain visible. These years were known during development, so the experiments are temporal replays rather than an untouched final holdout.

Users can hide VIIRS for part of a test year, reveal its reference observations, inspect uncertainty, and export the evidence. Bangladesh also retains regional/district and CHT local calendars, historical seasonal context, sensor comparisons and experimental outlook products. Stale outlooks expire. Counts are satellite detections, not unique fires, burned area or emergency instructions. Cloud and overpass completeness is not established.

The intended benefit is clearer interpretation: students can investigate local patterns, community groups can ask informed questions, and researchers or land managers can identify periods for monitoring. A practitioner/user pilot and prospective forecast testing are still needed. We do not claim measured harm reduction or operational agency adoption.

Tools: Python, pandas/GeoPandas, NumPy, negative-binomial regression, LightGBM, React/TypeScript, Vite, Three.js, D3, MapLibre, service-worker caching and static GitHub Pages deployment.

## SI use

The solution uses ML for historical reconstruction and experimental outlooks. AI coding tools assisted implementation, debugging, review, documentation and demo assembly. Raw observations are NASA data; model outputs are labeled estimates. Product screenshots show the real app. No synthetic fire data, user studies or narrator are used. Public disclosure: [DATA_AND_AI_DISCLOSURE.md](../DATA_AND_AI_DISCLOSURE.md).

## NASA data and resources

NASA FIRMS MODIS C6.1 Terra/Aqua and VIIRS 375 m S-NPP/NOAA-20/NOAA-21 archives/API support the historical pipeline and handover. Public MODIS, NOAA-20 and NOAA-21 seven-day CSVs support the worldwide viewer. NASA POWER supports the Bangladesh weather/context and experimental outlook pipeline. Exact feed URLs, source timestamps and SHA-256 hashes are exported. We acknowledge NASA FIRMS, part of LANCE and NASA ESDIS: https://www.earthdata.nasa.gov/data/tools/firms

## Other references

ESA Fire_cci provides the separate burned-area cross-check. geoBoundaries supplies historical analysis boundaries; Natural Earth supplies the worldwide country/territory layer. Solar System Scope Earth/cloud textures are CC BY 4.0. Existing map/font/library credits and license information are collected in [sources and submission notes](../SOURCES_AND_SUBMISSION.md). Cite all resources in the actual form as required.

## Team

Sohaib Hasan Niloy; Ayesha Mehereen; Sarwad Hasan Siddiqui; Adiba Tahsin; Abdullah Al Saif; Md. Rafsani Shazid. Team KUETaguns, Bangladesh.
