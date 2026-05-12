# Release Notes — v0.1.3-preview

**Title:** v0.1.3-preview — Media Asset Pipeline: Source Images + Audio Director

**Theme:** This release extends HyperDirector from rendering stability rules into a full media asset pipeline, adding image asset management and an audio director layer for voiceover planning, provider-neutral TTS contracts, caption alignment, and audio/video QA.

> Builds on v0.1.2-preview Rendering Stability Hardening. This release remains preview status. All audio providers are optional directions only — none are default dependencies.

---

## 1. Overview

v0.1.3-preview upgrades HyperDirector to include a unified Media Asset Pipeline with two tracks:

**Track 1 — Source Image Pipeline**  
Identifies, organises, binds, and validates image assets (screenshots, logos, PPT/PDF visuals, diagrams, product photos) into `asset-manifest.json`, with scene/shot/slot binding and pre-render QA.

**Track 2 — Audio Director**  
Organises scripts, voice segments, voice profiles, provider-neutral TTS plans, audio manifests, caption timelines, and audio/video sync relationships into a reviewable pipeline. Audio Director is the audio planning layer — it is not a TTS tool and does not call TTS providers by default.

**Unified indexing:**
- Image assets → `asset-manifest.json`
- Audio segments → `audio-manifest.json`
- Captions → `caption-timeline.json`
- Storyboard remains the canonical index for `scene_id` / `shot_id`

---

## 2. Source Image Pipeline

### Public additions (`hyperdirector/`)

- **New:** `rules/image-assets-basics.md` — R-IMG-01 to R-IMG-09. Two BLOCKING rules: no remote URLs in production (R-IMG-01); `render_safe` must be `true` before render (R-IMG-09). Advisory rules cover approved formats, file size thresholds (5 MB warning), asset manifest requirements, and prohibition on AI image generation services in default pipeline.
- **New:** `schemas/asset-manifest.schema.json` — Image asset manifest JSON Schema (draft-07). Supports 16-value `role` enum (+ `custom`), optional `variants` array for multi-resolution/format alternatives, `bindings` array for multi-scene/slot assignment, `license_status` enum, and `render_safe` flag.
- **New:** `qa/image-asset-checklist.md` — 8-section pre-render checklist covering file existence, localisation (no remote URLs), alt attributes, file size, manifest field completeness, licence/authorisation, scene bindings, and `render_safe` confirmation.
- **New:** `docs/source-image-workflow.zh-CN.md` — 7-stage Chinese image workflow: Identify → Organise → Manifest → Variants → HTML Binding → Readiness Check → Render.
- **New:** `docs/source-image-workflow.md` — English counterpart.
- **Enhanced:** `scripts/check-composition-hazards.js` — Image advisory checks: `<img src>` remote URL, CSS `background-image` remote URL, `<img>` missing `alt`, SVG external reference risk, local image path not found, local image file > 5 MB.

### Pro additions (`hyperdirector-pro/pro-templates/visual/`)

- `source-image-pipeline.md` — Full pipeline Hermes operation script (Steps 0–5) with standard directory layout.
- `image-role-taxonomy.md` — 16-role classification reference with per-project-type role combinations, `custom_role` naming conventions, `license_status` guide, platform dimension reference.
- `pptx-image-extraction-workflow.md` — PPTX extraction: 3 optional methods (LibreOffice headless / unzip + ppt/media / screenshot fallback) with Hermes instruction templates.
- `pdf-page-to-scene-workflow.md` — PDF extraction: 4 optional tools (poppler / mutool / ImageMagick / pdf2pic) with aspect-ratio adaptation strategies.
- `ui-screenshot-video-template.md` — UI screenshot video template: screenshot standards, 6-scene structure, Hermes instruction templates, HTML reference layout, animation suggestions.

---

## 3. Audio Director

### Public additions (`hyperdirector/`)

- **New:** `rules/audio-director-rules.md` — R-AUD-01 to R-AUD-11. Six BLOCKING rules: no remote audio URLs in production (R-AUD-01); `render_safe` must be `true` (R-AUD-02); `consent_status` must be confirmed (R-AUD-03); no API keys in manifest (R-AUD-04); no unauthorised voice cloning (R-AUD-06); no audio files in version control (R-AUD-10). Warning rules cover segment/scene duration alignment (R-AUD-07) and caption-transcript consistency (R-AUD-08).
- **New:** `schemas/audio-manifest.schema.json` — Audio segment manifest JSON Schema (draft-07). Key fields: `segment_id`, `scene_id`, `shot_id`, `text`, `language`, `provider`, `voice_name`, `local_path`, `format`, `duration_ms`, `start_ms`, `end_ms`, `transcript`, `caption_ref`, `render_safe`, `consent_status` (5-value enum: `not_applicable` / `tts_only` / `consent_obtained` / `consent_pending` / `unknown`), `consent_notes` (required when `consent_obtained`), `provider_metadata` (no credentials).
- **New:** `schemas/caption-timeline.schema.json` — Independent caption timeline JSON Schema. Captions can exist without audio (text-only subtitles). Links to `audio-manifest.json` via `segment_id` / `scene_id`. Supports `style` enum (default / highlight / whisper / shout / aside / warning), `emphasis` array, `max_chars_per_line`, `line_count`.
- **New:** `qa/audio-qa-checklist.md` — 10-section pre-render audio QA checklist covering file existence, `segment_id` uniqueness, scene bindings, transcript and caption alignment, duration validation, provider/manifest security, consent and cloning authorisation, version control safety, caption timeline completeness.
- **New:** `docs/audio-workflow.zh-CN.md` — 10-stage Chinese audio workflow: Audio Intent → Voice Segments → Voice Profile → Provider Planning → audio-manifest → caption-timeline → Audio Production → Sync QA → Render Planning → Render.
- **New:** `docs/audio-workflow.md` — English counterpart.
- **Enhanced:** `scripts/check-composition-hazards.js` — Audio advisory checks: `<audio src>` remote URL, `<source src>` remote URL, `<audio>` missing src, local audio path not found, local audio file > 10 MB, heuristic API key / token pattern detection in HTML.

### Pro additions (`hyperdirector-pro/pro-templates/audio/`)

- `audio-director-workflow.md` — Full Audio Director Hermes operation script (Steps 0–6) with standard directory layout.
- `voice-profile.schema.json` — Voice persona schema with `provider_preferences` array, `cloning_allowed` (default `false`), `consent_required` (default `true`), prosody parameters (`pace`, `pitch`, `energy`, `emotion`).
- `tts-provider-contract.md` — Provider-neutral TTS contract definition. Documents 5 optional provider directions: `edge-tts` (fallback, no API key), `cosyvoice` (local, optional), `chattts` (experimental, optional), `fish_audio` (commercial API, optional), `minimax` (commercial API, optional). All are optional directions only.
- `prosody-markup-guide.md` — Prosody markup guide: pause annotations (punctuation and SSML `<break>`), rate control (SSML `prosody rate`), emphasis markup, style/emotion switching, Chinese voiceover rhythm table (characters/second by speed setting).
- `audio-video-sync-pro.md` — Audio/video sync strategies: timeline planning from storyboard duration, text length estimation table, common sync issues with resolution steps, lightweight caption-audio alignment check script.
- `chinese-short-video-voiceover-guide.md` — Chinese short video voiceover guide: per-scene narration templates (hook / problem / feature / result / CTA), platform-specific pacing reference (WeChat Video / Douyin / Bilibili / Xiaohongshu), Chinese-English mixed reading notes.
- `research-video-voiceover-template.md` — Research video narration templates (knowledge explainer / GitHub project review / AI tool review / industry analysis). Explicitly states: web research uses Hermes official `web_search` / `web_extract` — HyperDirector does not implement its own search capability.

---

## 4. Media Asset QA Hardening

- `qa/pre-render-checklist.md` — New Section 9 (Media Asset Pipeline) with subsections for image assets (9a), audio files (9b), caption timeline (9c), and advisory scan command (9d).
- `SKILL.md` — Standard Output updated with 3 optional media asset files (`asset-manifest.json`, `audio-manifest.json`, `caption-timeline.json`). Rules references expanded with `image-assets-basics.md` and `audio-director-rules.md`. New "Optional Media Asset Pipeline" section at end of file.
- `scripts/check-composition-hazards.js` — Now covers: remote fonts, GSAP CDN, emoji, `@media` composition risk, CSS translate + GSAP scale conflict, `<img>` remote src / missing alt / local path / file size, CSS `background-image` remote URL, SVG external references, `<audio>` remote src / missing src / local path / file size, API key heuristic detection. Always advisory only. Always exit 0. No new dependencies.

---

## 5. Safety and Boundaries

- No models, weights, or model configuration committed.
- No API keys or credentials in any file.
- No real audio samples committed.
- No real image assets committed.
- No unauthorized voice cloning workflows.
- No AI image generation service wired into default pipeline.
- `hyperdirector-pro/` not synced to public repo.
- `install.ps1` / `install.sh` not modified.
- No new npm or pip mandatory dependencies added.
- Web search capability provided by Hermes official built-in tools only; HyperDirector does not implement its own search, crawler, or search API adapter.

---

## 6. Upgrade Notes

- Builds on v0.1.2-preview Rendering Stability Hardening.
- Media Asset Pipeline is optional — not required for every project.
- All TTS provider directions are optional and user-selected. `edge-tts` is documented as fallback.
- `consent_status: "tts_only"` must not be used to simulate specific real persons — any deliberate personal voice resemblance requires `consent_obtained`.
- Audio Director answers: which voice belongs to which scene; which caption aligns to which segment; which provider generated the audio; whether files exist; whether durations match; whether consent is documented; whether the project is render-safe.

---

## 7. Suggested Release Command

```powershell
cd D:\Projects\HyperDirector

.\tools\release-public.ps1 `
  -Message "docs: add media asset pipeline with source images and audio director" `
  -Tag "v0.1.3-preview" `
  -ReleaseTitle "v0.1.3-preview — Media Asset Pipeline: Source Images + Audio Director" `
  -ReleaseBodyFile "D:\Projects\HyperDirector\RELEASE_NOTES_v0.1.3-preview.md"
```

If push fails, do not re-commit or re-tag. Retry only:
```powershell
git push origin main
git push origin v0.1.3-preview
```
