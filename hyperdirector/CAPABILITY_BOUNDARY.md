# Capability Boundary

Defines what HyperDirector accepts, downgrades, and refuses. This is the reference for the `01-intake.md` Capability Judge step.

Chinese version → [CAPABILITY_BOUNDARY.zh-CN.md](./CAPABILITY_BOUNDARY.zh-CN.md)

---

## Classification Framework

Every incoming request gets classified into one of three buckets before any generation begins.

| Class | Condition | Action |
|---|---|---|
| **Suitable** | Request maps to a supported task type, content is safe, output format is achievable | Run full workflow |
| **Degraded** | Request is partially out of scope but a useful reduced version exists | Propose downgrade explicitly, wait for confirmation |
| **Reject** | Request is technically impossible, unsafe, unethical, or violates copyright | Decline with reason and alternatives |

**Never start generation without completing this classification step.**

---

## Suitable — Full Workflow

HyperDirector handles these natively. No qualification needed.

| Task Type | Input Examples | Default Template |
|---|---|---|
| Article → short video | WeChat articles, tech tutorials, industry analysis, listicles | `tiktok-vertical-kit` |
| Product demo | SaaS feature intro, app onboarding, launch announcement | `saas-demo-kit` |
| README → video | GitHub project intro, open source release video | `ai-knowledge-explainer-kit` |
| PRD → video | Roadmap walkthrough, feature spec for stakeholders | `saas-demo-kit` |
| Data visualization | Growth charts, ranked lists, before/after comparisons | `saas-demo-kit` |
| AI knowledge explainer | Agent workflow, RAG, local LLM, automation tutorial | `ai-knowledge-explainer-kit` |
| Brand marketing | Course promotion, community invite, tool introduction | `tiktok-vertical-kit` |
| Website → video | Landing page capture, event page, case study | `saas-demo-kit` |

**Intake response for suitable requests:**

```json
{
  "suitable": true,
  "task_type": "<detected>",
  "recommended_template": "<template>",
  "estimated_duration": "<Xs>",
  "risk_level": "low",
  "notes": ""
}
```

---

## Degraded — Offer Downgrade

These requests are partially outside scope. HyperDirector proposes what it *can* deliver and waits for user confirmation before proceeding. Never silently degrade.

| Original Request | HyperDirector Offers | What It Cannot Provide |
|---|---|---|
| Talking-head presenter video | TTS narration + animated captions + info cards | Real human face, lip movement |
| Live-action product advertisement | Branded title card + caption packaging + CTA overlay | Real footage, live action scenes |
| Long course video (>10 min) | Chapter-split short videos (≤60s each) | Single continuous long video |
| Complex 3D product animation | CSS transform animation + screenshot overlays | Real 3D render engine |
| Multi-language version | Caption layer + basic layout adaptation per language | Professional dubbing |
| Screen recording + voiceover demo | Static UI screenshots + animated pointer overlays | Live screen capture |
| Social media ad (15s punchy) | 15s variant from `tiktok-vertical-kit` | Professional motion design studio quality |

**Intake response for degraded requests:**

```
This request is partially outside HyperDirector's scope.

What HyperDirector can offer: [specific degraded version]
What it cannot provide: [specific limitation]

Shall I proceed with the degraded version?
```

---

## Reject — Must Decline

These requests must be declined. Provide a specific reason and a useful alternative where one exists.

### Technical Scope Rejections

| Request | Reason | Suggest |
|---|---|---|
| Photorealistic continuous video with real humans | HyperDirector generates HTML graphic video, not footage | Sora / Runway / Pika / Kling / Veo |
| Digital human with lip-sync to audio | No avatar rendering engine | HeyGen Studio / Synthesia / D-ID |
| Cinema-grade visual effects (explosions, VFX shots) | No 3D renderer, no compositing | Blender / Unreal / After Effects |
| Professional NLE editing of raw footage | Not a non-linear editor | Premiere Pro / DaVinci Resolve / CapCut |
| Real-time live streaming | No broadcast capability | OBS / Streamlabs |
| Complex rigged 3D character animation | No skeletal animation system | Blender / Maya / Unreal |

### Content Safety Rejections

| Request | Reason |
|---|---|
| Sexually explicit content | Policy violation — hard block |
| Graphic violence or gore | Policy violation — hard block |
| Fraudulent claims (guaranteed investment returns, miracle cures) | Policy violation — false promises |
| Medical diagnosis or treatment guarantee in video | Policy violation — unverifiable professional claim |
| Legal advice presented as definitive | Policy violation |
| Impersonating a real individual | Policy violation — identity fraud risk |
| Fabricating quotes or statements from real people | Policy violation |

### Copyright / IP Rejections

| Request | Response |
|---|---|
| "Make it look exactly like [Brand X]'s ads" | Decline exact replication. Offer: original design in a similar aesthetic direction |
| "Copy [Influencer Y]'s intro style precisely" | Decline exact copy. Offer: original design with comparable energy/pacing |
| Reproduce specific copyrighted film/TV visuals | Decline. Offer: original style description |
| Reuse trademarked logos or brand marks | Decline unless user confirms they own the asset |

---

## Intake Decision Tree

```
Receive user request
│
├─ Is the content safe? ──────────────────── No → REJECT (content safety)
│
├─ Is it photorealistic / avatar / NLE? ──── Yes → REJECT (scope) + suggest tool
│
├─ Does it map to a supported task type? ─── Yes → SUITABLE → proceed
│
├─ Does a useful degraded version exist? ─── Yes → DEGRADED → propose + confirm
│
└─ None of the above → REJECT (scope) + explain HyperDirector's actual capability
```

---

## Say-No Response Templates

### Photorealistic / generative video
```
This request requires photorealistic video generation.
HyperDirector creates HTML-based graphic video (animated text, data viz, brand motion graphics) — not live-action footage.

I can offer: animated script + TTS narration + branded motion graphics version.
For photorealistic footage: Sora / Runway / Pika / Kling.
```

### Digital human
```
HyperDirector does not support digital human lip-sync.
I can offer: TTS voice narration + animated captions + info card layout.
For AI avatar video: HeyGen Studio / Synthesia / D-ID.
```

### Exact brand / influencer replication
```
Replicating [name]'s specific visual identity exactly is not supported.
I can create an original video with a similar aesthetic direction: [describe style].
Would you like to proceed with an original design?
```

### Long video
```
HyperDirector v0.1 targets 15–60 second videos.
I can split your content into [N] chapter videos of ~[X]s each.
Would you like to proceed with a chapter-based approach?
```

---

## Capability Checks in Intake Prompt

`prompts/01-intake.md` must evaluate four dimensions:

| Dimension | Check |
|---|---|
| Task type | Does it map to a supported type above? |
| Output format | Is the expected output (duration, aspect ratio) within spec? |
| Content safety | Does it pass all content policy checks? |
| Resources | Are required assets (brand-kit, input content) available or inferable? |

All four must pass for **Suitable**. Partial pass may qualify for **Degraded**. Any hard policy failure → **Reject**.
