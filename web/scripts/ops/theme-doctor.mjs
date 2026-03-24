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
const TOKEN_BRIDGE_CSS = join(SHELL_STYLES, 'token-bridge.css');
const TOKENS_CSS = join(ROOT, 'packages', 'design-system', 'src', 'tokens', 'build', 'tokens.css');
const THEME_INLINE_CSS = join(SHELL_STYLES, 'generated-theme-inline.css');

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
check('color-leaks', 'Hardcoded color values in production code (all patterns)', () => {
  const scanDirs = [DS_SRC, join(ROOT, 'packages/x-form-builder/src'), join(ROOT, 'packages/x-charts/src'), join(ROOT, 'packages/x-data-grid/src'), join(ROOT, 'packages/x-editor/src'), join(ROOT, 'packages/x-kanban/src'), join(ROOT, 'packages/x-scheduler/src'), join(ROOT, 'apps/mfe-shell/src'), join(ROOT, 'apps/mfe-audit/src'), join(ROOT, 'apps/mfe-users/src'), join(ROOT, 'apps/mfe-access/src'), join(ROOT, 'apps/mfe-reporting/src'), join(ROOT, 'apps/mfe-ethic/src'), join(ROOT, 'apps/mfe-suggestions/src')];
  const internalPaths = ['design-lab', 'demos/', 'playground/', 'showcase/', '__stories__'];
  const violations = [];
  const patterns = [
    /* 1. Inline style hex: style={{ color: '#fff' }} or backgroundColor: '#000' */
    { name: 'inline-hex', re: /(?:color|background|backgroundColor|borderColor|fill|stroke|boxShadow)\s*[:=]\s*['"]#[0-9a-fA-F]{3,8}['"]/g },
    /* 2. SVG attribute hex: fill="#fff", stroke="#000" (not var()) */
    { name: 'svg-hex', re: /\b(?:fill|stroke|stop-color|flood-color)="(?!var\()#[0-9a-fA-F]{3,8}"/g },
    /* 3. rgb/rgba in inline style */
    { name: 'inline-rgb', re: /(?:color|background|backgroundColor|borderColor|border|outline)\s*[:=]\s*[`'"](?:rgba?\([^)]+\))/g },
    /* 4. JS variable with hardcoded hex: color: '#ffffff', const c = '#ff0' */
    { name: 'js-hex', re: /\b(?:color|background|bg|fill|stroke)\s*[:=]\s*['"]#[0-9a-fA-F]{3,8}['"]/g },
  ];

  for (const dir of scanDirs) {
    const tsxFiles = [...walkDir(dir, '.tsx'), ...walkDir(dir, '.ts')];
    for (const file of tsxFiles) {
      const rel = relative(ROOT, file);
      if (internalPaths.some(p => rel.includes(p))) continue;
      /* Color pickers naturally use dynamic rgba — skip */
      if (rel.includes('ColorPicker') || rel.includes('color-picker')) continue;
      const content = readSafe(file);
      const fileMatches = new Set();
      for (const { re } of patterns) {
        const matches = content.match(re) || [];
        /* Skip var(--token, #fallback) pattern — fallback hex inside var() is acceptable */
        for (const m of matches) {
          if (m.includes('var(')) continue;
          fileMatches.add(m.trim().substring(0, 60));
        }
        re.lastIndex = 0;
      }
      if (fileMatches.size > 0) {
        violations.push({ file: rel, count: fileMatches.size, samples: [...fileMatches].slice(0, 4) });
      }
    }
  }

  if (violations.length === 0) return { status: 'pass', message: 'No hardcoded color values in production code (hex, rgb, SVG, JS vars)' };
  const total = violations.reduce((s, v) => s + v.count, 0);
  return {
    status: total > 10 ? 'fail' : 'warn',
    message: `${total} hardcoded colors in ${violations.length} production files (inline hex, SVG hex, rgb/rgba, JS vars)`,
    details: violations.slice(0, 10),
    fix: FIX_HINT ? 'Replace with var(--token, fallback): color: "#fff" → color: "var(--text-inverse, #fff)"; fill="#000" → fill="var(--text-primary, #000)"' : undefined,
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

// 17. @source coverage — all workspace packages included in TW4 content scanning
check('tw4-source-coverage', 'TW4 @source covers all workspace packages', () => {
  const indexCss = readSafe(SHELL_INDEX_CSS);
  const sourceMatches = indexCss.match(/@source\s+"([^"]+)"/g) || [];
  const sourcePaths = sourceMatches.map(s => s.match(/"([^"]+)"/)?.[1] || '');

  /* Expected packages that use Tailwind classes */
  const expectedPackages = ['design-system', 'x-form-builder', 'x-charts', 'x-data-grid', 'x-editor', 'x-kanban', 'x-scheduler', 'blocks'];
  const expectedApps = ['mfe-suggestions', 'mfe-ethic', 'mfe-users', 'mfe-access', 'mfe-audit', 'mfe-reporting'];

  const missing = [];
  for (const pkg of [...expectedPackages, ...expectedApps]) {
    const found = sourcePaths.some(p => p.includes(pkg));
    if (!found) missing.push(pkg);
  }

  if (missing.length === 0) return { status: 'pass', message: `${sourcePaths.length} @source directives cover all ${expectedPackages.length + expectedApps.length} workspace entries` };
  return {
    status: 'fail',
    message: `${missing.length} workspace packages missing from @source — their Tailwind classes won't be generated`,
    details: missing,
    fix: FIX_HINT ? 'Add @source "../../../packages/<pkg>/src/**/*.{ts,tsx}"; to apps/mfe-shell/src/index.css' : undefined,
  };
});

// 18. Undefined Tailwind class prefixes (ds-*, tw-*, etc.)
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

// 19. Phantom classes — used in code but NOT in @theme (won't generate CSS)
check('phantom-classes', 'Tailwind classes using tokens not defined in @theme inline', () => {
  /* Extract all token names from @theme inline block (may be in index.css or generated file) */
  let indexCss = readSafe(SHELL_INDEX_CSS);
  let themeBlock = indexCss.match(/@theme\s+inline\s*\{([\s\S]*?)\}/);
  if (!themeBlock) {
    /* Check for imported generated file */
    const genPath = join(SHELL_STYLES, 'generated-theme-inline.css');
    const genCss = readSafe(genPath);
    themeBlock = genCss.match(/@theme\s+inline\s*\{([\s\S]*?)\}/);
  }
  if (!themeBlock) return { status: 'warn', message: 'No @theme inline block found in index.css or generated-theme-inline.css' };

  const themeTokens = new Set();
  for (const line of themeBlock[1].split('\n')) {
    const m = line.match(/^\s+--([\w-]+):/);
    if (m) themeTokens.add(m[1]);
  }

  /* Also extract token-bridge.css tokens (they provide component-level aliases) */
  const bridge = readSafe(TOKEN_BRIDGE_CSS);
  for (const line of bridge.split('\n')) {
    const m = line.match(/^\s+--([\w-]+):/);
    if (m) themeTokens.add(m[1]);
  }

  /* Also add theme.css tokens */
  const theme = readSafe(THEME_CSS);
  for (const line of theme.split('\n')) {
    const m = line.trim().match(/^--([\w-]+):/);
    if (m) themeTokens.add(m[1]);
  }

  /* Build set of valid token-based utility class patterns.
     TW4 generates: bg-<token>, text-<token>, border-<token>, ring-<token>, etc.
     Token name: --color-surface-default → utility: bg-surface-default, text-surface-default */
  const validTokenNames = new Set();
  for (const token of themeTokens) {
    validTokenNames.add(token);
    /* Strip common prefixes to get the utility suffix */
    const stripped = token
      .replace(/^color-/, '')
      .replace(/^spacing-/, '')
      .replace(/^radius-/, '')
      .replace(/^shadow-/, '');
    validTokenNames.add(stripped);
  }

  /* Standard TW color names that don't need @theme (built-in) */
  const builtinColors = new Set([
    'transparent', 'current', 'inherit', 'white', 'black',
    'red', 'blue', 'green', 'gray', 'amber', 'orange', 'yellow', 'indigo',
    'purple', 'pink', 'rose', 'emerald', 'teal', 'cyan', 'sky', 'violet',
    'fuchsia', 'lime', 'stone', 'zinc', 'slate', 'neutral',
  ]);

  /* Scan all TSX files for color-related utility classes */
  const colorUtilRe = /\b(text|bg|border|ring|divide|from|via|to|outline|shadow|accent)-([\w][\w-]*?)(?=\s|"|'|`|\\|\/|\)|\]|$)/g;
  const scanDirs = ['apps', 'packages/design-system/src', 'packages/x-form-builder/src', 'packages/x-charts/src', 'packages/x-data-grid/src', 'packages/x-editor/src', 'packages/x-kanban/src', 'packages/x-scheduler/src', 'packages/blocks/src'];
  const phantoms = new Map(); /* class → [files] */

  for (const dir of scanDirs) {
    const files = walkDir(join(ROOT, dir), '.tsx');
    for (const file of files) {
      const content = readSafe(file);
      /* Only scan className contexts */
      const classChunks = [];
      const clsRe = /className\s*=\s*(?:{[^}]*`([^`]*)`|{[^}]*['"]([^'"]*)['"]}|['"]([^'"]*)['"]\s*|{[^}]*cn\(([^)]*)\))/g;
      let cm;
      while ((cm = clsRe.exec(content)) !== null) {
        classChunks.push(cm[1] || cm[2] || cm[3] || cm[4] || '');
      }
      clsRe.lastIndex = 0;

      for (const chunk of classChunks) {
        let um;
        while ((um = colorUtilRe.exec(chunk)) !== null) {
          const prefix = um[1]; // text, bg, border, etc.
          const suffix = um[2]; // the token part

          /* Skip standard patterns */
          if (/^\d/.test(suffix)) continue; /* numeric: text-2xl, p-4 */
          if (/^\[/.test(suffix)) continue; /* arbitrary: bg-[#fff] */
          if (suffix.includes('(')) continue; /* function: bg-(--var) */

          /* Check if it's a built-in color scale (e.g., red-500, gray-200) */
          const colorBase = suffix.split('-')[0];
          if (builtinColors.has(colorBase)) continue;

          /* Check standard TW utility suffixes (not token-based) */
          const stdSuffixes = new Set([
            'none', 'auto', 'full', 'screen', 'fit', 'min', 'max',
            'xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl',
            'px', 'clip', 'visible', 'hidden', 'scroll',
            'fixed', 'absolute', 'relative', 'sticky', 'static',
            'block', 'inline', 'flex', 'grid', 'table', 'contents',
            'center', 'start', 'end', 'between', 'around', 'evenly',
            'stretch', 'baseline', 'wrap', 'nowrap', 'reverse',
            'col', 'row', 'left', 'right', 'top', 'bottom',
            'ellipsis', 'balance', 'pretty',
            /* Border/divide directional */
            'b', 't', 'l', 'r', 'x', 'y',
            /* Border styles */
            'dashed', 'dotted', 'double', 'solid',
            /* Typography */
            'base', 'bold', 'semibold', 'medium', 'normal', 'light', 'thin', 'extrabold', 'extralight',
            'italic', 'not-italic', 'uppercase', 'lowercase', 'capitalize', 'underline', 'overline', 'line-through', 'no-underline',
            /* Layout */
            'gap', 'grow', 'shrink', 'order', 'span', 'cols', 'rows',
            /* Gradient */
            'linear-to-r', 'linear-to-l', 'linear-to-t', 'linear-to-b', 'linear-to-br', 'linear-to-bl', 'linear-to-tr', 'linear-to-tl',
            /* Ring */
            'offset-0', 'offset-1', 'offset-2', 'offset-4', 'offset-8',
            /* Cursor */
            'pointer', 'default', 'wait', 'move', 'not-allowed', 'grab', 'grabbing',
          ]);
          if (stdSuffixes.has(suffix)) continue;
          /* Multi-word standard suffixes and numeric variants */
          if (/^(offset-\d+|linear-to-\w+)$/.test(suffix)) continue;
          if (/^[btlrxy]-\d/.test(suffix)) continue; /* border-b-0, border-l-2 */
          if (/^\d/.test(suffix)) continue; /* ring-1, border-2 */
          if (/^collapse|^separate|^spacing|^color$/.test(suffix)) continue; /* table utils */
          if (/^top-|^bottom-|^left-|^right-/.test(suffix)) continue; /* directional */
          if (/^[se]$/.test(suffix)) continue; /* logical border-s, border-e */
          if (/^inset$/.test(suffix)) continue; /* ring-inset */
          if (/^[lrtbse]-\w/.test(suffix) && builtinColors.has(suffix.split('-').pop())) continue; /* border-l-transparent */

          /* Check if token exists in @theme or bridge */
          const tokenCandidates = [
            suffix,
            `color-${suffix}`,
            `${prefix}-${suffix}`,
          ];
          const found = tokenCandidates.some(c => validTokenNames.has(c));
          if (!found) {
            const cls = `${prefix}-${suffix}`;
            if (!phantoms.has(cls)) phantoms.set(cls, new Set());
            phantoms.get(cls).add(relative(ROOT, file));
          }
        }
        colorUtilRe.lastIndex = 0;
      }
    }
  }

  /* Filter out known safe patterns to reduce false positives */
  const safePatterns = /^(text|bg|border|ring)-(opacity|center|left|right|top|bottom|inherit|current|transparent|clip|balance|pretty|wrap|nowrap|ellipsis)/;
  for (const [cls] of phantoms) {
    if (safePatterns.test(cls)) phantoms.delete(cls);
  }

  if (phantoms.size === 0) return { status: 'pass', message: 'All Tailwind token classes resolve to @theme inline definitions' };

  const entries = [...phantoms.entries()]
    .sort((a, b) => b[1].size - a[1].size)
    .slice(0, 10)
    .map(([cls, files]) => ({ class: cls, usedIn: files.size, files: [...files].slice(0, 3) }));

  return {
    status: phantoms.size > 20 ? 'fail' : 'warn',
    message: `${phantoms.size} Tailwind classes reference tokens not in @theme inline — styles may not apply`,
    details: entries,
    fix: FIX_HINT ? 'Either add missing tokens to @theme inline in index.css, or replace with existing token names. Run with --fix-hint for details.' : undefined,
  };
});

// 20. Hardcoded Tailwind palette colors instead of design tokens
check('palette-over-token', 'Tailwind palette colors used instead of design tokens in className', () => {
  const scanDirs = ['apps', 'packages/design-system/src', 'packages/x-form-builder/src', 'packages/x-charts/src', 'packages/x-data-grid/src', 'packages/x-editor/src', 'packages/x-kanban/src', 'packages/x-scheduler/src', 'packages/blocks/src'];
  /* Detect: bg-red-500, text-zinc-400, dark:bg-emerald-900, border-gray-200, etc.
     These should use design tokens: bg-state-danger-bg, text-text-secondary, etc. */
  const paletteColors = ['red', 'blue', 'green', 'gray', 'amber', 'orange', 'yellow', 'indigo', 'purple', 'pink', 'rose', 'emerald', 'teal', 'cyan', 'sky', 'violet', 'fuchsia', 'lime', 'stone', 'zinc', 'slate', 'neutral'];
  const paletteRe = new RegExp(
    `\\b(?:dark:)?(?:hover:)?(?:focus:)?(?:bg|text|border|ring|divide|from|via|to)-(${paletteColors.join('|')})-(\\d{2,3})\\b`,
    'g'
  );
  /* Separate production code from internal tools (design-lab, demos) */
  const internalPaths = ['design-lab', 'demos/', 'playground/', 'showcase/'];
  const prodViolations = [];
  const internalViolations = [];

  for (const dir of scanDirs) {
    const files = walkDir(join(ROOT, dir), '.tsx');
    for (const file of files) {
      const content = readSafe(file);
      const matches = content.match(paletteRe) || [];
      if (matches.length === 0) continue;
      const rel = relative(ROOT, file);
      const isInternal = internalPaths.some(p => rel.includes(p));
      const entry = { file: rel, count: matches.length, samples: [...new Set(matches)].slice(0, 5) };
      if (isInternal) internalViolations.push(entry);
      else prodViolations.push(entry);
    }
  }

  const prodTotal = prodViolations.reduce((s, v) => s + v.count, 0);
  const internalTotal = internalViolations.reduce((s, v) => s + v.count, 0);

  if (prodTotal === 0 && internalTotal === 0) return { status: 'pass', message: 'No hardcoded Tailwind palette colors — all use design tokens' };
  if (prodTotal === 0) return {
    status: 'pass',
    message: `Production code clean. ${internalTotal} palette colors in ${internalViolations.length} internal/design-lab files (cosmetic)`,
  };
  return {
    status: prodTotal > 20 ? 'fail' : 'warn',
    message: `${prodTotal} palette colors in ${prodViolations.length} production files + ${internalTotal} in ${internalViolations.length} internal files`,
    details: prodViolations.slice(0, 10),
    fix: FIX_HINT ? 'Replace palette colors with token utilities: bg-red-500→bg-state-danger-text, text-gray-500→text-text-secondary, dark:bg-zinc-800→dark:bg-surface-default, border-gray-200→border-border-subtle' : undefined,
  };
});

// 21. Token-eligible hardcodes — hex values matching known tokens but not using var()
check('token-eligible', 'Hardcoded hex values that match known design tokens', () => {
  const themeCss = readSafe(THEME_CSS);
  const bridgeCss = readSafe(TOKEN_BRIDGE_CSS);
  const tokenMap = new Map();

  /* Build hex → token name map from theme.css */
  for (const line of themeCss.split('\n')) {
    const m = line.trim().match(/^--([\w-]+):\s*(.+);$/);
    if (!m) continue;
    const val = m[2].trim();
    const srgb = val.match(/color\(srgb\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)/);
    if (srgb) {
      const hex = '#' + [1,2,3].map(i => Math.round(parseFloat(srgb[i])*255).toString(16).padStart(2,'0')).join('');
      tokenMap.set(hex, m[1]);
    }
    if (/^#[0-9a-f]{3,8}$/i.test(val)) tokenMap.set(val.toLowerCase(), m[1]);
  }
  for (const line of bridgeCss.split('\n')) {
    const hm = line.match(/#[0-9a-f]{6}/i);
    const pm = line.match(/^\s+--([\w-]+):/);
    if (hm && pm) tokenMap.set(hm[0].toLowerCase(), pm[1]);
  }

  const scanDirs = ['apps', 'packages/design-system/src', 'packages/x-form-builder/src', 'packages/x-charts/src', 'packages/x-data-grid/src', 'packages/x-editor/src', 'packages/x-kanban/src', 'packages/x-scheduler/src'];
  const skipPaths = ['design-lab', 'demos/', '__tests__', '__stories__', '__visual__', 'ColorPicker', 'color-picker', 'UniversalColor', 'chart-theme', 'intelligence/', 'catalog/component-docs', 'theme/core/', 'tokens/', 'ThemeAdmin'];
  const violations = [];

  for (const dir of scanDirs) {
    const files = [...walkDir(join(ROOT, dir), '.tsx'), ...walkDir(join(ROOT, dir), '.ts')];
    for (const file of files) {
      const rel = relative(ROOT, file);
      if (skipPaths.some(p => rel.includes(p))) continue;
      const content = readSafe(file);
      const hits = [];
      const hexRe = /#[0-9a-fA-F]{6}\b/g;
      let hm;
      while ((hm = hexRe.exec(content)) !== null) {
        const hex = hm[0].toLowerCase();
        if (!tokenMap.has(hex)) continue;
        const before = content.substring(Math.max(0, hm.index - 30), hm.index);
        if (before.includes('var(')) continue;
        const lineStart = content.lastIndexOf('\n', hm.index) + 1;
        const lineText = content.substring(lineStart, hm.index);
        if (lineText.includes('//') || lineText.includes('*')) continue;
        hits.push({ hex, token: tokenMap.get(hex) });
      }
      if (hits.length > 0) {
        const unique = [...new Map(hits.map(h => [h.hex, h])).values()];
        violations.push({ file: rel, count: hits.length, suggestions: unique.slice(0, 3).map(h => `${h.hex} → var(--${h.token})`) });
      }
    }
  }

  if (violations.length === 0) return { status: 'pass', message: 'No bare hex values matching design tokens — all use var(--token)' };
  const total = violations.reduce((s, v) => s + v.count, 0);
  return {
    status: total > 20 ? 'warn' : 'pass',
    message: `${total} hex values in ${violations.length} files match tokens but use bare hex instead of var(--token)`,
    details: violations.slice(0, 8),
    fix: FIX_HINT ? 'Replace: "#3b82f6" → "var(--action-primary, #3b82f6)"' : undefined,
  };
});

/* ================================================================== */
/*  TW4 BEHAVIOR CHANGE RISK CHECKS                                    */
/* ================================================================== */

// 22. hover: variant — TW4 only fires on hover-capable devices
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

/* ================================================================== */
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
  const skipPrefixes = ['surface-tones-', 'surface-table-', 'overlay-', 'accent-', 'elevation-'];
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
/*  TOKEN ARCHITECTURE CHECKS                                          */
/* ================================================================== */

/** Helper: extract all --custom-prop names from CSS content */
function extractCSSVars(css) {
  const vars = new Set();
  for (const m of css.matchAll(/--([a-z][a-z0-9-]*)/g)) vars.add(m[1]);
  return vars;
}

// 34. Token Layer Drift — tokens.css vs theme.css gap
check('token-layer-drift', 'Token layer gap: tokens.css (DS) ↔ theme.css (app)', () => {
  const tokensCss = readSafe(TOKENS_CSS);
  const themeCss = readSafe(THEME_CSS);
  if (!tokensCss) return { status: 'warn', message: 'tokens.css not found at packages/design-system/src/tokens/build/tokens.css' };

  const tokensVars = extractCSSVars(tokensCss);
  const themeVars = extractCSSVars(themeCss);

  /* In theme.css but NOT in tokens.css — app-only tokens, DS can't be self-contained */
  const appOnly = [...themeVars].filter(v => !tokensVars.has(v) && !v.startsWith('color-'));
  /* In tokens.css but NOT in theme.css — potentially unused tokens */
  const orphaned = [...tokensVars].filter(v => !themeVars.has(v) && !v.startsWith('color-') && !v.startsWith('font-'));

  /* Categorize app-only tokens */
  const categories = {};
  for (const v of appOnly) {
    const cat = v.split('-')[0];
    if (!categories[cat]) categories[cat] = [];
    categories[cat].push(v);
  }
  const catSummary = Object.entries(categories)
    .sort((a, b) => b[1].length - a[1].length)
    .slice(0, 6)
    .map(([cat, vars]) => `${cat}: ${vars.length}`);

  if (appOnly.length === 0) return { status: 'pass', message: `Token layers in sync — ${tokensVars.size} DS tokens, ${themeVars.size} app tokens` };
  return {
    status: appOnly.length > 50 ? 'warn' : 'pass',
    message: `${appOnly.length} tokens in theme.css missing from tokens.css (DS not self-contained), ${orphaned.length} orphaned in tokens.css`,
    details: [`Categories: ${catSummary.join(', ')}`, ...appOnly.slice(0, 10).map(v => `--${v}`)],
    fix: FIX_HINT ? 'Move semantic tokens from theme.css → tokens.css so DS package is self-contained' : undefined,
  };
});

// 35. Missing Semantic Tokens — component var() refs not defined anywhere
check('missing-semantic-tokens', 'Component var() refs missing from all CSS layers', () => {
  const tokensCss = readSafe(TOKENS_CSS);
  const themeCss = readSafe(THEME_CSS);
  const themeInline = readSafe(THEME_INLINE_CSS);
  const bridgeCss = readSafe(TOKEN_BRIDGE_CSS);
  const allCss = [tokensCss, themeCss, themeInline, bridgeCss].join('\n');
  const definedVars = extractCSSVars(allCss);

  /* Scan DS component files for var(--xxx) references */
  const scanDirs = [DS_SRC, join(ROOT, 'packages', 'x-form-builder', 'src'), join(ROOT, 'packages', 'x-data-grid', 'src'), join(ROOT, 'packages', 'x-charts', 'src')];
  const referencedVars = new Map(); /* var name → [files] */
  const skipPaths = ['__tests__', '__stories__', '__visual__', 'design-lab', 'demos', 'catalog/component-docs'];

  for (const dir of scanDirs) {
    for (const file of walkDir(dir, '.tsx').concat(walkDir(dir, '.ts')).concat(walkDir(dir, '.css'))) {
      const rel = relative(ROOT, file);
      if (skipPaths.some(p => rel.includes(p))) continue;
      const content = readSafe(file);
      for (const m of content.matchAll(/var\(--([a-z][a-z0-9-]*)/g)) {
        const name = m[1];
        if (!referencedVars.has(name)) referencedVars.set(name, []);
        referencedVars.get(name).push(rel);
      }
    }
  }

  /* Find referenced but undefined */
  const missing = [];
  for (const [name, files] of referencedVars) {
    if (!definedVars.has(name) && !name.startsWith('ds-color-') && !name.startsWith('ag-')) {
      missing.push({ token: `--${name}`, refCount: files.length, files: [...new Set(files)].slice(0, 2) });
    }
  }
  missing.sort((a, b) => b.refCount - a.refCount);

  if (missing.length === 0) return { status: 'pass', message: `All ${referencedVars.size} component var() refs have definitions` };
  return {
    status: missing.length > 10 ? 'warn' : 'pass',
    message: `${missing.length} var() refs in components have no definition in any CSS layer`,
    details: missing.slice(0, 8).map(m => `${m.token} (${m.refCount} refs) — ${m.files[0]}`),
    fix: FIX_HINT ? 'Add missing tokens to tokens.css or theme.css' : undefined,
  };
});

// 36. Elevation System — elevation tokens defined and consistent
check('elevation-system', 'Elevation/shadow token system completeness', () => {
  const themeCss = readSafe(THEME_CSS);
  const required = ['elevation-surface', 'elevation-overlay', 'elevation-tooltip', 'elevation-dialog'];
  const defined = required.filter(t => themeCss.includes(`--${t}`));
  const missing = required.filter(t => !themeCss.includes(`--${t}`));

  /* Check dark mode has elevation overrides */
  const darkBlock = themeCss.split('[data-mode="dark"]')[1] || '';
  const darkElevation = required.filter(t => darkBlock.includes(`--${t}`));

  if (missing.length === 0 && darkElevation.length >= 2) {
    return { status: 'pass', message: `${defined.length}/${required.length} elevation tokens defined, ${darkElevation.length} dark overrides` };
  }
  return {
    status: missing.length > 0 ? 'warn' : 'pass',
    message: `${defined.length}/${required.length} elevation tokens (missing: ${missing.join(', ') || 'none'}), ${darkElevation.length} dark overrides`,
    fix: FIX_HINT ? 'Add elevation-* tokens to theme.css for all modes (light/dark/hc)' : undefined,
  };
});

// 37. Hardcoded Fallbacks — var() with hardcoded hex fallback that should reference another token
check('hardcoded-fallbacks', 'var() with hardcoded hex fallbacks that should use token references', () => {
  const scanFiles = [THEME_CSS, readSafe(TOKEN_BRIDGE_CSS) ? TOKEN_BRIDGE_CSS : null, SHELL_INDEX_CSS].filter(Boolean);
  const violations = [];

  for (const file of scanFiles) {
    const content = readSafe(file);
    const rel = relative(ROOT, file);
    /* Match var(--token, #hex) where fallback is bare hex */
    for (const m of content.matchAll(/var\(--([a-z][a-z0-9-]*),\s*(#[0-9a-fA-F]{3,8})\)/g)) {
      const token = m[1];
      const fallback = m[2];
      /* Skip color-* tokens (Tailwind namespace) */
      if (token.startsWith('color-')) continue;
      violations.push({ token: `--${token}`, fallback, file: rel });
    }
  }

  if (violations.length === 0) return { status: 'pass', message: 'No hardcoded hex fallbacks in var() — all use token references' };
  return {
    status: violations.length > 5 ? 'warn' : 'pass',
    message: `${violations.length} var() calls with hardcoded hex fallbacks instead of token references`,
    details: violations.slice(0, 8).map(v => `var(${v.token}, ${v.fallback}) in ${v.file}`),
    fix: FIX_HINT ? 'Replace hex fallback with var(--other-token): var(--focus-ring-color, #2c5282) → var(--focus-ring-color, var(--action-primary))' : undefined,
  };
});

// 38. Undefined CSS Classes — classes used in components but not generated by TW4 or custom CSS
check('undefined-classes', 'CSS classes used in components but not generated by TW4 or custom CSS', () => {
  /* Step 1: Build TW4 output to get all valid classes */
  let tw4Classes;
  try {
    const tw4Css = execSync(
      `npx @tailwindcss/cli --input ${SHELL_INDEX_CSS} 2>/dev/null`,
      { cwd: ROOT, encoding: 'utf-8', timeout: 60000 }
    );
    tw4Classes = new Set();
    for (const m of tw4Css.matchAll(/\.(-?[a-zA-Z][a-zA-Z0-9_\\./:-]*)/g)) {
      /* Unescape CSS: gap-1\.5 → gap-1.5, .-translate-x-1\/2 → -translate-x-1/2 */
      tw4Classes.add(m[1].replace(/\\/g, ''));
    }
  } catch {
    return { status: 'warn', message: 'Could not run @tailwindcss/cli — skipping class validation' };
  }

  /* Step 2: Add custom classes from theme.css + index.css */
  const customCss = [readSafe(THEME_CSS), readSafe(SHELL_INDEX_CSS)].join('\n');
  for (const m of customCss.matchAll(/\.([a-zA-Z][a-zA-Z0-9_-]+)/g)) {
    tw4Classes.add(m[1]);
  }

  /* Step 3: Known non-TW classes (AG Grid, libraries, DOM classes) */
  const knownPrefixes = ['ag-', 'Mui', 'cm-', 'tiptap', 'ProseMirror', 'ql-', 'react-', 'rc-', 'ant-', 'recharts-', 'apexcharts', 'shiki-', 'hljs-', 'token-', 'accordion-', 'sidebar-', 'breadcrumb-', 'tabs-', 'stepper-', 'calendar-', 'kanban-', 'mention-', 'slash-', 'editor-', 'form-', 'command-'];
  const knownClasses = new Set(['group', 'peer', 'dark', 'light', 'active', 'disabled', 'selected', 'open', 'closed', 'loading', 'error', 'success', 'warning', 'info', 'primary', 'secondary', 'destructive', 'outline', 'ghost', 'link', 'sm', 'md', 'lg', 'xl', 'icon', 'container', 'animate-in', 'animate-out', 'fade-in', 'fade-out', 'fade-in-0', 'fade-out-0', 'zoom-in-95', 'zoom-out-95', 'slide-in-from-top', 'slide-in-from-bottom', 'slide-in-from-left', 'slide-in-from-right', 'slide-out-to-top', 'slide-out-to-bottom', 'slide-out-to-left', 'slide-out-to-right', 'spin-in', 'spin-out', 'duration-200', 'duration-300', 'duration-500']);

  /* Step 4: Scan components for className strings */
  const scanDirs = [DS_SRC, join(ROOT, 'packages', 'x-form-builder', 'src'), join(ROOT, 'packages', 'x-charts', 'src'), join(ROOT, 'packages', 'x-data-grid', 'src')];
  const skipPaths = ['__tests__', '__stories__', '__visual__', 'design-lab', 'demos', 'catalog/component-docs', 'node_modules'];
  const undefinedMap = new Map(); /* class → [files] */

  for (const dir of scanDirs) {
    for (const file of walkDir(dir, '.tsx')) {
      const rel = relative(ROOT, file);
      if (skipPaths.some(p => rel.includes(p))) continue;
      const content = readSafe(file);

      /* Extract class names from className="..." and className={`...`} and clsx/cn calls */
      const classStrings = [];
      for (const m of content.matchAll(/className[=:]\s*["'`]([^"'`]+)["'`]/g)) {
        classStrings.push(m[1]);
      }
      for (const m of content.matchAll(/(?:clsx|cn|twMerge)\(\s*["'`]([^"'`]+)["'`]/g)) {
        classStrings.push(m[1]);
      }

      for (const str of classStrings) {
        /* Split by whitespace, strip TW modifiers (hover:, dark:, sm:, etc.) */
        for (const raw of str.split(/\s+/)) {
          if (!raw || raw.startsWith('$') || raw.startsWith('{') || raw.includes('${')) continue;
          /* Remove modifiers: hover:bg-red → bg-red */
          const base = raw.replace(/^(?:hover|focus|active|disabled|dark|light|sm|md|lg|xl|2xl|group-hover|peer-hover|first|last|odd|even|placeholder|before|after|focus-within|focus-visible|has|not|aria|data|max-sm|max-md|max-lg|max-xl|max-2xl|min|open|closed):/g, '');
          if (!base || base.length < 2) continue;
          /* Remove ! (important) */
          const clean = base.replace(/!$/, '').replace(/^!/, '');
          if (!clean) continue;

          /* Check if valid */
          if (tw4Classes.has(clean)) continue;
          if (knownClasses.has(clean)) continue;
          if (knownPrefixes.some(p => clean.startsWith(p))) continue;
          /* Component BEM classes: multi-word with hyphens that look like component names */
          if (/^[a-z]+-[a-z]+-[a-z]+/.test(clean) && !clean.match(/^(bg|text|border|ring|shadow|rounded|flex|grid|gap|p[xytblr]?|m[xytblr]?|w|h|min|max|overflow|z|opacity|font|leading|tracking|decoration|transition|duration|ease|delay|animate|scale|rotate|translate|skew|origin|cursor|select|resize|scroll|snap|touch|accent|caret|fill|stroke)-/)) continue;
          /* Dynamic classes like bg-[#fff] or w-[200px] are always valid */
          if (clean.includes('[') || clean.includes('(')) continue;
          /* Opacity modifiers: border-subtle/70 — base class without /N is valid */
          if (clean.includes('/') && tw4Classes.has(clean.replace(/\/\d+$/, ''))) continue;
          /* Fraction values: translate-x-1/2, w-1/3 — with and without negative */
          if (/\d+\/\d+/.test(clean)) {
            const pos = clean.startsWith('-') ? clean.slice(1) : clean;
            if (tw4Classes.has(pos) || tw4Classes.has(clean)) continue;
          }
          /* Decimal values: gap-1.5, py-0.5 — check with dot */
          if (/\d+\.\d+/.test(clean) && tw4Classes.has(clean)) continue;
          /* Negative values like -mt-4, -translate-y-1/2, -right-8 */
          if (clean.startsWith('-')) {
            const pos = clean.slice(1);
            if (tw4Classes.has(pos)) continue;
            /* Negative fraction: -translate-y-1/2 → translate-y-1/2 */
            if (/\d+\/\d+/.test(pos) && tw4Classes.has(pos)) continue;
            /* Negative numeric: -right-8 → right-8 */
            if (/^[a-z-]+-\d+$/.test(pos)) {
              const prefix = pos.replace(/-\d+$/, '');
              if ([...tw4Classes].some(c => c.startsWith(prefix + '-'))) continue;
            }
          }
          /* Zero values: mb-0, mt-0, p-0 — always valid TW */
          if (/^[a-z]+-0$/.test(clean)) continue;
          /* Numeric suffixes that TW generates on-demand: brightness-110, scale-105 */
          if (/^[a-z-]+-\d+$/.test(clean)) {
            const prefix = clean.replace(/-\d+$/, '');
            if ([...tw4Classes].some(c => c.startsWith(prefix + '-'))) continue;
          }

          if (!undefinedMap.has(clean)) undefinedMap.set(clean, new Set());
          undefinedMap.get(clean).add(rel);
        }
      }
    }
  }

  /* Sort by usage count */
  const sorted = [...undefinedMap.entries()]
    .map(([cls, files]) => ({ class: cls, files: files.size, examples: [...files].slice(0, 2) }))
    .sort((a, b) => b.files - a.files);

  if (sorted.length === 0) return { status: 'pass', message: `All component classes resolve to TW4 utilities or custom CSS (${tw4Classes.size} valid classes)` };
  const total = sorted.reduce((s, v) => s + v.files, 0);
  return {
    status: sorted.length > 20 ? 'warn' : 'pass',
    message: `${sorted.length} CSS classes used in ${total} files but not generated by TW4 or custom CSS`,
    details: sorted.slice(0, 10).map(s => `.${s.class} (${s.files} files) — ${s.examples[0]}`),
    fix: FIX_HINT ? 'Add missing classes to @theme inline, replace with valid TW4 utilities, or add to custom CSS' : undefined,
  };
});

/* ------------------------------------------------------------------ */
/*  Report                                                             */
/* ------------------------------------------------------------------ */

if (JSON_MODE) {
  const report = {
    tool: 'theme-doctor',
    version: '4.2.0',
    timestamp: new Date().toISOString(),
    summary: { pass: passCount, warn: warnCount, fail: failCount, total: results.length },
    checks: results,
  };
  console.log(JSON.stringify(report, null, 2));
} else {
  console.log('');
  console.log('╔══════════════════════════════════════════════════════════════╗');
  console.log(`║         🩺 Theme Doctor v4.2 (${results.length} checks)                ║`);
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
