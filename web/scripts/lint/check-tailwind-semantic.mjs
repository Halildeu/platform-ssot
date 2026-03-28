#!/usr/bin/env node
import fs from 'fs';
import path from 'path';

const roots = ['apps', 'packages'];
const extensions = new Set(['.ts', '.tsx', '.js', '.jsx', '.html']);
const skipDirs = new Set(['node_modules', 'dist', 'storybook-static', 'coverage']);

const arbitraryPattern = /\b(?:bg|text|border|ring|shadow|from|via|to)-\[(?<value>[^\]]+)\]/g;

const violations = [];

for (const root of roots) {
  walk(path.resolve(process.cwd(), root));
}

if (violations.length) {
  console.log('⚠️  Tailwind renk sınıfı ihlalleri bulundu (rapor modu, şimdilik uyarı):');
  for (const violation of violations) {
    console.log(
      ` - ${violation.file}:${violation.line} → ${violation.sample.trim().slice(0, 160)}`,
    );
  }
  process.exitCode = 1;
} else {
  console.log('✅ Tailwind renk kullanımında uygunsuz sınıf bulunmadı.');
}

function walk(dir) {
  if (!fs.existsSync(dir)) return;
  const stats = fs.statSync(dir);
  if (!stats.isDirectory()) {
    checkFile(dir);
    return;
  }
  const base = path.basename(dir);
  if (skipDirs.has(base)) return;
  for (const entry of fs.readdirSync(dir)) {
    walk(path.join(dir, entry));
  }
}

function checkFile(filePath) {
  const ext = path.extname(filePath);
  if (!extensions.has(ext)) return;
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split(/\r?\n/);
  lines.forEach((line, index) => {
    let hasViolation = false;
    let match;
    while ((match = arbitraryPattern.exec(line)) !== null) {
      const rawValue = match.groups?.value ?? '';
      if (containsRawColor(rawValue)) {
        hasViolation = true;
        break;
      }
    }
    arbitraryPattern.lastIndex = 0;
    // Quick check: bg-[#hex] or text-[#hex] without var() wrapper
    const hasBareLiteral = (line.includes('bg-[#') || line.includes('text-[#')) &&
      !line.match(/(?:bg|text)-\[var\(--/);
    if (hasViolation || hasBareLiteral) {
      violations.push({ file: filePath, line: index + 1, sample: line });
    }
  });
}

function containsRawColor(value) {
  const normalized = value.trim().toLowerCase();
  if (!normalized) {
    return false;
  }
  // Allow var(--token, #fallback) — CSS variable with hardcoded fallback is valid
  if (normalized.startsWith('var(--')) {
    return false;
  }
  if (normalized.includes('#')) {
    return true;
  }
  if (normalized.startsWith('rgb') || normalized.startsWith('hsl')) {
    return true;
  }
  return false;
}
