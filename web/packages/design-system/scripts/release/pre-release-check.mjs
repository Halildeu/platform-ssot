#!/usr/bin/env node
/**
 * Pre-release Checklist — THE canonical release gate.
 *
 * Runs ALL quality gates from quality-gate.mjs, PLUS release-specific checks:
 * - Clean working tree
 * - npm publish --dry-run
 *
 * This is the single source of truth for "can we release?"
 * Both publish-stable.mjs and publish-canary.mjs delegate here.
 *
 * Usage:
 *   node scripts/release/pre-release-check.mjs              Full check
 *   node scripts/release/pre-release-check.mjs --skip-visual Skip Playwright
 *   node scripts/release/pre-release-check.mjs --allow-dirty Allow uncommitted changes
 */
import { execSync } from 'node:child_process';
import { join } from 'node:path';

const ROOT = join(import.meta.dirname, '..', '..');
const skipVisual = process.argv.includes('--skip-visual');
const allowDirty = process.argv.includes('--allow-dirty');

/** @type {Array<{name: string, run: () => void, skip?: boolean}>} */
const gates = [
  /* ---- Release-specific gates ---- */
  {
    name: 'Clean working tree',
    skip: allowDirty,
    run: () => {
      const status = execSync('git status --porcelain', { cwd: ROOT, encoding: 'utf-8' }).trim();
      if (status) {
        throw new Error(`Uncommitted changes:\n${status}`);
      }
    },
  },

  /* ---- Core quality gates (same as quality-gate.mjs) ---- */
  {
    name: 'Build',
    run: () => execSync('npm run build', { cwd: ROOT, stdio: 'pipe', timeout: 300_000 }),
  },
  {
    name: 'Tests',
    run: () => execSync('npx vitest run', { cwd: ROOT, stdio: 'pipe', timeout: 300_000 }),
  },
  {
    name: 'Perf Benchmarks',
    run: () => execSync('node scripts/ci/perf-benchmark.mjs', { cwd: ROOT, stdio: 'pipe', timeout: 300_000 }),
  },
  {
    name: 'Bundle Size',
    run: () => execSync('node scripts/ci/bundle-size.mjs --budget', { cwd: ROOT, stdio: 'pipe', timeout: 300_000 }),
  },
  {
    name: 'Semver Check',
    run: () => execSync('node scripts/ci/semver-check.mjs', { cwd: ROOT, stdio: 'pipe', timeout: 300_000 }),
  },
  {
    name: 'Deprecation Audit',
    run: () => execSync('node scripts/ci/deprecation-audit.mjs', { cwd: ROOT, stdio: 'pipe', timeout: 300_000 }),
  },
  {
    name: 'API Reference',
    run: () => execSync('node scripts/generate-api-reference.mjs', { cwd: ROOT, stdio: 'pipe', timeout: 300_000 }),
  },
  {
    name: 'Pack Dry-Run',
    run: () => execSync('npm pack --dry-run', { cwd: ROOT, stdio: 'pipe', timeout: 60_000 }),
  },
  {
    name: 'Consumer Smoke',
    run: () => execSync('node scripts/ci/consumer-smoke.mjs', { cwd: ROOT, stdio: 'pipe', timeout: 300_000 }),
  },
  {
    name: 'Visual Regression',
    skip: skipVisual,
    run: () => {
      // Playwright's webServer config auto-starts Storybook if needed.
      // We just need sufficient timeout for Storybook startup (~120s) + tests (~180s).
      // Use --reporter=dot for minimal output to avoid stdio pipe buffering.
      execSync(
        'npx playwright test --timeout 30000 --reporter=dot',
        { cwd: ROOT, stdio: 'pipe', timeout: 900_000 },
      );
    },
  },

  /* ---- TypeScript warning budget ---- */
  {
    name: 'TS Warning Budget',
    run: () => {
      const output = execSync('npx tsc --noEmit 2>&1 || true', {
        cwd: ROOT,
        encoding: 'utf-8',
        timeout: 300_000,
        shell: true,
      });
      // Count non-storybook TS errors as warnings (storybook moduleResolution is known)
      const lines = output.split('\n').filter(
        (l) => l.includes('error TS') && !l.includes('@storybook'),
      );
      if (lines.length > 0) {
        throw new Error(`${lines.length} non-storybook TS errors:\n${lines.slice(0, 10).join('\n')}`);
      }
    },
  },

  /* ---- DesignLab index sync ---- */
  {
    name: 'DesignLab Index',
    run: () => {
      const webRoot = join(ROOT, '..', '..');
      execSync('python3 scripts/build_design_lab_index.py', {
        cwd: webRoot,
        stdio: 'pipe',
        timeout: 60_000,
      });
    },
  },

  /* ---- Release-specific: publish verification ---- */
  {
    name: 'Publish Dry-Run',
    run: () => execSync('npm publish --dry-run', { cwd: ROOT, stdio: 'pipe', timeout: 60_000 }),
  },
];

/* ---- Runner ---- */

function formatDuration(ms) {
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(1)}s`;
}

const pad = (s, n) => String(s).padEnd(n).slice(0, n);
const padR = (s, n) => String(s).padStart(n).slice(0, n);

async function main() {
  console.log('\n  Pre-release Checklist\n');
  console.log('─'.repeat(50));

  const results = [];

  for (const gate of gates) {
    if (gate.skip) {
      results.push({ name: gate.name, status: 'SKIP', duration: 0, error: null });
      console.log(`  [SKIP] ${gate.name}`);
      continue;
    }

    const start = Date.now();
    process.stdout.write(`  [ .. ] ${gate.name}...`);

    try {
      gate.run();
      const duration = Date.now() - start;
      results.push({ name: gate.name, status: 'PASS', duration, error: null });
      process.stdout.write(`\r  [PASS] ${gate.name} (${formatDuration(duration)})\n`);
    } catch (e) {
      const duration = Date.now() - start;
      const errorOutput = (e.stderr || e.stdout || e.message || '').toString().trim();
      const errorSummary = errorOutput.split('\n').slice(-5).join('\n');
      results.push({ name: gate.name, status: 'FAIL', duration, error: errorSummary });
      process.stdout.write(`\r  [FAIL] ${gate.name} (${formatDuration(duration)})\n`);
    }
  }

  // Summary table
  console.log('\n─'.repeat(50));
  console.log(`\n${pad('Gate', 24)} ${padR('Status', 6)} ${padR('Duration', 10)}`);
  console.log('─'.repeat(42));

  for (const r of results) {
    console.log(`${pad(r.name, 24)} ${padR(r.status, 6)} ${padR(formatDuration(r.duration), 10)}`);
  }

  console.log('─'.repeat(42));

  const passed = results.filter((r) => r.status === 'PASS').length;
  const failed = results.filter((r) => r.status === 'FAIL').length;
  const skipped = results.filter((r) => r.status === 'SKIP').length;
  const total = results.length;
  const totalDuration = results.reduce((sum, r) => sum + r.duration, 0);

  console.log(`${pad(`${passed}/${total - skipped} passed`, 24)} ${padR('', 6)} ${padR(formatDuration(totalDuration), 10)}\n`);

  // Failure details
  if (failed > 0) {
    console.log('=== Failure Details ===\n');
    for (const r of results) {
      if (r.status === 'FAIL' && r.error) {
        console.log(`--- ${r.name} ---`);
        console.log(r.error);
        console.log('');
      }
    }
    console.log(`RESULT: FAIL (${failed} gate${failed > 1 ? 's' : ''} failed)\n`);
    process.exit(1);
  } else {
    console.log(`RESULT: PASS — Ready for release (${passed} gates passed)\n`);
  }
}

main().catch((err) => {
  console.error('Pre-release check failed:', err.message);
  process.exit(1);
});
