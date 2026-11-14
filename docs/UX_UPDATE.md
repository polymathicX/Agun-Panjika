# Interface update — 15 November 2026

The Soft Earth design remains the visual basis. This update concentrates on learning the controls, keeping the layout steady and removing misleading intermediate states.

- A first visit offers an eight-step, optional tutorial. It teaches country selection, satellite views, dates, a local watchlist, the historical comparison, revealing reference data and keeping an evidence brief. Progress follows real actions. Back, skip, Escape and replay are available; finishing or leaving restores the original view and filters.
- The tutorial supports keyboard selection, a flat-map fallback, English/Bangla and reduced motion. Changing a slider does not steal keyboard focus. Its highlight follows the actual control rather than an image of it.
- Loading placeholders reserve space for the globe, cards and charts. Country-point retrieval has a small local loading indicator; it no longer makes a selected day's count temporarily look like a whole-week count.
- Browser Back now restores the globe's country as well as its label. Daily chart bars also select a day. The worldwide view and historical workbench can load even if the separate Bangladesh manifest request fails.
- Primary navigation distinguishes worldwide histories from the Bangladesh map. The existing overview, outlook, calendars and methodology remain available through More.
- Phone layouts remove repeated snapshot banners. Point markers use the display color conversion and smaller marks so the Earth stays readable. Hover hit-testing runs at most once per animation frame.

No tour framework, animation library or new runtime dependency was added. Existing routing, request handling, exports and scientific distinctions are retained. The tour stores only its seen/completed state locally; it creates no account or tracking service.

## Review and verification

Ponytail review covered the affected callers, data loading, tutorial state, cleanup, keyboard behavior and bounded rendering. Native controls and the existing components were reused. The browser checks exercise the complete tutorial, persistence, restoration, slow requests, history and globe picking. The final release verification records the responsive matrix and combined scientific/frontend checks.

Physical-phone performance and practitioner comprehension still require real-device/user testing. Browser emulation does not establish those outcomes.
