# DESIGN.md — tiktok-vertical-kit

## 1. Visual System

### Color Palette (CSS Variables)
| Variable | Default | Role |
|----------|---------|------|
| `--color-primary` | `#0F172A` | Headlines, card backgrounds, hook/CTA scene bg |
| `--color-accent` | `#38BDF8` | Point numbers, highlights, CTA button, accent lines |
| `--color-bg` | `#F8FAFC` | Mid-section scene backgrounds |
| `--color-text` | `#1E293B` | Body text, subheads |
| `--color-muted` | `#64748B` | Secondary info, metadata |

Contrast guarantees: `--color-accent` on `--color-primary` = 6.2:1 (AA). White on `--color-primary` = 18:1 (AAA).

### Typography Scale (9:16, 1080×1920px)
| Level | Size | Weight | Usage |
|-------|------|--------|-------|
| Hero headline | 88px | 800 | Hook scene only |
| Section headline | 72px | 800 | Point scenes |
| CTA headline | 64px | 700 | CTA scene |
| Card headline | 52px | 700 | Inside info cards |
| Subhead | 36px | 600 | Supporting text |
| Card body | 26px | 400 | Card content text |
| Caption | 32px | 400 | Subtitle safe zone |

### Layout Grid (9:16)
- Canvas: 1080 × 1920px
- Content zone: 90% width centered
- Top padding: 80px
- Bottom padding: `safe-bottom (22%)` + 120px
- Subtitle zone: `bottom: 22%` (= 422px from canvas bottom)

## 2. Motion Language

- **Pace**: fast (0.2s per element)
- **Style**: clean_tech — `power3.out` for headlines, `power2.out` for body
- **Scene exit**: 0.25s fade-out, starts 0.25s before next scene

### Per-Scene Transitions
| Scene | Purpose | Transition | Entrance Duration |
|-------|---------|------------|------------------|
| scene_01 | hook | fast_scale_in | 0.2s scale + opacity |
| scene_02 | point_1 | slide_up | 0.2s y+40 fade |
| scene_03 | point_2 | slide_up | 0.2s y+40 fade |
| scene_04 | point_3 | slide_up | 0.2s y+40 fade |
| scene_05 | cta | slide_up | 0.25s scale |

## 3. Per-Scene Visual Spec

| Scene | Background | Key Elements | Notes |
|-------|-----------|--------------|-------|
| scene_01 (hook) | `--color-primary` (dark) | Accent-colored keyword + headline + accent line | Max contrast, sub 0.5s load |
| scene_02 (point_1) | `--color-bg` (light) | Circle badge "1" + headline + dark info card | Card uses primary bg |
| scene_03 (point_2) | `--color-bg` (light) | Circle badge "2" + headline + dark info card | Same layout as point_1 |
| scene_04 (point_3) | `--color-bg` (light) | Circle badge "3" + headline + dark info card | Same layout |
| scene_05 (cta) | `--color-primary` (dark) | Headline + accent line + subtext + CTA button | Button: accent bg, primary text |

## 4. Subtitle Rules

```css
.subtitle {
  bottom: 22%;           /* safe zone — never move below this */
  width: 88%;
  background: rgba(0, 0, 0, 0.65);
  color: #FFFFFF;
  font-size: 32px;
  line-height: 1.5;
  padding: 16px 24px;
  border-radius: 8px;
  max-lines: 2;
}
```

Platform-specific bottom UI: TikTok/WeChat bottom bar occupies bottom 18–22%. This template uses 22% as the floor.

## 5. Asset Requirements

| Asset | Slot | Format | Size |
|-------|------|--------|------|
| Logo | `#scene_05` safe zone (top-right) | PNG, transparent | 120×120px |
| Background texture (optional) | scene_01 overlay | PNG, 10% opacity | 1080×1920px |

## 6. Brand Kit Override Map

| CSS Variable | brand-kit.json Field |
|-------------|---------------------|
| `--color-primary` | `colors.primary` |
| `--color-accent` | `colors.accent` |
| `--color-bg` | `colors.background` |
| `--color-text` | `colors.text_primary` |
| `--color-muted` | `colors.text_secondary` |
| `--font-headline` | `fonts.headline` |
| `--font-body` | `fonts.body` |
