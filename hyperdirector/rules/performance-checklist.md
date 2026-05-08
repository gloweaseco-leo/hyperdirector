# Performance Checklist

> Referenced by: `prompts/05-compose-hyperframes.md`, `prompts/06-qa-fixer.md`  
> Poor performance causes dropped frames in render, blank frames in preview, and `partial` render status. Run this checklist before issuing any render command.

---

## Why Performance Matters in HyperFrames

HyperFrames renders by running `index.html` in a headless Chromium browser and capturing frames at a target FPS (typically 30 fps). If the browser cannot paint a frame within the capture interval, the frame is dropped, resulting in:
- Stuttering in `final.mp4`
- Black or blank frames at scene transitions
- Render duration shorter than `brief.duration_seconds`
- `render_result.status: "partial"` in `render-report.json`

---

## Image Asset Rules

### P-IMG-01 · Maximum Image Dimensions  `BLOCKING for render quality`

| Usage | Max Resolution | Format |
|-------|---------------|--------|
| Full-bleed background (9:16) | 1080 × 1920px | JPEG (quality 85) |
| Full-bleed background (16:9) | 1920 × 1080px | JPEG (quality 85) |
| Product screenshot / UI overlay | 800 × 600px | PNG (optimize) |
| Logo | 400 × 400px | PNG (transparent) or SVG |
| Icons / decorative graphics | 200 × 200px | SVG preferred |
| Thumbnail / small illustrations | 400 × 400px | PNG or WebP |

**Rule:** Do not embed images larger than 2× the display size. A 100px wide image element does not need a 4000px wide source file.

**Checkable condition:** For each `<img>` or `background-image`, the source file dimensions must be ≤ 2× the element's rendered dimensions.

### P-IMG-02 · Maximum Total Asset Size  `WARNING`

Total size of all files in `output/assets/` must not exceed **50 MB** for a standard composition.

| Category | Limit | Action if Exceeded |
|----------|-------|-------------------|
| Single image | 3 MB | Compress to JPEG q80 or downscale |
| Single video clip | 20 MB | Trim, downscale to 720p, or replace with still |
| Total assets | 50 MB | Remove unused assets, compress images |

**Checkable condition:** Run `Get-ChildItem output/assets/ -Recurse | Measure-Object -Property Length -Sum` and verify sum ≤ 50 MB.

### P-IMG-03 · Use JPEG for Photos, PNG for Graphics, SVG for Icons  `ADVISORY`

| Content Type | Format | Reason |
|-------------|--------|--------|
| Photographs, screenshots with gradients | JPEG q80–85 | Smaller file, acceptable quality |
| Graphics with transparency, logos | PNG (optimized) | Lossless transparency |
| Simple shapes, icons, decorations | SVG | Infinitely scalable, tiny file |
| Any asset where JPEG/PNG > 500 KB | WebP | 30–50% smaller than JPEG |

---

## Video Asset Rules

### P-VID-01 · Background Videos Must Be Short and Muted  `WARNING`

If video clips are used as backgrounds:
- Maximum clip duration: `scene.duration + 1s` (slight buffer for loop point)
- Resolution: 720p maximum (1280×720 for 16:9, 720×1280 for 9:16)
- Must have `muted` attribute — no audio on background videos
- Bitrate: ≤ 2 Mbps for background clips

**Preferred alternative:** Use a still image with CSS animation (parallax, subtle zoom) instead of a video clip. This eliminates video decode overhead in the headless renderer.

### P-VID-02 · No Video Clips in the First Scene  `ADVISORY`

The first scene must render instantly. Video decode startup latency causes frame drops at render start. Use a static image or pure CSS/GSAP animation in `scene_01`.

---

## CSS Filter and Effect Rules

### P-CSS-01 · Limit CSS Filter Stacking  `WARNING`

CSS filters (`filter: blur()`, `filter: drop-shadow()`, `filter: brightness()`) are GPU-intensive in a headless browser.

**Limit per composition:**
- Maximum 2 elements with `filter` active simultaneously
- `blur()` values ≤ 8px (higher values cause severe slowdown)
- Do not apply `filter` to full-canvas elements (e.g., `#composition { filter: blur(2px) }`)

```css
/* Acceptable */
.logo { filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3)); }

/* Violation — blur on large element */
.scene-background { filter: blur(20px); width: 100%; height: 100%; }
```

### P-CSS-02 · No `backdrop-filter` in Render Context  `WARNING`

`backdrop-filter` is not reliably supported in all headless Chromium versions used by HyperFrames. Avoid it. Use a semi-transparent `background-color` instead:

```css
/* Instead of this */
.subtitle { backdrop-filter: blur(8px); }

/* Use this */
.subtitle { background: rgba(0, 0, 0, 0.65); }
```

### P-CSS-03 · Limit `box-shadow` and `text-shadow` Complexity  `ADVISORY`

- Maximum 2 `box-shadow` layers per element
- Maximum 1 `text-shadow` per element
- Shadow blur radius ≤ 20px for text, ≤ 30px for containers

---

## DOM Complexity Rules

### P-DOM-01 · Maximum DOM Nodes Per Composition  `WARNING`

| Metric | Limit | Action if Exceeded |
|--------|-------|-------------------|
| Total DOM elements | 500 | Split into fewer scenes |
| Elements per scene | 60 | Simplify layout, use CSS instead of extra divs |
| GSAP-animated elements | 50 per scene | Batch animations, reduce stagger targets |

**Checkable condition:** `document.querySelectorAll('*').length < 500`

### P-DOM-02 · No Runtime DOM Manipulation During Scene Render  `BLOCKING`

Do not use JavaScript to dynamically create elements during the animation timeline:

```js
// Violation — creates new DOM nodes during render
tl.call(() => {
  const div = document.createElement('div');
  document.body.appendChild(div);
});

// Correct — all elements pre-exist in HTML; only visibility is animated
tl.to('#scene_02 .content', { opacity: 1 });
```

All elements that will appear in the video must exist in the HTML at load time. They may be invisible initially (`opacity: 0`, `display: none`), but they must exist.

### P-DOM-03 · Pre-render All Hidden Elements at Correct Final Position  `ADVISORY`

Elements animated into view should be initialized at their final position with opacity 0, not at an offset position. This prevents layout reflow during animation:

```js
// Preferred
gsap.set('#scene_02 .headline', { opacity: 0 });
tl.to('#scene_02 .headline', { opacity: 1, duration: 0.4 });

// Less preferred (causes layout reflow on large offsets)
tl.from('#scene_02 .headline', { opacity: 0, y: -200, duration: 0.4 });
```

---

## Pre-Render Resource Verification

### P-CHECK-01 · Asset Existence Check  `BLOCKING`

Before running `npx hyperframes render`, verify:

```powershell
# PowerShell — verify all asset references in index.html exist on disk
$html = Get-Content output/index.html -Raw
$refs = [regex]::Matches($html, 'src="(assets/[^"]+)"') | ForEach-Object { $_.Groups[1].Value }
foreach ($ref in $refs) {
  if (-not (Test-Path "output/$ref")) {
    Write-Host "MISSING: $ref"
  }
}
```

Run this and confirm zero missing files before render.

### P-CHECK-02 · Image Dimension Check (advisory)

Before render, for each image in `assets/`, verify that its pixel dimensions are within the limits in P-IMG-01. Oversized images are the most common cause of render slowdown.

---

## Draft vs. Final Render Differences

| Setting | Draft (`--quality draft`) | Final (`--quality high`) |
|---------|--------------------------|-------------------------|
| FPS | 15 fps | 30 fps |
| Resolution | 50% of canvas | 100% of canvas |
| Encoder | fast preset | slow preset |
| Typical render time | 10–30s | 60–300s |
| Purpose | QA iteration — verify scene structure | Delivery output |

**Rule:** Always run draft render first during QA (Stage 06). Only run final render after lint and draft both pass.

```
npx hyperframes render output/index.html --quality draft --output output/preview-draft.mp4
# verify visually, then:
npx hyperframes render output/index.html --quality high --output output/final.mp4
```

---

## Performance Checklist Summary

Run before every render:

```
[ ] All images ≤ 3 MB individually
[ ] Total assets/ size ≤ 50 MB
[ ] No CSS filter blur > 8px on large elements
[ ] No backdrop-filter
[ ] DOM node count < 500
[ ] No dynamic DOM creation in timeline callbacks
[ ] All referenced asset files exist on disk
[ ] Background video clips ≤ 720p and muted
[ ] Draft render passed before triggering final render
[ ] No image used at more than 2× its display size
```
