# Code relationship graph

Initialized 29 October 2026 with Graphify's deterministic code extraction. This is supplementary architecture navigation, separate from the scientific validation of the fire record.

- [GRAPH_REPORT.md](GRAPH_REPORT.md): readable architecture/community report.
- [graph.json](graph.json): queryable node/relation data.
- [graph.html](graph.html): interactive graph; download/open locally because GitHub does not run HTML previews.

Run `graphify query "your question"` from the project root. After code changes use `graphify update .`; `graphify export html` refreshes the standalone view. A local wiki can be generated with `graphify export wiki`.

Current node and community counts are recorded in GRAPH_REPORT.md. Extraction covers code/configuration, not semantic interpretation of documents or images. Some scripts have no symbols in this extractor. Diagnostics found no missing/dangling endpoints but flagged self-loops and parallel relations that collapse in a simple-graph view. Inspect source where relation type or completeness matters. The graph is a navigation aid, not proof of complete architecture or scientific correctness.

Interpreter paths, scan roots, caches, local wiki and extraction sidecars are intentionally excluded from version control. The shareable graph/report/HTML are retained.
