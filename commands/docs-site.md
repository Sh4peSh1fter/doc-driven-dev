---
description: Generate, build, or serve the Docusaurus site for the docs/ tree
argument-hint: "init | build | serve | deploy"
---

# /docs-site

Manage the published documentation site. Subcommand from `$ARGUMENTS`.

Preconditions: a scaffolded `docs/` with `.docmeta.json` must exist.

## init

1. Copy `${CLAUDE_PLUGIN_ROOT}/assets/docs-site-template/` into `docs-site/` at the repo root (do not overwrite an existing one without confirming).
2. Render `docusaurus.config.ts.hbs` → `docs-site/docusaurus.config.ts`, substituting tokens from `docs/.docmeta.json`:
   - `{{project_name}}`, `{{project_slug}}` from `project`.
   - `{{site_url}}` / `{{base_url}}` — ask the user or default to `https://example.com` and `/`.
   - `{{org_name}}` from the repo owner if known, else the slug.
   - `{{edit_url_line}}` — if `project.repoUrl` is set, emit `editUrl: "<repoUrl>/edit/main/",`; otherwise emit nothing.
   - `{{github_navbar_item}}` — if `repoUrl` is set, emit `{ href: "<repoUrl>", label: "GitHub", position: "right" },`; otherwise nothing.
3. Generate a `_category_.json` in each **enabled** section folder under `docs/` (core + enabled modules), with `{ "label": "<Human name>", "position": <number> }` derived from the folder's `NN-` prefix and title. Docusaurus uses the section's `README.md` as the category index automatically.
4. Set `site.enabled: true` (and `site.tool: "docusaurus"`) in `docs/.docmeta.json`.
5. Tell the user to run `cd docs-site && npm install`.

## build

Run `cd docs-site && npm install && npm run build`. Surface any broken-link failures (the build throws on them) and fix the offending links before reporting success.

## serve

Run `cd docs-site && npm run serve` (after a build) or `npm start` for live dev.

## deploy

Build first, then follow the user's hosting choice (the static output is in `docs-site/build`). Do not deploy anywhere without explicit confirmation, since publishing exposes the docs externally.
