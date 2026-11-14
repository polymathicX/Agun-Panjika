# Ponytail review — 15 November 2026

**What this change does:** It replaces the old screen tour with an optional tutorial that follows real actions, reserves space during loading and corrects navigation/retry behavior. The historical workflow addresses tree saturation, updates each yearly fit using only older labels and separates incomplete NASA references from true zeros.

Looks good. Ship.

The review followed the changed components and their callers, shared routing/loading, exports, model fitting/calibration, public inputs, scientific tests and deployment path. Expected use is a static public application, bounded country-point rendering and offline reference access; model training runs during an explicit build, not per visitor.

Corrections checked include browser Back restoring the camera, selected-day counts staying correct while points load, malformed data being fetched again on Retry, keyboard focus staying on sliders, returning to a tutorial step after navigating away, and clearing pending hover work on pointer leave. The tutorial has skip/exit/replay and restores original filters. No tour framework or runtime dependency was added.

Scientific checks cover strict fitted-support boundaries, preservation of raw references, source-derived outage-week masks, chronological yearly vintages, the same comparable weeks for every baseline, and independent reproduction of published scores. The all-week improvements are distinct from source-quality filtering. Bangladesh/Nepal regressions and Chin's stronger monthly baseline are published.

The completed browser matrix covers 54 views and 14 groups. Targeted checks after the final review cover tutorial restoration/resume, WebGL behavior and offline access. Python has 80 passing tests; frontend evidence tests have four. Build, typechecking and lint pass. See [verification](VERIFICATION.md) for evidence and scope.

**Verdict: Ship.**

**Not checked:** physical phones, full assistive-technology certification, practitioner outcomes and a genuinely new locked scientific evaluation period.
