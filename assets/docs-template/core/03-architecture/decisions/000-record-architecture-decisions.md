---
title: "ADR 000: Record architecture decisions"
description: "We will record significant architecture decisions as ADRs in this directory, and we adopt a central docs/ tree as the project's source of truth."
status: current
last_update:
  date: "2026-06-17"
  author: "doc-driven-dev"
doc_type: adr
tags: [architecture, adr, process]
draft: false
---

# ADR 000: Record architecture decisions

## Status

Accepted

## Context

As a project grows, the reasoning behind significant technical choices is easily lost. New contributors (human and AI) re-litigate settled questions because the "why" was never written down. We need a lightweight, durable way to capture decisions next to the code they govern.

We are also adopting a central `docs/` tree as the project's documentation source of truth, with an enforced frontmatter contract and a validator, so documentation stays consistent and reviewable as code.

## Decision

1. We record significant, hard-to-reverse, or cross-cutting decisions as Architecture Decision Records (ADRs) in `docs/03-architecture/decisions/`, named `NNN-title.md`.
2. Each ADR follows the [ADR template](../../_templates/_template.adr.md): Status, Context, Decision, Alternatives considered, Consequences.
3. ADRs are immutable once Accepted. A decision that changes gets a new ADR; the old one is marked `Superseded by ADR-XXX`.
4. All documentation lives under `docs/` and conforms to the [Documentation Standards](../../11-documentation/_standards/README.md).

## Alternatives considered

- **No formal record:** decisions live in chat history and PR threads. Rejected — not durable or discoverable.
- **A single decisions log file:** one growing file. Rejected — hard to link to a specific decision and to track status per decision.

## Consequences

- **Positive:** decisions are discoverable, linkable, and carry their rationale. Reviewers and agents can find the "why" without archaeology.
- **Negative:** a small per-decision authoring cost.
- **Risks / mitigations:** ADRs can go stale. Mitigation: link them from the docs they affect, and update status when superseded.

---

## Related Docs

- [Decisions index](./README.md)
- [Documentation Standards](../../11-documentation/_standards/README.md)
