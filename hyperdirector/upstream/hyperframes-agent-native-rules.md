# HyperFrames Agent-Native Rules

> Translates HyperFrames' agent-first design philosophy into executable rules
> for Hermes and Cursor agents running HyperDirector workflows.

---

## Rule Set: CLI Operations

### AN-01: CLI commands must be non-interactive

All `npx hyperframes` commands used by HyperDirector must run without requiring user input. Avoid commands that prompt for confirmation, wait for stdin, or open interactive menus.

```bash
# Good — non-interactive
npx hyperframes init my-video --template blank
npx hyperframes render --output final.mp4 --quality draft
npx hyperframes lint

# Bad — interactive or ambiguous
npx hyperframes init   # may prompt for project name
```

### AN-02: Capture and classify command output

Every CLI invocation must capture stdout and stderr. Output must be classified into:
- `success` — command completed normally
- `lint_error` — structural issues in HTML
- `validation_error` — runtime errors (JS exceptions, missing assets)
- `render_error` — FFmpeg or Chromium failure
- `environment_error` — missing Node.js, FFmpeg, or Chromium

Classification determines which fix pattern to apply in `rules/common-errors-fix.md`.

### AN-03: Environment check before any render

Before running `npx hyperframes render`, verify:
1. `node --version` is >= 22
2. `npx hyperframes doctor` passes (or equivalent environment check)
3. `ffmpeg -version` is available
4. Required assets exist at their referenced paths

If environment check fails, halt and output a clear error message. Do not attempt render.

---

## Rule Set: File Generation

### AN-04: Output files must be plain text and diffable

All generated files must be:
- Plain text (HTML, JSON, Markdown)
- UTF-8 encoded
- Human-readable with consistent indentation (2 spaces for HTML/JSON, standard Markdown)
- Diffable with standard `git diff`

No binary output in the composition directory. Asset files (images, audio) go in `assets/` only.

### AN-05: Generate brief and storyboard before HTML

The generation sequence is strictly ordered:

```
1. brief.json         ← structured requirements
2. storyboard.json    ← scenes, timing, captions
3. DESIGN.md          ← visual design spec
4. index.html         ← HyperFrames composition
5. QA                 ← lint + validate
6. render-report.md   ← delivery report
```

Skipping steps 1–3 and jumping directly to HTML generation is a hard violation. Brief and storyboard are not optional pre-work — they are the specification that makes the HTML correct and editable.

### AN-06: Element IDs must be meaningful

All HTML elements in generated compositions must have meaningful IDs:

```html
<!-- Good -->
<div id="scene-01-hook" class="clip" data-start="0" data-duration="4" data-track-index="1">
<h1 id="hook-headline" class="clip" data-start="0.5" data-duration="3" data-track-index="2">

<!-- Bad -->
<div id="div-1" ...>
<h1 id="el-xyz" ...>
```

Meaningful IDs make warm iteration possible. The agent (and human editors) must be able to locate scene elements without reading the entire file.

### AN-07: Scene boundaries must be clearly commented

```html
<!-- ============================================================ -->
<!-- SCENE 01 — Hook (0s–4s) -->
<!-- Purpose: Strong opening statement to stop scroll -->
<!-- ============================================================ -->
<div id="scene-01-hook" ...>
  ...
</div>

<!-- ============================================================ -->
<!-- SCENE 02 — Point 1 (4s–10s) -->
<!-- ============================================================ -->
```

---

## Rule Set: Iteration

### AN-08: Warm iteration must be local and surgical

When a user requests changes (e.g., "make the title larger", "change the CTA text"), HyperDirector must:
1. Identify the affected scene(s) in `storyboard.json`
2. Locate the corresponding HTML elements by ID
3. Apply only the required changes
4. Re-run lint/validate on the modified file
5. Output `edit-instructions.md` describing what changed

**Never rewrite `index.html` from scratch during warm iteration.** Never reset brand styles. Never regenerate scenes that were not affected.

### AN-09: Storyboard is the single source of structural truth

During iteration, `storyboard.json` must be updated in sync with `index.html`. If a scene is added, removed, or restructured in HTML, `storyboard.json` must reflect that change. The two files must never diverge.

### AN-10: Preserve brand state across iterations

`brand-kit.json` values must be re-applied (not re-read from scratch) during iteration. Brand colors, fonts, and motion language must not drift between iterations.

---

## Rule Set: QA and Reporting

### AN-11: Every generation ends with a QA report

No composition is "complete" without a `render-report.md`. Even if the user does not ask for QA, the QA check must run automatically after generation. The render-report must include:
- Task type
- Template used
- Lint result (pass/fail + error list)
- Validate result (pass/fail + error list)
- Fixes applied
- Render status (draft/final/not-run)
- Known limitations

### AN-12: Maximum 3 auto-fix attempts

The QA Fix Loop attempts a maximum of 3 fix cycles per session:
1. Attempt 1: Apply standard fix from `common-errors-fix.md`
2. Attempt 2: Apply alternative fix
3. Attempt 3: Apply minimal safe fallback
After 3 attempts, halt and output the unresolved error to the user with actionable diagnosis.

### AN-13: Never claim render success without evidence

HyperDirector must not write "render completed" or "video generated" in `render-report.md` unless:
- `npx hyperframes render` was actually executed
- The command returned exit code 0
- The output file exists at the specified path

If HyperFrames CLI is not installed or render was not run, the report must say: "Render not executed — HyperFrames CLI not available or render step was skipped."

---

## Rule Set: Scope and Degradation

### AN-14: Complex visual requests must be degraded

When a user requests complex visuals that HyperDirector cannot reliably generate (3D character animation, photorealistic scenes, complex shader effects), HyperDirector must:
1. Acknowledge the request
2. Propose a degraded version within HyperDirector's capability
3. Ask for confirmation before proceeding

Example degradation:
- "Cinematic talking-head with lip sync" → "Animated title cards + TTS narration + caption overlay"
- "3D product rotation" → "2D product image with CSS transform animation"
- "Real location B-roll" → "Abstract animated background + text overlay"

### AN-15: Missing context must be inferred, not blocked

If `brief.language` is missing, infer from user input language. If `brand-kit.json` is missing, use the default template. If template is not specified, select the most appropriate based on `brief.task_type`. Never block the workflow due to optional field absence.

---

## Summary Checklist

Before generating any HTML composition, verify:

- [ ] `brief.json` exists and validates against schema
- [ ] `storyboard.json` exists and validates against schema
- [ ] `DESIGN.md` exists with template selection and visual spec
- [ ] Brand kit loaded (or default applied)
- [ ] Template selected
- [ ] Environment check passed (or explicitly noted as skipped)

After generating HTML composition, verify:

- [ ] All timed elements have `class="clip"`
- [ ] All timed elements have `data-start`, `data-duration`, `data-track-index`
- [ ] Root element has `data-composition-id`
- [ ] `window.__timelines["<composition-id>"]` key matches `data-composition-id`
- [ ] Timeline is `{ paused: true }`
- [ ] Timeline extends to full composition duration
- [ ] No `Math.random()` usage
- [ ] No media playback control in scripts
- [ ] No animation directly on `<video>` element dimensions
- [ ] Scene comments present
- [ ] Element IDs are meaningful
