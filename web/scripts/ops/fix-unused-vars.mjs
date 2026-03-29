#!/usr/bin/env node
/**
 * fix-unused-vars.mjs — Automated unused import & variable remover.
 *
 * Uses ESLint JSON output to identify unused vars, then applies fixes:
 *  1. Unused imports → remove from import statement
 *  2. Unused function params → prefix with _
 *  3. Unused destructured vars → prefix with _
 *  4. Unused local vars → prefix with _ (safest approach)
 *
 * Usage:
 *   node scripts/ops/fix-unused-vars.mjs              # dry-run
 *   node scripts/ops/fix-unused-vars.mjs --apply      # apply changes
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..', '..');
const DRY_RUN = !process.argv.includes('--apply');

/* ------------------------------------------------------------------ */
/*  Get ESLint unused-vars warnings                                    */
/* ------------------------------------------------------------------ */

function getUnusedVars() {
  try {
    const stdout = execSync('npx eslint . --format json', {
      cwd: ROOT,
      encoding: 'utf8',
      maxBuffer: 1024 * 1024 * 64,
      stdio: ['pipe', 'pipe', 'pipe'],
    });
    return JSON.parse(stdout);
  } catch (err) {
    if (err.stdout) {
      try { return JSON.parse(err.stdout); } catch { /* */ }
    }
    throw err;
  }
}

/* ------------------------------------------------------------------ */
/*  Fix strategies                                                     */
/* ------------------------------------------------------------------ */

/**
 * Parse an import line and remove specific named imports.
 * Returns null if the entire import should be removed.
 */
function removeNamedImport(line, varName) {
  // Handle: import { Foo, Bar, Baz } from '...'
  const namedMatch = line.match(/^(\s*import\s*\{)([^}]+)(\}\s*from\s*.+)$/);
  if (!namedMatch) return null;

  const names = namedMatch[2].split(',').map(n => n.trim()).filter(Boolean);
  const filtered = names.filter(n => {
    // Handle "Foo as Bar" — check both original and alias
    const parts = n.split(/\s+as\s+/);
    const alias = parts.length > 1 ? parts[1].trim() : parts[0].trim();
    return alias !== varName;
  });

  if (filtered.length === 0) {
    return ''; // Remove entire import
  }

  if (filtered.length === names.length) {
    return null; // Nothing to remove
  }

  return `${namedMatch[1]} ${filtered.join(', ')} ${namedMatch[3]}`;
}

/**
 * Prefix an unused variable/param with _ to suppress the warning.
 */
function prefixWithUnderscore(line, varName, column) {
  // Find the exact position and prefix with _
  const before = line.substring(0, column - 1);
  const after = line.substring(column - 1);

  if (after.startsWith(varName)) {
    return before + '_' + after;
  }

  return null; // Can't locate — skip
}

/* ------------------------------------------------------------------ */
/*  Process files                                                      */
/* ------------------------------------------------------------------ */

function processFile(filePath, warnings) {
  const content = readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  let changed = false;
  const removedLines = new Set();

  // Sort warnings by line number descending (process bottom-up to preserve line numbers)
  const sorted = [...warnings].sort((a, b) => b.line - a.line);

  for (const warn of sorted) {
    const lineIdx = warn.line - 1;
    if (lineIdx < 0 || lineIdx >= lines.length) continue;
    if (removedLines.has(lineIdx)) continue;

    const line = lines[lineIdx];
    const varName = extractVarName(warn.message);
    if (!varName) continue;

    // Strategy 1: Unused import — remove from import statement
    if (line.trimStart().startsWith('import ') && line.includes('{')) {
      const fixed = removeNamedImport(line, varName);
      if (fixed !== null) {
        if (fixed === '') {
          // Remove entire line
          lines[lineIdx] = null;
          removedLines.add(lineIdx);
        } else {
          lines[lineIdx] = fixed;
        }
        changed = true;
        continue;
      }
    }

    // Strategy 2: Default import — remove entire line
    if (line.trimStart().startsWith('import ') && !line.includes('{')) {
      const defaultMatch = line.match(/^\s*import\s+(\w+)\s+from\s+/);
      if (defaultMatch && defaultMatch[1] === varName) {
        lines[lineIdx] = null;
        removedLines.add(lineIdx);
        changed = true;
        continue;
      }
      // import type
      const typeMatch = line.match(/^\s*import\s+type\s+(\w+)\s+from\s+/);
      if (typeMatch && typeMatch[1] === varName) {
        lines[lineIdx] = null;
        removedLines.add(lineIdx);
        changed = true;
        continue;
      }
    }

    // Strategy 3: Type import — import type { Foo } from '...'
    if (line.trimStart().startsWith('import type ') && line.includes('{')) {
      const fixed = removeNamedImport(line.replace('import type', 'import'), varName);
      if (fixed !== null) {
        if (fixed === '') {
          lines[lineIdx] = null;
          removedLines.add(lineIdx);
        } else {
          lines[lineIdx] = fixed.replace('import', 'import type');
        }
        changed = true;
        continue;
      }
    }

    // Strategy 4: Function parameter — prefix with _
    // Only if it's a param (message says "defined but never used")
    if (warn.message.includes('defined but never used')) {
      const fixed = prefixWithUnderscore(line, varName, warn.column);
      if (fixed) {
        lines[lineIdx] = fixed;
        changed = true;
        continue;
      }
    }
  }

  if (!changed) return false;

  const newContent = lines.filter(l => l !== null).join('\n');
  if (!DRY_RUN) {
    writeFileSync(filePath, newContent, 'utf8');
  }
  return true;
}

function extractVarName(message) {
  // "'Foo' is defined but never used" or "'Foo' is assigned a value but never used"
  const match = message.match(/^'([^']+)'/);
  return match ? match[1] : null;
}

/* ------------------------------------------------------------------ */
/*  Main                                                               */
/* ------------------------------------------------------------------ */

function main() {
  console.log(`\n  fix-unused-vars ${DRY_RUN ? '(DRY-RUN)' : '(APPLYING)'}\n`);
  console.log('  Running ESLint analysis...');

  const eslintData = getUnusedVars();

  // Collect unused var warnings per file
  const fileWarnings = new Map();
  let totalWarnings = 0;

  for (const file of eslintData) {
    const warnings = file.messages.filter(
      m => m.ruleId === '@typescript-eslint/no-unused-vars'
    );
    if (warnings.length > 0) {
      fileWarnings.set(file.filePath, warnings);
      totalWarnings += warnings.length;
    }
  }

  console.log(`  Found ${totalWarnings} unused vars across ${fileWarnings.size} files\n`);

  let fixedFiles = 0;
  let skippedFiles = 0;

  for (const [filePath, warnings] of fileWarnings) {
    const rel = relative(ROOT, filePath);
    try {
      const fixed = processFile(filePath, warnings);
      if (fixed) {
        fixedFiles++;
        if (!DRY_RUN) {
          console.log(`  ✅ ${rel}`);
        }
      } else {
        skippedFiles++;
      }
    } catch (err) {
      skippedFiles++;
      console.log(`  ⚠️  ${rel}: ${err.message}`);
    }
  }

  const mode = DRY_RUN ? 'DRY-RUN' : 'APPLIED';
  console.log(`\n  [${mode}] ${fixedFiles} files fixed, ${skippedFiles} skipped`);

  if (DRY_RUN) {
    console.log('  Run with --apply to apply changes\n');
  } else {
    // Run ESLint again to check improvement
    console.log('\n  Re-running ESLint to verify...');
    try {
      const result = execSync('npx eslint . 2>&1 | tail -3', {
        cwd: ROOT,
        encoding: 'utf8',
        stdio: ['pipe', 'pipe', 'pipe'],
      });
      console.log(`  ${result.trim()}\n`);
    } catch (err) {
      if (err.stdout) console.log(`  ${err.stdout.trim()}\n`);
    }
  }
}

main();
