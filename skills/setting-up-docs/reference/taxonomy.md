# Documentation taxonomy

The reserved, numbered section catalog. Numbers are stable across every project so a section always lives at the same number; a project omits sections it does not need (gaps are fine). **Core** sections are always scaffolded. **Module** sections are optional and enabled by detection.

| # | Folder | Tier | Scope | Owns |
|:--|:-------|:-----|:------|:-----|
| 00 | `00-workplan` | core | Roadmaps, backlog, task trackers, audits | Planning and status of work |
| 01 | `01-product` | core | Vision, PRD, personas, user journeys, features | Why the project exists and for whom |
| 02 | `02-engineering` | core | Onboarding, coding standards, workflows, tooling | How we build |
| 03 | `03-architecture` | core | System overview, tech stack, structure, ADRs | The shape of the system and its decisions |
| 04 | `04-frontend` | module | UI components, design tokens, state, routing | Client-side application |
| 05 | `05-backend` | module | API surface, services, server-side logic | Server-side application |
| 06 | `06-data` | module | Schema, entity models, migrations, data flow | Persistent data and its lifecycle |
| 07 | `07-ai-system` | module | Models, prompts, pipelines, evaluation | LLM / ML functionality |
| 08 | `08-infrastructure` | module | Deployment, environments, observability, scaling | How and where it runs |
| 09 | `09-security` | module | AuthN/Z, data protection, compliance, threat model | Security posture |
| 10 | `10-qa` | module | Test strategy, fixtures, coverage | Quality assurance |
| 11 | `11-documentation` | core | Standards, templates, the docs system itself | The documentation system |
| 99 | `99-archive` | core | Frozen, deprecated, historical content | Reference-only history |

## Per-section structure

Every section has:
- a `README.md` navigation hub (the section's entry point);
- optionally a `_standards/` folder for normative rules in that domain;
- domain pages created from `_templates/`.

## Shared, non-numbered locations

| Path | Purpose |
|:-----|:--------|
| `_templates/` | Copy-paste templates per doc type (excluded from validation and site) |
| `_assets/` | Diagram sources and images (excluded from validation) |
| `glossary.md` | Single source of truth for shared terms |
| `.docmeta.json` | The manifest: contract version, profile, enabled sections/modules |
| `README.md` | Root documentation guide |

## Lightness principle

A tiny library gets the core only (about five content folders). Modules and the published site are opt-in and detection-gated, so the system never feels heavy for small projects.
