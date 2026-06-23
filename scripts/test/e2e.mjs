#!/usr/bin/env node
// End-to-end test: for each sample repo, run real module detection, assemble a docs/
// tree from the shipped templates (the deterministic part of setting-up-docs), install
// the validator, and assert a clean strict pass. Then re-run the assemble to assert it
// is non-destructive (idempotency). Zero dependencies.
import { spawnSync } from "node:child_process";
import { cpSync, mkdirSync, mkdtempSync, writeFileSync, existsSync, readdirSync, rmSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { tmpdir } from "node:os";

const here = dirname(fileURLToPath(import.meta.url));
const PLUGIN = join(here, "..", "..");
const TPL = join(PLUGIN, "assets", "docs-template");
const CHECK = join(PLUGIN, "scripts", "check-docs.mjs");
const repo = (name) => join(here, "fixtures", "repos", name);

const CORE = ["00-workplan", "01-product", "02-engineering", "03-architecture", "11-documentation", "99-archive"];
const NAMES = {
  "00-workplan": "Workplan", "01-product": "Product", "02-engineering": "Engineering",
  "03-architecture": "Architecture", "04-frontend": "Frontend", "05-backend": "Backend",
  "06-data": "Data", "07-ai-system": "AI System", "08-infrastructure": "Infrastructure",
  "09-security": "Security", "10-qa": "QA", "11-documentation": "Documentation",
};

let failures = 0;
function ok(name, cond, detail = "") {
  if (!cond) failures++;
  console.log(`  [${cond ? "PASS" : "FAIL"}] ${name}${detail && !cond ? ` — ${detail}` : ""}`);
}

function detect(repoPath) {
  const res = spawnSync("node", [join(PLUGIN, "scripts", "detect-modules.mjs"), repoPath, "--json"], { encoding: "utf8" });
  return JSON.parse(res.stdout);
}

function sectionsTable(modules) {
  const rows = [...CORE.filter((s) => s !== "99-archive"), ...modules]
    .sort()
    .map((s) => `| ${NAMES[s]} | [\`${s}\`](./${s}/README.md) |`)
    .join("\n");
  return `| Section | Path |\n|:--------|:-----|\n${rows}`;
}

// Mirrors the deterministic part of the setting-up-docs skill.
function assemble(docsDir, profile, modules, { force = true } = {}) {
  mkdirSync(docsDir, { recursive: true });
  const opts = { recursive: true, force, errorOnExist: false };
  cpSync(join(TPL, "core"), docsDir, opts);
  for (const m of modules) cpSync(join(TPL, "modules", m), join(docsDir, m), opts);
  cpSync(join(TPL, "_templates"), join(docsDir, "_templates"), opts);
  cpSync(join(TPL, "_assets"), join(docsDir, "_assets"), opts);

  const readme = `---
title: "Documentation guide"
description: "How the docs/ tree for ${profile.name} is organized."
status: current
last_update:
  date: "2026-06-17"
  author: "doc-driven-dev"
doc_type: readme
tags: [documentation]
draft: false
---

# ${profile.name} documentation

${sectionsTable(modules)}

See [Documentation Standards](./11-documentation/_standards/README.md), the [Glossary](./glossary.md), [templates](./_templates/README.md), and [ADRs](./03-architecture/decisions/README.md).
`;
  const glossary = `---
title: "Glossary"
description: "Shared vocabulary for ${profile.name}."
status: current
last_update:
  date: "2026-06-17"
  author: "doc-driven-dev"
doc_type: reference
tags: [glossary]
draft: false
---

# Glossary

See the [Glossary Standards](./11-documentation/_standards/glossary.standards.md) and the [Documentation guide](./README.md).
`;
  const modulesBlock = {};
  for (const [id, m] of Object.entries(profile.modules)) {
    modulesBlock[id] = m.enabled
      ? { enabled: true, reason: m.reason, paths: m.paths }
      : { enabled: false };
  }
  const manifest = {
    contractVersion: "1.0.0", pluginVersion: "0.1.0", createdAt: "2026-06-17",
    project: { name: profile.name, slug: profile.slug, repoUrl: "", defaultAuthor: "doc-driven-dev", monorepo: profile.monorepo, packages: profile.packages },
    core: CORE, modules: modulesBlock,
    site: { enabled: false, tool: "docusaurus" },
    validator: { path: "docs-tools/check-docs.mjs", skipDirs: ["99-archive"], strict: false },
    glossaryPath: "glossary.md",
  };

  if (force || !existsSync(join(docsDir, "README.md"))) writeFileSync(join(docsDir, "README.md"), readme);
  if (force || !existsSync(join(docsDir, "glossary.md"))) writeFileSync(join(docsDir, "glossary.md"), glossary);
  if (force || !existsSync(join(docsDir, ".docmeta.json"))) writeFileSync(join(docsDir, ".docmeta.json"), JSON.stringify(manifest, null, 2));
}

function countFiles(dir) {
  let n = 0;
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, e.name);
    if (e.isDirectory()) n += countFiles(full);
    else n++;
  }
  return n;
}

function validate(docsDir) {
  const res = spawnSync("node", [CHECK, docsDir, "--strict"], { encoding: "utf8" });
  return { code: res.status, out: res.stdout };
}

const cases = [
  { repo: "tiny-lib", name: "tiny-lib" },
  { repo: "react-app", name: "react-app" },
  { repo: "py-ml-monorepo", name: "py-ml-monorepo" },
];

for (const c of cases) {
  console.log(`e2e: ${c.repo}`);
  const profile = detect(repo(c.repo));
  const modules = Object.entries(profile.modules).filter(([, m]) => m.enabled).map(([k]) => k);
  const tmp = mkdtempSync(join(tmpdir(), "ddd-e2e-"));
  const docsDir = join(tmp, "docs");

  assemble(docsDir, { name: c.name, slug: c.name, monorepo: profile.monorepo, packages: profile.packages, modules: profile.modules }, modules);

  const v1 = validate(docsDir);
  ok(`scaffold validates clean (modules: ${modules.join(",") || "core only"})`, v1.code === 0, v1.out);

  const before = countFiles(docsDir);
  // Idempotent re-run: non-destructive (force:false skips existing, adds nothing missing here).
  assemble(docsDir, { name: c.name, slug: c.name, monorepo: profile.monorepo, packages: profile.packages, modules: profile.modules }, modules, { force: false });
  const after = countFiles(docsDir);
  ok("re-run is non-destructive (file count unchanged)", before === after, `before=${before} after=${after}`);

  const v2 = validate(docsDir);
  ok("still valid after re-run", v2.code === 0, v2.out);

  rmSync(tmp, { recursive: true, force: true });
}

console.log("");
if (failures === 0) {
  console.log("All e2e tests passed.");
  process.exit(0);
} else {
  console.log(`${failures} assertion(s) failed.`);
  process.exit(1);
}
