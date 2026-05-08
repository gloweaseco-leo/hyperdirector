#!/usr/bin/env node
/**
 * HyperDirector Brand Kit Validator
 * Validates brand-kit.json against required fields and format rules.
 *
 * Usage:
 *   node hyperdirector/scripts/validate-brand-kit.js <path-to-brand-kit.json>
 *
 * Example:
 *   node hyperdirector/scripts/validate-brand-kit.js hyperdirector/brand/brand-kit.example.json
 *
 * Exit codes:
 *   0 — validation passed
 *   1 — validation failed or file not found
 */

'use strict';

const fs   = require('fs');
const path = require('path');

const RESET  = '\x1b[0m';
const GREEN  = '\x1b[32m';
const RED    = '\x1b[31m';
const YELLOW = '\x1b[33m';
const BOLD   = '\x1b[1m';

const errors   = [];
const warnings = [];

function pass(label) {
  console.log(`  ${GREEN}✓${RESET} ${label}`);
}

function fail(label, detail) {
  errors.push(`${label}: ${detail}`);
  console.log(`  ${RED}✗${RESET} ${label}`);
  console.log(`    ${YELLOW}→ ${detail}${RESET}`);
}

function warn(label, detail) {
  warnings.push(`${label}: ${detail}`);
  console.log(`  ${YELLOW}⚠${RESET} ${label}`);
  console.log(`    ${YELLOW}→ ${detail}${RESET}`);
}

function checkRequiredString(obj, field, minLen, maxLen, label) {
  if (obj[field] === undefined || obj[field] === null) {
    fail(label || field, `missing required field "${field}"`);
    return false;
  }
  if (typeof obj[field] !== 'string') {
    fail(label || field, `"${field}" must be a string, got ${typeof obj[field]}`);
    return false;
  }
  if (minLen !== undefined && obj[field].length < minLen) {
    fail(label || field, `"${field}" is too short (min ${minLen} chars)`);
    return false;
  }
  if (maxLen !== undefined && obj[field].length > maxLen) {
    fail(label || field, `"${field}" is too long (max ${maxLen} chars, got ${obj[field].length})`);
    return false;
  }
  pass(label || field);
  return true;
}

function checkHexColor(value, label) {
  if (!value) {
    fail(label, `missing color value`);
    return false;
  }
  if (!/^#[0-9a-fA-F]{6}$/.test(value)) {
    fail(label, `"${value}" is not a valid hex color (#RRGGBB required)`);
    return false;
  }
  pass(`${label} (${value})`);
  return true;
}

// ── Entry point ─────────────────────────────────────────
const filePath = process.argv[2];

console.log(`\n${BOLD}HyperDirector Brand Kit Validator${RESET}`);
console.log('─'.repeat(50));

if (!filePath) {
  console.log(`${RED}Usage: node validate-brand-kit.js <path-to-brand-kit.json>${RESET}\n`);
  process.exit(1);
}

const resolved = path.resolve(filePath);
if (!fs.existsSync(resolved)) {
  console.log(`${RED}✗ File not found: ${resolved}${RESET}\n`);
  process.exit(1);
}

let data;
try {
  const raw = fs.readFileSync(resolved, 'utf8');
  data = JSON.parse(raw);
} catch (e) {
  console.log(`${RED}✗ Failed to parse JSON: ${e.message}${RESET}\n`);
  process.exit(1);
}

console.log(`  File: ${resolved}\n`);

// ── Required top-level fields ────────────────────────────
console.log(`${BOLD}Required fields${RESET}`);

checkRequiredString(data, 'brand_name', 1, 80, 'brand_name');

// ── colors ───────────────────────────────────────────────
console.log(`\n${BOLD}Colors${RESET}`);
if (!data.colors || typeof data.colors !== 'object') {
  fail('colors', 'missing required object "colors"');
} else {
  checkHexColor(data.colors.primary, 'colors.primary');
  checkHexColor(data.colors.accent,  'colors.accent');
  if (data.colors.background) {
    checkHexColor(data.colors.background, 'colors.background');
  } else {
    warn('colors.background', 'not set, will default to #FFFFFF');
  }
  if (data.colors.text_primary) checkHexColor(data.colors.text_primary, 'colors.text_primary');
  if (data.colors.text_secondary) checkHexColor(data.colors.text_secondary, 'colors.text_secondary');
}

// ── fonts ────────────────────────────────────────────────
console.log(`\n${BOLD}Fonts${RESET}`);
if (!data.fonts || typeof data.fonts !== 'object') {
  fail('fonts', 'missing required object "fonts"');
} else {
  checkRequiredString(data.fonts, 'headline', 1, undefined, 'fonts.headline');
  checkRequiredString(data.fonts, 'body', 1, undefined, 'fonts.body');
  if (data.fonts.code) {
    pass(`fonts.code (${data.fonts.code})`);
  } else {
    warn('fonts.code', 'not set (only required for technical videos)');
  }
}

// ── cta ──────────────────────────────────────────────────
console.log(`\n${BOLD}CTA${RESET}`);
if (!data.cta || typeof data.cta !== 'object') {
  fail('cta', 'missing required object "cta"');
} else {
  checkRequiredString(data.cta, 'default', 1, 200, 'cta.default');
}

// ── optional: safe_zone ──────────────────────────────────
console.log(`\n${BOLD}Safe Zone (optional)${RESET}`);
if (data.safe_zone) {
  const sz = data.safe_zone;
  ['top_percent', 'bottom_percent', 'left_percent', 'right_percent'].forEach(k => {
    if (sz[k] !== undefined) {
      if (typeof sz[k] !== 'number' || sz[k] < 0 || sz[k] > 30) {
        fail(`safe_zone.${k}`, `value ${sz[k]} is out of range (0–30)`);
      } else {
        pass(`safe_zone.${k} (${sz[k]}%)`);
      }
    }
  });
} else {
  warn('safe_zone', 'not configured, render will use defaults (top=10%, bottom=15%, left/right=5%)');
}

// ── optional: voice.tts_speed ────────────────────────────
if (data.voice && data.voice.tts_speed !== undefined) {
  const spd = data.voice.tts_speed;
  if (typeof spd !== 'number' || spd < 0.5 || spd > 2.0) {
    fail('voice.tts_speed', `value ${spd} is out of range (0.5–2.0)`);
  } else {
    pass(`voice.tts_speed (${spd})`);
  }
}

// ── Summary ──────────────────────────────────────────────
console.log('\n' + '─'.repeat(50));
if (errors.length === 0) {
  console.log(`${GREEN}${BOLD}✓ Brand Kit validation passed${RESET}`);
  if (warnings.length > 0) {
    console.log(`${YELLOW}  ${warnings.length} warning(s) — non-blocking${RESET}`);
  }
  console.log();
  process.exit(0);
} else {
  console.log(`${RED}${BOLD}✗ Brand Kit validation failed — ${errors.length} error(s)${RESET}`);
  if (warnings.length > 0) {
    console.log(`${YELLOW}  ${warnings.length} warning(s)${RESET}`);
  }
  console.log();
  process.exit(1);
}
