# Contributing to HyperDirector

Thank you for your interest in improving HyperDirector. This repository is the **open-source Skill Pack** (templates, prompts, rules, docs, and validation scripts). Commercial add-ons and private client materials live in a separate private repository and are out of scope here.

## Ways to contribute

- **Documentation**: fix typos, clarify install steps, improve bilingual docs.
- **Templates**: propose a new template kit following `rules/template-authoring-rules.md` and existing kit layout.
- **Schemas & scripts**: tighten JSON Schema or validation scripts (Node.js standard library only, unless discussed first).
- **Examples**: add **fully synthetic** demo projects only — no real customer names, logos, or paid-course copy.

## Before you open a PR

1. Run `node hyperdirector/scripts/check-env.js` if you changed workflow or docs that assume tooling.
2. Run `node hyperdirector/scripts/leak-scan.js` from the repository root and resolve any reported issues in files you touch.
3. For JSON artifacts, run the matching `validate-*.js` scripts when applicable.

## Licensing

By contributing, you agree that your contributions will be licensed under the same terms as this project (Apache License 2.0), unless you explicitly state otherwise in the pull request.

## Code of conduct

Be respectful and assume good intent. Keep discussion focused on the Skill Pack and public documentation.

## Security

Do not open public issues for security-sensitive matters. See [SECURITY.md](./SECURITY.md).
