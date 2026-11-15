# Actual app screenshot gallery

**Captured 15 November 2026** from the production preview. [Visual project overview](../../README.md) · [User guide](../USER_GUIDE.md) · [Machine capture metadata](captures.json).

These images show the actual application with committed public exports. They are not mockups or generated UI. Source windows/counts are dated examples; scheduled global refresh can make the live app newer. The captured world snapshot was built at **2026-11-14 20:51:09 UTC**. Capture time, route, dimensions, language and theme are recorded in `captures.json`.

| View | Full-size image | State |
| --- | --- | --- |
| Earth overview | [earth.jpg](earth.jpg) | World, English/light, 1440 × 1000 |
| Country observation brief | [world.jpg](world.jpg) | Brazil, English/light, 1440 × 1000 |
| Historical comparison | [histories.jpg](histories.jpg) | Nepal 2024, switch week 26, VIIRS revealed |
| Season report | [season-report.jpg](season-report.jpg) | Bangladesh, 2024 week 14 |
| Calendar | [calendar.jpg](calendar.jpg) | Bangladesh, 2024 week 14 |
| Sensors | [sensors.jpg](sensors.jpg) | Bangladesh, instrument comparison |
| Bangladesh map | [bangladesh-map.jpg](bangladesh-map.jpg) | Bangladesh, 2024 week 14 |
| Experimental outlook | [outlook.jpg](outlook.jpg) | Bangladesh; validity remains visible |
| Borders | [borders.jpg](borders.jpg) | Regional context, year 2024 |
| Method | [method.jpg](method.jpg) | Processing, assumptions and evidence downloads |
| Phone | [phone.jpg](phone.jpg) | Brazil, English/light, 390 × 844 |
| On-demand phone help | [help-bangla.jpg](help-bangla.jpg) | Bangladesh, Bangla/dark, 390 × 844 |

The [five-second globe GIF](earth-motion.gif) is an extract from the real presentation interaction recording, captured before this gallery. It shows a different recorded selection (Chad). It uses the same public observation snapshot; it is not a real-time stream. The README keeps it inside an optional expandable panel.

## Recreate the images

Start the [production preview](../DEVELOPMENT.md) at port 4173. From the repository root:

```powershell
node docs/gallery/capture.mjs http://127.0.0.1:4173
```

The script uses the project's installed Playwright, waits for fonts/data/real map rendering, checks error states and desktop overflow, captures reduced-motion views and writes metadata. It creates 12 JPEGs across nine pages and two phone layouts. Inspect images after capture; these checks alone do not prove good visual composition.

The GIF reuses the ignored `docs/latex/build/submission/world-motion.webm` from the [presentation capture](../submission/README.md):

```powershell
python docs/gallery/make_motion.py
```

It needs installed `imageio-ffmpeg` and Pillow, verifies frame count/duration and keeps the output below 3 MB. No runtime dependencies were added for the gallery. Higher-resolution slide assets stay in [review/screenshots](../review/screenshots/); presentation rebuilds do not use these compact README JPEGs.

## Attribution

App captures: Team KUETaguns. NASA FIRMS supplies the observations. Earth/cloud textures: Solar System Scope, CC BY 4.0. Map/geography and software retain their original credits. [Full sources](../SOURCES_AND_SUBMISSION.md) · [Assistance disclosure](../DATA_AND_AI_DISCLOSURE.md).
