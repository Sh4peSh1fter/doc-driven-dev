#!/usr/bin/env node
// Test harness for the docs validator. Runs check-docs.mjs against fixture trees
// and asserts exit codes and the set of rules reported. Zero dependencies.
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const CHECK = join(here, "..", "check-docs.mjs");
const PASS = join(here, "fixtures", "pass", "docs");
const FAIL = join(here, "fixtures", "fail", "docs");

let failures = 0;
function ok(name, cond, detail = "") {
  const mark = cond ? "PASS" : "FAIL";
  if (!cond) failures++;
  console.log(`  [${mark}] ${name}${detail && !cond ? ` — ${detail}` : ""}`);
}

function runJson(docsDir, extra = []) {
  const res = spawnSync("node", [CHECK, docsDir, "--json", ...extra], { encoding: "utf8" });
  let parsed = null;
  try {
    parsed = JSON.parse(res.stdout);
  } catch {
    /* leave null */
  }
  return { code: res.status, json: parsed, stdout: res.stdout, stderr: res.stderr };
}

console.log("validator: pass tree");
{
  const r = runJson(PASS);
  ok("exit code 0", r.code === 0, `got ${r.code}; stderr=${r.stderr}`);
  ok("no errors reported", r.json && r.json.errors === 0, JSON.stringify(r.json));
}

console.log("validator: fail tree");
{
  const r = runJson(FAIL);
  ok("exit code 1", r.code === 1, `got ${r.code}`);
  const rules = new Set((r.json?.findings ?? []).map((f) => f.rule));
  const expect = [
    "frontmatter.missing",
    "frontmatter.missing-field",
    "frontmatter.bad-enum",
    "frontmatter.bad-date",
    "link.absolute",
    "link.broken",
    "link.weak-anchor",
    "structure.missing-readme",
    "adr.naming",
    "glossary.no-see-also",
  ];
  for (const rule of expect) {
    ok(`reports ${rule}`, rules.has(rule), `rules seen: ${[...rules].join(", ")}`);
  }
}

console.log("validator: strict mode promotes warnings");
{
  // pass tree has no warnings, so strict should still exit 0
  const r = runJson(PASS, ["--strict"]);
  ok("pass tree clean under --strict", r.code === 0, `got ${r.code}`);
}

console.log("");
if (failures === 0) {
  console.log("All validator tests passed.");
  process.exit(0);
} else {
  console.log(`${failures} assertion(s) failed.`);
  process.exit(1);
}
