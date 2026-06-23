---
title: "System overview"
description: "The 10,000-foot view of doc-driven-dev: the plugin's components and how a docs tree flows from detection to publication."
status: current
last_update:
  date: "2026-06-19"
  author: "Sean S"
doc_type: guide
tags: [architecture, overview]
draft: false
---

# System overview

doc-driven-dev is a Claude Code plugin. It ships configuration (skills, commands, agents, hooks), zero-dependency Node tooling, and a set of templates that get rendered into a target repository's `docs/` tree. There is no long-running service; everything runs locally through Claude Code or `node`.

## Components

| Component | Location | Role |
|:----------|:---------|:-----|
| Plugin manifest | `.claude-plugin/plugin.json`, `.claude-plugin/marketplace.json` | Declares the plugin and its marketplace entry |
| Commands | `commands/*.md` | Slash commands (`/docs-init`, `/docs-bootstrap`, `/docs-new`, `/docs-validate`, `/docs-author`, `/docs-site`, `/docs-sync`) — thin orchestrators |
| Skills | `skills/*/SKILL.md` | The how-to knowledge the agent follows (setting up, authoring, standards, maintaining, syncing, guided authoring, overview) |
| Agents | `agents/*.md` | Subagents for repo profiling, section authoring, and auditing |
| Hooks | `hooks/hooks.json`, `hooks/validate-on-edit.sh` | Post-edit validation of changed docs |
| Tooling | `scripts/check-docs.mjs` (+`lib/`), `scripts/detect-modules.mjs` | The validator and the module detector |
| Assets | `assets/docs-template/`, `assets/docs-site-template/`, `assets/ci-templates/` | The scaffold, the Docusaurus site, and CI templates |

## How a docs tree comes to life

1. **Detect** — `detect-modules.mjs` inspects manifests and directory names (shallow, language-light) and proposes which optional modules a repo warrants.
2. **Scaffold** — the `setting-up-docs` skill renders the core sections and enabled modules from `assets/docs-template/`, writes the `.docmeta.json` manifest, and installs the validator into `docs-tools/`.
3. **Author** — the `guided-authoring` skill (and `docs-author` agent) read the code and progressively draft real content, marking anything unverified.
4. **Validate** — `check-docs.mjs` checks frontmatter, links, structure, and glossary, locally, on edit (the hook), and in CI.
5. **Publish** — the `docs-site` flow renders a Docusaurus site from the same tree.

## Source of truth

The committed manifest `docs/.docmeta.json` records the contract version, project profile, and which sections and modules are enabled. Every command reads it, which is what keeps the structure stable, re-runs idempotent, and the validator language-agnostic (it reasons only about Markdown and the manifest).

## Key constraints

- **Zero runtime dependencies.** The validator and detector run with only `node` — no npm install. See [Tech stack](./tech-stack.md).
- **Tech-stack and folder-structure agnostic.** The tooling only ever reasons about Markdown plus the JSON manifest; module detection adapts to the repo.

---

## Related Docs

- [Tech stack](./tech-stack.md)
- [Decisions (ADRs)](./decisions/README.md)
- [Product vision](../01-product/vision.md)
