# Release Notes — v0.1.2-preview (Rendering Stability Hardening)

**Theme:** Rendering stability hardening for headless / offline / preview–render consistency.

## Summary

- **R-CORE-12:** GSAP 3.12.x may load from the approved CDN (default in templates) **or** from user-supplied `assets/gsap.min.js`. The repository does not ship `gsap.min.js`.
- **New:** `rules/headless-rendering-stability.md` — fonts, emoji/icons, `@media` boundaries, GSAP vs CSS transform guidance.
- **Templates:** Removed `@media` rules that altered `#composition` dimensions; outer `body` spacing only where needed.
- **New script:** `scripts/check-composition-hazards.js` — heuristic warnings only; not lint; always exit 0; not wired to CI.
- **Docs / QA:** `qa/troubleshooting.md`, `qa/pre-render-checklist.md`, customization guides, and `upstream/hyperframes-anti-patterns.md` updated for a single GSAP + font policy narrative.
- **Examples:** README wording adjusted; sample `output/` HTML not bulk-rewritten in this release.

## Pro bundle

Private repo: merge `hyperdirector/` from this tag; see `hyperdirector-pro/SYNC_FROM_PUBLIC.zh-CN.md` and delivery notes in `DELIVERY_GUIDE.zh-CN.md`.
