# Writing style guide

The deeper version of the writing-style rules in the documentation-standards skill. These make docs readable for humans and reliable for AI agents.

## Audience and tasks first

Open every page by answering "what is this for, and who is it for?" Put the overview before the depth. A reader (or agent) should be able to decide in two sentences whether this is the right page.

## Voice and person

- Write as developers for developers on this project.
- Prefer first-person plural ("we", "our") for shared norms, architecture, and team procedures.
- Use second person ("you", "your") only for a bounded procedure aimed at a specific role ("Operators run…", "Reviewers check…").
- Keep one narrator per page. Do not drift between marketing voice, anonymous "the user", and tutorial "you".

## Structure

- Headings describe content, not cleverness. A reader scanning only the headings should understand the shape of the page.
- Short paragraphs. One idea each.
- Use tables for anything with parallel structure (fields, options, comparisons).
- Use fenced code blocks with a language tag for commands and code.
- Keep examples minimal, accurate, and copy-pastable. Prefer a real example over a long description.

## Emphasis and punctuation

- Bold is for genuine emphasis or a scan anchor (a term on first use in a long section). Do not bold every noun phrase or bullet label.
- Prefer plain punctuation: commas, colons, parentheses, natural hyphenation.
- Reserve special characters for where they add clarity (code, math, established product names).

## "AI prose" tells to avoid

These patterns make a doc read as machine-generated and erode trust:

- Em-dash overuse where a comma or period would do.
- Filler openers ("In today's fast-paced world…", "It's worth noting that…").
- Vague hype ("powerful", "seamless", "robust") without specifics.
- Decorative Unicode, emoji as bullets, or gratuitous symbols.
- Generic engagement closers ("Happy to help!", "Let us know if you have questions").
- Bolding the first half of every bullet as a fake label.

Replace each with something concrete: a specific number, a file path, a command, or a direct instruction.

## Docs as code

- Update docs in the same change as the code they describe.
- Treat a broken link, a stale example, or a missing frontmatter field as a defect, not a nicety.
- Review docs in PRs the way you review code.

## Accessibility

- Link text must make sense out of context (it is read aloud by screen readers).
- Every diagram needs a text description; do not put information only in an image.
- Use a predictable heading hierarchy (no skipping from `#` to `###`).

## Honesty about certainty

When a fact was inferred from code rather than confirmed, mark the doc `status: draft` and flag the specific claim with an inline `> TODO(verify): …`. Never present an inferred API name, version, or behavior as established fact.
