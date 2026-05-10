#!/usr/bin/env node
/**
 * Heuristic composition hazard scan (warnings only).
 * Not HyperFrames lint. Always exits 0. Does not block CI or install.
 *
 * Usage (from repo root):
 *   node hyperdirector/scripts/check-composition-hazards.js path/to/index.html
 */

const fs = require('fs');
const path = require('path');

const YELLOW = '\x1b[33m';
const DIM = '\x1b[2m';
const RESET = '\x1b[0m';

function warn(msg) {
  console.log(`${YELLOW}WARNING${RESET} ${msg}`);
}

function note(msg) {
  console.log(`${DIM}  (info) ${msg}${RESET}`);
}

const file = process.argv[2];
if (!file) {
  console.log('Usage: node hyperdirector/scripts/check-composition-hazards.js <path-to-composition.html>');
  console.log('Emits heuristic warnings only; exit code is always 0. Not a substitute for `npx hyperframes lint`.');
  process.exit(0);
}

const abs = path.resolve(process.cwd(), file);
if (!fs.existsSync(abs)) {
  warn(`File not found: ${abs}`);
  process.exit(0);
}

let html;
try {
  html = fs.readFileSync(abs, 'utf8');
} catch (e) {
  warn(`Could not read file: ${abs}`);
  process.exit(0);
}

// --- Remote fonts ---
if (/fonts\.googleapis\.com/i.test(html)) {
  warn('Found fonts.googleapis.com — remote fonts may fail in headless/offline render (see rules/headless-rendering-stability.md R-HRS-01).');
}
if (/fonts\.gstatic\.com/i.test(html)) {
  warn('Found fonts.gstatic.com — same risk as Google Fonts CSS (R-HRS-01).');
}

// --- GSAP CDN (informational) ---
if (/cdnjs\.cloudflare\.com\/ajax\/libs\/gsap/i.test(html)) {
  note('GSAP loaded from cdnjs — OK for default preview; for offline/headless stability consider user-supplied assets/gsap.min.js (R-CORE-12).');
}

const hasLocalGsap = /src\s*=\s*["']assets\/gsap\.min\.js["']/i.test(html);
if (hasLocalGsap) {
  note('GSAP script points to assets/gsap.min.js — ensure the file exists in output/assets/ before render.');
}

// --- Emoji (common BMP + supplementary ranges, heuristic) ---
const emojiRe =
  /[\u{1F300}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{FE00}-\u{FE0F}\u{203C}\u{2049}\u{2122}\u{2139}\u{2194}-\u{2199}\u{231A}\u{231B}]/u;
if (emojiRe.test(html)) {
  warn('Possible emoji characters detected — may render as tofu in headless/Linux (R-HRS-02). Prefer SVG or text labels.');
}

// --- @media affecting composition: only inspect text inside the @media { ... } block ---
const mediaRe = /@media[^{]*max-width[^{]*\{/gi;
let mediaExec;
while ((mediaExec = mediaRe.exec(html)) !== null) {
  const openBrace = mediaExec.index + mediaExec[0].length - 1;
  let depth = 0;
  let i = openBrace;
  for (; i < html.length; i++) {
    const c = html[i];
    if (c === '{') depth++;
    else if (c === '}') {
      depth--;
      if (depth === 0) {
        i++;
        break;
      }
    }
  }
  const blockBody = html.slice(openBrace + 1, i - 1);
  if (/#composition\b/.test(blockBody) && /(width|height|font-size)\s*:/.test(blockBody)) {
    warn('@media (max-width…) modifies #composition size/typography inside the block — risk of preview/render mismatch (R-HRS-03).');
  } else {
    note('Found @media (max-width…) — verify block only affects outer/body chrome (R-HRS-03).');
  }
}

// --- CSS translate + GSAP scale (weak heuristic) ---
const styleTagContent = [];
const reStyle = /<style[^>]*>([\s\S]*?)<\/style>/gi;
let m;
while ((m = reStyle.exec(html)) !== null) {
  styleTagContent.push(m[1]);
}
const joinedCss = styleTagContent.join('\n');
const cssUsesTranslate =
  /transform\s*:\s*[^;{}]*translate/i.test(joinedCss) || /translateX\s*\(/i.test(joinedCss);
const gsapUsesScale =
  /\b(?:gsap|tl)\.(?:from|to|fromTo)\([^)]*\bscale\s*:/i.test(html) ||
  /\btl\.from\([^)]*\bscale\s*:/i.test(html);
if (cssUsesTranslate && gsapUsesScale) {
  warn('CSS translate/transform + GSAP scale detected — risk of overwritten layout transforms on subtitles/titles (see R-GSAP-09). Review tweens.');
}

console.log(`${DIM}Scan complete: ${abs}${RESET}`);
console.log(`${DIM}This tool is advisory only. Use \`npx hyperframes lint\` for authoritative checks.${RESET}`);

process.exit(0);
