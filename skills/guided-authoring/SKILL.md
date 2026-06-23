---
name: guided-authoring
description: Use when the docs structure exists but is mostly empty stubs and the user wants to progressively fill it with real content, or asks to be interviewed about the project to draft documentation.
---

# Guided authoring

## Overview

Fill the scaffolded docs tree with real, trustworthy content by reading the code first, asking the user only what the code cannot answer, drafting one section at a time, and marking everything uncertain. The governing principle: **read first, ask second, draft third, mark uncertainty explicitly.** Never invent facts.

Pair with **authoring-a-doc** (for creating each file) and **documentation-standards** (for the rules).

## The loop

Work one section at a time, smallest viable doc first. For each section:

### 1. Read what is knowable

Before asking anything, gather evidence: the root README, package manifests, entry points, config, existing ADRs, CI config, and the section's owned `paths` from `docs/.docmeta.json`. Build a picture from the code.

### 2. Ask only the gaps

Batch 3–5 questions the code cannot answer (product intent, target users, non-obvious constraints, the "why" behind a choice). Prefer grounded multiple-choice over open-ended:

> I see Prisma and a Postgres URL — is Postgres the primary store? [yes / no / other]

Do not ask what you can read.

### 3. Draft, citing or marking every claim

- Each statement is either grounded in a file you read (link to it with a relative path) or explicitly marked.
- Anything inferred or unverified gets `status: draft`, `draft: true`, and an inline `> TODO(verify): …` callout at the specific claim.
- **Never invent** API names, version numbers, behaviors, or file paths. If you cannot find evidence, write a stub with a question, not confident prose.
- Keep the first pass small: the section README first (high-value navigation), then one or two anchor pages.

### 4. Glossary as you go

When a term recurs (rule of two), add a glossary entry with a `See also` link to the doc you just wrote, and link the term on first use.

### 5. Checkpoint

Run `node docs-tools/check-docs.mjs`, then show the user a short diff summary of what you wrote and which claims are marked `TODO(verify)`. Let them correct facts before you move to the next section. This keeps any hallucination contained to one reviewable unit.

## Section order

Do high-leverage framing first, because everything else depends on it:

1. `01-product` — what and who (draft from README + the user's answers).
2. `03-architecture` — system overview + tech stack + the seed ADR (draft from code structure and manifests).
3. Then each enabled module (`04`–`10`), README first, from its owned `paths`.
4. `02-engineering` getting-started, from the actual setup/build/run commands in the repo.

## Anti-hallucination rules

- A claim with no source is a `TODO(verify)`, not a sentence.
- Quote real identifiers from the code; never paraphrase a function or endpoint name from memory.
- If the user contradicts the code, ask which is right rather than silently picking one.
- Prefer "this repo does not appear to have X" over inventing X.

## Common mistakes

- Asking the user things the code already answers (wastes their time, signals you didn't read).
- Bulk-generating every page before any review (hallucinations compound).
- Writing confident prose for inferred facts instead of marking them draft.
