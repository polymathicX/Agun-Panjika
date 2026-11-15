# Development and reproduction

**15 November 2026** · [Product overview](../README.md) · [Data guide](DATA_GUIDE.md) · [Deployment](DEPLOYMENT.md)

The repository root is `Harmonic-Fire`. The application is a static React/TypeScript frontend over published JSON/GeoJSON/CSV exports. Ordinary frontend work needs Node.js and the committed data; Python and NASA credentials are unnecessary for viewing it.

## Start the frontend

Use **Node.js 22.12+**. GitHub Actions uses Node 24. From the repository root:

```powershell
cd web
npm ci
npm run dev
```

Open Vite's printed URL. To check the production build, run these from `web/`:

```powershell
npm run test:evidence
npm run typecheck
npm run build
npm run preview -- --host 127.0.0.1 --port 4173 --strictPort
```

The preview is at `http://127.0.0.1:4173/`. Keep it running for screenshots and browser tests. PWA/service-worker behavior must be checked in the production preview on localhost, or the published HTTPS site.

## Run browser checks

Install Chromium once, then use another terminal in `web/` while the production preview runs:

```powershell
npx playwright install chromium
$env:UPGRADE_OFFLINE = "1"
npm run test:upgrade -- http://127.0.0.1:4173 test-results/review
Remove-Item Env:UPGRADE_OFFLINE
```

The runner covers navigation, 3D picking, charts/maps, retries, help, exports, scientific display and offline access. It writes ignored screenshots, reports and traces to the supplied output directory. Report failures and skips accurately; the [verification record](VERIFICATION.md) describes executed checks rather than promising every device is covered.

To refresh the small GitHub README gallery, from the repository root:

```powershell
node docs/gallery/capture.mjs http://127.0.0.1:4173
```

See [gallery sources and recording provenance](gallery/README.md). The [presentation builder](submission/README.md) separately captures its full-resolution slide/video assets.

## Set up the scientific pipeline

Use **Python 3.11+**, preferably an activated virtual environment. The scientific packages may require a supported Python/platform wheel combination. From the repository root:

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -e ".[dev]"
python -m pytest -q
python -m ruff check pipeline tests
```

Some tests require locally available raw/intermediate files and can skip on a clean clone. Record skip counts separately. Full local evidence and hosted checks have different scopes.

### Refit the four published historical cases

```powershell
python -m pipeline.global_cases --from-packages
```

This checks public feature-file hashes and refits the chronological models, baselines and interval calibration without a key or raw-data download. It rewrites the public case exports. It does not independently reproduce raw-source downloading, geography or feature preparation. Numerical differences between library/platform versions are possible. Read the [model card](GLOBAL_EVALUATION.md) before changing protocol or interpreting results.

### Refresh recent global observations

```powershell
python -m pipeline.world_snapshot
```

This fetches the three public rolling feeds and rewrites `web/public/data/world/`. Use `--cached` only when the matching local source cache already exists. Source URLs, dates, row counts and SHA-256 values accompany the output. Download failure raises an error; it must not become a zero-count snapshot.

### Rebuild raw scientific products

Start with the command's own options:

```powershell
python -m pipeline.run_all --help
```

The full run can download archives, boundaries, weather and related inputs, and rewrite many exports. Even archive-only work can use the network. Optional API updates use `FIRMS_MAP_KEY`, stored only in the ignored root `.env` or process environment. Preserve existing `.env` contents. No secret belongs in `web/`, a public fixture or a `VITE_*` variable.

Bangladesh is the default pipeline configuration. To use a supported alternative, set `AP_COUNTRY` for that run and remove it afterward; for example in PowerShell:

```powershell
$env:AP_COUNTRY = "pipeline/countries/npl.json"
python -m pipeline.run_all --help
Remove-Item Env:AP_COUNTRY
```

This routes country-specific pipeline paths; it does not by itself validate a new geographic model. Local CHT and ESA workflows have Bangladesh-specific scope. [Data contracts and geography](DATA_GUIDE.md).

## Where to change things

| Concern | Main locations | Keep aligned |
| --- | --- | --- |
| Screens and shared controls | `web/src/screens/`, `web/src/components/` | Keyboard/mobile behavior, loading/retry, help targets and URL state |
| Routing and data access | `web/src/lib/router.ts`, `data.ts`, `types.ts` | Shared filters, export contracts and missing-data behavior |
| English/Bangla | `web/src/i18n/en.json`, `bn.json` | Both languages, phone layout and help copy |
| Worldwide observations | `pipeline/world_snapshot.py` | Source windows, country assignment, rendering samples and total counts |
| Historical replay | `pipeline/global_cases.py`, `reference_quality.json` | Temporal protocol, every baseline, intervals and quality hashes |
| Main science pipeline | `pipeline/run_all.py`, `pipeline/config.py` | National/local/neighbour continuity and source provenance |
| Contracts and checks | `tests/`, `web/scripts/evidence.test.mjs`, `web/scripts/upgrade/` | Meaningful affected-path checks |
| PDFs, slides, PPTX and video | `docs/latex/`, `docs/submission/` | Source wording, public copies, page/duration limits and credits |

Keep Soft Earth styling, globe-based country discovery and keyboard/flat-map alternatives. Preserve observed versus estimated units, zero versus missing, source dates, interval meaning and expiry. The [Graphify map](../graphify-out/GRAPH_REPORT.md) helps navigate connected code. Repository-specific working rules are in [AGENTS.md](../AGENTS.md).

## Before publishing a change

Use a focused feature branch. Run checks appropriate to the change; documentation-only updates need link/path and visual review. Interface changes need typecheck/build and relevant browser groups; scientific changes need affected Python/evidence checks and a reviewed regeneration of exports. Update the model card when methods/claims change. Rebuild presentation binaries only when their sources change.

After code changes, run `graphify update .` from the root and include its generated outputs. Merge a verified branch into `main` and inspect the Pages deployment. Keep credentials/raw inputs ignored and preserve the configured human Git author. [Publishing details](DEPLOYMENT.md).
