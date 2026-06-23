# Changelog

All notable changes to doc-driven-dev are documented here. The format is based on
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] — initial release

### Added
- **Plugin skeleton:** manifest, marketplace manifest, README, license, `.docmeta.json` schema.
- **Documentation contract:** stack-neutral frontmatter, linking, and glossary standards, plus a documentation standards hub with writing-style guidance.
- **Validator** (`scripts/check-docs.mjs`): zero-dependency Node validator for frontmatter, links, structure, and glossary; supports directory and single-file modes, `--fix`, `--json`, `--strict`. 13-assertion test suite.
- **Adaptive scaffold:** core section templates, seven optional module templates, copy-paste doc templates per `doc_type`, and a templated root README / glossary / manifest.
- **Module detection** (`scripts/detect-modules.mjs`): repo heuristics proposing optional modules; monorepo aware. 11-assertion test suite.
- **Skills:** doc-system-overview, setting-up-docs, authoring-a-doc, documentation-standards, maintaining-docs, syncing-docs-with-code, guided-authoring.
- **Commands:** `/docs-init`, `/docs-bootstrap`, `/docs-new`, `/docs-validate`, `/docs-author`, `/docs-site`, `/docs-sync`.
- **Agents:** docs-bootstrapper, docs-author, docs-auditor.
- **Site generator:** Docusaurus template rendered from the manifest, with broken-link gating.
- **Sync + CI + hooks:** docs-vs-code drift detection, GitHub Actions and GitLab CI templates, and a post-edit validation hook.
- **End-to-end tests:** scaffold + validate + idempotency across three sample repos (tiny lib, React app, Python ML monorepo).
- **Dogfooding:** scaffolded this repo's own `docs/` tree with the plugin.

### Fixed
- Validator no longer flags links inside HTML comments (`<!-- ... -->`), so commented-out example links in templates pass. Added a regression test.
- Validator's glossary check ignores commented-out example terms.
- Docusaurus site template uses `onBrokenLinks: warn` (anchors stay strict), since docs intentionally link into the build-excluded `_templates/`; the validator remains the hard gate for content links.

### Release prep
- Repo metadata (`package.json` repository/author/bugs/homepage), CI workflow running the test suite on Node 18/20, `CONTRIBUTING.md`, `SECURITY.md`, and issue/PR templates.
