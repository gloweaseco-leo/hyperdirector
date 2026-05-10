# Common Errors and Fix Strategies

> Referenced by: `prompts/06-qa-fixer.md`  
> Each entry follows the format: **Error → Diagnosis → Exact Fix → Verification**.  
> This is a lookup table, not a tutorial. Go directly to the error you see.

---

## ERR-01 · `MISSING_TIMELINE_REGISTRATION`

**Symptom:** HyperFrames lint reports `MISSING_TIMELINE_REGISTRATION`. Preview plays nothing. Render produces a static black frame.

**Diagnosis:** The GSAP timeline was created but never pushed to `window.__timelines`. HyperFrames cannot find it.

**Fix:**
```js
// Locate the timeline creation (search for "gsap.timeline")
// Add these lines immediately after the last tl definition:

window.__timelines = window.__timelines || [];
window.__timelines.push(tl);
```

Place this before the closing `</script>` tag, after all tween definitions.

**Verification:** Open browser console → `window.__timelines` → should return an array with at least 1 item. `window.__timelines[0].totalDuration()` should return the expected composition duration.

---

## ERR-02 · `TIMELINE_NOT_PAUSED`

**Symptom:** HyperFrames lint reports `TIMELINE_NOT_PAUSED`. Preview shows animation completing before render starts; render output is fully faded out or shows end state.

**Diagnosis:** `gsap.timeline()` was called without `{ paused: true }`.

**Fix:** Find and update the timeline creation line:
```js
// Before
const tl = gsap.timeline();

// After
const tl = gsap.timeline({ paused: true });
```

If there are multiple timeline creations, fix all of them.

**Verification:** `window.__timelines[0].paused()` → must return `true`.

---

## ERR-03 · `DURATION_MISMATCH`

**Symptom:** Lint reports `DURATION_MISMATCH` with a scene ID, showing two different values: the HTML `data-duration` and the storyboard expected value.

**Diagnosis:** The `data-duration` attribute on a `<section>` was set incorrectly, or the storyboard was updated after the HTML was generated.

**Fix:** Correct the `data-duration` attribute on the affected scene to match `storyboard.json`:
```html
<!-- storyboard.json says scene_03 duration is 8 -->
<!-- Before (wrong) -->
<section id="scene_03" class="scene" data-duration="10" ...>

<!-- After (correct) -->
<section id="scene_03" class="scene" data-duration="8" ...>
```

After fixing, verify the sum: `sum(all data-duration values)` must equal `storyboard.total_duration`.

If fixing one scene makes the sum incorrect, adjust the longest middle scene by the difference (e.g., if you reduced scene_03 from 10 to 8, add 2s to scene_04 or scene_05 — do not adjust hook or CTA scenes).

**Verification:** Browser console: `[...document.querySelectorAll('.scene')].reduce((s, el) => s + parseFloat(el.dataset.duration), 0)` must equal `storyboard.total_duration`.

---

## ERR-04 · `SUBTITLE_OUTSIDE_SAFE_ZONE`

**Symptom:** Lint reports `SUBTITLE_OUTSIDE_SAFE_ZONE`. On 9:16 video, captions are hidden by platform UI (share bar, username overlay) on TikTok or WeChat.

**Diagnosis:** `.subtitle` CSS `bottom` value is below the safe threshold for the canvas aspect ratio.

**Fix:** Update the `.subtitle` `bottom` value in the CSS block:
```css
/* 9:16 canvas — set to 22% minimum */
.subtitle {
  bottom: 22%;  /* was: 10% or less */
}

/* 16:9 canvas — set to 10% minimum */
.subtitle {
  bottom: 10%;
}
```

If the subtitle now overlaps the main headline, move the headline upward (do not compromise the safe zone to avoid overlap).

**Verification:** Computed `bottom` of `.subtitle` ≥ 22% of canvas height on 9:16. On a 1920px canvas: `22% × 1920 = 422px` — element bottom edge must be ≥ 422px from canvas bottom.

---

## ERR-05 · `MISSING_ASSET` / Asset Path Error

**Symptom:** Preview shows broken image icon (`<img>` fails to load). Browser console shows `Failed to load resource: net::ERR_FILE_NOT_FOUND`. Render shows blank space where an image should be.

**Diagnosis:** The file referenced in `src` or CSS `url()` does not exist at the specified path relative to `output/`.

**Fix — Step 1: Identify the broken reference:**
```
Browser console → Network tab → filter by status 404
```

**Fix — Step 2: Determine if the asset exists anywhere:**
```powershell
# Search for the filename in the entire output/ directory
Get-ChildItem output/ -Recurse -Filter "logo.png"
```

**Fix — Step 3a: If file exists at a different path,** update the `src` attribute:
```html
<!-- Before -->
<img src="logo.png">
<!-- After — file is actually in assets/ subfolder -->
<img src="assets/logo.png">
```

**Fix — Step 3b: If file does not exist,** add a placeholder:
```html
<img src="assets/logo.png" 
     data-placeholder="true"
     style="background: #cccccc; width: 120px; height: 60px;"
     alt="[Logo placeholder — replace before final render]">
```

Mark render status as `partial` in `render-report.json`.

**Verification:** Browser console Network tab shows 200 for all asset requests. No broken image icons in preview.

---

## ERR-06 · Preview Passes but Render Fails

**Symptom:** `npx hyperframes lint` passes, `preview.html` looks correct in browser, but `npx hyperframes render` fails or produces a black video.

**Common causes and fixes:**

| Cause | Diagnosis | Fix |
|-------|-----------|-----|
| Timeline not paused | `window.__timelines[0].paused()` returns false in browser | Add `{ paused: true }` — see ERR-02 |
| External asset blocked in headless context | Asset loaded from `http://` or external domain | Move asset to `output/assets/` — see R-CORE-07 |
| `setTimeout`/`setInterval` used for timing | Search source for `setTimeout(` | Replace with GSAP delay — see R-GSAP-07 |
| Infinite loop | Search for `repeat: -1` | Change to finite repeat — see ERR-08 |
| Canvas dimensions in % not px | `#composition { width: 100% }` | Change to explicit pixels — see R-CORE-02 |
| Missing `window.__timelines` | `window.__timelines` is undefined in headless | Add registration — see ERR-01 |
| GSAP version mismatch | Script URL is not 3.12.x | Use approved cdnjs 3.12.x or `assets/gsap.min.js` (R-CORE-12) |
| GSAP failed to load (network) | Headless cannot reach cdnjs | Switch `<script src>` to `assets/gsap.min.js` and add the file under `output/assets/` |

**Diagnostic command:**
```
npx hyperframes render output/index.html --quality draft --verbose 2>&1
```
Read the verbose output for the specific failure reason.

---

## ERR-07 · Font Not Rendering / Font Missing

**Symptom:** Text appears in a system fallback font (Times New Roman, Arial) instead of the specified brand font. Headline weight and sizing look wrong. CJK may show tofu in Linux/WSL headless.

**Diagnosis:** The font is not available in the **render** environment. Remote font CSS (`fonts.googleapis.com`) often fails or differs offline vs preview.

**Fix — Option A (recommended for production render):** Use a **system / CJK stack** in `:root` — no network dependency:
```css
:root {
  --font-headline: 'PingFang SC', 'Microsoft YaHei', 'Noto Sans CJK SC', sans-serif;
  --font-body: 'PingFang SC', 'Microsoft YaHei', 'Noto Sans CJK SC', sans-serif;
}
```

**Fix — Option B:** Add **licensed** font files under `output/assets/` and `@font-face` with `url('assets/your-font.woff2')` (do not commit fonts into HyperDirector unless repo policy allows).

**Fix — Option C:** For desktop preview only, remote font links may work — but **do not** rely on them for headless/CI. Align preview with render per `rules/headless-rendering-stability.md`.

**Verification:** Run render target environment (or WSL) and confirm glyphs; check Computed `font-family` in Chromium.

**Lint error code:** `FONT_NOT_AVAILABLE`

---

## ERR-08 · Infinite Repeat / Animation Never Ends

**Symptom:** Render hangs and never completes. Terminal shows HyperFrames progress stuck at a specific scene. `Ctrl+C` required to abort.

**Diagnosis:** An animation with `repeat: -1` is in the timeline. HyperFrames advances the timeline to `totalDuration()`, which is `Infinity` for infinite-repeat timelines — causing the render to never terminate.

**Fix:** Replace `repeat: -1` with a finite count that fits within the scene's `data-duration`:
```js
// Before — infinite, blocks render
gsap.to('.spinner', { rotation: 360, duration: 1, repeat: -1 });

// After — runs 3 full rotations, fits in a 4s scene
gsap.to('.spinner', { rotation: 360, duration: 1, repeat: 3 });

// For pulsing effects in longer scenes
gsap.to('.pulse', { scale: 1.08, duration: 0.4, repeat: 5, yoyo: true });
```

**Checkable condition:** Search `index.html` source for `repeat: -1` or `repeat:-1`. Must return zero matches.

**Verification:** `window.__timelines[0].totalDuration()` must return a finite number (not `Infinity`).

---

## ERR-09 · Aspect Ratio / Canvas Size Wrong

**Symptom:** Render output has wrong dimensions. Video is letterboxed, pillarboxed, or cropped. Platform rejects the upload due to wrong resolution.

**Diagnosis:** `#composition` CSS dimensions do not match `brief.aspect_ratio`.

**Fix:** Find the `#composition` CSS rule and set exact dimensions:
```css
/* 9:16 — vertical */
#composition { width: 1080px; height: 1920px; overflow: hidden; }

/* 16:9 — horizontal */
#composition { width: 1920px; height: 1080px; overflow: hidden; }

/* 1:1 — square */
#composition { width: 1080px; height: 1080px; overflow: hidden; }
```

Also add `overflow: hidden` to prevent elements from bleeding outside the canvas.

**Verification:** `document.querySelector('#composition').getBoundingClientRect()` → width and height must match the spec.

---

## ERR-10 · Animation Duration Inconsistency / Timing Drift

**Symptom:** Scene content is visible for the wrong duration. A scene that should show for 8 seconds cuts away at 5 seconds, or lingers for 12 seconds. Scene transitions stutter or overlap.

**Diagnosis:** GSAP animation end time for a scene exceeds or falls short of the scene's `data-duration`. Timeline labels are misaligned with scene boundaries.

**Diagnostic approach:**
```js
// In browser console, check when each scene's animations complete:
window.__timelines[0].getChildren().forEach(tween => {
  console.log(tween.targets()[0]?.id, tween.startTime(), tween.endTime());
});
```

**Fix — verify scene label positions match data-duration cumulative offsets:**

If scenes are: scene_01=4s, scene_02=7s, scene_03=6s, then:
- `scene_01` label → position 0s
- `scene_02` label → position 4s  
- `scene_03` label → position 11s

Any tween in `scene_02` must not `endTime()` beyond `11s - 0.3s (exit buffer) = 10.7s`.

**Fix:** Adjust label positions or tween durations so all animations within a scene end before the next scene's start time.

**Verification:** `window.__timelines[0].totalDuration()` must equal `storyboard.total_duration`. Each scene's tweens must end before the cumulative sum of prior scene durations.

---

## ERR-11 · Scene Order in HTML Differs from Storyboard

**Symptom:** Video content plays in wrong order. Scene content from storyboard position 3 appears before position 2.

**Diagnosis:** `<section>` elements in `index.html` are not in the same order as `storyboard.scenes`.

**Fix:** Reorder the `<section>` elements in `index.html` to match the scene order in `storyboard.json`. The first `<section id="scene_01">` must correspond to `storyboard.scenes[0]`.

Also reorder the GSAP timeline label positions to match the new DOM order.

**Verification:** `[...document.querySelectorAll('.scene')].map(s => s.id)` must equal `storyboard.scenes.map(s => s.id)`.
