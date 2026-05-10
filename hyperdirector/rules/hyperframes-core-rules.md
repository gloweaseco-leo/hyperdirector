# HyperFrames Core Rules

> Referenced by: `prompts/05-compose-hyperframes.md`, `prompts/06-qa-fixer.md`  
> Enforcement: every generated composition must pass all BLOCKING rules before render.

---

## Rule Classification

| Level | Meaning |
|-------|---------|
| **BLOCKING** | Composition will fail to render. Must fix before proceeding. |
| **WARNING** | Render may succeed with degraded quality. Fix recommended. |
| **ADVISORY** | Best practice. Record in DESIGN.md if deliberately skipped. |

---

## R-CORE-01 · HTML is the Source of Truth  `BLOCKING`

The generated `index.html` is the canonical representation of the video. The following are derivative artifacts, not source files:

- `final.mp4` — render output
- `preview.html` — packaged view
- `render-report.md` — status log
- `DESIGN.md` — design decision doc

**Checkable condition:** `index.html` must exist, be valid HTML5, and open in a browser without JS errors before any render command is issued.

**Violation:** Generating `final.mp4` from any source other than `index.html` is forbidden.

---

## R-CORE-02 · Composition Must Have Explicit Canvas Dimensions  `BLOCKING`

The composition root element must declare exact pixel dimensions. Percentage-based canvas dimensions are forbidden.

```css
/* Required — use exactly one of these based on brief.aspect_ratio */
#composition { width: 1080px; height: 1920px; }  /* 9:16  */
#composition { width: 1920px; height: 1080px; }  /* 16:9  */
#composition { width: 1080px; height: 1080px; }  /* 1:1   */
```

**Checkable condition:** `document.querySelector('#composition').style.width` or its computed CSS must return a pixel value matching the table above.

**Violation:** `width: 100%`, `width: 100vw`, `min-height`, flex-grow, or any fluid sizing on `#composition`.

---

## R-CORE-03 · `data-duration` Required on Every Scene  `BLOCKING`

Every `<section class="scene">` element must have a `data-duration` attribute whose value is a positive number in seconds.

```html
<!-- Correct -->
<section id="scene_01" class="scene" data-duration="4" data-transition="fast_scale_in">

<!-- Violation — missing data-duration -->
<section id="scene_01" class="scene">
```

**Checkable condition:** `document.querySelectorAll('.scene[data-duration]').length === document.querySelectorAll('.scene').length`

**Sum check:** `sum(data-duration values) === storyboard.total_duration` (tolerance: 0s — must be exact)

---

## R-CORE-04 · `data-transition` Required on Every Scene  `WARNING`

Every `<section class="scene">` must have a `data-transition` attribute. Allowed values:

```
fade_in | fade_out | slide_up | slide_down | slide_left | slide_right
scale_in | scale_out | fast_scale_in | wipe | blur_crossfade
push_slide | zoom_through | none
```

**Default if omitted:** `fade_in`  
**Checkable condition:** `document.querySelectorAll('.scene:not([data-transition])').length === 0`

---

## R-CORE-05 · Scene ID Format and Uniqueness  `BLOCKING`

Each scene element must have:
- A unique `id` attribute
- Format: `scene_NN` (zero-padded, two digits minimum: `scene_01`, not `scene_1` or `scene01`)
- IDs must be sequential, starting from `scene_01`
- No scene ID may appear twice in the same document

**Checkable condition:**
```js
const ids = [...document.querySelectorAll('.scene')].map(s => s.id);
const expected = ids.map((_, i) => `scene_${String(i+1).padStart(2,'0')}`);
JSON.stringify(ids) === JSON.stringify(expected)
```

---

## R-CORE-06 · Scene Count Must Match Storyboard  `BLOCKING`

The number of `<section class="scene">` elements in `index.html` must equal `storyboard.scenes.length`.

**Checkable condition:** `document.querySelectorAll('.scene').length === storyboard.scenes.length`

**Violation:** Extra scenes, missing scenes, or placeholder scenes not in storyboard.

---

## R-CORE-07 · Asset Paths Must Be Relative and Local  `BLOCKING`

All asset references (`src`, `href`, `url()`) must use relative paths rooted at the `output/` directory.

```html
<!-- Correct -->
<img src="assets/logo.png">
<div style="background-image: url('assets/bg-hero.jpg')">

<!-- Violation — absolute path -->
<img src="./assets/logo.png">

<!-- Violation — external URL for assets -->
<img src="https://example.com/logo.png">
```

**Exceptions (external `http(s)` allowed only for these):**

1. GSAP 3.12.x from the approved CDN URL (see R-CORE-12), **or**
2. No other script/image/font URLs — fonts must not rely on remote CDNs for production render stability (see `rules/headless-rendering-stability.md`).

**Checkable condition:** No `src` or CSS `url()` containing `http://`, `https://`, or absolute OS paths — except the GSAP CDN entry per R-CORE-12. No `fonts.googleapis.com` / `fonts.gstatic.com` for offline-required projects.

---

## R-CORE-08 · Required Asset Files Must Exist  `BLOCKING`

Every asset path referenced in `index.html` must point to a file that actually exists in `output/assets/`. Missing assets cause blank frames in render.

**Pre-render check procedure:**
1. Extract all `src` attributes and CSS `url()` values from `index.html`
2. For each path, verify the file exists at that path relative to `output/`
3. If any file is missing → abort render → log `MISSING_ASSET` error

**Placeholder assets:** If an asset is marked `data-placeholder="true"`, render is allowed to proceed, but the render result must be marked `partial` in `render-report.json`.

---

## R-CORE-09 · Required Output Files  `BLOCKING` (delivery gate)

A completed HyperDirector run must produce the following files. Missing any of these is a delivery failure:

| File | Must Exist | Validated By |
|------|-----------|-------------|
| `output/index.html` | Yes | Composer |
| `output/preview.html` | Yes | Composer |
| `output/storyboard.json` | Yes | Storyboard Generator |
| `output/brief.json` | Yes | Brief Writer |
| `output/script.md` | Yes | Storyboard Generator |
| `output/DESIGN.md` | Yes | Visual Designer |
| `output/brand-used.json` | Yes | Reporter |
| `output/render-report.md` | Yes | Reporter |

`output/final.mp4` is required only when render was not skipped. If render was skipped, `render_result.status = "skipped"` must appear in `render-report.json`.

---

## R-CORE-10 · `preview.html` Must Be Independently Openable  `WARNING`

`preview.html` must open correctly when:
- The file is moved to a different directory
- No local server is running
- The user is offline

This means all CSS and JS must be inline or bundled. For assets over 50 KB, this rule is waived — document in `render-report.md` that preview requires asset files.

**Checkable condition:** Open `preview.html` by double-clicking (file:// protocol). No broken images, no JS errors, at least the first scene renders.

---

## R-CORE-11 · `index.html` Must Not Be Minified  `ADVISORY`

Output HTML must be human-readable. The following are forbidden in `index.html`:
- Removing line breaks between elements
- Removing semantic comments (`<!-- scene_01: hook -->`)
- Abbreviating ID and class names to hashes or single letters
- Inlining all CSS into a single unreadable style attribute

Minification is only permitted for `preview.html` (and even there, not required).

---

## R-CORE-12 · GSAP 3.12.x from CDN **or** `assets/gsap.min.js`  `BLOCKING`

Exactly **one** GSAP load. Choose one:

**Option A — default (clone-friendly preview):**

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
```

**Option B — offline / headless-stable (user-supplied file, not shipped in this repo):**

```html
<script src="assets/gsap.min.js"></script>
```

- Patch version may differ; minor must stay **12** (e.g. `3.12.5`, `3.12.7`).
- Do not add npm/import-map GSAP, a second duplicate script tag, or other animation libraries unless a template explicitly allows them.
- Obtain `gsap.min.js` from the official GSAP distribution; place it under `output/assets/` in real projects. Do not commit the binary into HyperDirector unless the repository policy explicitly allows it.

See also: `rules/headless-rendering-stability.md` (R-HRS-04).

---

## Quick Reference: Pre-Render Checklist

Run this checklist before issuing `npx hyperframes render`:

```
[ ] index.html opens in browser without JS errors
[ ] #composition has explicit pixel dimensions
[ ] Every .scene has data-duration and data-transition
[ ] sum(data-duration) == storyboard.total_duration
[ ] scene count in HTML == storyboard.scenes.length
[ ] All scene IDs are sequential scene_01...scene_NN
[ ] All asset paths are relative and files exist
[ ] window.__timelines registered (see gsap-deterministic-rules.md)
[ ] GSAP 3.12.x loaded once (CDN or assets/gsap.min.js) per R-CORE-12
[ ] output/DESIGN.md exists
[ ] output/storyboard.json exists and is valid JSON
```
