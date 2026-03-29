#!/usr/bin/env node
/**
 * pr-design-review.mjs — Automated design system compliance review for PRs
 *
 * Usage:
 *   node scripts/ci/pr-design-review.mjs              # Review staged/uncommitted changes
 *   node scripts/ci/pr-design-review.mjs --test       # Review sample files for testing
 *   node scripts/ci/pr-design-review.mjs --files a.tsx b.tsx  # Review specific files
 *   node scripts/ci/pr-design-review.mjs --json       # Output JSON (for GitHub Action)
 *   node scripts/ci/pr-design-review.mjs --threshold 50  # Fail if score < 50
 */

import { readFileSync, existsSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { resolve, basename } from 'node:path';

/* ------------------------------------------------------------------ */
/*  CLI arg parsing                                                    */
/* ------------------------------------------------------------------ */

const args = process.argv.slice(2);
const jsonMode = args.includes('--json');
const testMode = args.includes('--test');
const filesIdx = args.indexOf('--files');
const thresholdIdx = args.indexOf('--threshold');
const threshold = thresholdIdx !== -1 ? Number(args[thresholdIdx + 1]) : null;

/* ------------------------------------------------------------------ */
/*  Rule definitions (mirrors design-review.ts)                        */
/* ------------------------------------------------------------------ */

/** @type {Array<{id: string, severity: 'error'|'warning'|'info', penalty: number, pattern: RegExp, message: string, fix: string}>} */
const RULES = [
  { id: 'hardcoded-color', severity: 'error', penalty: -10, pattern: /(?<!var\(--)#[0-9a-fA-F]{3,8}\b/g, message: 'Hardcoded color detected', fix: 'Use CSS variable: var(--surface-*) or var(--text-*)' },
  { id: 'hardcoded-px', severity: 'warning', penalty: -5, pattern: /(?<!\w)(\d+)px(?!\w)/g, message: 'Hardcoded pixel value', fix: 'Use spacing token or Tailwind utility' },
  { id: 'inline-style-color', severity: 'error', penalty: -10, pattern: /style=\{[^}]*color\s*:/g, message: 'Inline style with color property', fix: 'Use className with CSS variable' },
  { id: 'no-aria-label', severity: 'warning', penalty: -5, pattern: /<(button|a|input|select)(?![^>]*(?:aria-label|label=))(?![^>]*aria-labelledby)[^>]*>/g, message: 'Interactive element may be missing accessible label', fix: 'Add aria-label or aria-labelledby prop' },
  { id: 'ant-import', severity: 'error', penalty: -10, pattern: /from ['"]antd['"]/g, message: 'Ant Design import — use @mfe/design-system', fix: 'Replace with @mfe/design-system equivalent' },
  { id: 'mui-import', severity: 'error', penalty: -10, pattern: /from ['"]@mui\//g, message: 'MUI import — use @mfe/design-system', fix: 'Replace with @mfe/design-system equivalent' },
  { id: 'physical-css', severity: 'warning', penalty: -5, pattern: /\b(ml-|mr-|pl-|pr-|text-left|text-right|border-l-|border-r-)\d/g, message: 'Physical CSS property (not RTL-safe)', fix: 'Use logical properties: ms-/me-/ps-/pe-/text-start/text-end' },
  { id: 'missing-access-control', severity: 'info', penalty: -1, pattern: /<(Button|Input|Select|Switch|Checkbox)(?![^>]*access=)[^>]*>/g, message: 'Component may benefit from access control prop', fix: 'Consider adding access prop for permission-aware rendering' },
  { id: 'raw-html-input', severity: 'warning', penalty: -5, pattern: /<input(?![^>]*className)[^>]*>/g, message: 'Raw HTML <input>', fix: 'Replace with <Input /> from @mfe/design-system' },
  { id: 'raw-html-button', severity: 'warning', penalty: -5, pattern: /<button(?![^>]*className)[^>]*>/g, message: 'Raw HTML <button>', fix: 'Replace with <Button /> from @mfe/design-system' },
  { id: 'missing-forward-ref', severity: 'info', penalty: -1, pattern: /export\s+const\s+\w+\s*=\s*\(/g, message: 'Component exports function but no forwardRef', fix: 'Wrap with React.forwardRef for ref forwarding support' },
  { id: 'missing-locale-text', severity: 'info', penalty: -1, pattern: />\s*[A-Za-z\u00C0-\u024F\u011E\u011F\u00DC\u00FC\u015E\u015F\u00D6\u00F6\u00C7\u00E7\u0130\u0131]+(?:\s+[A-Za-z\u00C0-\u024F\u011E\u011F\u00DC\u00FC\u015E\u015F\u00D6\u00F6\u00C7\u00E7\u0130\u0131]+){3,}\s*</g, message: 'Hardcoded text string in JSX (possible missing i18n)', fix: 'Use i18n translation function: t("key")' },
  { id: 'missing-error-boundary', severity: 'warning', penalty: -5, pattern: /useEffect\s*\(\s*(?:async\s*)?\(\)\s*=>\s*\{[^}]*(?:fetch|await)[^}]*(?!try)[^}]*\}/g, message: 'Async data fetch without error handling', fix: 'Wrap fetch/await in try/catch or use ErrorBoundary' },
  { id: 'excessive-rerender-risk', severity: 'warning', penalty: -5, pattern: /\w+=\{\s*(?:\{[^}]*\}|\[[^\]]*\])\s*\}/g, message: 'Object/array literal in JSX prop causes re-renders', fix: 'Extract to useMemo/useCallback or define outside component' },
  { id: 'missing-display-name', severity: 'info', penalty: -1, pattern: /forwardRef\s*\(/g, message: 'forwardRef without displayName', fix: 'Add ComponentName.displayName = "ComponentName"' },
];

/* ------------------------------------------------------------------ */
/*  Analysis engine                                                    */
/* ------------------------------------------------------------------ */

/**
 * @param {string} source
 * @param {string} filePath
 * @returns {{ score: number, issues: Array<{rule: string, severity: string, message: string, line: number, fix: string}>, goodPoints: string[] }}
 */
function analyzeFile(source, filePath) {
  const issues = [];
  const goodPoints = [];

  const hasForwardRef = /forwardRef\s*\(/.test(source);
  const hasDisplayName = /\.displayName\s*=/.test(source);

  for (const rule of RULES) {
    // Context-aware skipping
    if (rule.id === 'missing-forward-ref' && hasForwardRef) continue;
    if (rule.id === 'missing-display-name' && hasDisplayName) continue;

    rule.pattern.lastIndex = 0;
    let match;
    while ((match = rule.pattern.exec(source)) !== null) {
      const lineNumber = source.substring(0, match.index).split('\n').length;
      issues.push({
        rule: rule.id,
        severity: rule.severity,
        penalty: rule.penalty,
        message: `${rule.message}: "${match[0]}"`,
        line: lineNumber,
        fix: rule.fix,
      });
    }
  }

  // Detect good patterns
  if (/from\s+['"]@mfe\/design-system/.test(source)) goodPoints.push('Uses @mfe/design-system imports');
  if (/aria-label/.test(source)) goodPoints.push('Has ARIA labels for accessibility');
  if (/forwardRef/.test(source)) goodPoints.push('Uses forwardRef for ref forwarding');
  if (/\.displayName\s*=/.test(source)) goodPoints.push('Sets displayName for debugging');
  if (/data-testid/.test(source)) goodPoints.push('Has test IDs for automated testing');
  if (/useCallback|useMemo/.test(source)) goodPoints.push('Uses memoization hooks');
  if (/try\s*\{/.test(source)) goodPoints.push('Has error handling (try/catch)');
  if (/ErrorBoundary/.test(source)) goodPoints.push('Uses ErrorBoundary component');
  if (/className=.*(?:ms-|me-|ps-|pe-|text-start|text-end)/.test(source)) goodPoints.push('Uses RTL-safe logical properties');

  const errorPenalty = issues.filter(i => i.severity === 'error').length * 10;
  const warningPenalty = issues.filter(i => i.severity === 'warning').length * 5;
  const infoPenalty = issues.filter(i => i.severity === 'info').length * 1;
  const score = Math.max(0, 100 - errorPenalty - warningPenalty - infoPenalty);

  return { score, issues, goodPoints, filePath };
}

/* ------------------------------------------------------------------ */
/*  File discovery                                                     */
/* ------------------------------------------------------------------ */

function getChangedFiles() {
  try {
    const output = execSync('git diff --name-only HEAD~1', { encoding: 'utf-8' });
    return output
      .split('\n')
      .filter(f => f.endsWith('.tsx') || f.endsWith('.ts'))
      .filter(f => !f.includes('.test.') && !f.includes('.spec.') && !f.includes('__tests__'))
      .filter(f => existsSync(f));
  } catch {
    // Fallback: staged files
    try {
      const output = execSync('git diff --cached --name-only', { encoding: 'utf-8' });
      return output
        .split('\n')
        .filter(f => f.endsWith('.tsx') || f.endsWith('.ts'))
        .filter(f => !f.includes('.test.') && !f.includes('.spec.'))
        .filter(f => existsSync(f));
    } catch {
      return [];
    }
  }
}

function getTestSampleFiles() {
  return [
    {
      name: 'sample-good.tsx',
      content: `import { Button, Input } from '@mfe/design-system';
import React, { forwardRef, useMemo } from 'react';

const MyForm = forwardRef<HTMLDivElement, Props>((props, ref) => {
  const options = useMemo(() => [{ label: 'A' }], []);
  return (
    <div ref={ref} data-testid="my-form">
      <Button aria-label="Submit">{t('submit')}</Button>
      <Input aria-label="Name" className="ms-2" />
    </div>
  );
});
MyForm.displayName = 'MyForm';
export default MyForm;`,
    },
    {
      name: 'sample-bad.tsx',
      content: `import { Button } from 'antd';
import { TextField } from '@mui/material';

export const BadPage = (props) => {
  useEffect(async () => {
    const data = await fetch('/api/data');
  }, []);

  return (
    <div style={{ color: 'var(--state-danger-text)' }}>
      <h1> Bu bir cok uzun Turkce test cumlesidir </h1>
      <button>click me</button>
      <input type="text" />
      <div className="ml-4 pl-2 text-left">
        <span style={{ color: 'red' }}>warning</span>
      </div>
      <Button config={{ key: 'val' }} />
      <div items={[ 1, 2, 3 ]} />
    </div>
  );
};`,
    },
    {
      name: 'sample-medium.tsx',
      content: `import { Card, Button } from '@mfe/design-system';
import React, { forwardRef } from 'react';

export const DashboardCard = forwardRef<HTMLDivElement, Props>((props, ref) => {
  return (
    <Card ref={ref}>
      <Button aria-label="Action">Click</Button>
      <div style={{ color: 'var(--text-primary)' }}>
        <span className="ml-2">Content</span>
      </div>
    </Card>
  );
});`,
    },
  ];
}

/* ------------------------------------------------------------------ */
/*  Report generation                                                  */
/* ------------------------------------------------------------------ */

function generateMarkdown(fileResults, overallScore) {
  const icon = overallScore >= 80 ? '🟢' : overallScore >= 50 ? '🟡' : '🔴';
  let md = `## ${icon} Design System Review — Score: ${overallScore}/100\n\n`;

  if (overallScore >= 80) {
    md += `> Great job! Your code follows design system best practices.\n\n`;
  } else if (overallScore >= 50) {
    md += `> Some improvements recommended. Please review the issues below.\n\n`;
  } else {
    md += `> Significant design system violations found. Please address before merging.\n\n`;
  }

  for (const result of fileResults) {
    const fileIcon = result.score >= 80 ? '✅' : result.score >= 50 ? '⚠️' : '❌';
    md += `### ${fileIcon} \`${result.filePath}\` — ${result.score}/100\n\n`;

    if (result.goodPoints.length > 0) {
      md += `**Good practices:**\n`;
      for (const gp of result.goodPoints) {
        md += `- ✅ ${gp}\n`;
      }
      md += '\n';
    }

    if (result.issues.length > 0) {
      md += `| Line | Severity | Rule | Message | Fix |\n`;
      md += `|------|----------|------|---------|-----|\n`;
      for (const issue of result.issues) {
        md += `| ${issue.line} | ${issue.severity} | \`${issue.rule}\` | ${issue.message} | ${issue.fix} |\n`;
      }
      md += '\n';
    } else {
      md += `No issues found.\n\n`;
    }
  }

  // Summary
  const totalIssues = fileResults.reduce((sum, r) => sum + r.issues.length, 0);
  const totalErrors = fileResults.reduce((sum, r) => sum + r.issues.filter(i => i.severity === 'error').length, 0);
  const totalWarnings = fileResults.reduce((sum, r) => sum + r.issues.filter(i => i.severity === 'warning').length, 0);
  const totalInfo = fileResults.reduce((sum, r) => sum + r.issues.filter(i => i.severity === 'info').length, 0);

  md += `---\n`;
  md += `**Summary:** ${fileResults.length} files reviewed, ${totalIssues} issues found `;
  md += `(${totalErrors} errors, ${totalWarnings} warnings, ${totalInfo} info)\n\n`;

  if (totalErrors > 0) {
    md += `### Top suggestions\n`;
    const errorRules = new Set();
    for (const r of fileResults) {
      for (const i of r.issues) {
        if (i.severity === 'error') errorRules.add(`- **${i.rule}**: ${i.fix}`);
      }
    }
    md += [...errorRules].join('\n') + '\n';
  }

  md += `\n_Generated by @mfe/design-system PR Review Bot_\n`;
  return md;
}

/* ------------------------------------------------------------------ */
/*  Main                                                               */
/* ------------------------------------------------------------------ */

function main() {
  const fileResults = [];

  if (testMode) {
    const samples = getTestSampleFiles();
    for (const sample of samples) {
      fileResults.push(analyzeFile(sample.content, sample.name));
    }
  } else if (filesIdx !== -1) {
    const fileArgs = [];
    for (let i = filesIdx + 1; i < args.length; i++) {
      if (args[i].startsWith('--')) break;
      fileArgs.push(args[i]);
    }
    for (const f of fileArgs) {
      const fullPath = resolve(f);
      if (existsSync(fullPath)) {
        const content = readFileSync(fullPath, 'utf-8');
        fileResults.push(analyzeFile(content, f));
      } else {
        console.error(`File not found: ${f}`);
      }
    }
  } else {
    const changed = getChangedFiles();
    if (changed.length === 0) {
      const result = { score: 100, files: [], markdown: 'No changed .tsx/.ts files found.', totalIssues: 0 };
      if (jsonMode) { console.log(JSON.stringify(result)); }
      else { console.log('No changed .tsx/.ts files found to review.'); }
      return;
    }
    for (const f of changed) {
      const content = readFileSync(f, 'utf-8');
      fileResults.push(analyzeFile(content, f));
    }
  }

  // Overall score: average of file scores
  const overallScore = fileResults.length > 0
    ? Math.round(fileResults.reduce((s, r) => s + r.score, 0) / fileResults.length)
    : 100;

  const totalIssues = fileResults.reduce((s, r) => s + r.issues.length, 0);
  const markdown = generateMarkdown(fileResults, overallScore);

  if (jsonMode) {
    const output = {
      score: overallScore,
      totalIssues,
      files: fileResults.map(r => ({
        path: r.filePath,
        score: r.score,
        issues: r.issues.map(i => ({ rule: i.rule, severity: i.severity, line: i.line, message: i.message, fix: i.fix })),
        goodPoints: r.goodPoints,
      })),
      markdown,
    };
    console.log(JSON.stringify(output, null, 2));
  } else {
    console.log(markdown);
  }

  // Exit with error if below threshold
  if (threshold !== null && overallScore < threshold) {
    if (!jsonMode) {
      console.error(`\nFailed: PR score ${overallScore} is below threshold ${threshold}`);
    }
    process.exit(1);
  }
}

main();
