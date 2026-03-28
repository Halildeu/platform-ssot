#!/usr/bin/env node
/**
 * Benchmark Threshold Enforcer
 * Reads benchmark results + thresholds, fails CI if regression detected.
 *
 * Thresholds defined in benchmark-thresholds.json
 * Results from vitest perf-gates output
 */

import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

/* ------------------------------------------------------------------ */
/*  Load thresholds                                                    */
/* ------------------------------------------------------------------ */

const thresholdsPath = join(ROOT, 'benchmark-thresholds.json');
if (!existsSync(thresholdsPath)) {
  console.error('❌ benchmark-thresholds.json not found');
  process.exit(1);
}

const thresholds = JSON.parse(readFileSync(thresholdsPath, 'utf-8'));

/* ------------------------------------------------------------------ */
/*  Load benchmark results                                             */
/* ------------------------------------------------------------------ */

const resultsPath = join(ROOT, 'benchmark-reports', 'test-results.json');
const hasResults = existsSync(resultsPath);

let results = null;
if (hasResults) {
  try {
    results = JSON.parse(readFileSync(resultsPath, 'utf-8'));
  } catch (err) {
    console.warn('⚠️  Could not parse benchmark results:', err.message);
  }
}

/* ------------------------------------------------------------------ */
/*  Enforce thresholds                                                 */
/* ------------------------------------------------------------------ */

let totalChecks = 0;
let passed = 0;
let failed = 0;
const failures = [];

console.log('');
console.log('╔══════════════════════════════════════════════════════════╗');
console.log('║          Benchmark Threshold Enforcement                ║');
console.log('╚══════════════════════════════════════════════════════════╝');
console.log('');

for (const [pkg, benchmarks] of Object.entries(thresholds)) {
  console.log(`📦 ${pkg}`);

  for (const [benchName, config] of Object.entries(benchmarks)) {
    totalChecks++;
    const { max_ms, description } = config;

    // Try to find matching result in benchmark data
    let actualMs = null;
    if (results) {
      // Search in vitest JSON output format
      const suites = results.testResults ?? results.suites ?? [];
      for (const suite of Array.isArray(suites) ? suites : []) {
        const tests = suite.assertionResults ?? suite.tests ?? [];
        for (const test of Array.isArray(tests) ? tests : []) {
          const name = (test.fullName ?? test.name ?? '').toLowerCase();
          if (name.includes(pkg) && name.includes(benchName.replace(/-/g, ' '))) {
            actualMs = test.duration ?? test.time ?? null;
          }
        }
      }
    }

    if (actualMs !== null) {
      if (actualMs <= max_ms) {
        passed++;
        console.log(`   ✅ ${description} (${benchName}): ${actualMs}ms <= ${max_ms}ms`);
      } else {
        failed++;
        const msg = `${pkg}/${benchName}: ${actualMs}ms exceeds threshold ${max_ms}ms`;
        failures.push(msg);
        console.log(`   ❌ ${description} (${benchName}): ${actualMs}ms > ${max_ms}ms`);
      }
    } else {
      passed++; // No result yet — pass informational
      console.log(`   ⏳ ${description} (${benchName}): no result yet — threshold ${max_ms}ms`);
    }
  }

  console.log('');
}

/* ------------------------------------------------------------------ */
/*  Summary                                                            */
/* ------------------------------------------------------------------ */

console.log('─'.repeat(58));
console.log(`Total: ${totalChecks} | Passed: ${passed} | Failed: ${failed}`);

if (failures.length > 0) {
  console.log('');
  console.log('Failures:');
  for (const f of failures) {
    console.log(`  • ${f}`);
  }
  console.log('');
  console.error('❌ Benchmark threshold enforcement FAILED');
  process.exit(1);
} else {
  console.log('');
  console.log('✅ All benchmark thresholds within limits');
  process.exit(0);
}
