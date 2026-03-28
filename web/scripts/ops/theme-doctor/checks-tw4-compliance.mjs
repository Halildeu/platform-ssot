/**
 * TW4 Full Compliance checks
 * Extracted from theme-doctor.mjs for maintainability.
 */

import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';

export function register(ctx) {
  const { check, readSafe, srgbToHex, parseCssVarsFlat, walkDir,
    ROOT, DS_SRC, SHELL_STYLES, SHELL_INDEX_CSS, FIGMA_PATH,
    THEME_CSS, TOKEN_BRIDGE_CSS, TOKENS_CSS, THEME_INLINE_CSS, FIX_HINT } = ctx;

/*  FAZ 2 — TW4 FULL COMPLIANCE CHECKS                                */
/* ================================================================== */

// 28. theme-inline-sync — verify all theme.css tokens have @theme inline mapping
check('theme-inline-sync', 'Token pipeline: theme.css ↔ @theme inline sync', () => {
  const themeCss = readSafe(THEME_CSS);
  const genPath = join(SHELL_STYLES, 'generated-theme-inline.css');
  const genCss = readSafe(genPath);
  if (!genCss) return { status: 'warn', message: 'generated-theme-inline.css not found' };

  /* Extract :root var names from theme.css */
  const rootBlock = themeCss.match(/:root\s*\{([\s\S]*?)\}/);
  if (!rootBlock) return { status: 'warn', message: 'No :root block in theme.css' };
  const themeVars = new Set();
  for (const line of rootBlock[1].split('\n')) {
    const m = line.match(/^\s+--([\w-]+):/);
    if (m) themeVars.add(m[1]);
  }

  /* Extract var() references from @theme inline */
  const inlineBlock = genCss.match(/@theme\s+inline\s*\{([\s\S]*?)\}/);
  if (!inlineBlock) return { status: 'warn', message: 'No @theme inline block in generated file' };
  const referencedVars = new Set();
  for (const line of inlineBlock[1].split('\n')) {
    const refs = line.matchAll(/var\(--([\w-]+)/g);
    for (const ref of refs) referencedVars.add(ref[1]);
  }

  /* Find theme.css vars not referenced in @theme inline.
     Skip internal tokens that don't need TW utility generation. */
  /* These tokens are used via var() cascade, not TW utility generation */
  const skipPrefixes = ['surface-tones-', 'surface-table-', 'overlay-', 'accent-', 'elevation-', 'chart-', 'control-', 'box-plot-', 'fk-', 'heatmap-', 'histogram-', 'pareto-', 'wf-', 'segmented-', 'float-button-', 'rating-', 'status-', 'ds-', 'color-', 'brand-', 'interactive-', 'shadow-', 'motion-', 'density-', 'spacing-', 'radius-', 'font-size-', 'focus-ring-'];
  const unmapped = [...themeVars].filter(v =>
    !referencedVars.has(v) &&
    !v.startsWith('font-family') &&
    !skipPrefixes.some(p => v.startsWith(p))
  );
  if (unmapped.length === 0) return { status: 'pass', message: `All ${themeVars.size} theme.css :root tokens mapped in @theme inline (${themeVars.size - referencedVars.size} internal tokens skipped)` };
  return {
    status: unmapped.length > 5 ? 'warn' : 'pass',
    message: `${unmapped.length}/${themeVars.size} theme.css tokens not referenced in @theme inline`,
    details: unmapped.slice(0, 8).map(v => `--${v}`),
  };
});

// 29. dark-mode-orphan — verify dark-mode.css has been deleted
check('dark-mode-orphan', 'Dead code: dark-mode.css should not exist (consolidated into theme.css)', () => {
  const darkPath = join(SHELL_STYLES, 'dark-mode.css');
  const exists = existsSync(darkPath);
  if (!exists) return { status: 'pass', message: 'dark-mode.css deleted — dark mode consolidated in theme.css' };
  return { status: 'warn', message: 'dark-mode.css still exists — should be deleted (dead code, never imported)' };
});

// 30. v4-important-position — check for v3 !utility syntax
check('v4-important-position', 'TW4: important modifier position (v3: hover:!bg → v4: hover:bg!)', () => {
  const scanDirs = ['apps', 'packages/design-system/src', 'packages/x-form-builder/src'];
  let count = 0;
  const hits = [];
  for (const dir of scanDirs) {
    for (const file of walkDir(join(ROOT, dir), '.tsx')) {
      const content = readSafe(file);
      const matches = content.match(/(?:hover|focus|active|disabled|dark|sm|md|lg|xl):![a-z]/g);
      if (matches) {
        count += matches.length;
        if (hits.length < 5) hits.push({ file: relative(ROOT, file), patterns: matches.slice(0, 3) });
      }
    }
  }
  if (count === 0) return { status: 'pass', message: 'No v3-style !important prefix found — all v4 compatible' };
  return { status: 'warn', message: `${count} v3-style !important prefixes found (should be suffix: bg-red! not !bg-red)`, details: hits };
});

// 31. v4-css-var-syntax — check for [--var] bracket syntax (v3)
check('v4-css-var-syntax', 'TW4: CSS variable syntax (v3: [--var] → v4: (--var))', () => {
  const scanDirs = ['apps', 'packages/design-system/src', 'packages/x-form-builder/src'];
  let count = 0;
  const hits = [];
  /* Match className patterns with [--custom-var] (v3 syntax) */
  const re = /className[^"]*"[^"]*\[--[a-z][\w-]*\][^"]*"/g;
  for (const dir of scanDirs) {
    for (const file of walkDir(join(ROOT, dir), '.tsx')) {
      const content = readSafe(file);
      const matches = content.match(re);
      if (matches) {
        count += matches.length;
        if (hits.length < 5) hits.push(relative(ROOT, file));
      }
    }
  }
  if (count === 0) return { status: 'pass', message: 'No v3-style [--var] bracket syntax — all use (--var) or var()' };
  return { status: 'warn', message: `${count} files use v3 [--var] bracket syntax in className`, details: hits };
});

// 32. v4-transform-none — check for deprecated transform-none
check('v4-transform-none', 'TW4: transform-none replaced by scale-none/rotate-none/translate-none', () => {
  const scanDirs = ['apps', 'packages/design-system/src'];
  let count = 0;
  const hits = [];
  for (const dir of scanDirs) {
    for (const file of walkDir(join(ROOT, dir), '.tsx')) {
      const content = readSafe(file);
      if (content.includes('transform-none')) {
        count++;
        if (hits.length < 5) hits.push(relative(ROOT, file));
      }
    }
  }
  if (count === 0) return { status: 'pass', message: 'No deprecated transform-none usage' };
  return { status: 'warn', message: `${count} files use transform-none (use scale-none, rotate-none, translate-none)`, details: hits };
});

// 33. system-preference-support — verify @media prefers-color-scheme in theme.css
check('system-preference', 'Dark mode: @media (prefers-color-scheme: dark) support in theme.css', () => {
  const themeCss = readSafe(THEME_CSS);
  const hasMediaQuery = themeCss.includes('@media (prefers-color-scheme: dark)');
  const hasSystemMode = themeCss.includes('[data-mode="system"]');
  const hasColorScheme = themeCss.includes('color-scheme: dark');
  if (hasMediaQuery && hasSystemMode && hasColorScheme) {
    return { status: 'pass', message: 'theme.css has system preference fallback + color-scheme: dark' };
  }
  const missing = [];
  if (!hasMediaQuery) missing.push('@media (prefers-color-scheme: dark)');
  if (!hasSystemMode) missing.push('[data-mode="system"] selector');
  if (!hasColorScheme) missing.push('color-scheme: dark');
  return { status: 'warn', message: `Missing in theme.css: ${missing.join(', ')}` };
});

/* ================================================================== */
}
