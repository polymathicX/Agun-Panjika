# Editable presentation

[GLOBAL_DEMO_SLIDES.pptx](GLOBAL_DEMO_SLIDES.pptx) is the seven-slide PowerPoint companion to the [PDF deck](../pdf/GLOBAL_DEMO_SLIDES.pdf).

Text, shapes and pixel-size diagrams are editable. App screenshots and the seasonal figure are embedded images. App/repository hyperlinks are included. The author is Team KUETaguns.

The deck was opened and rendered using Microsoft PowerPoint. All seven pages and their text were checked; the PPTX exporter also compares its wording with the source PDF. Fonts are Calibri and Cambria.

Regenerate with `python docs/submission/build_pptx.py` after installing `python-pptx`, `pymupdf` and `Pillow`. The full presentation builder also regenerates it. Keep custom teammate edits in a separate copy so a rebuild does not overwrite them.
