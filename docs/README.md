---
title: "Documentation guide"
description: "How the docs/ tree is organized, the conventions it follows, and where to find standards."
status: current
last_update:
  date: "2026-06-18"
  author: "Sean S"
doc_type: readme
tags: [documentation]
draft: false
---

# doc-driven-dev documentation

This directory (`docs/`) is the product and technical source of truth for doc-driven-dev. It is optimized for both human developers and AI coding agents: a predictable structure, an enforced frontmatter contract, and a glossary that defines each term once.

This tree was scaffolded by doc-driven-dev itself (dogfooding). Because this is a documentation-tooling plugin rather than an application, module detection enabled the universal core only — no frontend, backend, data, or other domain modules.

## How the documentation is organized

The docs are organized into numbered domain sections. Numbers are reserved and stable across projects, so a section always lives at the same number; a project simply omits the sections it does not need.

| Section | Path |
|:--------|:-----|
| Workplan | [`00-workplan`](./00-workplan/README.md) |
| Product | [`01-product`](./01-product/README.md) |
| Engineering | [`02-engineering`](./02-engineering/README.md) |
| Architecture | [`03-architecture`](./03-architecture/README.md) |
| Documentation | [`11-documentation`](./11-documentation/README.md) |

Which sections and optional modules are enabled is recorded in [`.docmeta.json`](./.docmeta.json).

## Conventions

- **Doc shape:** copy a file from [`_templates/`](./_templates/README.md) instead of starting blank.
- **Standards:** every doc follows the [Documentation Standards](./11-documentation/_standards/README.md).
- **Terms:** use the [Glossary](./glossary.md) for shared vocabulary; link instead of redefining (rule of two).
- **Decisions:** record significant choices as [ADRs](./03-architecture/decisions/README.md).
- **Validation:** run `node docs-tools/check-docs.mjs` before committing.

## Getting started

1. Read this guide to understand the layout.
2. Skim the [Glossary](./glossary.md) for shared terms.
3. Go to the section for your role — contributors start with [Engineering](./02-engineering/README.md) and [Architecture](./03-architecture/README.md); for the "why", see [Product](./01-product/README.md).

---

## Related Docs

- [Documentation Standards](./11-documentation/_standards/README.md)
- [Glossary](./glossary.md)
