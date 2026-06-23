---
description: Run the documentation validator over the docs/ tree
argument-hint: "[--fix] [--strict] [--json] [path]"
---

# /docs-validate

Validate the documentation against the contract: frontmatter, links, structure, and glossary discipline.

Arguments: `$ARGUMENTS`
- `--fix` — backfill a missing `last_update.date` with today's date.
- `--strict` — treat advisory warnings (weak anchor text, glossary gaps, ADR naming) as errors.
- `--json` — machine-readable output.
- `path` — a specific docs directory or single `.md` file (default: `./docs`).

Run the installed validator:

```bash
node docs-tools/check-docs.mjs $ARGUMENTS
```

If `docs-tools/check-docs.mjs` is missing, the docs were not scaffolded by doc-driven-dev — run `/docs-init` first. Report the findings and, when errors exist, offer to fix them (frontmatter via `--fix`, links and content via the **documentation-standards** and **maintaining-docs** skills).

For a deeper hygiene report (drafts, empty sections, glossary gaps), dispatch the **docs-auditor** agent instead.
