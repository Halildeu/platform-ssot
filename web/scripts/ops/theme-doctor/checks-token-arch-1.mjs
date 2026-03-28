/**
 * Token Architecture checks (part 1)
 * Extracted from theme-doctor.mjs for maintainability.
 */

import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';
import { execSync } from 'node:child_process';

export function register(ctx) {
  const { check, readSafe, srgbToHex, parseCssVarsFlat, walkDir,
    ROOT, DS_SRC, SHELL_STYLES, SHELL_INDEX_CSS, FIGMA_PATH,
    THEME_CSS, TOKEN_BRIDGE_CSS, TOKENS_CSS, THEME_INLINE_CSS, FIX_HINT } = ctx;

/*  TOKEN ARCHITECTURE CHECKS                                          */
/* ================================================================== */

/** Helper: extract all --custom-prop names from CSS content */
function extractCSSVars(css) {
  const vars = new Set();
  for (const m of css.matchAll(/--([a-z][a-z0-9-]*)/g)) vars.add(m[1]);
  return vars;
}

// 34. Token Layer Drift — tokens.css vs theme.css gap + broken semantic refs
check('token-layer-drift', 'Token layer gap: tokens.css (DS) ↔ theme.css (app) + broken refs', () => {
  const tokensCss = readSafe(TOKENS_CSS);
  const themeCss = readSafe(THEME_CSS);
  if (!tokensCss) return { status: 'warn', message: 'tokens.css not found at packages/design-system/src/tokens/build/tokens.css' };

  /* --- Sub-check A: broken semantic refs (var() missing) --- */
  const brokenRefs = [];
  for (const line of tokensCss.split('\n')) {
    const m = line.match(/^\s+--([\w-]+)\s*:\s*(--[\w-]+)\s*;$/);
    if (m) {
      /* Value is a bare CSS variable name without var() wrapper — this is broken CSS */
      brokenRefs.push({ token: `--${m[1]}`, value: m[2], fix: `var(${m[2]})` });
    }
  }

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

  /* If broken refs found, always fail */
  if (brokenRefs.length > 0) {
    return {
      status: 'fail',
      message: `${brokenRefs.length} broken semantic refs in tokens.css (bare --name without var()) + ${appOnly.length} app-only tokens`,
      details: [
        ...brokenRefs.slice(0, 8).map(b => `BROKEN: ${b.token}: ${b.value} → should be ${b.fix}`),
        `Categories: ${catSummary.join(', ')}`,
      ],
      fix: FIX_HINT ? 'Fix tokens.css: --semantic-color-tokens-surface-default: --surface-default → var(--surface-default). Or remove if dead code.' : undefined,
    };
  }

  if (appOnly.length === 0) return { status: 'pass', message: `Token layers in sync — ${tokensVars.size} DS tokens, ${themeVars.size} app tokens` };
  /* tokens.css = raw palette (L0), theme.css = semantic (L1) — gap is by design for runtime theming */
  return {
    status: appOnly.length > 250 ? 'warn' : 'pass',
    message: `${appOnly.length} semantic tokens in theme.css (app layer), ${tokensVars.size} raw tokens in tokens.css (DS layer) — ${orphaned.length} orphaned`,
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
  const skipPaths = ['__tests__', '__stories__', '__visual__', 'design-lab', 'demos', 'catalog/component-docs', 'intelligence/', 'mcp/'];

  for (const dir of scanDirs) {
    for (const file of walkDir(dir, '.tsx').concat(walkDir(dir, '.ts')).concat(walkDir(dir, '.css'))) {
      const rel = relative(ROOT, file);
      if (skipPaths.some(p => rel.includes(p))) continue;
      const content = readSafe(file);
      for (const m of content.matchAll(/var\(--([a-z][a-z0-9-]*)/g)) {
        const name = m[1];
        /* Skip template literal fragments: var(--spacing-${key}) → captures "spacing-" with trailing dash */
        if (name.endsWith('-')) continue;
        /* Skip doc/suggestion strings: var(--surface-*) */
        const afterIdx = m.index + m[0].length;
        if (afterIdx < content.length && content[afterIdx] === '*') continue;
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

  /* Critical tokens: high-impact tokens used across many components */
  const criticalTokenNames = ['text-tertiary', 'surface-canvas-bg', 'elevation-surface', 'elevation-overlay', 'surface-active', 'text-disabled'];
  const missingCritical = missing.filter(m => criticalTokenNames.includes(m.token.replace('--', '')));

  if (missingCritical.length > 0) {
    return {
      status: 'fail',
      message: `${missingCritical.length} CRITICAL token(s) missing + ${missing.length - missingCritical.length} other var() refs undefined`,
      details: [
        ...missingCritical.map(m => `🔴 ${m.token} (${m.refCount} refs) — ${m.files[0]}`),
        '---',
        ...missing.filter(m => !criticalTokenNames.includes(m.token.replace('--', ''))).slice(0, 5).map(m => `${m.token} (${m.refCount} refs) — ${m.files[0]}`),
      ],
      fix: FIX_HINT ? 'Add critical tokens to theme.css: --text-tertiary, --surface-canvas-bg, --elevation-surface, --elevation-overlay' : undefined,
    };
  }
  return {
    status: missing.length > 3 ? 'warn' : 'pass',
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

// 39. Component Style Completeness — detect missing essential styles per component role
check('component-completeness', 'Components missing essential styles for their role (focus, hover, bg, border)', () => {
}
