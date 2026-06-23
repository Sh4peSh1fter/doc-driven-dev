// Zero-dependency YAML-frontmatter parser, scoped to the fields the docs contract uses.
// We deliberately do NOT pull in js-yaml: the contract is a small, fixed shape, and a
// hand-rolled line parser keeps the validator runnable with nothing but `node`.
//
// Supported frontmatter shape:
//   ---
//   title: "..."            scalar (optionally quoted)
//   description: "..."
//   status: current         scalar
//   last_update:            nested block
//     date: "YYYY-MM-DD"
//     author: "Name"
//   doc_type: guide
//   tags: []                inline array OR block ("- item") array
//   draft: false            boolean
//   ---

const FRONTMATTER_RE = /^---\r?\n([\s\S]*?)\r?\n---/;

/**
 * Split a Markdown string into its frontmatter block and body.
 * @returns {{ raw: string, body: string, endLine: number } | null} null when no leading `---` block.
 */
export function extractFrontmatter(content) {
  if (!content.startsWith("---")) return null;
  const m = FRONTMATTER_RE.exec(content);
  if (!m) return null;
  const raw = m[1];
  const body = content.slice(m[0].length);
  const endLine = m[0].split("\n").length; // 1-based line where body starts
  return { raw, body, endLine };
}

function unquote(value) {
  const v = value.trim();
  if (
    (v.startsWith('"') && v.endsWith('"')) ||
    (v.startsWith("'") && v.endsWith("'"))
  ) {
    return v.slice(1, -1);
  }
  return v;
}

function coerce(value) {
  const v = value.trim();
  if (v === "true") return true;
  if (v === "false") return false;
  return unquote(v);
}

/**
 * Parse a frontmatter block into a plain object.
 * - Nested `last_update` becomes { date, author }.
 * - Inline (`[a, b]`) and block (`- a`) arrays both produce JS arrays.
 * - `__present` is a Set of the top-level keys that appeared (for required-field checks).
 * @param {string} raw frontmatter inner text (between the --- fences)
 */
export function parseFields(raw) {
  const lines = raw.split(/\r?\n/);
  const fields = { __present: new Set() };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.trim() === "") continue;
    if (/^\s/.test(line)) continue; // indented lines are consumed by their parent below

    const m = /^([A-Za-z0-9_]+):\s*(.*)$/.exec(line);
    if (!m) continue;
    const key = m[1];
    const rest = m[2];
    fields.__present.add(key);

    if (rest !== "") {
      // Inline array: key: [a, b]
      if (rest.startsWith("[") && rest.endsWith("]")) {
        const inner = rest.slice(1, -1).trim();
        fields[key] = inner === "" ? [] : inner.split(",").map((s) => coerce(s));
      } else {
        fields[key] = coerce(rest);
      }
      continue;
    }

    // Empty value: look ahead at the indented block to decide map vs array.
    const child = [];
    let j = i + 1;
    while (j < lines.length && (/^\s+/.test(lines[j]) || lines[j].trim() === "")) {
      if (lines[j].trim() !== "") child.push(lines[j]);
      j++;
    }

    if (child.length === 0) {
      fields[key] = {}; // declared but empty
    } else if (child[0].trim().startsWith("- ")) {
      fields[key] = child.map((c) => coerce(c.trim().slice(2)));
    } else {
      const map = {};
      for (const c of child) {
        const nm = /^([A-Za-z0-9_]+):\s*(.*)$/.exec(c.trim());
        if (nm) map[nm[1]] = coerce(nm[2]);
      }
      fields[key] = map;
    }
    i = j - 1; // skip the consumed block
  }

  return fields;
}

/**
 * Normalize a frontmatter value to an array, accounting for the empty-map artifact
 * (`key:` with nothing under it parses to `{}`).
 * @returns {Array | undefined} undefined when the key was absent.
 */
export function asArray(value) {
  if (Array.isArray(value)) return value;
  if (value === undefined || value === null) return undefined;
  if (typeof value === "object" && Object.keys(value).length === 0) return [];
  return [value];
}
