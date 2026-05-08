# DESIGN.md — saas-demo-kit

## 1. Visual System

### Color Palette
| Variable | Default | Role |
|----------|---------|------|
| `--color-primary` | `#0F172A` | Problem/CTA bg, headlines in light scenes |
| `--color-accent` | `#6366F1` | Labels, feature numbers, metrics, CTA button |
| `--color-bg` | `#FFFFFF` | Product reveal and feature scene backgrounds |
| `--color-text` | `#1F2937` | Subheads, body text |
| `--color-muted` | `#6B7280` | Feature card descriptions, metric labels |

### Typography Scale (16:9, 1920×1080px)
| Level | Size | Weight | Usage |
|-------|------|--------|-------|
| Problem headline | 88px | 800 | scene_01 hero |
| Product/CTA headline | 80px | 800 | scene_02, scene_06 |
| Feature headline | 64px | 800 | scene_03–05 |
| Feature card title | 32px | 700 | Inside feature cards |
| Subhead | 32px | 500 | Supporting text |
| Metric value | 56px | 800 | Data highlight |
| Caption | 26px | 400 | Subtitle safe zone |

### Layout Grid (16:9)
- Canvas: 1920 × 1080px
- Side padding: 6% (115px each side)
- Two-column: 48% text / 52% visual, 80px gap
- Subtitle zone: `bottom: 10%` (= 108px from canvas bottom)

## 2. Motion Language

- **Pace**: medium (0.35s per element)
- **Style**: clean_tech — `power3.out` headlines, `power2.out` body
- **Alternating layout**: feature cards alternate left/right across scenes 03–05

### Per-Scene Transitions
| Scene | Purpose | Transition |
|-------|---------|------------|
| scene_01 | problem | fast_scale_in (dark bg, urgency) |
| scene_02 | product_reveal | scale_in (reveal moment) |
| scene_03 | feature_1 | slide_up |
| scene_04 | feature_2 | slide_up (card on left side) |
| scene_05 | feature_3 | slide_up |
| scene_06 | cta | slide_up |

## 3. Key Components

### Screenshot Frame
The product screenshot frame simulates a browser/app window:
- Dark `--color-primary` background
- Three traffic-light dots (decorative only)
- Body area: replace placeholder UI lines with `background-image: url('assets/screenshot-XX.png')`

### Feature Card
Borderless card with accent-colored top stripe and large number:
- Number: `--color-accent`, 52px, 800 weight
- Title: `--color-primary`, 32px, 700 weight
- Description: `--color-muted`, 22px, 400 weight

### Metric Block
Two metrics side-by-side with accent-tinted background:
- Value: `--color-accent`, 56px, 800 weight
- Label: `--color-muted`, 20px

## 4. Brand Kit Override Map
| CSS Variable | brand-kit.json Field |
|-------------|---------------------|
| `--color-primary` | `colors.primary` |
| `--color-accent` | `colors.accent` |
| `--color-bg` | `colors.background` |
| `--color-text` | `colors.text_primary` |
| `--color-muted` | `colors.text_secondary` |
| `--font-headline` | `fonts.headline` |
| `--font-body` | `fonts.body` |
