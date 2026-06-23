// Output formatting for the docs validator. Two modes: human-readable and JSON (for CI/agents).
import { relative } from "node:path";

/**
 * @typedef {Object} Finding
 * @property {string} file absolute path
 * @property {"error"|"warning"} severity
 * @property {string} rule short rule id (e.g. "frontmatter.missing-field")
 * @property {string} message human-readable detail
 */

const RED = (s) => `\x1b[31m${s}\x1b[0m`;
const YELLOW = (s) => `\x1b[33m${s}\x1b[0m`;
const GREEN = (s) => `\x1b[32m${s}\x1b[0m`;
const DIM = (s) => `\x1b[2m${s}\x1b[0m`;

const useColor = process.stdout.isTTY && !process.env.NO_COLOR;
const red = (s) => (useColor ? RED(s) : s);
const yellow = (s) => (useColor ? YELLOW(s) : s);
const green = (s) => (useColor ? GREEN(s) : s);
const dim = (s) => (useColor ? DIM(s) : s);

/**
 * @param {Finding[]} findings
 * @param {{ scanned: number, root: string }} ctx
 * @returns {string}
 */
export function formatHuman(findings, ctx) {
  if (findings.length === 0) {
    return green(`OK: ${ctx.scanned} docs valid. No findings.`);
  }
  const lines = [];
  const byFile = new Map();
  for (const f of findings) {
    if (!byFile.has(f.file)) byFile.set(f.file, []);
    byFile.get(f.file).push(f);
  }
  for (const [file, fs] of byFile) {
    lines.push(relative(ctx.root, file) || file);
    for (const f of fs) {
      const tag = f.severity === "error" ? red("error") : yellow("warn ");
      lines.push(`  ${tag} ${dim(f.rule)}  ${f.message}`);
    }
  }
  const errors = findings.filter((f) => f.severity === "error").length;
  const warnings = findings.length - errors;
  lines.push("");
  lines.push(
    `${ctx.scanned} docs scanned — ${red(`${errors} error(s)`)}, ${yellow(`${warnings} warning(s)`)}.`,
  );
  return lines.join("\n");
}

/**
 * @param {Finding[]} findings
 * @param {{ scanned: number, root: string }} ctx
 * @returns {string} JSON string
 */
export function formatJson(findings, ctx) {
  const errors = findings.filter((f) => f.severity === "error").length;
  return JSON.stringify(
    {
      scanned: ctx.scanned,
      errors,
      warnings: findings.length - errors,
      findings: findings.map((f) => ({
        file: relative(ctx.root, f.file) || f.file,
        severity: f.severity,
        rule: f.rule,
        message: f.message,
      })),
    },
    null,
    2,
  );
}
