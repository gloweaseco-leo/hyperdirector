# DESIGN.md — ai-knowledge-explainer-kit

## 1. Visual System

### Color Palette
| Variable | Default | Role |
|----------|---------|------|
| `--color-primary` | `#0F172A` | All scene backgrounds |
| `--color-accent` | `#38BDF8` | Section labels, flow arrows, step numbers, CTA button |
| `--color-bg` | `#F1F5F9` | Unused as bg; used for light element fills if needed |
| `--color-text` | `#1E293B` | Unused (dark bg = white text direct) |
| `--color-muted` | `#64748B` | Unused (use rgba(255,255,255,0.55) for dark bg muted) |

This template is always dark-background. Light mode variant requires custom override (see customization-guide.md).

### Background Grid
Subtle 60px CSS grid overlay in very low opacity (`--grid-line: rgba(56,189,248,0.06)`) creates a tech-aesthetic depth without being distracting.

### Typography Scale (9:16, 1080×1920px)
| Level | Size | Weight | Color | Usage |
|-------|------|--------|-------|-------|
| Big stat | 160px | 900 | `--color-accent` | scene_01 only |
| Section headline | 72px | 800 | `#FFFFFF` | All scenes |
| CTA headline | 72px | 800 | `#FFFFFF` | scene_05 |
| Mech card title | 36px | 700 | `#FFFFFF` | Context cards |
| Flow node label | 22px | 600 | `#FFFFFF` | Flow diagrams |
| Step title | 28px | 600 | `#FFFFFF` | Use case steps |
| Subhead / body | 30px | 400 | `rgba(255,255,255,0.65)` | Supporting text |
| Section label | 18px | 600 | `--color-accent` | All scenes |
| Caption | 30px | 400 | `#FFFFFF` | Subtitle safe zone |

## 2. Motion Language

- **Pace**: fast (0.2–0.25s per element)
- **Style**: clean_tech — `power3.out` / `power2.out`
- **Stagger**: flow nodes and step items stagger at 0.12–0.15s intervals

### Per-Scene Transitions
| Scene | Purpose | Transition |
|-------|---------|------------|
| scene_01 | big_claim | fast_scale_in (big stat scale from 0.6) |
| scene_02 | context | slide_up |
| scene_03 | mechanism | slide_up (flow nodes stagger in) |
| scene_04 | use_case | slide_up (step items stagger in from right) |
| scene_05 | cta | slide_up |

## 3. Unique Components

### Section Label
Small all-caps accent-colored label with a short line prefix. Appears in every scene to signal the current section of the explainer.

### Flow Diagram (scene_03)
3 nodes connected by arrows. Nodes use `--node-bg` (semi-transparent accent tint) with `--node-border`. Arrows are `→` characters in accent color. Nodes stagger in from bottom with 0.12s delay.

### Step List (scene_04)
Numbered steps in a vertical list. Each step has an accent-colored circle badge. Steps slide in from the right with 0.15s stagger.

### Mechanism Card
Left-border accent stripe card for context callouts. Dark semi-transparent background.

## 4. Subtitle Rules

Same as tiktok-vertical-kit: `bottom: 22%`, `background: rgba(0,0,0,0.75)`, max 2 lines.

## 5. Brand Kit Override Map
| CSS Variable | brand-kit.json Field |
|-------------|---------------------|
| `--color-primary` | `colors.primary` (dark bg color) |
| `--color-accent` | `colors.accent` |
| `--color-bg` | `colors.background` (rarely used here) |
| `--color-text` | `colors.text_primary` |
| `--color-muted` | `colors.text_secondary` |
| `--font-headline` | `fonts.headline` |
| `--font-body` | `fonts.body` |
