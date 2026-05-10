# HyperFrames Anti-Patterns

> A catalog of patterns that HyperDirector must detect and prevent.
> Each anti-pattern includes: symptom, root cause, fix reference, and severity.

---

## Category 1: Wrong Tool Expectations

### AP-01: Treating HyperDirector as a photorealistic video generator

**Symptom:** User asks for "真人口播", "Sora-style footage", "realistic product shots", "cinematic interview video".

**Root cause:** Confusing HyperDirector (HTML-based graphic video) with AI video generation tools (Sora, Runway, Pika, Veo, Kling).

**What to do:**
- Acknowledge the request
- Explain HyperDirector's actual capability
- Offer degraded alternatives: animated title cards + TTS + caption overlay
- If user insists on photorealistic content, refer them to appropriate tools

**Severity:** Critical — attempting to fulfill this request will produce fundamentally wrong output.

**Response template:**
> This request requires photorealistic video generation, which is outside HyperDirector's scope. HyperDirector creates HTML-based graphic videos with animated text, data visualization, and brand overlays. I can offer: animated script + captions + TTS narration + branded end card. For photorealistic footage, consider Sora / Runway / Pika / Kling.

---

### AP-02: Treating HyperDirector as a digital human lip-sync tool

**Symptom:** User asks for "数字人", "digital avatar speaking", "lip-sync to voiceover", "virtual presenter".

**Root cause:** Confusing HyperDirector with HeyGen Studio, Synthesia, D-ID, or 剪映数字人.

**What to do:** Explain HyperDirector uses TTS + caption overlay, not lip-synced avatars. Refer to HeyGen/Synthesia for lip-sync needs.

**Severity:** Critical.

---

### AP-03: Treating HyperDirector as a professional video editor

**Symptom:** User asks for multi-track timeline editing, complex color grading, audio mixing, frame-level cut editing.

**Root cause:** Confusing HyperDirector with Premiere Pro, DaVinci Resolve, or 剪映.

**What to do:** Explain HyperDirector produces editable HTML source that can feed into professional tools. For professional edit, use the HTML project as a starting point, not the final product.

**Severity:** High.

---

## Category 2: Workflow Violations

### AP-04: Jumping directly to HTML without brief/storyboard

**Symptom:** Agent generates `index.html` as the first output, with no `brief.json` or `storyboard.json`.

**Root cause:** Skipping the structured planning phase to appear faster.

**Why it fails:** Without a brief, the composition is guesswork. Without a storyboard, scene timing is arbitrary. The resulting HTML is not correctable via warm iteration.

**Fix:** Always generate in order: `brief.json` → `storyboard.json` → `DESIGN.md` → `index.html`.

**Severity:** High — makes all subsequent work unreliable.

---

### AP-05: Skipping preview before final render

**Symptom:** Running `npx hyperframes render --quality high` immediately after HTML generation, without preview step.

**Root cause:** Rushing to deliver output.

**Why it fails:** Silent errors (missing assets, wrong timeline key, zero-duration composition) only surface in preview. A failed high-quality render wastes significant time.

**Fix:** Always run draft render or preview before final render. See `upstream/hyperframes-command-patterns.md`.

**Severity:** High.

---

### AP-06: Full project rewrite during warm iteration

**Symptom:** When user says "change the CTA text", agent regenerates entire `index.html` from scratch.

**Root cause:** No scene location mechanism; agent defaults to full regeneration.

**Why it fails:** Destroys user's manual edits, resets timing choices, loses iterative improvements. Makes HyperDirector unusable for real production workflows.

**Fix:** Use meaningful element IDs + scene comments to locate and patch specific elements. Update `storyboard.json` in sync. See `upstream/hyperframes-agent-native-rules.md AN-08`.

**Severity:** Critical.

---

### AP-07: Claiming sample render as real render

**Symptom:** `render-report.md` says "Render completed: final.mp4" when `npx hyperframes render` was never executed.

**Root cause:** Agent writes positive output without verifying render actually occurred.

**Why it fails:** User believes they have a video file. They don't. This destroys trust.

**Fix:** Only write render success when CLI exit code is 0 and output file exists. See `upstream/hyperframes-command-patterns.md` fallback policy.

**Severity:** Critical.

---

## Category 3: GSAP and Composition Technical Violations

### AP-08: Timeline not paused

**Symptom:** `gsap.timeline()` without `{ paused: true }`.

**Root cause:** Common GSAP usage — timelines auto-play by default in GSAP, but HyperFrames requires paused timelines for frame-by-frame seeking.

**Why it fails:** HyperFrames renderer seeks the timeline frame by frame. An auto-playing timeline runs at wall-clock speed, causing incorrect frame capture.

**Fix:**
```javascript
// Wrong
const tl = gsap.timeline();

// Correct
const tl = gsap.timeline({ paused: true });
```

**Severity:** Critical — produces completely wrong render output.

---

### AP-09: Timeline not registered to window.__timelines

**Symptom:** GSAP timeline exists but is not assigned to `window.__timelines["<composition-id>"]`.

**Root cause:** Agent writes GSAP code without knowing the registration requirement.

**Why it fails:** HyperFrames renderer cannot find the timeline. Composition renders as static frame.

**Fix:**
```javascript
const tl = gsap.timeline({ paused: true });
// ... animations ...
window.__timelines = window.__timelines || {};
window.__timelines["my-composition"] = tl;
```

**Severity:** Critical.

---

### AP-10: Timeline key mismatch with data-composition-id

**Symptom:** HTML has `data-composition-id="product-demo"` but timeline registers as `window.__timelines["root"]`.

**Root cause:** Copy-paste from example without updating the key.

**Why it fails:** Silent failure — animations don't play, no error thrown.

**Fix:** The `window.__timelines` key must exactly equal the `data-composition-id` value.

**Severity:** Critical.

---

### AP-11: Using Math.random() for animation values

**Symptom:** `gsap.to("#el", { x: Math.random() * 100 })` in composition script.

**Root cause:** Agent adds "organic" randomness to make animations feel more natural.

**Why it fails:** Different random values on each render → different frames each time → non-reproducible video. Same project renders differently every time.

**Fix:** Use fixed values or seeded PRNG (mulberry32) with a seed stored in `brief.json`.

**Severity:** Critical.

---

### AP-12: Infinite repeat on timelines

**Symptom:** `gsap.timeline({ repeat: -1 })` or `.repeat(-1)` on any tween.

**Root cause:** Looping animations look good in browser but cause HyperFrames renderer to run forever.

**Why it fails:** Renderer never reaches end of composition. Render process hangs indefinitely.

**Fix:** Remove `repeat: -1`. If looping is needed for a section, repeat a fixed number of times within the composition duration.

**Severity:** Critical.

---

### AP-13: data-duration mismatch with storyboard timing

**Symptom:** `storyboard.json` says `"duration": 8` for scene 02, but `data-duration="5"` in HTML.

**Root cause:** HTML generation diverged from storyboard without QA check.

**Why it fails:** Scene exits early, overlapping with next scene. Visual rhythm is broken.

**Fix:** QA must verify that sum of `data-duration` values per scene matches `storyboard.json` scene durations.

**Severity:** High.

---

### AP-14: Animating video element dimensions directly

**Symptom:** `tl.to("#my-video", { width: 500, height: 280 })`.

**Root cause:** Natural GSAP usage — you'd animate any element this way.

**Why it fails:** Animating width/height/top/left on `<video>` elements causes Chrome to stop rendering video frames. Preview stutters or freezes.

**Fix:** Wrap video in a container div. Animate the wrapper. Video fills wrapper via CSS.

**Severity:** High.

---

### AP-15: Script controls media playback

**Symptom:** `document.getElementById("el-video").play()` or `audio.currentTime = 5` in composition script.

**Root cause:** Agent tries to sync media manually, not knowing HyperFrames handles this automatically.

**Why it fails:** Conflicts with framework's media synchronization. Causes desync, double-playback, or silence.

**Fix:** Remove all `play()`, `pause()`, `currentTime` assignments. Use `data-start`, `data-media-start`, `data-volume` attributes instead.

**Severity:** High.

---

### AP-16: Missing class="clip" on timed elements

**Symptom:** Elements with `data-start`/`data-duration` but no `class="clip"`.

**Root cause:** Agent generates timing attributes but forgets the required class.

**Why it fails:** Elements are always visible, ignoring timing. Scenes overlap.

**Fix:** Every element with `data-start` + `data-duration` must have `class="clip"`.

**Note:** `npx hyperframes lint` catches this — run lint before render.

**Severity:** High.

---

## Category 4: Template and Brand Violations

### AP-17: Template hardcoded to specific brand

**Symptom:** Template HTML contains hardcoded brand colors (`#38BDF8`), font names (`Inter`), or copy tied to a specific creator ("关注示例创作者" in a template meant to be generic).

**Root cause:** Template built for a specific brand and not generalized.

**Why it fails:** Template is not reusable. Other users get someone else's branding.

**Fix:** Templates must use CSS variables for all brand values. Brand kit values are injected at generation time.

```css
/* In template */
:root {
  --color-primary: var(--brand-primary, #111827);
  --color-accent: var(--brand-accent, #6366F1);
  --font-headline: var(--brand-font-headline, 'Inter');
}
```

**Severity:** Medium.

---

### AP-18: Unauthorized brand/IP replication

**Symptom:** User asks to "copy the style of [specific brand]", "replicate [YouTuber]'s intro", "make it look like [movie title]".

**Root cause:** User wants a visually similar output to existing IP.

**What to do:** Decline exact replication. Offer to create an original design with similar aesthetic direction (e.g., "dark cinematic style with white typography and minimal animations").

**Severity:** Medium — legal/compliance risk.

---

### AP-19: Dependency on external uncontrolled resources

**Symptom:** Composition loads fonts, images, or non-approved scripts from the network without an offline strategy; or uses a non-pinned GSAP URL.

```html
<!-- Risky — wrong major/minor and unpinned -->
<script src="https://cdn.jsdelivr.net/npm/gsap@3.x/dist/gsap.min.js"></script>
```

**Root cause:** Quick prototype approach; not suitable for reproducible rendering.

**Why it fails:** Remote resources may be unreachable in headless Chromium, Docker, CI, or WSL. Output may differ from preview.

**Fix:** Use **relative** assets for images/video/audio/fonts needed at render time. For GSAP, follow **R-CORE-12**: approved cdnjs **3.12.x** **or** user-supplied `assets/gsap.min.js` (same minor). Do not load duplicate GSAP. For typography, prefer system stacks or local `@font-face` — see `rules/headless-rendering-stability.md`.

**Severity:** Medium.

---

## Quick Reference: Anti-Pattern Severity Matrix

| Code | Anti-Pattern | Severity | Detectable by lint? |
|---|---|---|---|
| AP-01 | Wrong tool: photorealistic video | Critical | No — require capability check |
| AP-02 | Wrong tool: digital human | Critical | No |
| AP-03 | Wrong tool: professional editor | High | No |
| AP-04 | Skip brief/storyboard → HTML | High | No |
| AP-05 | Skip preview before render | High | No |
| AP-06 | Full rewrite on warm iteration | Critical | No |
| AP-07 | Fake render report | Critical | No |
| AP-08 | Timeline not paused | Critical | Yes (lint) |
| AP-09 | Timeline not registered | Critical | Yes (lint) |
| AP-10 | Timeline key mismatch | Critical | Yes (lint) |
| AP-11 | Math.random() in animation | Critical | Yes (lint/validate) |
| AP-12 | Infinite repeat | Critical | Yes (lint) |
| AP-13 | data-duration mismatch | High | Partial (QA check) |
| AP-14 | Animate video dimensions | High | No — runtime only |
| AP-15 | Script controls media | High | No — runtime only |
| AP-16 | Missing class="clip" | High | Yes (lint) |
| AP-17 | Hardcoded brand in template | Medium | No |
| AP-18 | Unauthorized IP replication | Medium | No |
| AP-19 | External CDN dependency | Medium | Partial |
