---
description: Create one new doc (guide, ADR, standards, README) wired into navigation
argument-hint: "<doc_type> \"<title>\" [section]"
---

# /docs-new

Create a single new documentation page and wire it into the docs tree.

Arguments: `$ARGUMENTS`
- `<doc_type>` — one of `guide | readme | standards | adr | reference | tracker | methodology`.
- `"<title>"` — the human-readable title (quoted).
- `[section]` — the numbered section folder (e.g. `03-architecture`). Inferred from `doc_type` and title if omitted.

Examples:
- `/docs-new adr "Use Postgres as the primary store" 03-architecture`
- `/docs-new guide "Local development setup" 02-engineering`
- `/docs-new standards "API conventions" 05-backend`

Use the **authoring-a-doc** skill to do this. It will: pick the template, compute the path (numbering ADRs as `NNN-title.md`), fill frontmatter with today's date and the manifest's default author, set the correct relative-link depth, add the page to its section README (and the ADR index where relevant), register any glossary terms, and run the validator.

Confirm the resolved path and `doc_type` with the user if the section was inferred. Report the created file and run `node docs-tools/check-docs.mjs` before finishing.
