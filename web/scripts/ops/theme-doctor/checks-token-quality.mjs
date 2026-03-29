/**
 * Token Quality & Consistency checks (#44-57)
 * Extracted from theme-doctor.mjs for maintainability.
 */

import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';

export function register(ctx) {
  const { check, readSafe, srgbToHex, parseCssVarsFlat, walkDir,
    ROOT, DS_SRC, SHELL_STYLES, SHELL_INDEX_CSS, FIGMA_PATH,
    THEME_CSS, TOKEN_BRIDGE_CSS, TOKENS_CSS, THEME_INLINE_CSS, FIX_HINT } = ctx;

/*  TOKEN QUALITY & CONSISTENCY CHECKS (#44–57)                        */
/* ================================================================== */

// 44. A11y Contrast Ratio — OKLCH lightness-based WCAG contrast check
check('a11y-contrast-ratio', 'WCAG contrast ratio for text/surface token pairs', () => {
  const themeCss = readSafe(THEME_CSS);
  /* Extract OKLCH lightness for key tokens */
  function getL(name) {
    const re = new RegExp(`--${name}:\\s*oklch\\((\\d+(?:\\.\\d+)?)%`);
    const m = themeCss.match(re);
    return m ? parseFloat(m[1]) / 100 : null;
  }
  /* OKLCH L → relative luminance (cubic model, better approximation) */
  function oklchToLuminance(L) { return Math.pow(L, 3); }
  function contrastRatio(L1, L2) {
    const l1 = oklchToLuminance(Math.max(L1, L2));
    const l2 = oklchToLuminance(Math.min(L1, L2));
    return (l1 + 0.05) / (l2 + 0.05);
  }

  const pairs = [
    { text: 'text-primary', bg: 'surface-default-bg', min: 4.5, label: 'body text' },
    { text: 'text-secondary', bg: 'surface-default-bg', min: 3.0, label: 'secondary text' },
    { text: 'text-subtle', bg: 'surface-default-bg', min: 3.0, label: 'subtle text' },
    { text: 'action-primary-text', bg: 'action-primary-bg', min: 4.5, label: 'button text' },
    { text: 'state-danger-text', bg: 'surface-default-bg', min: 3.0, label: 'error text' },
    { text: 'state-success-text', bg: 'surface-default-bg', min: 3.0, label: 'success text' },
  ];

  const failures = [];
  const passes = [];
  for (const p of pairs) {
    const tL = getL(p.text);
    const bL = getL(p.bg);
    if (tL === null || bL === null) continue;
    const ratio = contrastRatio(tL, bL);
    if (ratio < p.min) {
      failures.push(`${p.label}: ${ratio.toFixed(1)}:1 (need ${p.min}:1) — --${p.text} on --${p.bg}`);
    } else {
      passes.push(`${p.label}: ${ratio.toFixed(1)}:1`);
    }
  }

  if (failures.length === 0) return { status: 'pass', message: `All ${passes.length} text/bg pairs meet WCAG contrast (${passes.join(', ')})` };
  return { status: 'warn', message: `${failures.length} pairs fail WCAG contrast`, details: failures };
});

// 45. Spacing Token Coverage — hardcoded px/rem in style props
check('spacing-hardcodes', 'Hardcoded spacing values (px/rem) instead of Tailwind scale', () => {
  const scanDirs = [join(DS_SRC, 'components'), join(DS_SRC, 'enterprise'), join(ROOT, 'packages', 'x-form-builder', 'src')];
  const skipPaths = ['__tests__', '__stories__', '__visual__', 'design-lab', 'demos'];
  const spacingRe = /(?:padding|margin|gap|top|left|right|bottom|inset)\s*:\s*['"]?\d+(?:px|rem)/gi;
  const arbitraryRe = /(?:p|m|gap|inset|top|bottom|left|right)-\[\d+px\]/g;
  let hardcoded = 0;
  let arbitrary = 0;
  const files = [];

  for (const dir of scanDirs) {
    for (const file of walkDir(dir, '.tsx')) {
      const rel = relative(ROOT, file);
      if (skipPaths.some(p => rel.includes(p))) continue;
      const content = readSafe(file);
      const hc = (content.match(spacingRe) || []).length;
      const ar = (content.match(arbitraryRe) || []).length;
      if (hc + ar > 0) {
        hardcoded += hc;
        arbitrary += ar;
        if (files.length < 5) files.push(`${rel.split('/').pop()}: ${hc} inline, ${ar} arbitrary`);
      }
    }
  }

  const total = hardcoded + arbitrary;
  if (total === 0) return { status: 'pass', message: 'All spacing uses Tailwind scale — no hardcoded px/rem' };
  return {
    status: total > 30 ? 'warn' : 'pass',
    message: `${hardcoded} inline px/rem + ${arbitrary} arbitrary spacing values (p-[Npx])`,
    details: files,
    fix: FIX_HINT ? 'Replace padding: "12px" → p-3, margin: "8px" → m-2, gap-[14px] → gap-3.5' : undefined,
  };
});

// 46. Typography Token Coverage — hardcoded font-size/line-height/font-weight
check('typography-hardcodes', 'Hardcoded typography values instead of Tailwind/token scale', () => {
  const scanDirs = [join(DS_SRC, 'components'), join(DS_SRC, 'enterprise')];
  const skipPaths = ['__tests__', '__stories__', '__visual__', 'design-lab', 'Chart', 'Plot', 'Gauge', 'Funnel', 'Treemap', 'Sankey', 'Heatmap', 'Waterfall', 'Pareto', 'enterprise/', 'FineKinney', 'Bullet', 'Aging', 'Histogram', 'BoxPlot', 'Approval', 'app-sidebar/', 'AnchorToc', 'Sidebar'];
  /* Only match fontSize in inline style props — SVG/Recharts config uses fontSize naturally */
  const fontSizeRe = /style=\{?\{[^}]*fontSize\s*:\s*['"]?\d+(?:px|rem)/gi;
  const lineHeightRe = /style=\{?\{[^}]*lineHeight\s*:\s*['"]?\d+(?:px|rem|%)/gi;
  const arbitraryFontRe = /text-\[\d+px\]/g;
  let count = 0;
  const files = [];

  for (const dir of scanDirs) {
    for (const file of walkDir(dir, '.tsx')) {
      const rel = relative(ROOT, file);
      if (skipPaths.some(p => rel.includes(p))) continue;
      const content = readSafe(file);
      const hits = (content.match(fontSizeRe) || []).length + (content.match(lineHeightRe) || []).length + (content.match(arbitraryFontRe) || []).length;
      if (hits > 0) {
        count += hits;
        if (files.length < 5) files.push(`${rel.split('/').pop()}: ${hits} hardcoded`);
      }
    }
  }

  if (count === 0) return { status: 'pass', message: 'All typography uses Tailwind text-* scale' };
  return {
    status: count > 60 ? 'warn' : 'pass',
    message: `${count} hardcoded font-size/line-height values`,
    details: files,
    fix: FIX_HINT ? 'Replace fontSize: "14px" → text-sm, fontSize: "16px" → text-base, text-[13px] → text-xs' : undefined,
  };
});

// 47. Z-Index Chaos — scattered z-index values without token system
check('z-index-chaos', 'Z-index values: scattered arbitrary vs systematic scale', () => {
  const scanDirs = [join(DS_SRC, 'components'), join(DS_SRC, 'enterprise'), join(ROOT, 'packages', 'x-form-builder', 'src')];
  const skipPaths = ['__tests__', '__stories__', '__visual__', 'design-lab'];
  const zArbitraryRe = /z-\[\d+\]/g;
  const zInlineRe = /zIndex\s*:\s*['"]?\d+/g;
  const values = new Map(); /* value → [files] */

  for (const dir of scanDirs) {
    for (const file of walkDir(dir, '.tsx')) {
      const rel = relative(ROOT, file);
      if (skipPaths.some(p => rel.includes(p))) continue;
      const content = readSafe(file);
      for (const m of content.matchAll(/z-\[(\d+)\]/g)) {
        const v = m[1];
        if (!values.has(v)) values.set(v, new Set());
        values.get(v).add(rel.split('/').pop());
      }
      for (const m of content.matchAll(/zIndex\s*:\s*['"]?(\d+)/g)) {
        const v = m[1];
        if (!values.has(v)) values.set(v, new Set());
        values.get(v).add(rel.split('/').pop());
      }
    }
  }

  if (values.size === 0) return { status: 'pass', message: 'No arbitrary z-index values — all use Tailwind z-* scale' };
  const sorted = [...values.entries()].sort((a, b) => parseInt(b[0]) - parseInt(a[0]));
  return {
    status: values.size > 5 ? 'warn' : 'pass',
    message: `${values.size} unique arbitrary z-index values across ${[...values.values()].reduce((s, v) => s + v.size, 0)} files`,
    details: sorted.slice(0, 8).map(([v, files]) => `z-${v}: ${[...files].join(', ')}`),
    fix: FIX_HINT ? 'Define z-index scale tokens: --z-dropdown: 100, --z-modal: 200, --z-toast: 300, --z-tooltip: 400' : undefined,
  };
});

// 48. Unused Tokens — defined in theme.css but never referenced in components
check('unused-tokens', 'Tokens defined in theme.css but never referenced in any component', () => {
  const themeCss = readSafe(THEME_CSS);
  const rootBlock = themeCss.split('[data-mode=')[0] || '';
  const definedTokens = new Set();
  for (const m of rootBlock.matchAll(/--([a-z][a-z0-9-]+)\s*:/g)) {
    if (!m[1].startsWith('color-')) definedTokens.add(m[1]);
  }

  /* Scan all component files for var(--token) references */
  const scanDirs = [DS_SRC, join(ROOT, 'packages', 'x-form-builder', 'src'), join(ROOT, 'packages', 'x-charts', 'src'), join(ROOT, 'packages', 'x-data-grid', 'src'), join(ROOT, 'apps')];
  const referenced = new Set();
  for (const dir of scanDirs) {
    for (const file of [...walkDir(dir, '.tsx'), ...walkDir(dir, '.ts'), ...walkDir(dir, '.css')]) {
      const content = readSafe(file);
      for (const m of content.matchAll(/var\(--([a-z][a-z0-9-]*)/g)) referenced.add(m[1]);
      /* Also check Tailwind class patterns that reference tokens */
      for (const m of content.matchAll(/(?:bg|text|border|ring|shadow|fill|stroke|accent)-([a-z][a-z0-9-]*)/g)) {
        /* Convert class name to possible token: bg-surface-default → surface-default */
        referenced.add(m[1]);
        referenced.add(m[1] + '-bg');
        referenced.add(m[1] + '-text');
      }
    }
  }

  /* Also count self-references within theme.css */
  for (const m of themeCss.matchAll(/var\(--([a-z][a-z0-9-]*)/g)) referenced.add(m[1]);

  /* Filter: infrastructure tokens and palette reserves are expected to be unreferenced */
  const infraPrefixes = ['overlay-', 'density-', 'motion-duration-', 'motion-easing-', 'ring-', 'status-'];
  const isInfraOrReserve = (t) => t.includes('tones-') || infraPrefixes.some(p => t.startsWith(p));
  const unused = [...definedTokens].filter(t => !referenced.has(t) && !isInfraOrReserve(t));
  const reservedUnused = [...definedTokens].filter(t => !referenced.has(t) && isInfraOrReserve(t));
  if (unused.length === 0) return { status: 'pass', message: `All ${definedTokens.size} theme tokens referenced (${reservedUnused.length} palette reserve tokens skipped)` };
  return {
    status: unused.length > 15 ? 'warn' : 'pass',
    message: `${unused.length}/${definedTokens.size} theme tokens appear unused`,
    details: unused.slice(0, 10).map(t => `--${t}`),
    fix: FIX_HINT ? 'Remove unused tokens or add component references' : undefined,
  };
});

// 49. Token Naming Convention — mixed naming patterns
check('token-naming-convention', 'Token naming consistency (semantic vs alias vs shorthand)', () => {
  const themeCss = readSafe(THEME_CSS);
  const rootBlock = themeCss.split('[data-mode=')[0] || '';
  const tokens = [];
  for (const m of rootBlock.matchAll(/--([a-z][a-z0-9-]+)\s*:/g)) {
    if (!m[1].startsWith('color-') && !m[1].startsWith('font-')) tokens.push(m[1]);
  }

  /* Categorize naming patterns */
  const semantic = tokens.filter(t => /^(surface|text|border|action|state|selection|focus|elevation|overlay|data-table|accent|interactive|segmented|chart|brand)-/.test(t));
  const shorthand = tokens.filter(t => /^(bg|fg|ring|shadow)-/.test(t));
  const legacyAll = tokens.filter(t => /^(danger|success|warning|info|feedback)-/.test(t));
  const other = tokens.filter(t => !semantic.includes(t) && !shorthand.includes(t) && !legacyAll.includes(t));

  /* Check if legacy/shorthand tokens are var() aliases (migrated) */
  const isAlias = (name) => {
    const re = new RegExp(`--${name}:\\s*var\\(`);
    return re.test(rootBlock);
  };
  const legacyHardcoded = legacyAll.filter(t => !isAlias(t));
  const legacyAliased = legacyAll.filter(t => isAlias(t));
  const shorthandHardcoded = shorthand.filter(t => !isAlias(t));
  const shorthandAliased = shorthand.filter(t => isAlias(t));

  const details = [
    `Semantic: ${semantic.length}`,
    `Legacy: ${legacyAll.length} (${legacyAliased.length} aliased, ${legacyHardcoded.length} hardcoded)`,
    `Shorthand: ${shorthand.length} (${shorthandAliased.length} aliased, ${shorthandHardcoded.length} hardcoded)`,
    `Other: ${other.length}${other.length > 0 ? ' — ' + other.slice(0, 5).join(', ') : ''}`,
  ];

  if (legacyHardcoded.length === 0 && shorthandHardcoded.length === 0) {
    return { status: 'pass', message: `${semantic.length} semantic + ${legacyAliased.length + shorthandAliased.length} migrated aliases`, details };
  }
  return {
    status: legacyHardcoded.length > 3 ? 'warn' : 'pass',
    message: `${legacyHardcoded.length} legacy + ${shorthandHardcoded.length} shorthand still hardcoded (not aliased)`,
    details: [...details, ...legacyHardcoded.map(t => `--${t} (hardcoded)`)],
    fix: FIX_HINT ? 'Convert to alias: --danger-color: var(--state-danger-text)' : undefined,
  };
});

// 50. Near-Duplicate Tokens — tokens with very similar OKLCH values
check('near-duplicate-tokens', 'Tokens with near-identical color values (potential redundancy)', () => {
  const themeCss = readSafe(THEME_CSS);
  const rootBlock = themeCss.split('[data-mode=')[0] || '';
  const colorTokens = [];
  for (const m of rootBlock.matchAll(/--((?:surface|text|border|action|state|accent)[a-z0-9-]*)\s*:\s*oklch\(([^)]+)\)/g)) {
    const parts = m[2].trim().split(/\s+/);
    if (parts.length >= 3) {
      colorTokens.push({ name: m[1], L: parseFloat(parts[0]), C: parseFloat(parts[1]), H: parseFloat(parts[2]) });
    }
  }

  /* De-duplicate: keep unique names only */
  const seen = new Set();
  const unique = colorTokens.filter(t => { if (seen.has(t.name)) return false; seen.add(t.name); return true; });

  const duplicates = [];
  for (let i = 0; i < unique.length; i++) {
    for (let j = i + 1; j < unique.length; j++) {
      const a = unique[i], b = unique[j];
      /* Skip same-category comparisons (surface-default vs surface-raised is expected to be close) */
      const catA = a.name.split('-').slice(0, 2).join('-');
      const catB = b.name.split('-').slice(0, 2).join('-');
      if (catA === catB) continue;
      const dL = Math.abs(a.L - b.L);
      const dC = Math.abs(a.C - b.C);
      const dH = Math.abs(a.H - b.H);
      /* Near-identical: L within 0.5%, C within 0.005, H within 3 — truly identical colors */
      if (dL < 0.5 && dC < 0.005 && dH < 3) {
        /* Skip intentional white/black pairs — different roles, same achromatic value */
        const isAchromatic = (a.C < 0.01 && b.C < 0.01);
        const isWhite = (a.L > 95 && b.L > 95);
        const isBlack = (a.L < 30 && b.L < 30);
        if (isAchromatic && (isWhite || isBlack)) continue;
        duplicates.push({ a: a.name, b: b.name, diff: `ΔL=${dL.toFixed(2)}% ΔC=${dC.toFixed(4)} ΔH=${dH.toFixed(1)}°` });
      }
    }
  }

  if (duplicates.length === 0) return { status: 'pass', message: `${unique.length} unique color tokens — no cross-category duplicates` };
  return {
    status: duplicates.length > 30 ? 'warn' : 'pass',
    message: `${duplicates.length} near-duplicate token pairs across different categories`,
    details: duplicates.slice(0, 8).map(d => `--${d.a} ≈ --${d.b} (${d.diff})`),
    fix: FIX_HINT ? 'Consolidate near-identical tokens: use var(--token-a) as alias instead of separate values' : undefined,
  };
});

// 51. Border Radius Consistency — mixed radius values across same-role components
check('border-radius-consistency', 'Consistent border-radius usage across component roles', () => {
  const scanDirs = [join(DS_SRC, 'components')];
  const skipPaths = ['__tests__', '__stories__', '__visual__', 'design-lab'];
  const arbitraryRe = /rounded-\[\d+px\]/g;
  const mixedFiles = [];
  let arbitraryCount = 0;

  for (const dir of scanDirs) {
    for (const file of walkDir(dir, '.tsx')) {
      const rel = relative(ROOT, file);
      if (skipPaths.some(p => rel.includes(p))) continue;
      const content = readSafe(file);
      const arb = (content.match(arbitraryRe) || []).filter(v => {
        /* Skip pill shapes (≥20px) — intentional design, not Tailwind scale */
        const px = parseInt(v.match(/\d+/)[0]);
        return px < 20;
      });
      if (arb.length > 0) {
        arbitraryCount += arb.length;
        if (mixedFiles.length < 5) mixedFiles.push(`${rel.split('/').pop()}: ${arb.join(', ')}`);
      }
    }
  }

  if (arbitraryCount === 0) return { status: 'pass', message: 'All border-radius uses Tailwind scale (no arbitrary rounded-[Npx])' };
  return {
    status: arbitraryCount > 10 ? 'warn' : 'pass',
    message: `${arbitraryCount} arbitrary rounded-[Npx] values`,
    details: mixedFiles,
    fix: FIX_HINT ? 'Replace rounded-[8px] → rounded-lg, rounded-[4px] → rounded-sm, use data-radius axis for theme control' : undefined,
  };
});

// 52. Animation Token Coverage — hardcoded durations/easings
check('animation-hardcodes', 'Hardcoded animation duration/easing vs motion tokens', () => {
  const scanDirs = [join(DS_SRC, 'components'), join(DS_SRC, 'enterprise')];
  const skipPaths = ['__tests__', '__stories__', '__visual__', 'design-lab'];
  const durationRe = /(?:transition|animation).*?(\d+(?:\.\d+)?(?:ms|s))/gi;
  const inlineDuration = /(?:transitionDuration|animationDuration)\s*:\s*['"]?\d+/gi;
  let count = 0;
  const files = [];

  for (const dir of scanDirs) {
    for (const file of walkDir(dir, '.tsx')) {
      const rel = relative(ROOT, file);
      if (skipPaths.some(p => rel.includes(p))) continue;
      const content = readSafe(file);
      const hits = (content.match(durationRe) || []).length + (content.match(inlineDuration) || []).length;
      if (hits > 0) {
        count += hits;
        if (files.length < 5) files.push(`${rel.split('/').pop()}: ${hits}`);
      }
    }
  }

  if (count === 0) return { status: 'pass', message: 'All animations use Tailwind duration-*/ease-* scale' };
  return {
    status: count > 15 ? 'warn' : 'pass',
    message: `${count} hardcoded transition/animation durations`,
    details: files,
    fix: FIX_HINT ? 'Replace transition: 0.2s → duration-200, transitionDuration: 300 → duration-300. Define --motion-* tokens for consistency.' : undefined,
  };
});

// 53. Opacity Hardcodes — arbitrary opacity values
check('opacity-hardcodes', 'Arbitrary opacity values vs consistent scale', () => {
  const scanDirs = [join(DS_SRC, 'components'), join(DS_SRC, 'enterprise')];
  const skipPaths = ['__tests__', '__stories__', '__visual__', 'design-lab'];
  const opacityInline = /opacity\s*:\s*['"]?0\.\d+/gi;
  const opacityArbitrary = /opacity-\[\d+/g;
  let count = 0;
  const files = [];

  for (const dir of scanDirs) {
    for (const file of walkDir(dir, '.tsx')) {
      const rel = relative(ROOT, file);
      if (skipPaths.some(p => rel.includes(p))) continue;
      const content = readSafe(file);
      const hits = (content.match(opacityInline) || []).length + (content.match(opacityArbitrary) || []).length;
      if (hits > 0) {
        count += hits;
        if (files.length < 5) files.push(`${rel.split('/').pop()}: ${hits}`);
      }
    }
  }

  if (count === 0) return { status: 'pass', message: 'All opacity uses Tailwind scale (opacity-0/25/50/75/100)' };
  return {
    status: count > 10 ? 'warn' : 'pass',
    message: `${count} arbitrary opacity values`,
    details: files,
    fix: FIX_HINT ? 'Replace opacity: 0.5 → opacity-50, use bg-surface-*/70 opacity modifier' : undefined,
  };
});

// 54. CSS Variable Cycles — circular var() references
check('css-var-cycles', 'Circular CSS variable references (var cycle detection)', () => {
  const themeCss = readSafe(THEME_CSS);
  const graph = new Map(); /* token → [dependencies] */
  for (const m of themeCss.matchAll(/--([\w-]+)\s*:\s*([^;]+);/g)) {
    const name = m[1];
    const deps = [];
    for (const ref of m[2].matchAll(/var\(--([\w-]+)/g)) deps.push(ref[1]);
    if (deps.length > 0) graph.set(name, deps);
  }

  /* DFS cycle detection */
  const cycles = [];
  const visited = new Set();
  const stack = new Set();
  function dfs(node, path) {
    if (stack.has(node)) { cycles.push([...path, node]); return; }
    if (visited.has(node)) return;
    visited.add(node);
    stack.add(node);
    for (const dep of (graph.get(node) || [])) dfs(dep, [...path, node]);
    stack.delete(node);
  }
  for (const node of graph.keys()) dfs(node, []);

  if (cycles.length === 0) return { status: 'pass', message: `${graph.size} var() references — no circular dependencies` };
  return {
    status: 'fail',
    message: `${cycles.length} circular var() reference(s) detected`,
    details: cycles.slice(0, 5).map(c => c.map(n => `--${n}`).join(' → ')),
  };
});

// 55. Token Deprecation — old naming patterns still in use
check('token-deprecation', 'Deprecated token naming patterns still referenced in components', () => {
  const deprecated = {
    'bg-primary': '--action-primary-bg',
    'danger-color': '--state-danger-text',
    'success-color': '--state-success-text',
    'warning-color': '--state-warning-text',
    'info-color': '--state-info-text',
    'feedback-error': '--state-error-text',
    'feedback-success': '--state-success-text',
    'feedback-warning': '--state-warning-text',
    'feedback-info': '--state-info-text',
    'ring-color': '--focus-outline',
  };

  const scanDirs = [DS_SRC, join(ROOT, 'packages', 'x-form-builder', 'src'), join(ROOT, 'apps')];
  const skipPaths = ['__tests__', '__stories__', '__visual__', 'design-lab', 'node_modules', 'theme.css'];
  const found = new Map();

  for (const dir of scanDirs) {
    for (const file of [...walkDir(dir, '.tsx'), ...walkDir(dir, '.ts')]) {
      const rel = relative(ROOT, file);
      if (skipPaths.some(p => rel.includes(p))) continue;
      const content = readSafe(file);
      for (const [old, replacement] of Object.entries(deprecated)) {
        if (content.includes(`var(--${old})`)) {
          if (!found.has(old)) found.set(old, { replacement, count: 0 });
          found.get(old).count++;
        }
      }
    }
  }

  if (found.size === 0) return { status: 'pass', message: 'No deprecated token references in components' };
  return {
    status: found.size > 3 ? 'warn' : 'pass',
    message: `${found.size} deprecated tokens still referenced`,
    details: [...found.entries()].map(([old, { replacement, count }]) => `--${old} (${count} refs) → ${replacement}`),
    fix: FIX_HINT ? 'Replace deprecated var(--old) with var(--new) references' : undefined,
  };
});

// 56. Cross-Package Token Consistency — same token used differently across packages
check('cross-package-consistency', 'Token usage consistency across packages (same var, same intent)', () => {
  const packages = [
    { name: 'design-system', dir: DS_SRC },
    { name: 'x-form-builder', dir: join(ROOT, 'packages', 'x-form-builder', 'src') },
    { name: 'x-data-grid', dir: join(ROOT, 'packages', 'x-data-grid', 'src') },
    { name: 'x-charts', dir: join(ROOT, 'packages', 'x-charts', 'src') },
  ];
  const skipPaths = ['__tests__', '__stories__', '__visual__', 'design-lab'];

  /* Count token usage per package */
  const tokensByPkg = new Map();
  for (const pkg of packages) {
    const tokens = new Map();
    for (const file of [...walkDir(pkg.dir, '.tsx'), ...walkDir(pkg.dir, '.ts')]) {
      const rel = relative(ROOT, file);
      if (skipPaths.some(p => rel.includes(p))) continue;
      const content = readSafe(file);
      for (const m of content.matchAll(/var\(--([a-z][a-z0-9-]*)/g)) {
        tokens.set(m[1], (tokens.get(m[1]) || 0) + 1);
      }
    }
    tokensByPkg.set(pkg.name, tokens);
  }

  /* Find tokens only used in non-DS packages (should be in DS) */
  const dsTokens = tokensByPkg.get('design-system') || new Map();
  const nonDsOnly = [];
  for (const [pkg, tokens] of tokensByPkg) {
    if (pkg === 'design-system') continue;
    for (const [token] of tokens) {
      if (!dsTokens.has(token) && !token.startsWith('ag-') && !token.startsWith('color-')) {
        nonDsOnly.push({ token, pkg });
      }
    }
  }

  const unique = [...new Set(nonDsOnly.map(n => n.token))];
  if (unique.length === 0) return { status: 'pass', message: `Token usage consistent — all package tokens also used in DS` };
  return {
    status: unique.length > 10 ? 'warn' : 'pass',
    message: `${unique.length} tokens used in sub-packages but not in design-system`,
    details: nonDsOnly.slice(0, 8).map(n => `--${n.token} (only in ${n.pkg})`),
  };
});

// 57. Responsive Breakpoint Consistency — consistent breakpoint usage
check('responsive-consistency', 'Responsive breakpoint usage patterns across components', () => {
  const scanDirs = [join(DS_SRC, 'components'), join(DS_SRC, 'enterprise')];
  const skipPaths = ['__tests__', '__stories__', '__visual__', 'design-lab'];
  const bpCounts = { sm: 0, md: 0, lg: 0, xl: 0, '2xl': 0 };
  const customBp = [];
  let totalFiles = 0;
  let responsiveFiles = 0;

  for (const dir of scanDirs) {
    for (const file of walkDir(dir, '.tsx')) {
      const rel = relative(ROOT, file);
      if (skipPaths.some(p => rel.includes(p))) continue;
      if (rel.split('/').pop().startsWith('use')) continue;
      const content = readSafe(file);
      if (!content.includes('className')) continue;
      totalFiles++;

      let hasResponsive = false;
      for (const bp of Object.keys(bpCounts)) {
        const re = new RegExp(`\\b${bp}:`, 'g');
        const count = (content.match(re) || []).length;
        if (count > 0) { bpCounts[bp] += count; hasResponsive = true; }
      }
      /* Arbitrary breakpoints */
      const arb = (content.match(/min-\[\d+px\]:|max-\[\d+px\]:/g) || []);
      if (arb.length > 0) customBp.push(`${rel.split('/').pop()}: ${arb.join(', ')}`);
      if (hasResponsive) responsiveFiles++;
    }
  }

  const coverage = totalFiles > 0 ? Math.round((responsiveFiles / totalFiles) * 100) : 0;
  const details = [
    `Breakpoint usage: sm=${bpCounts.sm}, md=${bpCounts.md}, lg=${bpCounts.lg}, xl=${bpCounts.xl}, 2xl=${bpCounts['2xl']}`,
    `${responsiveFiles}/${totalFiles} components (${coverage}%) use responsive breakpoints`,
  ];
  if (customBp.length > 0) details.push(`Custom breakpoints: ${customBp.join(', ')}`);

  return {
    status: customBp.length > 3 ? 'warn' : 'pass',
    message: `${coverage}% responsive coverage, ${customBp.length} custom breakpoints`,
    details,
  };
});

/* ================================================================== */
}
