/**
 * Preview & Coverage checks
 * Extracted from theme-doctor.mjs for maintainability.
 */

import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';
import { execSync } from 'node:child_process';

export function register(ctx) {
  const { check, readSafe, srgbToHex, parseCssVarsFlat, walkDir,
    ROOT, DS_SRC, SHELL_STYLES, SHELL_INDEX_CSS, FIGMA_PATH,
    THEME_CSS, TOKEN_BRIDGE_CSS, TOKENS_CSS, THEME_INLINE_CSS, FIX_HINT } = ctx;

/* ------------------------------------------------------------------ */
/*  Preview & Coverage Checks                                          */
/* ------------------------------------------------------------------ */

check('preview-coverage', 'Component preview coverage (doc entries vs playground registry)', () => {
  const entriesDir = join(ROOT, 'packages/design-system/src/catalog/component-docs/entries');
  const registryFile = join(ROOT, 'apps/mfe-shell/src/pages/admin/design-lab/playground/playgroundRegistry.ts');
  const nonCompFile = readSafe(registryFile);

  // Extract NON_COMPONENT_ENTRIES — these are hooks/utilities, not renderable
  const nonCompMatch = nonCompFile.match(/NON_COMPONENT_ENTRIES[^=]*=\s*\{([\s\S]*?)\n\};/);
  const nonCompSet = new Set();
  if (nonCompMatch) {
    for (const m of nonCompMatch[1].matchAll(/^\s*(\w+)\s*:/gm)) nonCompSet.add(m[1]);
  }

  // Check design-system barrel exports + x-suite for renderable components
  const dsIndex = readSafe(join(ROOT, 'packages/design-system/src/components/index.ts'))
    + readSafe(join(ROOT, 'packages/design-system/src/primitives/index.ts'))
    + readSafe(join(ROOT, 'packages/design-system/src/patterns/index.ts'))
    + readSafe(join(ROOT, 'packages/design-system/src/advanced/index.ts'))
    + readSafe(join(ROOT, 'packages/design-system/src/enterprise/index.ts'));

  try {
    const entries = readdirSync(entriesDir).filter(f => f.endsWith('.doc.ts')).map(f => f.replace('.doc.ts', ''));
    const uiEntries = entries.filter(n => !nonCompSet.has(n));
    // A component is "covered" if it's in design-system exports (auto-resolved via MfeUiKit spread)
    // OR if it's mentioned in the registry file (explicit stub or x-suite)
    const found = uiEntries.filter(n => dsIndex.includes(n) || nonCompFile.includes(n));
    const missing = uiEntries.filter(n => !dsIndex.includes(n) && !nonCompFile.includes(n));
    const pct = Math.round((found.length / uiEntries.length) * 100);
    if (missing.length === 0) return { status: 'pass', message: `${found.length}/${uiEntries.length} UI components resolvable (100%)` };
    if (pct >= 90) return { status: 'warn', message: `${found.length}/${uiEntries.length} (${pct}%) — ${missing.length} not resolvable`, details: missing.slice(0, 10) };
    return { status: 'fail', message: `${found.length}/${uiEntries.length} (${pct}%) — ${missing.length} not resolvable`, details: missing.slice(0, 10) };
  } catch { return { status: 'warn', message: 'Could not check preview coverage' }; }
});

check('story-coverage', 'Storybook story coverage for exported components', () => {
  try {
    const stories = execSync('find packages/design-system/src -name "*.stories.tsx" | wc -l', { cwd: ROOT }).toString().trim();
    const count = parseInt(stories, 10);
    if (count >= 120) return { status: 'pass', message: `${count} story files` };
    if (count >= 80) return { status: 'warn', message: `${count} story files (target: 120+)` };
    return { status: 'fail', message: `${count} story files (target: 120+)` };
  } catch { return { status: 'warn', message: 'Could not count stories' }; }
});

check('docs-truth', 'Documentation truth — phantom imports and stale references', () => {
  try {
    const out = execSync('node scripts/lint-docs-truth.mjs 2>&1', { cwd: ROOT }).toString();
    if (out.includes('0 phantom imports')) return { status: 'pass', message: 'Docs truth: 0 phantom imports' };
    const match = out.match(/(\d+) phantom/);
    return { status: 'fail', message: `${match ? match[1] : '?'} phantom imports detected`, fix: 'Run npm run lint:docs-truth' };
  } catch { return { status: 'warn', message: 'Could not run docs truth check' }; }
});
}
