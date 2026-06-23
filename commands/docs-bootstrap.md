---
description: Profile this repo, scaffold the docs/ tree, then offer to author content
argument-hint: "[--site]"
---

# /docs-bootstrap

The one-command entry point for a new repo. It profiles the codebase, scaffolds an adaptive `docs/` tree, and offers to start writing real content.

Arguments: `$ARGUMENTS` (`--site` also enables the Docusaurus site in the manifest).

Run these steps in order:

1. **Profile the repo.** Dispatch the **docs-bootstrapper** agent (read-only) to produce the project profile and module proposal. If the agent is unavailable, run `node "${CLAUDE_PLUGIN_ROOT}/scripts/detect-modules.mjs" . --json` yourself.

2. **Confirm the plan.** Show the user: the detected project name, the proposed modules with their reasons, and whether a `docs/` folder already exists. Let them adjust the module set before proceeding.

3. **Scaffold.** Use the **setting-up-docs** skill to render the core sections, the confirmed modules, the templated files, and the `.docmeta.json` manifest, and to install the validator. Honor `--site`.

4. **Verify.** Run `node docs-tools/check-docs.mjs --strict` and confirm a clean pass.

5. **Offer to author.** Tell the user the scaffold is ready and offer to run `/docs-author` to begin the guided authoring session that drafts real content from the code. Do not start authoring without confirmation.

Keep it light for small repos: if no modules are detected, scaffold the core only and skip the site unless `--site` was passed.
