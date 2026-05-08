# Composer Guide — tiktok-vertical-kit

## Intent
Short-form vertical video for TikTok, WeChat Channels, YouTube Shorts, and Bilibili Story.
Hook-first, 3-point structure, punchy copy. 15–60 seconds. Information-dense but mobile-first.

## Scene Sequence

| Position | ID | Purpose | Recommended Duration | Required |
|----------|----|---------|---------------------|----------|
| 1 | scene_01 | hook | 3–5s | Yes |
| 2 | scene_02 | point_1 | 6–10s | Yes |
| 3 | scene_03 | point_2 | 6–10s | Yes |
| 4 | scene_04 | point_3 | 6–10s | Yes |
| 5 | scene_05 | cta | 3–5s | Yes |

For shorter durations (15s), compress point scenes to 3–4s each. Keep hook and CTA.
For longer durations (60s), add `context` scene after hook, or split points into sub-scenes.

## Substitution Guide

All `{{placeholder}}` values come from `storyboard.scenes[i]`:

| Placeholder | Source Field | Max Length | Notes |
|------------|-------------|------------|-------|
| `{{title}}` | `storyboard.title` | — | HTML `<title>` only |
| `{{hook_accent}}` | `scenes[0].headline` first 2–3 words | 20 chars | Colored keyword in hook |
| `{{hook_headline}}` | `scenes[0].headline` remainder | 40 chars | White text after accent |
| `{{hook_subhead}}` | `scenes[0].visual` summary | 30 chars | Optional hook support text |
| `{{caption_01}}` | `scenes[0].caption` | 60 chars | Subtitle text |
| `{{point1_headline}}` | `scenes[1].headline` | 30 chars | Large text above card |
| `{{point1_card_title}}` | First sentence of `scenes[1].visual` | 40 chars | Card big text |
| `{{point1_card_body}}` | `scenes[1].caption` | 80 chars | Card supporting text |
| `{{caption_02}}` | `scenes[1].caption` | 60 chars | Subtitle (may equal card body) |
| *(repeat for point2, point3)* | | | |
| `{{cta_headline}}` | `scenes[4].headline` | 30 chars | CTA main text |
| `{{cta_subhead}}` | `scenes[4].visual` summary | 50 chars | Supporting CTA text |
| `{{cta_button}}` | `brand_kit.cta.default` | 35 chars | Button label |
| `{{caption_05}}` | `scenes[4].caption` | 60 chars | CTA subtitle |

## Duration Calculation

Sum rule: `sum(data-duration values) == storyboard.total_duration` exactly.

Default 30s breakdown: 4 + 8 + 8 + 8 + 4 = 32s — adjust middle scenes by -0.5s each for 30s.

GSAP label offsets `S.s1..S.s5` must be recalculated after any duration change:
```js
const S = { s1: 0, s2: d1, s3: d1+d2, s4: d1+d2+d3, s5: d1+d2+d3+d4 };
```

## Do Not

- Do not remove scene_01 (hook) or scene_05 (cta)
- Do not change `#composition` dimensions (1080×1920)
- Do not use hard-coded hex colors — all colors must use `var(--color-*)` 
- Do not set `.subtitle { bottom }` below 22%
- Do not use `repeat: -1` or `Math.random()`
- Do not add scenes not in storyboard.json
- Do not start point badges from 0 — they always count 1, 2, 3
