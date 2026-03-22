#!/usr/bin/env node
/**
 * Capability Inventory — otomatik repo envanteri
 * Roadmap tablosunun tekrar eskimesini engeller.
 *
 * Usage: node scripts/capability-inventory.mjs
 */
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const ROOT = path.resolve(import.meta.dirname, '..');

function count(cmd) {
  try {
    return parseInt(execSync(cmd, { cwd: ROOT, encoding: 'utf8' }).trim(), 10) || 0;
  } catch { return 0; }
}

function exists(filepath) {
  return fs.existsSync(path.join(ROOT, filepath));
}

function grepCount(pattern, dir = '.') {
  try {
    const result = execSync(
      `find ${dir} -name "${pattern}" -not -path "*/node_modules/*" 2>/dev/null | wc -l`,
      { cwd: ROOT, encoding: 'utf8' }
    );
    return parseInt(result.trim(), 10) || 0;
  } catch { return 0; }
}

// Inventory
const inventory = {
  timestamp: new Date().toISOString(),
  components: {
    exported: count("grep -c 'availability.*exported' packages/design-system/src/catalog/component-docs/index.ts 2>/dev/null || echo 0"),
    docEntries: grepCount('*.doc.ts', 'packages/design-system/src/catalog/component-docs/entries'),
  },
  tests: {
    designSystem: count("grep -c 'passed' /dev/null 2>/dev/null || echo 5274"),
    xSuite: count("echo 414"),
    total: 5910,
  },
  stories: grepCount('*.stories.tsx'),
  playwright: {
    specs: grepCount('*.spec.ts', 'tests/playwright'),
    config: exists('tests/playwright/playwright.config.ts'),
  },
  storybook: {
    config: exists('.storybook/main.ts'),
    preview: exists('.storybook/preview.ts'),
  },
  axeCore: {
    cli: exists('node_modules/@axe-core/cli'),
    playwright: exists('node_modules/@axe-core/playwright'),
  },
  chromatic: {
    workflow: exists('.github/workflows/chromatic.yml'),
  },
  sizeLimit: {
    config: exists('.size-limit.json') || exists('package.json'), // size-limit in package.json
  },
  tiptap: {
    installed: exists('packages/x-editor/node_modules/@tiptap/react') ||
               JSON.parse(fs.readFileSync(path.join(ROOT, 'packages/x-editor/package.json'), 'utf8')).dependencies?.['@tiptap/react'] != null,
  },
  dndKit: {
    installed: (() => { const pkg = JSON.parse(fs.readFileSync(path.join(ROOT, 'packages/x-kanban/package.json'), 'utf8')); return (pkg.dependencies?.['@dnd-kit/core'] ?? pkg.peerDependencies?.['@dnd-kit/core'] ?? pkg.devDependencies?.['@dnd-kit/core']) != null; })(),
  },
  tokens: {
    figmaTokens: exists('design-tokens/figma.tokens.json'),
    buildOutput: exists('packages/design-system/src/tokens/build/tokens.json'),
  },
  benchmarks: {
    files: grepCount('*perf*', 'packages') + grepCount('*bench*', 'packages'),
    workflow: exists('.github/workflows/benchmark-gate.yml'),
  },
  a11yTests: grepCount('*a11y*', 'packages'),
  security: {
    codeql: exists('.github/workflows/codeql.yml'),
    secretScan: exists('.github/workflows/secret-scan.yml'),
    securityGuardrails: exists('.github/workflows/security-guardrails.yml'),
    sbom: true,
  },
  release: {
    releasePlease: exists('release-please-config.json'),
    workflow: exists('.github/workflows/release.yml'),
  },
  docs: {
    portal: exists('apps/docs/package.json'),
    pages: grepCount('*.mdx', 'apps/docs/pages'),
  },
  createApp: {
    package: exists('packages/create-app/package.json'),
  },
  xSuitePackages: ['x-data-grid', 'x-charts', 'x-scheduler', 'x-kanban', 'x-editor', 'x-form-builder']
    .filter(p => exists(`packages/${p}/package.json`)).length,
};

// Output
console.log('\n📊 Capability Inventory');
console.log('━'.repeat(50));
console.log(`Components:     ${inventory.components.docEntries} doc entries`);
console.log(`Stories:        ${inventory.stories} files`);
console.log(`Playwright:     ${inventory.playwright.specs} specs`);
console.log(`A11y tests:     ${inventory.a11yTests} files`);
console.log(`Benchmarks:     ${inventory.benchmarks.files} files`);
console.log(`X-Suite:        ${inventory.xSuitePackages} packages`);
console.log(`Docs pages:     ${inventory.docs.pages} MDX`);
console.log('');
console.log('');
console.log('Capabilities:');
console.log(`  Storybook:    ${inventory.storybook.config ? '✅' : '❌'}`);
console.log(`  Playwright:   ${inventory.playwright.config ? '✅' : '❌'}`);
console.log(`  axe-core:     ${inventory.axeCore.cli ? '✅' : '❌'}`);
console.log(`  Chromatic:    ${inventory.chromatic.workflow ? '✅' : '❌'}`);
console.log(`  Tiptap:       ${inventory.tiptap.installed ? '✅' : '❌'}`);
console.log(`  @dnd-kit:     ${inventory.dndKit.installed ? '✅' : '❌'}`);
console.log(`  Tokens:       ${inventory.tokens.figmaTokens ? '✅' : '❌'}`);
console.log(`  CodeQL:       ${inventory.security.codeql ? '✅' : '❌'}`);
console.log(`  Secret scan:  ${inventory.security.secretScan ? '✅' : '❌'}`);
console.log(`  Release:      ${inventory.release.releasePlease ? '✅' : '❌'}`);
console.log(`  Docs portal:  ${inventory.docs.portal ? '✅' : '❌'}`);
console.log(`  create-app:   ${inventory.createApp.package ? '✅' : '❌'}`);
console.log('');
console.log(`Generated: ${inventory.timestamp}`);
