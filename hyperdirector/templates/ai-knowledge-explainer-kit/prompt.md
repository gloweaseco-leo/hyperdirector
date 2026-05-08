# Composer Guide — ai-knowledge-explainer-kit

## Intent
AI concept explainers, open-source project introductions, Agent workflow breakdowns, technical tutorials.
Dark background, architecture-diagram aesthetic, information-dense but mobile-readable.
Default 9:16. 30–60 seconds.

## Scene Sequence

| Position | ID | Purpose | Duration | Required |
|----------|----|---------|----------|----------|
| 1 | scene_01 | big_claim | 4–6s | Yes |
| 2 | scene_02 | context | 6–8s | Yes |
| 3 | scene_03 | mechanism | 7–10s | Yes |
| 4 | scene_04 | use_case | 7–10s | Yes |
| 5 | scene_05 | cta | 4–6s | Yes |

For 30s: compress each to minimum. For 60s: split mechanism into mechanism_1 and mechanism_2.

## Substitution Guide

| Placeholder | Source Field | Notes |
|------------|-------------|-------|
| `{{label_01}}` | Scene purpose name (e.g., "核心数据") | 2–4 words |
| `{{big_stat_value}}` | Extract number/percentage from `scenes[0].headline` | Single number: "94%", "3x", "60s" |
| `{{big_stat_label}}` | Description of the stat | Max 20 chars |
| `{{claim_subhead}}` | `scenes[0].caption` | Max 40 chars |
| `{{context_headline}}` | `scenes[1].headline` | Max 30 chars |
| `{{context_card_title}}` | First sentence of `scenes[1].visual` | Max 30 chars |
| `{{context_card_body}}` | `scenes[1].caption` | Max 60 chars |
| `{{mechanism_headline}}` | `scenes[2].headline` | Max 30 chars |
| `{{node1_label}}` / `{{node1_sub}}` | Extract 3 flow steps from `scenes[2].visual` | Node label: max 12 chars, sub: max 15 chars |
| `{{usecase_headline}}` | `scenes[3].headline` | Max 30 chars |
| `{{step1_title}}` / `{{step1_desc}}` | Extract 3 steps from `scenes[3].visual` | Title: max 12 chars, desc: max 25 chars |
| `{{cta_headline}}` | `scenes[4].headline` | Max 30 chars |
| `{{cta_button}}` | `brand_kit.cta.default` | Max 35 chars |

## Flow Diagram Filling

The mechanism scene has 3 flow nodes. Extract 3 sequential steps from `scenes[2].visual`:
- Identify the main components or stages
- Assign each to a node: `node1_label` → `node2_label` → `node3_label`
- Add a 1–2 word sublabel for each
- Node icons are Unicode shapes (■ ▲ ●) — replace with domain-appropriate symbols if needed

## Do Not

- Do not change the dark background to light without updating text colors (see customization-guide.md)
- Do not put subtitle below 22% for 9:16 canvas
- Do not use more than 3 flow nodes in a row (overflow on mobile)
- Do not use more than 3 steps in the step list (overflow)
- Do not add a 4th middle scene without recalculating GSAP offsets
