# Security Policy

## Supported versions

doc-driven-dev is at an early `0.x` stage. Security fixes are applied to the latest released version only.

| Version | Supported |
|:--------|:----------|
| 0.1.x   | yes       |
| < 0.1   | no        |

## Reporting a vulnerability

Please report security issues privately rather than opening a public issue.

- Email **seanso@cyber.org.il** with a description, reproduction steps, and impact.
- You will get an acknowledgement, and a fix or mitigation plan once the report is triaged.

## Scope notes

doc-driven-dev ships configuration and local Node tooling; it has no runtime dependencies and runs no network services. The most relevant surface is the shell hook (`hooks/validate-on-edit.sh`) and the Node scripts, which operate on local files only. Reports about those, or about any way the plugin could write outside the intended `docs/` and `docs-tools/` paths, are especially welcome.
