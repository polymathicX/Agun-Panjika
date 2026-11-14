# Presentation and submission sources

The release contains a **seven-slide English PDF** and a **29.00-second captioned MP4**, alternative demo formats. The team must choose one for the official demo field, review its project page and perform the submission. The older local video is too long for the global short demo.

- [Public demo page](https://polymathicx.github.io/Agun-Panjika/demo/), including transcript and downloads.
- [Slide PDF](../pdf/GLOBAL_DEMO_SLIDES.pdf).
- [Project-page draft](PROJECT_PAGE_DRAFT.md) and [optional narration script](30_SECOND_PITCH.md).
- `slides.tex`: seven-slide XeLaTeX source. `video.html`: six-scene caption layout.
- `capture.mjs`: actual production browser screenshots and recorded interactions.
- `build.py`: figures, slides, storyboard and H.264 video assembly.

With a production preview running at `http://127.0.0.1:4173`, run:

```powershell
python -m pip install matplotlib pymupdf imageio-ffmpeg
python docs/submission/build.py
```

The environment also needs Node, installed `web/` dependencies, Playwright Chromium, XeLaTeX and Calibri. Use `--base URL` for another preview address. `--no-capture` reuses existing captures/recordings. Temporary video clips, rendered review pages and TeX logs stay in ignored `docs/latex/build/submission/`.

The build asserts seven PDF pages and 29.00-second video duration and rejects TeX overflow/missing glyphs. Inspect every page and representative video frames before publishing; those checks do not prove readability or scientific validity. The demo has large baked-in English captions and no audio. Narration remains a team choice; adding it must preserve the 30-second ceiling.

AI assisted coding, plotting, editing and assembly. The screenshots and interaction footage are actual app recordings. Charts use project exports; raw fire observations are NASA measurements. Visible assistance markings, metadata and source credits accompany the artifacts. No NASA logo or generated likeness is used.
