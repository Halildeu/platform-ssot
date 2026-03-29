/**
 * TW4 Native checks (11-13)
 * Extracted from theme-doctor.mjs for maintainability.
 */

import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';

export function register(ctx) {
  const { check, readSafe, srgbToHex, parseCssVarsFlat, walkDir,
    ROOT, DS_SRC, SHELL_STYLES, SHELL_INDEX_CSS, FIGMA_PATH,
    THEME_CSS, TOKEN_BRIDGE_CSS, TOKENS_CSS, THEME_INLINE_CSS, FIX_HINT } = ctx;

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

// 13. Tailwind CSS v4 integration (Vite plugin or PostCSS)
check('postcss-tw4', 'Tailwind CSS v4 integration (@tailwindcss/vite or @tailwindcss/postcss)', () => {
  // TW4 can be integrated via Vite plugin (preferred) or PostCSS plugin
  const shellViteConfig = readSafe(join(ROOT, 'apps', 'mfe-shell', 'vite.config.ts'));
  if (shellViteConfig.includes('@tailwindcss/vite')) {
    return { status: 'pass', message: '@tailwindcss/vite plugin active in shell — PostCSS not needed' };
  }
  const config = readSafe(join(ROOT, 'postcss.config.js')) + readSafe(join(ROOT, 'postcss.config.cjs')) + readSafe(join(ROOT, 'postcss.config.mjs'));
  if (config.includes('@tailwindcss/postcss')) return { status: 'pass', message: 'PostCSS uses @tailwindcss/postcss plugin' };
  if (config.includes('tailwindcss')) return { status: 'warn', message: 'PostCSS uses legacy tailwindcss plugin — migrate to @tailwindcss/postcss or @tailwindcss/vite' };
  return { status: 'fail', message: 'No Tailwind integration found (need @tailwindcss/vite or @tailwindcss/postcss)' };
});

/* ================================================================== */
}
