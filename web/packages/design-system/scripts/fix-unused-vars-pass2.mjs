#!/usr/bin/env node
/**
 * Pass 2: Fix remaining unused vars that aren't simple import removals.
 * - `const screen = await render(...)` → `await render(...)`
 * - `const { container } = render(...)` → `render(...)`
 * - `import type { IconProps } from ...` → remove line
 * - type-only specifiers in mixed imports → remove specifier
 * - `const X = ...` unused variable → prefix with _
 * - unused function params → prefix with _
 * - unused type params → prefix with _
 * - `let X = ...` unused → prefix with _
 */

import { execSync } from 'child_process';
import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

console.log('Running ESLint to collect remaining unused-vars...');
let eslintOutput;
try {
  eslintOutput = execSync(
    `../../node_modules/.bin/eslint --config eslint.config.mjs src --format json`,
    { cwd: ROOT, maxBuffer: 50 * 1024 * 1024, encoding: 'utf8' }
  );
} catch (e) {
  eslintOutput = e.stdout;
}

const results = JSON.parse(eslintOutput);

// Collect all unused vars per file
const fileIssues = new Map();

for (const file of results) {
  for (const msg of file.messages) {
    if (msg.ruleId !== '@typescript-eslint/no-unused-vars') continue;
    const m = msg.message.match(/^'([^']+)' is (?:defined|assigned a value) but never used/);
    if (!m) continue;
    if (!fileIssues.has(file.filePath)) fileIssues.set(file.filePath, []);
    fileIssues.get(file.filePath).push({
      varName: m[1],
      line: msg.line,
      column: msg.column,
      message: msg.message,
    });
  }
}

console.log(`Found issues in ${fileIssues.size} files`);

let totalFixed = 0;

for (const [filePath, issues] of fileIssues) {
  const content = readFileSync(filePath, 'utf8');
  const original = content;
  const lines = content.split('\n');
  const linesToRemove = new Set();

  // Sort issues by line number descending so we can modify from bottom up
  issues.sort((a, b) => b.line - a.line);

  for (const issue of issues) {
    const lineIdx = issue.line - 1;
    if (lineIdx < 0 || lineIdx >= lines.length) continue;
    const line = lines[lineIdx];
    const varName = issue.varName;

    // Case 1: import type { IconProps } from '...' — remove entire line
    if (line.match(/^\s*import\s+type\s+\{\s*\w+\s*\}\s+from\s+/)) {
      linesToRemove.add(lineIdx);
      totalFixed++;
      continue;
    }

    // Case 1b: import { type IconProps } from '...' — only specifier
    if (line.match(/^\s*import\s+\{/) && line.includes(varName)) {
      // Try removing the specifier
      const newLine = removeSpecifierFromImport(line, varName);
      if (newLine === null) {
        linesToRemove.add(lineIdx);
        totalFixed++;
      } else if (newLine !== line) {
        lines[lineIdx] = newLine;
        totalFixed++;
      }
      continue;
    }

    // Case 2: `const screen = await render(...)` → `await render(...)`
    if (varName === 'screen' && line.match(/^\s*const\s+screen\s*=\s*await\s+render\s*\(/)) {
      lines[lineIdx] = line.replace(/const\s+screen\s*=\s*/, '');
      totalFixed++;
      continue;
    }

    // Case 3: `const { container } = render(` → `render(`
    if (line.match(new RegExp(`^\\s*const\\s+\\{\\s*${escapeRegex(varName)}\\s*\\}\\s*=\\s*`))) {
      lines[lineIdx] = line.replace(new RegExp(`const\\s+\\{\\s*${escapeRegex(varName)}\\s*\\}\\s*=\\s*`), '');
      totalFixed++;
      continue;
    }

    // Case 4: `const screen = await render(...)` on the same line (single line)
    if (line.match(new RegExp(`^\\s*const\\s+${escapeRegex(varName)}\\s*=\\s*await\\s+`))) {
      lines[lineIdx] = line.replace(new RegExp(`const\\s+${escapeRegex(varName)}\\s*=\\s*`), '');
      totalFixed++;
      continue;
    }

    // Case 5: unused function parameter → prefix with _
    // Check if it's a destructured param or regular param
    if (issue.message.includes('Allowed unused args must match')) {
      // It's a function parameter - prefix with _
      if (line.includes(`${varName}:`)) {
        // It's a param like `props: Type` or in a function definition
        lines[lineIdx] = line.replace(new RegExp(`\\b${escapeRegex(varName)}\\b(?=\\s*[,:)])`), `_${varName}`);
        totalFixed++;
        continue;
      }
      if (line.match(new RegExp(`\\(\\s*${escapeRegex(varName)}\\s*[,)]`)) ||
          line.match(new RegExp(`,\\s*${escapeRegex(varName)}\\s*[,)]`))) {
        lines[lineIdx] = line.replace(new RegExp(`\\b${escapeRegex(varName)}\\b`), `_${varName}`);
        totalFixed++;
        continue;
      }
    }

    // Case 6: unused type parameter like `<RowData = any>` → prefix with _
    if (issue.message.includes('is defined but never used') &&
        line.match(new RegExp(`<[^>]*\\b${escapeRegex(varName)}\\b[^>]*>`))) {
      lines[lineIdx] = line.replace(new RegExp(`\\b${escapeRegex(varName)}\\b`), `_${varName}`);
      totalFixed++;
      continue;
    }

    // Case 7: `let capturedProps = ...` → `let _capturedProps = ...`
    // or `const DASHBOARD_WIDGETS = ...` → prefix with _
    if (issue.message.includes('is assigned a value but never used')) {
      // For const/let declarations
      const declMatch = line.match(new RegExp(`(const|let|var)\\s+${escapeRegex(varName)}\\b`));
      if (declMatch) {
        lines[lineIdx] = line.replace(new RegExp(`((?:const|let|var)\\s+)${escapeRegex(varName)}\\b`), `$1_${varName}`);
        totalFixed++;
        continue;
      }
      // For destructured assignment: `page,` in a destructuring
      if (line.trim() === `${varName},` || line.trim() === varName) {
        lines[lineIdx] = line.replace(new RegExp(`\\b${escapeRegex(varName)}\\b`), `_${varName}`);
        totalFixed++;
        continue;
      }
    }

    // Case 8: Generic unused var that we couldn't categorize - prefix with _
    // Only if it appears as a standalone identifier
    const genericReplace = line.replace(new RegExp(`\\b${escapeRegex(varName)}\\b(?!\\s*[.(])`), `_${varName}`);
    if (genericReplace !== line) {
      // Verify it only changed once to avoid breaking things
      const count = (line.match(new RegExp(`\\b${escapeRegex(varName)}\\b`, 'g')) || []).length;
      if (count === 1) {
        lines[lineIdx] = genericReplace;
        totalFixed++;
      }
    }
  }

  // Remove lines marked for deletion
  const sortedLinesToRemove = [...linesToRemove].sort((a, b) => b - a);
  for (const idx of sortedLinesToRemove) {
    lines.splice(idx, 1);
  }

  const newContent = lines.join('\n');
  if (newContent !== original) {
    writeFileSync(filePath, newContent, 'utf8');
  }
}

console.log(`Fixed ${totalFixed} remaining unused var issues`);

function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function removeSpecifierFromImport(line, specifier) {
  const namedImportMatch = line.match(/^(\s*import\s+(?:type\s+)?)(\{[^}]+\})(\s+from\s+.+)$/);
  if (!namedImportMatch) return line;

  const prefix = namedImportMatch[1];
  const block = namedImportMatch[2];
  const suffix = namedImportMatch[3];

  const inner = block.slice(1, -1);
  const parts = inner.split(',').map(s => s.trim()).filter(Boolean);

  const newParts = parts.filter(part => {
    const tokens = part.split(/\s+/);
    const asIdx = tokens.indexOf('as');
    let localName;
    if (asIdx !== -1 && asIdx + 1 < tokens.length) {
      localName = tokens[asIdx + 1];
    } else {
      localName = tokens[tokens.length - 1];
    }
    return localName !== specifier;
  });

  if (newParts.length === 0) return null;
  return prefix + '{ ' + newParts.join(', ') + ' }' + suffix;
}
