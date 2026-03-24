#!/usr/bin/env node
/**
 * Semantic token pipeline: reads design-tokens/figma.tokens.json and produces
 * apps/mfe-shell/src/styles/theme.css. CSS variables are derived from semantic
 * paths (color.surface.default.bg -> --surface-default-bg) and grouped per
 * runtime axis (appearance/density/radius/elevation/motion).
 */
import { fileURLToPath } from 'url';
import fs from 'fs';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..', '..');

const TOKEN_FILE = path.resolve(repoRoot, 'design-tokens/figma.tokens.json');
const OUTPUT_CSS = path.resolve(repoRoot, 'apps/mfe-shell/src/styles/theme.css');
const OUTPUT_CONTRACT = path.resolve(repoRoot, 'design-tokens/generated/theme-contract.json');

const isCheckMode = process.argv.includes('--check');

const AXIS_ATTRIBUTE = {
  radius: 'data-radius',
  density: 'data-density',
  elevation: 'data-elevation',
  motion: 'data-motion',
};

const tokens = JSON.parse(fs.readFileSync(TOKEN_FILE, 'utf8'));
const themeContract = tokens?.meta?.themeContract;
if (!themeContract || typeof themeContract !== 'object') {
  throw new Error('⚠️ meta.themeContract missing in figma.tokens.json (required for single-chain).');
}

const colorTokens = flattenSemantic(tokens.semantic.color, ['color']);
const axisTokens = {
  radius: flattenSemantic(tokens.semantic.radius, ['radius']),
  density: flattenSemantic(tokens.semantic.density, ['density']),
  elevation: flattenSemantic(tokens.semantic.elevation, ['elevation']),
  motion: flattenSemantic(tokens.semantic.motion, ['motion']),
};
const accentPalettes = extractAccentPalettes(tokens);
const surfaceTones = tokens?.semantic?.color?.surface?.tones ?? {};

const cssChunks = [];
cssChunks.push('/* ⚠️ Auto-generated via scripts/theme/generate-theme-css.mjs. Do NOT edit manually. */');
cssChunks.push('');

const appearanceThemes = extractAppearanceModes(tokens);
if (appearanceThemes.length === 0) {
  throw new Error('⚠️ No appearance themes found in figma.tokens.json (semantic.color.surface.default.bg.modes)');
}

const overlayConfig = extractOverlayConfig(tokens, appearanceThemes[0]);

const defaultAppearance = appearanceThemes[0];
const rootDeclarations = buildDeclarations(colorTokens, defaultAppearance);
if (accentPalettes.length > 0) {
  const [defaultAccent] = accentPalettes;
  rootDeclarations.push(...buildAccentDeclarations(defaultAccent.entry, defaultAccent.key));
}
rootDeclarations.push(`  --font-family-base: ${resolveValue('{raw.typography.font.family.base}')};`);
rootDeclarations.push('  --surface-page-bg: var(--surface-default-bg);');
pushBlock(':root', rootDeclarations);

for (const theme of appearanceThemes) {
  const selector = `:root[data-theme="${theme}"], [data-theme-scope][data-theme="${theme}"]`;
  pushBlock(selector, buildDeclarations(colorTokens, theme));
}

for (const [axis, entries] of Object.entries(axisTokens)) {
  const attr = AXIS_ATTRIBUTE[axis];
  if (!attr || entries.length === 0) continue;
  const modes = collectModes(entries);
  for (const mode of modes) {
    const selector = `:root[${attr}="${mode}"], [data-theme-scope][${attr}="${mode}"]`;
    pushBlock(selector, buildDeclarations(entries, mode));
  }
}

if (Object.keys(surfaceTones).length > 0) {
  for (const [toneKey, toneEntry] of Object.entries(surfaceTones)) {
    /* Resolve the default (light) tone value for duplicate detection */
    const defaultToneResolved = resolveValue(toneEntry?.modes?.[defaultAppearance]?.value);

    for (const theme of appearanceThemes) {
      const toneMode = toneEntry?.modes?.[theme];
      if (!toneMode) continue;
      const resolved = resolveValue(toneMode.value);

      /* Skip if dark/hc tone value is identical to the light default — the
         Figma token source hasn't defined a mode-specific dark tone yet, so
         emitting an override here would clobber the dark surface colors with
         light values. Let the base dark mode block win instead. */
      const modeInfo = themeContract.modes?.[theme];
      const isDark = modeInfo?.appearance === 'dark' || modeInfo?.isHighContrast;
      if (isDark && defaultToneResolved && resolved === defaultToneResolved) continue;

      const selector = `:root[data-theme="${theme}"][data-surface-tone="${toneKey}"], [data-theme-scope][data-theme="${theme}"][data-surface-tone="${toneKey}"]`;
      pushBlock(selector, [
        `  --surface-default-bg: ${resolved};`,
        `  --surface-raised-bg: ${resolved};`,
        `  --surface-muted-bg: ${resolved};`,
        `  --surface-panel-bg: ${resolved};`,
        `  --surface-header-bg: ${resolved};`,
      ]);
    }
  }
}

/* ---- Token Bridge: component-level aliases ---- */
/* Components use short names (--action-primary) set by ThemeProvider at runtime.
   These aliases bridge theme.css names (--action-primary-bg) to component names
   so components render correctly before ThemeProvider mounts. */

/**
 * Bridge alias definitions: [aliasVar, varExpression, ...semanticTokenPaths]
 * semanticTokenPaths are used to resolve the dark-mode value from the token tree.
 * The first resolvable path wins.
 */
const bridgeAliases = [
  // Action
  ['--action-primary', 'var(--action-primary-bg, var(--accent-primary))', ['color.action.primary.bg']],
  ['--action-primary-hover', 'var(--accent-primary-hover)', ['color.action.primary.hover.bg']],
  ['--action-primary-active', 'var(--accent-primary-hover)', ['color.action.primary.hover.bg']],
  ['--action-primary-soft', 'var(--accent-soft)', ['color.action.primary.soft.bg']],
  ['--action-secondary', 'var(--action-secondary-bg)', ['color.action.secondary.bg']],
  // Surface
  ['--surface-canvas', 'var(--surface-default-bg)', ['color.surface.default.bg']],
  ['--surface-raised', 'var(--surface-raised-bg)', ['color.surface.raised.bg']],
  ['--surface-page', 'var(--surface-page-bg, var(--surface-default-bg))', ['color.surface.default.bg']],
  ['--surface-overlay', 'var(--surface-overlay-bg)', ['color.surface.overlay.bg']],
  ['--surface-primary', 'var(--action-primary-bg, var(--accent-primary))', ['color.action.primary.bg']],
  ['--surface-accent', 'var(--accent-soft)', ['color.action.primary.soft.bg']],
  ['--surface-active', 'var(--selection-bg)', ['color.selection.bg']],
  ['--surface-inverse', 'var(--surface-overlay-bg)', ['color.surface.overlay.bg']],
  // Text
  ['--text-disabled', 'var(--text-subtle)', ['color.text.subtle']],
  ['--text-tertiary', 'var(--text-subtle)', ['color.text.subtle']],
  ['--text-placeholder', 'var(--text-subtle)', ['color.text.subtle']],
  ['--text-danger', 'var(--state-danger-text)', ['color.state.danger.text']],
  // Border
  ['--border-strong', 'var(--border-bold)', ['color.border.bold']],
  ['--border-active', 'var(--selection-outline)', ['color.selection.outline']],
  ['--border-hover', 'var(--border-default)', ['color.border.default']],
  ['--border-error', 'var(--state-danger-border)', ['color.state.danger.border']],
  ['--border-danger', 'var(--state-danger-border)', ['color.state.danger.border']],
  // Focus
  ['--focus-ring', 'var(--focus-outline)', ['color.focus.outline']],
  // State error → danger bridge
  ['--state-error-bg', 'var(--state-danger-bg)', ['color.state.danger.bg']],
  ['--state-error-text', 'var(--state-danger-text)', ['color.state.danger.text']],
  ['--state-error-border', 'var(--state-danger-border)', ['color.state.danger.border']],
  // State short aliases
  ['--state-danger', 'var(--state-danger-text)', ['color.state.danger.text']],
  ['--state-success', 'var(--state-success-text)', ['color.state.success.text']],
  ['--state-warning', 'var(--state-warning-text)', ['color.state.warning.text']],
  ['--state-info', 'var(--state-info-text)', ['color.state.info.text']],
  // Feedback aliases
  ['--feedback-error', 'var(--state-danger-text)', ['color.state.danger.text']],
  ['--feedback-success', 'var(--state-success-text)', ['color.state.success.text']],
  ['--feedback-warning', 'var(--state-warning-text)', ['color.state.warning.text']],
  ['--feedback-info', 'var(--state-info-text)', ['color.state.info.text']],
  // Legacy
  ['--danger-color', 'var(--state-danger-text)', ['color.state.danger.text']],
  ['--success-color', 'var(--state-success-text)', ['color.state.success.text']],
  ['--warning-color', 'var(--state-warning-text)', ['color.state.warning.text']],
  ['--info-color', 'var(--state-info-text)', ['color.state.info.text']],
  ['--bg-primary', 'var(--action-primary-bg, var(--accent-primary))', ['color.action.primary.bg']],
  ['--ring-primary', 'var(--action-primary-bg, var(--accent-primary))', ['color.action.primary.bg']],
  ['--ring-focus', 'var(--focus-outline)', ['color.focus.outline']],
  ['--ring-error', 'var(--state-danger-border)', ['color.state.danger.border']],
  ['--ring-color', 'var(--focus-outline)', ['color.focus.outline']],
  ['--accent-primary-muted', 'var(--accent-soft)', ['color.action.primary.soft.bg']],
];

/* Group aliases by category for readability in output */
const bridgeCategoryBreaks = {
  '--action-primary': '/* Action */',
  '--surface-canvas': '/* Surface */',
  '--text-disabled': '/* Text */',
  '--border-strong': '/* Border */',
  '--focus-ring': '/* Focus */',
  '--state-error-bg': '/* State error → danger bridge */',
  '--state-danger': '/* State short aliases */',
  '--feedback-error': '/* Feedback aliases */',
  '--danger-color': '/* Legacy */',
};

/* Build :root bridge block (no terminal hex fallbacks) */
const bridgeLines = ['/* Token Bridge — component-level aliases (Faz 0A.1) */'];
bridgeLines.push(':root {');
for (const [alias, expr] of bridgeAliases) {
  if (bridgeCategoryBreaks[alias]) {
    bridgeLines.push(`  ${bridgeCategoryBreaks[alias]}`);
  }
  bridgeLines.push(`  ${alias}: ${expr};`);
}
bridgeLines.push('}');

cssChunks.push('');
cssChunks.push(...bridgeLines);
cssChunks.push('');

/* Build [data-mode="dark"] bridge overrides from token tree */
const darkAppearanceKey = Object.entries(themeContract.modes || {})
  .find(([, info]) => info.appearance === 'dark')?.[0];

if (darkAppearanceKey) {
  const darkBridgeLines = [];
  darkBridgeLines.push('/* Dark mode bridge overrides */');
  darkBridgeLines.push('[data-mode="dark"] {');

  for (const [alias, , tokenPaths] of bridgeAliases) {
    if (!tokenPaths || tokenPaths.length === 0) continue;
    let resolved = null;
    for (const tokenPath of tokenPaths) {
      const segments = ['semantic'].concat(tokenPath.split('.'));
      let node = tokens;
      let valid = true;
      for (const seg of segments) {
        if (node && typeof node === 'object' && seg in node) {
          node = node[seg];
        } else {
          valid = false;
          break;
        }
      }
      if (valid && node?.modes?.[darkAppearanceKey]) {
        try {
          resolved = resolveValue(node.modes[darkAppearanceKey].value);
        } catch {
          resolved = null;
        }
        if (resolved) break;
      }
    }
    if (resolved) {
      darkBridgeLines.push(`  ${alias}: ${resolved};`);
    }
  }

  darkBridgeLines.push('}');
  cssChunks.push(...darkBridgeLines);
  cssChunks.push('');
}

while (cssChunks.at(-1) === '') {
  cssChunks.pop();
}

// Overlay intensity/opacity guardrails + default table surface tone
cssChunks.push('');
cssChunks.push('html {');
cssChunks.push(`  --overlay-intensity-min: ${overlayConfig.min};`);
cssChunks.push(`  --overlay-intensity-max: ${overlayConfig.max};`);
cssChunks.push(`  --overlay-intensity-default: ${overlayConfig.defaultIntensity};`);
cssChunks.push(`  --overlay-opacity-default: ${overlayConfig.defaultOpacity};`);
cssChunks.push('  --overlay-intensity: var(--overlay-intensity-default);');
cssChunks.push('  --overlay-opacity: calc(var(--overlay-opacity-default) / 100);');
cssChunks.push('  --table-surface-border: var(--border-subtle);');
cssChunks.push('  --table-surface-bg: var(--surface-table-normal-bg);');
cssChunks.push('}');
cssChunks.push('');
cssChunks.push(':root[data-table-surface-tone="soft"], [data-theme-scope][data-table-surface-tone="soft"] {');
cssChunks.push('  --table-surface-bg: var(--surface-table-soft-bg);');
cssChunks.push('}');
cssChunks.push('');
cssChunks.push(':root[data-table-surface-tone="strong"], [data-theme-scope][data-table-surface-tone="strong"] {');
cssChunks.push('  --table-surface-bg: var(--surface-table-strong-bg);');
cssChunks.push('}');
cssChunks.push('');
cssChunks.push(':root[data-table-surface-tone="normal"], [data-theme-scope][data-table-surface-tone="normal"] {');
cssChunks.push('  --table-surface-bg: var(--surface-table-normal-bg);');
cssChunks.push('}');
cssChunks.push('');

if (accentPalettes.length > 0) {
  for (const palette of accentPalettes) {
    const selector = `:root[data-accent="${palette.key}"], [data-theme-scope][data-accent="${palette.key}"]`;
    pushBlock(selector, buildAccentDeclarations(palette.entry, palette.key));
  }
}

const cssOutput = cssChunks.filter((line, index) => !(line === '' && cssChunks[index - 1] === '')).join('\n');
const cssWithEol = `${cssOutput}\n`;
const contractWithEol = `${JSON.stringify(themeContract, null, 2)}\n`;

if (isCheckMode) {
  const errors = [];
  try {
    const existingCss = fs.readFileSync(OUTPUT_CSS, 'utf8');
    if (existingCss !== cssWithEol) {
      errors.push(`- Drift: ${path.relative(repoRoot, OUTPUT_CSS)} generated output is not up to date.`);
    }
  } catch {
    errors.push(`- Missing: ${path.relative(repoRoot, OUTPUT_CSS)} does not exist.`);
  }

  try {
    const existingContract = fs.readFileSync(OUTPUT_CONTRACT, 'utf8');
    if (existingContract !== contractWithEol) {
      errors.push(`- Drift: ${path.relative(repoRoot, OUTPUT_CONTRACT)} generated output is not up to date.`);
    }
  } catch {
    errors.push(`- Missing: ${path.relative(repoRoot, OUTPUT_CONTRACT)} does not exist.`);
  }

  if (errors.length > 0) {
    console.error('❌ Theme tokens build drift detected (run: npm -C web run tokens:build)');
    errors.forEach((line) => console.error(line));
    process.exit(1);
  }

  console.log(`✅ tokens:build --check OK (${path.relative(repoRoot, OUTPUT_CSS)}, ${path.relative(repoRoot, OUTPUT_CONTRACT)})`);
} else {
  fs.mkdirSync(path.dirname(OUTPUT_CONTRACT), { recursive: true });
  fs.writeFileSync(OUTPUT_CONTRACT, contractWithEol);
  fs.writeFileSync(OUTPUT_CSS, cssWithEol);
  console.log(`✅ Generated ${path.relative(repoRoot, OUTPUT_CSS)} from ${path.relative(repoRoot, TOKEN_FILE)}`);
  console.log(`✅ Generated ${path.relative(repoRoot, OUTPUT_CONTRACT)} from ${path.relative(repoRoot, TOKEN_FILE)}`);
}

function flattenSemantic(node, pathSegments = [], acc = []) {
  if (!node || typeof node !== 'object') return acc;
  if (node.modes) {
    acc.push({ path: pathSegments, modes: node.modes });
    return acc;
  }
  for (const [key, value] of Object.entries(node)) {
    flattenSemantic(value, pathSegments.concat(key), acc);
  }
  return acc;
}

function extractAppearanceModes(root) {
  const modes = root?.semantic?.color?.surface?.default?.bg?.modes;
  if (!modes || typeof modes !== 'object') {
    return [];
  }
  return Object.keys(modes);
}

function extractOverlayConfig(root, appearanceKey) {
  const intensityNode = root?.semantic?.color?.overlay?.intensity;
  const opacityNode = root?.semantic?.color?.overlay?.opacity;

  const pickByAppearance = (node) => {
    const modes = node?.modes || {};
    if (appearanceKey && modes[appearanceKey]) {
      return resolveValue(modes[appearanceKey].value);
    }
    const first = Object.values(modes)[0];
    return first ? resolveValue(first.value) : undefined;
  };

  const toNumber = (val, label) => {
    const num = typeof val === 'number' ? val : Number.parseFloat(String(val));
    if (Number.isFinite(num)) return num;
    throw new Error(`⚠️ Overlay ${label} could not be parsed to number (got: ${val})`);
  };

  const min = toNumber(pickByAppearance(intensityNode?.min), 'intensity.min');
  const max = toNumber(pickByAppearance(intensityNode?.max), 'intensity.max');
  const defaultIntensity = toNumber(
    pickByAppearance(intensityNode?.default) ?? min,
    'intensity.default',
  );
  const defaultOpacity = toNumber(
    pickByAppearance(opacityNode?.default) ?? 10,
    'opacity.default',
  );

  return { min, max, defaultIntensity, defaultOpacity };
}

function buildDeclarations(entries, mode) {
  const lines = [];
  for (const entry of entries) {
    const valueNode = entry.modes?.[mode];
    if (!valueNode) continue;
    const resolved = resolveValue(valueNode.value);
    const varName = toVarName(entry.path);
    lines.push(`  ${varName}: ${resolved};`);
  }
  return lines;
}

function extractAccentPalettes(root) {
  const accentRoot = root?.semantic?.theme?.accent ?? {};
  return Object.entries(accentRoot).map(([key, entry]) => ({ key, entry }));
}

function buildAccentDeclarations(entry, key) {
  const mappings = {
    primary: '--accent-primary',
    'primary-hover': '--accent-primary-hover',
    focus: '--accent-focus',
    soft: '--accent-soft',
  };
  const lines = [];
  for (const [tokenKey, varName] of Object.entries(mappings)) {
    if (!entry?.[tokenKey]) continue;
    const value = resolveValue(entry[tokenKey].value);
    lines.push(`  ${varName}: ${value};`);
  }
  if (lines.length === 0) {
    console.warn(`⚠️ No accent values found for palette "${key}"`);
  }
  return lines;
}

function collectModes(entries) {
  return Array.from(
    entries.reduce((set, entry) => {
      Object.keys(entry.modes || {}).forEach((m) => set.add(m));
      return set;
    }, new Set()),
  );
}

function toVarName(pathSegments) {
  const segments = pathSegments[0] === 'color' ? pathSegments.slice(1) : pathSegments;
  return `--${segments.join('-')}`;
}

function resolveValue(value) {
  if (typeof value !== 'string') {
    return value;
  }
  const refPattern = /^\{([^}]+)\}$/;
  const match = value.match(refPattern);
  if (!match) {
    return normalizeCssValue(value);
  }
  const refPath = match[1];
  const resolved = lookupPath(tokens, refPath.split('.'));
  if (resolved && typeof resolved.value !== 'undefined') {
    return normalizeCssValue(resolved.value);
  }
  throw new Error(`⚠️ Unable to resolve reference "${value}"`);
}

function lookupPath(root, segments) {
  return segments.reduce((node, key) => {
    if (!node || typeof node !== 'object') {
      throw new Error(`⚠️ Invalid token reference at ${segments.join('.')}`);
    }
    if (!(key in node)) {
      throw new Error(`⚠️ Missing key "${key}" in reference ${segments.join('.')}`);
    }
    return node[key];
  }, root);
}

function formatBlock(selector, declarations) {
  if (!declarations.length) {
    return '';
  }
  return `${selector} {\n${declarations.join('\n')}\n}`;
}

function pushBlock(selector, declarations) {
  const block = formatBlock(selector, declarations);
  if (block) {
    cssChunks.push(block);
    cssChunks.push('');
  }
}

function normalizeCssValue(raw) {
  if (typeof raw !== 'string') {
    return raw;
  }
  const value = raw.trim();
  if (value.startsWith('var(') || value === 'transparent' || value === 'none' || value === 'inherit') {
    return value;
  }
  const hexMatch = value.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
  if (hexMatch) {
    return hexToColor(hexMatch[1]);
  }
  const rgbaMatch = value.match(/^rgba?\(([^)]+)\)$/i);
  if (rgbaMatch) {
    const [r = '0', g = '0', b = '0', a = '1'] = rgbaMatch[1]
      .split(',')
      .map((segment) => segment.trim());
    return formatColor(
      parseFloat(r),
      parseFloat(g),
      parseFloat(b),
      rgbaMatch[0].toLowerCase().startsWith('rgba') ? parseFloat(a) : 1,
    );
  }
  const inlinePattern = /rgba?\([^)]+\)|#([0-9a-f]{3}|[0-9a-f]{6})/gi;
  if (inlinePattern.test(value)) {
    return value.replace(inlinePattern, (match) => {
      const hex = match.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
      if (hex) {
        return hexToColor(hex[1]);
      }
      const rgba = match.match(/^rgba?\(([^)]+)\)$/i);
      if (rgba) {
        const [r = '0', g = '0', b = '0', a = '1'] = rgba[1].split(',').map((segment) => segment.trim());
        return formatColor(
          parseFloat(r),
          parseFloat(g),
          parseFloat(b),
          rgba[0].toLowerCase().startsWith('rgba') ? parseFloat(a) : 1,
        );
      }
      return match;
    });
  }
  return value;
}

function hexToColor(hex) {
  const normalized = hex.length === 3 ? hex.split('').map((ch) => ch + ch).join('') : hex;
  const r = parseInt(normalized.slice(0, 2), 16);
  const g = parseInt(normalized.slice(2, 4), 16);
  const b = parseInt(normalized.slice(4, 6), 16);
  return formatColor(r, g, b, 1);
}

function formatColor(r, g, b, a = 1) {
  const toUnit = (component) => {
    const clamped = Math.max(0, Math.min(255, component));
    const unit = clamped / 255;
    return unit === 0 ? '0' : unit === 1 ? '1' : unit.toFixed(4).replace(/0+$/, '').replace(/\.$/, '');
  };
  const alpha = Math.max(0, Math.min(1, Number.isFinite(a) ? a : 1));
  const parts = [toUnit(r), toUnit(g), toUnit(b)];
  const alphaPart =
    alpha >= 1
      ? ''
      : ` / ${Math.round(alpha * 10000) / 100}%`;
  return `color(srgb ${parts.join(' ')}${alphaPart})`;
}
