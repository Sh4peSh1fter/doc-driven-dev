---
name: maintaining-docs
description: Use when updating an existing doc, changing its status, deprecating or archiving content, or moving/renaming a doc and fixing the links that point at it.
---

# Maintaining docs

## Overview

Keep the docs tree healthy as it changes: refresh content, transition status, archive what is superseded, and move files without leaving broken links. Every operation ends with a validator run.

## Updating a doc

1. Make the content change.
2. Bump `last_update.date` to today and set `last_update.author`.
3. If the doc was `draft` and is now verified and complete, set `status: current` and `draft: false`.
4. Validate.

## Status transitions

| From → To | When | Action |
|:----------|:-----|:-------|
| `draft` → `current` | Content verified and complete | Set `status: current`, `draft: false`, bump date |
| `current` → `deprecated` | Superseded but still referenced | Set `status: deprecated`; add a note at top linking the replacement |
| `deprecated` → `archived` | No longer relevant | Move to `99-archive/` (see below) |

## Archiving

1. Move the file into `docs/99-archive/` (preserve a hint of its origin in the path or filename).
2. Set `status: archived`.
3. Find inbound links and update them: either point to the replacement doc, or remove the link if the content is gone. `99-archive/` is excluded from validation, so links *into* it from live docs are still checked — do not leave a live doc linking to archived content unless intended.

## Moving or renaming a doc (and relinking)

This is the operation that most often breaks the tree. Do it in order:

1. **Find inbound links first.** Search the docs tree for links whose resolved target is the file you are about to move:
   ```bash
   grep -rn "old-name" docs --include=*.md
   ```
   Also check links that reach it via relative paths from other folders.
2. **Move the file** to its new path.
3. **Rewrite every inbound link** to the new path, recomputing the `../` depth from each source file's location.
4. **Fix the moved file's own outbound links** — its depth to `_templates/`, `glossary.md`, etc. changed.
5. **Update navigation:** the old section README's Contents table (remove the row) and the new one (add it).
6. **Validate** — `node docs-tools/check-docs.mjs`. The broken-link check is the safety net; treat any finding as a missed relink.

## Common mistakes

- Moving a file but only fixing its own links, not the inbound ones.
- Forgetting to recompute `../` depth after a move.
- Archiving content that live docs still link to, creating dangling references.
- Leaving `status: current` on a doc whose code changed underneath it (that is drift — see the **syncing-docs-with-code** skill).
