# Source Image Workflow

> Version: v0.1.3-preview  
> Applies to: HyperDirector + Hermes (Cursor Agent)  
> Rules: `rules/image-assets-basics.md`  
> Schema: `schemas/asset-manifest.schema.json`  
> QA: `qa/image-asset-checklist.md`

---

## Overview

The Source Image Pipeline describes how Hermes identifies, organizes, binds, and validates image assets from source files or directories before committing them to a production render.

**Core constraints:**

- Production renders must use **local image assets only**. Remote URLs are permitted only in draft/planning phase.
- No AI image generation service is wired into the default pipeline.
- Real image files are **not committed** to version control. `asset-manifest.json` declares asset metadata; it is not the asset itself.
- All assets must reach `render_safe: true` before render is invoked.

---

## Pipeline Stages

### Stage 1 — Identify

Hermes accepts image inputs in any of these forms:

| Input | Example |
|-------|---------|
| Single local file | `assets/hero.png` |
| Local directory | `assets/images/` |
| Exported slides directory | `assets/slides/` |
| UI screenshot | `assets/screenshots/` |
| Brand kit exports | `brand/logo.svg` |

Hermes will proactively suggest cataloguing assets when it detects `.png` / `.jpg` / `.webp` / `.svg` files referenced in briefs, storyboards, or user instructions.

Hermes will **not** silently call AI image generation services. User confirmation is required before any AI-generated asset is introduced.

---

### Stage 2 — Organize

Recommended output directory layout:

```
output/
  assets/
    images/            ← source images (not committed to git)
    images/variants/   ← compressed / resized variants
  asset-manifest.json
  index.html
  brief.json
  storyboard.json
```

**Naming convention:** `snake_case`, all lowercase, no spaces.  
Pattern: `<role>_<description>_<sequence>.<ext>`  
Examples: `hero_image_dashboard_01.png`, `brand_logo.svg`, `scene02_background.webp`

Add to `.gitignore`:
```
output/assets/images/
```

---

### Stage 3 — Asset Manifest

Create `output/asset-manifest.json` validated against `schemas/asset-manifest.schema.json`.

**Minimum required fields per asset:**

| Field | Notes |
|-------|-------|
| `asset_id` | Unique identifier (snake_case) |
| `type` | Always `"image"` |
| `role` | Select from enum; use `"custom"` + `custom_role` if none fits |
| `local_path` | Relative to `output/`. Fill planned path first; verify on file arrival. |
| `license_status` | Must not be `"unknown"` or `"pending"` for render |
| `render_safe` | Start `false`; flip to `true` when all conditions met |

**Binding assets to scenes:**

```json
"bindings": [
  {
    "scene_id": "scene_02",
    "shot_id": "scene_02-shot-01",
    "slot": "main_visual",
    "usage": "ui_screenshot",
    "priority": 1
  }
]
```

`scene_id` must match a scene `id` in `storyboard.json`. One asset can bind to multiple scenes.

---

### Stage 4 — Variants

Register compressed or resized alternatives in the `variants` array.

When to create variants:
- Source file > 5 MB (R-IMG-06) → provide compressed WebP for render
- Multiple aspect ratios needed (9:16 / 16:9 / 1:1)
- Thumbnails for `scene_thumbnail` slot

Mark the render-target variant with `"use_for_render": true`. Reference the variant path in `index.html`, keep the original for archive only.

---

### Stage 5 — Composition Binding

Reference images by local path in `index.html`:

```html
<!-- Correct: local path + alt -->
<img src="assets/images/hero_01_1920.webp" alt="Product dashboard" />

<!-- Correct: local background -->
<div style="background-image: url('assets/images/bg.webp');"></div>
```

**Forbidden in production:**
```html
<img src="https://example.com/hero.png" />
```

Align HTML element `id` / `class` names with `bindings.slot` values to enable Hermes slot-based content replacement.

---

### Stage 6 — Readiness Check

Run the advisory hazard scan:

```bash
node hyperdirector/scripts/check-composition-hazards.js output/index.html
```

Checks performed (warnings only, exit 0):
- `<img src>` using remote URL
- CSS `background-image` using remote URL
- `<img>` missing `alt`
- SVG external reference risk
- Local image path not found on disk
- Local image file > 5 MB

Complete checklist: `qa/image-asset-checklist.md`.

Set `"render_safe": true` in `asset-manifest.json` for each cleared asset.

---

### Stage 7 — Render

```bash
npx hyperframes render --input output/index.html --output output/final.mp4
```

---

## Scope

| In scope | Out of scope |
|----------|--------------|
| Local asset identification, organization, binding | AI image generation API calls |
| Asset Manifest creation and maintenance | Automated image scraping or download |
| Variant registration (compress / crop) | Automatic image compression (use optional tools) |
| Pre-render render_safe validation | Client file management or procurement |

---

## Related Files

| File | Purpose |
|------|---------|
| `rules/image-assets-basics.md` | R-IMG-01 – R-IMG-09 rule definitions |
| `schemas/asset-manifest.schema.json` | Asset Manifest JSON Schema |
| `qa/image-asset-checklist.md` | Pre-render checklist |
| `scripts/check-composition-hazards.js` | Advisory hazard scan (includes image checks) |
| `docs/source-image-workflow.zh-CN.md` | Chinese version of this document |
