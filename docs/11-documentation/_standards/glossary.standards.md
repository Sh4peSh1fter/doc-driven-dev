---
title: "Glossary Standards"
description: "Rule of two, per-term shape, bidirectional link convention, and coverage expectations for docs/glossary.md."
status: current
last_update:
  date: "2026-06-17"
  author: "doc-driven-dev"
doc_type: standards
tags: [documentation, glossary, standards]
draft: false
---

# Glossary Standards

## Rule of two

If a concept appears in **two or more places** in the codebase or docs, define it **exactly once** in [the Glossary](../../glossary.md) (or a dedicated shared doc under `docs/03-architecture/`), and link to that definition everywhere else. Competing definitions of the same term are a defect.

## Per-term template

Each glossary entry follows this four-line shape:

```markdown
### TermName

**Definition:** One or two sentences. What it is, not how it works.

**Scope:** Which part of the system the term applies to (`domain`, `service`, `data`, `infra`, `process`, or `all`).

**Related:** Comma-separated links to closely related glossary terms.

**See also:** [Canonical doc](../../path/to/canonical.md) — the single authoritative reference.
```

The `See also` line must point at the canonical doc for the term. The validator emits a warning for any entry missing a `See also` link.

## Bidirectional links

- **Glossary → canonical doc:** the `See also` link in each entry.
- **Canonical doc → glossary:** the canonical doc links the glossary on first use of the term.

Maintain both directions when a term is added or a canonical doc moves.

## Coverage expectations

The glossary should cover all terms that satisfy the rule of two: domain entities, key workflow states, recurring technical concepts, and process vocabulary. When you add a new domain concept, decide whether it belongs in the glossary before closing the change.

## What does not belong in the glossary

- Implementation details that belong in code comments.
- Definitions specific to one file or module (use inline comments instead).
- Technology-name definitions — link to the library's own docs instead.

---

## Related Docs

- [Glossary](../../glossary.md)
- [Frontmatter Standards](./frontmatter.standards.md)
- [Linking Standards](./linking.standards.md)
- [Documentation Standards hub](./README.md)
