# Contributing to doc-driven-dev

Thanks for your interest in improving doc-driven-dev. This guide covers how to set up, test, and extend the plugin.

## Prerequisites

- **Node.js 18 or newer.** That is the only requirement — the validator and module detector have **zero runtime dependencies**, so there is nothing to `npm install`.

## Running the tests

```bash
npm test
```

This runs three suites in `scripts/test/`:

- `run.mjs` — the documentation validator (frontmatter, links, structure, glossary).
- `detect.mjs` — the module detector against sample-repo fixtures.
- `e2e.mjs` — scaffold + validate + idempotency across the sample repos.

You can also run the tools directly:

```bash
node scripts/check-docs.mjs <path-to-docs> --strict
node scripts/detect-modules.mjs <path-to-repo>
```

## Repository layout

| Path | What lives here |
|:-----|:----------------|
| `.claude-plugin/` | Plugin and marketplace manifests |
| `commands/` | Slash commands (thin orchestrators) |
| `skills/` | Skills the agent follows (`SKILL.md` + `reference/`) |
| `agents/` | Subagent definitions |
| `hooks/` | Hook config and the post-edit validation script |
| `scripts/` | The validator (`check-docs.mjs` + `lib/`), the detector, and tests |
| `assets/docs-template/` | The docs scaffold (core sections, optional modules, templates) |
| `assets/docs-site-template/` | The Docusaurus site generator |
| `assets/ci-templates/` | CI templates installed into target repos |
| `docs/` | This repo's own docs, scaffolded by the plugin (a live example) |

## Adding to the plugin

- **A skill:** create `skills/<name>/SKILL.md` with frontmatter `name` (matching the folder) and a `description` that states **only triggering conditions** ("Use when…") — never a workflow summary. Put deep detail in `skills/<name>/reference/`.
- **A command:** create `commands/<name>.md` with a `description` and `argument-hint`; keep it a thin orchestrator that invokes a skill or script.
- **A doc template or section:** add it under `assets/docs-template/` and make sure a freshly assembled scaffold still passes the validator (`npm test` covers this via the e2e suite).

## Standards

All Markdown under any `docs/` tree follows the contract the plugin ships: see `assets/docs-template/core/11-documentation/_standards/`. Before opening a PR, run `npm test` and `node scripts/check-docs.mjs docs --strict` — both must pass. CI enforces the same on Node 18 and 20.

## Conventions

- Keep the validator and detector dependency-free.
- Write in the project's documentation voice (direct, skimmable, no "AI prose" tells) — the same standards the plugin enforces.
