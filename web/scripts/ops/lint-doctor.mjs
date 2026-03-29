#!/usr/bin/env node
/**
 * Lint Doctor v1.0 — ESLint health check & trend analysis.
 *
 * Checks (8):
 *  1. eslint-total           Total warning count vs threshold
 *  2. eslint-errors          Zero-error enforcement
 *  3. unused-vars            no-unused-vars + @typescript-eslint/no-unused-vars
 *  4. css-var-fallback       css-var-fallback/no-css-var-without-fallback
 *  5. explicit-any           @typescript-eslint/no-explicit-any
 *  6. constant-conditions    no-constant-condition + no-constant-binary-expression
 *  7. auto-fixable           prefer-const, no-var (--fix candidates)
 *  8. ignored-dirs           Warnings from dirs that should be in ESLint ignores
 *
 * Outputs:
 *  - Per-rule breakdown with counts
 *  - Per-directory hotspot analysis
 *  - Auto-fix opportunities
 *  - Reduction roadmap with effort estimates
 *
 * Usage:
 *   node scripts/ops/lint-doctor.mjs              # terminal report
 *   node scripts/ops/lint-doctor.mjs --json        # JSON output
 *   node scripts/ops/lint-doctor.mjs --fix         # apply safe auto-fixes
 *   node scripts/ops/lint-doctor.mjs --save        # save report to test-results/
 *
 * Exit: 0 = healthy (0 warnings), 1 = issues found
 */

import { mkdirSync, writeFileSync } from 'node:fs';
import { join, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..', '..');

const flags = new Set(process.argv.slice(2));
const JSON_MODE = flags.has('--json');
const FIX_MODE = flags.has('--fix');
const SAVE_MODE = flags.has('--save');

/* ------------------------------------------------------------------ */
/*  Run ESLint and parse JSON output                                   */
/* ------------------------------------------------------------------ */

function runEslint() {
  try {
    const cmd = FIX_MODE
      ? 'npx eslint . --fix --format json'
      : 'npx eslint . --format json';
    const stdout = execSync(cmd, {
      cwd: ROOT,
      encoding: 'utf8',
      maxBuffer: 1024 * 1024 * 64,
      stdio: ['pipe', 'pipe', 'pipe'],
    });
    return JSON.parse(stdout);
  } catch (err) {
    // ESLint exits non-zero when warnings/errors exist — that's expected
    if (err.stdout) {
      try {
        return JSON.parse(err.stdout);
      } catch {
        // fall through
      }
    }
    throw new Error(`ESLint execution failed: ${err.message}`);
  }
}

/* ------------------------------------------------------------------ */
/*  Analysis functions                                                 */
/* ------------------------------------------------------------------ */

function analyzeResults(eslintResults) {
  const byRule = {};
  const byDir = {};
  const byFile = {};
  const fixable = { count: 0, rules: {} };
  let totalWarnings = 0;
  let totalErrors = 0;

  for (const file of eslintResults) {
    const rel = relative(ROOT, file.filePath);
    const dir = rel.split('/').slice(0, 2).join('/');

    for (const msg of file.messages) {
      const rule = msg.ruleId || 'unknown';
      const severity = msg.severity; // 1=warn, 2=error

      if (severity === 2) {
        totalErrors++;
      } else {
        totalWarnings++;
      }

      byRule[rule] = (byRule[rule] || 0) + 1;

      const dirKey = `${dir}|${rule}`;
      byDir[dirKey] = (byDir[dirKey] || 0) + 1;

      byFile[rel] = (byFile[rel] || 0) + 1;

      if (msg.fix) {
        fixable.count++;
        fixable.rules[rule] = (fixable.rules[rule] || 0) + 1;
      }
    }
  }

  return { totalWarnings, totalErrors, byRule, byDir, byFile, fixable };
}

function getIgnoredDirWarnings(byDir) {
  const ignoredPatterns = ['.__mf__temp', '.mf/', 'scripts/theme', 'archive/'];
  const hits = {};
  for (const [key, count] of Object.entries(byDir)) {
    const dir = key.split('|')[0];
    if (ignoredPatterns.some((p) => dir.includes(p))) {
      hits[key] = count;
    }
  }
  return hits;
}

function getTopFiles(byFile, limit = 15) {
  return Object.entries(byFile)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit);
}

function getTopDirRuleCombos(byDir, limit = 20) {
  return Object.entries(byDir)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([key, count]) => {
      const [dir, rule] = key.split('|');
      return { dir, rule, count };
    });
}

/* ------------------------------------------------------------------ */
/*  Check definitions                                                  */
/* ------------------------------------------------------------------ */

const results = [];
let passCount = 0;
let warnCount = 0;
let failCount = 0;

function check(id, label, fn) {
  try {
    const result = fn();
    const status = result.status;
    if (status === 'pass') passCount++;
    else if (status === 'warn') warnCount++;
    else failCount++;
    results.push({ id, label, ...result });
  } catch (err) {
    failCount++;
    results.push({ id, label, status: 'fail', message: `Exception: ${err.message}` });
  }
}

/* ------------------------------------------------------------------ */
/*  Main                                                               */
/* ------------------------------------------------------------------ */

function main() {
  const startedAt = new Date();

  if (!JSON_MODE) {
    console.log('');
    console.log('  ╔══════════════════════════════════════════╗');
    console.log('  ║         Lint Doctor v1.0                 ║');
    console.log('  ║    ESLint Health Check & Trend Analysis  ║');
    console.log('  ╚══════════════════════════════════════════╝');
    console.log('');
    if (FIX_MODE) console.log('  🔧 FIX MODE — applying safe auto-fixes...\n');
    console.log('  Running ESLint analysis...');
  }

  const eslintData = runEslint();
  const analysis = analyzeResults(eslintData);
  const { totalWarnings, totalErrors, byRule, byDir, byFile, fixable } = analysis;

  const ignoredDirHits = getIgnoredDirWarnings(byDir);
  const ignoredDirTotal = Object.values(ignoredDirHits).reduce((a, b) => a + b, 0);
  const topFiles = getTopFiles(byFile);
  const topCombos = getTopDirRuleCombos(byDir);

  const rulesSorted = Object.entries(byRule).sort((a, b) => b[1] - a[1]);
  const fixableRulesSorted = Object.entries(fixable.rules).sort((a, b) => b[1] - a[1]);

  // ── Checks ──

  check('eslint-errors', 'Zero ESLint errors', () => {
    if (totalErrors === 0) return { status: 'pass', message: '0 errors' };
    return { status: 'fail', message: `${totalErrors} errors found` };
  });

  check('eslint-total', 'Total ESLint warnings', () => {
    if (totalWarnings === 0) return { status: 'pass', message: '0 warnings — perfect!' };
    if (totalWarnings <= 100) return { status: 'warn', message: `${totalWarnings} warnings (target: 0)` };
    return { status: 'fail', message: `${totalWarnings} warnings (target: 0, threshold: 100)` };
  });

  check('unused-vars', 'Unused variables & imports', () => {
    const count = (byRule['no-unused-vars'] || 0) + (byRule['@typescript-eslint/no-unused-vars'] || 0);
    if (count === 0) return { status: 'pass', message: '0 unused vars' };
    return { status: 'fail', message: `${count} unused vars/imports`, count };
  });

  check('css-var-fallback', 'CSS var() fallback enforcement', () => {
    const count = byRule['css-var-fallback/no-css-var-without-fallback'] || 0;
    if (count === 0) return { status: 'pass', message: '0 violations' };
    return { status: 'warn', message: `${count} var() without fallback`, count };
  });

  check('explicit-any', 'TypeScript explicit any usage', () => {
    const count = byRule['@typescript-eslint/no-explicit-any'] || 0;
    if (count === 0) return { status: 'pass', message: '0 any types' };
    if (count <= 50) return { status: 'warn', message: `${count} explicit any (target: 0)`, count };
    return { status: 'fail', message: `${count} explicit any (target: 0)`, count };
  });

  check('constant-conditions', 'Constant conditions & expressions', () => {
    const count = (byRule['no-constant-condition'] || 0) + (byRule['no-constant-binary-expression'] || 0);
    if (count === 0) return { status: 'pass', message: '0 constant conditions' };
    return { status: 'warn', message: `${count} constant conditions`, count };
  });

  check('auto-fixable', 'Auto-fixable warnings', () => {
    if (fixable.count === 0) return { status: 'pass', message: 'Nothing to auto-fix' };
    return {
      status: 'warn',
      message: `${fixable.count} warnings fixable with --fix`,
      rules: fixableRulesSorted,
    };
  });

  check('ignored-dirs', 'Warnings from generated directories', () => {
    if (ignoredDirTotal === 0) return { status: 'pass', message: 'No warnings from generated dirs' };
    return {
      status: 'warn',
      message: `${ignoredDirTotal} warnings from dirs that should be in ESLint ignores`,
      dirs: Object.entries(ignoredDirHits).map(([k, v]) => `${k.split('|')[0]}: ${v}`),
    };
  });

  // ── Output ──

  const endedAt = new Date();
  const overall = failCount > 0 ? 'FAIL' : warnCount > 0 ? 'WARN' : 'PASS';

  const summary = {
    version: '1.0',
    doctor_id: 'lint-doctor',
    started_at: startedAt.toISOString(),
    ended_at: endedAt.toISOString(),
    overall_status: overall,
    fix_mode: FIX_MODE,
    totals: { errors: totalErrors, warnings: totalWarnings, fixable: fixable.count },
    checks: results,
    breakdown: {
      by_rule: rulesSorted.map(([rule, count]) => ({ rule, count })),
      top_files: topFiles.map(([file, count]) => ({ file, count })),
      top_hotspots: topCombos,
      auto_fixable_rules: fixableRulesSorted.map(([rule, count]) => ({ rule, count })),
    },
    roadmap: buildRoadmap(analysis),
  };

  if (JSON_MODE) {
    console.log(JSON.stringify(summary, null, 2));
  } else {
    printReport(summary);
  }

  if (SAVE_MODE) {
    const outDir = join(ROOT, 'test-results', 'diagnostics', 'lint-doctor');
    const stamp = startedAt.toISOString().replace(/[:.]/g, '-');
    mkdirSync(outDir, { recursive: true });
    const jsonPath = join(outDir, `${stamp}.json`);
    const mdPath = join(outDir, `${stamp}.md`);
    writeFileSync(jsonPath, JSON.stringify(summary, null, 2), 'utf8');
    writeFileSync(mdPath, buildMarkdownReport(summary), 'utf8');
    if (!JSON_MODE) console.log(`\n  📁 Report saved: ${relative(ROOT, jsonPath)}`);
  }

  process.exit(overall === 'PASS' ? 0 : 1);
}

/* ------------------------------------------------------------------ */
/*  Roadmap builder                                                    */
/* ------------------------------------------------------------------ */

function buildRoadmap(analysis) {
  const { totalWarnings, byRule, fixable } = analysis;
  const phases = [];

  // Phase 1: ESLint ignores for generated dirs
  const ignoredCount = Object.values(getIgnoredDirWarnings(analysis.byDir))
    .reduce((a, b) => a + b, 0);
  if (ignoredCount > 0) {
    phases.push({
      id: 'phase-1-ignores',
      label: 'Add generated dirs to ESLint ignores',
      reduction: ignoredCount,
      effort: '1 min',
      auto: true,
    });
  }

  // Phase 2: Auto-fix
  if (fixable.count > 0) {
    phases.push({
      id: 'phase-2-autofix',
      label: 'Run eslint --fix (prefer-const, no-var)',
      reduction: fixable.count,
      effort: '2 min',
      auto: true,
    });
  }

  // Phase 3: Unused vars
  const unusedCount = (byRule['no-unused-vars'] || 0) + (byRule['@typescript-eslint/no-unused-vars'] || 0);
  if (unusedCount > 0) {
    phases.push({
      id: 'phase-3-unused-vars',
      label: 'Remove unused imports & variables',
      reduction: unusedCount,
      effort: '30 min (auto-remove script)',
      auto: true,
    });
  }

  // Phase 4: CSS var fallback
  const cssVarCount = byRule['css-var-fallback/no-css-var-without-fallback'] || 0;
  if (cssVarCount > 0) {
    phases.push({
      id: 'phase-4-css-var-fallback',
      label: 'Resolve css-var-fallback rule (disable or add fallbacks)',
      reduction: cssVarCount,
      effort: '15 min',
      auto: false,
    });
  }

  // Phase 5: Explicit any
  const anyCount = byRule['@typescript-eslint/no-explicit-any'] || 0;
  if (anyCount > 0) {
    phases.push({
      id: 'phase-5-explicit-any',
      label: 'Replace explicit any with proper types',
      reduction: anyCount,
      effort: '2-3 hours (manual)',
      auto: false,
    });
  }

  // Phase 6: Remaining
  const covered = ignoredCount + fixable.count + unusedCount + cssVarCount + anyCount;
  const remaining = totalWarnings - covered;
  if (remaining > 0) {
    phases.push({
      id: 'phase-6-remaining',
      label: 'Fix remaining rules (constants, empty types, misc)',
      reduction: remaining,
      effort: '30 min',
      auto: false,
    });
  }

  let cumulative = totalWarnings;
  for (const phase of phases) {
    cumulative -= phase.reduction;
    phase.cumulative_after = cumulative;
  }

  return phases;
}

/* ------------------------------------------------------------------ */
/*  Terminal report                                                    */
/* ------------------------------------------------------------------ */

function printReport(summary) {
  const { totals, checks, breakdown, roadmap } = summary;
  const statusIcon = { pass: '✅', warn: '⚠️', fail: '❌' };

  console.log(`\n  Total: ${totals.errors} errors, ${totals.warnings} warnings, ${totals.fixable} auto-fixable\n`);

  // Checks
  console.log('  ┌─────────────────────────────────────────────────────────┐');
  console.log('  │ Health Checks                                          │');
  console.log('  ├─────────────────────────────────────────────────────────┤');
  for (const c of checks) {
    const icon = statusIcon[c.status] || '❓';
    console.log(`  │ ${icon} ${c.label.padEnd(30)} ${c.message.padEnd(24)} │`);
  }
  console.log('  └─────────────────────────────────────────────────────────┘');

  // By rule
  console.log('\n  📊 Warnings by Rule:');
  for (const { rule, count } of breakdown.by_rule.slice(0, 10)) {
    const bar = '█'.repeat(Math.min(40, Math.round((count / totals.warnings) * 40)));
    console.log(`     ${String(count).padStart(5)}  ${bar}  ${rule}`);
  }

  // Top files
  console.log('\n  🔥 Top Files:');
  for (const { file, count } of breakdown.top_files.slice(0, 10)) {
    console.log(`     ${String(count).padStart(5)}  ${file}`);
  }

  // Top hotspots
  console.log('\n  🎯 Top Hotspots (dir + rule):');
  for (const { dir, rule, count } of breakdown.top_hotspots.slice(0, 10)) {
    console.log(`     ${String(count).padStart(5)}  ${dir}  →  ${rule}`);
  }

  // Auto-fixable
  if (breakdown.auto_fixable_rules.length > 0) {
    console.log('\n  🔧 Auto-fixable (run with --fix):');
    for (const { rule, count } of breakdown.auto_fixable_rules) {
      console.log(`     ${String(count).padStart(5)}  ${rule}`);
    }
  }

  // Roadmap
  if (roadmap.length > 0) {
    console.log('\n  🗺️  Reduction Roadmap:');
    console.log('  ┌──────┬───────────────────────────────────────────┬──────────┬───────────┐');
    console.log('  │ Phase│ Action                                    │ Reduction│ Remaining │');
    console.log('  ├──────┼───────────────────────────────────────────┼──────────┼───────────┤');
    for (let i = 0; i < roadmap.length; i++) {
      const p = roadmap[i];
      const num = String(i + 1).padStart(3);
      const label = p.label.slice(0, 41).padEnd(41);
      const red = String(`-${p.reduction}`).padStart(8);
      const cum = String(p.cumulative_after).padStart(9);
      console.log(`  │ ${num}  │ ${label} │ ${red} │ ${cum} │`);
    }
    console.log('  └──────┴───────────────────────────────────────────┴──────────┴───────────┘');
  }

  console.log(`\n  Overall: ${summary.overall_status}\n`);
}

/* ------------------------------------------------------------------ */
/*  Markdown report                                                    */
/* ------------------------------------------------------------------ */

function buildMarkdownReport(summary) {
  const { totals, checks, breakdown, roadmap } = summary;
  const lines = [];

  lines.push('# Lint Doctor Report');
  lines.push('');
  lines.push(`- Date: ${summary.started_at}`);
  lines.push(`- Overall: ${summary.overall_status}`);
  lines.push(`- Errors: ${totals.errors} | Warnings: ${totals.warnings} | Fixable: ${totals.fixable}`);
  lines.push('');

  lines.push('## Health Checks');
  lines.push('| Check | Status | Message |');
  lines.push('|-------|--------|---------|');
  for (const c of checks) {
    lines.push(`| ${c.label} | ${c.status.toUpperCase()} | ${c.message} |`);
  }
  lines.push('');

  lines.push('## Warnings by Rule');
  lines.push('| Rule | Count | % |');
  lines.push('|------|-------|---|');
  for (const { rule, count } of breakdown.by_rule) {
    const pct = ((count / totals.warnings) * 100).toFixed(1);
    lines.push(`| ${rule} | ${count} | ${pct}% |`);
  }
  lines.push('');

  lines.push('## Top Files');
  lines.push('| File | Count |');
  lines.push('|------|-------|');
  for (const { file, count } of breakdown.top_files) {
    lines.push(`| ${file} | ${count} |`);
  }
  lines.push('');

  lines.push('## Reduction Roadmap');
  lines.push('| Phase | Action | Reduction | Remaining | Effort |');
  lines.push('|-------|--------|-----------|-----------|--------|');
  for (let i = 0; i < roadmap.length; i++) {
    const p = roadmap[i];
    lines.push(`| ${i + 1} | ${p.label} | -${p.reduction} | ${p.cumulative_after} | ${p.effort} |`);
  }

  return lines.join('\n');
}

/* ------------------------------------------------------------------ */
main();
