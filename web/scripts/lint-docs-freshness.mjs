#!/usr/bin/env node
/**
 * Doc Example Freshness Check (1.8)
 * Detects stale / deprecated API references in docs.
 *
 * 1. Scans design-system source for @deprecated JSDoc annotations
 * 2. Adds hardcoded known deprecations (selectSize, tone, appearance)
 * 3. Scans all MDX/MD docs for references to those deprecated APIs
 */
import { readFileSync, readdirSync, existsSync } from 'fs';
import { join, resolve } from 'path';

const ROOT = resolve(import.meta.dirname, '..');
const DS_SRC = join(ROOT, 'packages/design-system/src');
const DOCS_DIRS = [
  join(ROOT, 'apps/docs/pages'),
  join(ROOT, 'docs'),
];

/* ------------------------------------------------------------------ */
/*  1. Build deprecated API list from design-system source             */
/* ------------------------------------------------------------------ */

/**
 * Scan .tsx/.ts files for `@deprecated` JSDoc followed by a prop/export name.
 * Returns array of { prop, replacement, file }.
 */
const deprecated = [];

function scanForDeprecated(dir) {
  if (!existsSync(dir)) return;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      scanForDeprecated(fullPath);
    } else if (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts')) {
      const content = readFileSync(fullPath, 'utf-8');
      const lines = content.split('\n');
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (/@deprecated/.test(line)) {
          // Look at the next non-empty line for the prop name
          const nextLine = (lines[i + 1] || '').trim();
          const propMatch = nextLine.match(/^(\w+)\???\s*[:?]/);
          if (propMatch) {
            const replacementMatch = line.match(/Use\s+`(\w+)`\s+instead/);
            deprecated.push({
              prop: propMatch[1],
              replacement: replacementMatch ? replacementMatch[1] : null,
              file: fullPath.replace(ROOT + '/', ''),
            });
          }
        }
      }
    }
  }
}

scanForDeprecated(DS_SRC);

// Hardcoded known deprecations (explicit check list)
const KNOWN_DEPRECATIONS = [
  { prop: 'selectSize', replacement: 'size', component: 'Select' },
  { prop: 'tone', replacement: 'variant', component: 'Badge/Tag' },
  { prop: 'appearance', replacement: 'variant', component: 'Segmented' },
  { prop: 'severity', replacement: 'variant', component: 'Alert' },
  { prop: 'inputSize', replacement: 'size', component: 'Input' },
  { prop: 'radioSize', replacement: 'size', component: 'Radio' },
  { prop: 'checkboxSize', replacement: 'size', component: 'Checkbox' },
  { prop: 'switchSize', replacement: 'size', component: 'Switch' },
  { prop: 'searchSize', replacement: 'size', component: 'SearchInput' },
];

// Merge: add hardcoded ones if not already present
const deprecatedProps = new Set(deprecated.map(d => d.prop));
for (const kd of KNOWN_DEPRECATIONS) {
  if (!deprecatedProps.has(kd.prop)) {
    deprecated.push({
      prop: kd.prop,
      replacement: kd.replacement,
      file: `(hardcoded — ${kd.component})`,
    });
  }
}

/* ------------------------------------------------------------------ */
/*  2. Scan docs for references to deprecated APIs                     */
/* ------------------------------------------------------------------ */

const CODE_BLOCK_RE = /```(?:\w+)?\s*\n([\s\S]*?)```/g;
let staleRefs = 0;

/**
 * Check if a code block or prose uses a deprecated prop.
 * We look for patterns like `prop=`, `prop:`, or prop in JSX attributes.
 */
function checkContent(content, rel) {
  // Only scan code blocks for prop usage
  CODE_BLOCK_RE.lastIndex = 0;
  let blockMatch;
  while ((blockMatch = CODE_BLOCK_RE.exec(content)) !== null) {
    const block = blockMatch[1];
    for (const dep of deprecated) {
      // Match prop usage in JSX: propName= or propName={
      const propRe = new RegExp(`\\b${dep.prop}\\s*[={]`, 'g');
      if (propRe.test(block)) {
        const replacement = dep.replacement ? ` (use \`${dep.replacement}\` instead)` : '';
        console.error(`STALE: ${rel} — code block uses deprecated prop "${dep.prop}"${replacement}`);
        staleRefs++;
      }
    }
  }
}

function scanDocs(dir) {
  if (!existsSync(dir)) return;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      scanDocs(fullPath);
    } else if (entry.name.endsWith('.mdx') || entry.name.endsWith('.md')) {
      const content = readFileSync(fullPath, 'utf-8');
      const rel = fullPath.replace(ROOT + '/', '');
      checkContent(content, rel);
    }
  }
}

for (const dir of DOCS_DIRS) {
  scanDocs(dir);
}

/* ------------------------------------------------------------------ */
/*  3. Report                                                          */
/* ------------------------------------------------------------------ */

console.log(`Scanned for ${deprecated.length} deprecated API(s):`);
for (const d of deprecated) {
  const repl = d.replacement ? ` -> ${d.replacement}` : '';
  console.log(`  - ${d.prop}${repl}  (${d.file})`);
}
console.log('');

if (staleRefs > 0) {
  console.error(`${staleRefs} stale deprecated reference(s) found in docs`);
  process.exit(1);
} else {
  console.log('Docs freshness check passed — 0 stale deprecated references');
}
