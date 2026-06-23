// Markdown link extraction and resolution for the docs validator.
// Zero dependencies: just regex over the document body (fenced code stripped first).
import { existsSync } from "node:fs";
import { dirname, resolve, normalize } from "node:path";
import { readText } from "./walk.mjs";

const BAD_ANCHOR_TEXT = new Set(["click here", "here", "this", "link", "read more"]);

// Remove fenced (``` ... ```) and inline (`...`) code, plus HTML comments
// (<!-- ... -->), so links inside code or commented-out examples aren't flagged.
function stripCode(body) {
  return body
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/```[\s\S]*?```/g, "")
    .replace(/~~~[\s\S]*?~~~/g, "")
    .replace(/`[^`\n]*`/g, "");
}

/**
 * Extract Markdown links from a document body.
 * @returns {Array<{ text: string, target: string, isImage: boolean }>}
 */
export function extractLinks(body) {
  const clean = stripCode(body);
  const links = [];
  // Matches [text](target) and ![text](target); target stops at whitespace or ).
  const re = /(!?)\[([^\]]*)\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g;
  let m;
  while ((m = re.exec(clean)) !== null) {
    links.push({ isImage: m[1] === "!", text: m[2], target: m[3] });
  }
  return links;
}

/** Classify a link target. */
export function classify(target) {
  if (/^[a-z][a-z0-9+.-]*:/i.test(target)) return "external"; // http:, https:, mailto:, etc.
  if (target.startsWith("//")) return "external";
  if (target.startsWith("#")) return "anchor";
  if (target.startsWith("/")) return "absolute";
  return "relative";
}

/** Build the set of GitHub-style heading slugs present in a Markdown body. */
export function headingSlugs(body) {
  const clean = stripCode(body);
  const slugs = new Set();
  const re = /^#{1,6}\s+(.+?)\s*#*\s*$/gm;
  let m;
  while ((m = re.exec(clean)) !== null) {
    slugs.add(slugify(m[1]));
  }
  return slugs;
}

/** GitHub-flavored heading slug: lowercase, strip punctuation, spaces to hyphens. */
export function slugify(text) {
  return text
    .trim()
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");
}

/**
 * Resolve and validate one relative link from a source file.
 * @param {string} sourceFile absolute path of the file containing the link
 * @param {string} target the raw link target (may include #anchor)
 * @returns {{ ok: boolean, reason?: string }}
 */
export function resolveRelative(sourceFile, target) {
  const [pathPart, anchor] = splitAnchor(target);

  // Pure in-page anchor (no path) — validate against the source file's own headings.
  if (pathPart === "") {
    if (!anchor) return { ok: false, reason: "empty link target" };
    const slugs = headingSlugs(readText(sourceFile));
    return slugs.has(anchor)
      ? { ok: true }
      : { ok: false, reason: `in-page anchor #${anchor} not found` };
  }

  const resolved = normalize(resolve(dirname(sourceFile), pathPart));
  if (!existsSync(resolved)) {
    return { ok: false, reason: `target not found: ${pathPart}` };
  }

  // If there's an anchor and the target is Markdown, verify the heading exists.
  if (anchor && resolved.endsWith(".md")) {
    const slugs = headingSlugs(readText(resolved));
    if (!slugs.has(anchor)) {
      return { ok: false, reason: `anchor #${anchor} not found in ${pathPart}` };
    }
  }
  return { ok: true };
}

function splitAnchor(target) {
  const i = target.indexOf("#");
  if (i === -1) return [target, ""];
  return [target.slice(0, i), target.slice(i + 1)];
}

/** True when visible anchor text is unhelpful (per linking standards). */
export function isWeakAnchorText(text) {
  const t = text.trim().toLowerCase();
  if (BAD_ANCHOR_TEXT.has(t)) return true;
  if (/^https?:\/\//.test(t)) return true; // bare URL as visible text
  return false;
}
