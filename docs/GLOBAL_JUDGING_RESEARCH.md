# Official 2026 global-submission checks

Verified **14 November 2026, Asia/Dhaka**. This note checks published rules and challenge scope; it does not claim that the team has submitted, been nominated, or completed every artifact below.

## Sources and current authority

- [2026 Judging & Awards Guide](https://www.spaceappschallenge.org/resources/judging-awards-guide/), published 13 November 2026.
- [2026 Project Submission Guide](https://www.spaceappschallenge.org/resources/project-submission-guide/), published 13 November 2026. The user supplied its full text in `C:/Users/sarwa/.codex/attachments/6df37303-923f-427a-a7f7-b82951cc82a5/Pasted text.txt`; the current public page agrees on the requirements below.
- [2026 Participant Terms and Conditions](https://www.spaceappschallenge.org/legal/), updated 7 August 2026.
- [Current Hot Spots challenge](https://www.spaceappschallenge.org/2026/challenges/modis-and-viirs-hot-spots/), whose embedded page metadata records publication on 13 November 2026.

All four sources were read from their official public HTML. The challenge's details/resources are embedded in its page data rather than appearing in the initial plain-text rendering. The web-search fetcher returned 502 errors, so direct public HTTP retrieval supplied the contents. The formerly indexed `/2026/challenges/harmonization-of-modis-and-viirs-hot-spots/` now contains an internal not-found result; use the current URL above. The [CONAE announcement](https://www.argentina.gob.ar/noticias/desafio-nasa-space-apps-challenge-2026-crea-soluciones-para-monitorear-incendios-con-datos) also links that current URL.

The published official November guides replace earlier uncertainty and earlier-cycle assumptions in this session. The prior Bangladesh-local score sheet should not be described as NASA's global rubric.

## Scoring and eligibility

The official rubric applies at **every judging stage**: **Impact, Creativity, Validity, Relevance and Presentation, each scored 1–5**. Scientific feasibility/usability drive Validity; substantive NASA-data integration drives Relevance; judges assess both demo and full project for Presentation.

Minimum conditions include an official challenge, completed English submission, compliant demo, and confirmed members at one Local Event or the Universal Event. Local teams need 1–6 members; Universal teams need 2–6. All must appear on the team page. Members cannot be added after submission closes. Teams must accept the terms and originality/resource-credit declarations.

Only officially submitted Global Nominees advance. Announcement dates: **3 December 2026** nominees; **17 December** finalists/honorable mentions; **26 January 2027** winners. A local award alone does not establish global nomination. No added teamwork/UX points or women-participation bonus appears in this official global rubric.

[Source: 2026 Judging & Awards Guide](https://www.spaceappschallenge.org/resources/judging-awards-guide/)

## Required submission and demo

Submission opens **14 November at 09:00** and closes **15 November at 23:59**, using the team's Local Event time zone. Universal teams use the Team Owner's residence time zone. Local judging may impose earlier deadlines. Editing and resubmitting are allowed until the hackathon ends; only the final saved submission is judged. The guide does not authorize unrestricted changes after that close. [Submission window and resubmission rules](https://www.spaceappschallenge.org/resources/project-submission-guide/)

The project page requires:

1. Project name and high-level summary.
2. Public project-demo link.
3. Public final-project link, which may be a repository or documentation; a separately deployed application is not an eligibility requirement.
4. Detailed description of function, mechanism, benefit, intended outcome and tools.
5. SI-use response, NASA data/resources used, and all other references/resources.

Use **one demo format: no more than seven slides, including title/intro, or a video of 30 seconds or less**. Exceeding the limit makes the project ineligible for Global Judging. Slides must be English; a video spoken in another language needs English subtitles. The submission page and linked materials must be English. The demo should identify the team/members and selected challenge, show the product/user experience, and explain the role of NASA/partner data. [Demo and field instructions](https://www.spaceappschallenge.org/resources/project-submission-guide/)

Host documents/videos externally and test every link without login, registration or access requests. The platform accepts images up to 10 MB, not video/document uploads. The guide says the **majority of evaluation rests on the project submission**, so the short demo cannot replace the detailed explanation. Complete the required fields, accept the declarations and click **Submit for Judging** before the deadline; saving progress is insufficient. Check for the success banner/confirmation. Recognizable under-18 likenesses must not appear in demos/final projects. [Submission steps](https://www.spaceappschallenge.org/resources/project-submission-guide/)

## NASA data, SI and resource rights

At least **one NASA data source or resource** is required for a Global Award. Identify the exact datasets/resources and their role. Cite all external code, text, imagery and tools, including freely available/open-source resources. [NASA data and references fields](https://www.spaceappschallenge.org/resources/project-submission-guide/)

The 2026 guide calls AI **Super Intelligence (SI)** and explicitly includes machine learning, chatbots, image generation and LLMs. SI is permitted as an aid; disclose where and how it was used. SI-generated images/videos need a visible watermark; generated audio, code and data need acknowledgment in descriptive text and metadata. Generated content cannot use, contain or modify NASA branding/design elements. The SI form answer itself is **not visible to judges**; judges can see indicators in the linked project. Include accurate, judge-visible disclosure instead of relying only on the form. Do not label authentic screenshots or observations as synthetic merely because coding assistance was used. [SI instructions](https://www.spaceappschallenge.org/resources/project-submission-guide/)

Original work must be unrestricted or licensed under an OSI-compliant license. If no specific compliant license is chosen, the terms say NASA will distribute original content under **Apache 2.0**. Third-party materials require compatible availability/rights, license documentation and source citations. The default distribution provision does not remove the need to document third-party licenses. [Terms: intellectual-property rights and third-party materials](https://www.spaceappschallenge.org/legal/)

## What this challenge actually requests

The current challenge asks for a web application with a **harmonized MODIS/VIIRS burning-activity calendar**, preserving a consistent hotspot history from the early 2000s through recent observations. Its two parts are sensor harmonization and a visual application with region/date-range selection and downloadable analytics/visualizations. Historical patterns, unusual activity and comparison with historical conditions are central.

Drawn areas of interest or latitude/longitude input, accessible color ramps and hotspot CSV downloads are suggested considerations, not separate global-eligibility gates. The only resource currently listed in the official Resources tab is [NASA Earthdata FIRMS](https://www.earthdata.nasa.gov/data/tools/firms). Additional datasets are allowed; describe their actual role without implying a challenge mandate or endorsement.

[Source: Hot Spots challenge, Objectives/Potential Considerations/Resources](https://www.spaceappschallenge.org/2026/challenges/modis-and-viirs-hot-spots/)

## Artifact checks for a defensible presentation

These are recommendations from the rules and challenge, not an assertion that the repository lacks each item:

| Artifact to verify | Why it matters |
| --- | --- |
| Public English seven-slide deck or timed video | The demo is mandatory even when code and a long local pitch already exist. |
| Complete project-page copy | A polished demo does not substitute for the material carrying most of the evaluation. |
| Reproducible evidence page/model card | Let a reviewer locate the evaluated data period, train/test separation, baselines, metric definitions and limitations behind every displayed scientific number. |
| Actual working-product screenshots | Show one identifiable region/date selection, the calendar, a raw-versus-harmonized comparison and an anomaly interpretation. |
| Dataset/source/asset manifest with licenses | Make provenance and reuse rights auditable; include third-party code, fonts, basemaps and imagery when used. |
| Visible SI disclosure and generated-asset metadata | The form answer alone is hidden from judges. Describe the actual development assistance and solution ML separately. |
| Tested final-project and demo links | A public repository can serve as the final project; any claimed hosted demo should actually load without authentication. |
| Submission confirmation | Prepared files and saved form text do not establish successful submission. |

A useful seven-slide sequence is: team/challenge/problem; why the sensor transition matters; method and data; evaluated evidence with limitations; working calendar/user workflow; intended impact with actual validation status; resources, reproducibility and next step. Reserve readable source credits throughout. Keep claims proportionate to the evidence: implementation success, offline statistical evaluation and real-world adoption are different accomplishments. Nothing in these guides guarantees an award for adding more features.
