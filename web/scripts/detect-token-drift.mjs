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

import {
  flattenFigmaRaw,
  flattenDtcg,
  _normalizeValue,
  buildKeyMap,
} from './tokens/shared-flatten.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const FIGMA_PATH = join(ROOT, 'design-tokens', 'figma.tokens.json');
const DTCG_DIR = join(ROOT, 'packages', 'design-system', 'tokens', 'dtcg');

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
  for (const { figmaKey, dtcgKey: _dtcgKey, figmaVal, dtcgVal } of mismatched.slice(0, 20)) {
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
  console.log('');
  process.exit(1);
}
