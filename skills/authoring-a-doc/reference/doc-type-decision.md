# Choosing doc_type and section

## Which `doc_type`?

| If the doc is… | Use | Template |
|:---------------|:----|:---------|
| A narrative explanation, how-to, or overview | `guide` | `_doc-template.md` |
| The entry point / navigation hub for a folder | `readme` | `_doc-folder-README-template.md` |
| Normative rules for a domain ("always do X") | `standards` | `_template.standards.md` |
| A significant, hard-to-reverse decision and its rationale | `adr` | `_template.adr.md` |
| A dense lookup table or interface reference | `reference` | `_template.reference.md` |
| A task checklist / backlog for a scope | `tracker` | `_template.tracker.md` |
| A process or audit method | `methodology` | `_template.methodology.md` |

## Which section?

| Topic | Section |
|:------|:--------|
| Why the product exists, users, requirements | `01-product` |
| Local setup, coding conventions, workflows | `02-engineering` |
| System overview, tech stack, decisions (ADRs) | `03-architecture` |
| UI components, design tokens, client state | `04-frontend` |
| API surface, services, server logic | `05-backend` |
| Schema, entity models, migrations | `06-data` |
| Models, prompts, pipelines, evaluation | `07-ai-system` |
| Deployment, environments, observability | `08-infrastructure` |
| AuthN/Z, data protection, compliance | `09-security` |
| Test strategy, fixtures, coverage | `10-qa` |
| Roadmaps, backlog, task tracking | `00-workplan` |
| The docs system itself (standards, templates) | `11-documentation` |

Only sections enabled in `docs/.docmeta.json` exist. If the right section is a module that is not enabled, enable it (set `enabled: true` and re-run `/docs-init`) before authoring there.

## Edge cases

- **A decision, not a description:** if you are explaining *why* a choice was made and it is hard to reverse, it is an ADR — not a guide.
- **Rules vs. guidance:** normative "must/always/never" rules belong in a `standards` doc; explanatory "here's how it works" belongs in a `guide`.
- **Cross-cutting concept used everywhere:** it is a glossary term first; the full treatment lives in one canonical doc that the glossary links to.
