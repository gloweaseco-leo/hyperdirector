# Security Policy

## Supported versions

Security fixes are considered for the **latest tagged release** of this open-source Skill Pack. This project is primarily documentation, prompts, and small Node.js validation scripts — not a network service.

## Reporting a vulnerability

If you believe you have found a security issue (for example, accidental inclusion of secrets, or unsafe instructions that could lead to data exfiltration when combined with agent tooling):

1. **Do not** open a public GitHub issue with exploit details.
2. Contact the maintainers through a **private channel** (e.g. GitHub Security Advisories for the repository, or email if the maintainers publish one).
3. Include: affected paths, reproduction steps, and impact assessment.

We will acknowledge receipt as soon as practical and coordinate a fix and disclosure timeline.

## Scope notes

- HyperDirector does not ship a server or collect telemetry by itself.
- Rendering and browser execution are performed by **HyperFrames** and your local environment; keep CLI and dependencies updated.
- Never commit API keys, tokens, customer identifiers, or private brand assets to the public repository.
