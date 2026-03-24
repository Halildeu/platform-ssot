#!/usr/bin/env node
/**
 * ai-pr-review.mjs — Design System PR Review Bot
 *
 * Analyzes changed files for design system compliance issues:
 * - Hardcoded colors (should use semantic tokens)
 * - Missing access control
 * - Missing forwardRef
 * - Inline styles vs tokens
 * - Non-semantic HTML
 * - Missing aria attributes
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '../..');

// Get changed files (vs main or specified base)
const base = process.argv[2] || 'main';
let changedFiles = [];
try {
  changedFiles = execSync(`git diff --name-only ${base}...HEAD -- src/`, { encoding: 'utf-8', cwd: ROOT })
    .trim().split('\n').filter(f => f.endsWith('.tsx') && !f.includes('__tests__') && !f.includes('.stories.'));
} catch {
  changedFiles = execSync('git diff --name-only HEAD~1 -- src/', { encoding: 'utf-8', cwd: ROOT })
    .trim().split('\n').filter(f => f.endsWith('.tsx') && !f.includes('__tests__') && !f.includes('.stories.'));
}

if (changedFiles.length === 0) {
  console.log('\u2705 No component files changed \u2014 nothing to review');
  process.exit(0);
}

console.log(`\n\ud83d\udd0d AI PR Review \u2014 ${changedFiles.length} changed component(s)\n`);

const issues = [];

for (const file of changedFiles) {
  const fullPath = path.join(ROOT, file);
  if (!fs.existsSync(fullPath)) continue;
  const content = fs.readFileSync(fullPath, 'utf-8');
  const fileIssues = [];

  // Rule 1: Hardcoded hex colors
  const hexMatches = content.match(/#[0-9a-fA-F]{3,8}(?!\w)/g) || [];
  const nonTokenHex = hexMatches.filter(h => !content.includes(`var(--`) || true); // Simplified
  if (hexMatches.length > 3) {
    fileIssues.push({ severity: 'warning', rule: 'no-hardcoded-colors', message: `${hexMatches.length} hardcoded hex colors found \u2014 use var(--semantic-token)` });
  }

  // Rule 2: Missing AccessControlledProps
  if (content.includes('export') && content.includes('Props') && !content.includes('AccessControlledProps')) {
    fileIssues.push({ severity: 'info', rule: 'missing-access-control', message: 'Component exports Props but missing AccessControlledProps' });
  }

  // Rule 3: Missing forwardRef
  if (content.includes('export const') && content.includes('Props') && !content.includes('forwardRef')) {
    fileIssues.push({ severity: 'info', rule: 'missing-forward-ref', message: 'Exported component without forwardRef' });
  }

  // Rule 4: Inline styles
  const inlineStyles = (content.match(/style=\{\{/g) || []).length;
  if (inlineStyles > 5) {
    fileIssues.push({ severity: 'warning', rule: 'excessive-inline-styles', message: `${inlineStyles} inline style objects \u2014 prefer Tailwind utilities or CSS variables` });
  }

  // Rule 5: Missing aria on interactive elements
  if ((content.includes('onClick') || content.includes('onKeyDown')) && !content.includes('aria-') && !content.includes('role=')) {
    fileIssues.push({ severity: 'error', rule: 'missing-aria', message: 'Interactive element handlers without aria attributes or role' });
  }

  // Rule 6: Missing JSDoc
  if (!content.includes('/**')) {
    fileIssues.push({ severity: 'warning', rule: 'missing-jsdoc', message: 'No JSDoc comments found' });
  }

  // Rule 7: Missing displayName
  if (content.includes('forwardRef') && !content.includes('displayName')) {
    fileIssues.push({ severity: 'info', rule: 'missing-display-name', message: 'forwardRef component without displayName' });
  }

  // Rule 8: text-white without semantic token
  if (content.includes('text-white') && !content.includes('text-[var(--text-inverse)]')) {
    fileIssues.push({ severity: 'warning', rule: 'non-semantic-color', message: 'text-white should be text-[var(--text-inverse)] for dark mode' });
  }

  if (fileIssues.length > 0) {
    issues.push({ file, issues: fileIssues });
  }
}

// Score
const totalIssues = issues.reduce((s, f) => s + f.issues.length, 0);
const errors = issues.reduce((s, f) => s + f.issues.filter(i => i.severity === 'error').length, 0);
const warnings = issues.reduce((s, f) => s + f.issues.filter(i => i.severity === 'warning').length, 0);
const infos = issues.reduce((s, f) => s + f.issues.filter(i => i.severity === 'info').length, 0);
const score = Math.max(0, 100 - errors * 15 - warnings * 5 - infos * 2);

// Report
for (const { file, issues: fileIssues } of issues) {
  console.log(`\ud83d\udcc4 ${file}`);
  for (const issue of fileIssues) {
    const icon = issue.severity === 'error' ? '\u274c' : issue.severity === 'warning' ? '\u26a0\ufe0f' : '\u2139\ufe0f';
    console.log(`   ${icon} [${issue.rule}] ${issue.message}`);
  }
  console.log('');
}

console.log(`\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500`);
console.log(`Score: ${score}/100`);
console.log(`${errors} error(s), ${warnings} warning(s), ${infos} info(s)`);
console.log(`${changedFiles.length} file(s) reviewed, ${changedFiles.length - issues.length} clean\n`);

if (process.argv.includes('--ci') && score < 60) {
  console.log('\u274c PR REVIEW FAILED: Score below 60\n');
  process.exit(1);
} else {
  console.log('\u2705 PR REVIEW PASSED\n');
}
