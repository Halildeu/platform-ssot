#!/usr/bin/env node
/**
 * Evidence Collector — CI artefaktlarını tek JSON'da toplar
 *
 * Usage: node scripts/collect-evidence.mjs
 *
 * Reads from:
 * - .github/workflows/*.yml (workflow existence + config)
 * - packages/design-system/coverage/ (if exists)
 * - test results from last verify run
 * - benchmark results
 * - security scan results
 *
 * Outputs: .evidence/registry.json
 */

import { readFileSync, existsSync, mkdirSync, writeFileSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const ROOT = resolve(__dirname, '..');

/* ------------------------------------------------------------------ */
/*  Helpers                                                             */
/* ------------------------------------------------------------------ */

function workflowExists(name) {
  return existsSync(join(ROOT, '.github', 'workflows', name));
}

function readJSON(filePath) {
  try {
    return JSON.parse(readFileSync(filePath, 'utf-8'));
  } catch {
    return null;
  }
}

function readYAMLField(filePath, field) {
  try {
    const content = readFileSync(filePath, 'utf-8');
    // Simple regex extraction — good enough for CI config fields
    const regex = new RegExp(`${field}:\\s*\\[([^\\]]+)\\]`);
    const match = content.match(regex);
    if (match) {
      return match[1].split(',').map((s) => s.trim().replace(/['"]/g, ''));
    }
    return null;
  } catch {
    return null;
  }
}

/* ------------------------------------------------------------------ */
/*  Visual Regression                                                   */
/* ------------------------------------------------------------------ */

function collectVisualRegression() {
  const chromaticExists = workflowExists('chromatic.yml');
  const provider = chromaticExists ? 'chromatic' : 'none';

  return {
    provider,
    workflow_exists: chromaticExists,
    last_run: null,
    status: chromaticExists ? 'configured' : 'never_run',
    stats: { pass: 0, fail: 0, changed: 0, new: 0, skipped: 0 },
  };
}

/* ------------------------------------------------------------------ */
/*  Security                                                            */
/* ------------------------------------------------------------------ */

function collectSecurity() {
  const checks = {
    codeql: 'codeql.yml',
    secret_scan: 'secret-scan.yml',
    trivy: 'security-guardrails.yml',
    sbom: 'security-guardrails.yml',
    guardrails: 'security-guardrails.yml',
  };

  const result = {};
  for (const [key, file] of Object.entries(checks)) {
    const exists = workflowExists(file);
    result[key] = {
      workflow_exists: exists,
      status: exists ? 'configured' : 'missing',
    };
  }
  return result;
}

/* ------------------------------------------------------------------ */
/*  Benchmarks                                                          */
/* ------------------------------------------------------------------ */

function collectBenchmarks() {
  const wfExists = workflowExists('benchmark-gate.yml');

  // Try to read benchmark results if they exist
  const benchResultPath = join(ROOT, '.evidence', 'benchmark-results.json');
  const results = readJSON(benchResultPath) ?? {};

  // Check if threshold enforcement is configured
  let thresholdEnforced = false;
  if (wfExists) {
    try {
      const content = readFileSync(join(ROOT, '.github', 'workflows', 'benchmark-gate.yml'), 'utf-8');
      thresholdEnforced = content.includes('threshold') || content.includes('budget');
    } catch {
      // ignore
    }
  }

  return {
    workflow_exists: wfExists,
    last_run: null,
    threshold_enforced: thresholdEnforced,
    results,
  };
}

/* ------------------------------------------------------------------ */
/*  Coverage                                                            */
/* ------------------------------------------------------------------ */

function collectCoverage() {
  const summaryPath = join(ROOT, 'packages', 'design-system', 'coverage', 'coverage-summary.json');
  const summary = readJSON(summaryPath);

  if (!summary?.total) {
    return {
      available: false,
      lines: null,
      branches: null,
      functions: null,
      statements: null,
    };
  }

  const t = summary.total;
  return {
    available: true,
    lines: t.lines?.pct ?? null,
    branches: t.branches?.pct ?? null,
    functions: t.functions?.pct ?? null,
    statements: t.statements?.pct ?? null,
  };
}

/* ------------------------------------------------------------------ */
/*  Compatibility Matrix                                                */
/* ------------------------------------------------------------------ */

function collectCompatibility() {
  const wfExists = workflowExists('compatibility-matrix.yml');
  const matrix = { node: ['20', '22'], react: ['18.2', '18.3'] };

  if (wfExists) {
    const wfPath = join(ROOT, '.github', 'workflows', 'compatibility-matrix.yml');
    const nodeVersions = readYAMLField(wfPath, 'node-version') ?? readYAMLField(wfPath, 'node');
    const reactVersions = readYAMLField(wfPath, 'react-version') ?? readYAMLField(wfPath, 'react');
    if (nodeVersions) matrix.node = nodeVersions;
    if (reactVersions) matrix.react = reactVersions;
  }

  return {
    workflow_exists: wfExists,
    matrix,
  };
}

/* ------------------------------------------------------------------ */
/*  Browser Tests                                                       */
/* ------------------------------------------------------------------ */

function collectBrowserTests() {
  const dir = join(ROOT, 'packages');
  let count = 0;
  try {
    count = parseInt(
      execSync(
        'find . -name "*.browser.test.*" -not -path "*/node_modules/*" 2>/dev/null | wc -l',
        { cwd: dir, encoding: 'utf-8' },
      ).trim(),
      10,
    ) || 0;
  } catch {
    // fallback
  }
  return {
    files: count,
    provider: 'playwright',
  };
}

/* ------------------------------------------------------------------ */
/*  Visual Regression Tests (vitest-screenshot)                         */
/* ------------------------------------------------------------------ */

function collectVisualRegressionTests() {
  const dir = join(ROOT, 'packages');
  let count = 0;
  try {
    count = parseInt(
      execSync(
        'find . -name "*.visual.test.*" -not -path "*/node_modules/*" 2>/dev/null | wc -l',
        { cwd: dir, encoding: 'utf-8' },
      ).trim(),
      10,
    ) || 0;
  } catch {
    // fallback
  }
  return {
    files: count,
    provider: 'vitest-screenshot',
  };
}

/* ------------------------------------------------------------------ */
/*  Tests                                                               */
/* ------------------------------------------------------------------ */

function collectTests() {
  // Try to read cached test results from .evidence/test-results.json
  const cachedPath = join(ROOT, '.evidence', 'test-results.json');
  const cached = readJSON(cachedPath);
  if (cached) return cached;

  // Fallback: return structure with zeros — real numbers come from CI
  return {
    design_system: { files: 0, tests: 0, pass: 0, fail: 0 },
    x_suite: { files: 0, tests: 0, pass: 0, fail: 0 },
    shell: { files: 0, tests: 0, pass: 0, fail: 0 },
  };
}

/* ------------------------------------------------------------------ */
/*  Docs Truth                                                          */
/* ------------------------------------------------------------------ */

function collectDocsTruth() {
  const cachedPath = join(ROOT, '.evidence', 'docs-truth.json');
  const cached = readJSON(cachedPath);
  if (cached) return cached;

  return {
    phantom_imports: 0,
    stale_examples: 0,
    last_check: null,
  };
}

/* ------------------------------------------------------------------ */
/*  Main                                                                */
/* ------------------------------------------------------------------ */

function main() {
  const outDir = join(ROOT, '.evidence');
  if (!existsSync(outDir)) {
    mkdirSync(outDir, { recursive: true });
  }

  const registry = {
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    visual_regression: collectVisualRegression(),
    browser_tests: collectBrowserTests(),
    visual_regression_tests: collectVisualRegressionTests(),
    security: collectSecurity(),
    benchmarks: collectBenchmarks(),
    coverage: collectCoverage(),
    compatibility: collectCompatibility(),
    tests: collectTests(),
    docs_truth: collectDocsTruth(),
  };

  const outPath = join(outDir, 'registry.json');
  writeFileSync(outPath, JSON.stringify(registry, null, 2) + '\n');

  console.log(`[evidence] Registry written to ${outPath}`);
  console.log(`[evidence] Timestamp: ${registry.timestamp}`);
  console.log(`[evidence] Coverage available: ${registry.coverage.available}`);
  console.log(`[evidence] Workflows detected: ${Object.values(registry.security).filter((s) => s.workflow_exists).length} security, ${registry.visual_regression.workflow_exists ? 1 : 0} visual, ${registry.benchmarks.workflow_exists ? 1 : 0} benchmark`);
}

main();
