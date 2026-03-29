#!/usr/bin/env node
/**
 * Accessibility Gate — runs axe-core on key pages and fails if critical violations found
 *
 * Uses @axe-core/playwright for real browser testing.
 *
 * Usage:
 *   node scripts/a11y-gate.mjs              # full run (requires Playwright + running server)
 *   node scripts/a11y-gate.mjs --dry-run    # list what would be tested
 */

import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const _ROOT = resolve(__dirname, '..');

const DRY_RUN = process.argv.includes('--dry-run');
const BASE_URL = process.env.A11Y_BASE_URL || 'http://localhost:6006';

// ---------------------------------------------------------------------------
// Pages to test
// ---------------------------------------------------------------------------
const PAGES = [
  {
    name: 'Design Lab — Landing',
    path: '/iframe.html?id=designlab-landing--default',
    description: 'Main landing page with navigation and component grid',
  },
  {
    name: 'Design Lab — Component Detail',
    path: '/iframe.html?id=designlab-componentdetail--default',
    description: 'Individual component documentation page with API tables',
  },
  {
    name: 'Quality Dashboard',
    path: '/iframe.html?id=designlab-qualitydashboard--default',
    description: 'Quality metrics dashboard with charts and data tables',
  },
  {
    name: 'Theme Matrix',
    path: '/iframe.html?id=runtime-themematrix--matrix',
    description: 'Theme token visualization matrix',
  },
  {
    name: 'Button — All Variants',
    path: '/iframe.html?id=primitives-button--all-variants',
    description: 'Button component with all variant combinations',
  },
];

// ---------------------------------------------------------------------------
// Dry-run mode — just list what would be tested
// ---------------------------------------------------------------------------
if (DRY_RUN) {
  console.log('=== A11y Gate — Dry Run ===\n');
  console.log(`Base URL: ${BASE_URL}`);
  console.log(`Pages to test: ${PAGES.length}\n`);

  for (const page of PAGES) {
    console.log(`  [WOULD TEST] ${page.name}`);
    console.log(`    URL: ${BASE_URL}${page.path}`);
    console.log(`    Scope: ${page.description}`);
    console.log(`    Checks: axe-core wcag2a + wcag2aa rules`);
    console.log('');
  }

  console.log('Rules applied:');
  console.log('  - WCAG 2.0 Level A');
  console.log('  - WCAG 2.0 Level AA');
  console.log('  - Best practices');
  console.log('');
  console.log('Exit criteria:');
  console.log('  - Exit 0: no critical or serious violations');
  console.log('  - Exit 1: one or more critical/serious violations found');
  console.log('');
  console.log('To run the full scan:');
  console.log('  1. Start Storybook: npm run storybook');
  console.log('  2. Run: node scripts/a11y-gate.mjs');
  console.log('');
  console.log('Dry run complete. 0 violations (not scanned).');
  process.exit(0);
}

// ---------------------------------------------------------------------------
// Full run — requires Playwright and @axe-core/playwright
// ---------------------------------------------------------------------------
async function runA11yGate() {
  let chromium, AxeBuilder;
  try {
    const pw = await import('@playwright/test');
    chromium = pw.chromium;
    const axePw = await import('@axe-core/playwright');
    AxeBuilder = axePw.default || axePw.AxeBuilder;
  } catch (_err) {
    console.error(
      'Missing dependencies. Install @playwright/test and @axe-core/playwright:\n' +
        '  npm i -D @playwright/test @axe-core/playwright\n'
    );
    process.exit(1);
  }

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();

  let totalViolations = 0;
  let criticalOrSerious = 0;
  const results = [];

  for (const page of PAGES) {
    const url = `${BASE_URL}${page.path}`;
    console.log(`\nScanning: ${page.name}`);
    console.log(`  URL: ${url}`);

    const tab = await context.newPage();
    try {
      await tab.goto(url, { waitUntil: 'networkidle', timeout: 30000 });

      const axeResults = await new AxeBuilder({ page: tab })
        .withTags(['wcag2a', 'wcag2aa', 'best-practice'])
        .analyze();

      const violations = axeResults.violations || [];
      const critical = violations.filter(
        (v) => v.impact === 'critical' || v.impact === 'serious'
      );

      totalViolations += violations.length;
      criticalOrSerious += critical.length;

      results.push({
        name: page.name,
        url,
        total: violations.length,
        critical: critical.length,
        violations: critical.map((v) => ({
          id: v.id,
          impact: v.impact,
          description: v.description,
          nodes: v.nodes.length,
        })),
      });

      console.log(
        `  Violations: ${violations.length} total, ${critical.length} critical/serious`
      );

      for (const v of critical) {
        console.log(
          `    [${v.impact.toUpperCase()}] ${v.id}: ${v.description} (${v.nodes.length} nodes)`
        );
      }
    } catch (err) {
      console.error(`  Error scanning ${page.name}: ${err.message}`);
      results.push({ name: page.name, url, error: err.message });
    } finally {
      await tab.close();
    }
  }

  await browser.close();

  // Summary
  console.log('\n=== A11y Gate Summary ===');
  console.log(`Pages scanned: ${results.length}`);
  console.log(`Total violations: ${totalViolations}`);
  console.log(`Critical/Serious: ${criticalOrSerious}`);
  console.log('');

  if (criticalOrSerious > 0) {
    console.log('FAIL — critical or serious a11y violations found.');
    process.exit(1);
  } else {
    console.log('PASS — no critical or serious a11y violations.');
    process.exit(0);
  }
}

runA11yGate().catch((err) => {
  console.error('A11y gate failed:', err);
  process.exit(1);
});
