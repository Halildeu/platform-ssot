#!/usr/bin/env node
/**
 * build_dependency_graph.mjs
 *
 * Statically analyzes design-system component source files to extract
 * internal component-to-component dependencies (dependsOn / usedByComponents).
 *
 * Output: JSON map of { componentName: { dependsOn: [...], usedByComponents: [...] } }
 *
 * Usage:
 *   node scripts/build_dependency_graph.mjs
 *   node scripts/build_dependency_graph.mjs --inject  # also patches doc files
 */
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'fs';
import { join, relative, dirname, resolve } from 'path';

const ROOT = resolve(dirname(new URL(import.meta.url).pathname), '..');
const DS_SRC = join(ROOT, 'packages/design-system/src');
const DOC_DIR = join(DS_SRC, 'catalog/component-docs/entries');
const INDEX_FILE = join(DS_SRC, 'index.ts');
const OUTPUT = join(ROOT, 'apps/mfe-shell/src/pages/admin/design-lab.deps.v1.json');

/* ------------------------------------------------------------------ */
/*  Step 1: Build export name → source file mapping                    */
/* ------------------------------------------------------------------ */
function buildExportMap() {
  const exportMap = new Map(); // name → source file path (relative to DS_SRC)

  function parseExports(filePath, depth = 0) {
    if (depth > 10) return;
    if (!existsSync(filePath)) return;
    const content = readFileSync(filePath, 'utf-8');

    for (const line of content.split('\n')) {
      // export { Foo, Bar } from './path'
      const namedRe = /export\s*\{([^}]+)\}\s*from\s*['"]([^'"]+)['"]/;
      const namedMatch = line.match(namedRe);
      if (namedMatch) {
        const names = namedMatch[1].split(',').map(n => n.trim().split(/\s+as\s+/)[0].trim());
        const from = namedMatch[2];
        const resolved = resolveImport(filePath, from);
        if (resolved) {
          names.forEach(n => { if (/^[A-Z]/.test(n) || n.startsWith('use')) exportMap.set(n, resolved); });
        }
        continue;
      }

      // export * from './path'
      const starRe = /export\s*\*\s*from\s*['"]([^'"]+)['"]/;
      const starMatch = line.match(starRe);
      if (starMatch) {
        const resolved = resolveImport(filePath, starMatch[1]);
        if (resolved) parseExports(resolved, depth + 1);
      }
    }
  }

  parseExports(INDEX_FILE);
  return exportMap;
}

function resolveImport(fromFile, importPath) {
  const dir = dirname(fromFile);
  const base = join(dir, importPath);
  const candidates = [
    base + '.ts', base + '.tsx',
    join(base, 'index.ts'), join(base, 'index.tsx'),
  ];
  return candidates.find(c => existsSync(c)) ?? null;
}

/* ------------------------------------------------------------------ */
/*  Step 2: For each exported component, find internal DS imports      */
/* ------------------------------------------------------------------ */
function extractInternalDeps(sourceFile, exportedNames) {
  if (!existsSync(sourceFile)) return [];
  const content = readFileSync(sourceFile, 'utf-8');
  const deps = new Set();

  // Look for imports from relative paths within design-system
  const importRe = /import\s*(?:type\s*)?\{([^}]+)\}\s*from\s*['"]([^'"]+)['"]/g;
  let match;
  while ((match = importRe.exec(content)) !== null) {
    const names = match[1].split(',').map(n => n.trim().split(/\s+as\s+/)[0].trim());
    const from = match[2];

    // Only relative imports (internal DS imports)
    if (from.startsWith('.') || from.startsWith('..')) {
      names.forEach(n => {
        if (exportedNames.has(n)) deps.add(n);
      });
    }

    // Also catch @mfe/design-system self-imports (shouldn't happen but just in case)
    if (from === '@mfe/design-system') {
      names.forEach(n => {
        if (exportedNames.has(n)) deps.add(n);
      });
    }
  }

  return [...deps];
}

/* ------------------------------------------------------------------ */
/*  Step 3: Walk component directories to find all source files        */
/* ------------------------------------------------------------------ */
function findComponentSources(exportMap, exportedNames) {
  const depGraph = new Map(); // name → dependsOn[]

  for (const [name, sourceFile] of exportMap.entries()) {
    if (!exportedNames.has(name)) continue;

    // Find the actual component file (not just index re-export)
    let actualFile = sourceFile;

    // If it's an index file, look for the actual component file
    if (actualFile.endsWith('index.ts') || actualFile.endsWith('index.tsx')) {
      const dir = dirname(actualFile);
      const candidates = [
        join(dir, name + '.tsx'),
        join(dir, name + '.ts'),
      ];
      const found = candidates.find(c => existsSync(c));
      if (found) actualFile = found;
    }

    const deps = extractInternalDeps(actualFile, exportedNames);
    // Remove self-reference
    const filtered = deps.filter(d => d !== name);
    if (filtered.length > 0) {
      depGraph.set(name, filtered);
    }
  }

  return depGraph;
}

/* ------------------------------------------------------------------ */
/*  Step 4: Build reverse map (usedByComponents)                       */
/* ------------------------------------------------------------------ */
function buildReverseMap(depGraph) {
  const reverse = new Map(); // name → usedByComponents[]

  for (const [name, deps] of depGraph.entries()) {
    for (const dep of deps) {
      if (!reverse.has(dep)) reverse.set(dep, []);
      reverse.get(dep).push(name);
    }
  }

  return reverse;
}

/* ------------------------------------------------------------------ */
/*  Main                                                                */
/* ------------------------------------------------------------------ */
console.log('🔍 Building component dependency graph...');

const exportMap = buildExportMap();
const exportedNames = new Set(exportMap.keys());
console.log(`   Found ${exportedNames.size} exported names`);

const depGraph = findComponentSources(exportMap, exportedNames);
const reverseMap = buildReverseMap(depGraph);

// Build output
const output = {};
const allNames = new Set([...depGraph.keys(), ...reverseMap.keys()]);

for (const name of [...allNames].sort()) {
  output[name] = {
    dependsOn: depGraph.get(name)?.sort() ?? [],
    usedByComponents: reverseMap.get(name)?.sort() ?? [],
  };
}

// Stats
const totalEdges = [...depGraph.values()].reduce((s, d) => s + d.length, 0);
const withDeps = depGraph.size;
const withDependents = reverseMap.size;

console.log(`   Components with dependencies: ${withDeps}`);
console.log(`   Components depended upon: ${withDependents}`);
console.log(`   Total dependency edges: ${totalEdges}`);
console.log(`   Unique nodes: ${allNames.size}`);

// Write output
writeFileSync(OUTPUT, JSON.stringify(output, null, 2) + '\n');
console.log(`\n✅ Written to ${relative(ROOT, OUTPUT)}`);

// Top depended-upon components
const sorted = [...reverseMap.entries()]
  .sort((a, b) => b[1].length - a[1].length)
  .slice(0, 15);

console.log('\n📊 Most depended-upon components:');
sorted.forEach(([name, users]) => {
  console.log(`   ${name}: ${users.length} dependents (${users.slice(0, 3).join(', ')}${users.length > 3 ? '...' : ''})`);
});

// Inject into doc files if --inject flag
if (process.argv.includes('--inject')) {
  console.log('\n📝 Injecting dependsOn into doc files...');
  let injected = 0;

  for (const f of readdirSync(DOC_DIR).filter(f => f.endsWith('.doc.ts'))) {
    const filePath = join(DOC_DIR, f);
    let content = readFileSync(filePath, 'utf-8');
    const nameMatch = content.match(/"name":\s*"([^"]+)"/);
    if (!nameMatch) continue;
    const name = nameMatch[1];
    const deps = depGraph.get(name);
    if (!deps || deps.length === 0) continue;

    // Check if dependsOn already exists
    if (content.includes('"dependsOn"')) continue;

    // Insert after whereUsed line
    const whereUsedRe = /("whereUsed":\s*\[[^\]]*\])/;
    if (whereUsedRe.test(content)) {
      const depsJson = JSON.stringify(deps.sort());
      content = content.replace(
        whereUsedRe,
        `$1,\n    "dependsOn": ${depsJson}`
      );
      writeFileSync(filePath, content);
      injected++;
    }
  }
  console.log(`   Injected dependsOn into ${injected} doc files`);
}
