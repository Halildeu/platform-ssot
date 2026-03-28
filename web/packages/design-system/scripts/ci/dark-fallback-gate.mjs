#!/usr/bin/env node
/**
 * dark-fallback-gate.mjs
 * Ensures zero hardcoded hex/rgba fallbacks in CSS variable usage.
 * This prevents dark mode breakage caused by light-mode-only fallback values.
 */
import fs from 'fs';
import path from 'path';

const CI = process.argv.includes('--ci');
const SRC = 'src';

// Patterns that indicate a hardcoded color fallback in var()
const FALLBACK_PATTERN = /var\(--[a-zA-Z0-9-]+\s*,\s*(?:#[0-9a-fA-F]{3,8}|rgba?\([^)]*\)|hsla?\([^)]*\))\s*\)/g;

// Directories to scan (component source only)
const SCAN_DIRS = ['components', 'primitives', 'enterprise', 'patterns', 'advanced', 'form', 'motion', 'providers', 'internal', 'performance'];

// Skip patterns
const SKIP_PATTERNS = [/__tests__/, /\.test\./, /\.stories\./, /\.doc\./, /node_modules/];

function scanFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const matches = [];
  let match;
  const regex = new RegExp(FALLBACK_PATTERN.source, FALLBACK_PATTERN.flags);
  while ((match = regex.exec(content)) !== null) {
    const lineNum = content.slice(0, match.index).split('\n').length;
    matches.push({ line: lineNum, value: match[0] });
  }
  return matches;
}

function walk(dir) {
  const results = [];
  if (!fs.existsSync(dir)) return results;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory() && !entry.name.startsWith('.')) {
      results.push(...walk(full));
    } else if ((entry.name.endsWith('.tsx') || entry.name.endsWith('.ts')) && !entry.name.endsWith('.d.ts')) {
      const rel = path.relative(SRC, full);
      if (!SKIP_PATTERNS.some(p => p.test(rel))) {
        results.push(full);
      }
    }
  }
  return results;
}

function main() {
  console.log('🌙 Dark Mode Fallback Gate\n');

  let totalIssues = 0;
  const fileIssues = [];
  let totalFiles = 0;

  for (const dir of SCAN_DIRS) {
    const files = walk(path.join(SRC, dir));
    totalFiles += files.length;
    for (const file of files) {
      const issues = scanFile(file);
      if (issues.length > 0) {
        totalIssues += issues.length;
        fileIssues.push({ file: path.relative(SRC, file), issues });
      }
    }
  }

  console.log(`  Files scanned: ${totalFiles}`);
  console.log(`  Hardcoded fallbacks found: ${totalIssues}`);

  if (fileIssues.length > 0) {
    console.log('\n  Violations:');
    for (const { file, issues } of fileIssues.slice(0, 15)) {
      for (const i of issues) {
        console.log(`    ${file}:${i.line} → ${i.value.slice(0, 60)}`);
      }
    }
    if (fileIssues.length > 15) {
      console.log(`    ...+${fileIssues.length - 15} more files`);
    }
  }

  // Also check shell index.css @theme inline block
  const shellIndex = path.resolve('../../apps/mfe-shell/src/index.css');
  if (fs.existsSync(shellIndex)) {
    const shellContent = fs.readFileSync(shellIndex, 'utf-8');
    const themeBlock = shellContent.match(/@theme inline\s*\{([\s\S]*?)\}/);
    if (themeBlock) {
      const themeMatches = themeBlock[1].match(FALLBACK_PATTERN);
      if (themeMatches && themeMatches.length > 0) {
        console.log(`\n  ⚠️  Shell @theme inline has ${themeMatches.length} hex fallback(s)`);
        totalIssues += themeMatches.length;
      }
    }
  }

  // Also check shell token-bridge.css still exists (should be deleted)
  const tokenBridge = path.resolve('../../apps/mfe-shell/src/styles/token-bridge.css');
  if (fs.existsSync(tokenBridge)) {
    console.log('\n  ⚠️  token-bridge.css still exists (should be deleted)');
    totalIssues++;
  }

  // Also check dark-mode.css still exists (should be deleted)
  const darkMode = path.join(SRC, 'tokens/build/dark-mode.css');
  if (fs.existsSync(darkMode)) {
    console.log('\n  ⚠️  dark-mode.css still exists (should be deleted)');
    totalIssues++;
  }

  const passed = totalIssues === 0;
  console.log(`\n  ${passed ? '✅' : '❌'} Dark fallback gate: ${totalIssues} issue(s)`);

  if (CI && !passed) {
    process.exit(1);
  }
}

main();
