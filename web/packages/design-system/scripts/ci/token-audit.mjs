#!/usr/bin/env node
/**
 * token-audit.mjs — Design token usage consistency gate
 * Scans component files for hardcoded colors and ensures semantic tokens are used.
 */
import fs from 'fs';
import path from 'path';

const SRC = 'src';
const CI = process.argv.includes('--ci');

// Hardcoded color patterns to flag
const HARDCODED_PATTERNS = [
  // Hex colors (but not in comments or CSS var fallbacks)
  { pattern: /(?<!var\([^)]*)(#[0-9a-fA-F]{3,8})(?!\s*\*\/)/g, name: 'hex-color' },
  // rgb/rgba not in var() fallback
  { pattern: /(?<!var\([^)]*)(rgba?\(\d+\s*,\s*\d+\s*,\s*\d+)/g, name: 'rgb-color' },
];

// Directories to scan
const SCAN_DIRS = ['components', 'primitives', 'enterprise', 'patterns', 'advanced', 'form', 'motion', 'providers', 'internal', 'performance'];

// Files/patterns to skip
const SKIP = [/__tests__/, /\.test\./, /\.stories\./, /\.doc\./, /node_modules/, /\.css$/, /tokens\//, /theme\/core\/(light|dark)\.ts/];

function scanFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const issues = [];

  for (const { pattern, name } of HARDCODED_PATTERNS) {
    const regex = new RegExp(pattern.source, pattern.flags);
    let match;
    while ((match = regex.exec(content)) !== null) {
      // Skip if inside a var() fallback like var(--token, #fff)
      const before = content.slice(Math.max(0, match.index - 30), match.index);
      if (before.includes('var(')) continue;

      // Skip if in a comment
      const lineStart = content.lastIndexOf('\n', match.index) + 1;
      const line = content.slice(lineStart, match.index);
      if (line.includes('//') || line.includes('*')) continue;

      const lineNum = content.slice(0, match.index).split('\n').length;
      issues.push({ line: lineNum, value: match[1], type: name });
    }
  }

  return issues;
}

function main() {
  let totalIssues = 0;
  let cleanFiles = 0;
  let totalFiles = 0;
  const fileIssues = [];

  for (const dir of SCAN_DIRS) {
    const fullDir = path.join(SRC, dir);
    if (!fs.existsSync(fullDir)) continue;

    const walk = (d) => {
      for (const entry of fs.readdirSync(d, { withFileTypes: true })) {
        if (entry.isDirectory() && !entry.name.startsWith('.')) {
          walk(path.join(d, entry.name));
        } else if (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts')) {
          const fp = path.join(d, entry.name);
          const rel = path.relative(SRC, fp);
          if (SKIP.some(p => p.test(rel))) continue;

          totalFiles++;
          const issues = scanFile(fp);
          if (issues.length === 0) {
            cleanFiles++;
          } else {
            totalIssues += issues.length;
            fileIssues.push({ file: rel, issues });
          }
        }
      }
    };
    walk(fullDir);
  }

  console.log('🎨 Design Token Usage Audit\n');
  console.log(`  Files scanned: ${totalFiles}`);
  console.log(`  Clean files: ${cleanFiles} (${Math.round(cleanFiles/totalFiles*100)}%)`);
  console.log(`  Issues found: ${totalIssues}`);

  if (fileIssues.length > 0) {
    console.log('\n  Files with hardcoded colors:');
    for (const { file, issues } of fileIssues.slice(0, 20)) {
      console.log(`    ${issues.length} ${file}`);
      for (const i of issues.slice(0, 3)) {
        console.log(`      L${i.line}: ${i.value} (${i.type})`);
      }
    }
    if (fileIssues.length > 20) {
      console.log(`    ...+${fileIssues.length - 20} more files`);
    }
  }

  const threshold = 80; // 80% clean files target
  const cleanPct = Math.round(cleanFiles/totalFiles*100);
  const passed = cleanPct >= threshold;

  console.log(`\n  ${passed ? '✅' : '❌'} Token audit: ${cleanPct}% clean (threshold: ${threshold}%)`);

  if (CI && !passed) {
    process.exit(1);
  }
}

main();
