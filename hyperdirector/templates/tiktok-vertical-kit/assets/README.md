# Assets — tiktok-vertical-kit

Place your assets in `output/assets/` when using this template in a project.
These are the expected slots. All are optional unless marked Required.

| Filename | Slot | Required | Format | Size | Notes |
|----------|------|----------|--------|------|-------|
| `logo.png` | CTA scene (scene_05) | Recommended | PNG, transparent | 80–120px sq | Circular crop applied via CSS |
| `watermark.png` | All scenes (corner overlay) | No | PNG, transparent | 200×80px | 20% opacity recommended |
| `bg-hook.jpg` | scene_01 background texture | No | JPG | 1080×1920px | Applied at 10% opacity over solid bg |
| `icon-point1.svg` | Replace point-number badge in scene_02 | No | SVG | 80×80px | Must be single-color SVG for accent tinting |
| `icon-point2.svg` | Replace point-number badge in scene_03 | No | SVG | 80×80px | |
| `icon-point3.svg` | Replace point-number badge in scene_04 | No | SVG | 80×80px | |

## Placeholder Behavior

If an asset file is missing, the template falls back to:
- Logo → hidden (no broken image)
- Background texture → solid `--color-primary`
- Point icons → numbered circles (default behavior)

Add `data-placeholder="true"` to any asset `<img>` that hasn't been provided yet.
