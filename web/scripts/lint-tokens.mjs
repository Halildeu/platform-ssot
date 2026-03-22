#!/usr/bin/env node
/**
 * Token Lint — DTCG schema validation
 *
 * Reads all JSON files in packages/design-system/tokens/dtcg/
 * and validates that every leaf token has $value and $type,
 * with $type being a valid DTCG type.
 *
 * Exit 0 if valid, 1 if errors found.
 */

import { readdirSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DTCG_DIR = join(__dirname, '..', 'packages', 'design-system', 'tokens', 'dtcg');

/* ------------------------------------------------------------------ */
/*  Valid DTCG types                                                   */
/* ------------------------------------------------------------------ */

const VALID_TYPES = new Set([
  'color',
  'dimension',
  'fontFamily',
  'fontWeight',
  'duration',
  'cubicBezier',
  'number',
  'shadow',
  'strokeStyle',
  'border',
  'transition',
  'gradient',
]);

/* ------------------------------------------------------------------ */
/*  Validation logic                                                   */
/* ------------------------------------------------------------------ */

const errors = [];

function isLeafToken(obj) {
  return obj && typeof obj === 'object' && '$value' in obj;
}

function validateNode(obj, path, file) {
  if (!obj || typeof obj !== 'object') return;

  // Skip $-prefixed metadata keys at any level
  for (const [key, value] of Object.entries(obj)) {
    if (key.startsWith('$')) continue;

    const currentPath = path ? `${path}.${key}` : key;

    if (value && typeof value === 'object') {
      if (isLeafToken(value)) {
        // Validate leaf token
        if (!('$type' in value)) {
          errors.push({
            file,
            path: currentPath,
            message: 'Missing $type',
          });
        } else if (!VALID_TYPES.has(value.$type)) {
          errors.push({
            file,
            path: currentPath,
            message: `Invalid $type "${value.$type}". Must be one of: ${[...VALID_TYPES].join(', ')}`,
          });
        }
      } else {
        // Recurse into group
        validateNode(value, currentPath, file);
      }
    }
  }
}

/* ------------------------------------------------------------------ */
/*  Main                                                               */
/* ------------------------------------------------------------------ */

let fileCount = 0;
let tokenCount = 0;

function countTokens(obj) {
  if (!obj || typeof obj !== 'object') return;
  for (const [key, value] of Object.entries(obj)) {
    if (key.startsWith('$')) continue;
    if (value && typeof value === 'object') {
      if (isLeafToken(value)) tokenCount++;
      else countTokens(value);
    }
  }
}

let files;
try {
  files = readdirSync(DTCG_DIR).filter((f) => f.endsWith('.json'));
} catch {
  console.error(`Error: DTCG directory not found at ${DTCG_DIR}`);
  console.error('Run the token build first or create DTCG token files.');
  process.exit(1);
}

if (files.length === 0) {
  console.error(`Error: No JSON files found in ${DTCG_DIR}`);
  process.exit(1);
}

for (const file of files) {
  fileCount++;
  const filePath = join(DTCG_DIR, file);
  let data;

  try {
    data = JSON.parse(readFileSync(filePath, 'utf-8'));
  } catch (err) {
    errors.push({ file, path: '', message: `JSON parse error: ${err.message}` });
    continue;
  }

  countTokens(data);
  validateNode(data, '', file);
}

/* ------------------------------------------------------------------ */
/*  Report                                                             */
/* ------------------------------------------------------------------ */

console.log(`\nDTCG Token Lint`);
console.log(`${'─'.repeat(50)}`);
console.log(`  Files scanned:  ${fileCount}`);
console.log(`  Tokens found:   ${tokenCount}`);

if (errors.length === 0) {
  console.log(`  Status:         PASS — all tokens valid`);
  console.log('');
  process.exit(0);
} else {
  console.log(`  Errors:         ${errors.length}`);
  console.log('');

  for (const err of errors) {
    const location = err.path ? `${err.file} → ${err.path}` : err.file;
    console.log(`  ERROR  ${location}`);
    console.log(`         ${err.message}`);
  }

  console.log('');
  process.exit(1);
}
