---
name: syncing-docs-with-code
description: Use when code has changed (a diff, branch, or merged PR) and the docs may be stale, or when the user asks to check whether documentation is in sync with the code.
---

# Syncing docs with code

## Overview

Find documentation that has drifted from the code and propose targeted updates. Drift is a defect, not a nicety: a stale doc misleads both humans and agents. This skill maps changed code to the docs that own it and flags what to revisit.

## Step 1 — Get the changed files

Prefer git:

```bash
git diff --name-only <base-ref>...HEAD     # changes on this branch
git diff --name-only                        # uncommitted working changes
```

If `<base-ref>` is not given, default to the merge-base with the default branch (`git merge-base HEAD origin/main` or `main`).

**Non-git repos:** fall back to modification times — compare each doc's mtime against the mtime of the code files in its owned `paths`. A doc older than the code it documents is a drift candidate. Warn the user that diff-based mapping is unavailable.

## Step 2 — Map changed code to doc sections

Read `docs/.docmeta.json`. For each enabled module, `modules.<id>.paths` lists the code it owns. Map each changed file to a section:

- File under a module's `paths` → that module's section.
- Public interface / schema / config changes → also flag `03-architecture` (and `06-data` for schema).
- New top-level capability → flag `01-product`.
- Dependency or build changes → flag `02-engineering` and `tech-stack`.

## Step 3 — Identify likely-stale docs

For each affected section, list the docs whose content plausibly describes the changed code (by topic and by links pointing into the changed paths). Prioritize: public API/schema/behavior changes first (highest reader impact), internal refactors last.

## Step 4 — Propose updates

For each stale doc, propose a specific edit — not "review this", but "the endpoint list in `05-backend/api.md` is missing `POST /x` added in `src/routes/x.ts`." Then, with the user's go-ahead, apply the updates using the **maintaining-docs** and **authoring-a-doc** skills, bumping `last_update`.

## Step 5 — Validate

Run `node docs-tools/check-docs.mjs` after edits.

## Output

A short report: changed files, the sections they touch, the specific docs that look stale, and the proposed update for each. Do not silently skip a changed area — if a change maps to no doc, say so (it may need a new doc).

## Common mistakes

- Treating every code change as doc-affecting (noise). Internal refactors with no behavior change usually need no doc update — say so.
- Mapping only by path and missing interface changes that ripple into architecture docs.
- Proposing vague "review" actions instead of concrete edits.
