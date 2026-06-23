// Recursive Markdown-file walker that respects skip-dir rules from .docmeta.json.
import { readdirSync, statSync, existsSync, readFileSync } from "node:fs";
import { join, relative, sep, basename } from "node:path";

// Always-skipped directory names, regardless of manifest. These never carry
// contract-conformant docs (templates use placeholders; archive is frozen).
const DEFAULT_SKIP_NAMES = new Set([
  "_templates",
  "_assets",
  "node_modules",
  ".git",
  ".docusaurus",
  "build",
]);

/**
 * @param {string} docsDir absolute path to the docs/ root
 * @param {object} [opts]
 * @param {string[]} [opts.skipDirs] folder names (relative to docs/) to skip, from manifest
 * @returns {string[]} absolute paths of *.md files under docsDir, minus skipped trees
 */
export function walkMarkdown(docsDir, opts = {}) {
  const skipNames = new Set([...DEFAULT_SKIP_NAMES, ...(opts.skipDirs ?? [])]);
  const out = [];

  function recurse(dir) {
    let entries;
    try {
      entries = readdirSync(dir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const entry of entries) {
      const full = join(dir, entry.name);
      if (entry.isDirectory()) {
        if (skipNames.has(entry.name)) continue;
        // also allow skipping by relative path (e.g. "00-workplan/audit-2026")
        const rel = relative(docsDir, full).split(sep).join("/");
        if ((opts.skipDirs ?? []).includes(rel)) continue;
        if (entry.name === "_tasks") continue; // tracker artifacts, excluded from build
        recurse(full);
      } else if (entry.isFile() && entry.name.endsWith(".md")) {
        out.push(full);
      }
    }
  }

  if (existsSync(docsDir)) recurse(docsDir);
  return out.sort();
}

/**
 * List immediate subdirectories of a directory that should contain a README.md
 * (i.e. real content sections, not skipped/asset/tracker folders).
 * @returns {string[]} absolute paths of content subdirectories
 */
export function contentSubdirs(docsDir, opts = {}) {
  const skipNames = new Set([...DEFAULT_SKIP_NAMES, ...(opts.skipDirs ?? [])]);
  const dirs = [];

  function recurse(dir) {
    let entries;
    try {
      entries = readdirSync(dir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const entry of entries) {
      if (!entry.isDirectory()) continue;
      if (skipNames.has(entry.name) || entry.name === "_tasks") continue;
      if (basename(entry.name).startsWith("_")) continue;
      const full = join(dir, entry.name);
      dirs.push(full);
      recurse(full);
    }
  }

  if (existsSync(docsDir)) recurse(docsDir);
  return dirs.sort();
}

/** Read a UTF-8 file, returning "" if it cannot be read. */
export function readText(path) {
  try {
    return readFileSync(path, "utf8");
  } catch {
    return "";
  }
}

/** True if a directory exists. */
export function isDir(path) {
  try {
    return statSync(path).isDirectory();
  } catch {
    return false;
  }
}
