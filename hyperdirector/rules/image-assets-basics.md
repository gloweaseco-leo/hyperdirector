# Image Assets Basics

> Referenced by: `prompts/`, `qa/image-asset-checklist.md`, `docs/source-image-workflow.zh-CN.md`  
> Enforcement: rules marked BLOCKING must be satisfied before render; WARNING rules should be resolved; ADVISORY rules record intent in DESIGN.md if skipped.

---

## Rule Classification

| Level | Meaning |
|-------|---------|
| **BLOCKING** | Composition will fail to render or deliver corrupted output. Must fix. |
| **WARNING** | Render may succeed but output quality or stability degrades. Fix recommended. |
| **ADVISORY** | Best practice. Record in DESIGN.md if deliberately skipped. |

---

## R-IMG-01 · Prefer Local Image Assets for Production Render  `BLOCKING`

Production compositions must not rely on remote image URLs as the primary image source. All images used in final render must be resolved to local files before `npx hyperframes render` is invoked.

**Rationale:** Remote URLs may fail in headless/offline environments, causing blank frames or render timeouts.

**Allowed pattern:**
```html
<img src="assets/hero.png" alt="Product hero shot" />
```

**Violation pattern:**
```html
<img src="https://example.com/hero.png" alt="..." />
```

**Exception:** A remote URL may appear in preview / draft mode only if the `asset-manifest.json` entry has `"render_safe": false` and a corresponding local variant is planned. The render-ready composition must replace all remote URLs with local paths before render invocation.

---

## R-IMG-02 · Every `<img>` Must Have a Non-Empty `alt` Attribute  `WARNING`

All `<img>` elements in the composition must carry a meaningful `alt` attribute.

- Decorative images that convey no information: use `alt=""` (empty string is acceptable).
- Content images: provide a concise description ≤ 80 characters.

**Checkable condition:** No `<img>` tag is missing the `alt` attribute entirely.

**Why it matters:** Missing `alt` degrades accessibility, breaks screen-reader pass-through, and can cause automated QA tools to flag the composition.

---

## R-IMG-03 · `background-image` Must Not Use Remote URLs in Production  `WARNING`

CSS `background-image: url(...)` must reference local assets in production render.

**Violation:**
```css
.scene { background-image: url('https://cdn.example.com/bg.jpg'); }
```

**Fix:** Download the asset, place it in `output/assets/`, and update the reference.

---

## R-IMG-04 · SVG External References Must Be Resolved  `WARNING`

SVG files or inline `<svg>` elements must not contain unresolved external references:
- `<image href="https://...">` or `<image xlink:href="https://...">`
- `<use href="...#id">` pointing to remote files
- `filter` or `clip-path` referencing remote fragment URLs

**Rationale:** SVG external references fail silently in headless Chromium, producing empty or broken graphics.

**Fix:** Inline the referenced content or copy it to `output/assets/`.

---

## R-IMG-05 · Image Format Constraints  `ADVISORY`

Preferred formats for video composition:

| Format | Usage |
|--------|-------|
| PNG | Logos, UI screenshots, diagrams, overlays with transparency |
| JPG / JPEG | Photos, full-bleed backgrounds without transparency |
| WebP | Optimised photos or mixed-content images |
| SVG | Icons, diagrams, logos (vector) |

Avoid: BMP, TIFF, ICO, HEIC, AVIF (headless Chromium support is inconsistent).

---

## R-IMG-06 · Image File Size Advisory  `ADVISORY`

Large image files slow down headless render and inflate output bundle size.

| Threshold | Action |
|-----------|--------|
| > 5 MB per image | WARNING — compress or provide a downscaled variant in `asset-manifest.json` |
| > 10 MB per image | Strong recommendation to replace before production render |
| Total assets > 50 MB | Review composition for unnecessary high-res assets |

Use `asset-manifest.json` `variants` array to register compressed / resized versions. Use the pre-production variant in render, keep originals for source archive only.

**Tool hint:** `check-composition-hazards.js` will warn when a referenced local image exceeds 5 MB (R-IMG-06-advisory).

---

## R-IMG-07 · Asset Manifest Required for Multi-Asset Projects  `ADVISORY`

When a composition references three or more distinct image assets, maintain an `asset-manifest.json` validated against `hyperdirector/schemas/asset-manifest.schema.json`.

**Benefits:**
- Tracks `render_safe` status per asset
- Records `bindings` to scene / shot / slot for Hermes planning
- Enables batch validation before render
- Supports `variants` for multi-resolution delivery

**Minimum required fields when present:** `asset_id`, `type`, `role`, `local_path`, `render_safe`.

---

## R-IMG-08 · No AI-Generated Image Services in Default Pipeline  `ADVISORY`

Do not wire AI image generation services (Stable Diffusion, DALL·E, Midjourney API, etc.) into the default render pipeline. Hermes must not make outbound calls to image generation APIs without explicit user confirmation per session.

**Allowed:** Referencing a pre-generated image file that happens to have been created with an AI tool, stored locally, with `license_status` documented in `asset-manifest.json`.

**Violation:** A prompt / workflow that silently calls an external image generation API during render or storyboard generation.

---

## R-IMG-09 · `render_safe` Flag Must Be `true` Before Production Render  `BLOCKING`

Every entry in `asset-manifest.json` consumed in the production composition must have `"render_safe": true`.

An asset is `render_safe` when:
1. The local file exists at `local_path` (relative to project root or output dir).
2. The file is in an approved format (R-IMG-05).
3. No external URL dependencies remain in the asset itself (R-IMG-04).
4. License status is confirmed (`license_status` is not `"unknown"` or `"pending"`).

**Transition workflow:** Start with `"render_safe": false` during planning. Set to `true` only after all conditions above are verified.

---

## Summary: Quick Reference

| Rule | Level | Topic |
|------|-------|-------|
| R-IMG-01 | BLOCKING | No remote URLs in production |
| R-IMG-09 | BLOCKING | render_safe must be true |
| R-IMG-02 | WARNING | img alt attribute |
| R-IMG-03 | WARNING | background-image remote URL |
| R-IMG-04 | WARNING | SVG external references |
| R-IMG-05 | ADVISORY | Approved image formats |
| R-IMG-06 | ADVISORY | File size thresholds |
| R-IMG-07 | ADVISORY | Asset manifest for multi-asset projects |
| R-IMG-08 | ADVISORY | No AI image generation in default pipeline |

Automated advisory scan (non-blocking):
```bash
node hyperdirector/scripts/check-composition-hazards.js output/index.html
```
