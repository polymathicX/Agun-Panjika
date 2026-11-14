# Verification and reproduction

**15 November 2026 · Asia/Dhaka**. [Machine-readable release record](review/verification-2026-11-15.json) · [Model card](GLOBAL_EVALUATION.md) · [Visual evidence](review/README.md) · [Ponytail review](PONYTAIL_REVIEW_2026-11-15.md).

## Executed checks

| Check | Result | What it establishes |
| --- | --- | --- |
| `python -m pytest -q` | **80 passed, zero skips** locally | Scientific/unit/export contracts with available local inputs |
| `python -m ruff check pipeline tests` | Passed | Pipeline/test lint |
| `npm run test:evidence` | **4 passed** | Sensor switch, abstention, reference-quality handling and CSV provenance |
| `npm run typecheck`; `npm run build` | Passed | TypeScript and production/PWA build |
| Browser regression, offline enabled | **14 groups passed** | Navigation, interactions, loading/recovery, exports, guided tutorial and offline behavior |
| Responsive route matrix | **54 views**, zero recorded overflow, page/console errors or axe findings | Nine routes × six specified viewport/theme/language combinations in Chromium |
| `npm audit` | **Zero vulnerabilities** in release installation | Advisory state at audit time, not a security guarantee |
| Public-feature refit | All four published evaluation objects reproduced exactly in this environment | Annual past-only fitting/calibration, support guard and raw/comparable scoring from checksum-verified features |
| Worldwide refresh | Three public source feeds fetched and country packages generated | Recent source retrieval and geographic assignment, not full cloud/overpass completeness |
| Presentation | Brief 6 pages; roadmap 5; deck **7**; video **29.00 s** | No TeX overfull boxes/missing glyphs; all report/deck pages and representative video frames visually reviewed |
| Prior hosted refresh | [Successful 14 November run](https://github.com/polymathicX/Agun-Panjika/actions/runs/43594804856) | Actual hosted world fetch, scientific checks, build and public deployment; full-science input was disabled. This record describes local checks for the 15 November update; its publication is verified separately. |

The passing suite follows corrections for camera state after browser Back, transient incorrect day counts, malformed-data retries, and oversized/saturated globe markers. After the full run, targeted tutorial, Earth and offline checks passed again for the final keyboard-focus, pointer-leave and return-to-step fixes. Earlier failures are not represented as passes. Public static-asset caching retains the previously verified `Vary: Origin` fix.

After the presentation's final edit, the production preview passed desktop/phone video playback at exactly 29 seconds, zero overflow and zero axe findings. The same check verified the tutorial launch, country selection, current model packages, source-quality checksum, original benchmark archive and slide-PDF access. Every final slide was visually reviewed; the deck highlights the two largest measured improvements and links the full scientific comparison.

Environment: Windows, Python 3.14.6, Node 26.6.0, npm 11.18.0, Playwright 1.64.0. Declared minimums are Python 3.11 and Node 22.12. Hosted refresh uses Python 3.11 and Node 24; a local pass does not establish identical behavior on every version/device.

## Browser coverage

Routes: World, Home, Calendar, Sensors, Map, Outlook, Borders, Global cases and Method. Matrix: 1440/light/English; 1440/dark/English; 390/light/English; 360/dark/Bangla; 768/light/Bangla; 1280/dark/English.

The 14 groups are smoke, navigation, globe, textured Earth, charts, map, reliability, guided demo, exports, scientific display, global workbench, worldwide view, experience and offline. They include actual country raycast selection, keyboard country changes, source/timeline/watchlist controls, failure recovery, CSV/JSON/PNG/print flows, source-quality gaps and raw-reference disclosure, expired-outlook suppression and service-worker cached access. The eight-step tutorial checks real actions, skip/exit/replay, restored filters, persistent completion, English/Bangla, phone layout and navigation back to an interrupted step. Experience checks delay data deliberately and verify skeletons, stable selected-day totals, summary independence from the Bangladesh manifest and corrected-data retries.

Chrome reported no PWA installability errors. The offline check uses a fresh browser context, waits for the service worker, disables networking and opens the shell/cases. It is not just an assertion that a manifest exists.

These checks are **not** a completed user study, full accessibility certification, physical Android/iPhone test, native OS share-dialog test, physical-printer test or prospective scientific evaluation. Rendering a research forecast does not re-estimate its skill. The remaining large MapLibre bundle warning is visible in the production build; physical low-end-device performance remains to be measured.

## Repeat software checks

From the root:

```powershell
python -m pip install -e ".[dev]"
python -m pytest -q
python -m ruff check pipeline tests
```

Some raw-input tests can skip on a clean clone without local data. Report skips explicitly; they are not reproduced results.

From `web/`:

```powershell
npm ci
npm run test:evidence
npm run typecheck
npm run build
npm audit
npx playwright install chromium
npm run preview -- --host 127.0.0.1 --port 4173 --strictPort
```

Keep the preview running and use another terminal in `web/`:

```powershell
$env:UPGRADE_OFFLINE = "1"
npm run test:upgrade -- http://127.0.0.1:4173 test-results/review
Remove-Item Env:UPGRADE_OFFLINE
```

Raw browser artifacts remain ignored under `web/test-results/`. The complete passing suite is in local `nov15-release/`, and final targeted checks in `nov15-final-targeted/`; portable counts and selected outputs are published in the machine record above.

## Reproduce scientific evidence

```powershell
python -m pipeline.global_cases --from-packages
python -m pytest -q tests/test_global_cases.py tests/test_continuity.py
```

This needs no key or raw observations. It checks the public feature-file hashes, then refits three yearly vintages per area, baselines, interval calibration and scoring. Source-quality tests derive the excluded weeks from the versioned NASA interval manifest and verify that original raw labels remain unchanged. There are 156 raw weeks and 142 comparable weeks per area. Platform/library versions may introduce numerical differences. This does not independently reproduce source downloading, geography or raw-to-feature construction. For that, use the country/neighbour pipeline inputs and `python -m pipeline.global_cases` without the flag. See the [model card](GLOBAL_EVALUATION.md).

For recent worldwide data, `python -m pipeline.world_snapshot` fetches the public feeds. `--cached` reproduces the locally cached snapshot. Input URLs, source windows, row counts and hashes are exported. Counts cover all retained rows; the rendered points are samples.

Bangladesh ingestion, weather, harmonization, continuity, climatology, local exports and outlooks were regenerated locally through the available 14 November snapshot. `python -m pipeline.run_all --help` documents orchestration. Optional `FIRMS_MAP_KEY` stays in the ignored root environment. Source retirement and retrieval errors are handled explicitly, while coarse historical coverage assumptions remain.

The portable workflow uses past-only fitting and separate interval calibration for each test year, but the historical years were already known during development. Chin and Punjab–Haryana improve on all original weeks; Bangladesh and Nepal regress about 2%, and Chin's monthly baseline still wins. Untouched final evaluation, blind industrial-source validation, prospective forecasting and a human pilot remain uncompleted. The [earlier audit](SCIENTIFIC_REVIEW.md) preserves the old Bangladesh LOYO concerns.

## Presentation and publication

`python docs/submission/build.py` captures the app and rebuilds native data figures, seven slides and the 29-second captioned video. `python docs/latex/build.py` rebuilds the A4 reports. Both reject TeX overflow/missing glyphs; the demo builder checks page count and duration. [Instructions](submission/README.md).

GitHub Pages hosts the static app. Pushes publish committed exports; scheduled/manual global refresh can serve newer recent observations than the repository snapshot. The hosted global refresh has succeeded; the full heavy science option is not claimed as reverified in that CI run. The team still needs to review the official form and click Submit for Judging.

The [29 October record](archive/VERIFICATION-2026-10-29.md) remains historical and does not supersede this release.
