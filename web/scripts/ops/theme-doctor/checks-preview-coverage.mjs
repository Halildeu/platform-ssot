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

check('preview-coverage', 'Component preview coverage (doc entries vs PlaygroundPreview)', () => {
  const entriesDir = join(ROOT, 'packages/design-system/src/catalog/component-docs/entries');
  const previewFile = join(ROOT, 'apps/mfe-shell/src/pages/admin/design-lab/playground/PlaygroundPreview.tsx');
  const apiItems = new Set(['buildAuthHeaders','buildEntityGridQueryParams','createAccordionItemsFromSections','createAccordionPreset','createBreadcrumbItemsFromRoute','createMenuBarItemsFromRoutes','createMenuBarPreset','createNavigationDestinationItems','createNavigationRailPreset','createPageHeaderStatItems','createPageHeaderTagItems','createPageLayoutBreadcrumbItems','createPageLayoutPreset','createSegmentedItemsFromFilters','createSegmentedItemsFromRoutes','createSegmentedPreset','getResolvedToken','getThemeAxes','getThemeContract','registerTokenResolver','resetTokenResolver','resolveAccessState','resolveMenuBarActiveValue','resolveNavigationRailActiveValue','resolveSegmentedNextValue','resolveThemeModeKey','setAppearance','setDensity','setElevation','setMotion','setOverlayIntensity','setOverlayOpacity','setRadius','setSurfaceTone','setTableSurfaceTone','shouldBlockInteraction','subscribeThemeAxes','toggleVariantDefault','updateThemeAxes','useAgGridTablePagination','useAsyncCombobox','useGridVariants','useToast','withAccessGuard','THEME_APPEARANCE_OPTIONS','THEME_DENSITY_OPTIONS','THEME_ELEVATION_OPTIONS','THEME_MOTION_OPTIONS','THEME_RADIUS_OPTIONS','useScheduler']);
  try {
    const entries = readdirSync(entriesDir).filter(f => f.endsWith('.doc.ts')).map(f => f.replace('.doc.ts', ''));
    const preview = readSafe(previewFile);
    const uiEntries = entries.filter(n => !apiItems.has(n));
    const found = uiEntries.filter(n => preview.includes(n));
    const missing = uiEntries.filter(n => !preview.includes(n));
    const pct = Math.round((found.length / uiEntries.length) * 100);
    if (pct === 100) return { status: 'pass', message: `${found.length}/${uiEntries.length} UI components covered (100%)` };
    if (pct >= 90) return { status: 'warn', message: `${found.length}/${uiEntries.length} (${pct}%) — ${missing.length} missing`, details: missing.slice(0, 10) };
    return { status: 'fail', message: `${found.length}/${uiEntries.length} (${pct}%) — ${missing.length} missing`, details: missing.slice(0, 10) };
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
