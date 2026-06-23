---
title: "Vision"
description: "Why doc-driven-dev exists, who it serves, and the outcomes it aims for."
status: current
last_update:
  date: "2026-06-19"
  author: "Sean S"
doc_type: guide
tags: [product, vision]
draft: false
---

# Vision

## The problem

Most repositories either lack structured documentation or let it rot. Knowledge lives in people's heads, scattered chat threads, and stale wiki pages. Two costs follow:

- **Humans** re-learn the system repeatedly and re-litigate settled decisions.
- **AI coding agents** work from thin or outdated context, which lowers the quality of what they produce.

There are proven patterns for a healthy knowledge base — a domain taxonomy, an enforced metadata contract, docs-as-code review, a single source of truth — but adopting them by hand is slow, and they drift the moment the team gets busy.

## What doc-driven-dev is

A Claude Code plugin that sets up and maintains a central `docs/` tree as the product and technical source of truth for a repository, optimized for both human developers and AI agents. It is tech-stack and folder-structure agnostic: the structure adapts to what the repo actually contains.

It productizes a known-good documentation system into a reusable plugin, so a team gets the structure, standards, validation, and authoring help from day one instead of building them by hand.

## Who it is for

- **Primary — developers using agentic coding tools.** Individuals and teams who work with AI coding agents and want documentation that both they and the agents can rely on, set up with minimal friction.
- **Secondary — engineering leads and platform teams.** People standardizing documentation practice across many repos, who care about consistency and rollout.

## Outcomes we aim for

- **Less doc rot.** Docs are versioned with the code, validated in CI, and treated as a defect when stale — so they stay in sync.
- **Faster agent onboarding.** Agents get accurate, structured context, improving the quality of their output on the codebase.
- **Consistency across repos.** Every repo gets the same predictable structure and the same enforced standards.
- **Lower setup friction.** Going from zero to a real documentation system is one command, not a manual project.

## How it works at a glance

- An **adaptive taxonomy**: a small always-on core plus optional domain modules enabled by analyzing the repo.
- An **enforced contract**: every doc carries structured frontmatter; a zero-dependency validator checks frontmatter, links, and structure locally and in CI.
- **Agent skills and commands** that scaffold the tree, author content from the code, keep docs in sync with changes, and publish a site.

See the [Architecture](../03-architecture/README.md) section for the technical design.

## Distribution

doc-driven-dev is intended to be a public, open-source Claude Code plugin (MIT licensed), installable from a plugin marketplace.

## Non-goals and open questions

- It does not replace inline code comments or API-doc generators; it organizes and governs the higher-level knowledge base.

Deferred as future work (not yet defined): roadmap milestones, target adoption metrics, and success thresholds. These will be captured in the [Workplan](../00-workplan/README.md) when set.

---

## Related Docs

- [Product overview](./README.md)
- [Architecture](../03-architecture/README.md)
