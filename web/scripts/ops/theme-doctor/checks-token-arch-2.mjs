/**
 * Token Architecture checks (part 2)
 * Extracted from theme-doctor.mjs for maintainability.
 */

import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';

export function register(ctx) {
  const { check, readSafe, srgbToHex, parseCssVarsFlat, walkDir,
    ROOT, DS_SRC, SHELL_STYLES, SHELL_INDEX_CSS, FIGMA_PATH,
    THEME_CSS, TOKEN_BRIDGE_CSS, TOKENS_CSS, THEME_INLINE_CSS, FIX_HINT } = ctx;

  /*
   * Role detection: infer component role from file name/content,
   * then check if essential classes/tokens are present.
   *
   * Roles:
   *  - interactive: button, link, toggle, switch → needs focus ring + hover state
   *  - input: text input, select, textarea, combobox → needs border + focus ring + placeholder
   *  - surface: card, panel, dialog, modal, popover → needs bg-surface-* + rounded + shadow
   *  - data-display: table, list, grid → needs border-border-* + hover row
   *  - feedback: alert, toast, banner → needs bg-state-* + border-state-* + text-state-*
   */
// 39. Component Style Completeness — detect missing essential styles per component role
check('component-style-completeness', 'Components have essential styles for their role (focus, hover, bg, border)', () => {
  const rolePatterns = [
    {
      role: 'interactive',
      fileMatch: /Button|Toggle|Switch|Chip|Tag|MenuItem|NavItem|Trigger|TabItem/,
      contentMatch: null, /* Only match by filename — <button> in content is too broad */
      required: [
        { name: 'focus-ring', patterns: [/focus:ring|focus-visible:ring|focus:outline|ring-.*focus|outline-.*focus|focusRing|focus-visible:/] },
        { name: 'hover-state', patterns: [/hover:|onMouseEnter/] },
        { name: 'cursor', patterns: [/cursor-pointer|cursor-|disabled:cursor/] },
      ],
    },
    {
      role: 'input',
      fileMatch: /TextInput|TextArea|Select(?!ion)|Combobox|Autocomplete|DatePicker|TimePicker|SearchInput|NumberInput/i,
      contentMatch: /<input[\s>]|<textarea[\s>]|<select[\s>]|type=["']text["']|type=["']number["']/,
      required: [
        { name: 'border', patterns: [/border-border|border-input|border-|borderColor/] },
        { name: 'focus-ring', patterns: [/focus:ring|focus-visible:ring|focus:border|focus:outline|focusRing|focus-visible:/] },
        { name: 'rounded', patterns: [/rounded/] },
      ],
    },
    {
      role: 'surface',
      fileMatch: /Card|Panel|Dialog|Modal|Popover|Tooltip|Drawer|Sheet|Dropdown(?!Item)/i,
      contentMatch: /role=["']dialog["']|role=["']tooltip["']|aria-modal/,
      required: [
        { name: 'background', patterns: [/bg-surface|bg-white|bg-card|backgroundColor|background-color/] },
        { name: 'rounded', patterns: [/rounded/] },
        { name: 'shadow-or-border', patterns: [/shadow|border-border|border-|boxShadow|elevation/] },
      ],
    },
    {
      role: 'feedback',
      fileMatch: /Alert|Toast|Banner|Notification|Callout|StatusBadge/,
      contentMatch: null, /* Only match by filename — aria-live in Calendar/Carousel is not feedback */
      required: [
        { name: 'state-bg', patterns: [/bg-state|bg-success|bg-warning|bg-error|bg-info|bg-destructive|variant.*success|variant.*warning|variant.*error/] },
        { name: 'state-border', patterns: [/border-state|border-success|border-warning|border-error|border-info|variant/] },
      ],
    },
  ];

  const scanDirs = [
    join(DS_SRC, 'components'),
    join(DS_SRC, 'enterprise'),
    join(DS_SRC, 'advanced'),
    join(ROOT, 'packages', 'x-form-builder', 'src'),
  ];
  const skipPaths = ['__tests__', '__stories__', '__visual__', 'design-lab', 'demos', 'index.ts', 'index.tsx', 'types.ts', 'utils.ts', 'constants.ts', 'hooks'];
  const violations = [];

  for (const dir of scanDirs) {
    for (const file of walkDir(dir, '.tsx')) {
      const rel = relative(ROOT, file);
      const fileName = file.split('/').pop();
      if (skipPaths.some(p => rel.includes(p))) continue;
      if (fileName.startsWith('use') || fileName.endsWith('.types.tsx')) continue;

      const content = readSafe(file);
      /* Skip files with no className (pure logic/hooks) */
      if (!content.includes('className')) continue;

      for (const roleDef of rolePatterns) {
        /* Match role by filename OR content (if contentMatch defined) */
        const nameMatch = roleDef.fileMatch.test(fileName);
        const contentMatchResult = roleDef.contentMatch ? roleDef.contentMatch.test(content) : false;
        if (!nameMatch && !contentMatchResult) continue;

        /* Check required patterns */
        const missing = [];
        for (const req of roleDef.required) {
          const found = req.patterns.some(p => p.test(content));
          if (!found) missing.push(req.name);
        }

        if (missing.length > 0) {
          violations.push({
            file: rel,
            component: fileName.replace('.tsx', ''),
            role: roleDef.role,
            missing,
          });
        }
        break; /* First matching role wins */
      }
    }
  }

  if (violations.length === 0) {
    return { status: 'pass', message: 'All components have essential styles for their detected role' };
  }

  /* Group by missing style type */
  const byMissing = {};
  for (const v of violations) {
    for (const m of v.missing) {
      if (!byMissing[m]) byMissing[m] = [];
      byMissing[m].push(v.component);
    }
  }
  const summary = Object.entries(byMissing)
    .sort((a, b) => b[1].length - a[1].length)
    .map(([style, comps]) => `${style}: ${comps.length} components`);

  return {
    status: violations.length > 15 ? 'warn' : 'pass',
    message: `${violations.length} components missing essential styles for their role`,
    details: [
      ...summary,
      '---',
      ...violations.slice(0, 8).map(v => `[${v.role}] ${v.component}: missing ${v.missing.join(', ')}`),
    ],
    fix: FIX_HINT ? 'Add missing styles: interactive→focus:ring-2+hover:bg-*, input→border+focus:ring, surface→bg-surface-*+rounded+shadow, feedback→bg-state-*+border-state-*' : undefined,
  };
});

// 40. Dark Mode Readiness — components using token-based colors vs hardcoded/missing
check('dark-mode-readiness', 'Component dark mode readiness (token coverage vs hardcoded/transparent)', () => {
  const scanDirs = [
    join(DS_SRC, 'components'),
    join(DS_SRC, 'enterprise'),
    join(ROOT, 'packages', 'x-form-builder', 'src'),
    join(ROOT, 'packages', 'x-charts', 'src'),
    join(ROOT, 'packages', 'x-data-grid', 'src'),
  ];
  const skipPaths = ['__tests__', '__stories__', '__visual__', 'design-lab', 'demos', 'index.ts', 'index.tsx', 'types.ts', 'utils.ts', 'constants.ts', 'hooks', '.figma.'];
  const paletteRe = /(?:bg|text|border|ring|shadow|outline|fill|stroke)-(?:white|black|gray|slate|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\d/;
  const tokenBgRe = /bg-surface|bg-action|bg-state|bg-overlay|bg-accent|bg-card/;
  const tokenTextRe = /text-text-|text-action-|text-state-|text-accent/;
  const hasRenderedOutput = /className|style=/;

  const stats = { total: 0, tokenBased: 0, noBg: [], palette: [], noText: [] };

  for (const dir of scanDirs) {
    for (const file of walkDir(dir, '.tsx')) {
      const rel = relative(ROOT, file);
      const name = file.split('/').pop().replace('.tsx', '');
      if (skipPaths.some(p => rel.includes(p))) continue;
      if (name.startsWith('use') || name.endsWith('.types')) continue;

      const content = readSafe(file);
      if (!hasRenderedOutput.test(content)) continue;
      stats.total++;

      /* Check for palette colors (won't adapt to dark) */
      if (paletteRe.test(content)) stats.palette.push(name);

      /* Check for token-based bg */
      if (!tokenBgRe.test(content) && !content.includes('var(--surface') && !content.includes('var(--color-surface') && !content.includes('bg-[')) {
        stats.noBg.push(name);
      } else {
        stats.tokenBased++;
      }

      /* Check for token-based text */
      if (!tokenTextRe.test(content) && !content.includes('var(--text-') && !content.includes('var(--color-text-') && !content.includes('text-[')) {
        stats.noText.push(name);
      }
    }
  }

  const coverage = stats.total > 0 ? Math.round((stats.tokenBased / stats.total) * 100) : 0;
  const details = [];
  if (stats.palette.length > 0) details.push(`Palette colors (won't adapt): ${stats.palette.slice(0, 5).join(', ')}${stats.palette.length > 5 ? ` +${stats.palette.length - 5} more` : ''}`);
  if (stats.noBg.length > 0) details.push(`No bg-surface token (transparent in dark): ${stats.noBg.slice(0, 5).join(', ')}${stats.noBg.length > 5 ? ` +${stats.noBg.length - 5} more` : ''}`);
  if (stats.noText.length > 0) details.push(`No text-text token (inherit in dark): ${stats.noText.slice(0, 5).join(', ')}${stats.noText.length > 5 ? ` +${stats.noText.length - 5} more` : ''}`);

  /* ≥75% coverage + 0 palette = pass (remaining are intentionally transparent: sidebar subs, charts, inline) */
  if (stats.palette.length === 0 && coverage >= 75) {
    return { status: 'pass', message: `${coverage}% dark-ready (${stats.tokenBased}/${stats.total} with token bg), 0 palette hardcodes, ${stats.noBg.length} intentionally transparent` };
  }
  return {
    status: stats.palette.length > 0 || coverage < 70 ? 'warn' : 'pass',
    message: `${coverage}% dark-ready, ${stats.palette.length} palette hardcodes, ${stats.noBg.length} missing bg token, ${stats.noText.length} missing text token`,
    details,
    fix: FIX_HINT ? 'Replace palette colors with tokens: bg-gray-100→bg-surface-muted, text-gray-600→text-text-secondary. Add bg-surface-* to transparent components.' : undefined,
  };
});

// 41. High Contrast Readiness — forced-colors, prefers-contrast, border visibility
check('high-contrast-readiness', 'High contrast / forced-colors mode support', () => {
  const scanDirs = [DS_SRC, join(ROOT, 'packages', 'x-form-builder', 'src')];
  const skipPaths = ['__tests__', '__stories__', '__visual__', 'design-lab', 'demos'];

  let totalComponents = 0;
  let hasForcedColors = 0;
  let hasPrefersContrast = 0;
  let hasTransparentBorder = 0;
  const interactiveWithout = [];

  /* Check CSS files for forced-colors */
  const themeCss = readSafe(THEME_CSS);
  const indexCss = readSafe(SHELL_INDEX_CSS);
  const allCss = themeCss + indexCss;
  const hasForcedColorsGlobal = allCss.includes('forced-colors');
  const hasPrefersContrastGlobal = allCss.includes('prefers-contrast');
  const hasHcTheme = themeCss.includes('serban-hc') || themeCss.includes('high-contrast');

  /* Check interactive components for transparent border trick */
  const interactiveFiles = /Button|Toggle|Switch|Chip|Tag|Input|Select|Checkbox|Radio/;

  for (const dir of scanDirs) {
    for (const file of walkDir(dir, '.tsx')) {
      const rel = relative(ROOT, file);
      const name = file.split('/').pop().replace('.tsx', '');
      if (skipPaths.some(p => rel.includes(p))) continue;
      if (name.startsWith('use') || name.endsWith('.types') || name === 'index') continue;

      const content = readSafe(file);
      if (!content.includes('className')) continue;
      totalComponents++;

      if (content.includes('forced-colors')) hasForcedColors++;
      if (content.includes('prefers-contrast')) hasPrefersContrast++;
      if (content.includes('border-transparent') || content.includes('border border-')) hasTransparentBorder++;

      /* Interactive components should have visible borders for HC */
      if (interactiveFiles.test(name)) {
        const hasBorder = /border-border|border-input|border-action|border-state|border-transparent/.test(content);
        if (!hasBorder) interactiveWithout.push(name);
      }
    }
  }

  const details = [];
  details.push(`Global: HC theme=${hasHcTheme ? 'yes' : 'NO'}, forced-colors=${hasForcedColorsGlobal ? 'yes' : 'NO'}, prefers-contrast=${hasPrefersContrastGlobal ? 'yes' : 'NO'}`);
  details.push(`Components: ${hasForcedColors} use forced-colors, ${hasPrefersContrast} use prefers-contrast, ${hasTransparentBorder} use border-transparent trick`);
  if (interactiveWithout.length > 0) {
    details.push(`Interactive without border: ${interactiveWithout.slice(0, 6).join(', ')}${interactiveWithout.length > 6 ? ` +${interactiveWithout.length - 6} more` : ''}`);
  }

  if (hasHcTheme && (hasForcedColorsGlobal || interactiveWithout.length <= 3)) {
    return { status: 'pass', message: `HC theme present, ${hasForcedColors}/${totalComponents} forced-colors aware, ${interactiveWithout.length} interactive without border`, details };
  }
  return {
    status: 'warn',
    message: `HC gaps: ${!hasHcTheme ? 'no HC theme, ' : ''}${interactiveWithout.length} interactive without border, ${hasForcedColors} forced-colors aware`,
    details,
    fix: FIX_HINT ? 'Add border-transparent to interactive components (visible in forced-colors), add @media (forced-colors: active) overrides' : undefined,
  };
});

// 42. Theme Mode Coverage — check all 4 modes have token overrides in theme.css
check('theme-mode-coverage', 'All theme modes (light/dark/HC/compact) have complete token overrides', () => {
  const themeCss = readSafe(THEME_CSS);

  /* Extract mode blocks */
  const modes = {
    light: { selector: ':root', tokens: new Set() },
    dark: { selector: '[data-mode="dark"]', tokens: new Set() },
    hc: { selector: 'serban-hc', tokens: new Set() },
    compact: { selector: 'compact', tokens: new Set() },
  };

  /* Parse :root tokens */
  const rootBlock = themeCss.split('[data-mode=')[0] || '';
  for (const m of rootBlock.matchAll(/--([a-z][a-z0-9-]+)\s*:/g)) modes.light.tokens.add(m[1]);

  /* Parse dark tokens */
  const darkMatch = themeCss.match(/\[data-mode="dark"\]\s*\{([^}]+)\}/s);
  if (darkMatch) {
    for (const m of darkMatch[1].matchAll(/--([a-z][a-z0-9-]+)\s*:/g)) modes.dark.tokens.add(m[1]);
  }

  /* Parse HC tokens */
  const hcMatch = themeCss.match(/serban-hc[^{]*\{([^}]+)\}/s);
  if (hcMatch) {
    for (const m of hcMatch[1].matchAll(/--([a-z][a-z0-9-]+)\s*:/g)) modes.hc.tokens.add(m[1]);
  }

  /* Parse compact */
  const compactMatch = themeCss.match(/compact[^{]*\{([^}]+)\}/s);
  if (compactMatch) {
    for (const m of compactMatch[1].matchAll(/--([a-z][a-z0-9-]+)\s*:/g)) modes.compact.tokens.add(m[1]);
  }

  const lightCount = modes.light.tokens.size;
  const darkCount = modes.dark.tokens.size;
  const hcCount = modes.hc.tokens.size;
  const compactCount = modes.compact.tokens.size;

  /* Dark should have same color tokens as light */
  const lightColorTokens = [...modes.light.tokens].filter(t => /surface|text|action|border|state|accent|overlay|ring|focus/.test(t));
  const darkMissing = lightColorTokens.filter(t => !modes.dark.tokens.has(t));
  const hcMissing = lightColorTokens.filter(t => !modes.hc.tokens.has(t));

  const details = [
    `Light: ${lightCount} tokens (${lightColorTokens.length} color)`,
    `Dark: ${darkCount} tokens (${darkMissing.length} color tokens missing)`,
    `HC: ${hcCount} tokens (${hcMissing.length} color tokens missing)`,
    `Compact: ${compactCount} tokens`,
  ];
  if (darkMissing.length > 0) details.push(`Dark missing: ${darkMissing.slice(0, 5).join(', ')}${darkMissing.length > 5 ? ` +${darkMissing.length - 5} more` : ''}`);
  if (hcMissing.length > 0) details.push(`HC missing: ${hcMissing.slice(0, 5).join(', ')}${hcMissing.length > 5 ? ` +${hcMissing.length - 5} more` : ''}`);

  if (darkMissing.length <= 5 && hcCount > 0 && darkCount > 0) {
    return { status: 'pass', message: `4 modes: light=${lightCount}, dark=${darkCount}, HC=${hcCount}, compact=${compactCount}`, details };
  }
  return {
    status: darkCount === 0 || hcCount === 0 ? 'fail' : 'warn',
    message: `Mode gaps: dark=${darkCount}(${darkMissing.length} missing), HC=${hcCount}(${hcMissing.length} missing), compact=${compactCount}`,
    details,
    fix: FIX_HINT ? 'Ensure all color tokens have overrides in dark/HC modes. Run: diff light vs dark tokens in theme.css' : undefined,
  };
});

// 43. Dark Mode Visual Risks — components with opacity, shadows, or gradients that break in dark
check('dark-visual-risks', 'Visual patterns that commonly break in dark mode', () => {
  const scanDirs = [join(DS_SRC, 'components'), join(DS_SRC, 'enterprise')];
  const skipPaths = ['__tests__', '__stories__', '__visual__', 'design-lab', 'demos'];
  const risks = [];

  for (const dir of scanDirs) {
    for (const file of walkDir(dir, '.tsx')) {
      const rel = relative(ROOT, file);
      const name = file.split('/').pop().replace('.tsx', '');
      if (skipPaths.some(p => rel.includes(p))) continue;
      if (name.startsWith('use') || name === 'index') continue;

      const content = readSafe(file);
      if (!content.includes('className')) continue;

      const issues = [];

      /* White/black shadows won't adapt */
      if (/shadow-\[.*(?:rgba?\(0|rgba?\(255|#000|#fff|#FFF)/.test(content)) {
        issues.push('hardcoded-shadow');
      }

      /* bg-opacity with white/black base */
      if (/bg-white\/|bg-black\//.test(content)) {
        issues.push('opacity-on-hardcoded-bg');
      }

      /* Gradient with hardcoded colors */
      if (/(?:from|via|to)-(?:white|black|gray|slate)-/.test(content) || /gradient.*#[0-9a-f]/i.test(content)) {
        issues.push('hardcoded-gradient');
      }

      /* Backdrop with hardcoded color */
      if (/backdrop.*(?:white|black|#[0-9a-f]{3,8})/i.test(content)) {
        issues.push('hardcoded-backdrop');
      }

      /* SVG fill/stroke with hardcoded colors */
      if (/(?:fill|stroke)=["']#(?!none)[0-9a-fA-F]/.test(content)) {
        issues.push('svg-hardcoded-color');
      }

      if (issues.length > 0) {
        risks.push({ component: name, issues, file: rel });
      }
    }
  }

  if (risks.length === 0) return { status: 'pass', message: 'No dark mode visual risks detected (shadows, gradients, SVG all use tokens)' };
  const total = risks.reduce((s, r) => s + r.issues.length, 0);
  return {
    status: total > 10 ? 'warn' : 'pass',
    message: `${total} dark mode visual risks in ${risks.length} components`,
    details: risks.slice(0, 8).map(r => `${r.component}: ${r.issues.join(', ')}`),
    fix: FIX_HINT ? 'Replace hardcoded shadow/gradient/SVG colors with token references for dark mode compatibility' : undefined,
  };
});

// 58. HC/Dark Invisible Token Pairs — text+bg with same lightness (invisible content)
check('invisible-token-pairs', 'Token pairs where text is invisible on its background (all modes)', () => {
  const themeCss = readSafe(THEME_CSS);

  /* Parse all mode blocks and extract OKLCH L values */
  function extractBlock(css, startMarker) {
    const idx = css.indexOf(startMarker);
    if (idx === -1) return '';
    const braceStart = css.indexOf('{', idx);
    let depth = 1, i = braceStart + 1;
    while (i < css.length && depth > 0) { if (css[i] === '{') depth++; if (css[i] === '}') depth--; i++; }
    return css.substring(braceStart + 1, i - 1);
  }

  function getLValues(block) {
    const map = new Map();
    for (const m of block.matchAll(/--([\w-]+)\s*:\s*oklch\(([^)]+)\)/g)) {
      const val = m[2].trim();
      /* Skip opacity-modified colors like "61% 0.2 26 / 12%" — effective color differs */
      if (val.includes('/')) continue;
      const lMatch = val.match(/^([\d.]+)%/);
      if (lMatch) map.set(m[1], parseFloat(lMatch[1]));
    }
    return map;
  }

  const modes = [
    { name: 'light', block: extractBlock(themeCss, ':root {') || extractBlock(themeCss, ':root{') },
    { name: 'dark', block: extractBlock(themeCss, '[data-mode="dark"]') },
    { name: 'HC', block: extractBlock(themeCss, 'serban-hc') },
  ];

  /* Text → Background pairs to check */
  const pairDefs = [
    { text: 'text-primary', bgs: ['surface-default-bg', 'surface-raised-bg', 'surface-muted-bg'] },
    { text: 'text-secondary', bgs: ['surface-default-bg'] },
    { text: 'text-subtle', bgs: ['surface-default-bg'] },
    { text: 'text-inverse', bgs: ['action-primary-bg', 'surface-overlay-bg'] },
    { text: 'action-primary-text', bgs: ['action-primary-bg'] },
    { text: 'action-secondary-text', bgs: ['action-secondary-bg'] },
    { text: 'action-ghost-text', bgs: ['surface-default-bg'] },
    { text: 'state-danger-text', bgs: ['surface-default-bg', 'state-danger-bg'] },
    { text: 'state-success-text', bgs: ['surface-default-bg', 'state-success-bg'] },
    { text: 'state-warning-text', bgs: ['surface-default-bg', 'state-warning-bg'] },
    { text: 'state-info-text', bgs: ['surface-default-bg', 'state-info-bg'] },
    { text: 'data-table-header-text', bgs: ['data-table-header-bg'] },
  ];

  const invisible = [];
  for (const mode of modes) {
    const vals = getLValues(mode.block);
    for (const pair of pairDefs) {
      const textL = vals.get(pair.text);
      if (textL === undefined) continue;
      for (const bgName of pair.bgs) {
        const bgL = vals.get(bgName);
        if (bgL === undefined) continue;
        const diff = Math.abs(textL - bgL);
        /* If lightness difference < 5%, text is effectively invisible */
        if (diff < 5) {
          invisible.push({
            mode: mode.name,
            text: `--${pair.text} (L=${textL}%)`,
            bg: `--${bgName} (L=${bgL}%)`,
            diff: `ΔL=${diff.toFixed(1)}%`,
          });
        }
      }
    }
  }

  if (invisible.length === 0) {
    return { status: 'pass', message: `All text/bg token pairs have sufficient lightness difference across ${modes.length} modes` };
  }
  return {
    status: 'fail',
    message: `${invisible.length} invisible text/bg pairs (ΔL < 5%) — content will be unreadable`,
    details: invisible.slice(0, 10).map(p => `[${p.mode}] ${p.text} on ${p.bg} — ${p.diff}`),
    fix: FIX_HINT ? 'Ensure text and background tokens have ΔL > 30% for readability. HC mode: use white text on black bg, or yellow accent on black.' : undefined,
  };
});

// 59. HC Token Completeness — all semantic tokens must have HC overrides
check('hc-token-completeness', 'HC theme has overrides for all semantic color tokens', () => {
  const themeCss = readSafe(THEME_CSS);

  /* Extract light :root tokens */
  const rootBlock = themeCss.split('[data-mode=')[0] || '';
  const lightTokens = new Set();
  for (const m of rootBlock.matchAll(/--((?:surface|text|action|border|state|accent|selection|focus|data-table|interactive|elevation)[a-z0-9-]*)\s*:\s*oklch/g)) {
    lightTokens.add(m[1]);
  }

  /* Extract HC tokens */
  const hcIdx = themeCss.indexOf('serban-hc');
  let hcTokens = new Set();
  if (hcIdx !== -1) {
    const braceStart = themeCss.indexOf('{', hcIdx);
    let depth = 1, i = braceStart + 1;
    while (i < themeCss.length && depth > 0) { if (themeCss[i] === '{') depth++; if (themeCss[i] === '}') depth--; i++; }
    const hcBlock = themeCss.substring(braceStart + 1, i - 1);
    for (const m of hcBlock.matchAll(/--([\w-]+)\s*:/g)) hcTokens.add(m[1]);
  }

  const missing = [...lightTokens].filter(t => !hcTokens.has(t));

  /* Categorize */
  const categories = {};
  for (const t of missing) {
    const cat = t.split('-')[0];
    if (!categories[cat]) categories[cat] = [];
    categories[cat].push(t);
  }

  if (missing.length === 0) {
    return { status: 'pass', message: `HC theme covers all ${lightTokens.size} semantic color tokens` };
  }
  const catSummary = Object.entries(categories).sort((a, b) => b[1].length - a[1].length).map(([c, v]) => `${c}: ${v.length}`);
  return {
    status: missing.length > 10 ? 'warn' : 'pass',
    message: `${missing.length}/${lightTokens.size} semantic tokens missing from HC theme`,
    details: [`Categories: ${catSummary.join(', ')}`, ...missing.slice(0, 8).map(t => `--${t}`)],
    fix: FIX_HINT ? 'Add HC overrides: surfaces→black/near-black, text→white, borders→white, accents→yellow, states→high-chroma' : undefined,
  };
});

/* ================================================================== */
}
