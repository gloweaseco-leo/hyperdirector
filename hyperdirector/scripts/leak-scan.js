#!/usr/bin/env node
/**
 * HyperDirector public-repo leak scan (heuristic).
 * Run from repository root: node hyperdirector/scripts/leak-scan.js
 *
 * Exit 0 = no findings; 1 = findings or scan error.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');
const SCAN_DIRS = ['hyperdirector', '.github'];
const ROOT_FILES = [
  'README.md',
  'README.zh-CN.md',
  'CONTRIBUTING.md',
  'SECURITY.md',
  'NOTICE',
  'RELEASE_NOTES_v0.1.md',
  'RELEASE_NOTES_v0.1.1.md',
  'RELEASE_NOTES_v0.1.2-preview.md',
  'install.sh',
  'install.ps1',
  '.gitattributes',
];

const EXT_OK = new Set([
  '.md', '.json', '.html', '.js', '.yml', '.yaml', '.txt', '.css',
  '.sh', '.ps1', '.gitattributes',
]);

/** @type {{ pattern: RegExp; message: string; allow?: RegExp }[]} */
const RULES = [
  {
    pattern: /\b(sk-[a-zA-Z0-9]{20,}|sk_live_[a-zA-Z0-9]+|sk_test_[a-zA-Z0-9]+)\b/,
    message: 'Possible API secret (OpenAI-style or Stripe-style)',
  },
  {
    pattern: /\b(ghp_[a-zA-Z0-9]{36}|github_pat_[a-zA-Z0-9_]+|glpat-[a-zA-Z0-9\-]{20,})\b/,
    message: 'Possible Git/GitLab token',
  },
  {
    pattern: /\b(xox[baprs]-[a-zA-Z0-9-]{10,})\b/,
    message: 'Possible Slack token',
  },
  {
    pattern: /\bAKIA[0-9A-Z]{16}\b/,
    message: 'Possible AWS access key id',
  },
  {
    pattern: /BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY/,
    message: 'PEM private key block',
  },
  {
    pattern: /\b(api[_-]?key|apikey)\s*[:=]\s*['"]?[a-zA-Z0-9_\-]{12,}['"]?/i,
    message: 'Inline api key assignment (verify manually)',
    allow: /apikey\s*[:=]\s*['"]?\$\{/i,
  },
  {
    pattern: /\bBearer\s+[a-zA-Z0-9_\-\.]{20,}\b/,
    message: 'Bearer token-like string',
  },
  {
    pattern: /['"]?Authorization['"]?\s*:\s*['"][^'"]{20,}['"]/i,
    message: 'Authorization header with long value',
  },
  {
    pattern: /高关|高管大壮|gaoguan|gaoguan_dazhuang|gaoguan-dazhuang/i,
    message: 'Real-style creator / legacy example handle (should stay generic in public)',
  },
  {
    pattern: /知识星球/,
    message: 'Paid-community product name in copy (prefer neutral CTA in public OSS)',
  },
  {
    pattern: /\b(hyperdirector-cn-pro|hyperdirector-pro)\b/i,
    message: 'Private repo name in public tree (link only from docs if needed)',
    allow: /REPO_SPLIT|COMMERCIAL_BOUNDARY|PRO_README|private repo/i,
  },
  {
    pattern: /\/Users\/[^/\s]+|\\\\Users\\\\[^\\]+|D:\\\\Projects\\\\[^\\]+\\\\\.cursor/i,
    message: 'Machine-specific or workspace path',
  },
  {
    pattern: /\.cursor[\\/]projects[\\/]/i,
    message: 'Cursor local project path',
  },
];

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  const st = fs.statSync(dir);
  if (st.isFile()) {
    out.push(dir);
    return out;
  }
  for (const name of fs.readdirSync(dir)) {
    if (name === 'node_modules' || name === '.git') continue;
    walk(path.join(dir, name), out);
  }
  return out;
}

function shouldScanFile(file) {
  const base = path.basename(file);
  const ext = path.extname(file).toLowerCase();
  const extOk = EXT_OK.has(ext) || base === '.gitattributes';
  if (!extOk) return false;
  const rel = path.relative(ROOT, file).replace(/\\/g, '/');
  if (rel.includes('/output/')) return false;
  if (rel === 'hyperdirector/scripts/leak-scan.js') return false;
  return true;
}

function scanContent(relPath, text) {
  const findings = [];
  for (const rule of RULES) {
    if (rule.allow && rule.allow.test(text)) continue;
    if (rule.pattern.test(text)) {
      findings.push(rule.message);
    }
  }
  return findings;
}

function main() {
  const files = new Set();

  for (const d of SCAN_DIRS) {
    const abs = path.join(ROOT, d);
    for (const f of walk(abs)) {
      if (shouldScanFile(f)) files.add(f);
    }
  }

  for (const rf of ROOT_FILES) {
    const abs = path.join(ROOT, rf);
    if (fs.existsSync(abs) && shouldScanFile(abs)) files.add(abs);
  }

  /** @type {string[]} */
  const report = [];
  const SKIP_FILES = new Set(['REPO_SPLIT_AND_RELEASE_REPORT.md']);

  for (const file of [...files].sort()) {
    const relForSkip = path.relative(ROOT, file).replace(/\\/g, '/');
    if (SKIP_FILES.has(relForSkip)) continue;

    let text;
    try {
      text = fs.readFileSync(file, 'utf8');
    } catch {
      continue;
    }
    const rel = path.relative(ROOT, file).replace(/\\/g, '/');
    const hits = scanContent(rel, text);
    if (hits.length) {
      report.push(`${rel}\n  - ${[...new Set(hits)].join('\n  - ')}`);
    }
  }

  console.log(`${'='.repeat(60)}\nHyperDirector leak scan (public tree)\n${'='.repeat(60)}\n`);
  if (report.length === 0) {
    console.log('No heuristic issues reported.\n');
    process.exit(0);
  }
  console.log('Review the following:\n');
  console.log(report.join('\n\n'));
  console.log('\n---\nFix or document false positives, then re-run.\n');
  process.exit(1);
}

main();
