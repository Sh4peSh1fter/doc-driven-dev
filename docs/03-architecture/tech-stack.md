---
title: "Tech stack"
description: "The technologies doc-driven-dev is built on and why each was chosen."
status: current
last_update:
  date: "2026-06-19"
  author: "Sean S"
doc_type: guide
tags: [architecture, tech-stack]
draft: false
---

# Tech stack

doc-driven-dev favors the smallest dependable toolset: the things any Claude Code user already has. The guiding rule is that the validator and detector must run with nothing but `node`.

| Technology | Where | Why |
|:-----------|:------|:----|
| Node.js (ESM, `.mjs`) | `scripts/`, `docs-tools/` | The validator and detector. `package.json` declares **no runtime dependencies** — portability over convenience. |
| Markdown + YAML frontmatter | `docs/**/*.md` | The documentation format; the frontmatter block carries the enforced contract. |
| JSON | `docs/.docmeta.json`, `assets/docmeta.schema.json` | The manifest and its schema. Parsed with `JSON.parse`, so no YAML library is needed. |
| Claude Code plugin format | `.claude-plugin/`, `skills/`, `commands/`, `agents/`, `hooks/` | The distribution and agentic-integration layer. |
| Bash | `hooks/validate-on-edit.sh` | The post-edit hook wrapper (delegates parsing to `node`). |
| Docusaurus 3 | `assets/docs-site-template/` | The optional published site. Installed only in the target repo when the site is enabled. |

## Notable choices

- **Hand-rolled frontmatter parsing.** The validator parses the small, fixed frontmatter shape itself (`scripts/lib/frontmatter.mjs`) rather than depending on a YAML library, preserving the zero-dependency guarantee.
- **Standalone link checking.** The validator resolves relative links and anchors itself (`scripts/lib/links.mjs`), so broken-link detection does not require the Docusaurus build. The site build is a second, optional gate.
- **Plain-Node test harness.** Tests under `scripts/test/` use only `node` and `node:child_process` — no test framework.

---

## Related Docs

- [System overview](./system-overview.md)
- [Decisions (ADRs)](./decisions/README.md)
