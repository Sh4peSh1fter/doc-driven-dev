---
name: Bug report
about: Report something that isn't working as expected
title: "[bug] "
labels: bug
---

## What happened

A clear description of the bug.

## What you expected

What you expected to happen instead.

## Steps to reproduce

1. Command run (e.g. `/docs-init`, `node scripts/check-docs.mjs ...`)
2. Repo characteristics (language/stack, monorepo?, existing `docs/`?)
3. ...

## Environment

- doc-driven-dev version:
- Node version (`node --version`):
- OS:
- Claude Code version (if relevant):

## Validator / detector output

If applicable, paste the output of `node docs-tools/check-docs.mjs --json` or `node scripts/detect-modules.mjs . --json`.
