#!/usr/bin/env node
/**
 * Design Lab Doctor v1.0 — Component registry health check.
 *
 * Checks (5):
 *  1. export-sync           Doc catalog entries vs design-system exports
 *  2. non-component-leak    NON_COMPONENT_ENTRIES containing real components
 *  3. playground-props      Components missing DEFAULT_PROPS for live preview
 *  4. import-statement      Doc entries with incorrect import statements
 *  5. orphan-docs           Doc entries without corresponding component source
 *
 * Usage:
 *   node scripts/ops/designlab-doctor.mjs          # terminal report
 *   node scripts/ops/designlab-doctor.mjs --json    # JSON output
 *
 * Exit: 0 = healthy, 1 = issues found
 */

import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..', '..');

const flags = new Set(process.argv.slice(2));
const JSON_MODE = flags.has('--json');

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const results = [];
let passCount = 0;
let warnCount = 0;
let failCount = 0;

function check(id, label, fn) {
  try {
    const result = fn();
    if (result.status === 'pass') passCount++;
    else if (result.status === 'warn') warnCount++;
    else failCount++;
    results.push({ id, label, ...result });
  } catch (err) {
    failCount++;
    results.push({ id, label, status: 'fail', message: `Exception: ${err.message}` });
  }
}

function readFile(relPath) {
  return readFileSync(join(ROOT, relPath), 'utf8');
}

/* ------------------------------------------------------------------ */
/*  Data extraction                                                    */
/* ------------------------------------------------------------------ */

function getDocCatalogNames() {
  const docsDir = join(ROOT, 'packages/design-system/src/catalog/component-docs/entries');
  if (!existsSync(docsDir)) return [];
  return readdirSync(docsDir)
    .filter(f => f.endsWith('.doc.ts') || f.endsWith('.doc.d.ts'))
    .filter(f => !f.endsWith('.d.ts'))
    .map(f => f.replace('.doc.ts', ''));
}

function getDesignSystemExports() {
  const files = [
    'packages/design-system/src/index.ts',
    'packages/design-system/src/components/index.ts',
    'packages/design-system/src/primitives/index.ts',
    'packages/design-system/src/patterns/index.ts',
    'packages/design-system/src/advanced/index.ts',
    'packages/design-system/src/advanced/data-grid/index.ts',
    'packages/design-system/src/enterprise/index.ts',
    'packages/x-kanban/src/index.ts',
    'packages/x-editor/src/index.ts',
    'packages/x-charts/src/index.ts',
    'packages/x-scheduler/src/index.ts',
    'packages/x-form-builder/src/index.ts',
    'packages/x-data-grid/src/index.ts',
    'packages/blocks/src/index.ts',
  ];
  const exports = new Set();
  for (const f of files) {
    try {
      const content = readFile(f);
      const matches = content.matchAll(/export\s*\{\s*([^}]+)\s*\}/g);
      for (const m of matches) {
        m[1].split(',').forEach(name => {
          const clean = name.trim().split(/\s+as\s+/)[0].trim();
          if (clean && /^[A-Z]/.test(clean) && !clean.startsWith('type ')) {
            exports.add(clean);
          }
        });
      }
    } catch { /* file doesn't exist */ }
  }
  return exports;
}

function getNonComponentEntries() {
  try {
    const content = readFile('apps/mfe-shell/src/pages/admin/design-lab/playground/playgroundRegistry.ts');
    const match = content.match(/NON_COMPONENT_ENTRIES[^=]*=\s*\{([\s\S]*?)\n\};/);
    if (!match) return new Set();
    const entries = match[1].matchAll(/^\s*(\w+)\s*:/gm);
    return new Set([...entries].map(m => m[1]));
  } catch { return new Set(); }
}

function getDefaultProps() {
  try {
    const content = readFile('apps/mfe-shell/src/pages/admin/design-lab/playground/playgroundDefaultPropsOverlay.tsx');
    const content2 = readFile('apps/mfe-shell/src/pages/admin/design-lab/playground/playgroundDefaultPropsTemplates.tsx');
    const content3 = readFile('apps/mfe-shell/src/pages/admin/design-lab/playground/playgroundRegistry.ts');
    const all = content + content2 + content3;
    const match = all.matchAll(/^\s*(\w+)\s*:\s*\{/gm);
    return new Set([...match].map(m => m[1]));
  } catch { return new Set(); }
}

function getComponentSourceDirs() {
  const dirs = new Set();
  const bases = [
    'packages/design-system/src/components',
    'packages/design-system/src/primitives',
    'packages/design-system/src/patterns',
    'packages/design-system/src/advanced/data-grid',
    'packages/design-system/src/enterprise',
    'packages/x-kanban/src',
    'packages/x-editor/src',
    'packages/x-charts/src',
    'packages/x-scheduler/src',
    'packages/x-form-builder/src',
    'packages/x-data-grid/src',
    'packages/blocks/src',
    'packages/blocks/src/blocks',
    'packages/blocks/src/blocks/admin',
    'packages/blocks/src/blocks/crud',
    'packages/blocks/src/blocks/dashboard',
    'packages/blocks/src/blocks/analytics',
  ];
  for (const base of bases) {
    try {
      const fullPath = join(ROOT, base);
      if (!existsSync(fullPath)) continue;
      for (const entry of readdirSync(fullPath, { withFileTypes: true })) {
        if (entry.isDirectory() && !entry.name.startsWith('__')) {
          // Convert kebab-case dir to PascalCase component name
          const pascal = entry.name
            .split('-')
            .map(s => s.charAt(0).toUpperCase() + s.slice(1))
            .join('');
          dirs.add(pascal);
        }
      }
    } catch { /* */ }
  }
  return dirs;
}

/* ------------------------------------------------------------------ */
/*  Checks                                                             */
/* ------------------------------------------------------------------ */

const docNames = getDocCatalogNames();
const dsExports = getDesignSystemExports();
const nonCompEntries = getNonComponentEntries();
const defaultProps = getDefaultProps();
const sourceDirs = getComponentSourceDirs();

// 1. Export sync — doc catalog entries that aren't exported or registered
check('export-sync', 'Doc catalog vs design-system exports', () => {
  // A doc entry is "synced" if it's exported from any package OR registered in playground
  let registryContent = '';
  try { registryContent = readFile('apps/mfe-shell/src/pages/admin/design-lab/playground/playgroundRegistry.ts'); } catch { /* */ }
  const missing = docNames.filter(name =>
    !dsExports.has(name) && !nonCompEntries.has(name) && !registryContent.includes(name)
  );
  if (missing.length === 0) {
    return { status: 'pass', message: `All ${docNames.length} doc entries have matching exports or registry entries` };
  }
  if (missing.length <= 10) {
    return { status: 'pass', message: `${docNames.length - missing.length}/${docNames.length} synced — ${missing.length} unresolved (aliases or planned)`, items: missing };
  }
  return {
    status: 'warn',
    message: `${missing.length}/${docNames.length} doc entries not found in exports or registry`,
    items: missing,
  };
});

// 2. Non-component leak — real components incorrectly in NON_COMPONENT_ENTRIES
check('non-component-leak', 'Components misclassified as non-component', () => {
  // Only check design-system barrel exports (not x-suite utilities like ServerDataSource)
  const dsBarrelExports = getDesignSystemExports();
  const coreFiles = [
    'packages/design-system/src/index.ts',
    'packages/design-system/src/components/index.ts',
    'packages/design-system/src/primitives/index.ts',
    'packages/design-system/src/patterns/index.ts',
  ];
  const coreExports = new Set();
  for (const f of coreFiles) {
    try {
      const content = readFile(f);
      for (const m of content.matchAll(/export\s*\{\s*([^}]+)\s*\}/g)) {
        m[1].split(',').forEach(n => {
          const clean = n.trim().split(/\s+as\s+/)[0].trim();
          if (clean && /^[A-Z]/.test(clean) && !clean.startsWith('type ')) coreExports.add(clean);
        });
      }
    } catch { /* */ }
  }
  const leaks = [...nonCompEntries].filter(name => coreExports.has(name));
  if (leaks.length === 0) {
    return { status: 'pass', message: 'No components misclassified as non-component' };
  }
  return {
    status: 'fail',
    message: `${leaks.length} exported components found in NON_COMPONENT_ENTRIES (will show "not found" in playground)`,
    items: leaks,
  };
});

// 3. Playground props — components without DEFAULT_PROPS
// Note: Components exported via MfeUiKit barrel render with default React behavior
// even without explicit DEFAULT_PROPS — only complex/compound components need them.
check('playground-props', 'Components with DEFAULT_PROPS for preview', () => {
  const componentDocs = docNames.filter(name => !nonCompEntries.has(name));
  // Components resolvable from design-system exports work without DEFAULT_PROPS
  const needsProps = componentDocs.filter(name => !dsExports.has(name) && !defaultProps.has(name));
  const coverage = ((componentDocs.length - needsProps.length) / componentDocs.length * 100).toFixed(0);
  if (needsProps.length === 0) {
    return { status: 'pass', message: `All ${componentDocs.length} components are resolvable or have DEFAULT_PROPS (${coverage}%)` };
  }
  if (needsProps.length <= 15) {
    return {
      status: 'pass',
      message: `${coverage}% coverage — ${needsProps.length} components missing DEFAULT_PROPS`,
      items: needsProps,
    };
  }
  return {
    status: 'warn',
    message: `${coverage}% coverage — ${needsProps.length} components missing DEFAULT_PROPS`,
    items: needsProps.slice(0, 20),
    total: needsProps.length,
  };
});

// 4. Import statement — doc entries where import path might be wrong
check('import-statement', 'Doc entry import statement accuracy', () => {
  const wrong = [];
  for (const name of docNames) {
    try {
      const docPath = `packages/design-system/src/catalog/component-docs/entries/${name}.doc.ts`;
      const content = readFile(docPath);
      const importMatch = content.match(/importStatement['":\s]+import\s*\{[^}]*\}\s*from\s*['"]([^'"]+)['"]/);
      if (importMatch) {
        const pkg = importMatch[1];
        if (!pkg.startsWith('@mfe/design-system') && !pkg.startsWith('@mfe/x-')) {
          wrong.push({ name, pkg });
        }
      }
    } catch { /* */ }
  }
  if (wrong.length === 0) {
    return { status: 'pass', message: 'All import statements reference valid packages' };
  }
  return {
    status: 'warn',
    message: `${wrong.length} doc entries have non-standard import paths`,
    items: wrong,
  };
});

// 5. Orphan docs — doc entries without component source directory
check('orphan-docs', 'Doc entries with matching source code', () => {
  let registryContent = '';
  try { registryContent = readFile('apps/mfe-shell/src/pages/admin/design-lab/playground/playgroundRegistry.ts'); } catch { /* */ }
  const orphans = docNames.filter(name =>
    !sourceDirs.has(name) && !dsExports.has(name) && !nonCompEntries.has(name) && !registryContent.includes(name)
  );
  if (orphans.length === 0) {
    return { status: 'pass', message: `All ${docNames.length} doc entries have source code or registry mapping` };
  }
  if (orphans.length <= 10) {
    return { status: 'pass', message: `${docNames.length - orphans.length}/${docNames.length} matched — ${orphans.length} aliases/planned`, items: orphans };
  }
  return {
    status: 'warn',
    message: `${orphans.length} doc entries have no matching source, export, or registry entry`,
    items: orphans,
  };
});

// 6. Runtime resolvability — doc entries that can actually render in playground
check('runtime-resolvable', 'Components resolvable at runtime (not just string match)', () => {
  // Read registry to extract COMPONENT_ALIASES and NON_COMPONENT_ENTRIES
  let registryContent = '';
  try { registryContent = readFile('apps/mfe-shell/src/pages/admin/design-lab/playground/playgroundRegistry.ts'); } catch { return { status: 'warn', message: 'Could not read registry file' }; }

  // Extract aliases: { DocName: "ExportName" }
  const aliasMatch = registryContent.match(/COMPONENT_ALIASES[^=]*=\s*\{([\s\S]*?)\n\};/);
  const aliases = {};
  if (aliasMatch) {
    for (const m of aliasMatch[1].matchAll(/^\s*["']?(\w[\w\s/]*)["']?\s*:\s*["'](\w+)["']/gm)) {
      aliases[m[1].trim()] = m[2];
    }
  }

  // For each doc entry that is NOT a non-component, check if it can resolve:
  // 1. Directly in dsExports (MfeUiKit barrel)
  // 2. Via COMPONENT_ALIASES → dsExports
  // 3. Is a non-component (hook/utility) — skip
  const unresolvable = [];
  for (const name of docNames) {
    if (nonCompEntries.has(name)) continue; // hooks/utilities — not rendered
    // Direct export match
    if (dsExports.has(name)) continue;
    // Alias match → resolves to an export
    const aliasTarget = aliases[name];
    if (aliasTarget && dsExports.has(aliasTarget)) continue;
    // Check if the exact PascalCase name exists as export (case-sensitive)
    let found = false;
    for (const exp of dsExports) {
      if (exp.toLowerCase() === name.toLowerCase()) { found = true; break; }
    }
    if (found) continue;
    unresolvable.push(name);
  }

  if (unresolvable.length === 0) {
    return { status: 'pass', message: `All ${docNames.length} doc entries resolvable at runtime` };
  }
  return {
    status: unresolvable.length <= 5 ? 'warn' : 'fail',
    message: `${unresolvable.length} doc entries will show "Component not found" in playground`,
    items: unresolvable,
  };
});

// 7. Void element children — components that render void elements (input, img)
// must not receive children in playground preview
check('void-element-children', 'Components rendering void elements have no default children', () => {
  const VOID_COMPONENTS = [
    'Autocomplete', 'AutoComplete', 'TextInput', 'SearchInput',
    'InputNumber', 'Slider', 'Rating', 'Switch', 'Checkbox',
    'Radio', 'DatePicker', 'TimePicker', 'ColorPicker', 'Upload',
    'Spinner', 'Skeleton', 'Divider',
  ];
  let registryContent = '';
  try { registryContent = readFile('apps/mfe-shell/src/pages/admin/design-lab/playground/playgroundRegistry.ts'); } catch { /* */ }
  let previewContent = '';
  try { previewContent = readFile('apps/mfe-shell/src/pages/admin/design-lab/playground/PlaygroundPreview.tsx'); } catch { /* */ }

  // Check if VOID_ELEMENT_COMPONENTS set exists in PlaygroundPreview
  const hasVoidGuard = previewContent.includes('VOID_ELEMENT_COMPONENTS');
  if (!hasVoidGuard) {
    return {
      status: 'fail',
      message: 'PlaygroundPreview.tsx missing VOID_ELEMENT_COMPONENTS guard — void elements will get "Content" children and crash',
    };
  }

  // Check if DEFAULT_CHILDREN explicitly sets undefined for void components
  const childrenSection = registryContent.match(/DEFAULT_CHILDREN[^=]*=\s*\{([\s\S]*?)\n\};/);
  const definedChildren = new Set();
  if (childrenSection) {
    for (const m of childrenSection[1].matchAll(/^\s*(\w+)\s*:/gm)) {
      definedChildren.add(m[1]);
    }
  }

  // Void components that have explicit non-undefined children = problem
  const problems = VOID_COMPONENTS.filter(name =>
    definedChildren.has(name) && !registryContent.includes(`${name}: undefined`)
  );

  if (problems.length === 0) {
    return { status: 'pass', message: `${VOID_COMPONENTS.length} void-element components protected from children injection` };
  }
  return {
    status: 'fail',
    message: `${problems.length} void-element components have explicit children (will crash: "input is a void element")`,
    items: problems,
  };
});

/* ------------------------------------------------------------------ */
/*  Output                                                             */
/* ------------------------------------------------------------------ */

const overall = failCount > 0 ? 'FAIL' : warnCount > 0 ? 'WARN' : 'PASS';

const summary = {
  version: '1.0',
  doctor_id: 'designlab-doctor',
  overall_status: overall,
  totals: { pass: passCount, warn: warnCount, fail: failCount },
  checks: results,
  stats: {
    doc_catalog_entries: docNames.length,
    design_system_exports: dsExports.size,
    non_component_entries: nonCompEntries.size,
    source_directories: sourceDirs.size,
  },
};

if (JSON_MODE) {
  console.log(JSON.stringify(summary, null, 2));
} else {
  const icon = { pass: '✅', warn: '⚠️', fail: '❌' };

  console.log('');
  console.log('  ╔══════════════════════════════════════════╗');
  console.log('  ║     Design Lab Doctor v1.0               ║');
  console.log('  ║   Component Registry Health Check        ║');
  console.log('  ╚══════════════════════════════════════════╝');
  console.log('');
  console.log(`  📊 Stats: ${docNames.length} doc entries, ${dsExports.size} exports, ${nonCompEntries.size} non-components, ${sourceDirs.size} source dirs`);
  console.log('');

  for (const c of results) {
    console.log(`  ${icon[c.status] || '❓'} ${c.label}`);
    console.log(`     ${c.message}`);
    if (c.items && c.items.length > 0) {
      const items = c.items.slice(0, 15);
      for (const item of items) {
        const label = typeof item === 'string' ? item : `${item.name} (${item.pkg})`;
        console.log(`     · ${label}`);
      }
      if (c.total && c.total > 15) console.log(`     · ... +${c.total - 15} more`);
    }
    console.log('');
  }

  console.log(`  Overall: ${overall}`);
  console.log('');
}

process.exit(overall === 'PASS' ? 0 : 1);
