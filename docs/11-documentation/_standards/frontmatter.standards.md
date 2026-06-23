---
title: "Frontmatter Standards"
description: "Canonical YAML frontmatter contract for all docs/ Markdown files: required fields, allowed enum values, and validation rules."
status: current
last_update:
  date: "2026-06-17"
  author: "doc-driven-dev"
doc_type: standards
tags: [documentation, frontmatter, standards]
draft: false
---

# Frontmatter Standards

Every Markdown file in `docs/` must open with a YAML frontmatter block that conforms to this contract. The documentation validator (`check-docs.mjs`) enforces these rules locally and in CI.

## Required fields

```yaml
---
title: "Human-readable title"
description: "One or two sentences: what this page is for and who should read it."
status: current              # see enum below
last_update:
  date: "2026-06-17"         # ISO 8601: YYYY-MM-DD
  author: "Author Name"
doc_type: guide              # see enum below
tags: []
draft: false
---
```

All eight fields are required (`title`, `description`, `status`, `last_update.date`, `last_update.author`, `doc_type`, `tags`, `draft`). Missing any field makes the validator exit non-zero.

## `status` enum

| Value | When to use |
|:------|:------------|
| `draft` | Work in progress; not yet authoritative |
| `current` | Live, authoritative, actively maintained |
| `deprecated` | Superseded; kept for reference but no longer normative |
| `archived` | Frozen; historical record only |

**ADR note:** ADRs use `status: current` in frontmatter. The ADR lifecycle state (Proposed / Accepted / Deprecated / Superseded) lives in the body as a `**Status:**` line, not in YAML, so a second enum never diverges from this contract.

## `doc_type` enum

| Value | What it covers |
|:------|:---------------|
| `guide` | Narrative explanation, how-to, overview |
| `readme` | Navigation hub for a folder; entry point for a section |
| `standards` | Normative rules for a domain or concern |
| `adr` | Architecture Decision Record |
| `template` | Copy-this file; lives under `_templates/` |
| `tracker` | Task-tracking aggregator (`_tasks/*.tasks.md`) |
| `reference` | Dense lookup table or API reference |
| `methodology` | Process methodology or audit-method doc |
| `audit-findings` | Audit findings report |

## `last_update.date` format

ISO 8601 date string: `"YYYY-MM-DD"`. The validator rejects any other format. Run `node docs-tools/check-docs.mjs --fix` to backfill a missing date with today's date and the manifest's default author.

## Validator

```bash
node docs-tools/check-docs.mjs           # check only; exits 1 on any error
node docs-tools/check-docs.mjs --fix     # also backfill a missing last_update.date
node docs-tools/check-docs.mjs --strict  # treat advisory warnings as errors too
```

The exact validator path is recorded in `docs/.docmeta.json` under `validator.path`.

## Exclusions (not validated)

The validator skips `_templates/`, `_assets/`, `_tasks/`, and any folder listed in `validator.skipDirs` in `docs/.docmeta.json` (for example `99-archive`). Templates carry placeholder values by design.

---

## Related Docs

- [Linking Standards](./linking.standards.md)
- [Glossary Standards](./glossary.standards.md)
- [Documentation Standards hub](./README.md)
