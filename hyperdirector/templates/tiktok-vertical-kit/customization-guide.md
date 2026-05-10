# Customization Guide — tiktok-vertical-kit

## Minimum Brand Kit Fields

| Field | Required | Effect |
|-------|----------|--------|
| `colors.primary` | Yes | Hook/CTA bg, card backgrounds, headline text in light scenes |
| `colors.accent` | Yes | Point number circles, accent lines, CTA button, keyword highlight |
| `colors.background` | Yes | Mid-section scene backgrounds |
| `colors.text_primary` | Recommended | Subheads and body text in light scenes |
| `fonts.headline` | Yes | All display text |
| `fonts.body` | Yes | Captions and card body |

## Step-by-Step Brand Override

### Step 1 — Update `:root` CSS Variables

In `template.html`, find the `:root` block and replace default values:

```css
:root {
  --color-primary:  /* brand_kit.colors.primary */;
  --color-accent:   /* brand_kit.colors.accent */;
  --color-bg:       /* brand_kit.colors.background */;
  --color-text:     /* brand_kit.colors.text_primary */;
  --color-muted:    /* brand_kit.colors.text_secondary */;
  --font-headline:  '/* brand_kit.fonts.headline */', 'Noto Sans SC', sans-serif;
  --font-body:      '/* brand_kit.fonts.body */', 'PingFang SC', sans-serif;
}
```

### Step 2 — Fonts (production / headless)

Prefer **system + CJK fallbacks** in `--font-headline` / `--font-body` so render does not depend on the public internet. Optional: licensed files in `output/assets/` + `@font-face` with `url('assets/...')`.

Do **not** treat Google Fonts as mandatory for final render — see `rules/headless-rendering-stability.md`.

### Step 3 — Add Logo to CTA Scene

Add inside `#scene_05`, above the headline:

```html
<img src="assets/logo.png" alt="brand logo"
     style="width:80px; height:80px; border-radius:50%; margin-bottom:24px; object-fit:contain;">
```

### Step 4 — Adjust CTA Button Border Radius

Match brand style:
```css
.cta-btn {
  border-radius: 64px;   /* clean_tech / warm_social */
  /* or: 8px for corporate */
  /* or: 16px for editorial */
}
```

## Asset Slots

| Slot | Element | Recommended Size | Format |
|------|---------|-----------------|--------|
| Logo | Add to `#scene_05` | 80–120px diameter | PNG transparent |
| Background texture | Add to `#scene_01` as `::before` overlay | 1080×1920px | PNG at 5–10% opacity |
| Custom icon in cards | Replace `.point-number` with `<img>` | 80×80px | SVG or PNG |

## Common Customizations

### Dark Mode (invert mid scenes)
Change mid scenes (02–04) to dark backgrounds:
```css
#scene_02, #scene_03, #scene_04 { background: var(--color-primary); }
.headline { color: #FFFFFF; }
.card { background: rgba(255,255,255,0.08); }
```

### Reduce to 2 Points (for shorter video)
Remove `#scene_04` from HTML and storyboard. Renumber IDs to keep sequential.
Update GSAP `S` offsets accordingly.

### Add Context Scene After Hook
Duplicate a point scene structure, set `purpose: context`, insert between scene_01 and scene_02. Renumber all following scenes.
