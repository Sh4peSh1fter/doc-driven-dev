#!/usr/bin/env node
// Tests for the module detector. Runs detect-modules.mjs against fixture repos
// and asserts the enabled module set and monorepo flag. Zero dependencies.
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const DETECT = join(here, "..", "detect-modules.mjs");
const repo = (name) => join(here, "fixtures", "repos", name);

let failures = 0;
function ok(name, cond, detail = "") {
  if (!cond) failures++;
  console.log(`  [${cond ? "PASS" : "FAIL"}] ${name}${detail && !cond ? ` — ${detail}` : ""}`);
}

function run(name) {
  const res = spawnSync("node", [DETECT, repo(name), "--json"], { encoding: "utf8" });
  return JSON.parse(res.stdout);
}

function enabledSet(result) {
  return new Set(Object.entries(result.modules).filter(([, m]) => m.enabled).map(([k]) => k));
}

function sameSet(a, b) {
  if (a.size !== b.size) return false;
  for (const x of a) if (!b.has(x)) return false;
  return true;
}

console.log("detect: tiny-lib (expect core only)");
{
  const r = run("tiny-lib");
  ok("no modules enabled", enabledSet(r).size === 0, [...enabledSet(r)].join(", "));
  ok("not a monorepo", r.monorepo === false);
}

console.log("detect: react-app (expect frontend + qa)");
{
  const r = run("react-app");
  const got = enabledSet(r);
  ok("enables 04-frontend", got.has("04-frontend"), [...got].join(", "));
  ok("enables 10-qa", got.has("10-qa"), [...got].join(", "));
  ok("exactly {frontend, qa}", sameSet(got, new Set(["04-frontend", "10-qa"])), [...got].join(", "));
}

console.log("detect: py-ml-monorepo (expect backend + data + ai-system + infrastructure, monorepo)");
{
  const r = run("py-ml-monorepo");
  const got = enabledSet(r);
  for (const id of ["05-backend", "06-data", "07-ai-system", "08-infrastructure"]) {
    ok(`enables ${id}`, got.has(id), [...got].join(", "));
  }
  ok("monorepo detected", r.monorepo === true);
}

console.log("");
if (failures === 0) {
  console.log("All detection tests passed.");
  process.exit(0);
} else {
  console.log(`${failures} assertion(s) failed.`);
  process.exit(1);
}
