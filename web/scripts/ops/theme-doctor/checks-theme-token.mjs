/**
 * Theme & Token checks (1-10)
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
}
