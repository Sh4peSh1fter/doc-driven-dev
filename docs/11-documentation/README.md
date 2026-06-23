---
title: "Documentation"
description: "How the docs system itself works: standards, templates, the validator, and the published site."
status: current
last_update:
  date: "2026-06-17"
  author: "doc-driven-dev"
doc_type: readme
tags: [documentation]
draft: false
---

# Documentation

This section owns the documentation system: the rules every doc follows, the templates to start from, and the tooling that keeps the tree healthy.

**Audience:** everyone who writes or maintains docs.

## Contents

| Page | What it covers |
|:-----|:---------------|
| [Standards](./_standards/README.md) | Frontmatter, linking, glossary, and writing-style rules |
| [Templates](../_templates/README.md) | Copy-paste starting points for each doc type |

## Tooling

The validator at `docs-tools/check-docs.mjs` enforces the contract. Run it before committing:

```bash
node docs-tools/check-docs.mjs
```

Its configuration (skip dirs, default author, glossary path) lives in `docs/.docmeta.json`.

---

## Related Docs

- [Documentation Standards](./_standards/README.md)
- [Glossary](../glossary.md)
