# HyperFrames Principles

> Upstream principles that HyperDirector inherits and must never violate.
> These are not HyperDirector opinions — they are HyperFrames architectural facts.

---

## Positioning Boundary

**HyperDirector does not rewrite HyperFrames.**
**HyperDirector does not replace HyperFrames.**
**HyperDirector does not fork the rendering engine.**

HyperFrames is the HTML-to-video rendering engine. HyperDirector is the Hermes-native director workflow layer that sits above it. Every generated composition must pass through the HyperFrames CLI pipeline unchanged.

```
User Prompt
  ↓
Hermes Agent
  ↓
HyperDirector (director workflow, templates, brand, QA)
  ↓
HyperFrames CLI (lint → preview → render)
  ↓
MP4 / WebM output
```

HyperDirector adds value in: requirement analysis, brief generation, storyboard, visual design, template selection, brand application, QA fix loop, and delivery packaging. It does not add value by changing how HyperFrames renders.

---

## Core Principles

### P-01: HTML is the Source of Truth

Every video is a plain HTML document. The HTML file is the canonical representation of the video — not a JSON config, not a DSL, not a binary. Anyone can open the file in a browser, edit it in a text editor, diff it, and commit it to git.

**Implication for HyperDirector:** All generated compositions must be readable, editable HTML. Never generate opaque or minified output.

---

### P-02: Plain HTML / CSS / JS First

Compositions use plain HTML, CSS, and JavaScript. No React, no Vue, no proprietary DSL, no build step, no bundler required. GSAP is the standard animation library. Other runtimes (Lottie, Three.js, CSS animations) are supported via Frame Adapters.

**Implication for HyperDirector:** HyperDirector v0.1 does not use React or any framework in generated compositions. Templates are pure HTML.

---

### P-03: No Custom DSL in HyperDirector v0.1

HyperDirector does not introduce any proprietary template language or rendering abstraction. Compositions are standard HyperFrames HTML. Variable substitution uses `window.__hyperframes.getVariables()` — the official pattern.

---

### P-04: HyperFrames is the Render Engine

HyperDirector never claims to render video independently. Rendering is always delegated to `npx hyperframes render`. If HyperFrames CLI is not installed, HyperDirector produces source files only and explicitly states that rendering has not occurred.

---

### P-05: HyperDirector is the Hermes Director Workflow Layer

HyperDirector's value is in the workflow layer:
- Capability judgment (is this request suitable?)
- Brief generation (structured video requirements)
- Storyboard generation (scenes, timing, captions)
- Visual design (template selection, brand application, DESIGN.md)
- HyperFrames composition generation (HTML project)
- QA Fix Loop (lint, validate, fix, report)
- Delivery packaging (output/, render-report.md, edit-instructions.md)

---

### P-06: Deterministic Output is a Hard Requirement

Same input must produce stable, reproducible output. This applies at every layer:
- No `Math.random()` in compositions
- No `Date.now()` for animation timing
- If pseudo-random values are needed, use a seeded PRNG (e.g. mulberry32) with a fixed seed from the brief
- Asset paths must be relative and project-contained

**Implication for HyperDirector:** `storyboard.json` + `brand-kit.json` + template → same HTML every time. QA must flag any non-deterministic patterns.

---

### P-07: Preview Before Final Render

Always run `npx hyperframes preview` and verify composition before running `npx hyperframes render --quality high`. Draft render (`--quality draft`) is acceptable for QA iteration. Final high-quality render should only happen after QA passes.

**Implication for HyperDirector:** The QA Fix Loop must include preview verification. Never output a render-report claiming success without having run lint and validate.

---

### P-08: Template-First, Then Customize

Start from an existing template or block. Do not generate complex animations from scratch without a structural starting point. HyperFrames catalog has 50+ ready-to-use blocks. HyperDirector's three templates (tiktok-vertical-kit, saas-demo-kit, ai-knowledge-explainer-kit) provide the starting point for 80% of use cases.

**Implication for HyperDirector:** The `04-compose-html.md` prompt must select a template first, then customize for brief + brand. Never start from a blank canvas for standard video types.

---

### P-09: Source Files Must Remain Editable

The output is not a black box. Users must be able to open `index.html`, read it, understand it, and modify specific scenes without understanding the entire file. This means:
- Clear section comments per scene
- Meaningful element IDs (not `div-123`)
- `storyboard.json` as the structural reference
- `DESIGN.md` as the human-readable design spec
- `edit-instructions.md` after every iteration

---

### P-10: Same Input Should Produce Stable Output

Given the same `brief.json` + `brand-kit.json` + template, HyperDirector should produce structurally consistent output. Minor variation in copy is acceptable (LLM generation), but timing, structure, and brand application must be consistent.

---

### P-11: Do Not Bypass the HyperFrames lint/preview/render Workflow

`npx hyperframes lint` catches structural issues. `npx hyperframes validate` catches runtime errors. These tools exist and must be used. HyperDirector must not skip them or substitute them with manual inspection.

**Implication for HyperDirector:** The QA Fix Loop is not optional. No composition is "done" without passing lint.

---

## Relationship Summary

| Layer | Tool | Role |
|---|---|---|
| Rendering engine | HyperFrames CLI | Convert HTML → MP4/WebM |
| Animation runtime | GSAP | Timeline animation in compositions |
| Director workflow | HyperDirector | Brief → Storyboard → HTML → QA → Delivery |
| Agent environment | Hermes | Executes HyperDirector skill |
| Output format | MP4 + HTML source | Both always required |

---

## What HyperDirector Adds (and What It Does Not)

| HyperDirector adds | HyperDirector does not add |
|---|---|
| Capability boundary judgment | Rendering engine modifications |
| Structured brief/storyboard workflow | New animation runtimes |
| Brand Kit memory | Support for React/Vue compositions |
| Template library for 3 video types | Bypassing HyperFrames lint/render |
| QA Fix Loop with error patterns | Claims of photorealistic video generation |
| Chinese user delivery docs | Digital human lip-sync |
| Hermes skill integration | Cloud render queue (v0.3) |
