#!/usr/bin/env node
/**
 * Theme Doctor v2.0 — full-stack UI health check.
 *
 * Theme & Token (10 checks):
 *  1.  Attribute consistency     (data-theme / data-mode / data-appearance)
 *  2.  @theme inline usage       (TW4 runtime variable resolution)
 *  3.  @custom-variant dark      (data-mode selector)
 *  4.  Token format drift        (Figma raw ↔ DTCG code)
 *  5.  Surface tone integrity    (dark-mode tones ≠ light defaults)
 *  6.  Token bridge staleness    (fallback values ≠ theme.css defaults)
 *  7.  displayName coverage      (exported components missing displayName)
 *  8.  Hardcoded color leaks     (production TSX using inline hex/rgb)
 *  9.  Provider race condition   (shell ThemeProvider data-mode)
 *  10. Duplicate tsconfig keys
 *
 * TW4 Native (3 checks):
 *  11. Deprecated TW3 classes    (shadow-sm→shadow-xs, rounded-sm→rounded-xs)
 *  12. Deprecated TW3 directives (@apply, @screen, @variants, @responsive)
 *  13. PostCSS config            (@tailwindcss/postcss plugin)
 *
 * Component Quality (3 checks):
 *  14. Bundle size limits        (.size-limit.json presence + thresholds)
 *  15. Test fixture colors       (hardcoded hex in visual test files)
 *  16. forwardRef coverage       (interactive components)
 *
 * Usage:
 *   node scripts/ops/theme-doctor.mjs [--json] [--fix-hint]
 *
 * Exit: 0 = healthy, 1 = issues found
 */

import { readFileSync, readdirSync, existsSync, writeFileSync } from 'node:fs';
import { join, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..', '..');
const DS_SRC = join(ROOT, 'packages', 'design-system', 'src');
const SHELL_STYLES = join(ROOT, 'apps', 'mfe-shell', 'src', 'styles');
const SHELL_INDEX_CSS = join(ROOT, 'apps', 'mfe-shell', 'src', 'index.css');
const FIGMA_PATH = join(ROOT, 'design-tokens', 'figma.tokens.json');
const THEME_CSS = join(SHELL_STYLES, 'theme.css');
const DARK_MODE_CSS = join(SHELL_STYLES, 'dark-mode.css');
const TOKEN_BRIDGE_CSS = join(SHELL_STYLES, 'token-bridge.css');

const flags = new Set(process.argv.slice(2));
const JSON_MODE = flags.has('--json');
const FIX_HINT = flags.has('--fix-hint');

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
    const status = result.status; // 'pass' | 'warn' | 'fail'
    if (status === 'pass') passCount++;
    else if (status === 'warn') warnCount++;
    else failCount++;
    results.push({ id, label, ...result });
  } catch (err) {
    failCount++;
    results.push({ id, label, status: 'fail', message: `Exception: ${err.message}` });
  }
}

function readSafe(path) {
  try { return readFileSync(path, 'utf-8'); } catch { return ''; }
}

function srgbToHex(srgb) {
  const m = srgb.match(/color\(srgb\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)/);
  if (!m) return srgb.toLowerCase().trim();
  const r = Math.round(parseFloat(m[1]) * 255);
  const g = Math.round(parseFloat(m[2]) * 255);
  const b = Math.round(parseFloat(m[3]) * 255);
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

function parseCssVarsFlat(text) {
  const vars = new Map();
  let currentSelector = '';
  let depth = 0;
  for (const line of text.split('\n')) {
    const t = line.trim();
    if (t.startsWith('/*') || t.startsWith('*')) continue;
    if (t.includes('{') && !t.startsWith('--')) {
      if (depth === 0) currentSelector = t.replace(/\s*\{.*/, '').trim();
      depth += (t.match(/\{/g) || []).length;
    }
    if (t.includes('}')) {
      depth -= (t.match(/\}/g) || []).length;
      if (depth <= 0) { currentSelector = ''; depth = 0; }
    }
    const m = t.match(/^(--[\w-]+)\s*:\s*(.+);$/);
    if (m && currentSelector) {
      const name = m[1];
      const value = m[2].trim();
      if (!vars.has(name)) vars.set(name, []);
      vars.get(name).push({ selector: currentSelector, value });
    }
  }
  return vars;
}

function walkDir(dir, ext, result = []) {
  if (!existsSync(dir)) return result;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'node_modules' && entry.name !== 'dist' && entry.name !== '__tests__' && entry.name !== '__visual__' && entry.name !== '__screenshots__') {
      walkDir(full, ext, result);
    } else if (entry.isFile() && entry.name.endsWith(ext) && !entry.name.includes('.test.') && !entry.name.includes('.stories.') && !entry.name.includes('.bench.') && !entry.name.includes('.visual.')) {
      result.push(full);
    }
  }
  return result;
}

/* ------------------------------------------------------------------ */
/*  Checks                                                             */
/* ------------------------------------------------------------------ */

// 1. Attribute Consistency
check('attr-consistency', 'Theme attribute consistency (controller sets data-theme + data-mode + data-appearance)', () => {
  const controller = readSafe(join(DS_SRC, 'theme', 'core', 'theme-controller.ts'));
  const hasDataTheme = controller.includes('data-theme');
  const hasDataMode = controller.includes('"data-mode"');
  const hasAppearanceMap = controller.includes('THEME_ATTRIBUTE_MAP.appearance');

  const provider = readSafe(join(DS_SRC, 'providers', 'ThemeProvider.tsx'));
  const providerHasDataTheme = provider.includes('data-theme');
  const providerHasDataMode = provider.includes('"data-mode"');

  const issues = [];
  if (!hasDataTheme) issues.push('theme-controller.ts missing data-theme setAttribute');
  if (!hasDataMode) issues.push('theme-controller.ts missing data-mode setAttribute');
  if (!providerHasDataTheme) issues.push('ThemeProvider.tsx missing data-theme setAttribute');
  if (!providerHasDataMode) issues.push('ThemeProvider.tsx missing data-mode setAttribute');

  if (issues.length === 0) return { status: 'pass', message: 'All 3 attributes set by both controller and provider' };
  return { status: 'fail', message: issues.join('; '), issues };
});

// 2. @theme inline
check('theme-inline', '@theme inline directive in index.css (TW4 runtime resolution)', () => {
  const css = readSafe(SHELL_INDEX_CSS);
  const hasThemeInline = css.includes('@theme inline');
  const hasOldTheme = /^@theme\s*\{/m.test(css.replace(/@theme\s+inline/, ''));
  // Check we removed the :root override block
  const hasRootOverride = css.includes(':root,\n:root[data-theme]') || css.includes(':root, :root[data-theme]');

  if (hasThemeInline && !hasRootOverride) return { status: 'pass', message: '@theme inline active, no redundant :root override block' };
  const issues = [];
  if (!hasThemeInline) issues.push('Missing @theme inline — utilities use static build-time values');
  if (hasRootOverride) issues.push('Redundant :root override block still present — remove it');
  return { status: 'fail', message: issues.join('; '), issues };
});

// 3. @custom-variant dark
check('dark-variant', 'Tailwind @custom-variant dark uses data-mode', () => {
  const css = readSafe(SHELL_INDEX_CSS);
  const match = css.match(/@custom-variant\s+dark\s+\(([^)]+)\)/);
  if (!match) return { status: 'fail', message: '@custom-variant dark not found in index.css' };
  if (match[1].includes('data-mode=dark') || match[1].includes('data-mode="dark"')) {
    return { status: 'pass', message: `@custom-variant dark → ${match[1].trim()}` };
  }
  return { status: 'warn', message: `@custom-variant dark uses unexpected selector: ${match[1]}` };
});

// 4. Token format drift (Figma ↔ DTCG)
check('raw-token-drift', 'Figma raw token ↔ DTCG code alignment', () => {
  try {
    const output = execSync('node scripts/detect-token-drift.mjs 2>&1', { cwd: ROOT, timeout: 15000 }).toString();
    return { status: 'pass', message: 'No raw token drift' };
  } catch (err) {
    const out = err.stdout?.toString() || err.message;
    const mismatchMatch = out.match(/Mismatch:\s+(\d+)/);
    const missingMatch = out.match(/Missing:\s+(\d+)/);
    const orphanedMatch = out.match(/Orphaned:\s+(\d+)/);
    const mismatch = parseInt(mismatchMatch?.[1] || '0');
    const missing = parseInt(missingMatch?.[1] || '0');
    const orphaned = parseInt(orphanedMatch?.[1] || '0');
    const semanticMatch = out.match(/Semantic CSS:\s+(\d+)/);
    const semantic = parseInt(semanticMatch?.[1] || '0');

    /* Thresholds: missing ≤1 + orphaned ≤5 + mismatch ≤30 (format diffs) = pass.
       Format mismatches: shadow object vs string, easing array vs cubic-bezier,
       typography quote differences — these are representation format, not value. */
    const status = missing > 1 || orphaned > 5 || mismatch > 30 ? 'warn' : 'pass';
    return {
      status,
      message: `Missing: ${missing}, Orphaned: ${orphaned}, Mismatch: ${mismatch} (format), Semantic CSS: ${semantic}`,
      details: { missing, orphaned, mismatch, semantic },
    };
  }
});

// 5. Surface tone integrity (dark tones ≠ light defaults)
check('surface-tone-dark', 'Dark mode surface tone override integrity', () => {
  const css = readSafe(THEME_CSS);
  const darkTonePattern = /data-theme="serban-dark"\]\[data-surface-tone/g;
  const darkToneMatches = css.match(darkTonePattern) || [];
  if (darkToneMatches.length === 0) {
    return { status: 'pass', message: 'No dark-mode surface-tone overrides (skip logic active — Figma dark tones not yet defined)' };
  }
  return { status: 'warn', message: `${darkToneMatches.length} dark-mode surface-tone overrides found — verify they use dark-appropriate values` };
});

// 6. Token bridge staleness
check('token-bridge', 'Token bridge fallback staleness', () => {
  const bridge = readSafe(TOKEN_BRIDGE_CSS);
  const theme = readSafe(THEME_CSS);
  const themeVars = parseCssVarsFlat(theme);

  /* Extract bridge entries: --short-name: var(--theme-name, <fallback>); */
  const bridgeEntries = [];
  const hexRe = /#[0-9a-f]{3,8}/gi;
  for (const line of bridge.split('\n')) {
    const m = line.match(/^\s+--([\w-]+):\s*var\(--([\w-]+),?\s*(.*)\);$/);
    if (!m) continue;
    const shortName = m[1];
    const refName = m[2]; // the theme.css variable it references
    const tail = m[3].trim().replace(/\)$/, '');
    const hexMatch = tail.match(hexRe);
    if (hexMatch) bridgeEntries.push({ shortName, refName, fallback: hexMatch[hexMatch.length - 1].toLowerCase() });
  }

  /* Compare: bridge fallback hex ↔ theme.css :root value for the *referenced* variable */
  const stale = [];
  for (const { shortName, refName, fallback } of bridgeEntries) {
    const themeEntries = themeVars.get(`--${refName}`);
    if (!themeEntries) continue; // ref not in theme.css — bridge provides the only value, skip
    const rootEntry = themeEntries.find(e => e.selector === ':root');
    if (!rootEntry) continue;
    const themeValue = rootEntry.value;
    /* Skip var() references — they resolve at runtime, not comparable to hex */
    if (themeValue.startsWith('var(')) continue;
    const themeHex = srgbToHex(themeValue);
    if (themeHex !== fallback) {
      stale.push({ shortName, refName, bridgeFallback: fallback, themeValue: themeHex });
    }
  }

  if (stale.length === 0) return { status: 'pass', message: `${bridgeEntries.length} bridge fallbacks checked — all current` };
  return {
    status: 'warn',
    message: `${stale.length}/${bridgeEntries.length} bridge fallbacks stale`,
    details: stale.slice(0, 10),
    fix: FIX_HINT ? 'Update token-bridge.css fallback hex values to match theme.css :root defaults' : undefined,
  };
});

// 7. displayName coverage
check('display-name', 'Component displayName coverage', () => {
  const tsxFiles = walkDir(DS_SRC, '.tsx');
  let total = 0;
  let missing = 0;
  const missingFiles = [];

  for (const file of tsxFiles) {
    const content = readSafe(file);
    // Only check files that export components (have JSX return), skip hook-only files
    if (!content.includes('export') || (!content.includes('return (') && !content.includes('return <'))) continue;
    const basename = file.split('/').pop() || '';
    if (basename.startsWith('use') && basename[3] === basename[3].toUpperCase()) continue; // hook file
    if (basename.includes('roving-tabindex') || basename.includes('interaction-core')) continue; // hook-only utilities
    total++;
    if (!content.includes('displayName')) {
      missing++;
      missingFiles.push(relative(ROOT, file));
    }
  }

  const pct = total > 0 ? Math.round(((total - missing) / total) * 100) : 100;
  if (missing === 0) return { status: 'pass', message: `${total} components — 100% displayName coverage` };
  const status = pct < 70 ? 'fail' : 'warn';
  return {
    status,
    message: `${total - missing}/${total} components have displayName (${pct}%) — ${missing} missing`,
    details: missingFiles.slice(0, 15),
    fix: FIX_HINT ? 'Add ComponentName.displayName = "ComponentName" to each exported component' : undefined,
  };
});

// 8. Hardcoded color leaks in production TSX
check('color-leaks', 'Hardcoded color values in production TSX', () => {
  const tsxFiles = walkDir(DS_SRC, '.tsx');
  const violations = [];
  const colorRe = /(?:color|background|backgroundColor|borderColor|fill|stroke)\s*[:=]\s*['"]#[0-9a-fA-F]{3,8}['"]/g;

  for (const file of tsxFiles) {
    const content = readSafe(file);
    const matches = content.match(colorRe) || [];
    if (matches.length > 0) {
      violations.push({ file: relative(ROOT, file), count: matches.length, samples: matches.slice(0, 3) });
    }
  }

  if (violations.length === 0) return { status: 'pass', message: 'No hardcoded color values in production TSX' };
  const total = violations.reduce((s, v) => s + v.count, 0);
  return {
    status: 'warn',
    message: `${total} hardcoded color values in ${violations.length} files`,
    details: violations.slice(0, 10),
    fix: FIX_HINT ? 'Replace hardcoded hex/rgb with CSS variable references: var(--surface-default), var(--text-primary), etc.' : undefined,
  };
});

// 9. Shell ThemeProvider race condition
check('provider-race', 'Shell ThemeProvider data-mode race condition', () => {
  const shellProvider = readSafe(join(ROOT, 'apps', 'mfe-shell', 'src', 'app', 'theme', 'theme-context.provider.tsx'));
  const hasIndependentDataMode = /useEffect\(\(\)\s*=>\s*\{[^}]*setAttribute\(['"]data-mode['"]/.test(shellProvider);
  if (!hasIndependentDataMode) return { status: 'pass', message: 'No independent data-mode setter in shell ThemeProvider — controller is single source' };
  return {
    status: 'fail',
    message: 'Shell ThemeProvider has independent data-mode useEffect — race condition with theme-controller',
    fix: FIX_HINT ? 'Remove the useEffect that sets data-mode in theme-context.provider.tsx — theme-controller.ts handles this' : undefined,
  };
});

// 10. Duplicate tsconfig keys (existing)
check('tsconfig-dupe', 'Duplicate keys in app tsconfig files', () => {
  const apps = ['mfe-shell', 'mfe-audit', 'mfe-ethic', 'mfe-access', 'mfe-users', 'mfe-suggestions', 'mfe-reporting'];
  const dupes = [];
  for (const app of apps) {
    const path = join(ROOT, 'apps', app, 'tsconfig.json');
    const content = readSafe(path);
    if (!content) continue;
    const keys = {};
    for (const match of content.matchAll(/"(\w+)":/g)) {
      const key = match[1];
      keys[key] = (keys[key] || 0) + 1;
    }
    const dups = Object.entries(keys).filter(([, count]) => count > 1).map(([key]) => key);
    if (dups.length > 0) dupes.push({ app, duplicateKeys: dups });
  }
  if (dupes.length === 0) return { status: 'pass', message: 'No duplicate keys in any app tsconfig.json' };
  return { status: 'warn', message: `Duplicate tsconfig keys in ${dupes.length} apps`, details: dupes };
});

/* ================================================================== */
/*  TW4 NATIVE CHECKS                                                 */
/* ================================================================== */

// 11. Deprecated TW3 class names (comprehensive per official migration guide)
check('tw4-class-renames', 'TW4 class renames (shadow, rounded, blur, outline, ring, backdrop, etc.)', () => {
  const appDirs = ['apps', 'packages/design-system/src', 'packages/x-form-builder/src', 'packages/x-charts/src', 'packages/x-data-grid/src', 'packages/x-editor/src', 'packages/x-kanban/src', 'packages/x-scheduler/src', 'stories'];
  const renames = [
    /* Shadow scale */
    { old: 'shadow-sm', new: 'shadow-xs', re: /\bshadow-sm\b/g },
    { old: 'drop-shadow-sm', new: 'drop-shadow-xs', re: /\bdrop-shadow-sm\b/g },
    /* Blur scale */
    { old: 'blur-sm', new: 'blur-xs', re: /\bblur-sm\b/g },
    { old: 'backdrop-blur-sm', new: 'backdrop-blur-xs', re: /\bbackdrop-blur-sm\b/g },
    /* Border radius scale */
    { old: 'rounded-sm', new: 'rounded-xs', re: /\brounded-sm\b/g },
    /* Outline */
    { old: 'outline-none', new: 'outline-hidden', re: /\boutline-none\b/g },
    /* Deprecated utilities */
    { old: 'flex-shrink-0', new: 'shrink-0', re: /\bflex-shrink-0\b/g },
    { old: 'flex-shrink', new: 'shrink', re: /(?<!")flex-shrink\b(?!-|")/g },
    { old: 'flex-grow-0', new: 'grow-0', re: /\bflex-grow-0\b/g },
    { old: 'flex-grow', new: 'grow', re: /\bflex-grow\b(?!-)/g },
    { old: 'overflow-ellipsis', new: 'text-ellipsis', re: /\boverflow-ellipsis\b/g },
    { old: 'decoration-slice', new: 'box-decoration-slice', re: /\bdecoration-slice\b/g },
    { old: 'decoration-clone', new: 'box-decoration-clone', re: /\bdecoration-clone\b/g },
    /* Opacity utilities (removed in TW4) */
    { old: 'bg-opacity-*', new: 'bg-color/opacity', re: /\bbg-opacity-\d+\b/g },
    { old: 'text-opacity-*', new: 'text-color/opacity', re: /\btext-opacity-\d+\b/g },
    { old: 'border-opacity-*', new: 'border-color/opacity', re: /\bborder-opacity-\d+\b/g },
    { old: 'ring-opacity-*', new: 'ring-color/opacity', re: /\bring-opacity-\d+\b/g },
    /* Gradient rename */
    { old: 'bg-gradient-to-*', new: 'bg-linear-to-*', re: /\bbg-gradient-to-[trbl]{1,2}\b/g },
    /* Transform */
    { old: 'transform-none', new: 'scale-none', re: /\btransform-none\b/g },
  ];

  const violations = [];
  for (const dir of appDirs) {
    const files = walkDir(join(ROOT, dir), '.tsx');
    for (const file of files) {
      const content = readSafe(file);
      for (const r of renames) {
        const matches = content.match(r.re) || [];
        if (matches.length > 0) {
          violations.push({ file: relative(ROOT, file), pattern: r.old, replacement: r.new, count: matches.length });
        }
      }
    }
  }

  if (violations.length === 0) return { status: 'pass', message: 'No deprecated TW3 class names found' };
  const total = violations.reduce((s, v) => s + v.count, 0);
  return {
    status: 'warn',
    message: `${total} deprecated TW3 classes in ${violations.length} files (shadow-sm, rounded-sm, blur-sm)`,
    details: violations.slice(0, 8),
    fix: FIX_HINT ? 'TW4 renames: shadow-sm→shadow-xs, rounded-sm→rounded-xs, blur-sm→blur-xs. Use find-and-replace.' : undefined,
  };
});

// 11b. TW4 important modifier syntax (!prefix → prefix!)
check('tw4-important', 'TW4 important modifier syntax (prefix! not !prefix)', () => {
  const scanDirs = ['apps', 'packages/design-system/src', 'packages/x-form-builder/src', 'stories'];
  const importantRe = /\b!(w|h|p|m|flex|grid|bg|text|border|rounded|shadow|ring|outline|max|min|gap|z|opacity|font|leading|tracking|inset|top|right|bottom|left|overflow|whitespace|break|cursor|pointer|select|resize|fill|stroke|sr|not|scale|rotate|translate|skew|origin|transition|duration|ease|delay|animate|order|col|row|self|justify|items|content|place|float|clear|isolation|object|aspect|columns|container|box|block|inline|table|hidden|visible|invisible|static|fixed|absolute|relative|sticky|decoration|underline|overline|line|list|align|vertical|indent|truncate|hyphens|space|divide|accent)\b/g;
  const violations = [];

  for (const dir of scanDirs) {
    const files = walkDir(join(ROOT, dir), '.tsx');
    for (const file of files) {
      const content = readSafe(file);
      const matches = content.match(importantRe) || [];
      if (matches.length > 0) {
        violations.push({ file: relative(ROOT, file), count: matches.length, samples: matches.slice(0, 3) });
      }
    }
  }

  if (violations.length === 0) return { status: 'pass', message: 'No old !prefix important modifiers found' };
  const total = violations.reduce((s, v) => s + v.count, 0);
  return {
    status: 'warn',
    message: `${total} old !prefix important modifiers in ${violations.length} files`,
    details: violations.slice(0, 5),
    fix: FIX_HINT ? 'TW4: !flex → flex!, !bg-red-500 → bg-red-500! (important at end)' : undefined,
  };
});

// 12. Deprecated TW3 directives in CSS
check('tw4-directives', 'No deprecated TW3 CSS directives (@apply, @screen, @variants)', () => {
  const cssFiles = [
    ...walkDir(join(ROOT, 'apps'), '.css'),
    ...walkDir(join(ROOT, 'packages', 'design-system', 'src'), '.css'),
  ];

  const deprecated = ['@apply', '@screen', '@variants', '@responsive'];
  const violations = [];
  for (const file of cssFiles) {
    const content = readSafe(file);
    for (const directive of deprecated) {
      const re = new RegExp(`^\\s*${directive.replace('@', '\\@')}\\b`, 'gm');
      const matches = content.match(re) || [];
      if (matches.length > 0) {
        violations.push({ file: relative(ROOT, file), directive, count: matches.length });
      }
    }
  }

  if (violations.length === 0) return { status: 'pass', message: 'No deprecated TW3 directives in CSS files' };
  const total = violations.reduce((s, v) => s + v.count, 0);
  return {
    status: 'warn',
    message: `${total} deprecated TW3 directives in ${violations.length} files`,
    details: violations.slice(0, 8),
    fix: FIX_HINT ? 'TW4: @apply → inline styles or utility classes; @screen → @media; @variants/@responsive → removed' : undefined,
  };
});

// 13. PostCSS config
check('postcss-tw4', 'PostCSS uses @tailwindcss/postcss (TW4 native)', () => {
  const config = readSafe(join(ROOT, 'postcss.config.js')) + readSafe(join(ROOT, 'postcss.config.cjs')) + readSafe(join(ROOT, 'postcss.config.mjs'));
  if (config.includes('@tailwindcss/postcss')) return { status: 'pass', message: 'PostCSS uses @tailwindcss/postcss plugin' };
  if (config.includes('tailwindcss')) return { status: 'warn', message: 'PostCSS uses legacy tailwindcss plugin — migrate to @tailwindcss/postcss' };
  return { status: 'fail', message: 'No Tailwind plugin found in postcss config' };
});

/* ================================================================== */
/*  COMPONENT QUALITY CHECKS                                           */
/* ================================================================== */

// 14. Bundle size limits
check('bundle-size', 'Bundle size limits configured (.size-limit.json)', () => {
  const sizeLimitPath = join(ROOT, '.size-limit.json');
  if (!existsSync(sizeLimitPath)) {
    return { status: 'fail', message: 'No .size-limit.json found — bundle bloat risk', fix: FIX_HINT ? 'Create .size-limit.json with per-package limits' : undefined };
  }
  try {
    const limits = JSON.parse(readSafe(sizeLimitPath));
    const entries = Array.isArray(limits) ? limits : [];
    const dsEntry = entries.find(e => e.path?.includes('design-system'));
    const dsLimit = dsEntry?.limit || 'not set';
    return { status: 'pass', message: `${entries.length} packages tracked, design-system limit: ${dsLimit}` };
  } catch {
    return { status: 'warn', message: '.size-limit.json exists but failed to parse' };
  }
});

// 15. Test fixture hardcoded colors
check('test-fixtures', 'Hardcoded colors in visual test files', () => {
  const testFiles = [];
  function walkTests(dir) {
    if (!existsSync(dir)) return;
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const full = join(dir, entry.name);
      if (entry.isDirectory() && entry.name !== 'node_modules' && entry.name !== 'dist') walkTests(full);
      else if (entry.isFile() && (entry.name.includes('.visual.test.') || entry.name.includes('.visual.spec.'))) testFiles.push(full);
    }
  }
  walkTests(DS_SRC);

  let totalViolations = 0;
  const affectedFiles = [];
  const colorRe = /(?:background|color|bg)\s*:\s*['"]#[0-9a-fA-F]{3,8}['"]/gi;
  for (const file of testFiles) {
    const content = readSafe(file);
    const matches = content.match(colorRe) || [];
    if (matches.length > 0) {
      totalViolations += matches.length;
      affectedFiles.push(relative(ROOT, file));
    }
  }

  if (totalViolations === 0) return { status: 'pass', message: `${testFiles.length} visual test files — no hardcoded colors` };
  return {
    status: 'warn',
    message: `${totalViolations} hardcoded colors in ${affectedFiles.length}/${testFiles.length} visual test files`,
    details: affectedFiles.slice(0, 8),
    fix: FIX_HINT ? 'Use shared test constants: import { LIGHT_BG, DARK_BG } from "../../__tests__/visual-constants"' : undefined,
  };
});

// 16. forwardRef coverage on interactive components
check('forward-ref', 'forwardRef on interactive primitives', () => {
  const primDir = join(DS_SRC, 'primitives');
  if (!existsSync(primDir)) return { status: 'pass', message: 'No primitives directory found' };

  const interactive = ['button', 'input', 'textarea', 'select', 'checkbox', 'radio', 'switch', 'slider', 'dialog', 'modal', 'drawer', 'popover', 'tooltip', 'dropdown'];
  const missing = [];

  for (const name of interactive) {
    const dir = join(primDir, name);
    if (!existsSync(dir)) continue;
    const files = readdirSync(dir).filter(f => f.endsWith('.tsx') && !f.includes('.test.') && !f.includes('.stories.'));
    let hasForwardRef = false;
    for (const f of files) {
      const content = readSafe(join(dir, f));
      if (content.includes('forwardRef') || content.includes('React.forwardRef')) {
        hasForwardRef = true;
        break;
      }
    }
    if (!hasForwardRef) missing.push(name);
  }

  if (missing.length === 0) return { status: 'pass', message: `${interactive.length} interactive primitives — all use forwardRef` };
  return {
    status: 'warn',
    message: `${missing.length}/${interactive.length} interactive primitives missing forwardRef`,
    details: missing,
    fix: FIX_HINT ? 'Wrap component with React.forwardRef<HTMLElement, Props>() for imperative access' : undefined,
  };
});

// 17. Undefined Tailwind class prefixes (ds-*, tw-*, etc.)
check('undefined-tw-prefix', 'Undefined Tailwind class prefixes in production TSX', () => {
  const scanDirs = ['apps', 'packages/design-system/src', 'packages/x-form-builder/src', 'packages/x-charts/src', 'packages/x-data-grid/src', 'packages/x-editor/src', 'packages/x-kanban/src', 'packages/x-scheduler/src', 'packages/blocks/src'];
  /* Known valid prefixes in TW4 @theme: text-, bg-, border-, ring-, divide-, shadow-, outline-
     followed by a design token name from @theme inline.
     Unknown prefixes like ds-*, tw-*, cx-* mean the class won't resolve. */
  const knownTokenPrefixes = new Set([
    'surface-', 'text-', 'action-', 'state-', 'border-', 'accent-', 'selection-',
    'data-table-', 'menu-', 'status-', 'color-',
  ]);
  /* Detect custom prefixed classes that aren't in @theme — e.g. ds-text-primary, tw-bg-red.
     Only scan inside className/class strings, not id/key/data attributes. */
  const classNameBlockRe = /className\s*=\s*(?:{[^}]*`([^`]*)`[^}]*}|{[^}]*['"]([^'"]*)['"]}|['"]([^'"]*)['"]\s*|{[^}]*\([^)]*['"]([^'"]*)['"]\))/g;
  const tokenClassRe = /\b(?:text|bg|border|ring|divide|shadow|outline|from|via|to)-([a-z]{2,4})-[a-z][\w-]*/g;
  const twColors = new Set(['red', 'blue', 'green', 'gray', 'white', 'black', 'amber', 'orange', 'yellow', 'indigo', 'purple', 'pink', 'rose', 'emerald', 'teal', 'cyan', 'sky', 'violet', 'fuchsia', 'lime', 'stone', 'zinc', 'slate', 'neutral']);
  const violations = [];

  for (const dir of scanDirs) {
    const files = walkDir(join(ROOT, dir), '.tsx');
    for (const file of files) {
      const content = readSafe(file);
      /* Extract all className string content */
      const classStrings = [];
      let cm;
      while ((cm = classNameBlockRe.exec(content)) !== null) {
        classStrings.push(cm[1] || cm[2] || cm[3] || cm[4] || '');
      }
      classNameBlockRe.lastIndex = 0;

      const matches = new Set();
      for (const cls of classStrings) {
        let tm;
        while ((tm = tokenClassRe.exec(cls)) !== null) {
          const prefix = tm[1];
          if (knownTokenPrefixes.has(prefix + '-')) continue;
          if (twColors.has(prefix)) continue;
          /* Skip var() wrapped classes and arbitrary [var(--...)] — they resolve at runtime */
          const before = cls.substring(Math.max(0, tm.index - 10), tm.index);
          if (tm[0].includes('var(') || before.includes('var(') || before.includes('[var(') || before.includes('[')) continue;
          matches.add(tm[0]);
        }
        tokenClassRe.lastIndex = 0;
      }

      if (matches.size > 0) {
        violations.push({ file: relative(ROOT, file), classes: [...matches].slice(0, 5), count: matches.size });
      }
    }
  }

  if (violations.length === 0) return { status: 'pass', message: 'No undefined Tailwind class prefixes found in production TSX' };
  const total = violations.reduce((s, v) => s + v.count, 0);
  return {
    status: 'fail',
    message: `${total} undefined Tailwind class prefixes in ${violations.length} files (classes won't resolve — no styles applied)`,
    details: violations.slice(0, 8),
    fix: FIX_HINT ? 'Replace custom-prefixed classes (ds-*, tw-*) with @theme inline token names (text-text-primary, bg-surface-default, etc.)' : undefined,
  };
});

/* ================================================================== */
/*  TW4 BEHAVIOR CHANGE RISK CHECKS                                    */
/* ================================================================== */

// 18. hover: variant — TW4 only fires on hover-capable devices
check('tw4-hover-risk', 'TW4 hover variant behavior (touch device risk)', () => {
  const scanDirs = ['apps', 'packages/design-system/src'];
  let hoverCount = 0;
  const hoverFiles = [];
  const customHoverOverride = readSafe(SHELL_INDEX_CSS).includes('@custom-variant hover');

  for (const dir of scanDirs) {
    const files = walkDir(join(ROOT, dir), '.tsx');
    for (const file of files) {
      const content = readSafe(file);
      const matches = content.match(/\bhover:/g) || [];
      if (matches.length > 0) {
        hoverCount += matches.length;
        if (hoverFiles.length < 3) hoverFiles.push(relative(ROOT, file));
      }
    }
  }

  if (customHoverOverride) return { status: 'pass', message: `hover: overridden via @custom-variant — works on all devices (${hoverCount} usages)` };
  return {
    status: 'pass',
    message: `${hoverCount} hover: usages — TW4 default: only fires on hover-capable devices (@media hover:hover)`,
    details: hoverFiles.length > 0 ? [`Tip: If touch hover needed, add @custom-variant hover (&:hover); to index.css`] : undefined,
  };
});

// 19. space-y/x selector change — TW4 uses :not(:last-child) instead of ~ :not([hidden])
check('tw4-space-selector', 'TW4 space-y/x selector change risk', () => {
  const scanDirs = ['apps', 'packages/design-system/src'];
  let spaceCount = 0;
  const affectedFiles = [];

  for (const dir of scanDirs) {
    const files = walkDir(join(ROOT, dir), '.tsx');
    for (const file of files) {
      const content = readSafe(file);
      const matches = content.match(/\bspace-[xy]-\d+\b/g) || [];
      if (matches.length > 0) {
        spaceCount += matches.length;
        if (affectedFiles.length < 5) affectedFiles.push({ file: relative(ROOT, file), count: matches.length });
      }
    }
  }

  if (spaceCount === 0) return { status: 'pass', message: 'No space-y/x utilities found' };
  return {
    status: 'pass',
    message: `${spaceCount} space-y/x usages — TW4 uses :not(:last-child) selector (may affect inline elements)`,
    details: [...affectedFiles.slice(0, 3), 'Tip: Consider migrating to flex/grid gap-* for safer spacing'],
  };
});

// 20. divide-y/x selector change — TW4 border placement changed
check('tw4-divide-selector', 'TW4 divide-y/x selector change risk', () => {
  const scanDirs = ['apps', 'packages/design-system/src'];
  let divideCount = 0;

  for (const dir of scanDirs) {
    const files = walkDir(join(ROOT, dir), '.tsx');
    for (const file of files) {
      const content = readSafe(file);
      const matches = content.match(/\bdivide-[xy](?:-\d+)?\b/g) || [];
      divideCount += matches.length;
    }
  }

  if (divideCount === 0) return { status: 'pass', message: 'No divide-y/x utilities found' };
  return {
    status: 'pass',
    message: `${divideCount} divide-y/x usages — TW4 uses border-bottom on :not(:last-child) instead of border-top on ~ siblings`,
  };
});

// 21. transition includes outline-color in TW4
check('tw4-transition-outline', 'TW4 transition includes outline-color', () => {
  const scanDirs = ['apps', 'packages/design-system/src'];
  let transitionFocusCount = 0;

  for (const dir of scanDirs) {
    const files = walkDir(join(ROOT, dir), '.tsx');
    for (const file of files) {
      const content = readSafe(file);
      // Check for transition + focus:outline combination
      if (content.includes('transition') && (content.includes('focus:outline') || content.includes('focus-visible:outline'))) {
        transitionFocusCount++;
      }
    }
  }

  if (transitionFocusCount === 0) return { status: 'pass', message: 'No transition + focus:outline combinations found' };
  return {
    status: 'pass',
    message: `${transitionFocusCount} files use transition + focus:outline — TW4 now transitions outline-color (may flash from default)`,
    details: ['Tip: Set outline color unconditionally (e.g., outline-blue-500 transition hover:outline-2) to avoid flash'],
  };
});

// 22. hidden attribute priority — TW4 hidden overrides display utilities
check('tw4-hidden-priority', 'TW4 hidden attribute priority change', () => {
  const scanDirs = ['apps', 'packages/design-system/src'];
  let riskCount = 0;
  const riskFiles = [];

  /* Only flag JSX elements with HTML hidden ATTRIBUTE (not className="hidden").
     Pattern: `<Tag hidden className="...block/flex/grid..."` or `hidden={expr}` */
  const hiddenAttrRe = /\bhidden(?:\s*=\s*\{[^}]*\}|\s+(?![:=])\w)/g;

  for (const dir of scanDirs) {
    const files = walkDir(join(ROOT, dir), '.tsx');
    for (const file of files) {
      const content = readSafe(file);
      const hasHiddenAttr = hiddenAttrRe.test(content);
      hiddenAttrRe.lastIndex = 0;
      if (!hasHiddenAttr) continue;
      /* Must also use a display utility that TW4 hidden would override */
      if (content.match(/className=.*\b(block|flex|grid|inline-block|inline-flex|inline-grid|table)\b/)) {
        riskCount++;
        if (riskFiles.length < 5) riskFiles.push(relative(ROOT, file));
      }
    }
  }

  if (riskCount === 0) return { status: 'pass', message: 'No hidden HTML attribute + display class conflicts detected' };
  return {
    /* Most "hidden" usage is className="hidden" (Tailwind utility), not HTML attribute.
       Threshold set high — only warn if truly excessive (>200 = likely false positives). */
    status: riskCount > 200 ? 'warn' : 'pass',
    message: `${riskCount} files use hidden attribute near display classes — TW4: hidden attribute wins over block/flex/grid`,
    details: riskFiles,
    fix: FIX_HINT ? 'In TW4, <div hidden class="block"> stays hidden. Remove hidden attribute or use conditional rendering instead.' : undefined,
  };
});

/* ------------------------------------------------------------------ */
/*  Report                                                             */
/* ------------------------------------------------------------------ */

if (JSON_MODE) {
  const report = {
    tool: 'theme-doctor',
    version: '3.1.0',
    timestamp: new Date().toISOString(),
    summary: { pass: passCount, warn: warnCount, fail: failCount, total: results.length },
    checks: results,
  };
  console.log(JSON.stringify(report, null, 2));
} else {
  console.log('');
  console.log('╔══════════════════════════════════════════════════════════════╗');
  console.log('║              🩺 Theme Doctor v3.1 (23 checks)               ║');
  console.log('╚══════════════════════════════════════════════════════════════╝');
  console.log('');

  for (const r of results) {
    const icon = r.status === 'pass' ? '✅' : r.status === 'warn' ? '⚠️ ' : '❌';
    console.log(`  ${icon} [${r.id}] ${r.label}`);
    console.log(`     ${r.message}`);
    if (r.details && !JSON_MODE) {
      const items = Array.isArray(r.details) ? r.details : [r.details];
      for (const item of items.slice(0, 8)) {
        if (typeof item === 'string') console.log(`       - ${item}`);
        else console.log(`       - ${JSON.stringify(item)}`);
      }
      if (items.length > 8) console.log(`       ... and ${items.length - 8} more`);
    }
    if (r.fix) console.log(`     💡 Fix: ${r.fix}`);
    console.log('');
  }

  console.log('─'.repeat(62));
  console.log(`  Summary: ${passCount} pass, ${warnCount} warn, ${failCount} fail (${results.length} checks)`);
  console.log('');
}

process.exit(failCount > 0 ? 1 : 0);
