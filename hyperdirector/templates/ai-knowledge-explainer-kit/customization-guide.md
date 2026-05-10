# Customization Guide — ai-knowledge-explainer-kit

## Switching to Light Mode

Change background to light and update text colors:
```css
:root {
  --color-primary: #F8FAFC;  /* light bg */
  --grid-line: rgba(15, 23, 42, 0.04);
}
.headline { color: var(--color-text); }
.subhead { color: var(--color-muted); }
.mech-card { background: rgba(0,0,0,0.04); border-color: rgba(0,0,0,0.1); border-left-color: var(--color-accent); }
.mech-card .mech-title { color: var(--color-text); }
.mech-card .mech-body { color: var(--color-muted); }
.flow-node { background: rgba(0,0,0,0.04); border-color: rgba(0,0,0,0.12); }
.flow-node .node-label { color: var(--color-text); }
.step-item { background: rgba(0,0,0,0.04); }
.step-content .step-title { color: var(--color-text); }
.step-content .step-desc { color: var(--color-muted); }
```

## Changing Flow Diagram Icons

Replace Unicode shapes with **short text labels** or **inline SVG** / `assets/*.svg`. Avoid **emoji** in core frames — headless render often shows tofu (R-HRS-02).

```html
<!-- Instead of &#9632; &#9650; &#9679; use: -->
<div class="node-icon">RAG</div>
<div class="node-icon">LLM</div>
<div class="node-icon">Agent</div>
```

## Adding a Fourth Flow Node

The `.flow-row` uses flexbox. Adding a 4th node reduces each node's width. Check at 1080px canvas width — 4 nodes + 3 arrows may be too narrow on mobile. Consider a 2+2 grid instead:

```html
<div style="display:flex; flex-direction:column; gap:16px; width:90%; margin-top:32px;">
  <div style="display:flex; gap:0;">
    <!-- 2 nodes + 1 arrow -->
  </div>
  <div style="display:flex; gap:0;">
    <!-- 2 nodes + 1 arrow -->
  </div>
</div>
```

## Expanding to 4 Steps

The step list can hold 4 items before overflowing on a 33s video. If you need 4 steps, reduce padding:
```css
.step-item { padding: 18px 22px; }
.step-content .step-title { font-size: 24px; }
.step-content .step-desc { font-size: 20px; }
```

## Asset Slots

| File | Used In | Notes |
|------|---------|-------|
| `logo.png` | scene_05 CTA (optional) | PNG transparent, 80px sq |
| `diagram-bg.png` | scene_03 mechanism overlay | Optional decorative bg, 10% opacity |
