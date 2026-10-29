# Typeset mentor reports

The public PDFs are deliberately designed XeLaTeX report editions of the project brief and global-extension proposal. They replace the earlier browser-print exports. The full Markdown documents remain available for source-level detail and links.

## Files

- `project-brief.tex`: eight-page project report, with executive summary, provenance, method, results, validation limits and research agenda.
- `global-extension-plan.tex`: seven-page proposal, with bounded scope, work packages, milestones, risks and mentor decisions.
- `report-style.tex`: shared A4 layout, typography, headers, captions, tables, diagrams and cover treatment.
- `build_report_figures.py`: compact vector plots from committed `validation.json` and `partner.json`.
- `build.py`: two-pass compilation and publication into `docs/pdf/`.

## Build

Install a current MiKTeX or TeX Live distribution with XeLaTeX and the packages named in `report-style.tex`. The layout uses Cambria, Calibri, Consolas and Nirmala UI, available on the Windows authoring environment. On another platform, install compatible licensed fonts or deliberately change the font declarations; inspect line and page breaks after any font change.

With Python 3.11+ and matplotlib installed, run from the repository root:

```sh
python docs/latex/build.py
```

The build uses installed TeX packages and does not automatically install missing ones. It filters invalid PATH entries only for the compiler child process, preserving the user's environment. Two passes resolve page references and PDF outlines. Overfull boxes and missing glyphs stop publication. Compiler logs and intermediate files remain in the ignored `build/` directory.

## Review before sharing

Inspect every page after substantive changes. Check the cover, font sizes, tables, diagrams, mathematical notation, figure captions, cross-references and live links. Compilation alone does not detect an overlapping diagram label or a misleading scientific claim.

The 29 October 2026 editions use selectable text, embedded fonts, clickable links and PDF outlines. They were checked visually on every page and programmatically for off-page text, unresolved references and typesetting overflow. Scientific results are saved internal evaluations; typesetting does not constitute new validation. No application UI or scientific data is changed by this build.
