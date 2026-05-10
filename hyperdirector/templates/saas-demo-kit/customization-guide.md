# Customization Guide — saas-demo-kit

## Minimum Brand Kit Fields
Same as tiktok-vertical-kit. `colors.primary`, `colors.accent`, `colors.background`, `fonts.headline`, `fonts.body`.

**Fonts:** Prefer system / CJK stacks or local `assets/` + `@font-face` for headless render; see `rules/headless-rendering-stability.md`.

## Switching to 9:16 (Vertical Mode)

Change canvas dimensions in `:root` and `#composition`:
```css
:root {
  --canvas-w: 1080px;
  --canvas-h: 1920px;
  --safe-bottom: 22%;  /* increase for vertical */
}
```

Change `data-aspect-ratio` on `#composition`:
```html
<div id="composition" data-aspect-ratio="9:16">
```

Switch `.col-layout` to vertical stack:
```css
.col-layout { flex-direction: column; gap: 40px; height: auto; }
.col-text, .col-visual { flex: none; width: 100%; }
```

## Adding Real Screenshots

Replace the placeholder `.screenshot-body` content:
```html
<div class="screenshot-body" style="
  padding: 0;
  background: url('assets/screenshot-01.png') top center / cover no-repeat;
  min-height: 400px;
"></div>
```

Asset requirements: PNG or JPG, min 780×400px, 16:9 crop recommended.

## Customizing Feature Card Colors

For a lighter card style (white bg with subtle border):
```css
.feature-card { background: var(--color-bg); border: 1.5px solid var(--card-border); }
```

For a dark card (on dark bg scenes):
```css
.feature-card { background: rgba(255,255,255,0.06); border-color: rgba(255,255,255,0.1); }
.feature-title { color: #FFFFFF; }
.feature-desc { color: rgba(255,255,255,0.6); }
```

## Removing Metrics (feature scenes without data)

Delete the `.metric-row` div from the scene HTML. The layout will collapse cleanly since it uses flexbox column direction.

## Asset Slots

| File | Used In | Size | Required |
|------|---------|------|----------|
| `screenshot-01.png` | scene_02 product reveal | 780×400px+ | Recommended |
| `screenshot-02.png` | scene_03 feature_1 (optional) | 600×380px | No |
| `logo.png` | scene_06 CTA | 100×100px | Recommended |
