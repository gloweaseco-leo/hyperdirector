#!/usr/bin/env node
/**
 * HyperDirector Storyboard Validator
 * Validates storyboard.json against required fields, scene structure,
 * and optionally cross-checks total_duration against a brief.json.
 *
 * Usage:
 *   node hyperdirector/scripts/validate-storyboard.js <path-to-storyboard.json> [path-to-brief.json]
 *
 * Examples:
 *   node hyperdirector/scripts/validate-storyboard.js output/storyboard.json
 *   node hyperdirector/scripts/validate-storyboard.js output/storyboard.json output/brief.json
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

const VALID_ASPECT_RATIOS = ['9:16', '16:9', '1:1'];
const VALID_TEMPLATES = [
  'tiktok-vertical-kit', 'saas-demo-kit', 'ai-knowledge-explainer-kit',
];
const VALID_PURPOSES = [
  'hook', 'context', 'point_1', 'point_2', 'point_3', 'mechanism',
  'mechanism_1', 'mechanism_2', 'use_case', 'problem', 'product_reveal',
  'feature_1', 'feature_2', 'feature_3', 'result', 'big_claim', 'action', 'cta',
];
const VALID_TRANSITIONS = [
  'fade_in', 'fade_out', 'slide_up', 'slide_down', 'slide_left', 'slide_right',
  'scale_in', 'scale_out', 'fast_scale_in', 'wipe', 'blur_crossfade',
  'push_slide', 'zoom_through', 'none',
];
const VALID_ASSET_TYPES = ['image', 'video', 'audio', 'lottie'];

const DURATION_TOLERANCE = 0.5;

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

// ── Entry point ─────────────────────────────────────────
const filePath  = process.argv[2];
const briefPath = process.argv[3];

console.log(`\n${BOLD}HyperDirector Storyboard Validator${RESET}`);
console.log('─'.repeat(50));

if (!filePath) {
  console.log(`${RED}Usage: node validate-storyboard.js <storyboard.json> [brief.json]${RESET}\n`);
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

let brief = null;
if (briefPath) {
  const resolvedBrief = path.resolve(briefPath);
  if (!fs.existsSync(resolvedBrief)) {
    warn('brief.json', `file not found at ${resolvedBrief} — skipping cross-check`);
  } else {
    try {
      brief = JSON.parse(fs.readFileSync(resolvedBrief, 'utf8'));
      console.log(`  Brief: ${resolvedBrief}`);
    } catch (e) {
      warn('brief.json', `failed to parse: ${e.message} — skipping cross-check`);
    }
  }
}

console.log(`  File:  ${resolved}\n`);

// ── Top-level required fields ────────────────────────────
console.log(`${BOLD}Top-level fields${RESET}`);

// title
if (!data.title || typeof data.title !== 'string' || data.title.length < 1) {
  fail('title', 'missing or empty required field "title"');
} else {
  pass('title', data.title.slice(0, 60));
}

// total_duration
if (data.total_duration === undefined || data.total_duration === null) {
  fail('total_duration', 'missing required field "total_duration"');
} else if (typeof data.total_duration !== 'number') {
  fail('total_duration', `must be a number, got ${typeof data.total_duration}`);
} else if (data.total_duration < 10 || data.total_duration > 300) {
  fail('total_duration', `value ${data.total_duration} is out of range (10–300 seconds)`);
} else {
  pass('total_duration', `${data.total_duration}s`);
}

// aspect_ratio
if (!data.aspect_ratio || !VALID_ASPECT_RATIOS.includes(data.aspect_ratio)) {
  fail('aspect_ratio', `"${data.aspect_ratio}" is not valid. Allowed: ${VALID_ASPECT_RATIOS.join(', ')}`);
} else {
  pass('aspect_ratio', data.aspect_ratio);
}

// template
if (!data.template || !VALID_TEMPLATES.includes(data.template)) {
  fail('template', `"${data.template}" is not valid. Allowed: ${VALID_TEMPLATES.join(', ')}`);
} else {
  pass('template', data.template);
}

// ── Cross-check with brief ───────────────────────────────
if (brief) {
  console.log(`\n${BOLD}Cross-check with brief.json${RESET}`);

  if (brief.aspect_ratio && data.aspect_ratio !== brief.aspect_ratio) {
    fail('aspect_ratio vs brief', `storyboard="${data.aspect_ratio}", brief="${brief.aspect_ratio}" — must match`);
  } else if (brief.aspect_ratio) {
    pass('aspect_ratio matches brief');
  }

  if (brief.template && data.template !== brief.template) {
    fail('template vs brief', `storyboard="${data.template}", brief="${brief.template}" — must match`);
  } else if (brief.template) {
    pass('template matches brief');
  }

  if (brief.duration_seconds !== undefined && data.total_duration !== undefined) {
    const diff = Math.abs(data.total_duration - brief.duration_seconds);
    if (diff > DURATION_TOLERANCE) {
      fail(
        'total_duration vs brief',
        `storyboard total_duration=${data.total_duration}s, brief.duration_seconds=${brief.duration_seconds}s (diff: ${diff.toFixed(2)}s, tolerance ±${DURATION_TOLERANCE}s)`
      );
    } else {
      pass(`total_duration matches brief (diff: ${diff.toFixed(2)}s)`);
    }
  }
}

// ── Scenes ───────────────────────────────────────────────
console.log(`\n${BOLD}Scenes${RESET}`);

if (!data.scenes || !Array.isArray(data.scenes)) {
  fail('scenes', 'missing required array "scenes"');
  console.log('\n' + '─'.repeat(50));
  console.log(`${RED}${BOLD}✗ Storyboard validation failed — ${errors.length} error(s)${RESET}\n`);
  process.exit(1);
}

const sceneCount = data.scenes.length;
if (sceneCount < 2) {
  fail('scenes.length', `must have at least 2 scenes, got ${sceneCount}`);
} else if (sceneCount > 12) {
  fail('scenes.length', `must have at most 12 scenes, got ${sceneCount}`);
} else {
  pass(`scenes count`, sceneCount);
}

// Validate scene id uniqueness
const seenIds = new Set();
let durationSum = 0;
const sceneIdPattern = /^scene_[0-9]{2}$/;

data.scenes.forEach((scene, i) => {
  const prefix = `scenes[${i}]`;

  // id
  if (!scene.id) {
    fail(`${prefix}.id`, 'missing required field "id"');
  } else if (!sceneIdPattern.test(scene.id)) {
    fail(`${prefix}.id`, `"${scene.id}" does not match pattern scene_NN (e.g., scene_01, scene_12)`);
  } else if (seenIds.has(scene.id)) {
    fail(`${prefix}.id`, `duplicate scene id "${scene.id}"`);
  } else {
    seenIds.add(scene.id);
    pass(`${prefix}.id`, scene.id);
  }

  // duration
  if (scene.duration === undefined || scene.duration === null) {
    fail(`${prefix}.duration`, 'missing required field "duration"');
  } else if (typeof scene.duration !== 'number') {
    fail(`${prefix}.duration`, `must be a number, got ${typeof scene.duration}`);
  } else if (scene.duration < 1 || scene.duration > 60) {
    fail(`${prefix}.duration`, `value ${scene.duration} is out of range (1–60 seconds)`);
  } else {
    durationSum += scene.duration;
    pass(`${prefix}.duration`, `${scene.duration}s`);
  }

  // purpose
  if (!scene.purpose || !VALID_PURPOSES.includes(scene.purpose)) {
    fail(`${prefix}.purpose`, `"${scene.purpose}" is not valid. Allowed: ${VALID_PURPOSES.join(', ')}`);
  } else {
    pass(`${prefix}.purpose`, scene.purpose);
  }

  // headline
  if (!scene.headline || typeof scene.headline !== 'string' || scene.headline.length < 1) {
    fail(`${prefix}.headline`, 'missing or empty required field "headline"');
  } else if (scene.headline.length > 60) {
    fail(`${prefix}.headline`, `exceeds max length (max 60, got ${scene.headline.length})`);
  } else {
    pass(`${prefix}.headline`);
  }

  // visual
  if (!scene.visual || typeof scene.visual !== 'string' || scene.visual.length < 1) {
    fail(`${prefix}.visual`, 'missing or empty required field "visual"');
  } else if (scene.visual.length > 300) {
    fail(`${prefix}.visual`, `exceeds max length (max 300, got ${scene.visual.length})`);
  } else {
    pass(`${prefix}.visual`);
  }

  // caption
  if (!scene.caption || typeof scene.caption !== 'string' || scene.caption.length < 1) {
    fail(`${prefix}.caption`, 'missing or empty required field "caption"');
  } else if (scene.caption.length > 150) {
    fail(`${prefix}.caption`, `exceeds max length (max 150, got ${scene.caption.length})`);
  } else {
    pass(`${prefix}.caption`);
  }

  // transition (optional)
  if (scene.transition !== undefined && !VALID_TRANSITIONS.includes(scene.transition)) {
    fail(`${prefix}.transition`, `"${scene.transition}" is not valid. Allowed: ${VALID_TRANSITIONS.join(', ')}`);
  }

  // assets (optional)
  if (scene.assets && Array.isArray(scene.assets)) {
    scene.assets.forEach((asset, ai) => {
      const aPrefix = `${prefix}.assets[${ai}]`;
      if (!asset.type || !VALID_ASSET_TYPES.includes(asset.type)) {
        fail(`${aPrefix}.type`, `"${asset.type}" is not valid. Allowed: ${VALID_ASSET_TYPES.join(', ')}`);
      }
      if (!asset.path) {
        fail(`${aPrefix}.path`, 'missing required field "path"');
      }
    });
  }
});

// ── Duration sum check ───────────────────────────────────
console.log(`\n${BOLD}Duration consistency${RESET}`);

if (data.total_duration !== undefined && typeof data.total_duration === 'number') {
  const diff = Math.abs(durationSum - data.total_duration);
  if (diff > DURATION_TOLERANCE) {
    fail(
      'scenes duration sum vs total_duration',
      `scenes sum=${durationSum.toFixed(2)}s, total_duration=${data.total_duration}s (diff: ${diff.toFixed(2)}s, tolerance ±${DURATION_TOLERANCE}s)`
    );
  } else {
    pass(`scenes sum (${durationSum.toFixed(2)}s) matches total_duration (${data.total_duration}s)`);
  }
}

// ── Summary ──────────────────────────────────────────────
console.log('\n' + '─'.repeat(50));
if (errors.length === 0) {
  console.log(`${GREEN}${BOLD}✓ Storyboard validation passed — ${sceneCount} scenes, ${durationSum.toFixed(2)}s total${RESET}`);
  if (warnings.length > 0) {
    console.log(`${YELLOW}  ${warnings.length} warning(s) — non-blocking${RESET}`);
  }
  console.log();
  process.exit(0);
} else {
  console.log(`${RED}${BOLD}✗ Storyboard validation failed — ${errors.length} error(s)${RESET}`);
  if (warnings.length > 0) {
    console.log(`${YELLOW}  ${warnings.length} warning(s)${RESET}`);
  }
  console.log();
  process.exit(1);
}
