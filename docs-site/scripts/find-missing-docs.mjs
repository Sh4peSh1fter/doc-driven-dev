#!/usr/bin/env node
// Advisory: list enabled docs sections that still have only a README (no content yet).
// Helps authors see what is empty. Zero dependencies.
//
// Usage: node scripts/find-missing-docs.mjs [docsDir]   (default: ../docs)
import { readdirSync, existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const docsDir = process.argv[2] ?? "../docs";

if (!existsSync(docsDir)) {
  console.error(`docs directory not found: ${docsDir}`);
  process.exit(2);
}

let enabled = null;
const manifestPath = join(docsDir, ".docmeta.json");
if (existsSync(manifestPath)) {
  try {
    const m = JSON.parse(readFileSync(manifestPath, "utf8"));
    enabled = new Set([
      ...(m.core ?? []),
      ...Object.entries(m.modules ?? {}).filter(([, v]) => v.enabled).map(([k]) => k),
    ]);
  } catch {
    /* ignore */
  }
}

const empty = [];
for (const entry of readdirSync(docsDir, { withFileTypes: true })) {
  if (!entry.isDirectory()) continue;
  if (entry.name.startsWith("_") || entry.name === "99-archive") continue;
  if (enabled && !enabled.has(entry.name)) continue;

  const dir = join(docsDir, entry.name);
  const mdFiles = readdirSync(dir).filter((f) => f.endsWith(".md"));
  const hasOnlyReadme = mdFiles.length <= 1 && mdFiles.every((f) => f === "README.md");
  // also treat as empty if every subdir is empty of content
  if (hasOnlyReadme) empty.push(entry.name);
}

if (empty.length === 0) {
  console.log("Every enabled section has content beyond its README.");
} else {
  console.log("Sections that still need content (README only):");
  for (const s of empty) console.log(`  - ${s}`);
}
