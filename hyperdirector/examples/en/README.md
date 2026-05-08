# English Demo Projects

English demo projects will be added in v0.2.

## Planned Examples

- `demo-article-to-video-en/` — Article to short video (English content)
- `demo-saas-product-en/` — SaaS product demo (English)
- `demo-github-repo-en/` — GitHub README to video (English)

## Why Chinese First?

HyperDirector v0.1 targets Chinese content creators as the primary audience.
Chinese demos are in `examples/zh-CN/` and are the primary reference for v0.1.

English demos follow the same structure and will be added once the core workflow is stable.

## Using HyperDirector for English Videos

To generate English videos with HyperDirector, set in `brief.json`:

```json
{
  "language": "en-US",
  "subtitle_language": "en-US",
  "ui_copy_language": "en-US"
}
```

Or prompt Hermes in English — HyperDirector infers language from user input.
