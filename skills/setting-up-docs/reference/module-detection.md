# Module detection heuristics

How `detect-modules.mjs` decides which optional modules to propose. Detection reads only manifests, lockfiles, config files, and directory names — never deep file contents — so it is fast and language-light. A module is proposed when it has **≥1 strong signal** or **≥2 weak signals**.

| Module | Strong signals | Weak signals |
|:-------|:---------------|:-------------|
| `04-frontend` | `package.json` deps: react, vue, svelte, @angular/core, next, nuxt, solid-js; `index.html` at root; `src/components/` | tailwind/vite/webpack config; `*.css`/`*.scss` dirs |
| `05-backend` | deps: express, fastify, @nestjs/core, koa, hapi; `fastapi`/`django`/`flask` in `requirements.txt`/`pyproject.toml`; `go.mod` with web router; `pom.xml`/`build.gradle`; Rails `Gemfile` | `src/server/`, `api/`, `routes/`, `controllers/` dirs |
| `06-data` | `schema.prisma`, `alembic/`, `migrations/`, `*.sql` files; deps: typeorm, drizzle-orm, sequelize, sqlalchemy, mongoose | `models/`, `entities/`, `db/` dirs |
| `07-ai-system` | deps: langchain, langgraph, openai, @anthropic-ai/sdk, llama-index, transformers, torch; `prompts/` dir | `*.ipynb` files; `models/` with weights |
| `08-infrastructure` | `Dockerfile`, `docker-compose*.yml`, `*.tf`, `k8s/`, `helm/`, `.github/workflows/` with deploy steps | `infra/`, `deploy/`, `terraform/` dirs |
| `09-security` | `SECURITY.md`; deps: passport, next-auth, authlib, @auth/core; CodeQL/Dependabot config | `auth/`, `*.policy`, OPA files |
| `10-qa` | test config: `jest.config.*`, `vitest.config.*`, `pytest.ini`, `playwright.config.*`, `cypress/`; `__tests__/` | `tests/`, `test/`, `e2e/` dirs |

## Monorepo handling

If a workspace marker is present (`pnpm-workspace.yaml`, `turbo.json`, `nx.json`, `lerna.json`, a `workspaces` field, or a Cargo workspace), set `monorepo: true`, collect the package roots, run detection across all of them, and union the results. The default remains a single top-level `docs/` (one source of truth); per-package docs are an explicit opt-in.

## Recording the decision

Each module's entry in `.docmeta.json` records `enabled`, the `reason` (the signal that triggered it), and the owned `paths`. `docs-sync` later uses `paths` to map code changes back to the docs section that should be updated.

## Overriding detection

`/docs-init --modules a,b,c` forces an exact module set. A user can also enable a module later by editing its `enabled` flag to `true` and re-running `/docs-init`, which adds the missing section without disturbing anything else.
