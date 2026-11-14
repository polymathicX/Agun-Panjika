# Agun Panjika — video teammate handoff

**Team KUETaguns · 15 November 2026 · target: 29 seconds, English captions**

Make a warm, visual introduction for someone seeing our project for the first time. Show the real product doing useful things. Keep the story positive: worldwide access, clearer historical comparisons, and evidence people can explore and share. Use the seven-slide deck as the visual reference.

## What we built

**Agun Panjika: a fire history you can inspect.**

MODIS and VIIRS observe fire activity at different resolutions. Our project connects their records so people can inspect historical seasons while exploring recent NASA observations worldwide. It combines a textured, interactive Earth with a historical workbench that lets a viewer reveal the satellite reference and compare the correction.

| Feature | What to show | Why it matters |
| --- | --- | --- |
| Worldwide globe | Spin, zoom and tap a country; watch its statistics change | Recent observations across 242 countries and territories |
| Country timeline | Select a satellite, tap a day or play the week | Understand when and where observations occurred |
| Historical comparison | Move the switch week, then reveal actual VIIRS | See the correction against real measurements |
| Measured progress | Show the two-bar progress graphic | Weekly error falls **35.10% in Chin, Myanmar** and **21.45% in Punjab–Haryana, India**, versus our previous release across all 156 original test weeks |
| Phone experience | Save a country to the watchlist and show the mobile layout | Return to a familiar place and share a dated evidence brief |
| Guided first visit | Briefly show “Show me around” | An eight-step tutorial teaches the real controls |

These are shot options, not a requirement to squeeze every control into 29 seconds. Prioritize the globe → historical reveal → phone journey. The mobile app is an installable PWA; cached reference data and previously visited country data support offline access.

## A 29-second edit

| Time | Picture | Short on-screen copy |
| --- | --- | --- |
| 0:00–0:02 | Narrator/name, team and Earth | Team KUETaguns |
| 0:02–0:05 | MODIS → VIIRS transition | Different sensors. One connected history. |
| 0:05–0:10 | Project name; real globe spin and country tap | Agun Panjika · Explore your country |
| 0:10–0:17 | Country timeline, then historical reference reveal | NASA observations → inspectable history |
| 0:17–0:23 | Progress bars; keep both place names visible | 35.10% lower error · Chin / 21.45% · Punjab–Haryana |
| 0:23–0:29 | Phone/watchlist, short benefit, link and team credits | Learn locally. Share evidence. Return tomorrow. |

**Optional narration:**

> I’m [name], from KUETaguns. Satellites see fire differently. Agun Panjika connects the history. Spin Earth, choose a country, and explore NASA’s MODIS and VIIRS observations. Reveal the satellite reference to inspect our correction. Our latest historical replay cuts error by 35 percent in Chin and 21 percent in Punjab–Haryana. Save your country and share dated evidence to support better monitoring.

Choose a narrator and replace `[name]`; record at a natural pace and time the final cut. The current downloadable demo uses English captions without narration.

## Open these links

- **Record the globe:** [Worldwide app](https://polymathicx.github.io/Agun-Panjika/?lang=en&theme=light#/world). Tap a country; there is no country search.
- **Record the reveal:** [Chin, 2023 experiment](https://polymathicx.github.io/Agun-Panjika/?lang=en&theme=light#/global?area=chin&testYear=2023&switchWeek=26). Click **Reveal actual VIIRS**. [Punjab–Haryana experiment](https://polymathicx.github.io/Agun-Panjika/?lang=en&theme=light#/global?area=punjab_haryana&testYear=2024&switchWeek=26).
- **Presentation package:** [Demo page](https://polymathicx.github.io/Agun-Panjika/demo/) · [29-second MP4](https://polymathicx.github.io/Agun-Panjika/demo/agun-panjika-29s.mp4) · [Seven-slide PDF](https://polymathicx.github.io/Agun-Panjika/demo/agun-panjika-slides.pdf).
- **Ready assets:** [Real app screenshots](https://github.com/polymathicX/Agun-Panjika/tree/main/docs/review/screenshots) · [Progress graphic](https://raw.githubusercontent.com/polymathicX/Agun-Panjika/main/docs/latex/figures/global-impact.png). Download originals instead of taking screenshots of GitHub previews.
- **Understand the whole project:** [Project brief PDF](https://github.com/polymathicX/Agun-Panjika/blob/main/docs/pdf/PROJECT_BRIEF.pdf) · [Global roadmap PDF](https://github.com/polymathicX/Agun-Panjika/blob/main/docs/pdf/GLOBAL_EXTENSION_PLAN.pdf) · [README](https://github.com/polymathicX/Agun-Panjika#readme).
- **Check numbers and credits:** [Complete model card](https://github.com/polymathicX/Agun-Panjika/blob/main/docs/GLOBAL_EVALUATION.md) · [Sources and submission notes](https://github.com/polymathicX/Agun-Panjika/blob/main/docs/SOURCES_AND_SUBMISSION.md) · [NASA FIRMS](https://www.earthdata.nasa.gov/data/tools/firms).
- **Official requirements:** [Our challenge](https://www.spaceappschallenge.org/2026/challenges/modis-and-viirs-hot-spots/) · [Project submission guide](https://www.spaceappschallenge.org/resources/project-submission-guide/).

## Style and delivery

Keep the Soft Earth look: cream/soft blue, coral accents, generous space, readable text. Use a few smooth cuts and actual interactions. Speak plainly; explain the benefit through a person exploring their country. Keep music below narration and make the captions readable on a phone. Show a source label beside the progress graphic: “Historical replay, 2022–2024 · all 156 weeks · versus previous release.”

The globe shows worldwide **recent observations**; historical model evaluation covers **four areas**. The progress figures describe those two named cases. Present community learning and monitoring as intended uses. Complete comparisons and scientific context are in the model card; keep the short pitch focused on the strongest supported benefits.

Export **1920×1080 H.264 MP4**, ideally **29 seconds**, with English captions. Include NASA FIRMS/LANCE/ESDIS credit and a readable assistance acknowledgment, such as “AI-assisted development and editing · actual NASA observations and app recordings.” Preserve imagery credits if reusing our Earth captures; see the source notes.

**Team credits:** Sohaib Hasan Niloy · Ayesha Mehereen · Sarwad Hasan Siddiqui · Adiba Tahsin · Abdullah Al Saif · Md. Rafsani Shazid.

**Before delivery:** play the final encoded file from beginning to end; confirm duration is at most 30 seconds, text is legible, links are public, and names are correct. Send the MP4 plus a public playback link to the team owner. The team owner must attach the chosen demo, complete the official project page and click **Submit for Judging** before the applicable deadline.
