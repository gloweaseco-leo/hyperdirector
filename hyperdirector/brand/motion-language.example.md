# Motion Language Reference

Maps `brand-kit.json` motion settings to specific GSAP patterns used in HTML compositions.
Read by: `prompts/04-visual-design.md` (Stage 04) and `prompts/05-compose-hyperframes.md` (Stage 05).

---

## Pace → GSAP Duration

| pace value | Element entrance | Scene exit | Stagger between elements | Feel |
|-----------|-----------------|------------|--------------------------|------|
| `fast`    | 0.2s            | 0.25s      | 0.05s                    | High energy, social media native |
| `medium`  | 0.4s            | 0.35s      | 0.08s                    | Professional, balanced |
| `slow`    | 0.6s            | 0.5s       | 0.12s                    | Cinematic, editorial |

---

## Style → GSAP Ease

| style value    | Headline ease          | Body / caption ease | Feel |
|----------------|------------------------|---------------------|------|
| `clean_tech`   | `power3.out`           | `power2.out`        | Precise, purposeful, no bounce |
| `warm_social`  | `back.out(1.2)`        | `power2.out`        | Friendly, light overshoot |
| `corporate`    | `power2.inOut`         | `power1.out`        | Symmetric, measured |
| `editorial`    | `expo.out`             | `sine.inOut`        | Dramatic entrance, elegant |
| `playful`      | `elastic.out(1, 0.5)`  | `back.out(1.0)`     | Bouncy, expressive |

---

## Transitions → GSAP Implementation

| transition name  | GSAP pattern |
|-----------------|--------------|
| `slide_up`       | `gsap.from(el, { y: 40, opacity: 0, duration: pace, ease })` |
| `slide_down`     | `gsap.from(el, { y: -40, opacity: 0, duration: pace, ease })` |
| `slide_left`     | `gsap.from(el, { x: 60, opacity: 0, duration: pace, ease })` |
| `slide_right`    | `gsap.from(el, { x: -60, opacity: 0, duration: pace, ease })` |
| `scale_in`       | `gsap.from(el, { scale: 0.85, opacity: 0, duration: pace, ease })` |
| `fast_scale_in`  | `gsap.from(el, { scale: 0.7, opacity: 0, duration: 0.15, ease: 'power4.out' })` |
| `fade`           | `gsap.from(el, { opacity: 0, duration: pace, ease: 'none' })` |
| `wipe`           | `gsap.from(el, { clipPath: 'inset(0 100% 0 0)', duration: pace * 1.5, ease })` |
| `push_slide`     | Previous scene exits right; next scene enters from left simultaneously |
| `blur_crossfade` | `gsap.to(prevScene, { filter: 'blur(8px)', opacity: 0, duration: 0.3 })` then fade in next |
| `zoom_through`   | `gsap.from(el, { scale: 1.3, opacity: 0, duration: pace * 2, ease })` |
| `none`           | Instant cut — no transition animation |

---

## Subtitle Style

Subtitle animation is **always fast** regardless of brand `pace`. Caption must appear within the first 0.3s of the scene.

```js
// Entrance — fixed 0.2s, not affected by brand pace
tl.from('.subtitle', {
  opacity: 0, y: 10,
  duration: 0.2, ease: 'power2.out'
}, sceneStart + 0.1);

// Exit — fade out 0.3s before scene ends
tl.to('.subtitle', { opacity: 0, duration: 0.2 }, sceneEnd - 0.3);
```

Per-style subtitle background:

| style         | Background                   | Text color | Font weight |
|---------------|------------------------------|------------|-------------|
| `clean_tech`  | `rgba(0, 0, 0, 0.65)`        | `#FFFFFF`  | 400         |
| `warm_social` | `rgba(30, 30, 60, 0.75)`     | `#FFFFFF`  | 400         |
| `corporate`   | `rgba(0, 0, 0, 0.80)`        | `#FFFFFF`  | 400         |
| `editorial`   | `rgba(255, 255, 255, 0.90)`  | `#111111`  | 300         |
| `playful`     | brand accent at 70% opacity  | `#FFFFFF`  | 700         |

Safe zone: subtitle `bottom` must be ≥ 22% of canvas height for 9:16 (see `rules/subtitle-safe-area.md`).

---

## Chart and Data Animation

For scenes with data visualization (`purpose: "result"`, `purpose: "big_claim"`, data-heavy feature scenes).

### Counter — Number Count-Up

```js
const counter = { val: 0 };
tl.to(counter, {
  val: 94.7,
  duration: 1.2,
  ease: 'power2.out',
  onUpdate: () => { el.textContent = counter.val.toFixed(1) + '%'; }
}, sceneStart + 0.3);
```

### Bar Chart — Left-to-Right Reveal

```js
bars.forEach((bar, i) => {
  tl.from(bar, {
    scaleX: 0,
    transformOrigin: 'left center',
    duration: 0.6, ease: 'power2.out'
  }, sceneStart + 0.3 + i * 0.12);   // stagger 0.12s per bar
});
```

### SVG Line Chart — Stroke Draw

```js
const len = pathEl.getTotalLength();
gsap.set(pathEl, { strokeDasharray: len, strokeDashoffset: len });
tl.to(pathEl, { strokeDashoffset: 0, duration: 1.0, ease: 'power2.inOut' }, sceneStart + 0.2);
```

### Progress Ring — SVG Circle

```js
const circumference = 2 * Math.PI * radius;
tl.to(circleEl, {
  strokeDashoffset: circumference * (1 - targetPercent / 100),
  duration: 1.2, ease: 'power2.out'
}, sceneStart + 0.3);
```

**Chart animation rules:**
- Never use `setInterval` — use GSAP `onUpdate` callback only
- Initialize all charts at zero state before timeline starts
- Total chart animation must end by `sceneEnd - 1.5s`
- Data labels stagger in 0.15s after their parent element appears

---

## CTA Scene Motion

Regardless of brand `pace`, the CTA scene always uses fast, direct motion:

```js
// Headline — fast scale-in
tl.from('#cta-headline', {
  scale: 0.85, opacity: 0, duration: 0.25, ease: 'power4.out'
}, ctaStart);

// Button — slides up 0.3s after headline
tl.from('#cta-button', {
  y: 20, opacity: 0, duration: 0.2, ease: 'power3.out'
}, ctaStart + 0.3);

// Logo — subtle fade-in last
tl.from('#cta-logo', { opacity: 0, duration: 0.3, ease: 'none' }, ctaStart + 0.5);
```

CTA button requirements:
- Background: `var(--color-accent)`
- Text color: `var(--color-bg)` (contrast-safe)
- Min height: 48px | Min font size: 18px
- Border radius: `clean_tech` = 8px, `warm_social` = 24px, `corporate` = 4px, `playful` = 16px

---

## Intro Style (First 0–0.5s of scene_01)

The intro is the first visual impression. Must complete within 0.5s.

| style         | Intro pattern |
|---------------|--------------|
| `clean_tech`  | Dark bg fades up (0.3s) → headline scales in immediately |
| `warm_social` | Gradient slides up from bottom → headline bounces in |
| `corporate`   | Logo appears (0.5s) → cross-fades to hook headline |
| `editorial`   | Instant cut to full headline → supporting elements reveal slowly |
| `playful`     | Elements pop in from off-screen in sequence with elastic ease |

Default intro pattern:
```js
// Intro overlay fades out (0.3s), then headline enters
tl.to('#intro-overlay', { opacity: 0, duration: 0.3, ease: 'none' }, 0);
tl.from('#hook-headline', { scale: 0.8, opacity: 0, duration: 0.2, ease: 'power4.out' }, 0.2);
```

---

## Outro Style (Last 0.4s of final CTA scene)

The last frame the viewer remembers.

| style         | Outro pattern |
|---------------|--------------|
| `clean_tech`  | Fade to black |
| `warm_social` | Fade to brand background color |
| `corporate`   | Fade to white |
| `editorial`   | Hard cut to black |
| `playful`     | Scale-out to 0 with bounce |

Default outro:
```js
tl.to('#composition', { opacity: 0, duration: 0.4, ease: 'none' }, totalDuration - 0.4);
```

---

## Audio-Reactive Patterns (Optional)

Apply only when `assets.music_default` is set. Use on background elements only — never on subtitle or headline text.

| Audio band | GSAP target | Range |
|-----------|-------------|-------|
| Bass beat | `scale` | 1.0 → 1.03 (0.1s pulse) |
| Amplitude | `opacity` | 0.85 → 1.0 (breathing) |
| Treble    | `filter: brightness()` | 1.0 → 1.08 |

Rules: maximum 1 audio-reactive element per scene. Use `repeat: 2` cap — no `repeat: -1`.
