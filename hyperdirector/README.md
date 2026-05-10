# HyperDirector

Hermes video director enhancement pack, powered by [HyperFrames](https://github.com/heygen-com/hyperframes).

Chinese documentation → [README.zh-CN.md](./README.zh-CN.md)

---

## What This Is

HyperDirector is a Hermes Skill Pack that adds a structured director workflow above HyperFrames. It does not render video itself — it generates the HTML composition that HyperFrames renders.

```
User prompt
  → Hermes + HyperDirector skill
    → brief.json → storyboard.json → DESIGN.md → index.html
      → npx hyperframes lint / preview / render
        → final.mp4 + editable source
```

**HyperFrames** (`npx hyperframes`) handles lint, preview, and render.  
**HyperDirector** handles everything upstream: capability check, brief, storyboard, design, HTML generation, QA loop, delivery packaging.

This is not a SaaS platform. It runs locally inside Hermes. No login, no cloud queue, no subscription.

---

## Prerequisites

| Dependency | Version | Install |
|---|---|---|
| Node.js | >= 22 | https://nodejs.org |
| HyperFrames CLI | latest | `npm install -g hyperframes` |
| FFmpeg | any recent | https://ffmpeg.org/download.html |
| Chromium | auto-managed | `npx hyperframes doctor` |
| Hermes | configured | see your Hermes docs |

Check everything at once:

```bash
node scripts/check-env.js
```

Optional — heuristic stability hints (warnings only; not `hyperframes lint`):

```bash
node scripts/check-composition-hazards.js ../path/to/output/index.html
```

---

## Installation

1. Clone or download this repository.
2. Copy the `hyperdirector/` directory into your Hermes skills folder.
3. Place your `brand-kit.json` in your working project root (copy from `brand/brand-kit.example.json`).
4. Confirm skill loads: ask Hermes `"What can HyperDirector do?"`.

Hermes skills folder location varies by setup — check your Hermes configuration.

---

## Quick Start

### Trigger HyperDirector

```
Use HyperDirector to turn this article into a 30-second vertical video for WeChat.

[paste article content]
```

```
使用 HyperDirector，把这篇文章做成 30 秒视频号竖屏短视频，使用我的 brand-kit。

[粘贴文章内容]
```

### What Happens

1. HyperDirector checks if the request is suitable (`CAPABILITY_BOUNDARY.md`).
2. Generates `brief.json` (structured requirements).
3. Generates `storyboard.json` (scene-by-scene structure with timing).
4. Generates `DESIGN.md` (template selection, brand application, visual spec).
5. Generates `index.html` (HyperFrames composition with GSAP timeline).
6. Runs `npx hyperframes lint` and `npx hyperframes validate`.
7. Auto-fixes common errors (max 3 retries).
8. Renders draft → final MP4 (if HyperFrames CLI is available).
9. Outputs `render-report.md`.

### Iterate

```
Make the hook 20% faster. Increase caption size. Change the CTA to "Join my community."
```

HyperDirector patches only the affected scenes. It does not rewrite the full `index.html`.

---

## Templates (v0.1)

| Template | Aspect Ratio | Best For |
|---|---|---|
| `tiktok-vertical-kit` | 9:16 | WeChat Video, TikTok, YouTube Shorts |
| `saas-demo-kit` | 16:9 / 9:16 | Product demos, feature videos, launch announcements |
| `ai-knowledge-explainer-kit` | 9:16 | AI tutorials, open source project intros, tech explainers |

---

## Directory Reference

```
hyperdirector/
├── SKILL.md                  Hermes skill entry — trigger conditions, workflow, prohibitions
├── AGENTS.md                 Agent collaboration rules — generation order, lint enforcement
├── README.md                 This file
├── README.zh-CN.md           Chinese user documentation
├── CAPABILITY_BOUNDARY.md    What HyperDirector does, downgrades, and refuses
├── CAPABILITY_BOUNDARY.zh-CN.md
│
├── upstream/                 HyperFrames knowledge base (read-only reference)
│   ├── hyperframes-docs-map.md
│   ├── hyperframes-principles.md
│   ├── hyperframes-agent-native-rules.md
│   ├── hyperframes-command-patterns.md
│   ├── hyperframes-anti-patterns.md
│   ├── hyperframes-integration-positioning.md
│   └── language-strategy.md
│
├── prompts/                  Director workflow prompts (8 stages)
│   ├── 01-capability-judge.md  Capability check — suitable / degraded / reject
│   ├── 02-intake-brief.md      Brief generation (→ brief.json)
│   ├── 03-storyboard-generator.md  Scene-by-scene storyboard (→ storyboard.json)
│   ├── 04-visual-design.md     Template selection + brand application (→ DESIGN.md)
│   ├── 05-compose-hyperframes.md  HTML composition generation (→ index.html)
│   ├── 06-qa-fixer.md          Lint → validate → fix loop
│   ├── 07-render-report.md     Render report generation (→ render-report.md)
│   └── 08-warm-iteration.md    Surgical iteration on existing compositions
│
├── rules/                    Executable QA rules
│   ├── hyperframes-core-rules.md
│   ├── gsap-deterministic-rules.md
│   ├── headless-rendering-stability.md
│   ├── subtitle-safe-area.md
│   ├── performance-checklist.md
│   ├── common-errors-fix.md
│   ├── content-safety-rules.md
│   └── template-authoring-rules.md
│
├── schemas/                  JSON Schema validation + output contract
│   ├── brief.schema.json
│   ├── storyboard.schema.json
│   ├── brand-kit.schema.json
│   ├── render-report.schema.json
│   ├── edit-request.schema.json
│   └── output-contract.md    Human-readable delivery spec
│
├── brand/                    Brand Kit examples and guides
│   ├── brand-kit.example.json
│   ├── brand-kit.persona-zh.example.json
│   ├── brand-kit-guide.md
│   ├── brand-intake-form.md
│   └── motion-language.example.md
│
├── templates/                Video template kits — Phase 2
│   ├── tiktok-vertical-kit/
│   ├── saas-demo-kit/
│   └── ai-knowledge-explainer-kit/
│
├── workflows/                Standard workflow guides — Phase 1
├── examples/                 Demo projects — Phase 4
│   ├── zh-CN/
│   └── en/
├── docs/                     Chinese user docs (8 files, complete)
│   ├── quickstart.md
│   ├── installation.md
│   ├── first-video.md
│   ├── brand-kit-setup.md
│   ├── template-guide.md
│   ├── faq.md
│   └── cursor-development-notes.md
├── qa/                       QA checklists — Phase 3
└── scripts/                  Utility scripts
    ├── check-env.js          Environment detection
    ├── validate-brand-kit.js
    ├── validate-brief.js
    ├── validate-storyboard.js
    └── check-output-contract.js
```

---

## v0.1 Scope

### In scope

- Article / blog post → short video (15–60s)
- Product page / SaaS features → demo video
- GitHub README → project intro video
- PRD / roadmap → stakeholder video
- Data charts → animated data visualization
- Brand marketing → course promotion, community recruitment
- AI tutorials → knowledge explainer videos

### Out of scope (v0.1)

| Not in scope | Why | Alternative |
|---|---|---|
| Photorealistic video | HyperDirector renders HTML, not footage | Sora / Runway / Pika |
| Digital human lip-sync | No avatar rendering | HeyGen Studio / Synthesia |
| Professional long-form editing | Not an NLE | Premiere / DaVinci |
| Cloud render queue | Local only in v0.1 | Planned for v0.3 |
| Template marketplace | 3 built-in templates | Planned post-v0.1 |

---

## Standard Output per Run

```
output/<project-slug>/
├── brief.json
├── storyboard.json
├── DESIGN.md
├── index.html           HyperFrames composition (editable)
├── preview.html
├── script.md
├── brand-used.json
├── assets/
├── render-report.md
├── edit-instructions.md (on iteration)
└── final.mp4            (if render executed)
```

---

## Credits

- [HyperFrames](https://github.com/heygen-com/hyperframes) by HeyGen — Apache 2.0
- [GSAP](https://gsap.com) by GreenSock
