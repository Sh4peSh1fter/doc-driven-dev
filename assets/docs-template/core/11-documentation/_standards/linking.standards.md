---
title: "Linking Standards"
description: "How to write relative links in docs/, the broken-link gate, and anchor-text discipline."
status: current
last_update:
  date: "2026-06-17"
  author: "doc-driven-dev"
doc_type: standards
tags: [documentation, links, standards]
draft: false
---

# Linking Standards

## Use relative paths

All cross-doc links must be relative to the source file's location. Never use absolute paths starting with `/` or repo-root anchors.

```markdown
<!-- Good: relative from docs/01-product/prd.md -->
[Architecture overview](../03-architecture/README.md)

<!-- Bad: absolute or root-relative -->
[Architecture overview](/docs/03-architecture/README.md)
```

Adjust the leading `../` depth to match where the linking file sits in the tree. The validator resolves every relative link and fails on any that does not point at an existing file.

## Section numbering

The `docs/` tree uses a reserved numbering scheme so the same section always lives at the same number across projects. Numbers may be sparse — a project without a frontend simply has no `04-frontend/`. The canonical numbering:

| Section | Path | Always present |
|:--------|:-----|:--------------|
| Workplan | `docs/00-workplan/` | core |
| Product | `docs/01-product/` | core |
| Engineering | `docs/02-engineering/` | core |
| Architecture | `docs/03-architecture/` | core |
| Frontend | `docs/04-frontend/` | module |
| Backend | `docs/05-backend/` | module |
| Data | `docs/06-data/` | module |
| AI System | `docs/07-ai-system/` | module |
| Infrastructure | `docs/08-infrastructure/` | module |
| Security | `docs/09-security/` | module |
| QA | `docs/10-qa/` | module |
| Documentation | `docs/11-documentation/` | core |

Which modules are enabled is recorded in `docs/.docmeta.json`.

## Broken-link gate

The validator checks that every relative link target exists and that in-page (`#heading`) and cross-doc (`file.md#heading`) anchors resolve to a real heading. A broken link is an error. When a published site is enabled, the Docusaurus build is a second gate that also fails on broken links.

```bash
node docs-tools/check-docs.mjs
```

## Anchor text

Use meaningful anchor text that describes the destination. Avoid "click here", "here", "this", or a bare URL as the visible text — the validator flags these as warnings.

```markdown
<!-- Good -->
[Getting started guide](../02-engineering/getting-started.md)

<!-- Bad -->
[click here](../02-engineering/getting-started.md)
```

## Linking to glossary terms

When a term has an entry in the glossary, link to it on first use in a doc rather than redefining it inline. See [Glossary Standards](./glossary.standards.md) for the rule of two.

## Templates and the broken-path trap

Template files (under `docs/_templates/`) are excluded from validation but still propagate their link text to every doc created from them. Verify that template links resolve correctly from the typical destination path of the doc being created.

---

## Related Docs

- [Frontmatter Standards](./frontmatter.standards.md)
- [Glossary Standards](./glossary.standards.md)
- [Documentation Standards hub](./README.md)
