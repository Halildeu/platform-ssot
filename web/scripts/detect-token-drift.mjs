#!/usr/bin/env node
/**
 * Design Drift Detection
 *
 * Compares design-tokens/figma.tokens.json (Figma source of truth)
 * with packages/design-system/tokens/dtcg/*.json (code tokens).
 *
 * Detects:
 *   - Tokens in Figma not in code (drift: missing)
 *   - Tokens in code not in Figma (drift: orphaned)
 *   - Tokens with different values (drift: value mismatch)
 *
 * Exit 0 if no drift, 1 if drift found.
 */

import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const FIGMA_PATH = join(ROOT, 'design-tokens', 'figma.tokens.json');
const DTCG_DIR = join(ROOT, 'packages', 'design-system', 'tokens', 'dtcg');

/* ------------------------------------------------------------------ */
/*  Flatten helpers                                                    */
/* ------------------------------------------------------------------ */

/**
 * Flatten Figma raw tokens (format: { value: "..." }) into dot-path → value map.
 * Only processes the "raw" section since that is the source primitive palette.
 */
function flattenFigmaRaw(obj, prefix = '') {
  const result = {};
  for (const [key, value] of Object.entries(obj)) {
    const path = prefix ? `${prefix}.${key}` : key;

    if (value && typeof value === 'object' && 'value' in value) {
      // Leaf token in Figma format
      result[path] = normalizeValue(value.value);
    } else if (value && typeof value === 'object') {
      Object.assign(result, flattenFigmaRaw(value, path));
    }
  }
  return result;
}

/**
 * Flatten DTCG tokens ($value/$type format) into dot-path → value map.
 */
function flattenDtcg(obj, prefix = '') {
  const result = {};
  for (const [key, value] of Object.entries(obj)) {
    if (key.startsWith('$')) continue;
    const path = prefix ? `${prefix}.${key}` : key;

    if (value && typeof value === 'object' && '$value' in value) {
      result[path] = normalizeValue(value.$value);
    } else if (value && typeof value === 'object') {
      Object.assign(result, flattenDtcg(value, path));
    }
  }
  return result;
}

/**
 * Normalize values for comparison — stringify objects/arrays, lowercase strings.
 */
function normalizeValue(val) {
  if (val === null || val === undefined) return '';
  if (typeof val === 'object') return JSON.stringify(val);
  return String(val).toLowerCase().trim();
}

/* ------------------------------------------------------------------ */
/*  Map Figma raw keys → DTCG keys                                    */
/* ------------------------------------------------------------------ */

/**
 * The Figma raw section uses a different namespace structure than DTCG.
 * This builds a best-effort mapping from figma raw flat keys to DTCG flat keys.
 *
 * Figma raw:  color.brand.primary.500 → DTCG: color.primary.500
 * Figma raw:  radius.sm              → DTCG: radius.sm
 * Figma raw:  space.1                → DTCG: spacing.1
 * etc.
 */
function buildKeyMap(figmaKeys, dtcgKeys) {
  const dtcgSet = new Set(dtcgKeys);
  const map = new Map();

  for (const fk of figmaKeys) {
    // Direct match
    if (dtcgSet.has(fk)) {
      map.set(fk, fk);
      continue;
    }

    // Try common renames (Figma namespace → DTCG namespace)
    const candidates = [
      fk,
      /* Color namespace renames */
      fk.replace(/^color\.brand\./, 'color.'),
      fk.replace(/^color\.neutral\./, 'color.gray.'),
      fk.replace(/^color\.info\./, 'color.blue.'),
      fk.replace(/^color\.success\./, 'color.green.'),
      fk.replace(/^color\.warning\./, 'color.amber.'),
      fk.replace(/^color\.danger\./, 'color.red.'),
      /* Special color aliases */
      ...(fk === 'color.neutral.0' ? ['color.white'] : []),
      ...(fk === 'color.black' ? ['color.black'] : []),
      /* Space/Spacing namespace (Figma uses dot for fractions: 0.5, DTCG uses dash: 0-5) */
      fk.replace(/^space\./, 'spacing.'),
      fk.replace(/^space\.(\d+)\.(\d+)$/, 'spacing.$1-$2'),
      /* Shadow/Elevation namespace */
      fk.replace(/^shadow\./, 'elevation.'),
      /* Typography namespace renames */
      fk.replace(/^typography\.font\.family\./, 'typography.fontFamily.'),
      fk.replace(/^typography\.font\.size\./, 'typography.fontSize.'),
      fk.replace(/^typography\.font\.weight\./, 'typography.fontWeight.'),
      fk.replace(/^typography\./, 'typography.'),
      /* Motion namespace */
      fk.replace(/^motion\.easing\./, 'motion.easing.'),
      fk.replace(/^motion\.duration\./, 'motion.duration.'),
      /* Motion name aliases */
      ...(fk === 'motion.easing.standard' ? ['motion.easing.default'] : []),
      ...(fk === 'motion.easing.enter' ? ['motion.easing.in'] : []),
      ...(fk === 'motion.easing.exit' ? ['motion.easing.out'] : []),
      ...(fk === 'motion.duration.medium' ? ['motion.duration.normal'] : []),
      /* Typography aliases */
      ...(fk === 'typography.font.family.base' ? ['typography.fontFamily.base', 'typography.fontFamily.sans'] : []),
      ...(fk === 'typography.font.family.sans' ? ['typography.fontFamily.sans'] : []),
      ...(fk === 'typography.font.family.mono' ? ['typography.fontFamily.mono'] : []),
    ];

    let matched = false;
    for (const candidate of candidates) {
      if (dtcgSet.has(candidate)) {
        map.set(fk, candidate);
        matched = true;
        break;
      }
    }

    if (!matched) {
      map.set(fk, null); // not found in DTCG
    }
  }

  return map;
}

/* ------------------------------------------------------------------ */
/*  Main                                                               */
/* ------------------------------------------------------------------ */

// Load Figma source
if (!existsSync(FIGMA_PATH)) {
  console.error(`Error: Figma tokens not found at ${FIGMA_PATH}`);
  process.exit(1);
}

let figmaData;
try {
  figmaData = JSON.parse(readFileSync(FIGMA_PATH, 'utf-8'));
} catch (err) {
  console.error(`Error parsing ${FIGMA_PATH}: ${err.message}`);
  process.exit(1);
}

// Only compare raw tokens (primitives) since semantic tokens are mode-dependent
const figmaRaw = figmaData.raw || {};
const figmaFlat = flattenFigmaRaw(figmaRaw);

// Load all DTCG files
let dtcgFiles;
try {
  dtcgFiles = readdirSync(DTCG_DIR).filter((f) => f.endsWith('.json'));
} catch {
  console.error(`Error: DTCG directory not found at ${DTCG_DIR}`);
  process.exit(1);
}

const dtcgFlat = {};
for (const file of dtcgFiles) {
  const filePath = join(DTCG_DIR, file);
  try {
    const data = JSON.parse(readFileSync(filePath, 'utf-8'));
    Object.assign(dtcgFlat, flattenDtcg(data));
  } catch (err) {
    console.error(`Error parsing ${filePath}: ${err.message}`);
  }
}

// Build mapping and detect drift
const figmaKeys = Object.keys(figmaFlat);
const dtcgKeys = Object.keys(dtcgFlat);
const keyMap = buildKeyMap(figmaKeys, dtcgKeys);

const missing = [];
const mismatched = [];
const mappedDtcgKeys = new Set();

for (const [figmaKey, dtcgKey] of keyMap) {
  if (dtcgKey === null) {
    missing.push(figmaKey);
  } else {
    mappedDtcgKeys.add(dtcgKey);
    const figmaVal = figmaFlat[figmaKey];
    const dtcgVal = dtcgFlat[dtcgKey];
    if (figmaVal !== dtcgVal) {
      mismatched.push({ figmaKey, dtcgKey, figmaVal, dtcgVal });
    }
  }
}

// Detect orphaned tokens (in DTCG but not traceable to Figma raw)
const orphaned = dtcgKeys.filter((k) => !mappedDtcgKeys.has(k));

/* ------------------------------------------------------------------ */
/*  Report                                                             */
/* ------------------------------------------------------------------ */

const hasDrift = missing.length > 0 || orphaned.length > 0 || mismatched.length > 0;

console.log(`\nDesign Token Drift Detection`);
console.log(`${'─'.repeat(50)}`);
console.log(`  Figma raw tokens:  ${figmaKeys.length}`);
console.log(`  DTCG tokens:       ${dtcgKeys.length}`);
console.log(`  Mapped:            ${mappedDtcgKeys.size}`);
console.log('');

if (missing.length > 0) {
  console.log(`  MISSING (in Figma, not in code): ${missing.length}`);
  for (const key of missing.slice(0, 20)) {
    console.log(`    - ${key}`);
  }
  if (missing.length > 20) console.log(`    ... and ${missing.length - 20} more`);
  console.log('');
}

if (orphaned.length > 0) {
  console.log(`  ORPHANED (in code, not in Figma): ${orphaned.length}`);
  for (const key of orphaned.slice(0, 20)) {
    console.log(`    + ${key}`);
  }
  if (orphaned.length > 20) console.log(`    ... and ${orphaned.length - 20} more`);
  console.log('');
}

if (mismatched.length > 0) {
  console.log(`  VALUE MISMATCH: ${mismatched.length}`);
  for (const { figmaKey, dtcgKey, figmaVal, dtcgVal } of mismatched.slice(0, 20)) {
    console.log(`    ~ ${figmaKey}`);
    console.log(`      Figma: ${figmaVal}`);
    console.log(`      Code:  ${dtcgVal}`);
  }
  if (mismatched.length > 20) console.log(`    ... and ${mismatched.length - 20} more`);
  console.log('');
}

const totalDrift = hasDrift;

if (!totalDrift) {
  console.log(`  Status: NO DRIFT — Figma and code tokens are in sync`);
  console.log('');
  process.exit(0);
} else {
  console.log(`  Status: DRIFT DETECTED`);
  console.log(`    Missing:        ${missing.length}`);
  console.log(`    Orphaned:       ${orphaned.length}`);
  console.log(`    Mismatch:       ${mismatched.length}`);
  console.log(`    Semantic CSS:   ${semanticDriftCount}`);
  console.log('');
  process.exit(1);
}
