/**
 * Component Quality checks (14-16+)
 * Extracted from theme-doctor.mjs for maintainability.
 */

import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';

export function register(ctx) {
  const { check, readSafe, srgbToHex, parseCssVarsFlat, walkDir,
    ROOT, DS_SRC, SHELL_STYLES, SHELL_INDEX_CSS, FIGMA_PATH,
    THEME_CSS, TOKEN_BRIDGE_CSS, TOKENS_CSS, THEME_INLINE_CSS, FIX_HINT } = ctx;

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
}
