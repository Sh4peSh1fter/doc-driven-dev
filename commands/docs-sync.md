---
description: Check whether docs have drifted from recent code changes and propose updates
argument-hint: "[base-ref]"
---

# /docs-sync

Detect documentation drift against code changes and propose targeted fixes.

Arguments: `$ARGUMENTS` — an optional git base ref to diff against (e.g. `main`, a tag, a commit). Defaults to the merge-base with the default branch. For non-git repos, falls back to modification-time comparison.

Use the **syncing-docs-with-code** skill. It will: collect changed files, map them to doc sections via `docs/.docmeta.json` owned `paths`, list the docs that look stale (highest reader-impact first), and propose a specific edit for each. Apply fixes only with the user's go-ahead, then run `node docs-tools/check-docs.mjs`.

Report changed areas that map to no doc — those may need a new page (`/docs-new`).
