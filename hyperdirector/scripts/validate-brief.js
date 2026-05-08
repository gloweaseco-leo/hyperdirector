#!/usr/bin/env node
/**
 * HyperDirector Brief Validator
 * Validates brief.json against required fields and schema constraints.
 *
 * Usage:
 *   node hyperdirector/scripts/validate-brief.js <path-to-brief.json>
 *
 * Example:
 *   node hyperdirector/scripts/validate-brief.js output/brief.json
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

const VALID_PLATFORMS = [
  'video_wechat', 'tiktok', 'youtube_shorts', 'youtube',
  'bilibili', 'instagram', 'linkedin', 'internal', 'other',
];
const VALID_ASPECT_RATIOS = ['9:16', '16:9', '1:1'];
const VALID_TEMPLATES = [
  'tiktok-vertical-kit', 'saas-demo-kit', 'ai-knowledge-explainer-kit',
];
const VALID_INPUT_TYPES = [
  'article', 'product_page', 'readme', 'prd', 'data_chart',
  'prompt', 'url', 'transcript', 'other',
];

const errors   = [];
const warnings = [];

function pass(label, value) {
  const suffix = value !== undefined ? ` ${YELLOW}(${value})${RESET}` : '';
  console.log(`  ${GREEN}✓${RESET} ${label}${suffix}`);
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

function checkEnum(obj, field, validValues, label) {
  const v = obj[field];
  if (v === undefined || v === null) {
    fail(label || field, `missing required field "${field}"`);
    return false;
  }
  if (!validValues.includes(v)) {
    fail(label || field, `"${v}" is not a valid value. Allowed: ${validValues.join(', ')}`);
    return false;
  }
  pass(label || field, v);
  return true;
}

function checkRequiredString(obj, field, minLen, maxLen, label) {
  const v = obj[field];
  if (v === undefined || v === null) {
    fail(label || field, `missing required field "${field}"`);
    return false;
  }
  if (typeof v !== 'string') {
    fail(label || field, `"${field}" must be a string, got ${typeof v}`);
    return false;
  }
  if (minLen !== undefined && v.length < minLen) {
    fail(label || field, `"${field}" is too short (min ${minLen} chars)`);
    return false;
  }
  if (maxLen !== undefined && v.length > maxLen) {
    fail(label || field, `"${field}" exceeds max length (max ${maxLen}, got ${v.length})`);
    return false;
  }
  pass(label || field, v.length <= 60 ? v : v.slice(0, 57) + '…');
  return true;
}

// ── Entry point ─────────────────────────────────────────
const filePath = process.argv[2];

console.log(`\n${BOLD}HyperDirector Brief Validator${RESET}`);
console.log('─'.repeat(50));

if (!filePath) {
  console.log(`${RED}Usage: node validate-brief.js <path-to-brief.json>${RESET}\n`);
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

// ── Required fields ──────────────────────────────────────
console.log(`${BOLD}Required fields${RESET}`);

checkRequiredString(data, 'title', 1, 120, 'title');
checkEnum(data, 'platform', VALID_PLATFORMS, 'platform');
checkEnum(data, 'aspect_ratio', VALID_ASPECT_RATIOS, 'aspect_ratio');

// duration_seconds
if (data.duration_seconds === undefined || data.duration_seconds === null) {
  fail('duration_seconds', 'missing required field "duration_seconds"');
} else if (typeof data.duration_seconds !== 'number') {
  fail('duration_seconds', `must be a number, got ${typeof data.duration_seconds}`);
} else if (data.duration_seconds < 10 || data.duration_seconds > 300) {
  fail('duration_seconds', `value ${data.duration_seconds} is out of range (10–300 seconds)`);
} else {
  pass('duration_seconds', `${data.duration_seconds}s`);
}

checkRequiredString(data, 'goal', 1, 300, 'goal');
checkEnum(data, 'template', VALID_TEMPLATES, 'template');

// ── Optional fields ──────────────────────────────────────
console.log(`\n${BOLD}Optional fields${RESET}`);

if (data.audience) {
  if (data.audience.length > 200) {
    fail('audience', `exceeds max length (max 200, got ${data.audience.length})`);
  } else {
    pass('audience');
  }
} else {
  warn('audience', 'not set — recommended for better storyboard quality');
}

if (data.tone) {
  pass('tone', data.tone.slice(0, 40));
} else {
  warn('tone', 'not set — will use template default tone');
}

if (data.input_type) {
  if (!VALID_INPUT_TYPES.includes(data.input_type)) {
    fail('input_type', `"${data.input_type}" is not a valid value. Allowed: ${VALID_INPUT_TYPES.join(', ')}`);
  } else {
    pass('input_type', data.input_type);
  }
} else {
  warn('input_type', 'not set');
}

if (data.language) {
  pass('language', data.language);
} else {
  warn('language', 'not set — will default to zh-CN');
}

if (data.brand_kit) {
  if (data.brand_kit !== 'default') {
    const brandPath = path.resolve(path.dirname(resolved), data.brand_kit);
    if (!fs.existsSync(brandPath)) {
      fail('brand_kit', `file not found: ${brandPath}`);
    } else {
      pass('brand_kit', data.brand_kit);
    }
  } else {
    pass('brand_kit', 'default');
  }
} else {
  warn('brand_kit', 'not set — will use brand/brand-kit.example.json');
}

// ── scene_count ──────────────────────────────────────────
if (data.scene_count !== undefined) {
  if (typeof data.scene_count !== 'number' || !Number.isInteger(data.scene_count)) {
    fail('scene_count', 'must be an integer');
  } else if (data.scene_count < 2 || data.scene_count > 12) {
    fail('scene_count', `value ${data.scene_count} is out of range (2–12)`);
  } else {
    pass('scene_count', data.scene_count);
  }
}

// ── source_materials ────────────────────────────────────
if (data.source_materials && Array.isArray(data.source_materials)) {
  console.log(`\n${BOLD}Source materials (${data.source_materials.length} items)${RESET}`);
  const validMaterialTypes = [
    'article', 'image', 'video', 'audio', 'document', 'url', 'data', 'screenshot',
  ];
  data.source_materials.forEach((m, i) => {
    const idx = `source_materials[${i}]`;
    if (!m.type || !validMaterialTypes.includes(m.type)) {
      fail(`${idx}.type`, `"${m.type}" is not valid. Allowed: ${validMaterialTypes.join(', ')}`);
    }
    if (!m.path_or_url) {
      fail(`${idx}.path_or_url`, 'missing required field');
    } else {
      pass(`${idx} (${m.type})`, m.path_or_url.slice(0, 50));
    }
  });
}

// ── constraints ──────────────────────────────────────────
if (data.constraints) {
  console.log(`\n${BOLD}Constraints${RESET}`);
  const c = data.constraints;
  if (c.max_words_per_scene !== undefined) {
    if (c.max_words_per_scene < 5 || c.max_words_per_scene > 80) {
      fail('constraints.max_words_per_scene', `value ${c.max_words_per_scene} is out of range (5–80)`);
    } else {
      pass('constraints.max_words_per_scene', c.max_words_per_scene);
    }
  }
  if (c.accessibility && c.accessibility.min_contrast_ratio !== undefined) {
    const cr = c.accessibility.min_contrast_ratio;
    if (cr < 3.0 || cr > 21.0) {
      fail('constraints.accessibility.min_contrast_ratio', `value ${cr} is out of range (3.0–21.0)`);
    } else {
      pass('constraints.accessibility.min_contrast_ratio', cr);
    }
  }
}

// ── Summary ──────────────────────────────────────────────
console.log('\n' + '─'.repeat(50));
if (errors.length === 0) {
  console.log(`${GREEN}${BOLD}✓ Brief validation passed${RESET}`);
  if (warnings.length > 0) {
    console.log(`${YELLOW}  ${warnings.length} warning(s) — non-blocking${RESET}`);
  }
  console.log();
  process.exit(0);
} else {
  console.log(`${RED}${BOLD}✗ Brief validation failed — ${errors.length} error(s)${RESET}`);
  if (warnings.length > 0) {
    console.log(`${YELLOW}  ${warnings.length} warning(s)${RESET}`);
  }
  console.log();
  process.exit(1);
}
