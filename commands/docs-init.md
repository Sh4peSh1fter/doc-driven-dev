---
description: Scaffold a central docs/ folder (structure only — no content fill)
argument-hint: "[--modules a,b,c] [--site] [--force]"
---

# /docs-init

Scaffold the documentation folder for this repo using doc-driven-dev. This creates the structure, standards, templates, manifest, and validator — it does **not** write real content (use `/docs-author` for that).

Arguments: `$ARGUMENTS`
- `--modules a,b,c` — force this exact set of optional modules, skipping detection.
- `--site` — also enable the Docusaurus site in the manifest (run `/docs-site init` afterward to generate it).
- `--force` — proceed even if a `docs/` folder already exists (still never deletes user content).

Use the **setting-up-docs** skill to perform the scaffold. Follow it exactly:

1. Detect current state (existing manifest → idempotent re-run; existing docs without manifest → offer migration; otherwise fresh scaffold).
2. Build the project profile.
3. Decide enabled modules — honor `--modules` if given, otherwise run `node "${CLAUDE_PLUGIN_ROOT}/scripts/detect-modules.mjs" --json` and confirm the proposal with the user.
4. Render the core sections, enabled modules, shared dirs, and templated files (`README.md`, `glossary.md`, `.docmeta.json`).
5. Install the validator into `docs-tools/`.
6. Run `node docs-tools/check-docs.mjs --strict` and confirm a clean pass before reporting done.

Report which sections and modules were created and the suggested next step.
