# HyperDirector

> Hermes video director enhancement pack — powered by HyperFrames.  
> 中文文档 → [README.zh-CN.md](./README.zh-CN.md) · Skill Pack 详解 → [hyperdirector/README.zh-CN.md](./hyperdirector/README.zh-CN.md)

HyperDirector is an Agent Skill Pack experiment that wraps creative video production into a structured, inspectable workflow: planning, artifact generation, validation, and delivery.

It is designed to make AI-generated video production more controllable, editable, and repeatable — from prompt to brief, storyboard, HTML project, QA checks, and final render.

**License:** [Apache License 2.0](./LICENSE) · **Contributing:** [CONTRIBUTING.md](./CONTRIBUTING.md) · **Security:** [SECURITY.md](./SECURITY.md) · **Releases:** [v0.1.0](./RELEASE_NOTES_v0.1.md) · [v0.1.1](./RELEASE_NOTES_v0.1.1.md)

---

## One-command install (Skill Pack only)

Installs **`hyperdirector/`** into the default Hermes skills path (`~/.hermes/skills/hyperdirector` on Unix, `%USERPROFILE%\.hermes\skills\hyperdirector` on Windows). Override the destination with **`HERMES_SKILLS_DIR`**.

**Security:** Users may inspect [`install.sh`](./install.sh) and [`install.ps1`](./install.ps1) before running the one-command installer.

**macOS / Linux / WSL:**

```bash
curl -fsSL https://raw.githubusercontent.com/gloweaseco-leo/hyperdirector/main/install.sh | bash
```

**Windows PowerShell:**

```powershell
irm https://raw.githubusercontent.com/gloweaseco-leo/hyperdirector/main/install.ps1 | iex
```

**Scope:** This installs the **HyperDirector Skill Pack only**. Real rendering still depends on your local Hermes setup, **HyperFrames CLI**, **Node.js** (≥22), **FFmpeg**, and a browser environment supported by HyperFrames. HyperDirector is a director layer **on top of** HyperFrames — not a replacement for it.

After install, verify tooling:

```bash
node ~/.hermes/skills/hyperdirector/scripts/check-hyperframes-env.js
```

(On Windows, use `%USERPROFILE%\.hermes\skills\hyperdirector\scripts\check-hyperframes-env.js`.)

---

## What It Does

HyperDirector takes a text prompt from Hermes and runs a structured video production workflow:

```
User prompt
  → Hermes + HyperDirector skill
    → brief.json → storyboard.json → DESIGN.md → index.html
      → npx hyperframes lint / preview / render
        → final.mp4 + editable HTML source
```

It wraps [HyperFrames](https://github.com/heygen-com/hyperframes) (HTML-to-video engine by HeyGen) with a director layer: capability judgment, brand memory, template selection, QA fix loop, and delivery packaging.

## Optional Hermes Tweet Companion

For video briefs that depend on X/Twitter research, launch monitoring, audience
language, or approved publishing steps, this repository also includes an
optional Hermes Tweet companion skill:

```bash
hermes plugins install Xquik-dev/hermes-tweet --enable
mkdir -p ~/.hermes/skills/hermes-tweet
rsync -a companions/hermes-tweet/ ~/.hermes/skills/hermes-tweet/
hermes tools list
```

Use the companion to collect catalog-listed X/Twitter signals through Xquik,
then pass the approved findings into HyperDirector's brief and storyboard flow.
Writes stay gated by `HERMES_TWEET_ENABLE_ACTIONS=true`.

---

## Repository Layout

```
HyperDirector/
├── hyperdirector/        ← Hermes Skill Pack (install this into Hermes skills)
│   ├── SKILL.md          ← Hermes entry point
│   ├── docs/             ← User documentation (8 files, zh-CN)
│   ├── examples/         ← Complete demo projects
│   │   └── zh-CN/
│   │       ├── demo-article-to-video/
│   │       ├── demo-saas-product/
│   │       └── demo-github-repo/
│   ├── templates/        ← 3 built-in video templates
│   ├── workflows/        ← 7 workflow guides
│   ├── qa/               ← QA checklists and templates
│   ├── scripts/          ← Validation scripts (Node.js)
│   ├── schemas/          ← JSON Schema definitions
│   └── brand/            ← Brand Kit templates
├── output/               ← Generated video projects (not committed)
└── PRD.md                ← Product requirements document
```

---

## Prerequisites

| Dependency | Version | Install |
|---|---|---|
| Node.js | >= 22 | https://nodejs.org |
| HyperFrames CLI | latest | `npm install -g hyperframes` |
| FFmpeg | any recent | https://ffmpeg.org/download.html |
| Hermes | configured | see your Hermes docs |

---

## Quick Install

```bash
# 1. Verify environment
node hyperdirector/scripts/check-env.js

# 2. Copy skill to Hermes
cp -r hyperdirector/ ~/.hermes/skills/hyperdirector/

# 3. Verify skill loaded — ask Hermes:
#    "What templates does HyperDirector support?"

# 4. Set up Brand Kit
cp hyperdirector/brand/brand-kit.example.json ./brand-kit.json
# Edit brand-kit.json with your brand colors, fonts, CTA

# 5. Run first demo
open hyperdirector/examples/zh-CN/demo-article-to-video/output/preview.html
```

---

## Documentation

| Document | Description |
|---|---|
| [docs/quickstart.md](./hyperdirector/docs/quickstart.md) | Get started in 20 minutes |
| [docs/installation.md](./hyperdirector/docs/installation.md) | Full install guide (Node, FFmpeg, HyperFrames, Hermes) |
| [docs/first-video.md](./hyperdirector/docs/first-video.md) | Complete walkthrough: article → 30s video |
| [docs/brand-kit-setup.md](./hyperdirector/docs/brand-kit-setup.md) | Brand Kit configuration reference |
| [docs/template-guide.md](./hyperdirector/docs/template-guide.md) | Template selection and customization |
| [docs/faq.md](./hyperdirector/docs/faq.md) | Frequently asked questions |
| [docs/cursor-development-notes.md](./hyperdirector/docs/cursor-development-notes.md) | Developer notes: v0.1 scope, adding templates/workflows/rules |

---

## Templates (v0.1)

| Template | Aspect Ratio | Best For |
|---|---|---|
| `tiktok-vertical-kit` | 9:16 | WeChat Video, TikTok, YouTube Shorts |
| `saas-demo-kit` | 16:9 / 9:16 | Product demos, feature videos, launch announcements |
| `ai-knowledge-explainer-kit` | 9:16 | AI tutorials, open source project intros, tech explainers |

---

## Validation Scripts

```bash
node hyperdirector/scripts/check-env.js                    # check dependencies
node hyperdirector/scripts/validate-brand-kit.js <path>    # validate brand-kit.json
node hyperdirector/scripts/validate-brief.js <path>        # validate brief.json
node hyperdirector/scripts/validate-storyboard.js <path>   # validate storyboard.json
node hyperdirector/scripts/check-output-contract.js <dir>  # check output directory
node hyperdirector/scripts/check-composition-hazards.js <file.html>  # optional heuristic warnings (not lint)
```

---

*Powered by HyperFrames. Directed by Hermes. Packaged as HyperDirector.*
