# Agent Video OS

> An open-source framework for AI-driven video production pipelines.

---

## What is Agent Video OS?

Agent Video OS (AVOS) is a modular, agent-native framework that turns structured content into production-ready video. It provides the primitives that AI agents need to plan, compose, and render videos without manual intervention.

Think of it as the operating system layer between your AI agent and your video renderer.

---

## The Problem

Current video creation tools are built for humans, not agents:

- No structured schema for video intent (what should the video say and look like?)
- No agent-readable composition format (HTML + timeline is not agent-friendly)
- No automated quality gate (lint → validate → render with retry)
- No brand persistence layer (every video starts from scratch)

---

## Core Architecture

```
Input (text / article / README)
    ↓
[Brief Generator]       → brief.json
    ↓
[Storyboard Planner]    → storyboard.json
    ↓
[Scene Composer]        → index.html (HyperFrames)
    ↓
[QA Gate]               → lint → validate → render
    ↓
Output: final.mp4
```

### Key Primitives

| Module | Description |
|--------|-------------|
| `Brief` | Structured intent: platform, duration, goal, template |
| `Storyboard` | Scene-level plan: duration, purpose, headline, caption |
| `Composer` | Converts storyboard → HTML + GSAP timeline |
| `Brand Kit` | Persistent brand config: colors, fonts, CTA, safe_zone |
| `QA Gate` | lint → validate → render retry loop |

---

## Who Is It For?

- **AI Agent developers** building content automation pipelines
- **Content teams** who want to scale video production with AI
- **Technical creators** who understand HTML/CSS/JS and want fine-grained control

---

## Getting Started

```bash
# Install
npm install -g agent-video-os

# Initialize a project
avos init my-video-project

# Run with your content
avos run --input article.md --template ai-knowledge-explainer-kit --output ./output
```

---

## Status

- v0.1: Core primitives (Brief, Storyboard, Brand Kit, QA Gate)
- v0.2: Multi-template support (planned)
- v0.3: TTS + audio sync (planned)

---

*GitHub: github.com/agentvideos/agent-video-os*  
*License: MIT*
