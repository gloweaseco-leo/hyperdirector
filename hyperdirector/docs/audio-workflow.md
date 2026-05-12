# Audio Director Workflow

> Version: v0.1.3-preview  
> Applies to: HyperDirector + Hermes (Cursor Agent)  
> Rules: `rules/audio-director-rules.md`  
> Schemas: `schemas/audio-manifest.schema.json` / `schemas/caption-timeline.schema.json`  
> QA: `qa/audio-qa-checklist.md`

---

## What Audio Director Is

Audio Director is the **audio planning layer** in HyperDirector. It is not a TTS tool.

Its responsibility is to organise scripts, voice segments, voice profiles, provider-neutral TTS plans, audio manifests, caption timelines, and audio/video sync relationships into a reviewable pipeline.

Audio Director does **not**:
- Directly call TTS providers to generate audio
- Clone voices (without explicit authorisation)
- Perform audio waveform analysis or compression
- Search the internet for narration content (when web research is needed, use Hermes official built-in `web_search` / `web_extract` capabilities)
- Replace the HyperFrames render engine

---

## Relationship to Other Pipelines

```
Storyboard (scene_id / shot_id canonical index)
       │
       ├─→ Source Image Pipeline → asset-manifest.json
       │
       ├─→ Audio Director Pipeline
       │       │
       │       ├─→ audio-manifest.json    (audio segment declarations)
       │       └─→ caption-timeline.json  (subtitle/caption alignment)
       │
       └─→ Render Planning (reads image + audio + caption together)
```

- Image assets → `asset-manifest.json` (bound by scene_id / slot)
- Audio segments → `audio-manifest.json` (bound by scene_id / shot_id)
- Captions → `caption-timeline.json` (linked by scene_id / segment_id)

`storyboard.json` remains the single authoritative index for `scene_id` and `shot_id`.

---

## Pipeline Stages

### Stage 1 — Extract Audio Intent

From each scene in `storyboard.json`, determine:
- Whether narration is needed (or pure text captions / silence)
- Approximate narration content and tone
- Suggested pace relative to scene `duration`

For web research content, use Hermes official `web_search` / `web_extract` — Audio Director does not implement its own search capability.

### Stage 2 — Split Voice Segments

Divide full narration into scene-level (or shot-level) segments:
- One `segment_id` per scene or per shot
- Chinese: 30–80 characters per segment
- English: 20–60 words per segment
- Target: segment duration ≤ scene duration × 1.0

### Stage 3 — Define Voice Profile

For simple projects: record `speaker_id`, `provider`, and `voice_name` directly in each `audio-manifest.json` segment.  
For complex projects (Pro): define a `voice-profile.schema.json` entry and reference it via `voice_profile_id`.

### Stage 4 — Provider-Neutral TTS Planning

Select a TTS provider and record it in the `provider` field. Follow R-AUD-09 provider-neutral design:
- `text` and `language` fields must be self-contained
- A fallback provider must be plannable from the same fields

Optional provider directions (none are default dependencies):

| Provider | Type | Use case |
|----------|------|----------|
| `edge-tts` | System-level TTS, no API key | Fallback, rapid prototyping |
| `cosyvoice` | Local high-quality Chinese TTS | Chinese narration, local install |
| `chattts` | Local dialogue TTS | Dialogue scenes, experimental |
| `fish_audio` | Commercial API | High-quality multi-language |
| `minimax` | Commercial API | High-quality Chinese |

Do not commit API keys. Do not add these as default dependencies.

### Stage 5 — Generate audio-manifest.json

Initial state: all segments have `render_safe: false`, `local_path` contains the planned path (files not yet generated).

### Stage 6 — Generate caption-timeline.json

Captions can exist independently of audio. A caption entry without a `segment_id` is a text-only caption.

Alignment: `start_ms` / `end_ms` in captions should match the corresponding audio segment timing within ±500ms.

### Stage 7 — Audio File Production

User generates audio files with the chosen TTS provider (or records manually) and places them in `output/assets/audio/`.

Update `audio-manifest.json`:
- `duration_ms` — from file metadata
- `start_ms` / `end_ms` — from timeline plan
- `transcript` — actual TTS output text or manual record

### Stage 8 — Audio / Video Sync QA

```bash
node hyperdirector/scripts/check-composition-hazards.js output/index.html
```

Complete `qa/audio-qa-checklist.md`. Set `render_safe: true` for each cleared segment.

### Stage 9 — Render Planning

Reference audio by local path in `index.html`:

```html
<!-- Correct: local path -->
<audio id="narration_s01" src="assets/audio/seg_scene01_hook.mp3" preload="auto"></audio>

<!-- Forbidden in production -->
<!-- <audio src="https://..."></audio> -->
```

### Stage 10 — Render and Delivery

```bash
npx hyperframes render --input output/index.html --output output/final.mp4
```

---

## Safety and Authorisation Boundaries

| Allowed | Forbidden |
|---------|-----------|
| Standard TTS synthesis (`tts_only`) | Unauthorised voice cloning |
| Voice cloning with written consent (`consent_obtained`) | API keys in manifest |
| Provider metadata (no credentials) | Real audio samples committed to git |
| `edge-tts` as fallback | Model weights committed to git |
| Planning audio pipeline (no API calls) | Silently calling commercial TTS API |

---

## Related Files

| File | Purpose |
|------|---------|
| `rules/audio-director-rules.md` | R-AUD-01 – R-AUD-11 rule definitions |
| `schemas/audio-manifest.schema.json` | Audio Manifest JSON Schema |
| `schemas/caption-timeline.schema.json` | Caption Timeline JSON Schema |
| `qa/audio-qa-checklist.md` | Pre-render audio QA checklist |
| `scripts/check-composition-hazards.js` | Advisory hazard scan (includes audio) |
| `docs/audio-workflow.zh-CN.md` | Chinese version of this document |
| `docs/source-image-workflow.md` | Source Image Pipeline workflow |
