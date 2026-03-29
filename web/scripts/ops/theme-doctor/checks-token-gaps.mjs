/**
 * Token Gap Detection checks (v7.1)
 * Extracted from theme-doctor.mjs for maintainability.
 */

import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';

export function register(ctx) {
  const { check, readSafe, srgbToHex, parseCssVarsFlat, walkDir,
    ROOT, DS_SRC, SHELL_STYLES, SHELL_INDEX_CSS, FIGMA_PATH,
    THEME_CSS, TOKEN_BRIDGE_CSS, TOKENS_CSS, THEME_INLINE_CSS, FIX_HINT } = ctx;

/*  TOKEN GAP DETECTION CHECKS (v7.1)                                  */
/* ================================================================== */

// 60. Token Naming Consistency — error vs danger state naming
check('token-naming-consistency', 'State token naming consistency (error vs danger)', () => {
  const tokensCss = readSafe(TOKENS_CSS);
  const themeCss = readSafe(THEME_CSS);
  const themeInline = readSafe(THEME_INLINE_CSS);

  const tokensError = [...tokensCss.matchAll(/--(state-error[\w-]*)/g)].map(m => m[1]);
  const tokensDanger = [...tokensCss.matchAll(/--(state-danger[\w-]*)/g)].map(m => m[1]);
  const themeError = [...themeCss.matchAll(/--(state-error[\w-]*)/g)].map(m => m[1]);
  const themeDanger = [...themeCss.matchAll(/--(state-danger[\w-]*)/g)].map(m => m[1]);

  /* Check if generated-theme-inline aliases error→danger */
  const hasAlias = themeInline.includes('state-error') && themeInline.includes('state-danger');

  const details = [
    `tokens.css: ${tokensError.length} --state-error-*, ${tokensDanger.length} --state-danger-*`,
    `theme.css:  ${themeError.length} --state-error-*, ${themeDanger.length} --state-danger-*`,
    `@theme inline alias: ${hasAlias ? 'yes (error→danger)' : 'no'}`,
  ];

  /* Also scan components for inconsistent usage */
  const scanDirs = [DS_SRC, join(ROOT, 'packages', 'x-form-builder', 'src')];
  let errorUsage = 0;
  let dangerUsage = 0;
  for (const dir of scanDirs) {
    for (const file of walkDir(dir, '.tsx')) {
      const content = readSafe(file);
      if (content.includes('state-error')) errorUsage++;
      if (content.includes('state-danger')) dangerUsage++;
    }
  }
  details.push(`Component usage: ${errorUsage} files use "error", ${dangerUsage} files use "danger"`);

  const bothExist = (tokensError.length > 0 || themeError.length > 0) && (tokensDanger.length > 0 || themeDanger.length > 0);
  if (!bothExist) return { status: 'pass', message: 'Consistent state token naming', details };

  /* If alias exists (error→danger) in @theme inline AND tokens.css semantic refs
     point to canonical --state-danger-*, the dual naming is properly bridged */
  const tokensSemanticRefsDanger = tokensCss.includes('--state-danger-bg') || tokensCss.includes('var(--state-danger');
  if (hasAlias && tokensSemanticRefsDanger) {
    return {
      status: 'pass',
      message: `Dual naming bridged: "danger" canonical, "error" aliased via @theme inline (${errorUsage} error, ${dangerUsage} danger usages)`,
      details,
    };
  }

  return {
    status: 'warn',
    message: `Dual naming without proper bridging: "error" (${tokensError.length + themeError.length} defs, ${errorUsage} usages) + "danger" (${tokensDanger.length + themeDanger.length} defs, ${dangerUsage} usages)`,
    details,
    fix: FIX_HINT ? 'Standardize: pick one canonical name (danger or error) and alias the other. Current @theme inline aliases error→danger — update tokens.css semantic refs to point to --state-danger-*' : undefined,
  };
});

// 61. Theme Inline Completeness — component-used tokens missing from @theme inline
check('theme-inline-completeness', 'Component-used tokens present in @theme inline for TW4 utility generation', () => {
  const themeCss = readSafe(THEME_CSS);
  const themeInline = readSafe(THEME_INLINE_CSS);
  if (!themeInline) return { status: 'warn', message: 'generated-theme-inline.css not found' };

  /* Extract all tokens covered by @theme inline:
     Both the LHS definitions (--color-action-primary → strips to "action-primary")
     and RHS var() references (var(--action-primary-bg) → "action-primary-bg") */
  const inlineCovered = new Set();
  for (const line of themeInline.split('\n')) {
    /* LHS: --color-surface-default → "surface-default" (how TW4 generates utility names) */
    const lhs = line.match(/^\s+--(color-|shadow-|ring-|radius-|spacing-|font-size-)?([\w-]+)\s*:/);
    if (lhs) inlineCovered.add(lhs[2]);
    /* RHS: var(--action-primary-bg) → "action-primary-bg" */
    for (const m of line.matchAll(/var\(--([\w-]+)/g)) inlineCovered.add(m[1]);
  }

  /* Extract all --X definitions from theme.css :root */
  const themeRootDefs = new Set();
  const rootBlock = themeCss.split('[data-mode=')[0] || '';
  for (const m of rootBlock.matchAll(/^\s+--([\w-]+)\s*:/gm)) themeRootDefs.add(m[1]);

  /* Scan components for TW class usage to find which tokens need @theme inline mapping */
  const scanDirs = [DS_SRC, join(ROOT, 'packages', 'x-form-builder', 'src'), join(ROOT, 'packages', 'x-data-grid', 'src'), join(ROOT, 'packages', 'x-charts', 'src')];
  const skipPaths = ['__tests__', '__stories__', '__visual__', 'design-lab', 'demos', 'catalog/component-docs', 'intelligence/', 'mcp/'];
  const componentTokenUsage = new Map(); /* token → file count */

  for (const dir of scanDirs) {
    for (const file of [...walkDir(dir, '.tsx'), ...walkDir(dir, '.css')]) {
      const rel = relative(ROOT, file);
      if (skipPaths.some(p => rel.includes(p))) continue;
      const content = readSafe(file);
      /* Look for Tailwind classes using token names: bg-surface-hover, text-text-tertiary, etc. */
      for (const m of content.matchAll(/\b(?:bg|text|border|ring|shadow|outline|from|via|to)-([\w][\w-]*?)(?=[\s"'`\\)/\]]|$)/g)) {
        const tokenName = m[1];
        componentTokenUsage.set(tokenName, (componentTokenUsage.get(tokenName) || 0) + 1);
      }
    }
  }

  /* Find tokens defined in theme.css and used by components but NOT covered in @theme inline */
  const semanticPrefixes = ['surface-', 'text-', 'action-', 'border-', 'state-', 'accent-', 'selection-', 'focus-', 'data-table-', 'interactive-', 'elevation-'];
  const unmapped = [];
  for (const token of themeRootDefs) {
    if (!semanticPrefixes.some(p => token.startsWith(p))) continue;
    if (inlineCovered.has(token)) continue;
    /* Check if any component uses a TW utility that would need this token */
    const usageCount = componentTokenUsage.get(token) || 0;
    if (usageCount > 0) {
      unmapped.push({ token: `--${token}`, usageCount });
    }
  }
  unmapped.sort((a, b) => b.usageCount - a.usageCount);

  if (unmapped.length === 0) return { status: 'pass', message: `All component-used tokens have @theme inline mapping (${inlineCovered.size} covered)` };
  return {
    status: unmapped.length > 5 ? 'warn' : 'pass',
    message: `${unmapped.length} tokens used by components but missing from @theme inline — TW4 utilities won't generate`,
    details: unmapped.slice(0, 10).map(u => `${u.token} (${u.usageCount} usages) — no TW4 utility`),
    fix: FIX_HINT ? 'Add missing tokens to generated-theme-inline.css @theme inline block: --color-<name>: var(--<name>);' : undefined,
  };
});

// 62. Focus Ring Hardcode — detect hardcoded hex in focus ring system
check('focus-ring-hardcode', 'Focus ring system: no hardcoded color values', () => {
  const tokensCss = readSafe(TOKENS_CSS);
  const focusRingTs = readSafe(join(ROOT, 'packages', 'design-system', 'src', 'tokens', 'focusRing.ts'));

  const violations = [];

  /* Check tokens.css for hardcoded hex in focus-ring-color */
  for (const line of tokensCss.split('\n')) {
    if (line.includes('focus-ring') && /#[0-9a-fA-F]{3,8}/.test(line)) {
      const hex = line.match(/#[0-9a-fA-F]{3,8}/)[0];
      /* Skip if hex is inside a nested var() fallback chain — only flag top-level hardcodes */
      violations.push({ file: 'tokens.css', line: line.trim(), hex });
    }
  }

  /* Check focusRing.ts for hardcoded hex */
  if (focusRingTs) {
    for (const line of focusRingTs.split('\n')) {
      const hexMatch = line.match(/#[0-9a-fA-F]{6}/);
      if (hexMatch && !line.trim().startsWith('//') && !line.trim().startsWith('*')) {
        violations.push({ file: 'focusRing.ts', line: line.trim(), hex: hexMatch[0] });
      }
    }
  }

  if (violations.length === 0) return { status: 'pass', message: 'Focus ring system uses token references only — no hardcoded hex' };
  return {
    status: 'fail',
    message: `${violations.length} hardcoded hex value(s) in focus ring system — breaks dark/HC mode`,
    details: violations.map(v => `${v.file}: ${v.hex} in "${v.line.substring(0, 80)}"`),
    fix: FIX_HINT ? 'Replace #2c5282 with var(--accent-primary) or remove fallback entirely — theme.css always defines --focus-outline' : undefined,
  };
});

}
