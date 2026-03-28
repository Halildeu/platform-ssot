#!/usr/bin/env node
/**
 * Docs Snippet Compile Check (1.6)
 * Extracts tsx/jsx code blocks from MDX files, checks that imports
 * from @mfe/* packages reference real barrel exports.
 */
import { readFileSync, readdirSync, existsSync } from 'fs';
import { join, resolve } from 'path';

const ROOT = resolve(import.meta.dirname, '..');
const DOCS_DIR = join(ROOT, 'apps/docs/pages');
const PACKAGES_DIR = join(ROOT, 'packages');

/* ------------------------------------------------------------------ */
/*  1. Build export map from barrel files                              */
/* ------------------------------------------------------------------ */

const BARREL_PACKAGES = [
  'design-system',
  'x-data-grid',
  'x-charts',
  'x-editor',
  'x-kanban',
  'x-scheduler',
  'x-form-builder',
  'blocks',
  'create-app',
];

/** Extract named exports from a single TS barrel file (non-recursive). */
function extractExports(filePath) {
  if (!existsSync(filePath)) return [];
  const content = readFileSync(filePath, 'utf-8');
  const names = [];

  // export { Foo, Bar } or export { Foo as Baz }
  for (const m of content.matchAll(/export\s*\{([^}]+)\}/g)) {
    for (const part of m[1].split(',')) {
      const raw = part.trim();
      if (!raw || raw.startsWith('type ')) continue;
      const name = raw.split(/\s+as\s+/).pop().trim();
      if (name) names.push(name);
    }
  }

  // export function/const/class/enum Foo
  for (const m of content.matchAll(/export\s+(?:function|const|class|enum)\s+(\w+)/g)) {
    names.push(m[1]);
  }

  // export default
  if (/export\s+default\b/.test(content)) names.push('default');

  return names;
}

/**
 * For packages that use `export * from './sub'`, recursively resolve
 * the sub-barrels to collect all named exports.
 */
function resolveBarrel(entryPath, visited = new Set()) {
  if (!existsSync(entryPath) || visited.has(entryPath)) return [];
  visited.add(entryPath);

  const content = readFileSync(entryPath, 'utf-8');
  const names = extractExports(entryPath);
  const dir = entryPath.replace(/\/[^/]+$/, '');

  // Follow `export * from './...'` (local re-exports only)
  for (const m of content.matchAll(/export\s+\*\s+from\s+['"](\.[^'"]+)['"]/g)) {
    const rel = m[1];
    // Try as file, then as directory index
    const candidates = [
      join(dir, rel + '.ts'),
      join(dir, rel + '.tsx'),
      join(dir, rel, 'index.ts'),
      join(dir, rel, 'index.tsx'),
    ];
    for (const c of candidates) {
      if (existsSync(c)) {
        names.push(...resolveBarrel(c, visited));
        break;
      }
    }
  }

  return names;
}

const packageExports = {};

for (const pkg of BARREL_PACKAGES) {
  const indexPath = join(PACKAGES_DIR, pkg, 'src/index.ts');
  const exports = resolveBarrel(indexPath);
  packageExports[`@mfe/${pkg}`] = new Set(exports);
}

/* ------------------------------------------------------------------ */
/*  2. Extract tsx/jsx code blocks from MDX and check imports          */
/* ------------------------------------------------------------------ */

const CODE_BLOCK_RE = /```(?:tsx|jsx)\s*\n([\s\S]*?)```/g;
const IMPORT_RE = /import\s*\{([^}]+)\}\s*from\s*['"](@mfe\/[^'"]+)['"]/g;

let phantoms = 0;

function scanMdx(dir) {
  if (!existsSync(dir)) return;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      scanMdx(fullPath);
    } else if (entry.name.endsWith('.mdx') || entry.name.endsWith('.md')) {
      const content = readFileSync(fullPath, 'utf-8');
      let blockMatch;
      CODE_BLOCK_RE.lastIndex = 0;
      while ((blockMatch = CODE_BLOCK_RE.exec(content)) !== null) {
        const block = blockMatch[1];
        let importMatch;
        IMPORT_RE.lastIndex = 0;
        while ((importMatch = IMPORT_RE.exec(block)) !== null) {
          const pkgName = importMatch[2];
          const names = importMatch[1].split(',').map(n => n.trim()).filter(Boolean);
          const known = packageExports[pkgName];
          if (!known) continue;
          for (const name of names) {
            // Skip type-only imports
            if (name.startsWith('type ')) continue;
            const cleanName = name.replace(/^type\s+/, '');
            if (!known.has(cleanName)) {
              const rel = fullPath.replace(ROOT + '/', '');
              console.error(`PHANTOM: ${rel} — code block imports "${cleanName}" from "${pkgName}" (not exported)`);
              phantoms++;
            }
          }
        }
      }
    }
  }
}

scanMdx(DOCS_DIR);

/* ------------------------------------------------------------------ */
/*  3. Report                                                          */
/* ------------------------------------------------------------------ */

if (phantoms > 0) {
  console.error(`\n${phantoms} phantom import(s) found in docs code blocks`);
  process.exit(1);
} else {
  console.log('Docs snippet check passed — 0 phantom imports in code blocks');
}
