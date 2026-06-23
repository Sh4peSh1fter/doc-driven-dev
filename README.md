# doc-driven-dev

A Claude Code plugin for **documentation-driven development**. It sets up a central, AI-and-human-optimized documentation folder in any repo, ships enforced standards and templates, validates docs in CI, and uses agent skills to bootstrap and progressively author real content.

It is **tech-stack and folder-structure agnostic**: the same system works for a Rust CLI, a React app, or a Python ML monorepo. The docs taxonomy adapts to what your repo actually contains.

## Why

Most repos either lack structured docs or let them rot. doc-driven-dev productizes a proven knowledge-base pattern — a numbered domain taxonomy, an enforced frontmatter contract, per-section standards, a glossary "rule of two," and a published site — into a reusable plugin so any team can practice docs-as-code from day one.

## What you get

- **An adaptive `docs/` tree.** A small universal core (workplan, product, engineering, architecture, documentation-meta, archive) is always scaffolded. Optional domain modules (frontend, backend, data, ai-system, infrastructure, security, qa) are enabled based on what the plugin detects in your repo. Small projects stay light; large ones get the full taxonomy.
- **An enforced documentation contract.** Every doc carries an 8-field YAML frontmatter block. A zero-dependency Node validator (`check-docs.mjs`) checks frontmatter, links, structure, and glossary discipline — locally and in CI.
- **Templates and standards.** Copy-paste templates per document type, plus normative standards for frontmatter, linking, glossary, and writing style.
- **Agent skills and commands.** Skills teach Claude how to set up, author, maintain, and keep docs in sync with code. Slash commands orchestrate them.
- **A Docusaurus site generator.** Turn the docs folder into a browsable, searchable website with one command.

## Install

This is a Claude Code plugin. The repo doubles as its own marketplace, so install it in two steps:

```
/plugin marketplace add Sh4peSh1fter/doc-driven-dev
/plugin install doc-driven-dev@doc-driven-dev-marketplace
```

During development you can point Claude Code at a local clone instead. (An official-marketplace listing is planned for later.)

## Quick start

In any repo:

```
/docs-bootstrap
```

This profiles the repo, proposes which documentation modules to enable, scaffolds the `docs/` tree, and offers to start a guided authoring session that drafts real content from your code (with your review).

Prefer to drive it step by step:

| Command | What it does |
|:--------|:-------------|
| `/docs-init` | Scaffold the `docs/` tree (structure only, no content fill). |
| `/docs-bootstrap` | Profile the repo, init, then offer guided authoring. |
| `/docs-new <doc_type> "<title>" [section]` | Create one new doc (guide, ADR, standards, README), wired into navigation. |
| `/docs-validate` | Run the documentation validator. |
| `/docs-author [section]` | Launch the guided interview that progressively drafts content. |
| `/docs-site init\|build\|serve` | Generate and run the Docusaurus site. |
| `/docs-sync [base-ref]` | Check whether docs have drifted from recent code changes. |

## How it stays stable and portable

A committed manifest at `docs/.docmeta.json` records the contract version, project profile, and which sections and modules are enabled. Every command reads it, so the structure is stable, re-running `/docs-init` is idempotent, and the validator stays language-agnostic (it reasons only about Markdown and the manifest).

## A live example

This repo dogfoods itself: the [`docs/`](./docs/) tree was scaffolded and authored with the plugin, so it doubles as a working example of the output — structure, standards, glossary, and a seed ADR.

## License

MIT — see [LICENSE](./LICENSE).
