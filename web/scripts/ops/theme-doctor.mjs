#!/usr/bin/env node
/**
 * Theme Doctor v7.1 — full-stack UI health check.
 *
 * Theme & Token (10 checks):
 *  1.  Attribute consistency     (data-theme / data-mode / data-appearance)
 *  2.  @theme inline usage       (TW4 runtime variable resolution)
 *  3.  @custom-variant dark      (data-mode selector)
 *  4.  Token format drift        (Figma raw ↔ DTCG code)
 *  5.  Surface tone integrity    (dark-mode tones ≠ light defaults)
 *  6.  Token bridge staleness    (fallback values ≠ theme.css defaults)
 *  7.  displayName coverage      (exported components missing displayName)
 *  8.  Hardcoded color leaks     (production TSX using inline hex/rgb)
 *  9.  Provider race condition   (shell ThemeProvider data-mode)
 *  10. Duplicate tsconfig keys
 *
 * TW4 Native (3 checks):
 *  11. Deprecated TW3 classes    (shadow-sm→shadow-xs, rounded-sm→rounded-xs)
 *  12. Deprecated TW3 directives (@apply, @screen, @variants, @responsive)
 *  13. PostCSS config            (@tailwindcss/postcss plugin)
 *
 * Component Quality (3 checks):
 *  14. Bundle size limits        (.size-limit.json presence + thresholds)
 *  15. Test fixture colors       (hardcoded hex in visual test files)
 *  16. forwardRef coverage       (interactive components)
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
import { register as checks_theme_token } from './theme-doctor/checks-theme-token.mjs';
import { register as checks_tw4_native } from './theme-doctor/checks-tw4-native.mjs';
import { register as checks_component_quality } from './theme-doctor/checks-component-quality.mjs';
import { register as checks_tw4_behavior } from './theme-doctor/checks-tw4-behavior.mjs';
import { register as checks_tw4_compliance } from './theme-doctor/checks-tw4-compliance.mjs';
import { register as checks_token_arch_1 } from './theme-doctor/checks-token-arch-1.mjs';
import { register as checks_token_arch_2 } from './theme-doctor/checks-token-arch-2.mjs';
import { register as checks_token_quality } from './theme-doctor/checks-token-quality.mjs';
import { register as checks_api_health } from './theme-doctor/checks-api-health.mjs';
import { register as checks_token_gaps } from './theme-doctor/checks-token-gaps.mjs';
import { register as checks_preview_coverage } from './theme-doctor/checks-preview-coverage.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..', '..');
const DS_SRC = join(ROOT, 'packages', 'design-system', 'src');
const SHELL_STYLES = join(ROOT, 'apps', 'mfe-shell', 'src', 'styles');
const SHELL_INDEX_CSS = join(ROOT, 'apps', 'mfe-shell', 'src', 'index.css');
const FIGMA_PATH = join(ROOT, 'design-tokens', 'figma.tokens.json');
const THEME_CSS = join(SHELL_STYLES, 'theme.css');
const TOKEN_BRIDGE_CSS = join(SHELL_STYLES, 'token-bridge.css');
const TOKENS_CSS = join(ROOT, 'packages', 'design-system', 'src', 'tokens', 'build', 'tokens.css');
const THEME_INLINE_CSS = join(SHELL_STYLES, 'generated-theme-inline.css');

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


function extractCSSVars(css) {
  const vars = new Set();
  for (const m of css.matchAll(/--([a-z][a-z0-9-]*)/g)) vars.add(m[1]);
  return vars;
}


const ctx = {
  check, readSafe, srgbToHex, parseCssVarsFlat, walkDir, extractCSSVars,
  ROOT, DS_SRC, SHELL_STYLES, SHELL_INDEX_CSS, FIGMA_PATH,
  THEME_CSS, TOKEN_BRIDGE_CSS, TOKENS_CSS, THEME_INLINE_CSS, FIX_HINT,
};

checks_theme_token(ctx);
checks_tw4_native(ctx);
checks_component_quality(ctx);
checks_tw4_behavior(ctx);
checks_tw4_compliance(ctx);
checks_token_arch_1(ctx);
checks_token_arch_2(ctx);
checks_token_quality(ctx);
checks_api_health(ctx);
checks_token_gaps(ctx);
checks_preview_coverage(ctx);

/* ------------------------------------------------------------------ */
/*  Report                                                             */
/* ------------------------------------------------------------------ */

if (JSON_MODE) {
  const report = {
    tool: 'theme-doctor',
    version: '7.1.0',
    timestamp: new Date().toISOString(),
    summary: { pass: passCount, warn: warnCount, fail: failCount, total: results.length },
    checks: results,
  };
  console.log(JSON.stringify(report, null, 2));
} else {
  console.log('');
  console.log('╔══════════════════════════════════════════════════════════════╗');
  console.log(`║         🩺 Theme Doctor v7.1 (${results.length} checks)                ║`);
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
