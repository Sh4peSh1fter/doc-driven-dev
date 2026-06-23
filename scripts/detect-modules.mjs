#!/usr/bin/env node
// Repo module detector for doc-driven-dev. Read-only, fast, language-light:
// it inspects manifests, lockfiles, config files, and directory names — never deep
// file contents — and proposes which optional documentation modules to enable.
//
// Usage:
//   node detect-modules.mjs [repoRoot] [--json]
//
// Output (JSON mode): { monorepo, packages, modules: { "<id>": { enabled, reason, paths } } }
// Rules: a module is proposed on >=1 strong signal or >=2 weak signals.
// See skills/setting-up-docs/reference/module-detection.md for the heuristic table.
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join, extname, relative } from "node:path";

const MODULE_IDS = [
  "04-frontend", "05-backend", "06-data", "07-ai-system",
  "08-infrastructure", "09-security", "10-qa",
];

const SCAN_SKIP = new Set([
  "node_modules", ".git", "dist", "build", ".next", ".docusaurus",
  "vendor", "target", "__pycache__", ".venv", "venv", ".cache", "coverage",
]);

function parseArgs(argv) {
  const opts = { json: false, root: "." };
  for (const a of argv) {
    if (a === "--json") opts.json = true;
    else if (!a.startsWith("--")) opts.root = a;
  }
  return opts;
}

function read(path) {
  try {
    return readFileSync(path, "utf8");
  } catch {
    return "";
  }
}

function isDir(p) {
  try {
    return statSync(p).isDirectory();
  } catch {
    return false;
  }
}

/** Bounded recursive scan: collect dir names, file extensions, and basenames seen. */
function scanRepo(root, maxDepth = 4) {
  const dirNames = new Set();
  const exts = new Set();
  const baseNames = new Set();
  const relDirs = []; // relative dir paths for path attribution

  function recurse(dir, depth) {
    if (depth > maxDepth) return;
    let entries;
    try {
      entries = readdirSync(dir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const e of entries) {
      if (e.isDirectory()) {
        if (SCAN_SKIP.has(e.name) || e.name.startsWith(".")) continue;
        dirNames.add(e.name);
        relDirs.push(relative(root, join(dir, e.name)) || e.name);
        recurse(join(dir, e.name), depth + 1);
      } else if (e.isFile()) {
        baseNames.add(e.name.toLowerCase());
        const ex = extname(e.name).toLowerCase();
        if (ex) exts.add(ex);
      }
    }
  }
  recurse(root, 0);
  return { dirNames, exts, baseNames, relDirs };
}

/** Gather declared dependency names from common manifests (lowercased set). */
function gatherDeps(root) {
  const deps = new Set();
  const add = (s) => s && deps.add(String(s).toLowerCase());

  const pkgPath = join(root, "package.json");
  if (existsSync(pkgPath)) {
    try {
      const pkg = JSON.parse(read(pkgPath));
      for (const field of ["dependencies", "devDependencies", "peerDependencies"]) {
        for (const name of Object.keys(pkg[field] ?? {})) add(name);
      }
    } catch {
      /* ignore malformed */
    }
  }
  // Python: requirements.txt / pyproject.toml (substring presence is enough)
  const pyText = (read(join(root, "requirements.txt")) + "\n" + read(join(root, "pyproject.toml"))).toLowerCase();
  // Ruby, Go, Java texts for substring checks
  const otherText = (
    read(join(root, "go.mod")) + "\n" +
    read(join(root, "Gemfile")) + "\n" +
    read(join(root, "pom.xml")) + "\n" +
    read(join(root, "build.gradle")) + "\n" +
    read(join(root, "build.gradle.kts"))
  ).toLowerCase();

  return { deps, pyText, otherText };
}

function detectMonorepo(root) {
  const markers = ["pnpm-workspace.yaml", "turbo.json", "nx.json", "lerna.json"];
  let monorepo = markers.some((m) => existsSync(join(root, m)));
  const packages = [];

  // npm/yarn workspaces field
  const pkgPath = join(root, "package.json");
  if (existsSync(pkgPath)) {
    try {
      const pkg = JSON.parse(read(pkgPath));
      if (pkg.workspaces) monorepo = true;
    } catch { /* ignore */ }
  }
  // Cargo workspace
  if (read(join(root, "Cargo.toml")).includes("[workspace]")) monorepo = true;

  if (monorepo) {
    for (const dirName of ["packages", "apps", "services", "libs"]) {
      const d = join(root, dirName);
      if (isDir(d)) {
        try {
          for (const e of readdirSync(d, { withFileTypes: true })) {
            if (e.isDirectory()) packages.push(`${dirName}/${e.name}`);
          }
        } catch { /* ignore */ }
      }
    }
  }
  return { monorepo, packages };
}

const DETECTORS = {
  "04-frontend": ({ deps, scan, root }) => {
    const strong = [];
    const weak = [];
    const fe = ["react", "vue", "svelte", "@angular/core", "next", "nuxt", "solid-js", "preact"];
    for (const d of fe) if (deps.has(d)) strong.push(`${d} dependency`);
    if (existsSync(join(root, "index.html"))) strong.push("index.html");
    if (scan.dirNames.has("components")) strong.push("components/ directory");
    if (deps.has("tailwindcss") || deps.has("vite") || deps.has("webpack")) weak.push("frontend build tooling");
    if (scan.exts.has(".css") || scan.exts.has(".scss") || scan.exts.has(".vue")) weak.push("stylesheet/component files");
    return { strong, weak, paths: ["src", "components", "app"].filter((p) => isDir(join(root, p))) };
  },
  "05-backend": ({ deps, pyText, otherText, scan, root }) => {
    const strong = [];
    const weak = [];
    const be = ["express", "fastify", "@nestjs/core", "koa", "hapi"];
    for (const d of be) if (deps.has(d)) strong.push(`${d} dependency`);
    for (const p of ["fastapi", "django", "flask"]) if (pyText.includes(p)) strong.push(`${p} (python)`);
    if (otherText.includes("net/http") || otherText.includes("gin-gonic") || otherText.includes("spring-boot") || otherText.includes("rails")) strong.push("server framework");
    for (const dn of ["routes", "controllers", "handlers", "api"]) if (scan.dirNames.has(dn)) weak.push(`${dn}/ directory`);
    if (scan.dirNames.has("server")) weak.push("server/ directory");
    return { strong, weak, paths: ["src", "api", "server", "app"].filter((p) => isDir(join(root, p))) };
  },
  "06-data": ({ deps, pyText, scan, root }) => {
    const strong = [];
    const weak = [];
    if (existsSync(join(root, "prisma", "schema.prisma")) || scan.baseNames.has("schema.prisma")) strong.push("schema.prisma");
    if (scan.dirNames.has("alembic") || scan.dirNames.has("migrations")) strong.push("migrations directory");
    if (scan.exts.has(".sql")) strong.push("*.sql files");
    const orm = ["typeorm", "drizzle-orm", "sequelize", "mongoose", "@prisma/client"];
    for (const d of orm) if (deps.has(d)) strong.push(`${d} ORM`);
    if (pyText.includes("sqlalchemy") || pyText.includes("alembic")) strong.push("sqlalchemy/alembic (python)");
    for (const dn of ["models", "entities", "db"]) if (scan.dirNames.has(dn)) weak.push(`${dn}/ directory`);
    return { strong, weak, paths: ["prisma", "migrations", "models", "db"].filter((p) => isDir(join(root, p))) };
  },
  "07-ai-system": ({ deps, pyText, scan, root }) => {
    const strong = [];
    const weak = [];
    const ai = ["langchain", "langgraph", "openai", "@anthropic-ai/sdk", "llamaindex", "llama-index", "ai"];
    for (const d of ai) if (deps.has(d)) strong.push(`${d} dependency`);
    for (const p of ["langchain", "langgraph", "openai", "anthropic", "transformers", "torch", "llama-index"]) {
      if (pyText.includes(p)) strong.push(`${p} (python)`);
    }
    if (scan.dirNames.has("prompts")) strong.push("prompts/ directory");
    if (scan.exts.has(".ipynb")) weak.push("notebooks");
    return { strong, weak, paths: ["prompts", "ai", "llm"].filter((p) => isDir(join(root, p))) };
  },
  "08-infrastructure": ({ scan, root }) => {
    const strong = [];
    const weak = [];
    if (scan.baseNames.has("dockerfile")) strong.push("Dockerfile");
    if ([...scan.baseNames].some((b) => b.startsWith("docker-compose"))) strong.push("docker-compose");
    if (scan.exts.has(".tf")) strong.push("*.tf (terraform)");
    if (scan.dirNames.has("k8s") || scan.dirNames.has("helm") || scan.dirNames.has("kubernetes")) strong.push("k8s/helm directory");
    if (isDir(join(root, ".github", "workflows"))) weak.push("CI workflows");
    for (const dn of ["infra", "deploy", "terraform"]) if (scan.dirNames.has(dn)) weak.push(`${dn}/ directory`);
    return { strong, weak, paths: ["infra", "deploy", "terraform", "k8s"].filter((p) => isDir(join(root, p))) };
  },
  "09-security": ({ deps, scan, root }) => {
    const strong = [];
    const weak = [];
    if (scan.baseNames.has("security.md")) strong.push("SECURITY.md");
    const auth = ["passport", "next-auth", "@auth/core", "authlib", "@okta/okta-auth-js"];
    for (const d of auth) if (deps.has(d)) strong.push(`${d} auth library`);
    if (existsSync(join(root, ".github", "codeql"))) strong.push("CodeQL config");
    if (scan.dirNames.has("auth")) weak.push("auth/ directory");
    if (existsSync(join(root, ".github", "dependabot.yml"))) weak.push("dependabot");
    return { strong, weak, paths: ["auth", "security"].filter((p) => isDir(join(root, p))) };
  },
  "10-qa": ({ deps, scan, root }) => {
    const strong = [];
    const weak = [];
    const cfgs = ["jest.config.js", "jest.config.ts", "vitest.config.ts", "vitest.config.js", "pytest.ini", "playwright.config.ts", "playwright.config.js", "cypress.config.ts"];
    for (const c of cfgs) if (scan.baseNames.has(c.toLowerCase())) strong.push(c);
    if (scan.dirNames.has("cypress") || scan.dirNames.has("__tests__") || scan.dirNames.has("e2e")) strong.push("test directory");
    const test = ["jest", "vitest", "mocha", "@playwright/test", "cypress"];
    for (const d of test) if (deps.has(d)) weak.push(`${d} test framework`);
    for (const dn of ["tests", "test", "spec"]) if (scan.dirNames.has(dn)) weak.push(`${dn}/ directory`);
    return { strong, weak, paths: ["tests", "test", "e2e", "__tests__"].filter((p) => isDir(join(root, p))) };
  },
};

function detect(root) {
  const scan = scanRepo(root);
  const { deps, pyText, otherText } = gatherDeps(root);
  const { monorepo, packages } = detectMonorepo(root);
  const ctx = { deps, pyText, otherText, scan, root };

  const modules = {};
  for (const id of MODULE_IDS) {
    const { strong, weak, paths } = DETECTORS[id](ctx);
    const enabled = strong.length >= 1 || weak.length >= 2;
    const reasonParts = [...strong, ...weak];
    modules[id] = {
      enabled,
      reason: enabled ? reasonParts.slice(0, 3).join("; ") : "",
      paths: enabled ? [...new Set(paths)] : [],
    };
  }
  return { monorepo, packages, modules };
}

function main() {
  const opts = parseArgs(process.argv.slice(2));
  const root = opts.root;
  if (!isDir(root)) {
    console.error(`not a directory: ${root}`);
    process.exit(2);
  }
  const result = detect(root);

  if (opts.json) {
    console.log(JSON.stringify(result, null, 2));
    return;
  }

  console.log(`Module detection for ${root}${result.monorepo ? " (monorepo)" : ""}:`);
  for (const id of MODULE_IDS) {
    const m = result.modules[id];
    const mark = m.enabled ? "✓" : "·";
    console.log(`  ${mark} ${id}${m.enabled ? `  — ${m.reason}` : ""}`);
  }
  if (result.packages.length) {
    console.log(`  packages: ${result.packages.join(", ")}`);
  }
}

main();
