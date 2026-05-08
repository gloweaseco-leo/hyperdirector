# HyperFrames Integration Positioning

> Defines the relationship between HyperDirector, HyperFrames, and adjacent tools.
> This is the canonical reference for explaining HyperDirector's position in the ecosystem.

---

## The Stack

```
┌─────────────────────────────────────────────────────────────────┐
│                         User Request                            │
│  "把这篇文章做成 30 秒视频号竖屏视频，使用我的品牌规范"              │
└────────────────────────────┬────────────────────────────────────┘
                             ↓
┌─────────────────────────────────────────────────────────────────┐
│                      Hermes Agent                               │
│  Executes skills, manages conversation, calls tools             │
└────────────────────────────┬────────────────────────────────────┘
                             ↓
┌─────────────────────────────────────────────────────────────────┐
│                   HyperDirector Skill Pack                      │
│  ┌──────────────┐  ┌────────────────┐  ┌──────────────────┐    │
│  │ Capability   │  │  Brief +       │  │  Brand Kit       │    │
│  │ Judge        │  │  Storyboard    │  │  Adapter         │    │
│  └──────────────┘  └────────────────┘  └──────────────────┘    │
│  ┌──────────────┐  ┌────────────────┐  ┌──────────────────┐    │
│  │ Visual       │  │  HyperFrames   │  │  QA Fix Loop     │    │
│  │ Designer     │  │  Composer      │  │                  │    │
│  └──────────────┘  └────────────────┘  └──────────────────┘    │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │              Render Orchestrator + Delivery              │   │
│  └──────────────────────────────────────────────────────────┘   │
└────────────────────────────┬────────────────────────────────────┘
                             ↓
┌─────────────────────────────────────────────────────────────────┐
│                   HyperFrames CLI                               │
│  npx hyperframes lint | preview | render                        │
│  HTML-to-video engine (Apache 2.0, by HeyGen)                   │
└────────────────────────────┬────────────────────────────────────┘
                             ↓
┌─────────────────────────────────────────────────────────────────┐
│              Output: MP4 + HTML Source + Reports                │
└─────────────────────────────────────────────────────────────────┘
```

---

## Relationship Definitions

### HyperFrames — The Engine

HyperFrames is an open-source HTML-to-video framework created by HeyGen (Apache 2.0, March 2026).

- **What it is:** A rendering engine that converts HTML compositions into MP4/WebM video files.
- **How it works:** Plain HTML + CSS + GSAP + data attributes → Chromium headless capture → FFmpeg encoding → video file.
- **What it provides:** CLI (`init`, `lint`, `preview`, `render`), composition runtime, GSAP integration, 50+ catalog blocks, skills for AI coding agents.
- **What it does NOT provide:** Director workflow, storyboard structure, brand memory, Chinese user delivery, high-level video production guidance.

HyperDirector inherits HyperFrames principles but **does not modify, fork, or replace** the HyperFrames codebase.

---

### Hermes Official HyperFrames Skill — The Foundation

Hermes has an official HyperFrames skill that provides basic capability to call HyperFrames CLI within Hermes conversations.

- **What it provides:** Basic `init`, `preview`, `render` capability; composition generation from prompts.
- **What it lacks:** Structured brief/storyboard workflow, brand memory, template library, QA Fix Loop, Chinese delivery, capability boundary judgment.

HyperDirector is built **on top of** the Hermes HyperFrames foundation. It is an enhancement, not a replacement.

---

### HyperDirector — The Director Layer

HyperDirector is a Hermes Skill Pack that adds a director workflow layer above HyperFrames.

**What HyperDirector adds:**
| Capability | Description |
|---|---|
| Capability judgment | Determines if a request is suitable for HyperDirector |
| Brief generation | Converts natural language to structured `brief.json` |
| Storyboard generation | Creates scene-by-scene structure with timing |
| Visual design | Template selection, brand application, `DESIGN.md` |
| Template library | 3 video types: TikTok vertical, SaaS demo, AI explainer |
| Brand Kit | Persistent brand memory (colors, fonts, motion, CTA) |
| QA Fix Loop | Automated lint → validate → fix → report cycle |
| Chinese delivery | Complete Chinese user documentation and examples |
| Delivery packaging | `render-report.md`, `edit-instructions.md`, `output/` structure |

**What HyperDirector does NOT do:**
- Render video independently (always delegates to HyperFrames CLI)
- Replace HyperFrames rendering pipeline
- Provide photorealistic video generation
- Provide digital human / lip-sync capability
- Compete with or bypass HyperFrames

---

## Comparison with Adjacent Tools

### vs. Remotion

| Dimension | HyperFrames | Remotion |
|---|---|---|
| Language | Plain HTML + JS + GSAP | React + TypeScript |
| Agent friendliness | Built for AI agents | Built for React developers |
| Setup | `npx hyperframes init` | Full React project setup |
| Animation | GSAP | Remotion's animation API |
| AI coding agent support | Native skill integration | Custom prompt setup needed |

**HyperDirector's position:** Uses HyperFrames (not Remotion) because plain HTML is more accessible to AI agents and non-React developers.

Reference: https://hyperframes.mintlify.app/guides/hyperframes-vs-remotion.md

---

### vs. Sora / Runway / Pika / Veo / Kling

| Dimension | HyperFrames + HyperDirector | Generative Video AI |
|---|---|---|
| Input | HTML + structured data | Text prompts / reference images |
| Output | Graphic/animated video | Photorealistic video |
| Control | Code-level, fully deterministic | Probabilistic, limited control |
| Editability | Full source code access | Black-box output |
| Brand consistency | Brand Kit enforced | No memory between runs |
| Reproducibility | Same input = same output | Stochastic |

**HyperDirector's position:** Not competing with generative video AI. Targeting use cases where control, editability, and brand consistency matter more than photorealism.

---

### vs. HeyGen Studio / Synthesia / D-ID (Digital Humans)

| Dimension | HyperDirector | Digital Human Tools |
|---|---|---|
| Presenter | Text + graphics (no avatar) | AI avatar with lip-sync |
| Voiceover | TTS audio track | AI voice + avatar sync |
| Editing | HTML source code | Platform GUI |
| Brand | CSS/GSAP | Platform templates |

**HyperDirector's position:** Not competing with digital human platforms. When users need lip-synced avatar videos, refer them to HeyGen Studio (same parent company as HyperFrames).

---

### vs. Premiere Pro / DaVinci Resolve / 剪映 (Professional Editors)

| Dimension | HyperDirector | Professional Editors |
|---|---|---|
| Workflow | Code + AI generation | Manual timeline editing |
| Input | Text, docs, data | Raw footage |
| Skill required | Hermes prompt knowledge | Video editing expertise |
| Use case | Short-form branded content | Long-form professional production |

**HyperDirector's position:** Complement, not replacement. HyperDirector outputs editable HTML that could feed into professional finishing, but its primary value is eliminating the need for professional editing in the standard use case.

---

## Brand Statement

The recommended external positioning for HyperDirector:

> **Powered by HyperFrames. Directed by Hermes. Packaged as HyperDirector.**

This statement conveys:
1. HyperFrames is the acknowledged rendering foundation (credit where credit is due)
2. Hermes is the agent environment that orchestrates the workflow
3. HyperDirector is the packaging layer that makes it production-ready

Use this positioning in:
- README.md and README.zh-CN.md
- Demo video descriptions
- Any public-facing content about HyperDirector

---

## License and Open Source Obligations

- HyperFrames is Apache 2.0 licensed. HyperDirector uses it as a CLI tool (not as a library), which does not require HyperDirector to be Apache 2.0.
- HyperDirector's templates are original work and can be licensed independently.
- HyperDirector must attribute HyperFrames in README and SKILL.md.
- HyperDirector must not remove or obscure HyperFrames CLI attribution in generated render-reports.
