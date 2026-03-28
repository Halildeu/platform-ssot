#!/usr/bin/env node
/**
 * Post-build: Prepend "use client" directive to ESM entry points.
 *
 * Rollup/tsup strip module-level directives during bundling.
 * This script re-injects them after the build completes.
 */
import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const DIST = join(import.meta.dirname, '..', 'dist', 'esm');
const DIRECTIVE = '"use client";\n';

// NOTE: server.js is intentionally EXCLUDED — it must remain free of
// "use client" so it can be imported in React Server Components.
const ENTRY_FILES = [
  'index.js',
  // Layer-specific deep imports
  'tokens/index.js',
  'primitives/index.js',
  'components/index.js',
  'patterns/index.js',
  'providers/index.js',
  'theme/index.js',
  'a11y/index.js',
  'performance/index.js',
  // Icons
  'icons/index.js',
  // Headless
  'internal/interaction-core/index.js',
  'internal/overlay-engine/index.js',
  'headless/index.js',
  // Advanced
  'advanced/index.js',
  'advanced/data-grid/setup.js',
];

async function main() {
  let patched = 0;
  for (const file of ENTRY_FILES) {
    const filepath = join(DIST, file);
    try {
      const content = await readFile(filepath, 'utf-8');
      if (!content.startsWith('"use client"')) {
        await writeFile(filepath, DIRECTIVE + content);
        patched++;
        console.log(`  ✓ ${file}`);
      }
    } catch {
      console.log(`  ⊘ ${file} (not found, skipped)`);
    }
  }
  console.log(`\n"use client" injected into ${patched} ESM entry points.`);
}

main();
