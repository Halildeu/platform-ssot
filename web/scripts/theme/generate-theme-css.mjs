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
    for (const theme of appearanceThemes) {
      const toneMode = toneEntry?.modes?.[theme];
      if (!toneMode) continue;
      const resolved = resolveValue(toneMode.value);
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
const bridgeBlock = [
  '/* Token Bridge — component-level aliases (Faz 0A.1) */',
  ':root {',
  '  /* Action */',
  '  --action-primary: var(--action-primary-bg, var(--accent-primary, #2b6cb0));',
  '  --action-primary-hover: var(--accent-primary-hover, #1a5490);',
  '  --action-primary-active: var(--accent-primary-hover, #155080);',
  '  --action-primary-soft: var(--accent-soft, rgba(43, 108, 176, 0.12));',
  '  --action-secondary: var(--action-secondary-bg, #f1f5f9);',
  '  /* Surface */',
  '  --surface-canvas: var(--surface-default-bg, #ffffff);',
  '  --surface-raised: var(--surface-raised-bg, #ffffff);',
  '  --surface-page: var(--surface-page-bg, var(--surface-default-bg, #ffffff));',
  '  --surface-overlay: var(--surface-overlay-bg, rgba(15, 23, 42, 0.6));',
  '  --surface-primary: var(--action-primary-bg, var(--accent-primary, #2b6cb0));',
  '  --surface-accent: var(--accent-soft, rgba(43, 108, 176, 0.08));',
  '  --surface-active: var(--selection-bg, rgba(219, 234, 254, 0.6));',
  '  --surface-inverse: var(--surface-overlay-bg, #0f172a);',
  '  /* Text */',
  '  --text-disabled: var(--text-subtle, #64748b);',
  '  --text-tertiary: var(--text-subtle, #64748b);',
  '  --text-placeholder: var(--text-subtle, #94a3b8);',
  '  --text-danger: var(--state-danger-text, #e53e3e);',
  '  /* Border */',
  '  --border-strong: var(--border-bold, #2c5282);',
  '  --border-active: var(--selection-outline, #2b6cb0);',
  '  --border-hover: var(--border-default, #cbd5e1);',
  '  --border-error: var(--state-danger-border, #e53e3e);',
  '  --border-danger: var(--state-danger-border, #e53e3e);',
  '  /* Focus */',
  '  --focus-ring: var(--focus-outline, #2c5282);',
  '  /* State error → danger bridge */',
  '  --state-error-bg: var(--state-danger-bg, rgba(229, 62, 62, 0.12));',
  '  --state-error-text: var(--state-danger-text, #e53e3e);',
  '  --state-error-border: var(--state-danger-border, #e53e3e);',
  '  /* State short aliases */',
  '  --state-danger: var(--state-danger-text, #e53e3e);',
  '  --state-success: var(--state-success-text, #38a169);',
  '  --state-warning: var(--state-warning-text, #dd6b20);',
  '  --state-info: var(--state-info-text, #3182ce);',
  '  /* Feedback aliases */',
  '  --feedback-error: var(--state-danger-text, #e53e3e);',
  '  --feedback-success: var(--state-success-text, #38a169);',
  '  --feedback-warning: var(--state-warning-text, #dd6b20);',
  '  --feedback-info: var(--state-info-text, #3182ce);',
  '  /* Legacy */',
  '  --danger-color: var(--state-danger-text, #e53e3e);',
  '  --success-color: var(--state-success-text, #38a169);',
  '  --warning-color: var(--state-warning-text, #dd6b20);',
  '  --info-color: var(--state-info-text, #3182ce);',
  '  --bg-primary: var(--action-primary-bg, var(--accent-primary, #2b6cb0));',
  '  --ring-primary: var(--action-primary-bg, var(--accent-primary, #2b6cb0));',
  '  --ring-focus: var(--focus-outline, #2c5282);',
  '  --ring-error: var(--state-danger-border, #e53e3e);',
  '  --ring-color: var(--focus-outline, #2c5282);',
  '  --accent-primary-muted: var(--accent-soft, rgba(43, 108, 176, 0.15));',
  '}',
];
cssChunks.push('');
cssChunks.push(...bridgeBlock);
cssChunks.push('');

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
