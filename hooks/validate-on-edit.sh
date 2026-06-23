#!/usr/bin/env bash
# PostToolUse hook: after an Edit/Write/MultiEdit, if the touched file is a Markdown
# doc inside a docs/ tree, validate just that file and surface any findings.
# Always exits 0 — this is advisory and must never block the edit.
set -uo pipefail

input="$(cat)"

# Extract tool_input.file_path from the hook payload using node (already required by the validator).
extract='let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{try{const j=JSON.parse(s);const p=j.tool_input&&(j.tool_input.file_path||j.tool_input.path);process.stdout.write(p||"")}catch(e){}});'
file="$(printf '%s' "$input" | node -e "$extract")"

# Only act on Markdown files that live under a docs/ directory.
case "$file" in
  *docs/*.md) ;;
  *) exit 0 ;;
esac
[ -f "$file" ] || exit 0

# Find the installed validator by walking up from the edited file.
dir="$(dirname "$file")"
while [ "$dir" != "/" ] && [ -n "$dir" ]; do
  if [ -f "$dir/docs-tools/check-docs.mjs" ]; then
    node "$dir/docs-tools/check-docs.mjs" "$file" || true
    exit 0
  fi
  dir="$(dirname "$dir")"
done

exit 0
