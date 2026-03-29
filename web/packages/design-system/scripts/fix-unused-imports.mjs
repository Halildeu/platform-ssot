#!/usr/bin/env node
/**
 * Fix unused imports reported by @typescript-eslint/no-unused-vars
 *
 * Reads ESLint JSON output, parses unused variable warnings,
 * and removes unused import specifiers from source files.
 */

import { execSync } from 'child_process';
import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

console.log('Running ESLint to collect unused-vars warnings...');
let eslintOutput;
try {
  eslintOutput = execSync(
    `../../node_modules/.bin/eslint --config eslint.config.mjs src --format json`,
    { cwd: ROOT, maxBuffer: 50 * 1024 * 1024, encoding: 'utf8' }
  );
} catch (e) {
  // ESLint exits non-zero when there are errors
  eslintOutput = e.stdout;
}

const results = JSON.parse(eslintOutput);

// Collect per-file unused vars from import lines
const fileFixMap = new Map(); // filePath -> Set of unused var names

for (const file of results) {
  for (const msg of file.messages) {
    if (msg.ruleId !== '@typescript-eslint/no-unused-vars') continue;

    // Extract the variable name from the message
    // Messages look like: "'screen' is defined but never used." or "'IconProps' is defined but never used."
    const match = msg.message.match(/^'([^']+)' is defined but never used/);
    if (!match) continue;

    const varName = match[1];
    const line = msg.line;

    if (!fileFixMap.has(file.filePath)) {
      fileFixMap.set(file.filePath, new Map());
    }
    fileFixMap.get(file.filePath).set(varName, line);
  }
}

console.log(`Found unused vars in ${fileFixMap.size} files`);

let totalFixed = 0;
let totalFiles = 0;

for (const [filePath, unusedVars] of fileFixMap) {
  const content = readFileSync(filePath, 'utf8');
  const originalContent = content;
  const lines = content.split('\n');
  const linesToRemove = new Set();

  for (const [varName, lineNum] of unusedVars) {
    const lineIdx = lineNum - 1;
    if (lineIdx < 0 || lineIdx >= lines.length) continue;
    const line = lines[lineIdx];

    // Check if this line is an import statement
    if (!line.match(/^\s*import\s/)) continue;

    // Try to remove the specific specifier from the import
    const newLine = removeSpecifierFromImport(line, varName);

    if (newLine === null) {
      // The entire import should be removed
      linesToRemove.add(lineIdx);
    } else if (newLine !== line) {
      lines[lineIdx] = newLine;
    }
  }

  // Remove lines marked for deletion (reverse order to preserve indices)
  const sortedLinesToRemove = [...linesToRemove].sort((a, b) => b - a);
  for (const idx of sortedLinesToRemove) {
    lines.splice(idx, 1);
  }

  const newContent = lines.join('\n');
  if (newContent !== originalContent) {
    writeFileSync(filePath, newContent, 'utf8');
    totalFiles++;
    totalFixed += unusedVars.size;
  }
}

console.log(`Fixed ${totalFixed} unused imports across ${totalFiles} files`);

/**
 * Remove a named specifier from an import statement.
 * Returns the modified line, or null if the entire import should be removed.
 */
function removeSpecifierFromImport(line, specifier) {
  // Handle: import { A, B, C } from '...';
  // Handle: import { type A, B } from '...';
  // Handle: import A from '...'; (default import)
  // Handle: import A, { B, C } from '...'; (default + named)

  // Check if it's a named import containing the specifier
  const namedImportMatch = line.match(/^(\s*import\s+)(\{[^}]+\})(\s+from\s+.+)$/);

  if (namedImportMatch) {
    const prefix = namedImportMatch[1];
    const specifiers = namedImportMatch[2];
    const suffix = namedImportMatch[3];

    const newSpecifiers = removeFromSpecifierBlock(specifiers, specifier);

    if (newSpecifiers === null) {
      // No specifiers left, remove the entire import
      return null;
    }

    return prefix + newSpecifiers + suffix;
  }

  // Handle: import DefaultExport, { A, B } from '...';
  const defaultAndNamedMatch = line.match(/^(\s*import\s+\w+\s*,\s*)(\{[^}]+\})(\s+from\s+.+)$/);

  if (defaultAndNamedMatch) {
    const prefix = defaultAndNamedMatch[1];
    const specifiers = defaultAndNamedMatch[2];
    const suffix = defaultAndNamedMatch[3];

    // Check if the specifier is the default import part
    const defaultMatch = line.match(/^(\s*import\s+)(\w+)(\s*,\s*\{[^}]+\}\s+from\s+.+)$/);
    if (defaultMatch && defaultMatch[2] === specifier) {
      // Remove default, keep named
      const namedPart = line.replace(/^(\s*import\s+)\w+\s*,\s*(\{[^}]+\}\s+from\s+.+)$/, '$1$2');
      return namedPart;
    }

    const newSpecifiers = removeFromSpecifierBlock(specifiers, specifier);

    if (newSpecifiers === null) {
      // Named block is empty, keep only default
      const newLine = line.replace(/^(\s*import\s+\w+)\s*,\s*\{[^}]+\}(\s+from\s+.+)$/, '$1$2');
      return newLine;
    }

    return prefix + newSpecifiers + suffix;
  }

  // Handle: import DefaultExport from '...'; where DefaultExport is unused
  const defaultImportMatch = line.match(/^\s*import\s+(\w+)\s+from\s+/);
  if (defaultImportMatch && defaultImportMatch[1] === specifier) {
    return null; // Remove entire line
  }

  // Handle: import * as Name from '...';
  const namespaceMatch = line.match(/^\s*import\s+\*\s+as\s+(\w+)\s+from\s+/);
  if (namespaceMatch && namespaceMatch[1] === specifier) {
    return null;
  }

  return line; // No change
}

/**
 * Remove a specifier from a { A, B, C } block.
 * Returns the new block string, or null if empty.
 */
function removeFromSpecifierBlock(block, specifier) {
  // Parse the specifiers: { A, type B, C as D }
  const inner = block.slice(1, -1); // Remove { }
  const parts = inner.split(',').map(s => s.trim()).filter(Boolean);

  const newParts = parts.filter(part => {
    // Part could be: "A", "type A", "A as B", "type A as B"
    const tokens = part.split(/\s+/);

    // Get the local name (the name used in code)
    let localName;
    const asIdx = tokens.indexOf('as');
    if (asIdx !== -1 && asIdx + 1 < tokens.length) {
      localName = tokens[asIdx + 1];
    } else {
      // Last token is the name (handles "type X" and just "X")
      localName = tokens[tokens.length - 1];
    }

    return localName !== specifier;
  });

  if (newParts.length === 0) {
    return null;
  }

  return '{ ' + newParts.join(', ') + ' }';
}
