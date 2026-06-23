---
description: Start a guided session that progressively drafts real docs content from your code
argument-hint: "[section]"
---

# /docs-author

Launch the guided authoring loop: read the code, ask only what the code can't answer, draft content, mark every unverified claim, and checkpoint with you per section.

Arguments: `$ARGUMENTS` — an optional section (e.g. `03-architecture`) to scope the session to one domain. If omitted, work through sections in leverage order (product → architecture → enabled modules → engineering).

Use the **guided-authoring** skill to run the loop. For each section you may dispatch the **docs-author** agent to draft that section, then review its `TODO(verify)` list with the user before moving on.

Preconditions: a scaffolded `docs/` with `.docmeta.json` must exist (run `/docs-init` or `/docs-bootstrap` first). If it does not, say so and stop.

Rules to honor throughout:
- Read before asking; never ask what the code already answers.
- Draft one section at a time, README first, then one or two anchor pages.
- Mark inferred facts `status: draft` with inline `> TODO(verify):` notes; never invent identifiers.
- Run `node docs-tools/check-docs.mjs` and show a diff summary at each checkpoint.
