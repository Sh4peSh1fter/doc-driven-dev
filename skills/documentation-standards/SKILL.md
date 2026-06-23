---
name: documentation-standards
description: Use when writing or reviewing any Markdown under docs/, or when answering a question about the frontmatter contract, link rules, glossary "rule of two", or documentation writing style and voice.
---

# Documentation standards

## Overview

The normative contract every doc under `docs/` follows. The validator (`docs-tools/check-docs.mjs`) enforces the mechanical parts; this skill covers both the mechanics and the judgment (voice, structure, what to write). When a repo is scaffolded, the canonical copies live at `docs/11-documentation/_standards/` — read those if present; they win on any conflict.

## Frontmatter contract

Every doc opens with this block. All eight fields are required.

```yaml
---
title: "Human-readable title"
description: "One or two sentences: what this page is for and who should read it."
status: current              # draft | current | deprecated | archived
last_update:
  date: "2026-06-17"         # ISO 8601 YYYY-MM-DD
  author: "Author Name"
doc_type: guide              # see enum
tags: []
draft: false
---
```

- **status:** `draft` (in progress), `current` (authoritative), `deprecated` (superseded, kept), `archived` (frozen).
- **doc_type:** `guide`, `readme`, `standards`, `adr`, `template`, `tracker`, `reference`, `methodology`, `audit-findings`.
- **ADRs** use `status: current`; their lifecycle (Proposed/Accepted/Deprecated/Superseded) goes in a body `**Status:**` line, not YAML.

## Linking

- **Relative paths only.** Never absolute (`/docs/...`). Count `../` from the file's location to the target.
- **Resolve everything.** Every relative link and `#anchor` must point at a real file/heading — the validator fails otherwise.
- **Meaningful anchor text.** Describe the destination; never "click here", "here", or a bare URL.
- Link a glossary term on first use instead of redefining it.

## Glossary "rule of two"

If a concept appears in two or more places, define it once in `docs/glossary.md` (or a shared architecture doc) and link everywhere else. Each entry uses the four-line shape: **Definition**, **Scope** (`domain | service | data | infra | process | all`), **Related**, **See also** (the canonical doc — required).

## Writing style

- **Domain-driven and skimmable:** organize by domain; lead with what the doc is for; use headings, short paragraphs, lists, and tables.
- **Voice:** first-person plural (we, our) for shared norms; second person only for a bounded procedure addressed to a role. Keep the narrator consistent.
- **Docs as code:** keep docs in sync with the code, in the same change. Treat drift as a defect.
- **One source of truth:** define once, link elsewhere.
- **Accessible:** meaningful link text, text descriptions for diagrams, predictable heading hierarchy.

### Avoid "AI prose" tells

This is the most common quality failure. Do not:
- bold every noun phrase or bullet label (bold is for real emphasis only);
- overuse em dashes, filler openers, vague hype, or decorative Unicode;
- end with generic closers ("happy to help", "let us know");
- mix marketing voice, anonymous "the user", and tutorial "you" on one page.

Prefer direct sentences and concrete next steps. The deeper style guide is in [`reference/writing-style.md`](./reference/writing-style.md).

## End matter

Most docs close with a `## Related Docs` list (and `## Sources of Inspiration` when external references informed it).

## Before you finish

Run the validator and fix every error:

```bash
node docs-tools/check-docs.mjs
```

## Common mistakes

- Wrong `../` depth — the single most frequent broken-link cause.
- Missing `last_update.author` (people remember the date, forget the author).
- Redefining a term that already has a glossary entry.
- Marking a doc `current` when its facts were inferred, not verified — use `draft`.
