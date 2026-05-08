#!/usr/bin/env node
/**
 * HyperDirector Output Contract Checker
 * Verifies the output/ directory contains all required delivery files.
 * Performs lightweight content checks where possible (JSON parseable, file non-empty).
 *
 * Usage:
 *   node hyperdirector/scripts/check-output-contract.js <output-dir>
 *
 * Examples:
 *   node hyperdirector/scripts/check-output-contract.js output/
 *   node hyperdirector/scripts/check-output-contract.js ./my-project/output
 *
 * Exit codes:
 *   0 — all required files present and valid
 *   1 — one or more required files missing or invalid
 */

'use strict';

const fs   = require('fs');
const path = require('path');

const RESET  = '\x1b[0m';
const GREEN  = '\x1b[32m';
const RED    = '\x1b[31m';
const YELLOW = '\x1b[33m';
const BOLD   = '\x1b[1m';
const DIM    = '\x1b[2m';

const errors   = [];
const warnings = [];

function pass(label, detail) {
  const suffix = detail ? ` ${DIM}${detail}${RESET}` : '';
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

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

function checkFile(dir, filename, opts = {}) {
  const { required = true, minBytes = 1, checkJson = false, label } = opts;
  const displayName = label || filename;
  const fullPath = path.join(dir, filename);

  if (!fs.existsSync(fullPath)) {
    if (required) {
      fail(displayName, `file not found: ${filename}`);
    } else {
      warn(displayName, `optional file not found: ${filename}`);
    }
    return null;
  }

  const stat = fs.statSync(fullPath);
  if (stat.size < minBytes) {
    fail(displayName, `file is empty or too small (${formatBytes(stat.size)})`);
    return null;
  }

  if (checkJson) {
    try {
      const content = fs.readFileSync(fullPath, 'utf8');
      const parsed = JSON.parse(content);
      pass(displayName, formatBytes(stat.size));
      return parsed;
    } catch (e) {
      fail(displayName, `invalid JSON: ${e.message}`);
      return null;
    }
  }

  pass(displayName, formatBytes(stat.size));
  return true;
}

// ── Entry point ─────────────────────────────────────────
const outputDir = process.argv[2];

console.log(`\n${BOLD}HyperDirector Output Contract Checker${RESET}`);
console.log('─'.repeat(50));

if (!outputDir) {
  console.log(`${RED}Usage: node check-output-contract.js <output-dir>${RESET}\n`);
  process.exit(1);
}

const resolved = path.resolve(outputDir);
if (!fs.existsSync(resolved)) {
  console.log(`${RED}✗ Output directory not found: ${resolved}${RESET}\n`);
  process.exit(1);
}

const stat = fs.statSync(resolved);
if (!stat.isDirectory()) {
  console.log(`${RED}✗ Path is not a directory: ${resolved}${RESET}\n`);
  process.exit(1);
}

console.log(`  Directory: ${resolved}\n`);

// ── Required: Render outputs ─────────────────────────────
console.log(`${BOLD}Render outputs (required)${RESET}`);

checkFile(resolved, 'index.html',   { required: true,  minBytes: 100 });
checkFile(resolved, 'preview.html', { required: false, minBytes: 100 });
checkFile(resolved, 'final.mp4',    { required: false, minBytes: 1024,
  label: 'final.mp4 (render output)' });

// ── Required: Structured documents ──────────────────────
console.log(`\n${BOLD}Structured documents (required)${RESET}`);

const brief = checkFile(resolved, 'brief.json', {
  required: true, checkJson: true, minBytes: 50,
});
const storyboard = checkFile(resolved, 'storyboard.json', {
  required: true, checkJson: true, minBytes: 50,
});

// ── Required: Markdown documents ────────────────────────
console.log(`\n${BOLD}Documentation files (required)${RESET}`);

checkFile(resolved, 'script.md',           { required: true,  minBytes: 10 });
checkFile(resolved, 'DESIGN.md',           { required: true,  minBytes: 10 });
checkFile(resolved, 'render-report.md',    { required: false, minBytes: 10 });
checkFile(resolved, 'edit-instructions.md',{ required: false, minBytes: 10 });

// ── Optional: Brand snapshot ─────────────────────────────
console.log(`\n${BOLD}Brand snapshot (optional)${RESET}`);

const brandUsed = checkFile(resolved, 'brand-used.json', {
  required: false, checkJson: true, minBytes: 20,
});

// ── Cross-checks ─────────────────────────────────────────
console.log(`\n${BOLD}Cross-checks${RESET}`);

if (brief && storyboard) {
  // aspect_ratio match
  if (brief.aspect_ratio && storyboard.aspect_ratio) {
    if (brief.aspect_ratio !== storyboard.aspect_ratio) {
      fail(
        'aspect_ratio consistency',
        `brief="${brief.aspect_ratio}", storyboard="${storyboard.aspect_ratio}" — must match`
      );
    } else {
      pass('aspect_ratio consistent', brief.aspect_ratio);
    }
  }

  // template match
  if (brief.template && storyboard.template) {
    if (brief.template !== storyboard.template) {
      fail(
        'template consistency',
        `brief="${brief.template}", storyboard="${storyboard.template}" — must match`
      );
    } else {
      pass('template consistent', brief.template);
    }
  }

  // duration cross-check
  if (brief.duration_seconds !== undefined && storyboard.total_duration !== undefined) {
    const diff = Math.abs(brief.duration_seconds - storyboard.total_duration);
    if (diff > 0.5) {
      fail(
        'duration consistency',
        `brief.duration_seconds=${brief.duration_seconds}s, storyboard.total_duration=${storyboard.total_duration}s (diff: ${diff.toFixed(2)}s)`
      );
    } else {
      pass(`duration consistent (${brief.duration_seconds}s, diff: ${diff.toFixed(2)}s)`);
    }
  }

  // scene sum check
  if (storyboard.scenes && Array.isArray(storyboard.scenes)) {
    const sceneSum = storyboard.scenes.reduce((acc, s) => {
      return acc + (typeof s.duration === 'number' ? s.duration : 0);
    }, 0);
    if (storyboard.total_duration !== undefined) {
      const diff = Math.abs(sceneSum - storyboard.total_duration);
      if (diff > 0.5) {
        fail(
          'scenes duration sum',
          `scenes sum=${sceneSum.toFixed(2)}s, total_duration=${storyboard.total_duration}s (diff: ${diff.toFixed(2)}s)`
        );
      } else {
        pass(`scenes duration sum (${sceneSum.toFixed(2)}s)`);
      }
    }
  }
} else {
  warn('cross-checks skipped', 'brief.json or storyboard.json could not be parsed');
}

// ── index.html basic check ───────────────────────────────
console.log(`\n${BOLD}index.html content checks${RESET}`);

const indexPath = path.join(resolved, 'index.html');
if (fs.existsSync(indexPath)) {
  const html = fs.readFileSync(indexPath, 'utf8');

  // Check data-duration attributes
  const dataDurationMatches = html.match(/data-duration=/g);
  const sceneCount = storyboard && storyboard.scenes ? storyboard.scenes.length : null;

  if (dataDurationMatches) {
    const count = dataDurationMatches.length;
    if (sceneCount !== null && count !== sceneCount) {
      warn(
        'data-duration count',
        `found ${count} data-duration attribute(s) in HTML, storyboard has ${sceneCount} scene(s)`
      );
    } else {
      pass(`data-duration attributes`, `${count} found`);
    }
  } else {
    fail('data-duration attributes', 'no data-duration attributes found in index.html — timeline will not register');
  }

  // Check for scene ids
  if (storyboard && storyboard.scenes) {
    const missingIds = storyboard.scenes
      .filter(s => s.id && !html.includes(`id="${s.id}"`))
      .map(s => s.id);
    if (missingIds.length > 0) {
      fail('scene ids in HTML', `missing scene element(s): ${missingIds.join(', ')}`);
    } else {
      pass('all scene ids found in HTML');
    }
  }
} else {
  warn('index.html checks', 'skipped — file not found');
}

// ── Assets directory ─────────────────────────────────────
console.log(`\n${BOLD}Assets directory${RESET}`);

const assetsDir = path.join(resolved, 'assets');
if (fs.existsSync(assetsDir) && fs.statSync(assetsDir).isDirectory()) {
  const assetFiles = fs.readdirSync(assetsDir);
  pass(`assets/ directory`, `${assetFiles.length} file(s)`);

  // Check storyboard-declared assets
  if (storyboard && storyboard.scenes) {
    storyboard.scenes.forEach(scene => {
      if (scene.assets && Array.isArray(scene.assets)) {
        scene.assets.forEach(asset => {
          if (asset.path) {
            const assetFull = path.join(resolved, asset.path);
            if (!fs.existsSync(assetFull)) {
              fail(`asset declared in ${scene.id}`, `file not found: ${asset.path}`);
            } else {
              pass(`${scene.id} → ${asset.path}`);
            }
          }
        });
      }
    });
  }
} else {
  warn('assets/ directory', 'not found — only required if storyboard references asset files');
}

// ── Summary ──────────────────────────────────────────────
console.log('\n' + '─'.repeat(50));

const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 19);
console.log(`  Checked at: ${timestamp}`);
console.log('');

if (errors.length === 0) {
  console.log(`${GREEN}${BOLD}✓ Output contract check passed${RESET}`);
  if (warnings.length > 0) {
    console.log(`${YELLOW}  ${warnings.length} warning(s) — review before delivery${RESET}`);
    warnings.forEach(w => console.log(`  ${YELLOW}⚠${RESET} ${w}`));
  }
  console.log();
  process.exit(0);
} else {
  console.log(`${RED}${BOLD}✗ Output contract check failed — ${errors.length} error(s)${RESET}`);
  if (warnings.length > 0) {
    console.log(`${YELLOW}  ${warnings.length} warning(s)${RESET}`);
  }
  console.log('');
  console.log(`  ${RED}Errors:${RESET}`);
  errors.forEach(e => console.log(`  ${RED}•${RESET} ${e}`));
  console.log();
  process.exit(1);
}
