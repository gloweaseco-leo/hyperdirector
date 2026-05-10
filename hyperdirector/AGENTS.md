# AGENTS.md — HyperDirector Agent Collaboration Rules

This file governs how Cursor, Hermes, and any AI coding agent operates within the HyperDirector project. All agents must follow these rules when generating, editing, or reviewing files in this repository.

---

## 1. Scope of This File

These rules apply to:
- Any agent generating HyperFrames HTML compositions from HyperDirector prompts
- Any agent editing existing compositions during warm iteration
- Any agent modifying `storyboard.json`, `brief.json`, `DESIGN.md`
- Any agent adding or modifying template files under `templates/`
- Any agent modifying `rules/`, `prompts/`, or `schemas/`

These rules do NOT apply to:
- Reading and summarizing documentation files
- Answering questions about HyperDirector
- Generating non-HyperFrames text content (articles, scripts in Markdown)

---

## 2. File Generation Order (Hard Constraint)

When generating a new video project, always produce files in this order:

```
1. brief.json          Validate against schemas/brief.schema.json
2. storyboard.json     Validate against schemas/storyboard.schema.json
3. DESIGN.md           Template + brand decisions documented
4. index.html          HyperFrames composition (only after 1–3 exist)
5. render-report.md    After lint/validate completes
```

**Violation:** Generating `index.html` without a corresponding `storyboard.json` in the same output directory is a hard violation. Stop and generate the missing files first.

---

## 3. Warm Iteration — Surgical Edits Only

When a user requests changes to an existing project, the agent must:

1. **Identify scope** — determine exactly which scene(s) and element(s) are affected.
2. **Edit surgically** — modify only the affected HTML elements and their corresponding storyboard entries.
3. **Never regenerate** — do not rewrite `index.html` from scratch. Do not reset CSS variables or GSAP timeline structure.
4. **Sync storyboard** — if the change affects scene structure (add/remove/reorder scenes), update `storyboard.json` in the same operation.
5. **Document the change** — output `edit-instructions.md` after every warm iteration:
   ```markdown
   ## Edit Log — [date]
   
   ### Changes Made
   - scene_02: Updated headline from "..." to "..."
   - scene_05: Changed CTA text to "..."
   
   ### Files Modified
   - index.html (lines 142–158, lines 310–315)
   - storyboard.json (scenes[1].headline, scenes[4].caption)
   
   ### QA Status
   - Lint: PASSED
   ```

**Prohibition:** The following warm iteration patterns are explicitly banned:
- Deleting `index.html` and regenerating it
- Replacing the entire GSAP timeline block
- Resetting brand CSS variables to defaults
- Removing `class="clip"` from any element
- Changing `data-composition-id` without updating `window.__timelines` key

---

## 4. HyperFrames Composition Rules (Enforced on Every Write)

Every `index.html` file generated or modified by an agent must satisfy:

### 4.1 Timeline Registration
```javascript
// Required pattern — key must exactly match data-composition-id value
const tl = gsap.timeline({ paused: true });
// ... animations ...
window.__timelines = window.__timelines || {};
window.__timelines["<composition-id>"] = tl;
```

### 4.2 Timed Elements
```html
<!-- Every timed element must have all four: -->
<div class="clip"
     data-start="<seconds>"
     data-duration="<seconds>"
     data-track-index="<integer>">
```

### 4.3 Composition Root
```html
<div id="root"
     data-composition-id="<slug>"
     data-start="0"
     data-width="<px>"
     data-height="<px>">
```

### 4.4 Timeline Duration
Timeline must extend to cover full `brief.duration_seconds`:
```javascript
tl.set({}, {}, TOTAL_DURATION);  // extend if last animation ends earlier
```

### 4.5 Hard Prohibitions in Composition Code
| Pattern | Why banned |
|---|---|
| `Math.random()` | Non-deterministic — different render each time |
| `repeat: -1` or `.repeat(-1)` | Renderer hangs indefinitely |
| `video.play()` / `audio.currentTime = x` | Conflicts with framework media sync |
| `tl.to("#video-el", { width, height })` | Animating video dimensions breaks frame rendering |
| `async`/`await` inside GSAP timeline setup | Timeline must construct synchronously |
| External script tags other than GSAP | Only GSAP 3.12.x via R-CORE-12 (cdnjs **or** `assets/gsap.min.js`) |

---

## 5. Lint and Validate Are Mandatory

After writing or modifying any `index.html`:

```bash
# Step 1 — structural check
npx hyperframes lint

# Step 2 — runtime check (if lint passes)
npx hyperframes validate

# Step 3 — composition duration check
npx hyperframes compositions
```

If lint fails: apply fix from `rules/common-errors-fix.md` and retry. Maximum 3 attempts.
If validate fails: classify error type, apply fix, document in `render-report.md`.
If environment is unavailable: note "lint not executed — environment unavailable" in report.

**Never mark a composition as "QA passed" without running lint.**

---

## 6. Template Modification Rules

When modifying files under `templates/`:

- Do not hardcode brand-specific colors, fonts, or CTA text in template HTML.
- All brand values must use CSS variables with fallback defaults:
  ```css
  :root {
    --color-primary: var(--brand-primary, #111827);
    --color-accent: var(--brand-accent, #6366F1);
    --font-headline: var(--brand-font-headline, 'Inter');
  }
  ```
- Template `data-composition-id` values must use the template name as prefix: `tiktok-vertical-kit-{scene}`.
- `DESIGN.md` in each template directory must stay in sync with `template.html` structure.

---

## 7. Schema Validation

When writing `brief.json`, `storyboard.json`, or `brand-kit.json`:

- Validate structure against corresponding schema in `schemas/`.
- Required fields may not be absent or null.
- `brief.duration_seconds` must be a positive number between 10 and 300.
- `storyboard.scenes` duration sum must equal `brief.duration_seconds` (±0.5s tolerance).
- `brand_kit.colors.primary` and `colors.accent` must be valid hex color strings (`#rrggbb`).

---

## 8. Output Directory Convention

All generated video project files go to:
```
output/<project-slug>/
```

Where `<project-slug>` is derived from `brief.title` as lowercase kebab-case.

- Do not write generated output files into `hyperdirector/` itself.
- Do not overwrite existing output directories without user confirmation.
- `assets/` inside the output directory stores all media files referenced by `index.html`.

---

## 9. Language Rules for Generated Content

- `brief.language` controls script, captions, headlines, CTA, and all on-screen copy.
- If `brief.language` is absent, infer from user input language.
- Chinese input → `zh-CN` by default.
- Technical terms (API, GSAP, HTML, CLI, etc.) remain in English even in zh-CN content.
- Do not mix Chinese and English in the same caption line unless for technical terms.

---

## 10. What Agents Must NOT Modify (Without Explicit Instruction)

| File / Directory | Reason |
|---|---|
| `upstream/` | Upstream knowledge base — do not edit without deliberate review |
| `schemas/` | Schema changes break validation for all existing files |
| `SKILL.md` | Changing trigger conditions affects Hermes skill loading |
| `PRD.md` (root) | Source of truth for product requirements |
| Any `brand-kit.json` in user's project root | User's brand config — never overwrite |
| `output/.gitkeep` | Sentinel file for output directory |
