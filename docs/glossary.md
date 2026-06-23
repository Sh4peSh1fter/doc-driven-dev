---
title: "Glossary"
description: "Shared vocabulary for doc-driven-dev. Each term is defined once here and linked from elsewhere."
status: current
last_update:
  date: "2026-06-18"
  author: "Sean S"
doc_type: reference
tags: [glossary]
draft: false
---

# Glossary

Single source of truth for shared terms. If a concept appears in two or more places, define it here once and link to it (the rule of two). Follow the [Glossary Standards](./11-documentation/_standards/glossary.standards.md).

<!-- Add terms in alphabetical order using this shape:

### TermName

**Definition:** One or two sentences. What it is, not how it works.

**Scope:** domain | service | data | infra | process | all.

**Related:** Comma-separated links to related terms.

**See also:** [Canonical doc](./path/to/canonical.md) — the authoritative reference.
-->

### Documentation contract

**Definition:** The structured YAML frontmatter every doc under `docs/` must carry — title, description, status, last_update, doc_type, tags, draft — enforced by the validator.

**Scope:** process.

**Related:** [Validator](#validator), [Manifest](#manifest).

**See also:** [Frontmatter Standards](./11-documentation/_standards/frontmatter.standards.md).

### Manifest

**Definition:** The committed `docs/.docmeta.json` file recording the contract version, project profile, and which sections and modules are enabled. The source of truth every command reads.

**Scope:** process.

**Related:** [Documentation contract](#documentation-contract).

**See also:** [System overview](./03-architecture/system-overview.md#source-of-truth).

### Validator

**Definition:** The zero-dependency Node tool (`docs-tools/check-docs.mjs`) that checks frontmatter, links, structure, and glossary discipline locally, on edit, and in CI.

**Scope:** process.

**Related:** [Documentation contract](#documentation-contract).

**See also:** [Tech stack](./03-architecture/tech-stack.md).

---

## Related Docs

- [Glossary Standards](./11-documentation/_standards/glossary.standards.md)
- [Documentation guide](./README.md)
