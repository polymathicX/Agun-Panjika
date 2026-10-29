# Verification and reproduction

Recorded **29 October 2026 (Asia/Dhaka)**. The Soft Earth UI restoration was tested on documentation baseline `2406bbf` using the saved design delta through `62c129d`. The pipeline and scientific exports remain unchanged. Scientific models were not retrained and data exports were not regenerated.

[Project brief](PROJECT_BRIEF.md) · [Scientific review](SCIENTIFIC_REVIEW.md) · [Machine-readable verification](review/verification-2026-10-29.json)

## Executed checks

| Check | Result | What it establishes |
| --- | --- | --- |
| `python -m pytest -q` | 59 passed, zero skips | Existing scientific/unit/export checks with available local inputs |
| `npm ci` | Completed | Locked frontend dependencies installed; manifests/lockfile unchanged |
| `npm run typecheck` | Passed | Current TypeScript source checks |
| `npm run build` | Passed | Production static bundle builds |
| Production browser regression, offline enabled | 11 groups passed | Navigation, interactions, exports, failure recovery and cached offline behavior |
| Route matrix | 42 views; no recorded page/console errors, overflow or axe findings | The specified viewport/theme/language combinations in Chromium |
| `npm audit` | Five advisory groups: two moderate, two high, one critical | Dependency review remains release work; no exploitability assessment made |

Environment: Python 3.14.6, Node.js 26.6.0, npm 11.18.0, Playwright 1.64.0. The declared project minimums are Python 3.11 and Node 20; this run does not establish parity on every supported version.

The first TypeScript attempt failed because the pre-existing local installation lacked `d3-geo`. A clean `npm ci` from the unchanged lockfile resolved it. The final pass above is the reported result.

## Browser coverage

The suite covered all seven routes: Home, Calendar, Sensors, Map, Outlook, Borders and Method. The matrix used six viewport/theme/language combinations: 1440/light/English, 1440/dark/English, 390/light/English, 360/dark/Bangla, 768/light/Bangla and 1280/dark/English.

| Group | Checked behavior |
| --- | --- |
| Smoke | Route rendering, page width, browser errors and axe rules |
| Navigation | Shared selection state, URL/history and persistence |
| Globe | Geographic controls, selection and fallback behavior |
| Textured Earth | WebGL rendering, demand drawing, keyboard/zoom, search/time sync, responsive resizing, texture/context-loss fallback and lazy loading |
| Charts | Calendar/chart interactions and alternatives |
| Map | District/point controls and recovery |
| Reliability | Request failures, malformed data, retries and race handling |
| Demo | Guided story and restoration of prior state |
| Exports | CSV bytes, PNG, clipboard, print/PDF, local calendar and audio interactions |
| Scientific display | Existing outlook/weather/feeds, borders, continuity and tile recovery |
| Offline | Production service worker, cached Home/calendar, archived data parity and notice |

This is not a completed user study, full accessibility certification, physical-printer test, native operating-system share-dialog test or prospective scientific evaluation. Scientific display checks verify UI behavior and existing export contracts; they do not re-estimate forecast skill.

## Repeat the checks

From the repository root, with a Python environment containing the dev dependencies:

```sh
python -m pip install -e ".[dev]"
python -m pytest -q
```

Some checks in other environments may skip if raw/intermediate datasets are absent. Report skips explicitly; a skipped raw-data case is not a reproduced scientific result.

From `web/`:

```sh
npm ci
npm run typecheck
npm run build
npx playwright install chromium
npm run preview -- --host 127.0.0.1 --port 4173 --strictPort
```

Keep the preview running, then use another PowerShell terminal in `web/`:

```powershell
$env:UPGRADE_OFFLINE = "1"
npm run test:upgrade -- http://127.0.0.1:4173 test-results/review
Remove-Item Env:UPGRADE_OFFLINE
```

In a POSIX shell, use `UPGRADE_OFFLINE=1 npm run test:upgrade -- http://127.0.0.1:4173 test-results/review`. The runner writes logs, screenshots and JSON into the supplied output directory. Raw local QA output is gitignored; a portable result matrix and selected captures are published under [review/](review/README.md).

## Reproduce the documentation figures

From the repository root:

```sh
python -m pip install matplotlib
python notebooks/review_figures.py
```

The script reads committed `validation.json` and `partner.json` and writes PNG/SVG/PDF into `docs/review/figures/`. It does not download data or retrain. The weekly MAE chart uses 2012–2025 from the export itself. The continuity chart normalizes each series by its own 2012–2024 mean and identifies the 2019 ESA product change. [Captions and vector downloads](review/README.md)

## Scientific reproduction versus software verification

`python -m pipeline.run_all --help` describes regeneration options. Running the pipeline downloads archive inputs, obtains optional API updates and fits scientific models. It rewrites data products; this is separate from testing the existing application. Record input versions, retrieval times, configuration, model seeds and output hashes when conducting a new experiment.

For an independent evaluation, first agree on temporal/geographic splits and a locked final holdout. The current internal metrics, uncertainty concerns and proposed protocol changes are documented in [SCIENTIFIC_REVIEW.md](SCIENTIFIC_REVIEW.md) and [GLOBAL_EXTENSION_PLAN.md](GLOBAL_EXTENSION_PLAN.md).

## Hosted status and remaining release work

The [latest hosted run inspected during the review](https://github.com/polymathicX/Agun-Panjika/actions/runs/40683652006) failed at `Run pipeline`; tests, site build and deployment were skipped. Two preceding scheduled runs also failed. This is a dated observation; consult [Actions](https://github.com/polymathicX/Agun-Panjika/actions) for later runs. The failure's root cause was not diagnosed in this documentation task.

No working public app URL was verified. Publishing this documentation makes the project reviewable on GitHub; it does not establish that the application has been deployed successfully or the data refreshed.

Further work includes the current dependency advisories, explicit software licensing, stale-product handling and in-app methodology copy. Some Method text still says 50/50 ensemble and 2012–2024; the model/export and current documentation specify 30/70 and 2012–2025. The documentation refresh does not change scientific algorithms or application behavior.

## Soft Earth restoration evidence

The original blue/cream layout, coral controls and textured Three.js globe were restored from the saved feature delta after the documentation gallery had shown the older main interface. A new production desktop capture matches `docs/readme-assets/soft-earth-desktop.png` byte-for-byte. The mobile capture was visually reviewed. All eleven production browser groups passed, including the added Earth3D checks and the original scientific/export/offline flows. See the [current gallery](review/README.md) and [verification record](review/verification-2026-10-29.json).
