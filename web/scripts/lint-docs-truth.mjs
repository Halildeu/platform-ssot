#!/usr/bin/env node
/**
 * Docs Truth Gate — verifies docs examples match actual package exports
 * Checks:
 *   1. import statements in MDX/MD files reference real exports
 *   2. Any import inside markdown code blocks references real exports
 *   3. <ComponentName> JSX references in code blocks match known exports
 */
import { readFileSync, readdirSync, existsSync } from 'fs';
import { join, resolve } from 'path';

const ROOT = resolve(import.meta.dirname, '..');
const DOCS_DIR = join(ROOT, 'apps/docs/pages');
const DOCS_DIR2 = join(ROOT, 'docs');
const PACKAGES_DIR = join(ROOT, 'packages');

let errors = 0;

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

// Build a master set of all component names (PascalCase exports) for JSX checks
const allComponentNames = new Set();
for (const [, expSet] of Object.entries(packageExports)) {
  for (const name of expSet) {
    if (/^[A-Z]/.test(name)) allComponentNames.add(name);
  }
}

/* ------------------------------------------------------------------ */
/*  2. Scan docs files                                                 */
/* ------------------------------------------------------------------ */

const CODE_BLOCK_RE = /```(?:\w+)?\s*\n([\s\S]*?)```/g;
const IMPORT_RE = /import\s*\{([^}]+)\}\s*from\s*['"](@mfe\/[^'"]+)['"]/g;
const JSX_TAG_RE = /<([A-Z][A-Za-z0-9]+)/g;

function checkImport(names, pkgName, rel) {
  const known = packageExports[pkgName];
  if (!known) return;
  for (const raw of names) {
    const name = raw.replace(/^type\s+/, '').trim();
    if (!name) continue;
    if (!known.has(name)) {
      console.error(`ERROR: ${rel} imports "${name}" from "${pkgName}" but it's not exported`);
      errors++;
    }
  }
}

function scanDir(dir) {
  if (!existsSync(dir)) return;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      scanDir(fullPath);
    } else if (entry.name.endsWith('.mdx') || entry.name.endsWith('.md')) {
      const content = readFileSync(fullPath, 'utf-8');
      const rel = fullPath.replace(ROOT + '/', '');

      // Check top-level import statements (outside code blocks, e.g. MDX imports)
      const topImports = content.matchAll(/import\s*\{([^}]+)\}\s*from\s*['"](@mfe\/[^'"]+)['"]/g);
      for (const match of topImports) {
        const names = match[1].split(',').map(n => n.trim()).filter(Boolean);
        checkImport(names, match[2], rel);
      }

      // Check imports inside code blocks
      CODE_BLOCK_RE.lastIndex = 0;
      let blockMatch;
      while ((blockMatch = CODE_BLOCK_RE.exec(content)) !== null) {
        const block = blockMatch[1];

        // Import statements in code blocks
        IMPORT_RE.lastIndex = 0;
        let importMatch;
        while ((importMatch = IMPORT_RE.exec(block)) !== null) {
          const names = importMatch[1].split(',').map(n => n.trim()).filter(Boolean);
          checkImport(names, importMatch[2], rel + ' (code block)');
        }

        // <ComponentName references in code blocks — check if they exist in any package
        JSX_TAG_RE.lastIndex = 0;
        let jsxMatch;
        while ((jsxMatch = JSX_TAG_RE.exec(block)) !== null) {
          const tagName = jsxMatch[1];
          // Only flag if it looks like an @mfe component (imported from @mfe in the same block)
          // and is not a standard HTML/React element
          if (block.includes('@mfe/') && !allComponentNames.has(tagName)) {
            // Skip well-known React/HTML-like patterns
            if (['React', 'Fragment', 'Suspense', 'Provider', 'Router', 'Route', 'App', 'Layout'].includes(tagName)) continue;
            // Only flag if the block has an @mfe import for this component
            const importInBlock = new RegExp(`import\\s*\\{[^}]*\\b${tagName}\\b[^}]*\\}\\s*from\\s*['"]@mfe/`);
            if (importInBlock.test(block)) {
              console.error(`ERROR: ${rel} (code block) uses <${tagName}> but it's not exported from any @mfe package`);
              errors++;
            }
          }
        }
      }
    }
  }
}

scanDir(DOCS_DIR);
scanDir(DOCS_DIR2);

/* ------------------------------------------------------------------ */
/*  3. Report                                                          */
/* ------------------------------------------------------------------ */

if (errors > 0) {
  console.error(`\n${errors} docs truth error(s) found`);
  process.exit(1);
} else {
  console.log('Docs truth check passed — 0 phantom imports');
}
