#!/usr/bin/env node
/**
 * Docs Truth Gate — verifies docs examples match actual package exports
 * Checks: import statements in MDX files reference real exports
 */
import { readFileSync, readdirSync, existsSync } from 'fs';
import { join, resolve } from 'path';

const ROOT = resolve(import.meta.dirname, '..');
const DOCS_DIR = join(ROOT, 'apps/docs/pages');
const PACKAGES_DIR = join(ROOT, 'packages');

let errors = 0;

// Collect all actual exports from x-* packages
const packageExports = {};
const xPackages = readdirSync(PACKAGES_DIR).filter(d => d.startsWith('x-') || d === 'blocks' || d === 'create-app');

for (const pkg of xPackages) {
  const indexPath = join(PACKAGES_DIR, pkg, 'src/index.ts');
  if (!existsSync(indexPath)) continue;

  const content = readFileSync(indexPath, 'utf-8');
  const exports = [];

  // Match: export { Foo } or export { Foo, Bar }
  const reExports = content.matchAll(/export\s*\{([^}]+)\}/g);
  for (const match of reExports) {
    match[1].split(',').forEach(e => {
      const name = e.trim().split(/\s+as\s+/).pop().trim();
      if (name && !name.startsWith('type ')) exports.push(name);
    });
  }

  // Match: export function/const/class Foo
  const directExports = content.matchAll(/export\s+(?:function|const|class)\s+(\w+)/g);
  for (const match of directExports) {
    exports.push(match[1]);
  }

  // Match: export default
  if (content.includes('export default')) exports.push('default');

  packageExports[`@mfe/${pkg}`] = new Set(exports);
}

// Scan MDX files for import statements
function scanDir(dir) {
  if (!existsSync(dir)) return;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      scanDir(fullPath);
    } else if (entry.name.endsWith('.mdx') || entry.name.endsWith('.md')) {
      const content = readFileSync(fullPath, 'utf-8');
      const imports = content.matchAll(/import\s*\{([^}]+)\}\s*from\s*['"](@mfe\/[^'"]+)['"]/g);
      for (const match of imports) {
        const pkg = match[2];
        const names = match[1].split(',').map(n => n.trim()).filter(Boolean);
        const known = packageExports[pkg];
        if (!known) continue; // Skip packages we don't track
        for (const name of names) {
          if (!known.has(name)) {
            const rel = fullPath.replace(ROOT + '/', '');
            console.error(`ERROR: ${rel} imports "${name}" from "${pkg}" but it's not exported`);
            errors++;
          }
        }
      }
    }
  }
}

scanDir(DOCS_DIR);
scanDir(join(ROOT, 'docs'));

if (errors > 0) {
  console.error(`\n${errors} docs truth error(s) found`);
  process.exit(1);
} else {
  console.log('Docs truth check passed — 0 phantom imports');
}
