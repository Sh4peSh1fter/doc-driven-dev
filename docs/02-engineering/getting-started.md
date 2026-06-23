---
title: "Getting started"
description: "How to install doc-driven-dev, run its tooling, and work on the plugin locally."
status: current
last_update:
  date: "2026-06-19"
  author: "Sean S"
doc_type: guide
tags: [engineering, onboarding]
draft: false
---

# Getting started

## Prerequisites

- **Node.js 18 or newer** (declared in `package.json` `engines`). No other runtime is required — the validator and detector have zero npm dependencies.

## Using the plugin in your own repo

Install it as a Claude Code plugin from a marketplace:

```
/plugin install doc-driven-dev@<marketplace-name>
```

Then, in any repository, scaffold and (optionally) author docs:

```
/docs-bootstrap        # profile the repo, scaffold docs/, offer guided authoring
```

Or drive it step by step with `/docs-init`, `/docs-new`, `/docs-author`, `/docs-validate`, `/docs-site`, and `/docs-sync`.

## Working on the plugin itself

Clone the repo, then run the test suite — it needs only `node`:

```bash
npm test
```

This runs three suites in `scripts/test/`: the validator tests (`run.mjs`), the detector tests (`detect.mjs`), and an end-to-end scaffold + validate + idempotency check across sample repos (`e2e.mjs`).

### Run the tooling directly

```bash
# Validate a docs/ tree (frontmatter, links, structure, glossary)
node scripts/check-docs.mjs <path-to-docs> --strict

# Propose which optional modules a repo warrants
node scripts/detect-modules.mjs <path-to-repo>
```

In a scaffolded repo the validator is installed at `docs-tools/check-docs.mjs`, so you run `node docs-tools/check-docs.mjs` there.

## Where things live

See the [System overview](../03-architecture/system-overview.md) for the component map, and the [Engineering standards](./_standards/README.md) for conventions.

---

## Related Docs

- [System overview](../03-architecture/system-overview.md)
- [Engineering standards](./_standards/README.md)
