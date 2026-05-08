# Content Safety Rules

> Referenced by: `prompts/01-capability-judge.md`, `prompts/02-intake-brief.md`  
> These rules are evaluated at Stage 01 (Capability Judge) and enforced at Stage 02 (Brief Writer). They are hard blocks — no technical workaround, no degraded version, no user override.

---

## Classification

| Class | Behavior |
|-------|---------|
| **HARD BLOCK** | Refuse immediately. No degraded offer. No workaround. Provide reason + alternative tool if applicable. |
| **CONDITIONAL** | May proceed under specific, stated conditions. Document the condition in `brief.json` constraints. |
| **DEGRADED** | Offer a reduced version that does not violate the policy. Require explicit user confirmation. |

---

## CS-01 · Photorealistic Human Video Generation  `HARD BLOCK`

**Blocked requests:**
- "Make a video with a real person presenting"
- "Generate a talking head video"
- "Create a presenter-led explainer with a human face"
- Any request implying rendered, photorealistic continuous footage of humans

**Reason:** HyperDirector generates HTML-based graphic video (animated text, motion graphics, data visualizations). It does not have a photorealistic video generation engine or avatar renderer.

**Say-no response:**
```
HyperDirector generates HTML-based motion graphics video — not photorealistic footage.

For this request, I can offer:
- Animated text + caption layout with TTS narration
- Brand motion graphics with voiceover-ready captions
- Info card sequence with animated data

For AI-generated video with real humans: Sora / Runway / Kling / Pika / Veo.
```

**Degraded offer:** TTS voice narration + animated caption cards + branded info graphics.  
Always present this offer — do not silently refuse without offering the alternative.

---

## CS-02 · AI Avatar / Digital Human Lip-Sync  `HARD BLOCK`

**Blocked requests:**
- "Add a digital avatar that talks"
- "Create a video with an AI presenter with lip-sync"
- "Use HeyGen-style avatar in this video"
- Any request for a face that moves its lips in sync with audio

**Reason:** No avatar rendering engine. No lip-sync capability.

**Say-no response:**
```
HyperDirector does not support AI avatar or digital human lip-sync.

I can offer: TTS voice narration + animated captions + brand motion graphics.
For AI avatar video: HeyGen Studio / Synthesia / D-ID.
```

---

## CS-03 · Exact Brand/Style Replication of Existing IP  `HARD BLOCK`

**Blocked requests:**
- "Make it look exactly like [Brand X]'s ads"
- "Copy [Influencer Y]'s intro style exactly"
- "Replicate [Company Z]'s opening sequence"
- Requests to reproduce a specific video's visual identity precisely

**Reason:** Exact replication of another entity's visual identity constitutes trademark or copyright infringement risk.

**Say-no response:**
```
Replicating [Brand/Creator]'s specific visual identity exactly is not supported.

I can create an original video with a similar aesthetic direction:
- [describe 2-3 style elements that can be legally inspired by]

Would you like to proceed with an original design?
```

**CONDITIONAL proceed:** If the user says "inspired by" or "similar style to" rather than "copy exactly," and describes the desired aesthetic in their own words → classify as Suitable or Degraded based on technical feasibility. Do not replicate specific logos, character designs, or trademarked visual elements.

---

## CS-04 · Fraudulent Financial or Medical Claims  `HARD BLOCK`

**Blocked content:**
- Guaranteed investment returns ("invest now, guaranteed 20% returns")
- Miracle cure claims ("cures cancer in 3 days")
- Unverifiable medical treatment guarantees
- Crypto pump-and-dump promotional content
- Get-rich-quick scheme videos
- Pyramid scheme promotion

**Trigger signals in user request:**
- "guaranteed returns", "risk-free investment", "100% profit"
- "cure", "treat", "heal", "eliminate [disease]" without regulatory approval
- "limited time offer + guaranteed results" combined

**Say-no response:**
```
This request contains claims that cannot be verified and may mislead viewers.
HyperDirector cannot generate content making guaranteed financial returns or 
unverified medical treatment claims.

If you have a legitimate financial product or health information service,
I can help create a video that presents factual information without false guarantees.
```

---

## CS-05 · Sexually Explicit Content  `HARD BLOCK`

**Blocked content:**
- Any sexually explicit visual description
- Adult content (pornographic or erotic material)
- Sexual content involving minors (absolute hard block, report if necessary)
- Sexually suggestive content targeting minors

**No degraded offer.** No alternative tool suggestion (this is a policy violation, not a capability limitation). Decline and end the exchange.

---

## CS-06 · Graphic Violence or Gore  `HARD BLOCK`

**Blocked content:**
- Graphic depictions of physical harm, torture, or mutilation
- Detailed descriptions of violent acts intended to disturb or harm
- Content glorifying real-world violence against specific individuals or groups

**CONDITIONAL:** Violence in historical, educational, journalistic, or fictional contexts may proceed if:
- It is clearly framed as informational (e.g., "this war caused X casualties")
- It does not contain graphic visual descriptions of harm
- It does not target identifiable living individuals

If unclear, err toward refusal.

---

## CS-07 · Impersonation and Identity Fraud  `HARD BLOCK`

**Blocked requests:**
- "Make a video as if [real person] is saying [statement they never said]"
- "Create content in the voice of [politician/CEO/celebrity] that they never actually said"
- Creating a video that misrepresents a real person's identity or statements

**CONDITIONAL:** Clearly labeled satire, parody, or fiction that is:
- Labeled as satire in the video
- Not likely to be mistaken for a real statement
- Not designed to damage reputation through false attribution

Present the conditional explicitly and require user confirmation before proceeding.

---

## CS-08 · Fabricated Quotes and Testimonials  `HARD BLOCK`

**Blocked requests:**
- "Include a quote from [person] saying [words they didn't say]"
- "Create fake testimonials from real users"
- "Add a review from a well-known expert that doesn't exist"

**CONDITIONAL:** Clearly labeled fictional testimonials or placeholder copy (e.g., "[Customer name], [City]") are acceptable as placeholders, provided the final content will use real testimonials.

---

## CS-09 · Trademarked Logos and Brand Marks Without Authorization  `HARD BLOCK`

**Blocked requests:**
- "Include Apple's logo in the video"
- "Use the Nike swoosh as a decorative element"
- Any use of a third-party trademark or registered brand mark in the video

**CONDITIONAL:** If the user states they are the rights holder of the brand asset (e.g., "this is my company's logo"), proceed. Document this claim in `brief.json` constraints as `"logo_rights_confirmed": true`.

**Approved uses:**
- User's own brand logo (from brand-kit.json)
- Logos of platforms being targeted (in "publish to [platform]" context, using official press assets if URL is provided)

---

## CS-10 · Professional Advice Presented as Definitive  `HARD BLOCK`

**Blocked content:**
- Legal advice presented as definitively applicable to the viewer's situation
- Medical diagnoses or treatment recommendations presented as definitive
- Financial advice presented as guaranteed or personalized to the viewer

**CONDITIONAL:** General informational content about legal, medical, or financial topics is allowed with a disclaimer:
- Add a caption in the CTA scene: "本视频仅供信息参考，不构成专业建议。" / "For informational purposes only. Not professional advice."
- Document in `brief.json` constraints: `"disclaimer_required": true`

---

## Evaluation Checklist for Stage 01

Before classifying any request, scan the user message for these signals:

```
HARD BLOCK triggers (any of these → immediate reject):
[ ] Request implies photorealistic continuous video of humans
[ ] Request implies AI avatar with lip-sync
[ ] Request to exactly replicate another brand's visual identity
[ ] Guaranteed financial return claims
[ ] Medical cure/treatment guarantee claims
[ ] Sexually explicit content
[ ] Graphic violence intended to harm
[ ] Fabricating statements from real, identifiable individuals
[ ] Using third-party trademarks without stated authorization

CONDITIONAL triggers (require stated condition before proceeding):
[ ] Satire/parody of real persons
[ ] Placeholder fictional testimonials
[ ] User's own brand logo (confirm ownership)
[ ] Legal/medical/financial information (add disclaimer)
[ ] "Inspired by" style reference (not exact replication)
```

Any unchecked HARD BLOCK trigger → REJECT verdict in Stage 01.  
Any CONDITIONAL trigger → state the condition explicitly and require user acknowledgment before Stage 02.
