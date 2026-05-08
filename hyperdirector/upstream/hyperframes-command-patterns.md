# HyperFrames Command Patterns

> Reference for HyperDirector's CLI integration with HyperFrames.
> Commands are written as patterns — replace `<placeholders>` with actual values.
> Some commands are placeholders for v0.2/v0.3 and are marked TODO.

---

## Environment Detection

### Check Node.js version

```bash
node --version
# Expected: v22.x.x or higher
# If lower: halt, output installation instructions
```

### Check HyperFrames CLI availability

```bash
npx hyperframes --version
# Expected: version string, e.g. "hyperframes/0.x.x"
# If not found: output "HyperFrames CLI not installed. Run: npm install -g hyperframes"
```

### Run HyperFrames doctor

```bash
npx hyperframes doctor
# Checks: Node.js version, FFmpeg, Chromium, required packages
# Pass: proceed to composition generation
# Fail: output specific missing dependency and installation link
```

### Check FFmpeg

```bash
ffmpeg -version
# Expected: FFmpeg version string
# If missing: halt render, output "FFmpeg not found. Install via: https://ffmpeg.org/download.html"
```

**HyperDirector policy:** If environment check fails at any point, output a clear diagnosis and do NOT proceed to render. Source file generation (brief, storyboard, HTML) may continue without render capability.

---

## Project Initialization

### Initialize new HyperFrames project

```bash
npx hyperframes init <project-slug>
# Creates project directory with index.html scaffold
# project-slug: kebab-case, no spaces, e.g. "my-product-demo"
```

### Initialize from specific template (when available)

```bash
# TODO: verify template flag syntax in current HyperFrames CLI version
npx hyperframes init <project-slug> --template blank
```

**HyperDirector policy:** For v0.1, HyperDirector generates `index.html` directly from its own templates rather than using `npx hyperframes init`. The init command is used for reference scaffold only.

---

## Linting and Validation

### Run structural lint

```bash
npx hyperframes lint
# Run from project root (where index.html lives)
# Catches: missing class="clip", invalid data attributes, composition ID issues
# Exit code 0: pass | Exit code 1: errors found
```

### Run runtime validation

```bash
npx hyperframes validate
# Catches: JS runtime errors, missing assets, contrast issues, broken media references
# Exit code 0: pass | Non-zero: errors found
```

### List all compositions and their resolved durations

```bash
npx hyperframes compositions
# Use to verify: composition duration matches storyboard total duration
# If duration mismatch: apply tl.set({}, {}, DURATION) fix
```

**HyperDirector policy:** Both `lint` and `validate` must pass before proceeding to render. Lint failures block render. Validate warnings are documented in render-report.md but do not always block render.

---

## Preview

### Start live preview server

```bash
npx hyperframes preview
# Opens browser preview with hot-reload
# Use during composition development and QA iteration
```

### Preview specific composition

```bash
npx hyperframes preview --composition <composition-id>
# Use when project has multiple compositions
```

**HyperDirector policy:**
- Preview is mandatory before final render.
- For automated agent workflows, preview runs headlessly; the agent checks for console errors via `[Browser:ERROR]` markers in output.
- HyperDirector does not skip preview even when running in fully automated mode.

---

## Rendering

### Draft render (fast, for QA iteration)

```bash
npx hyperframes render --quality draft --output output/draft.mp4
# Quality: draft = fast encoding, lower resolution preview
# Use for: QA iteration, pacing check, storyboard verification
```

### Standard render (for review)

```bash
npx hyperframes render --quality standard --output output/review.mp4
# Quality: standard = balanced speed/quality
# Use for: client review, internal approval
```

### Final high-quality render

```bash
npx hyperframes render --quality high --output output/final.mp4
# Quality: high = full resolution, slow encoding
# Use only after: QA pass, user approval of draft
```

### Export WebM (transparent background)

```bash
npx hyperframes render --format webm --output output/final.webm
# Use for: overlay compositions, green screen replacement
```

### Render specific composition

```bash
npx hyperframes render --composition <composition-id> --output output/final.mp4
```

**HyperDirector policy:**
- Always render draft first. Only render final after user confirms draft is acceptable.
- Output files go to `output/<project-slug>/` — never overwrite original composition files.
- Render command must be captured; exit code and output file existence verify success.

---

## Asset Management

### Run TTS (Text-to-Speech) via hyperframes-media

```bash
# TODO: verify exact CLI syntax for TTS command
npx hyperframes media tts --text "<script_text>" --voice af_heart --output assets/voiceover.mp3
```

**HyperDirector policy:** TTS is optional in v0.1. If TTS is requested, use the `af_heart` voice as default for Chinese content or select based on `brand-kit.voice.tts_voice`. Note: Kokoro TTS runs locally — no API key required.

---

## Docker Render (v0.2 — TODO)

```bash
# TODO: implement in v0.2
docker run --rm -v "$(pwd):/workspace" hyperframes/render \
  --quality high --output /workspace/output/final.mp4

# Docker render provides:
# - Consistent environment (no local Chromium issues)
# - Repeatable CI/CD renders
# - No local FFmpeg/Chromium requirement
```

**Status:** Docker render is reserved for v0.2. v0.1 uses local render only.

---

## Cloud Render (v0.3 — TODO)

```bash
# TODO: design in v0.3
# Cloud render queue will support:
# - Async render jobs
# - Task status polling
# - Retry on failure
# - Multi-quality outputs
```

**Status:** Cloud render is reserved for v0.3. Not in scope for v0.1 or v0.2.

---

## Error Recovery Commands

### Re-run lint after fix

```bash
npx hyperframes lint
# Run after applying fix from common-errors-fix.md
# Must pass before proceeding
```

### Inspect composition metadata

```bash
npx hyperframes inspect <composition-id>
# Shows: resolved duration, clip count, data attribute summary
# Use for: diagnosing timing issues
```

---

## Environment Not Available — Fallback Policy

If HyperFrames CLI is not installed or environment check fails:

**HyperDirector MUST:**
1. Generate all source files: `brief.json`, `storyboard.json`, `DESIGN.md`, `index.html`, `README.md`
2. Generate `render-report.md` with status: `"render_status": "not_executed"` and reason
3. Provide installation instructions in the report

**HyperDirector MUST NOT:**
1. Claim video has been rendered
2. Write "final.mp4 generated" anywhere
3. Silently skip the render without noting it

**Fallback render-report section:**
```markdown
## Render Status

Status: NOT EXECUTED

Reason: HyperFrames CLI not found on this system.

To render this project:
1. Install HyperFrames: npm install -g hyperframes (requires Node.js >= 22)
2. Install FFmpeg: https://ffmpeg.org/download.html
3. Run: npx hyperframes render --quality high --output output/final.mp4

All source files are ready for rendering.
```
