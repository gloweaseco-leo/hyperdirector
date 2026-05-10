# Template Authoring Rules

> Referenced by: `prompts/05-compose-hyperframes.md`, `docs/template-guide.zh-CN.md`  
> These rules govern how HyperDirector templates are structured, what files they must contain, and how they must behave when consumed by the composer. A template that violates these rules will cause generation failures or produce non-customizable outputs.

---

## Template Directory Structure  `BLOCKING`

Every template must live under `templates/<template-slug>/` and contain exactly these files:

```
templates/<template-slug>/
├── template.html               # Base composition — required
├── DESIGN.md                   # Visual design spec for this template — required
├── prompt.md                   # Composer guidance for using this template — required
├── customization-guide.md      # How to adapt this template via brand kit — required
└── variants/                   # Duration/aspect variants — required directory
    ├── 15s.html                # 15-second variant — required
    ├── 30s.html                # 30-second variant — required
    └── 60s.html                # 60-second variant — optional but recommended
```

**Checkable condition:** All 5 required files/directories exist. A template missing any of them cannot be referenced in `brief.template`.

---

## TA-01 · `template.html` — Structure Requirements  `BLOCKING`

`template.html` is the base composition file. It must:

### 1. Use CSS variables for all brand-customizable values

All colors, fonts, and spacing that should be overridden by the brand kit must use CSS variables defined in `:root`:

```css
:root {
  /* These exact variable names must be used — composer expects them */
  --color-primary:    #0F172A;
  --color-accent:     #6366F1;
  --color-bg:         #FFFFFF;
  --color-text:       #111827;
  --color-muted:      #6B7280;
  --font-headline:    'Inter', sans-serif;
  --font-body:        'Noto Sans SC', sans-serif;
}
```

**Violation:** Hard-coded hex colors in element styles (`color: #6366F1` instead of `color: var(--color-accent)`).

### 2. Use template placeholder comments for scene content

Scene content that the composer will replace must be marked with placeholder comments:

```html
<section id="scene_01" class="scene" data-duration="4" data-transition="fast_scale_in">
  <!-- TEMPLATE:HEADLINE -->
  <h1 class="headline">{{headline}}</h1>
  <!-- TEMPLATE:CAPTION -->
  <div class="subtitle">{{caption}}</div>
</section>
```

Placeholder syntax: `{{field_name}}` matching field names from `storyboard.scenes[*]`.

### 3. Include required HyperFrames structural elements

```html
<!-- Required: composition root with aspect ratio -->
<div id="composition" data-aspect-ratio="9:16">

<!-- Required: every scene section with data-duration -->
<section id="scene_01" class="scene" data-duration="4" data-transition="fast_scale_in">

<!-- Required: subtitle element in every scene -->
<div class="subtitle">{{caption}}</div>

<!-- Required: GSAP 3.12.x once — CDN (default) or assets/gsap.min.js (R-CORE-12) -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>

<!-- Required: paused timeline registered to window.__timelines -->
<script>
  const tl = gsap.timeline({ paused: true });
  // ... tweens ...
  window.__timelines = window.__timelines || [];
  window.__timelines.push(tl);
</script>
```

### 4. Must not reference any user-specific brand assets

`template.html` must use only:
- Generic placeholder images (CSS gradients, solid color blocks, or `data-placeholder="true"` elements)
- Generic placeholder text (`{{headline}}`, `{{caption}}`)
- Default CSS variable values that work standalone without brand-kit customization

**Violation:** `<img src="assets/my-company-logo.png">` hard-coded in template.html.

### 5. `@media` and `#composition`

`@media` rules may only adjust **outer** layout (e.g. `body` padding). They must **not** change `#composition` width, height, or in-canvas font sizes. See `rules/headless-rendering-stability.md` (R-HRS-03).

---

## TA-02 · `DESIGN.md` — Template Visual Spec  `BLOCKING`

Each template's `DESIGN.md` documents the default visual system for that template. It must contain:

1. **Default color palette** — the `:root` CSS variable values with rationale
2. **Typography scale** — font sizes for headline / subhead / caption / meta, per aspect ratio
3. **Scene structure** — table of scenes, their purposes, and recommended durations
4. **Motion language** — default GSAP ease, pace, transition styles
5. **Subtitle position** — exact `bottom` value for each supported aspect ratio
6. **Grid system** — content zones, margins, and safe areas
7. **Brand kit override map** — which CSS variables map to which brand-kit fields

```markdown
## Brand Kit Override Map

| CSS Variable | Brand Kit Field | Notes |
|-------------|----------------|-------|
| --color-primary | brand_kit.colors.primary | Headline text |
| --color-accent | brand_kit.colors.accent | Buttons, highlights |
| --color-bg | brand_kit.colors.background | Scene backgrounds |
| --font-headline | brand_kit.fonts.headline | Display text |
| --font-body | brand_kit.fonts.body | Captions, body copy |
```

---

## TA-03 · `prompt.md` — Composer Guidance  `BLOCKING`

`prompt.md` is read by the composer (Stage 05) before generating the composition. It tells the composer how to use this template specifically.

Required sections:
1. **Template intent** — what kind of video this template is designed for (1–2 sentences)
2. **Scene sequence** — ordered list of scene purposes with recommended durations
3. **Content rules** — any constraints specific to this template (e.g., "hook must use brand accent color")
4. **Substitution guide** — how each `{{placeholder}}` maps to storyboard fields
5. **Do not** — explicit prohibitions (e.g., "do not add scenes beyond the template structure without editing variants/")

Example `prompt.md` structure:
```markdown
# Template: tiktok-vertical-kit — Composer Guide

## Intent
Short-form vertical video optimized for TikTok and WeChat Channels. 
6 scenes, 15–60 seconds. Hook-first structure with punchy copy.

## Scene Sequence
| Position | Purpose | Recommended Duration |
|----------|---------|---------------------|
| 1 | hook | 3–5s |
| 2 | context | 5–8s |
| 3 | point_1 | 5–8s |
| 4 | point_2 | 5–8s |
| 5 | point_3 | 5–8s |
| 6 | cta | 3–5s |

## Substitution Guide
- {{headline}} → storyboard.scenes[i].headline
- {{caption}} → storyboard.scenes[i].caption
- {{transition}} → storyboard.scenes[i].transition (applied to data-transition)
- {{duration}} → storyboard.scenes[i].duration (applied to data-duration)

## Do Not
- Do not remove the hook or CTA scenes
- Do not change #composition dimensions
- Do not replace CSS variables with hard-coded values
```

---

## TA-04 · `customization-guide.md` — Brand Kit Integration  `BLOCKING`

Documents how a user or agent applies their brand kit to this template. Must include:

1. **Minimum required brand-kit fields** for this template to render correctly
2. **Step-by-step override instructions** — which CSS variables to change, in what order
3. **Asset slots** — which image/asset positions exist and what file format/size each slot expects
4. **Font loading instructions** — system / CJK stacks, optional `@font-face` from `assets/` (user-supplied fonts); do **not** treat Google Fonts as required for production render (see `rules/headless-rendering-stability.md`)
5. **Common customization patterns** — 2–3 examples of typical brand overrides

---

## TA-05 · Variants — Duration Support  `BLOCKING`

Every template must provide at least two duration variants as **Markdown** specs:

| Variant | File | Scene Count | Total Duration |
|---------|------|-------------|----------------|
| Short | `variants/15s.md` | 3–4 scenes | 15s |
| Standard | `variants/30s.md` | 5–6 scenes | 30s |
| Extended | `variants/60s.md` | 7–8 scenes | 60s (recommended) |

**Variant rules:**
- All variants must pass the same structural rules as `template.html`
- Variants must share the same CSS variable system as the base template
- Shorter variants must preserve the hook scene and CTA scene; compress middle content
- `total_duration` of each variant must match its filename (15s → 15, 30s → 30)

---

## TA-06 · No User Brand Lock-in  `BLOCKING`

Templates must not contain any reference to a specific user's brand. The following are forbidden in any file under `templates/<slug>/`:

- Specific company names (other than HyperDirector itself)
- Specific logo files or brand image assets
- Hard-coded colors that match a specific user's brand (without being expressed as CSS variables)
- TTS voice configurations specific to one creator

**Checkable condition:** All colors in the template are expressed as CSS variable references (`var(--color-primary)`) or as the default values in the `:root` block only.

---

## TA-07 · Scene Structure Must Be Explicit  `BLOCKING`

Each scene in `template.html` must have a comment identifying its purpose:

```html
<!-- scene_01: hook -->
<section id="scene_01" class="scene" data-duration="4" data-transition="fast_scale_in">

<!-- scene_02: context -->
<section id="scene_02" class="scene" data-duration="7" data-transition="slide_up">
```

Purpose values must be from the enum in `storyboard.schema.json`:
`hook`, `context`, `point_1`, `point_2`, `point_3`, `mechanism`, `mechanism_1`, `mechanism_2`, `use_case`, `problem`, `product_reveal`, `feature_1`, `feature_2`, `feature_3`, `result`, `big_claim`, `action`, `cta`

---

## TA-08 · Brand Kit Override Must Be Complete  `BLOCKING`

When the composer applies a brand kit to a template, applying all 5 CSS variables must produce a fully branded composition without requiring any other changes:

| CSS Variable | Must Affect |
|-------------|------------|
| `--color-primary` | Headline text color, key text |
| `--color-accent` | CTA button background, highlights, scene accent elements |
| `--color-bg` | Scene background color |
| `--color-text` | Body text, captions |
| `--color-muted` | Secondary text, metadata |

**Test:** Set all 5 variables to obviously wrong values (e.g., all `red`) and open `template.html`. All styled elements must change. If any element retains a hard-coded color, it is a violation.

---

## TA-09 · Template Must Be Self-Testing  `ADVISORY`

Each template should include a test variant at `variants/test.html` that:
- Uses deliberately high-contrast, obviously wrong colors (so it's easy to spot hard-coded values)
- Contains the maximum scene count for that template
- Has all scenes fully populated with placeholder content
- Can be opened in a browser and played manually to verify the full timeline

---

## Template Authoring Checklist

Before publishing a new template to `templates/`:

```
[ ] templates/<slug>/template.html exists and opens without errors
[ ] templates/<slug>/DESIGN.md exists with all 7 required sections
[ ] templates/<slug>/prompt.md exists with all 5 required sections
[ ] templates/<slug>/customization-guide.md exists
[ ] templates/<slug>/variants/15s.md exists and duration = 15s
[ ] templates/<slug>/variants/30s.md exists and duration = 30s
[ ] All colors in template.html use var(--color-*) — no hard-coded hex
[ ] All fonts use var(--font-*) — no hard-coded font families
[ ] window.__timelines registered, timeline is { paused: true }
[ ] No Math.random(), no repeat: -1, no setTimeout
[ ] Every scene has <!-- scene_XX: purpose --> comment
[ ] Every scene has data-duration and data-transition
[ ] No user-specific brand assets referenced
[ ] sum(data-duration values) = declared total duration for each variant
[ ] Brand kit override map in DESIGN.md is complete
```
