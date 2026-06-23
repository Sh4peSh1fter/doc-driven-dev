---
name: authoring-a-doc
description: Use when creating one new documentation page, ADR, standards file, or folder README, or when deciding where a new doc should live in the docs/ tree.
---

# Authoring a doc

## Overview

Create one new, contract-conformant doc and wire it into navigation. Always start from a template; never from a blank page. Pair this with the **documentation-standards** skill for the rules.

## Steps

1. **Pick the `doc_type` and section.** Use [`reference/doc-type-decision.md`](./reference/doc-type-decision.md) if unsure. The section is one of the numbered folders enabled in `docs/.docmeta.json`.

2. **Compute the target path.**
   - Regular doc: `docs/<section>/<kebab-title>.md`.
   - Section/folder README: `docs/<section>/README.md`.
   - ADR: in `docs/03-architecture/decisions/`, named `NNN-title.md`. Find the next number by listing existing ADRs and incrementing the highest (zero-padded to 3 digits).
   - Standards page: `docs/<section>/_standards/<concern>.standards.md`.

3. **Copy the matching template** from `docs/_templates/` (e.g. `_doc-template.md`, `_template.adr.md`, `_template.standards.md`, `_doc-folder-README-template.md`). Do not hand-write the frontmatter.

4. **Fill the frontmatter.**
   - `title`, `description` from the doc's purpose.
   - `last_update.date` = today (`YYYY-MM-DD`); `author` = the manifest's `project.defaultAuthor` (or ask).
   - `status`: `draft` if content is unverified or incomplete, else `current`.
   - `doc_type` to match; `draft: true` while unverified.

5. **Get relative-link depth right.** Count `../` from the new file's location to each target. From `docs/<section>/page.md`, the templates are at `../_templates/` and the glossary at `../glossary.md`. From `docs/<section>/_standards/x.md`, they are `../../_templates/` and `../../glossary.md`. This is the most common error — verify it.

6. **Wire it into navigation.** Add a row to the section `README.md` Contents table linking the new page. For an ADR, add a row to `docs/03-architecture/decisions/README.md`'s index.

7. **Register glossary terms.** If the doc introduces a term that now appears in two or more places, add a glossary entry (four-line shape, with a `See also` back to this doc) and link the term on first use here.

8. **Validate.** Run `node docs-tools/check-docs.mjs` and fix every error before reporting done.

## Common mistakes

- Wrong `../` depth (see step 5).
- ADR not zero-padded or not following `NNN-title.md`.
- Creating the file but forgetting to link it from the section README (orphan page).
- Setting `status: current` on content that was inferred, not verified.
