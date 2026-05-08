# Composer Guide — saas-demo-kit

## Intent
Product demo, feature introduction, SaaS launch announcement.
Two-column layout: copy on one side, product visual on the other.
Default 16:9. 30–60 seconds. Professional, high information density.

## Scene Sequence

| Position | ID | Purpose | Duration | Required |
|----------|----|---------|----------|----------|
| 1 | scene_01 | problem | 5–8s | Yes |
| 2 | scene_02 | product_reveal | 6–10s | Yes |
| 3 | scene_03 | feature_1 | 6–10s | Yes |
| 4 | scene_04 | feature_2 | 6–10s | Yes |
| 5 | scene_05 | feature_3 | 6–10s | Recommended |
| 6 | scene_06 | cta | 4–6s | Yes |

For 30s: compress each scene to 5s and drop feature_3.
For 60s: extend feature scenes to 10s each, add a `result` scene before CTA.

## Substitution Guide

| Placeholder | Source | Notes |
|------------|--------|-------|
| `{{problem_headline}}` | `scenes[0].headline` | Max 8 words |
| `{{problem_subhead}}` | `scenes[0].visual` summary | Max 15 words |
| `{{product_headline}}` | `scenes[1].headline` | Max 6 words |
| `{{product_subhead}}` | `scenes[1].caption` | Max 20 words |
| `{{feature1_headline}}` | `scenes[2].headline` | Max 6 words |
| `{{feature1_desc}}` | `scenes[2].visual` summary | Max 20 words |
| `{{metric1_value}}` / `{{metric1_label}}` | Extract from `scenes[2].visual` | Number + short label |
| `{{feature1_card_title}}` | `scenes[2].headline` condensed | Max 8 words |
| `{{feature1_card_desc}}` | `scenes[2].caption` | Max 25 words |
| *(repeat pattern for feature 2, 3)* | | |
| `{{cta_headline}}` | `scenes[5].headline` | Max 8 words |
| `{{cta_button}}` | `brand_kit.cta.default` | Max 30 chars |

## Screenshot Integration

Replace the placeholder `.screenshot-body` UI lines with the actual screenshot:

```html
<div class="screenshot-body" style="
  background: url('assets/screenshot-01.png') center/cover;
  min-height: 380px;
  padding: 0;
">
</div>
```

If no screenshot is available, keep the placeholder UI lines (render will proceed as `partial`).

## Do Not

- Do not change `#composition` to 9:16 without updating canvas dimensions to 1080×1920
- Do not put subtitle `bottom` below 10% for 16:9 canvas
- Do not hard-code colors — use CSS variables only
- Do not remove `.screenshot-frame` — use placeholder content if no asset available
- Do not exceed 3 feature scenes without updating GSAP offsets
