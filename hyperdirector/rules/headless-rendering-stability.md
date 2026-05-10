# Headless & Offline Rendering Stability

> Referenced by: `SKILL.md`, `AGENTS.md`, `qa/pre-render-checklist.md`, `docs/rendering-stability.zh-CN.md`  
> Scope: reproducible preview vs render in Chromium headless, WSL/Linux, and offline environments.  
> This file does **not** replace HyperFrames lint — it adds HyperDirector-specific reliability constraints.

---

## Rule Classification

| Level | Meaning |
|-------|---------|
| **BLOCKING** | Same meaning as `hyperframes-core-rules.md` when cross-referenced. |
| **WARNING** | May cause missing glyphs, layout drift, or preview/render mismatch. |
| **ADVISORY** | Best practice for production; document in `DESIGN.md` if skipped. |

---

## R-HRS-01 · Do Not Rely on Remote Fonts for Production Render Path  `WARNING`

Google Fonts, `fonts.gstatic.com`, or other network font CSS must **not** be the only way to obtain correct CJK (or brand) glyphs for compositions that must render in CI, Docker, WSL, or air-gapped environments.

**Recommended:**
- Use a **system font stack** with explicit CJK fallbacks (e.g. `PingFang SC`, `Microsoft YaHei`, `Noto Sans CJK SC`, `sans-serif`).
- For pixel-predictable branding, ship **licensed font files** in `output/assets/` and load via `@font-face` with **relative** `url('assets/...')` — do not commit font binaries into this repository unless the repo license explicitly allows it.

**Checkable condition:** No `fonts.googleapis.com` / `fonts.gstatic.com` in `index.html` for projects that declare offline/headless render requirements.

---

## R-HRS-02 · Emoji and Icon Stability  `WARNING`

Do not depend on **emoji** for core storytelling, icons, or data labels in the composition. Headless Chromium and Linux environments often render emoji as tofu, boxes, or inconsistent glyphs.

**Preferred:** short text labels, Unicode geometric shapes already used in templates, **inline SVG**, or `assets/*.svg`.

---

## R-HRS-03 · `@media` Must Not Change `#composition` Internals  `BLOCKING` (for templates in this pack)

`@media` rules may adjust **outer** page chrome only (e.g. `body` padding, margins around the canvas). They must **not** change:

- `#composition` width/height in px  
- font sizes inside the canvas for headline, subtitle, or primary cards  
- positions of scene-critical elements  

**Why:** fixed-frame render uses the canonical pixel canvas; viewport-based breakpoints can make **preview** diverge from **render**.

---

## R-HRS-04 · GSAP Loading: CDN or Local `assets/gsap.min.js`  `BLOCKING` (see R-CORE-12)

GSAP **3.12.x** must load from **exactly one** of:

1. Approved CDN URL (default in templates — clone-friendly), or  
2. `assets/gsap.min.js` relative to the composition (user-supplied file; **not** shipped in this repo).

Do not load two copies of GSAP.

---

## R-HRS-05 · GSAP vs CSS `transform` for Readable Layers  `WARNING`

Elements centred with CSS `transform: translate(...)` (e.g. `.subtitle`) are sensitive to GSAP tweens that set `scale`, `x`, `y`, or `transform` — GSAP may overwrite the CSS matrix. Prefer `opacity`, `y` (with layout awareness), or `filter` for subtitles and primary titles. Details: `rules/gsap-deterministic-rules.md` (R-GSAP-09).

---

## R-HRS-06 · Examples Under `examples/**/output/`  `ADVISORY`

Sample `index.html` files may contain historical patterns (e.g. remote fonts). They illustrate structure only — **not** the recommended production path. Prefer the rules in this file and the current `templates/*/template.html` bases.

---

## Optional Heuristic Check

```bash
node hyperdirector/scripts/check-composition-hazards.js path/to/index.html
```

This script emits **warnings only**; it is **not** HyperFrames lint. See `qa/pre-render-checklist.md`.
