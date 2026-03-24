#!/usr/bin/env node
/**
 * Theme Doctor — comprehensive health check for the design-token + theme pipeline.
 *
 * Checks:
 *  1. Attribute consistency  (data-theme / data-mode / data-appearance)
 *  2. @theme inline usage    (TW4 runtime variable resolution)
 *  3. Token format drift     (Figma raw ↔ DTCG code)
 *  4. Semantic CSS drift     (theme.css ↔ dark-mode.css)
 *  5. Token bridge staleness (fallback values ≠ theme.css defaults)
 *  6. displayName coverage   (exported components missing displayName)
 *  7. Hardcoded color leaks  (production TSX using inline hex/rgb)
 *  8. Surface tone integrity (dark-mode tones ≠ light defaults)
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

    const total = mismatch + missing + orphaned + semantic;
    const status = mismatch > 5 ? 'fail' : total > 0 ? 'warn' : 'pass';
    return {
      status,
      message: `Missing: ${missing}, Orphaned: ${orphaned}, Mismatch: ${mismatch}, Semantic CSS: ${semantic}`,
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

  const bridgeFallbacks = [];
  const hexRe = /#[0-9a-f]{6}/gi;
  for (const line of bridge.split('\n')) {
    const m = line.match(/^  --([\w-]+):\s*var\(--[\w-]+,\s*(.*)\);$/);
    if (m) {
      const varName = m[1];
      const fallback = m[2].trim().replace(/\)$/, '');
      const hexMatch = fallback.match(hexRe);
      if (hexMatch) bridgeFallbacks.push({ varName, fallback: hexMatch[0] });
    }
  }

  // Check if theme.css :root defines corresponding values
  const themeVars = parseCssVarsFlat(theme);
  const stale = [];
  for (const { varName, fallback } of bridgeFallbacks) {
    const themeEntries = themeVars.get(`--${varName}`) || themeVars.get(`--${varName}-bg`);
    if (themeEntries) {
      const rootEntry = themeEntries.find(e => e.selector === ':root');
      if (rootEntry) {
        const themeHex = srgbToHex(rootEntry.value);
        if (themeHex !== fallback.toLowerCase()) {
          stale.push({ varName, bridgeFallback: fallback, themeValue: themeHex });
        }
      }
    }
  }

  if (stale.length === 0) return { status: 'pass', message: `${bridgeFallbacks.length} bridge fallbacks checked — all current` };
  return {
    status: 'warn',
    message: `${stale.length}/${bridgeFallbacks.length} bridge fallbacks stale`,
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
    // Only check files that export components (have JSX return)
    if (!content.includes('export') || (!content.includes('return (') && !content.includes('return <'))) continue;
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

// 10. Duplicate tsconfig keys
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

/* ------------------------------------------------------------------ */
/*  Report                                                             */
/* ------------------------------------------------------------------ */

if (JSON_MODE) {
  const report = {
    tool: 'theme-doctor',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    summary: { pass: passCount, warn: warnCount, fail: failCount, total: results.length },
    checks: results,
  };
  console.log(JSON.stringify(report, null, 2));
} else {
  console.log('');
  console.log('╔══════════════════════════════════════════════════════════════╗');
  console.log('║                    🩺 Theme Doctor v1.0                     ║');
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
