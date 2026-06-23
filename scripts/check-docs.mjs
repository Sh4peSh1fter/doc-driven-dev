#!/usr/bin/env node
// doc-driven-dev documentation validator. Zero dependencies — runs with just `node`.
//
// Usage:
//   node check-docs.mjs [path] [--fix] [--json] [--strict]
//
//   path       docs/ directory to scan (default: ./docs, or the dir given)
//   --fix      inject a placeholder last_update.date where missing
//   --json     emit machine-readable JSON (for CI / agents)
//   --strict   treat advisory warnings as errors (exit 1)
//
// Normative rules: docs/11-documentation/_standards/{frontmatter,linking,glossary}.standards.md
import { existsSync, readFileSync, writeFileSync, statSync } from "node:fs";
import { join, resolve, basename, dirname } from "node:path";
import { extractFrontmatter, parseFields, asArray } from "./lib/frontmatter.mjs";
import { walkMarkdown, contentSubdirs, readText } from "./lib/walk.mjs";
import { extractLinks, classify, resolveRelative, isWeakAnchorText } from "./lib/links.mjs";
import { formatHuman, formatJson } from "./lib/report.mjs";

const REQUIRED_SCALARS = ["title", "description", "status", "doc_type", "draft"];
const VALID_STATUS = new Set(["draft", "current", "deprecated", "archived"]);
const VALID_DOC_TYPE = new Set([
  "guide", "readme", "standards", "adr", "template",
  "tracker", "reference", "methodology", "audit-findings",
]);
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const ADR_NAME_RE = /^\d{3}-[a-z0-9-]+\.md$/;

function parseArgs(argv) {
  const opts = { fix: false, json: false, strict: false, path: null };
  for (const a of argv) {
    if (a === "--fix") opts.fix = true;
    else if (a === "--json") opts.json = true;
    else if (a === "--strict") opts.strict = true;
    else if (!a.startsWith("--")) opts.path = a;
  }
  return opts;
}

function findDocsDir(explicit) {
  if (explicit) return resolve(explicit);
  const candidate = resolve("docs");
  return candidate;
}

// Ascend from a file to the nearest directory that holds a .docmeta.json (the docs root),
// falling back to a parent literally named "docs", else the file's own directory.
function findDocsRootFor(file) {
  let dir = dirname(resolve(file));
  for (let i = 0; i < 12; i++) {
    if (existsSync(join(dir, ".docmeta.json"))) return dir;
    if (basename(dir) === "docs") return dir;
    const parent = dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  return dirname(resolve(file));
}

function loadManifest(docsDir) {
  const p = join(docsDir, ".docmeta.json");
  if (!existsSync(p)) return null;
  try {
    return JSON.parse(readFileSync(p, "utf8"));
  } catch {
    return null;
  }
}

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function injectDate(file, content, author) {
  const fm = extractFrontmatter(content);
  if (!fm) return false;
  let raw = fm.raw;
  const date = `  date: "${todayISO()}"`;
  const auth = `  author: "${author || "unknown"}"`;
  if (/^last_update:/m.test(raw)) {
    if (/^\s+date:/m.test(raw)) return false; // already has a date
    raw = raw.replace(/^last_update:.*$/m, `last_update:\n${date}\n${auth}`);
  } else {
    raw = raw.trimEnd() + `\nlast_update:\n${date}\n${auth}`;
  }
  const newContent = content.replace(fm.raw, raw);
  if (newContent !== content) {
    writeFileSync(file, newContent, "utf8");
    return true;
  }
  return false;
}

function checkFrontmatter(file, content, opts, defaultAuthor, findings) {
  const fm = extractFrontmatter(content);
  if (!fm) {
    findings.push({ file, severity: "error", rule: "frontmatter.missing", message: "no leading --- frontmatter block" });
    return;
  }
  const f = parseFields(fm.raw);
  const present = f.__present;

  for (const key of REQUIRED_SCALARS) {
    if (!present.has(key)) {
      findings.push({ file, severity: "error", rule: "frontmatter.missing-field", message: `required field "${key}" is missing` });
    }
  }

  // tags must be present and be a list
  if (!present.has("tags")) {
    findings.push({ file, severity: "error", rule: "frontmatter.missing-field", message: `required field "tags" is missing` });
  } else if (asArray(f.tags) === undefined) {
    findings.push({ file, severity: "error", rule: "frontmatter.bad-type", message: `"tags" must be a list` });
  }

  if (present.has("status") && !VALID_STATUS.has(f.status)) {
    findings.push({ file, severity: "error", rule: "frontmatter.bad-enum", message: `status "${f.status}" invalid (allowed: ${[...VALID_STATUS].join(", ")})` });
  }
  if (present.has("doc_type") && !VALID_DOC_TYPE.has(f.doc_type)) {
    findings.push({ file, severity: "error", rule: "frontmatter.bad-enum", message: `doc_type "${f.doc_type}" invalid (allowed: ${[...VALID_DOC_TYPE].join(", ")})` });
  }
  if (present.has("draft") && typeof f.draft !== "boolean") {
    findings.push({ file, severity: "error", rule: "frontmatter.bad-type", message: `"draft" must be true or false` });
  }

  // last_update.date + author
  const lu = f.last_update;
  const hasDate = lu && typeof lu === "object" && lu.date;
  if (!hasDate) {
    if (opts.fix && injectDate(file, content, defaultAuthor)) {
      // fixed in place; re-read not necessary for this run
    } else {
      findings.push({ file, severity: "error", rule: "frontmatter.missing-field", message: `last_update.date is missing` });
    }
  } else if (!DATE_RE.test(String(lu.date))) {
    findings.push({ file, severity: "error", rule: "frontmatter.bad-date", message: `last_update.date "${lu.date}" must be YYYY-MM-DD` });
  }
  if (!(lu && typeof lu === "object" && lu.author)) {
    findings.push({ file, severity: "error", rule: "frontmatter.missing-field", message: `last_update.author is missing` });
  }

  return fm;
}

function checkLinks(file, body, findings) {
  for (const link of extractLinks(body)) {
    const kind = classify(link.target);
    if (kind === "external" || kind === "anchor") {
      // external left to humans; pure anchors checked via resolveRelative below for in-page
    }
    if (kind === "absolute") {
      findings.push({ file, severity: "error", rule: "link.absolute", message: `absolute link "${link.target}" — use a relative path` });
      continue;
    }
    if (kind === "relative" || kind === "anchor") {
      const res = resolveRelative(file, link.target);
      if (!res.ok) {
        findings.push({ file, severity: "error", rule: "link.broken", message: `${res.reason} ("${link.target}")` });
      }
    }
    if (!link.isImage && isWeakAnchorText(link.text)) {
      findings.push({ file, severity: "warning", rule: "link.weak-anchor", message: `unhelpful anchor text "${link.text}" — describe the destination` });
    }
  }
}

function checkStructure(docsDir, skipDirs, findings) {
  for (const dir of contentSubdirs(docsDir, { skipDirs })) {
    if (!existsSync(join(dir, "README.md"))) {
      findings.push({ file: join(dir, "README.md"), severity: "error", rule: "structure.missing-readme", message: `section folder has no README.md navigation hub` });
    }
    // ADR naming: files inside any decisions/ folder
    if (basename(dir) === "decisions") {
      // handled per-file below
    }
  }
}

function checkAdrNaming(file, findings) {
  if (basename(dirname(file)) !== "decisions") return;
  const name = basename(file);
  if (name === "README.md") return;
  if (!ADR_NAME_RE.test(name)) {
    findings.push({ file, severity: "warning", rule: "adr.naming", message: `ADR filename should be NNN-title.md (got "${name}")` });
  }
}

function checkGlossary(docsDir, glossaryPath, findings) {
  const gp = join(docsDir, glossaryPath || "glossary.md");
  if (!existsSync(gp)) return; // optional
  // Strip HTML comments first so a commented-out example term is not counted as a real entry.
  const body = readText(gp).replace(/<!--[\s\S]*?-->/g, "");
  // Advisory: each "### Term" entry should carry a "See also" canonical link.
  const sections = body.split(/^###\s+/m).slice(1);
  for (const sec of sections) {
    const term = sec.split("\n")[0].trim();
    if (!term) continue;
    if (!/\*\*See also:\*\*/i.test(sec)) {
      findings.push({ file: gp, severity: "warning", rule: "glossary.no-see-also", message: `glossary term "${term}" is missing a **See also:** canonical link` });
    }
  }
}

function main() {
  const opts = parseArgs(process.argv.slice(2));

  // Single-file mode: validate just one Markdown file (used by the post-edit hook).
  if (opts.path && existsSync(opts.path) && statSync(opts.path).isFile()) {
    if (!opts.path.endsWith(".md")) {
      process.exit(0); // not a doc; nothing to check
    }
    const file = resolve(opts.path);
    const docsDir = findDocsRootFor(file);
    const manifest = loadManifest(docsDir);
    const defaultAuthor = manifest?.project?.defaultAuthor ?? "unknown";
    const strict = opts.strict || manifest?.validator?.strict === true;
    const findings = [];
    const content = readText(file);
    const fm = checkFrontmatter(file, content, opts, defaultAuthor, findings);
    checkLinks(file, fm ? fm.body : content, findings);
    checkAdrNaming(file, findings);
    const ctx = { scanned: 1, root: docsDir };
    console.log(opts.json ? formatJson(findings, ctx) : formatHuman(findings, ctx));
    const blocking = findings.some((f) => f.severity === "error") || (strict && findings.length > 0);
    process.exit(blocking ? 1 : 0);
  }

  const docsDir = findDocsDir(opts.path);

  if (!existsSync(docsDir) || !statSync(docsDir).isDirectory()) {
    console.error(`docs directory not found: ${docsDir}`);
    process.exit(2);
  }

  const manifest = loadManifest(docsDir);
  const skipDirs = manifest?.validator?.skipDirs ?? [];
  const strict = opts.strict || manifest?.validator?.strict === true;
  const defaultAuthor = manifest?.project?.defaultAuthor ?? "unknown";
  const glossaryPath = manifest?.glossaryPath ?? "glossary.md";

  const files = walkMarkdown(docsDir, { skipDirs });
  const findings = [];

  for (const file of files) {
    const content = readText(file);
    const fm = checkFrontmatter(file, content, opts, defaultAuthor, findings);
    const body = fm ? fm.body : content;
    checkLinks(file, body, findings);
    checkAdrNaming(file, findings);
  }

  checkStructure(docsDir, skipDirs, findings);
  checkGlossary(docsDir, glossaryPath, findings);

  const ctx = { scanned: files.length, root: docsDir };
  const out = opts.json ? formatJson(findings, ctx) : formatHuman(findings, ctx);
  console.log(out);

  const hasError = findings.some((f) => f.severity === "error");
  const hasBlocking = hasError || (strict && findings.length > 0);
  process.exit(hasBlocking ? 1 : 0);
}

main();
