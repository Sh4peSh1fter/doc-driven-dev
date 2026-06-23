---
title: "Templates index"
description: "Central index of document templates. Copy the right template before creating a new doc."
status: current
last_update:
  date: "2026-06-17"
  author: "doc-driven-dev"
doc_type: readme
tags: [templates, documentation]
draft: false
---

# Templates index

Copy a template when creating a new file; don't start from a blank page. Templates are excluded from validation and from the published site (they carry placeholder values by design).

| Template | Use when creating | `doc_type` |
|:---------|:-----------------|:-----------|
| [`_doc-template.md`](./_doc-template.md) | Any narrative doc: guide, overview, how-to | `guide` |
| [`_doc-folder-README-template.md`](./_doc-folder-README-template.md) | A section or folder `README.md` (navigation hub) | `readme` |
| [`_template.standards.md`](./_template.standards.md) | A new `_standards/` page for a section | `standards` |
| [`_template.adr.md`](./_template.adr.md) | An Architecture Decision Record under `docs/03-architecture/decisions/` | `adr` |
| [`_template.reference.md`](./_template.reference.md) | A dense lookup or interface reference | `reference` |
| [`_template.tracker.md`](./_template.tracker.md) | A `_tasks/*.tasks.md` domain tracker | `tracker` |
| [`_template.methodology.md`](./_template.methodology.md) | A process or audit-method doc | `methodology` |

## Frontmatter contract

All templates use the canonical frontmatter contract. See [Frontmatter Standards](../11-documentation/_standards/frontmatter.standards.md) for field definitions and allowed enum values.

---

## Related Docs

- [Frontmatter Standards](../11-documentation/_standards/frontmatter.standards.md)
- [Documentation Standards hub](../11-documentation/_standards/README.md)
