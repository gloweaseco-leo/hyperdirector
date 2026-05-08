#!/usr/bin/env node
/**
 * HyperDirector Environment Check
 * Verifies all dependencies required to run the full HyperDirector workflow.
 *
 * Usage:
 *   node hyperdirector/scripts/check-env.js
 *
 * Exit codes:
 *   0 — all checks passed
 *   1 — one or more checks failed (render will not work)
 */

const { execSync } = require('child_process');

const RESET = '\x1b[0m';
const GREEN = '\x1b[32m';
const RED   = '\x1b[31m';
const YELLOW= '\x1b[33m';
const BOLD  = '\x1b[1m';

function pass(label, value) {
  console.log(`  ${GREEN}✓${RESET} ${label.padEnd(28)} ${value}`);
}

function fail(label, hint) {
  console.log(`  ${RED}✗${RESET} ${label.padEnd(28)} ${RED}NOT FOUND${RESET}`);
  console.log(`    ${YELLOW}→ ${hint}${RESET}`);
}

function warn(label, value, hint) {
  console.log(`  ${YELLOW}⚠${RESET} ${label.padEnd(28)} ${value}`);
  console.log(`    ${YELLOW}→ ${hint}${RESET}`);
}

function run(cmd) {
  try {
    return execSync(cmd, { stdio: 'pipe' }).toString().trim();
  } catch {
    return null;
  }
}

console.log(`\n${BOLD}HyperDirector Environment Check${RESET}`);
console.log('─'.repeat(50));

let allPassed = true;

// ── Node.js ────────────────────────────────────────────
const nodeVersion = run('node --version');
if (!nodeVersion) {
  fail('Node.js', 'Install from https://nodejs.org (requires v22+)');
  allPassed = false;
} else {
  const major = parseInt(nodeVersion.replace('v', '').split('.')[0], 10);
  if (major < 22) {
    warn('Node.js', nodeVersion, `HyperFrames requires Node.js >= 22. Current: ${nodeVersion}`);
    allPassed = false;
  } else {
    pass('Node.js', nodeVersion);
  }
}

// ── HyperFrames CLI ────────────────────────────────────
const hfVersion = run('npx hyperframes --version 2>/dev/null') ||
                  run('npx --yes hyperframes --version 2>/dev/null');
if (!hfVersion) {
  fail('HyperFrames CLI', 'Run: npm install -g hyperframes');
  allPassed = false;
} else {
  pass('HyperFrames CLI', hfVersion);
}

// ── FFmpeg ─────────────────────────────────────────────
const ffmpegOut = run('ffmpeg -version');
if (!ffmpegOut) {
  fail('FFmpeg', 'Install from https://ffmpeg.org/download.html  (required for render)');
  allPassed = false;
} else {
  const ffmpegVersion = ffmpegOut.split('\n')[0].replace('ffmpeg version ', '').split(' ')[0];
  pass('FFmpeg', ffmpegVersion);
}

// ── npm ────────────────────────────────────────────────
const npmVersion = run('npm --version');
if (npmVersion) {
  pass('npm', `v${npmVersion}`);
} else {
  warn('npm', 'not found', 'npm is bundled with Node.js — check your Node installation');
}

// ── HyperFrames doctor (optional deep check) ──────────
console.log('');
console.log(`${BOLD}Running HyperFrames doctor...${RESET}`);
const doctorOut = run('npx hyperframes doctor 2>&1');
if (doctorOut) {
  const lines = doctorOut.split('\n').filter(l => l.trim());
  lines.forEach(line => console.log(`  ${line}`));
} else {
  console.log(`  ${YELLOW}⚠ Could not run hyperframes doctor (CLI may not be installed)${RESET}`);
}

// ── Summary ────────────────────────────────────────────
console.log('');
console.log('─'.repeat(50));
if (allPassed) {
  console.log(`${GREEN}${BOLD}✓ All required dependencies found.${RESET}`);
  console.log(`  HyperDirector can run the full workflow including render.\n`);
  process.exit(0);
} else {
  console.log(`${RED}${BOLD}✗ Some dependencies are missing.${RESET}`);
  console.log(`  HyperDirector can still generate source files (brief, storyboard, HTML),`);
  console.log(`  but render will not execute until all checks pass.\n`);
  process.exit(1);
}
