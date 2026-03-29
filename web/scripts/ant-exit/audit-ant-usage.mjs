/**
 * Ant Design Usage Audit Script — Faz 5 Exit Tooling
 *
 * Scans apps/ and packages/ directories for imports from:
 *   - "antd"
 *   - "@ant-design/*"
 *   - design-system legacy barrel (legacy/index.ts or legacy/index)
 *
 * Outputs a JSON report with:
 *   - Total import count
 *   - Per-file breakdown (file path, imported names, import source)
 *   - Per-component usage count
 *
 * Usage:
 *   node scripts/ant-exit/audit-ant-usage.mjs
 */

import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const ROOT = resolve(__dirname, '../..');

const SCAN_DIRS = ['apps', 'packages'];

const FILE_EXTENSIONS = new Set(['.ts', '.tsx', '.js', '.jsx', '.mjs', '.mts']);

/**
 * Patterns that identify Ant Design imports:
 *   - from "antd" / from 'antd'
 *   - from "antd/..." (sub-path imports)
 *   - from "@ant-design/..."
 *   - from paths ending in /legacy, /legacy/index, /legacy/index.ts etc.
 */
const IMPORT_PATTERNS = [
  // Named imports: import { Button, Table } from "antd"
  {
    regex: /import\s+\{([^}]+)\}\s+from\s+['"]antd(?:\/[^'"]*)?['"]/g,
    source: (match) => match[0].match(/from\s+['"]([^'"]+)['"]/)[1],
    extractNames: (match) =>
      match[1]
        .split(',')
        .map((n) => n.trim().split(/\s+as\s+/)[0].trim())
        .filter(Boolean),
  },
  // Default import: import antd from "antd"
  {
    regex: /import\s+(\w+)\s+from\s+['"]antd(?:\/[^'"]*)?['"]/g,
    source: (match) => match[0].match(/from\s+['"]([^'"]+)['"]/)[1],
    extractNames: (match) => [match[1]],
  },
  // Named imports from @ant-design/*
  {
    regex: /import\s+\{([^}]+)\}\s+from\s+['"]@ant-design\/[^'"]+['"]/g,
    source: (match) => match[0].match(/from\s+['"]([^'"]+)['"]/)[1],
    extractNames: (match) =>
      match[1]
        .split(',')
        .map((n) => n.trim().split(/\s+as\s+/)[0].trim())
        .filter(Boolean),
  },
  // Default / namespace import from @ant-design/*
  {
    regex: /import\s+(?:\*\s+as\s+)?(\w+)\s+from\s+['"]@ant-design\/[^'"]+['"]/g,
    source: (match) => match[0].match(/from\s+['"]([^'"]+)['"]/)[1],
    extractNames: (match) => [match[1]],
  },
  // Legacy barrel imports: from "...legacy" or "...legacy/index" etc.
  {
    regex: /import\s+\{([^}]+)\}\s+from\s+['"][^'"]*\/legacy(?:\/index)?(?:\.ts)?['"]/g,
    source: (match) => match[0].match(/from\s+['"]([^'"]+)['"]/)[1],
    extractNames: (match) =>
      match[1]
        .split(',')
        .map((n) => n.trim().split(/\s+as\s+/)[0].trim())
        .filter(Boolean),
  },
];

/**
 * Recursively collect all source files under a directory.
 */
function collectFiles(dir) {
  const results = [];

  let entries;
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch {
    return results;
  }

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);

    if (entry.isDirectory()) {
      // Skip node_modules, dist, .git
      if (['node_modules', 'dist', '.git', '.next', 'coverage'].includes(entry.name)) {
        continue;
      }
      results.push(...collectFiles(fullPath));
    } else if (entry.isFile()) {
      const ext = entry.name.slice(entry.name.lastIndexOf('.'));
      if (FILE_EXTENSIONS.has(ext)) {
        results.push(fullPath);
      }
    }
  }

  return results;
}

/**
 * Strip single-line (//) and multi-line block comments from source code.
 * Preserves string literals to avoid false negatives.
 */
function stripComments(code) {
  // Match strings (single/double/template) and comments, replace comments with spaces
  return code.replace(
    /("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)|\/\/[^\n]*|\/\*[\s\S]*?\*\//g,
    (match, stringLiteral) => (stringLiteral ? stringLiteral : ' '),
  );
}

/**
 * Scan a single file for Ant Design imports.
 * Returns an array of { importedNames, importSource } objects.
 */
function scanFile(filePath) {
  const raw = readFileSync(filePath, 'utf8');
  const content = stripComments(raw);
  const hits = [];

  for (const pattern of IMPORT_PATTERNS) {
    // Reset regex state
    pattern.regex.lastIndex = 0;
    let match;
    while ((match = pattern.regex.exec(content)) !== null) {
      const importSource = pattern.source(match);
      const importedNames = pattern.extractNames(match);
      hits.push({ importedNames, importSource });
    }
  }

  return hits;
}

// ── Main ────────────────────────────────────────────────────────────────

console.log('Ant Design Usage Audit');
console.log('======================\n');

const allFiles = [];
for (const dir of SCAN_DIRS) {
  const absDir = join(ROOT, dir);
  allFiles.push(...collectFiles(absDir));
}

console.log(`Scanning ${allFiles.length} source files...\n`);

const perFileResults = [];
const componentCounts = {};
let totalImportCount = 0;

for (const filePath of allFiles) {
  const hits = scanFile(filePath);
  if (hits.length === 0) continue;

  const relPath = relative(ROOT, filePath);
  const fileEntry = {
    file: relPath,
    imports: [],
  };

  for (const hit of hits) {
    totalImportCount++;
    fileEntry.imports.push({
      source: hit.importSource,
      names: hit.importedNames,
    });

    for (const name of hit.importedNames) {
      componentCounts[name] = (componentCounts[name] || 0) + 1;
    }
  }

  perFileResults.push(fileEntry);
}

// Sort component counts descending
const sortedComponents = Object.entries(componentCounts)
  .sort(([, a], [, b]) => b - a)
  .map(([name, count]) => ({ name, count }));

const report = {
  generatedAt: new Date().toISOString(),
  summary: {
    totalImportStatements: totalImportCount,
    totalFilesWithImports: perFileResults.length,
    totalUniqueComponents: sortedComponents.length,
  },
  componentUsage: sortedComponents,
  perFile: perFileResults,
};

// Write report
const reportPath = join(__dirname, 'ant-usage-report.json');
writeFileSync(reportPath, JSON.stringify(report, null, 2), 'utf8');

// Console summary
console.log(`Total import statements: ${totalImportCount}`);
console.log(`Files with Ant imports:  ${perFileResults.length}`);
console.log(`Unique components:       ${sortedComponents.length}\n`);

if (sortedComponents.length > 0) {
  console.log('Top components:');
  for (const { name, count } of sortedComponents.slice(0, 20)) {
    console.log(`  ${name}: ${count} import${count !== 1 ? 's' : ''}`);
  }
}

console.log(`\nFull report written to: ${relative(ROOT, reportPath)}`);
