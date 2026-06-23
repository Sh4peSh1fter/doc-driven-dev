---
title: "Architecture Standards"
description: "Normative rules for architecture documentation and decision-making."
status: current
last_update:
  date: "2026-06-17"
  author: "doc-driven-dev"
doc_type: standards
tags: [architecture, standards]
draft: false
---

# Architecture Standards

Conventions for how architecture is documented and how decisions are recorded. The ADR process itself is defined in the [Documentation Standards hub](../../11-documentation/_standards/README.md#adrs-architecture-decision-records).

## Guidance

- Record significant, hard-to-reverse decisions as ADRs in [`decisions/`](../decisions/README.md), named `NNN-title.md`.
- Keep `system-overview.md` current: it is the first page new contributors read.
- Describe components by responsibility, and link to the owning domain section for detail.

---

## Related Docs

- [Architecture](../README.md)
- [Decisions](../decisions/README.md)
