---
name: doc-system-overview
description: Use when the user asks what doc-driven-dev does, how the documentation system is organized, or which docs command or skill to use for a task.
---

# doc-driven-dev: system overview

## What this is

doc-driven-dev maintains a central `docs/` tree that is the product and technical source of truth for a repo, optimized for both humans and AI agents. It is tech-stack and folder-structure agnostic. The structure adapts to the repo: a universal core plus optional domain modules.

## The pieces

- **`docs/` tree** — numbered sections (00–11, plus `99-archive`), each with a `README.md` hub and optional `_standards/`. Shared `_templates/`, `_assets/`, `glossary.md`, and a `.docmeta.json` manifest live at the root.
- **`.docmeta.json`** — the manifest: contract version, project profile, which core sections and optional modules are enabled, site config, and validator settings. Every command reads it.
- **Validator** (`docs-tools/check-docs.mjs`) — zero-dependency Node; checks frontmatter, links, structure, and glossary. Runs locally, on edit (hook), and in CI.

## Which command?

| You want to… | Command | Skill |
|:-------------|:--------|:------|
| Set up docs in a repo | `/docs-init` or `/docs-bootstrap` | setting-up-docs |
| Create one new doc | `/docs-new` | authoring-a-doc |
| Fill empty docs with real content | `/docs-author` | guided-authoring |
| Check docs are valid | `/docs-validate` | documentation-standards |
| Update / move / archive a doc | (just edit) | maintaining-docs |
| Check docs vs. code drift | `/docs-sync` | syncing-docs-with-code |
| Publish a docs website | `/docs-site` | — |

## Which skill governs the rules?

**documentation-standards** is the contract: frontmatter fields, link discipline, the glossary rule of two, and writing style. Anything that writes or reviews a doc should follow it.

## Where to read more

- Section catalog: the **setting-up-docs** skill's `reference/taxonomy.md`.
- Detection heuristics: the **setting-up-docs** skill's `reference/module-detection.md`.
- Writing style: the **documentation-standards** skill's `reference/writing-style.md`.
