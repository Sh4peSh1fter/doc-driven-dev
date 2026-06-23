---
name: setting-up-docs
description: Use when a repo has no docs/ folder or no docs/.docmeta.json yet, or when the user asks to initialize, scaffold, set up, or bootstrap documentation for a project.
---

# Setting up the docs folder

## Overview

Scaffold a central `docs/` tree from the doc-driven-dev templates: a small universal core, plus any optional domain modules the repo warrants. Write the `.docmeta.json` manifest, render the templated root files, and install the validator. The operation is **idempotent** — re-running only adds what is missing and never deletes a user's content.

Plugin assets live under `${CLAUDE_PLUGIN_ROOT}`. The docs templates are at `${CLAUDE_PLUGIN_ROOT}/assets/docs-template/`.

## Before you start: detect the current state

1. **Existing manifest?** If `docs/.docmeta.json` exists, this is a re-run. Read it, and only add sections/modules whose `enabled` is true but whose folder is missing. Never overwrite existing docs. Skip to step "Render enabled sections".
2. **Existing `docs/` without a manifest?** Do not overwrite. Offer **migration mode**: write a `.docmeta.json` describing what is already there, then run the validator with `--fix` to backfill frontmatter dates, and report which files need manual frontmatter. Ask before moving or renumbering any existing files.
3. **No `docs/` at all?** Fresh scaffold — continue below.

## Step 1 — Build the project profile

Gather these values (read first, ask only what you cannot determine):

| Token | Source |
|:------|:-------|
| `project_name` | `package.json` name, `pyproject.toml`, `Cargo.toml`, or the repo directory name |
| `project_slug` | kebab-case of the name |
| `repo_url` | `git config --get remote.origin.url` (normalize to https), else `""` |
| `default_author` | `git config user.name`, else the repo owner, else `""` |
| `today` | today's date as `YYYY-MM-DD` |
| `plugin_version` | the `version` in `${CLAUDE_PLUGIN_ROOT}/.claude-plugin/plugin.json` |
| `monorepo` | `true` if `pnpm-workspace.yaml`, `turbo.json`, `nx.json`, `lerna.json`, or a workspaces field is present |
| `packages` | workspace package roots when monorepo, else `[]` |

## Step 2 — Decide enabled modules

The core is always enabled: `00-workplan`, `01-product`, `02-engineering`, `03-architecture`, `11-documentation`, `99-archive`.

For optional modules, run the detector:

```bash
node "${CLAUDE_PLUGIN_ROOT}/scripts/detect-modules.mjs" --json
```

It prints the proposed modules with reasons and owned paths. Present the proposal to the user and let them adjust (a `/docs-init --modules a,b,c` argument overrides detection). If the detector is unavailable, ask the user which of the optional modules apply: `04-frontend`, `05-backend`, `06-data`, `07-ai-system`, `08-infrastructure`, `09-security`, `10-qa`.

**Keep small projects light:** if nothing is detected, scaffold the core only and do not enable the site.

## Step 3 — Render the scaffold

Copy and render into the repo's `docs/`:

1. **Core sections:** copy every folder under `assets/docs-template/core/` into `docs/` (e.g. `core/01-product/` → `docs/01-product/`). These contain no tokens — copy verbatim.
2. **Enabled modules:** for each enabled module, copy `assets/docs-template/modules/<module>/` into `docs/<module>/`.
3. **Shared dirs:** copy `assets/docs-template/_templates/` → `docs/_templates/` and `assets/docs-template/_assets/` → `docs/_assets/`.
4. **Templated files** (substitute every `{{token}}`):
   - `README.md.hbs` → `docs/README.md`. Build `{{enabled_sections_table}}` as a Markdown table with one row per enabled section (Section name + relative link to its `README.md`).
   - `glossary.md.hbs` → `docs/glossary.md`.
   - `.docmeta.json.hbs` → `docs/.docmeta.json`. Substitute every token so the result is valid JSON (no trailing commas, booleans and arrays/objects unquoted):
     - scalars: `{{plugin_version}}`, `{{today}}`, `{{project_name}}`, `{{project_slug}}`, `{{repo_url}}`, `{{default_author}}`, `{{validator_path}}` (default `docs-tools/check-docs.mjs`).
     - booleans (unquoted): `{{monorepo}}`, `{{site_enabled}}` (`false` unless the user opted into the site).
     - JSON-serialized values: `{{packages_json}}` (the `packages` array, e.g. `[]`), `{{core_json}}` (array of core section names), `{{skip_dirs_json}}` (array, default `["99-archive"]`), and `{{modules_block}}` (a JSON object with every optional module key present, each `{ "enabled": <bool>, "reason": "<why>", "paths": [...] }`).

Render tokens deterministically — produce valid JSON for `.docmeta.json` (no trailing commas, booleans unquoted).

## Step 4 — Install the validator

Copy the validator into the repo so it runs with zero install:

- `${CLAUDE_PLUGIN_ROOT}/scripts/check-docs.mjs` → `docs-tools/check-docs.mjs`
- `${CLAUDE_PLUGIN_ROOT}/scripts/lib/` → `docs-tools/lib/`

The manifest's `validator.path` must match where you installed it (default `docs-tools/check-docs.mjs`).

## Step 5 — Verify

Run the validator and confirm a clean pass:

```bash
node docs-tools/check-docs.mjs --strict
```

Fix any finding before reporting done. A fresh scaffold must pass clean. Then summarize for the user: which sections were created, which modules were enabled and why, and the suggested next step (`/docs-author` to start filling content, or `/docs-site init` to publish).

## Edge cases

- **Monorepo:** default to a single top-level `docs/`. Record `monorepo: true` and the package roots in `paths`. Only create per-package docs if the user explicitly asks.
- **Non-git repo:** detection still works (it reads the filesystem). Skip `repo_url`/`default_author` git lookups; ask or leave blank.
- **Re-run / partial tree:** treat the manifest as the source of truth. Add missing enabled sections; never delete.

## Reference

- The full section catalog and per-section structure: [`reference/taxonomy.md`](./reference/taxonomy.md).
- The detection signal table and monorepo rules: [`reference/module-detection.md`](./reference/module-detection.md).

## Common mistakes

- Overwriting an existing `docs/` — always detect first.
- Wrong relative-link depth in generated content — the validator catches this; fix before reporting done.
- Forgetting to copy `docs-tools/lib/` — the validator imports it and will fail without it.
