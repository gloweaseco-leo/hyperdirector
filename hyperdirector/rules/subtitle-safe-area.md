# Subtitle Safe Area Rules

> Referenced by: `prompts/04-visual-design.md`, `prompts/05-compose-hyperframes.md`, `prompts/06-qa-fixer.md`  
> These rules define where subtitles/captions may appear, at what size, and with what contrast. Violations cause captions to be cut off by platform UI, be unreadable on mobile, or fail accessibility standards.

---

## Platform UI Overlap Zones (Avoid)

Different platforms overlay their own UI over the video canvas. Content placed in these zones will be obscured on the platform even if visible in preview.

| Platform | Overlay Zone | CSS `bottom` range to avoid |
|----------|-------------|----------------------------|
| TikTok (9:16) | Username, caption, action buttons | bottom 0–22% |
| WeChat Channels (9:16) | Bottom bar + like/share buttons | bottom 0–18% |
| Instagram Reels (9:16) | Caption, username overlay | bottom 0–20% |
| YouTube Shorts (9:16) | Channel info, subscribe button | bottom 0–16% |
| Bilibili Story (9:16) | Danmaku area + bottom controls | bottom 0–15% |
| YouTube (16:9) | Progress bar | bottom 0–8% |
| LinkedIn (1:1) | Reactions, caption | bottom 0–15% |

**Default safe floor for 9:16 content:** `bottom: 22%` from canvas bottom (conservatively avoids all platforms).

---

## R-SUB-01 · Vertical Safe Zone — 9:16 Canvas  `BLOCKING`

For vertical (9:16) compositions, subtitles must stay within:

```
Top boundary:    no higher than 80% from bottom (captions must not enter top 20% of canvas)
Bottom boundary: no lower than 22% from bottom (avoids platform UI overlay)

Safe zone:  bottom 22% to bottom 80%
Preferred:  bottom 22% to bottom 35% (keeps captions below main content area)
```

**CSS implementation:**
```css
.subtitle {
  position: absolute;
  bottom: 22%;          /* minimum — never go below this */
  left: 50%;
  transform: translateX(-50%);
}
```

**Checkable condition:** Computed `bottom` value of `.subtitle` ≥ 22% of canvas height (= 422px on 1920px canvas).

**Lint error code:** `SUBTITLE_OUTSIDE_SAFE_ZONE`

---

## R-SUB-02 · Vertical Safe Zone — 16:9 Canvas  `BLOCKING`

For horizontal (16:9) compositions:

```
Top boundary:    no higher than 80% from bottom
Bottom boundary: no lower than 10% from bottom

Safe zone:  bottom 10% to bottom 80%
Preferred:  bottom 10% to bottom 20%
```

**CSS implementation:**
```css
.subtitle {
  position: absolute;
  bottom: 10%;
}
```

---

## R-SUB-03 · Vertical Safe Zone — 1:1 Canvas  `BLOCKING`

For square (1:1) compositions:

```
Top boundary:    no higher than 75% from bottom
Bottom boundary: no lower than 15% from bottom

Safe zone:  bottom 15% to bottom 75%
Preferred:  bottom 15% to bottom 25%
```

---

## R-SUB-04 · Maximum Line Count  `WARNING`

| Canvas | Max Lines Per Subtitle Block | Rationale |
|--------|---------------------------|-----------|
| 9:16 | 2 lines | Mobile reading distance, small screen |
| 16:9 | 2 lines | Consistent with broadcast standard |
| 1:1 | 2 lines | Prevents caption from dominating frame |

**Enforcement:**
```css
.subtitle {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
```

If the caption text requires more than 2 lines at the specified font size, the font size must be increased or the caption text shortened. Never overflow silently.

---

## R-SUB-05 · Minimum Font Size  `BLOCKING`

| Canvas | Minimum Caption Font Size | Context |
|--------|--------------------------|---------|
| 9:16 (1080×1920) | 20px / 1.85vw | Mobile primary view |
| 16:9 (1920×1080) | 24px / 1.25vw | TV / desktop |
| 1:1 (1080×1080) | 20px / 1.85vw | Feed view |

**Use vw units for responsive scaling:**
```css
.subtitle {
  font-size: clamp(20px, 1.85vw, 28px); /* 9:16 */
}
```

**Checkable condition:** Computed font size of `.subtitle` ≥ minimum for the canvas size.

---

## R-SUB-06 · Minimum Contrast Ratio  `BLOCKING`

Subtitle text must meet WCAG AA contrast requirements:

| Text Type | Minimum Contrast Ratio |
|-----------|----------------------|
| Normal text (< 18px) | 4.5:1 |
| Large text (≥ 18px or 14px bold) | 3.0:1 |

**Standard implementation (guaranteed to pass):**
```css
.subtitle {
  background: rgba(0, 0, 0, 0.65);  /* dark scrim */
  color: #FFFFFF;                    /* white text */
  /* Contrast ratio: white on rgba(0,0,0,0.65) ≈ 8.5:1 — passes AAA */
}
```

**Alternative for light-background brands:**
```css
.subtitle {
  background: rgba(255, 255, 255, 0.85);
  color: #111111;                    /* near-black on white ≈ 17:1 */
}
```

**Never use:**
- Brand accent color as subtitle background without contrast check
- Semi-transparent text on semi-transparent background
- Thin font weight (< 400) for captions

**Lint error code:** `CONTRAST_FAIL`

---

## R-SUB-07 · Subtitle Must Not Cover Primary Visual Content  `WARNING`

The subtitle element must not overlap the primary headline or key visual element in the same scene.

**Layout rule for 9:16:**
```
Primary content zone: top 5% to bottom 35%
Subtitle zone:        bottom 22% to bottom 35%
```

If these zones overlap (subtitle zone overlaps content zone), content must be repositioned upward. The subtitle zone takes priority — it cannot be moved below 22%.

**Check:** Visually inspect each scene. If the headline is positioned in the bottom 35% of the canvas, move it to the upper 65%.

---

## R-SUB-08 · CTA Scene Subtitle Rules  `WARNING`

The CTA scene (last scene, `purpose: "cta"`) has different rules:

- Subtitle may be replaced by a visible CTA button element
- If both subtitle and CTA button coexist, they must not overlap
- CTA button must be in the bottom 22%–40% zone
- CTA button height must be ≥ 48px (touch target minimum)
- Font size in CTA button: ≥ 18px

**Layout priority for CTA scene (9:16, bottom to top):**
```
0%–22%:   Platform UI (avoid)
22%–36%:  CTA button zone
36%–50%:  Subtitle / supporting text (if separate from CTA)
50%–95%:  Main headline and logo
```

---

## R-SUB-09 · Chinese–English Mixed Text Rendering  `ADVISORY`

When captions contain both Chinese and Latin characters (e.g., "使用 AI Agent 自动化"):

1. **Font must support both scripts.** Noto Sans SC covers CJK + Latin. PingFang SC covers both on Apple systems.
2. **Line height must be 1.5 or greater** to prevent CJK character clipping.
3. **Do not mix font weights within a single subtitle block.** Inconsistent weight rendering causes layout shift.
4. **Punctuation rule:** Chinese punctuation (。，、) should be set in the CJK font stack; Latin punctuation in the Latin stack. When mixing, use `font-family` order: CJK first, Latin fallback.

```css
.subtitle {
  font-family: 'Noto Sans SC', 'PingFang SC', 'Helvetica Neue', sans-serif;
  line-height: 1.5;
  font-weight: 400;
}
```

---

## R-SUB-10 · Subtitle Must Appear in Every Scene  `WARNING`

Every `<section class="scene">` must contain a `.subtitle` element, even if the caption is intentionally empty for a specific scene (in which case, hide it with `display: none` rather than omitting it).

```html
<!-- Scene with caption -->
<section id="scene_01" class="scene" data-duration="4">
  <div class="subtitle">以前它只会调用工具，现在它能导演视频。</div>
</section>

<!-- Scene with intentionally empty caption — element still required -->
<section id="scene_03" class="scene" data-duration="6">
  <div class="subtitle" style="display: none"></div>
</section>
```

**Rationale:** HyperFrames lint checks for `.subtitle` presence. An absent element causes `MISSING_SUBTITLE_ELEMENT` error even if no caption was intended.

**Lint error code:** `MISSING_SUBTITLE_ELEMENT`

---

## Subtitle Implementation Template

Copy this CSS block into every generated composition. Adjust values per DESIGN.md:

```css
/* Subtitle — 9:16 canvas */
.subtitle {
  position: absolute;
  bottom: 22%;
  left: 50%;
  transform: translateX(-50%);
  width: 88%;
  max-width: 88%;
  background: rgba(0, 0, 0, 0.65);
  color: #FFFFFF;
  font-family: 'Noto Sans SC', 'PingFang SC', sans-serif;
  font-size: clamp(20px, 1.85vw, 26px);
  font-weight: 400;
  line-height: 1.5;
  padding: 8px 16px;
  border-radius: 4px;
  text-align: center;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  z-index: 100;
}
```
