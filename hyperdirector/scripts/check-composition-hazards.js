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

// ---------------------------------------------------------------------------
// Image asset advisory checks (R-IMG-01 ~ R-IMG-06)
// ---------------------------------------------------------------------------

const htmlDir = path.dirname(abs);

// --- Remote <img src> URLs ---
const imgTagRe = /<img\b([^>]*)>/gi;
let imgMatch;
while ((imgMatch = imgTagRe.exec(html)) !== null) {
  const attrs = imgMatch[1];

  // R-IMG-01: remote src
  const srcMatch = /\bsrc\s*=\s*["']([^"']+)["']/i.exec(attrs);
  if (srcMatch) {
    const srcVal = srcMatch[1].trim();
    if (/^https?:\/\//i.test(srcVal)) {
      warn(`<img src> uses remote URL: ${srcVal} — replace with local asset before production render (R-IMG-01).`);
    } else if (!/^data:/i.test(srcVal)) {
      // R-IMG-05/R-IMG-06: local path checks
      const localAbs = path.resolve(htmlDir, srcVal);
      if (!fs.existsSync(localAbs)) {
        warn(`<img src> local path not found: ${srcVal} (resolved: ${localAbs}) — file missing (R-IMG-09).`);
      } else {
        try {
          const stat = fs.statSync(localAbs);
          if (stat.size > 5 * 1024 * 1024) {
            warn(`<img src> file is large (${(stat.size / 1024 / 1024).toFixed(1)} MB): ${srcVal} — compress or register a WebP variant in asset-manifest.json (R-IMG-06).`);
          }
        } catch (_) {
          // ignore stat errors silently
        }
      }
    }
  }

  // R-IMG-02: missing alt
  if (!/\balt\s*=/i.test(attrs)) {
    const srcHint = srcMatch ? srcMatch[1].slice(0, 60) : '(unknown src)';
    note(`<img> missing alt attribute: src="${srcHint}" — add alt="" for decorative images or a descriptive string for content images (R-IMG-02).`);
  }
}

// --- Remote background-image in CSS (inline style + <style> blocks) ---
// Collect inline style= attributes
const inlineStyleRe = /\bstyle\s*=\s*["']([^"']*)["']/gi;
let styleAttrMatch;
const inlineStyles = [];
while ((styleAttrMatch = inlineStyleRe.exec(html)) !== null) {
  inlineStyles.push(styleAttrMatch[1]);
}
const allCssSources = [...styleTagContent, ...inlineStyles].join('\n');

const bgImageRe = /background(?:-image)?\s*:\s*url\(\s*["']?(https?:\/\/[^"')]+)["']?\s*\)/gi;
let bgMatch;
while ((bgMatch = bgImageRe.exec(allCssSources)) !== null) {
  warn(`CSS background-image uses remote URL: ${bgMatch[1]} — replace with local asset before production render (R-IMG-03).`);
}

// --- SVG external reference risk ---
// <image href="https://..."> or xlink:href
const svgImageRe = /<image\b[^>]*(?:xlink:)?href\s*=\s*["'](https?:\/\/[^"']+)["'][^>]*>/gi;
if (svgImageRe.test(html)) {
  warn('SVG <image> element references a remote URL — external SVG image refs fail silently in headless Chromium (R-IMG-04).');
}
// <use href="https://...">
const svgUseRe = /<use\b[^>]*(?:xlink:)?href\s*=\s*["'](https?:\/\/[^"']+)["'][^>]*>/gi;
if (svgUseRe.test(html)) {
  warn('SVG <use> element references a remote URL — resolve to inline SVG or local asset before render (R-IMG-04).');
}

// ---------------------------------------------------------------------------
// Audio asset advisory checks (R-AUD-01, R-AUD-04)
// ---------------------------------------------------------------------------

// --- <audio> tags: remote src, missing src, local path / size ---
const audioTagRe = /<audio\b([^>]*)>/gi;
let audioMatch;
while ((audioMatch = audioTagRe.exec(html)) !== null) {
  const attrs = audioMatch[1];

  const audioSrcMatch = /\bsrc\s*=\s*["']([^"']+)["']/i.exec(attrs);
  if (!audioSrcMatch) {
    // Missing src on <audio> tag (skip if it's a container with <source> children — heuristic)
    if (!/\bcontrols\b/i.test(attrs) || !/type\s*=/i.test(html.slice(audioMatch.index, audioMatch.index + 300))) {
      note('<audio> element has no src attribute — verify a <source> child provides the audio URL (R-AUD-01).');
    }
  } else {
    const audioSrcVal = audioSrcMatch[1].trim();
    if (/^https?:\/\//i.test(audioSrcVal)) {
      warn(`<audio src> uses remote URL: ${audioSrcVal} — replace with local asset before production render (R-AUD-01).`);
    } else if (!/^data:/i.test(audioSrcVal)) {
      const audioLocalAbs = path.resolve(htmlDir, audioSrcVal);
      if (!fs.existsSync(audioLocalAbs)) {
        warn(`<audio src> local path not found: ${audioSrcVal} (resolved: ${audioLocalAbs}) — file missing (R-AUD-02).`);
      } else {
        try {
          const audioStat = fs.statSync(audioLocalAbs);
          if (audioStat.size > 10 * 1024 * 1024) {
            warn(`<audio src> file is large (${(audioStat.size / 1024 / 1024).toFixed(1)} MB): ${audioSrcVal} — consider compressed format (MP3/M4A) or register in audio-manifest.json (R-AUD-05).`);
          }
        } catch (_) {
          // ignore stat errors silently
        }
      }
    }
  }
}

// --- <source> inside <audio>: remote src ---
const audioSourceRe = /<source\b([^>]*)>/gi;
let audioSourceMatch;
while ((audioSourceMatch = audioSourceRe.exec(html)) !== null) {
  const srcM = /\bsrc\s*=\s*["']([^"']+)["']/i.exec(audioSourceMatch[1]);
  if (srcM && /^https?:\/\//i.test(srcM[1].trim())) {
    warn(`<source src> uses remote URL: ${srcM[1].trim()} — replace with local audio asset before production render (R-AUD-01).`);
  }
}

// --- Heuristic API key detection in inline JSON / data attributes ---
// Looks for common key patterns (sk-, Bearer, long base64 strings) in HTML text
// This is a weak heuristic — only catches obvious leaks
const apiKeyPatterns = [
  /\bsk-[A-Za-z0-9]{20,}/,
  /Bearer\s+[A-Za-z0-9\-._~+/]{20,}/,
  /api[_-]?key\s*[:=]\s*["']?[A-Za-z0-9\-._]{20,}["']?/i,
  /token\s*[:=]\s*["']?[A-Za-z0-9\-._]{32,}["']?/i,
];
for (const pattern of apiKeyPatterns) {
  if (pattern.test(html)) {
    warn(`Possible API key or token pattern detected in HTML — ensure no credentials are embedded in composition source (R-AUD-04). Review before committing.`);
    break; // one warning is enough
  }
}

// ---------------------------------------------------------------------------

console.log(`${DIM}Scan complete: ${abs}${RESET}`);
console.log(`${DIM}This tool is advisory only. Use \`npx hyperframes lint\` for authoritative checks.${RESET}`);

process.exit(0);
