# Harmonic-Fire / Agun Panjika

## Working context

This folder is the Git repository and working root; run project commands here unless a command explicitly targets `web/`.

Agun Panjika is a bilingual (English/Bangla) Bangladesh fire-history application for NASA Space Apps. The Python pipeline harmonizes MODIS and VIIRS observations onto a common weekly VIIRS scale, with uncertainty, seasonal context and two-week outlooks. The frontend consumes static exports; there is no application backend or database.

## Navigation

- `pipeline/run_all.py`: pipeline orchestration. `pipeline/config.py`: paths, country selection and environment loading.
- `pipeline/`: ingestion, geography/static-source filtering, aggregation, weather, harmonization, sensor continuity, climatology, forecasts and exports.
- `pipeline/schema/region.schema.json`: region export contract; `web/src/lib/types.ts` and `web/src/lib/data.ts`: frontend contracts and loading.
- `web/src/screens/` and `web/src/components/`: React/TypeScript interface, D3 charts and MapLibre map. `web/src/lib/router.ts`: shared navigation/filter state.
- `web/src/i18n/en.json` and `bn.json`: paired translation resources.
- `web/public/data/`: committed scientific exports consumed by the frontend. Raw/intermediate inputs live under gitignored `data/` directories.
- `tests/`: Python scientific, forecast, schema and contrast checks. `web/scripts/upgrade-regression.mjs`: browser regression runner.

Read `README.md` and `docs/PROJECT_BRIEF.md` for current product/methodology details. Consult `docs/VERIFICATION.md` for reproduction and dated checks, `docs/SCIENTIFIC_REVIEW.md` for source-level evaluation concerns, and `docs/GLOBAL_EXTENSION_PLAN.md` for proposed work. The original product requirements and upgrade/preview/serial-merge documents are historical plans and evidence; verify current source and Git history before treating their claims as current.

## Development and verification

Frontend (Node.js 20+, commands from `web/`):

```powershell
npm ci
npm run dev
npm run typecheck
npm run build
```

For browser regression, install Chromium with `npx playwright install chromium`, build the frontend, and start `npm run preview -- --host 127.0.0.1 --port 4173 --strictPort` in a separate process. From `web/`, run `npm run test:upgrade -- http://127.0.0.1:4173`. Add `$env:UPGRADE_OFFLINE = "1"` before the runner to include the offline group. Artifacts default to `web/test-results/upgrade/`.

Python (3.11+, commands from the repository root, using an activated virtual environment):

```powershell
python -m pip install -e ".[dev]"
python -m pytest -q
python -m ruff check pipeline tests
python -m pipeline.run_all --help
```

Use targeted Python checks for pipeline changes and frontend typecheck/build for interface changes; run relevant browser checks for interaction changes. Some Python cases require raw/intermediate data and may skip; report skips separately from passes. Documentation-only updates need link/path and diff review.

## Data and interface constraints

- Use committed exports for ordinary frontend work. Run `python -m pipeline.run_all` when scientific regeneration is required; even archive-only runs can download external datasets and rewrite exports.
- Keep `FIRMS_MAP_KEY` in the gitignored root `.env` or process environment, on the pipeline side. Preserve existing `.env` contents. Process environment variables take precedence.
- For another country, set `AP_COUNTRY` before running the pipeline; `pipeline/config.py` routes outputs into country-specific directories. In PowerShell, use `$env:AP_COUNTRY = "pipeline/countries/npl.json"` and remove it when returning to the default Bangladesh run.
- Preserve scientific units, provenance, uncertainty and the distinction between raw detections and harmonized totals. Archived point coordinates are not live fires or measured fire intensity; display only metadata the exports actually provide.
- Keep English and Bangla copy aligned. Preserve shared URL filters, loading/error/retry behavior, mobile layouts, keyboard access and reduced-motion behavior when changing interface components.
- Keep asset/data URLs compatible with Vite's base path for GitHub Pages. The daily refresh/build/deploy workflow is `.github/workflows/daily.yml`; pushes to `main` trigger it.

## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

When the user types `/graphify`, use the installed graphify skill or instructions before doing anything else.

Rules:
- When graphify-out/graph.json exists, run `graphify query "<question>"` before your first grep, search or source-file read for a codebase question, and put this rule in every subagent prompt that explores code. Read raw files only for lines the graph or an earlier read already located. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- Dirty graphify-out/ files are expected after hooks or incremental updates; dirty graph files are not a reason to skip graphify. Only skip graphify if the task is about stale or incorrect graph output, or the user explicitly says not to use it.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).
- A committed graphify-out/graph.json is rewritten whole on every build, so a large diff to it in a pull request is expected. Do not flag it as churn or suggest skipping the graph rebuild or its hooks.
