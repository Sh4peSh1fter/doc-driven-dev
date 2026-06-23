---
title: "Documentation Standards"
description: "When to write a doc, how to write one, who owns it, and how we keep the docs folder maintainable and consistent."
status: current
last_update:
  date: "2026-06-17"
  author: "doc-driven-dev"
doc_type: standards
tags: [documentation, standards]
draft: false
---

# Documentation Standards

This section owns the normative documentation rules for the repo. Start here, then drill into a specific standard.

## Standards in this section

| Standard | What it governs |
|:---------|:----------------|
| [Frontmatter Standards](./frontmatter.standards.md) | Required YAML fields, `status` enum, `doc_type` enum, date format, validator |
| [Linking Standards](./linking.standards.md) | Relative-path discipline, section numbering, broken-link gate, anchor-text rules |
| [Glossary Standards](./glossary.standards.md) | Rule of two, per-term shape, bidirectional links, coverage expectations |

## Overview

Documentation is **domain-driven** and **skimmable**. We avoid duplication by defining concepts once (the glossary or a shared architecture doc) and linking. We use a standard format (the templates under [`_templates/`](../../_templates/README.md)) and store diagrams with text descriptions for accessibility.

## When to write a doc

- **New feature or significant behavior:** add or update the relevant doc. Prefer documenting early so the doc guides implementation.
- **New public interface or data concept:** update the owning section and keep the glossary in sync for shared terms.
- **Decision with long-term impact:** record it in an ADR under `docs/03-architecture/decisions/`. Use ADRs for choices that are hard to reverse, affect multiple areas, or need a clear rationale for future readers.

## How to write docs

### Structure and style

- **Domain-driven:** organize by domain. Put each concept in one place; link from elsewhere instead of copying long passages.
- **Skimmable:** clear headings, short paragraphs, lists and tables where they help. Lead with what the doc is for and what the reader will learn.
- **Exemplary and current:** prefer small, accurate examples. Keep docs in sync with the code; treat doc updates as part of the change (same PR).
- **Consistent format:** use the standard templates so every doc has the same entry points (frontmatter, Overview, Related Docs).

### Documentation themes

1. **Audience and tasks first.** Organize pages so a reader can answer "what can I do here?" quickly: clear headings, short intros, overview before depth.
2. **Docs as code.** Version docs with the product, review them in PRs, and fix drift when behavior changes. Treat broken or stale docs as defects.
3. **Prove examples.** Prefer minimal, copy-pastable examples that match the current interface; keep them in sync.
4. **One source of truth.** Define terms and decisions once (glossary, ADRs, architecture pages) and link. Repetition is acceptable for clarity, not for competing definitions.
5. **Inclusive, accessible reading.** Meaningful link text, text alternatives for diagrams, predictable heading hierarchy.

### Patterns

- **Voice:** write as developers for developers on this project. Prefer first-person plural (we, our) for shared norms and architecture. Use second person (you, your) only for a bounded procedure addressed to a specific role. Keep the narrator consistent.
- **Emphasis:** use bold sparingly for real emphasis or scan anchors. Ordinary terms and every bullet label do not need bold.
- **Punctuation:** prefer plain punctuation and natural hyphenation. Reserve special characters for cases where they add clarity (code, math, established product names).

### Anti-patterns

- **Gratuitous bold:** do not bold every noun phrase or wrap most list labels in `**`; it adds noise and weakens real emphasis.
- **"AI prose" tells:** avoid em-dash overuse, filler openers, vague hype, decorative Unicode, and generic engagement closers ("happy to help", "let us know"). Prefer direct sentences and concrete next steps.
- **Unowned tone shifts:** do not mix marketing voice, anonymous "the user", and tutorial "you" on the same page without a reason. Pick the audience and stick to it.

### Rule of two

If a concept appears in **two or more places**, define it once in the [Glossary](../../glossary.md) or a shared doc under `docs/03-architecture/`, and link to that definition. See [Glossary Standards](./glossary.standards.md).

### Diagrams

- **Location:** store source files (Draw.io, Mermaid, etc.) under `docs/_assets/` or a section's own `_assets/`.
- **Accessibility:** always provide a text description of the diagram so the content is available without the image.
- **Naming:** use descriptive, hyphenated filenames.

### ADRs (Architecture Decision Records)

- **When:** for decisions that are high-impact, hard to reverse, or affect multiple areas. Not for trivial or reversible choices.
- **Where:** `docs/03-architecture/decisions/`, named `NNN-title.md` (e.g. `001-record-architecture-decisions.md`).
- **Sections:** Title and number, Status (Proposed / Accepted / Deprecated / Superseded), Date, Context, Decision, Alternatives considered, Consequences, Related.
- **Process:** the author owns the ADR and gets feedback before marking it Accepted. If an ADR is superseded, set its status to Superseded and link to the replacement.

## Ownership

| Area | Owner |
|:-----|:------|
| Product | Product owner / PM |
| Engineering | Engineering team (standards and workflows are shared) |
| Architecture | Tech lead / architects |
| Domain sections | Owners of that domain; keep docs in sync with code |

Owners keep their docs current and review links when structure changes.

---

## Sources of Inspiration

1. [Write the Docs — documentation guide](https://www.writethedocs.org/guide/index.html)
2. [Write the Docs — documentation principles](https://www.writethedocs.org/guide/writing/docs-principles.html)
3. [Google developer documentation style guide](https://developers.google.com/style)
4. [Documentation done right: a developer's guide](https://github.blog/developer-skills/documentation-done-right-a-developers-guide/) (GitHub Blog)
5. [Architecture Decision Records](https://adr.github.io/)
6. [Diátaxis](https://diataxis.fr/)

## Related Docs

- [Glossary](../../glossary.md)
- [Templates index](../../_templates/README.md)
- [Frontmatter Standards](./frontmatter.standards.md)
