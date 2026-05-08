# HyperFrames Documentation Map

> Reference index for HyperDirector's upstream knowledge base.
> This file is the entry point for HyperDirector prompts, rules, templates, and QA layers.
> It summarizes — not reproduces — key lessons from HyperFrames official documentation.

---

## 1. Introduction

**Source:** https://hyperframes.mintlify.app/introduction.md

**Core positioning:**
- "Write HTML. Render video. Built for agents."
- HyperFrames is an open-source HTML-to-video framework created by HeyGen (Apache 2.0).
- Videos are defined as plain HTML with `data-*` attributes, then previewed and rendered to MP4/WebM.
- No proprietary DSL, no React, no GUI required — plain HTML is the source of truth.
- Designed for AI agents (Claude Code, Cursor, Codex, Gemini CLI) to author and iterate compositions.

**HyperDirector takeaway:**
HyperDirector must treat plain HTML as the canonical representation of any video. All templates, QA checks, and generated compositions must remain plain HTML + CSS + JS.

---

## 2. Quickstart

**Source:** https://hyperframes.mintlify.app/quickstart.md

**Core workflow:**
```bash
npx hyperframes init my-video   # scaffold project
npx hyperframes preview          # live browser preview
npx hyperframes render           # output MP4
```

**Requirements:** Node.js >= 22, FFmpeg.

**HyperDirector takeaway:**
The three-step chain (init → preview → render) is the minimum viable pipeline. HyperDirector must automate this chain and never skip the preview step before final render.

---

## 3. Prompting Guide

**Source:** https://hyperframes.mintlify.app/guides/prompting.md

**Slash commands available in Claude Code / Cursor:**
| Command | Purpose |
|---|---|
| `/hyperframes` | Composition authoring |
| `/hyperframes-cli` | CLI dev-loop tools |
| `/hyperframes-media` | Asset preprocessing (TTS, transcribe, remove-background) |
| `/hyperframes-registry` | Block installation via `hyperframes add` |
| `/website-to-hyperframes` | URL-to-video pipeline |
| `/gsap` | GSAP animation API |

**Two prompt shapes:**
- **Cold start** — Describe from scratch: duration, aspect ratio, mood/style, key elements.
- **Warm start** — Provide context (URL, doc, CSV, transcript) and ask agent to synthesize into video.

**Iteration model:**
After first render, iterate like a video editor ("Make the title 2x bigger", "Swap to dark mode"). Do not re-prompt from scratch — make targeted edits.

**Motion vocabulary → GSAP ease mapping:**
| Intent | GSAP ease |
|---|---|
| smooth | `power2.out` |
| snappy | `power4.out` |
| bouncy | `back.out` |
| dramatic | `expo.out` |

**Timing shorthand:** fast=0.2s (energy), medium=0.4s (professional), slow=0.6s (luxury), very slow=1–2s (cinematic).

**HyperDirector takeaway:**
- HyperDirector's prompts must use the warm-start pattern: always provide brief + storyboard as context before generating HTML.
- `brief.tone` maps to GSAP ease selection. `brand-kit.motion_language.pace` maps to timing shorthand.
- Iteration must be targeted edits, not full rewrites.

---

## 4. Claude Design / Coding Agent Workflow

**Source:** https://hyperframes.mintlify.app/guides/claude-design.md

**Workflow:**
1. Use Claude Design to produce a valid first draft with brand identity, scene content, animations.
2. Download the ZIP, open in coding agent with `npx hyperframes preview` running.
3. Refine iteratively with targeted prompts.

**HyperDirector takeaway:**
HyperDirector mirrors this pattern: first generate a structured brief/storyboard/DESIGN.md draft, then generate the HTML composition, then iterate. The "download ZIP + refine" step maps to HyperDirector's QA Fix Loop.

---

## 5. Compositions and Data Attributes

**Source:** https://hyperframes.mintlify.app/concepts/compositions.md, https://hyperframes.mintlify.app/concepts/data-attributes.md

**Root element structure:**
```html
<div id="root" data-composition-id="root"
     data-start="0" data-width="1920" data-height="1080">
  <!-- clips here -->
</div>
```

**Required data attributes:**
| Attribute | Required on | Purpose |
|---|---|---|
| `data-composition-id` | Root element | Unique ID; must match `window.__timelines` key |
| `data-start` | All timed elements | Start time in seconds |
| `data-duration` | All timed elements | Duration in seconds |
| `data-track-index` | All timed elements | Stacking order (higher = on top) |
| `data-width` / `data-height` | Composition root | Canvas size in pixels |

**Clip types:** `<video>`, `<img>`, `<audio>`, nested `<div data-composition-src>`.

**Two-layer rule:**
- HTML layer: declarative structure (what plays, when, on which track) — controlled by data attributes.
- Script layer: visual animation via GSAP only. **Scripts must never control media playback or clip visibility.**

**`class="clip"` rule:**
Any timed element (`data-start` + `data-duration`) must have `class="clip"`. Without it, the element is always visible and ignores timing.

**HyperDirector takeaway:**
Every generated HTML composition must include `class="clip"` on all timed elements. `data-duration` must match the `duration` field in `storyboard.json`. QA checks must validate this mapping.

---

## 6. GSAP Animation

**Source:** https://hyperframes.mintlify.app/guides/gsap-animation.md

**Critical rules:**
1. Timeline must be `{ paused: true }`.
2. Timeline must be registered: `window.__timelines["<composition-id>"] = tl;`
3. Timeline key must exactly match `data-composition-id` — mismatch causes silent animation failure.
4. Timeline duration must cover total video duration — extend with `tl.set({}, {}, DURATION)`.
5. No `Math.random()` — breaks determinism. Use seeded PRNG (e.g. mulberry32) if pseudo-random needed.
6. No `async`/`await` or `fetch()` during GSAP timeline construction.
7. Never animate `width`/`height`/`top`/`left` directly on `<video>` elements — wrap in a container div.

**Add entrance animations to every scene** — elements appearing without animation feel broken in video.
**Add transitions between scenes** — jump cuts are almost always unintentional in composed video.

**HyperDirector takeaway:**
All six rules above are hard constraints for QA. The `05-qa-fixer.md` prompt must check each one. Template HTML must demonstrate correct timeline registration.

---

## 7. Rendering

**Source:** https://hyperframes.mintlify.app/guides/rendering.md

**Local render:**
```bash
npx hyperframes render                    # default quality
npx hyperframes render --quality draft    # fast iteration
npx hyperframes render --quality high     # final delivery
npx hyperframes render --output final.mp4
```

**Docker render:**
```bash
docker run --rm -v "$(pwd):/workspace" hyperframes/render
```

**Quality levels:**
| Quality | Use for |
|---|---|
| `draft` | Fast iteration |
| `standard` | Review and feedback |
| `high` | Final delivery |

**Dependencies:** Node.js >= 22, FFmpeg, Chromium (headless browser for DOM capture).

**HyperDirector takeaway:**
- v0.1 uses local render only. Docker is v0.2. Cloud render is v0.3.
- HyperDirector must always use `--quality draft` first, then `--quality high` after QA passes.
- If HyperFrames CLI is not installed, HyperDirector outputs HTML/storyboard/DESIGN.md only and does not claim video has been rendered.

---

## 8. Catalog / Components

**Source:** https://hyperframes.mintlify.app/examples.md, catalog blocks

**Available built-in blocks (selected):**
- Transitions: blur, push, cover, destruction, dissolve, distortion, grid, light, mechanical, radial, scale
- Shader transitions: Cross Warp Morph, Whip Pan, Glitch, Cinematic Zoom, Light Leak, Ridged Burn
- Overlays: Instagram Follow, TikTok Follow, YouTube Lower Third, X Post Card, Spotify Now Playing
- Data viz: Data Chart (animated bar + line), Flowchart (SVG connectors)
- VFX: Liquid Background, Liquid Glass, Portal, Shatter, VFX Text Cursor
- Logo: Logo Outro (cinematic reveal with glow)

**Registry command:**
```bash
npx hyperframes add <block-name>
```

**HyperDirector takeaway:**
Templates should reference available blocks and transitions by name. The `03-visual-design.md` prompt can suggest specific blocks based on video style. QA should not reinvent effects that already exist in the catalog.

---

## 9. Troubleshooting / Performance

**Source:** https://hyperframes.mintlify.app/guides/troubleshooting.md, https://hyperframes.mintlify.app/guides/performance.md

**Most common failure causes:**
1. Animating `<video>` element dimensions directly → wrap in container
2. Calling `video.play()` / `audio.currentTime` in scripts → framework owns media playback
3. Composition duration shorter than video → extend with `tl.set({}, {}, DURATION)`
4. Missing `class="clip"` on timed elements → always visible, timing ignored
5. `window.__timelines` key mismatch → silent animation failure
6. Oversized source images → resize to max 2x canvas dimensions

**Performance guidelines:**
- Images: max 2× canvas resolution (3840×2160 for 1080p canvas)
- `backdrop-filter: blur()`: max 2–3 layers per region, max radius 64px
- Avoid 4K / 60fps unless required — defaults (1920×1080, 30fps) render fast

**Debugging checklist:**
1. `npx hyperframes lint` — structural issues
2. `npx hyperframes validate` — runtime errors (JS exceptions, missing assets, contrast)
3. Check `window.__timelines` key matches `data-composition-id`
4. Check timeline is long enough (`tl.set({}, {}, DURATION)`)
5. Open browser console for `[Browser:ERROR]` messages

**HyperDirector takeaway:**
The QA Fix Loop (`05-qa-fixer.md`) must run `lint` → `validate` → check timeline length → check key match → check media control. Each failure maps to a specific fix pattern in `rules/common-errors-fix.md`.

---

## Document Index Reference

Full documentation index: https://hyperframes.mintlify.app/llms.txt

Key pages for HyperDirector rules development:
- `guides/prompting.md` — warm/cold start patterns
- `guides/gsap-animation.md` — timeline rules
- `guides/common-mistakes.md` — failure patterns
- `guides/rendering.md` — render workflow
- `concepts/compositions.md` — HTML structure
- `concepts/data-attributes.md` — timing attributes
- `reference/html-schema.md` — full attribute reference
- `guides/performance.md` — optimization constraints
