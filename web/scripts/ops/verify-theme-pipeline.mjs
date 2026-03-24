#!/usr/bin/env node
/**
 * Verify Theme Pipeline — unified gate that runs every token & theme check.
 *
 * Steps:
 *  1. Token validation   (validate-tokens.mjs)
 *  2. DTCG schema lint    (lint-tokens.mjs)
 *  3. Token drift         (detect-token-drift.mjs)
 *  4. Tailwind semantic   (check-tailwind-semantic.mjs)
 *  5. Theme doctor        (theme-doctor.mjs --json)
 *  6. Stylelint           (stylelint on theme CSS files only — fast)
 *
 * Usage:
 *   node scripts/ops/verify-theme-pipeline.mjs
 *   npm run verify:theme
 *
 * Exit: 0 = all pass, 1 = any step failed
 */

import { execSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..', '..');

const steps = [
  {
    id: 'token-validate',
    label: 'Token validation (TS sources)',
    cmd: 'node scripts/tokens/validate-tokens.mjs',
    allowFail: false,
  },
  {
    id: 'dtcg-lint',
    label: 'DTCG schema lint',
    cmd: 'node scripts/lint-tokens.mjs',
    allowFail: false,
  },
  {
    id: 'token-drift',
    label: 'Token drift detection (Figma ↔ DTCG)',
    cmd: 'node scripts/detect-token-drift.mjs',
    allowFail: true, // warn-only — drift is expected during migration
  },
  {
    id: 'tailwind-semantic',
    label: 'Tailwind semantic color check',
    cmd: 'node scripts/lint/check-tailwind-semantic.mjs',
    allowFail: false,
  },
  {
    id: 'theme-doctor',
    label: 'Theme doctor (10-point health check)',
    cmd: 'node scripts/ops/theme-doctor.mjs --json',
    allowFail: true, // warns are acceptable
    parseJson: true,
  },
  {
    id: 'stylelint-theme',
    label: 'Stylelint on theme CSS files',
    cmd: 'npx stylelint "apps/mfe-shell/src/styles/*.css" --allow-empty-input --quiet',
    allowFail: true, // theme.css has auto-generated color(srgb) values
  },
];

console.log('');
console.log('╔══════════════════════════════════════════════════════════════╗');
console.log('║              Verify Theme Pipeline                          ║');
console.log('╚══════════════════════════════════════════════════════════════╝');
console.log('');

let hasFailure = false;
const results = [];

for (const step of steps) {
  const start = Date.now();
  let status = 'pass';
  let output = '';
  let doctorSummary = null;

  try {
    output = execSync(step.cmd, { cwd: ROOT, timeout: 30000, stdio: ['pipe', 'pipe', 'pipe'] }).toString();
    if (step.parseJson) {
      try {
        const json = JSON.parse(output);
        doctorSummary = json.summary;
        if (json.summary?.fail > 0) status = 'fail';
        else if (json.summary?.warn > 0) status = 'warn';
      } catch { /* not json */ }
    }
  } catch (err) {
    output = err.stdout?.toString() || err.stderr?.toString() || err.message;
    status = step.allowFail ? 'warn' : 'fail';

    if (step.parseJson) {
      try {
        const json = JSON.parse(output);
        doctorSummary = json.summary;
        if (json.summary?.fail > 0) status = 'fail';
        else if (json.summary?.warn > 0) status = 'warn';
      } catch { /* not json */ }
    }
  }

  const elapsed = Date.now() - start;
  const icon = status === 'pass' ? '✅' : status === 'warn' ? '⚠️ ' : '❌';

  if (status === 'fail') hasFailure = true;

  console.log(`  ${icon} ${step.label} (${elapsed}ms)`);
  if (doctorSummary) {
    console.log(`     ${doctorSummary.pass} pass, ${doctorSummary.warn} warn, ${doctorSummary.fail} fail`);
  }
  if (status === 'fail' && !step.parseJson) {
    const lines = output.trim().split('\n').slice(-5);
    for (const line of lines) console.log(`     ${line}`);
  }

  results.push({ id: step.id, status, elapsed });
}

console.log('');
console.log('─'.repeat(62));
const passCount = results.filter(r => r.status === 'pass').length;
const warnCount = results.filter(r => r.status === 'warn').length;
const failCount = results.filter(r => r.status === 'fail').length;
console.log(`  Pipeline: ${passCount} pass, ${warnCount} warn, ${failCount} fail (${results.length} steps)`);
console.log('');

process.exit(hasFailure ? 1 : 0);
