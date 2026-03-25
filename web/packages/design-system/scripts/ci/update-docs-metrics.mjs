#!/usr/bin/env node
/**
 * update-docs-metrics.mjs
 * -----------------------
 * Reads current scorecard.json and other CI outputs,
 * then updates metric placeholders in docs/*.md files.
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const ROOT = path.resolve(import.meta.dirname, '../..');

// 1. Generate fresh scorecard if not exists
const scorecardPath = path.join(ROOT, 'reports/scorecard.json');
if (!fs.existsSync(scorecardPath)) {
  console.log('Generating fresh scorecard...');
  execSync('node scripts/ci/component-scorecard.mjs --json', { cwd: ROOT, stdio: 'pipe' });
}

const scorecard = JSON.parse(fs.readFileSync(scorecardPath, 'utf-8'));
const comps = Array.isArray(scorecard) ? scorecard : scorecard.components || scorecard;

// 2. Calculate metrics
const total = comps.length;
const grades = {};
comps.forEach(c => { grades[c.grade] = (grades[c.grade] || 0) + 1; });
const avg = (comps.reduce((s, c) => s + c.totalScore, 0) / total).toFixed(1);

const metricAvgs = {};
const metricKeys = ['testDepth', 'api', 'a11y', 'testCoverage', 'accessControl', 'storyCompleteness', 'i18n', 'documentation'];
metricKeys.forEach(k => {
  const vals = comps.map(c => c.scores?.[k] || 0);
  metricAvgs[k] = (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1);
});

// 3. Count test files and tests
let testFiles = 0, testCount = 0;
try {
  const testOutput = execSync('npx vitest run --reporter=json 2>/dev/null || true', { cwd: ROOT, encoding: 'utf-8', timeout: 120000 });
  // Fallback: count test files
  const testFileList = execSync('find src -name "*.test.tsx" -o -name "*.test.ts" | wc -l', { cwd: ROOT, encoding: 'utf-8' }).trim();
  testFiles = parseInt(testFileList) || 0;
} catch {
  // Count files directly
  try {
    const count = execSync('find src -name "*.test.tsx" -o -name "*.test.ts" | wc -l', { cwd: ROOT, encoding: 'utf-8' }).trim();
    testFiles = parseInt(count) || 0;
  } catch { testFiles = 0; }
}

// Count stories
let storyCount = 0;
try {
  const sc = execSync('find src -name "*.stories.tsx" | wc -l', { cwd: ROOT, encoding: 'utf-8' }).trim();
  storyCount = parseInt(sc) || 0;
} catch { storyCount = 0; }

// Count CI scripts
let ciScripts = 0;
try {
  const pkg = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf-8'));
  ciScripts = Object.keys(pkg.scripts || {}).filter(k =>
    k.includes('ci') || k.includes('gate') || k.includes('audit') || k.includes('quality')
  ).length;
} catch { ciScripts = 0; }

// 4. Build replacement map
const now = new Date().toISOString().split('T')[0];
const replacements = {
  '{{DATE}}': now,
  '{{TOTAL_COMPONENTS}}': String(total),
  '{{GRADE_A}}': String(grades.A || 0),
  '{{GRADE_B}}': String(grades.B || 0),
  '{{GRADE_C}}': String(grades.C || 0),
  '{{GRADE_D}}': String(grades.D || 0),
  '{{AVG_SCORE}}': avg,
  '{{TEST_FILES}}': String(testFiles),
  '{{STORY_COUNT}}': String(storyCount),
  '{{CI_SCRIPTS}}': String(ciScripts),
  '{{METRIC_TEST_DEPTH}}': metricAvgs.testDepth,
  '{{METRIC_API}}': metricAvgs.api,
  '{{METRIC_A11Y}}': metricAvgs.a11y,
  '{{METRIC_TEST_COVERAGE}}': metricAvgs.testCoverage,
  '{{METRIC_ACCESS_CONTROL}}': metricAvgs.accessControl,
  '{{METRIC_STORY}}': metricAvgs.storyCompleteness,
  '{{METRIC_I18N}}': metricAvgs.i18n,
  '{{METRIC_DOCS}}': metricAvgs.documentation,
};

// 5. Update doc files
const docFiles = [
  'docs/PHASE-GOVERNANCE.md',
  'docs/PLATFORM-ROADMAP.md',
  'docs/SPRINT-TRACKER.md',
  'src/QUALITY-GATE.md',
];

let updated = 0;
for (const relPath of docFiles) {
  const fullPath = path.join(ROOT, relPath);
  if (!fs.existsSync(fullPath)) continue;

  let content = fs.readFileSync(fullPath, 'utf-8');
  let changed = false;

  // Replace {{PLACEHOLDER}} tokens
  for (const [token, value] of Object.entries(replacements)) {
    if (content.includes(token)) {
      content = content.replaceAll(token, value);
      changed = true;
    }
  }

  // Also update inline metric patterns (regex-based, works on every run)
  const patterns = [
    // Component counts
    [/(\bBilesen\w*:\s*)\d+/gi, `$1${total}`],
    [/(\bComponents?:\s*)\d+/gi, `$1${total}`],
    [/(\d+)\/\1\s*A-grade/g, `${total}/${total} A-grade`],
    [/(\d+)\/(\d+)\s*A-grade/g, `${grades.A || 0}/${total} A-grade`],
    // Scorecard average
    [/(\bScorecard\s*(?:Avg|Average|Ortalama)?:\s*)\d+\.?\d*/gi, `$1${avg}`],
    [/(ortalama[:\s]*)\d+\.?\d*\/100/gi, `$1${avg}/100`],
    // Test files
    [/(\bTest\s*(?:Dosya\w*|Files?):\s*)\d+/gi, `$1${testFiles}`],
    [/(\d+)\+?\s*(?:test\s*)?dosya/gi, `${testFiles}+ dosya`],
    // Story count
    [/(\bStory|Stories):\s*\d+/gi, `$1: ${storyCount}`],
    // Grade distribution (preserve format)
    [/(A=)\d+/g, `$1${grades.A || 0}`],
    [/(B=)\d+/g, `$1${grades.B || 0}`],
    [/(C=)\d+/g, `$1${grades.C || 0}`],
    [/(D=)\d+/g, `$1${grades.D || 0}`],
  ];

  for (const [regex, replacement] of patterns) {
    const before = content;
    content = content.replace(regex, replacement);
    if (content !== before) changed = true;
  }

  if (changed) {
    fs.writeFileSync(fullPath, content);
    updated++;
    console.log(`Updated: ${relPath}`);
  } else {
    console.log(`No placeholders found: ${relPath}`);
  }
}

// 6. Print summary
console.log('\nCurrent Metrics:');
console.log(`  Components: ${total}`);
console.log(`  Grades: A=${grades.A||0} B=${grades.B||0} C=${grades.C||0} D=${grades.D||0}`);
console.log(`  Average Score: ${avg}/100`);
console.log(`  Test Files: ${testFiles}`);
console.log(`  Stories: ${storyCount}`);
console.log(`  CI Scripts: ${ciScripts}`);
console.log(`  Metric Averages:`);
metricKeys.forEach(k => console.log(`    ${k}: ${metricAvgs[k]}`));
console.log(`\n  Updated ${updated}/${docFiles.length} doc files.`);
