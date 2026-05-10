# GSAP Deterministic Animation Rules

> Referenced by: `prompts/05-compose-hyperframes.md`, `prompts/06-qa-fixer.md`  
> These rules exist because HyperFrames renders by advancing a controlled GSAP timeline frame-by-frame. Any non-deterministic or uncontrolled animation breaks the render pipeline.

---

## Rule Classification

| Level | Meaning |
|-------|---------|
| **BLOCKING** | Render will produce wrong output or fail entirely. No exceptions. |
| **WARNING** | May cause frame drops, drift, or visual inconsistency. Fix recommended. |
| **ADVISORY** | Prevents subtle reproducibility issues. Strongly recommended. |

---

## R-GSAP-01 · Timeline Must Be Paused on Creation  `BLOCKING`

Every GSAP timeline in the composition must be created with `{ paused: true }`. A timeline that auto-plays will run before HyperFrames takes control, causing the render to capture a partially advanced animation state.

```js
// Correct
const tl = gsap.timeline({ paused: true });

// Violation — auto-plays immediately
const tl = gsap.timeline();

// Violation — even if play() is called later, creation must be paused
const tl = gsap.timeline();
tl.play(); // still wrong
```

**Checkable condition:** Every `gsap.timeline(` call in `index.html` includes `paused: true` in its vars object.

**Lint error code:** `TIMELINE_NOT_PAUSED`

---

## R-GSAP-02 · Timeline Must Be Registered to `window.__timelines`  `BLOCKING`

HyperFrames CLI discovers and controls timelines via `window.__timelines`. Any timeline not registered here is invisible to the renderer and will not be included in the render output.

```js
// Required pattern — must appear after the last tl definition
window.__timelines = window.__timelines || [];
window.__timelines.push(tl);
```

**Rules:**
- Initialize with `window.__timelines = window.__timelines || []` to support multi-timeline compositions
- Push every named timeline (even secondary timelines for specific effects)
- Do not push the same timeline twice
- Do not use a different property name (e.g., `window.timelines`, `window._tl`)

**Checkable condition:** `window.__timelines` exists after page load and `window.__timelines.length >= 1`

**Lint error code:** `MISSING_TIMELINE_REGISTRATION`

---

## R-GSAP-03 · Timeline Key Must Align With Composition ID  `ADVISORY`

For multi-timeline compositions, each timeline should be identifiable. Use a descriptive key when pushing:

```js
// Preferred for multi-timeline compositions
window.__timelines = window.__timelines || [];
window.__timelines.push({ id: 'main', timeline: tl });
window.__timelines.push({ id: 'scene_04_effect', timeline: tlEffect });
```

For single-timeline compositions (standard case), a bare push is acceptable:
```js
window.__timelines.push(tl);
```

**Do not use auto-generated IDs** like `tl_${Math.random()}`. IDs must be static strings.

---

## R-GSAP-04 · No `Math.random()` in Animation Code  `BLOCKING`

`Math.random()` produces a different value on every call. In a frame-by-frame render, this causes visual drift between preview and final render, and makes the output non-reproducible.

**Violations:**
```js
gsap.to('.dot', { x: Math.random() * 100 });     // BLOCKING
gsap.to('.el', { opacity: Math.random() });        // BLOCKING
gsap.set('.item', { rotation: Math.random() * 360 }); // BLOCKING
```

**Approved replacement — mulberry32 seeded PRNG:**
```js
// Fixed seed — use a constant derived from brief.title or just 42
function mulberry32(seed) {
  return function() {
    seed |= 0; seed = seed + 0x6D2B79F5 | 0;
    let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(42); // seed is fixed — same output every run

gsap.to('.dot', { x: rand() * 100 });  // deterministic
```

**Checkable condition:** `index.html` source does not contain the literal string `Math.random`

**Lint error code:** `MATH_RANDOM_DETECTED`

---

## R-GSAP-05 · No Infinite Repeat Animations  `BLOCKING`

`repeat: -1` (infinite loop) causes HyperFrames to never reach the end of the timeline, hanging the render process.

**Violations:**
```js
gsap.to('.spinner', { rotation: 360, repeat: -1 });       // BLOCKING
gsap.to('.pulse', { scale: 1.1, repeat: -1, yoyo: true }); // BLOCKING
tl.to('.el', { opacity: 0, repeat: -1 });                  // BLOCKING
```

**Approved replacement:**
```js
// Cap repeat to a finite count that fits within the scene duration
gsap.to('.spinner', { rotation: 360, duration: 2, repeat: 2 }); // runs 3 times = 6s max
gsap.to('.pulse', { scale: 1.1, duration: 0.4, repeat: 3, yoyo: true }); // 4 pulses
```

**Rule:** `repeat` value must be 0 or a positive integer. `-1` is forbidden everywhere in the composition.

**`yoyo: true` without `repeat`** is allowed (it has no effect without repeat).

**Checkable condition:** `index.html` source does not contain `repeat: -1` or `repeat:-1`

**Lint error code:** `INFINITE_REPEAT_DETECTED`

---

## R-GSAP-06 · Scene Duration in Timeline Must Match `data-duration`  `BLOCKING`

The GSAP timeline's total duration for each scene's animation block must not exceed the scene's `data-duration` value. Animations that run longer than the scene cut point will be clipped or cause frame drift.

**Calculation rule:**
```
scene_animation_end_time <= scene.data-duration - 0.1s (buffer for exit transition)
```

**Example — scene_02 with data-duration="8":**
```js
// Correct — animations end by 7.7s, 0.3s exit fade
tl.from('#scene_02 .headline', { opacity: 0, duration: 0.4 }, 'scene02')
  .from('#scene_02 .caption', { opacity: 0, duration: 0.3 }, 'scene02+=0.3')
  .to('#scene_02', { opacity: 0, duration: 0.3 }, 'scene02+=7.4');

// Violation — animation ends at 9s, exceeds 8s data-duration
tl.from('#scene_02 .content', { opacity: 0, duration: 9 }, 'scene02');
```

**Checkable condition:** For each scene, the latest tween end time within that scene's label block must be ≤ `data-duration`.

---

## R-GSAP-07 · No `setTimeout` or `setInterval` for Animation Timing  `BLOCKING`

`setTimeout` and `setInterval` run in wall-clock time, not GSAP timeline time. In a headless render environment, they do not fire at predictable intervals relative to the frame capture position.

**Violations:**
```js
setTimeout(() => gsap.to('.el', { opacity: 1 }), 2000); // BLOCKING
setInterval(() => gsap.to('.dot', { y: '-=10' }), 500); // BLOCKING
```

**Approved replacement:** Use GSAP's `delay` parameter or timeline labels:
```js
tl.to('.el', { opacity: 1, delay: 2 });          // correct
tl.to('.dot', { y: '-=10' }, '+=0.5');           // correct
```

**Checkable condition:** `index.html` source does not contain `setTimeout(` or `setInterval(` outside of comments.

**Lint error code:** `SETTIMEOUT_IN_ANIMATION`

---

## R-GSAP-08 · No `Date.now()` or `performance.now()` for Timing  `BLOCKING`

These APIs return wall-clock time. Using them to gate or drive animations makes render output time-dependent.

**Violations:**
```js
const start = Date.now();
requestAnimationFrame(function tick() {
  const elapsed = Date.now() - start;
  gsap.set('.el', { x: elapsed * 0.1 });
  requestAnimationFrame(tick);
});
```

**Approved replacement:** GSAP ticker or timeline `onUpdate`:
```js
tl.to('.el', { x: 100, duration: 1 }); // time controlled by GSAP
```

**Checkable condition:** `index.html` source does not use `Date.now()` or `performance.now()` in animation logic.

---

## R-GSAP-09 · CSS `transform` Used for Layout vs GSAP `scale` / `x` / `y`  `WARNING`

Many templates centre subtitles with CSS such as `left: 50%` plus `transform: translateX(-50%)`. GSAP tweens that set `scale`, `x`, `y`, or a full `transform` string on the **same element** can replace the CSS transform matrix and break horizontal centring or baseline alignment.

**Prefer for captions, primary headlines, and CTA copy:**
- `opacity`, `y` (small pixel shifts), `filter` (e.g. blur), or `clipPath` patterns that do not fight the CSS centre transform.

**If `scale` entrance is required on decorative elements only:** target a **wrapper** that does not use CSS `translate` centring, or animate children that are not positioned with `transform`.

**Fallback:** If a complex tween causes visible misalignment, reduce to opacity/y-only on that layer rather than rewriting the whole timeline.

**See also:** `rules/headless-rendering-stability.md` (R-HRS-05).

---

## R-GSAP-10 · Media Elements Must Be Muted and Controlled by GSAP  `WARNING`

If `<video>` or `<audio>` elements are used in the composition:
- They must have the `muted` attribute (prevents autoplay block in headless browser)
- They must not have `autoplay` as a standalone attribute
- Their playback must be controlled via GSAP's `HTMLVideoElement` plugin or timeline callbacks — not native `play()`/`pause()` calls

```html
<!-- Correct -->
<video id="bg-video" src="assets/bg-loop.mp4" muted playsinline preload="auto"></video>

<!-- Violation — uncontrolled autoplay -->
<video src="assets/bg-loop.mp4" autoplay loop></video>
```

**Note:** In HyperDirector v0.1, avoid `<video>` elements unless explicitly required by the brief. Use static images as backgrounds instead.

---

## R-GSAP-11 · All Animations Must Be Reproducible  `BLOCKING` (summary rule)

Same `index.html` + same HyperFrames version = identical frame output every time. This is the master constraint that all preceding rules exist to enforce.

**Reproducibility checklist:**
```
[ ] No Math.random()
[ ] No Date.now() / performance.now() for animation
[ ] No setTimeout / setInterval
[ ] No repeat: -1
[ ] Timeline is paused: true
[ ] Timeline registered to window.__timelines
[ ] Scene animation durations fit within data-duration
[ ] No external API calls or dynamic data fetches
[ ] No CSS animations with random() or env()
[ ] GSAP version pinned to 3.12.x
[ ] Readable layers avoid GSAP `scale` fighting CSS `translate` centring (R-GSAP-09)
```

---

## Quick Diagnostic: GSAP Rule Violations

To check for the most common GSAP violations in a generated file, search for these strings:

| String to Search | Rule Violated |
|-----------------|---------------|
| `Math.random` | R-GSAP-04 |
| `repeat: -1` | R-GSAP-05 |
| `setTimeout(` | R-GSAP-07 |
| `setInterval(` | R-GSAP-07 |
| `Date.now()` | R-GSAP-08 |
| `performance.now()` | R-GSAP-08 |
| `gsap.timeline()` (without `paused`) | R-GSAP-01 |
| `autoplay` on `<video>` | R-GSAP-10 |
| `loop` on `<video>` | R-GSAP-10 |
| `scale` tween on subtitle/title with CSS `translate` centre | R-GSAP-09 |
