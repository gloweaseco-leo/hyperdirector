# Audio Director Rules

> Referenced by: `SKILL.md`, `qa/audio-qa-checklist.md`, `docs/audio-workflow.zh-CN.md`  
> Enforcement: BLOCKING rules must pass before production render; WARNING rules should be resolved; ADVISORY rules record intent in DESIGN.md if skipped.
>
> Audio Director is the audio planning layer above TTS providers. It is not a TTS tool. It organises scripts, voice segments, voice profiles, provider-neutral TTS plans, audio manifests, caption timelines, and audio/video sync into a reviewable pipeline.

---

## Rule Classification

| Level | Meaning |
|-------|---------|
| **BLOCKING** | Render must not proceed. Fix before invoking `npx hyperframes render`. |
| **WARNING** | Render may succeed but output may have quality or compliance issues. Fix recommended. |
| **ADVISORY** | Best practice. Record in DESIGN.md if deliberately skipped. |

---

## R-AUD-01 · All Audio Files Must Be Local Before Production Render  `BLOCKING`

Production compositions must not reference remote audio URLs. All audio files used in final render must exist as local files at `local_path` (relative to project output root).

**Violation:**
```html
<audio src="https://cdn.example.com/narration.mp3"></audio>
```

**Correct:**
```html
<audio src="assets/audio/scene01_narration.mp3"></audio>
```

**Exception:** A remote URL may appear in preview / draft mode only if the `audio-manifest.json` entry has `"render_safe": false`. Set `render_safe: true` only after the local file is confirmed present.

---

## R-AUD-02 · `render_safe` Must Be `true` for All Audio Segments Before Production Render  `BLOCKING`

Every `audio-manifest.json` entry consumed in the final render must have `"render_safe": true`.

An audio segment is render-safe when:
1. `local_path` file exists.
2. `format` is an approved audio format (see R-AUD-05).
3. `consent_status` is `not_applicable`, `tts_only`, or `consent_obtained`.
4. No API keys or credential strings appear in the manifest (see R-AUD-04).
5. `transcript` is populated (non-empty string).

---

## R-AUD-03 · `consent_status` Must Not Be `unknown` or `consent_pending` Before Render  `BLOCKING`

Segments where `consent_status` is `"unknown"` or `"consent_pending"` must not be included in a production render.

| consent_status | Meaning | render_safe allowed? |
|----------------|---------|----------------------|
| `not_applicable` | No TTS, no voice cloning (silent video, sound effects only) | Yes |
| `tts_only` | Standard TTS with provider-licensed voices; no cloning or personal voice simulation | Yes |
| `consent_obtained` | Voice cloning / personal voice replication with written consent on record | Yes — requires `consent_notes` or `consent_ref` |
| `consent_pending` | Consent process started but not confirmed | **No** |
| `unknown` | Source unknown; whether cloning is involved is unclear | **No** |

**Important:** `tts_only` must not be used when the voice is intended to simulate a specific real person (celebrity, public figure, client, employee, streamer, teacher). Any deliberate personal resemblance requires `consent_obtained`.

---

## R-AUD-04 · No API Keys or Credentials in audio-manifest.json  `BLOCKING`

`audio-manifest.json` must not contain any of the following in any string field:
- API keys (patterns like `sk-`, `Bearer `, `token=`, long hex/base64 strings in `notes` or `provider_metadata`)
- Account passwords or secrets
- Service URLs with embedded credentials (`https://user:pass@...`)

**Rationale:** `audio-manifest.json` may be committed to version control. It must never carry secrets.

---

## R-AUD-05 · Approved Audio Formats  `ADVISORY`

Preferred formats for video composition audio:

| Format | Notes |
|--------|-------|
| MP3 | Widest compatibility; recommended for voice narration |
| WAV | Lossless; larger files; use for archival or source audio |
| M4A / AAC | Good compression; HyperFrames-compatible |
| OGG | Open format; usable but less universal |
| OPUS | High efficiency; verify HyperFrames version supports it |

Avoid: FLAC in browser-based compositions (limited support), proprietary formats.

---

## R-AUD-06 · No Unauthorized Voice Cloning  `BLOCKING`

Voice cloning of any real person (including public figures, employees, clients, or the user themselves) requires explicit written consent from the person whose voice is being replicated.

- `cloning_allowed` in voice profile defaults to `false`.
- `consent_required` in voice profile defaults to `true`.
- Any segment using a cloned voice must have `consent_status = "consent_obtained"` and a reference in `consent_notes`.

**HyperDirector does not provide, recommend, or assist with unauthorized voice cloning workflows.**

---

## R-AUD-07 · Audio Segment Duration Must Be Reasonable Relative to Scene Duration  `WARNING`

The total `duration_ms` of audio segments bound to a scene should not exceed the scene's `data-duration` (from storyboard) by more than 10%.

| Condition | Action |
|-----------|--------|
| Segment duration > scene duration × 1.1 | WARNING — audio will be cut off or scene must be extended |
| Segment duration < scene duration × 0.5 | ADVISORY — significant silence; intentional? Record in notes |
| No `duration_ms` recorded | WARNING — cannot validate timing |

**Note:** This check is advisory at manifest level. Authoritative timing validation requires actual audio playback. Do not introduce ffmpeg probing as a mandatory step.

---

## R-AUD-08 · Caption Text Should Match Transcript  `WARNING`

The `text` field in `caption-timeline.json` for a given segment should closely match the `transcript` in `audio-manifest.json` for the same `segment_id`.

Acceptable differences:
- Minor punctuation adjustments
- Line break insertions for display purposes
- Abbreviated repetitions for reading comfort

Unacceptable:
- Caption text conveying different meaning than transcript
- Missing sentences or added sentences relative to transcript
- Hardcoded text contradicting the audio content

---

## R-AUD-09 · Provider-Neutral Design Required  `ADVISORY`

`audio-manifest.json` must not hard-bind to a single TTS provider. The `provider` field should describe the provider used for a specific segment, but the overall pipeline must support provider substitution.

**Design principle:** If the preferred provider is unavailable, a fallback (`edge-tts` or another approved provider) should be able to regenerate the segment from the same `text` and `language` fields without breaking the manifest structure.

Fallback providers:
- `edge-tts` — system-level TTS, no API key required, available on Windows/macOS/Linux via the `edge-tts` Python package (optional, not a default dependency)

---

## R-AUD-10 · No Real Audio Samples in Version Control  `BLOCKING`

Generated or recorded audio files must not be committed to the git repository.

**Add to `.gitignore`:**
```
output/assets/audio/
```

`audio-manifest.json` declares asset metadata. The actual audio files are local-only artifacts.

---

## R-AUD-11 · No AI Voice Services as Default Pipeline Dependencies  `ADVISORY`

Do not wire commercial TTS/voice AI services (Fish Audio, MiniMax, ElevenLabs, etc.) into the default HyperDirector install or default workflow. Hermes must not make outbound calls to voice generation APIs without explicit user confirmation per session.

**Allowed:** Planning a TTS strategy using `audio-manifest.json` with `provider` recorded after user selects a provider. The manifest records what provider was used; it does not invoke providers.

**Violation:** A prompt or workflow that silently calls an external TTS API during storyboard or render generation.

---

## Summary: Quick Reference

| Rule | Level | Topic |
|------|-------|-------|
| R-AUD-01 | BLOCKING | No remote audio URLs in production |
| R-AUD-02 | BLOCKING | render_safe must be true |
| R-AUD-03 | BLOCKING | consent_status must be confirmed |
| R-AUD-04 | BLOCKING | No API keys in manifest |
| R-AUD-06 | BLOCKING | No unauthorized voice cloning |
| R-AUD-10 | BLOCKING | No audio files in version control |
| R-AUD-07 | WARNING | Segment duration vs scene duration |
| R-AUD-08 | WARNING | Caption matches transcript |
| R-AUD-05 | ADVISORY | Approved audio formats |
| R-AUD-09 | ADVISORY | Provider-neutral design |
| R-AUD-11 | ADVISORY | No AI voice services as default |

Advisory scan (non-blocking, exit 0):
```bash
node hyperdirector/scripts/check-composition-hazards.js output/index.html
```
