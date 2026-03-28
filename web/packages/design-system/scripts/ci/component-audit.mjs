#!/usr/bin/env node
/**
 * Component Quality Audit Script
 *
 * Scans ALL .tsx components across the design system and produces
 * a quality report covering:
 *   1. displayName presence
 *   2. AccessControlledProps integration
 *   3. Hardcoded string detection (Turkish/English literals)
 *   4. Type/interface exports
 *   5. Test coverage mapping
 *   6. cn() usage
 *   7. forwardRef usage (primitives/components/patterns)
 *   8. Edge case patterns (empty/null checks)
 *
 * Usage: node scripts/ci/component-audit.mjs [--json] [--ci] [--fix-report]
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.resolve(__dirname, '../../src');

// ── Config ──
const COMPONENT_DIRS = [
  'primitives', 'components', 'patterns', 'enterprise',
  'advanced', 'form', 'motion', 'internal', 'providers',
  'performance', 'catalog', 'icons',
];

const SKIP_FILES = ['index.ts', 'index.tsx', 'types.ts', 'types.tsx', 'utils.ts', 'constants.ts'];
const SKIP_PATTERNS = [/__tests__/, /\.test\./, /\.stories\./, /\.figma\./, /setup\.ts/];

// Directories that MUST have displayName + forwardRef
const DISPLAY_NAME_REQUIRED = ['primitives', 'components', 'patterns'];
// Directories that MUST have access control
const ACCESS_CONTROL_REQUIRED = ['enterprise', 'components', 'patterns', 'advanced'];

// Hardcoded string patterns (Turkish + English UI strings)
const HARDCODED_PATTERNS = [
  // Turkish
  { pattern: /['"`](?:Kaydet|Vazgeç|İptal|Sil|Düzenle|Ekle|Kapat|Tamam|Evet|Hayır|Gönder|Onayla|Reddet)['"`]/g, lang: 'TR', type: 'button-label' },
  { pattern: /['"`](?:Henüz|Sonuç bulunamadı|Veri yok|Hata oluştu|Yükleniyor|Bildirim)['"`]/g, lang: 'TR', type: 'ui-message' },
  { pattern: /['"`](?:Tümünü|okundu işaretle|daha göster|Filtrele)['"`]/g, lang: 'TR', type: 'action-label' },
  // English
  { pattern: /['"`](?:Save|Cancel|Delete|Edit|Add|Close|Submit|Approve|Reject|Confirm)['"`]/g, lang: 'EN', type: 'button-label' },
  { pattern: /['"`](?:No data|No results|Loading|Error occurred|Not found)['"`]/g, lang: 'EN', type: 'ui-message' },
  { pattern: /['"`](?:Click to edit|scroll to explore|Show more|Mark all)['"`]/g, lang: 'EN', type: 'action-label' },
];

// ── Helpers ──
function findComponents(dir) {
  const results = [];
  const fullDir = path.join(SRC, dir);
  if (!fs.existsSync(fullDir)) return results;

  function walk(d) {
    for (const entry of fs.readdirSync(d, { withFileTypes: true })) {
      if (entry.isDirectory()) {
        if (entry.name === '__tests__' || entry.name === 'node_modules') continue;
        walk(path.join(d, entry.name));
      } else if (entry.name.endsWith('.tsx') && !SKIP_FILES.includes(entry.name)) {
        const fullPath = path.join(d, entry.name);
        const relPath = path.relative(SRC, fullPath);
        if (SKIP_PATTERNS.some(p => p.test(relPath))) continue;
        results.push({ fullPath, relPath, dir });
      }
    }
  }
  walk(fullDir);
  return results;
}

function findTestFiles() {
  const testMap = new Map(); // component name → test file paths
  function walk(d) {
    if (!fs.existsSync(d)) return;
    for (const entry of fs.readdirSync(d, { withFileTypes: true })) {
      const full = path.join(d, entry.name);
      if (entry.isDirectory()) { walk(full); continue; }
      if (entry.name.endsWith('.test.tsx') || entry.name.endsWith('.test.ts')) {
        const content = fs.readFileSync(full, 'utf-8');
        // Extract imported component names
        const imports = content.matchAll(/import\s+\{([^}]+)\}\s+from\s+['"][^'"]+['"]/g);
        for (const m of imports) {
          for (const name of m[1].split(',').map(s => s.trim())) {
            if (name && /^[A-Z]/.test(name)) {
              if (!testMap.has(name)) testMap.set(name, []);
              testMap.get(name).push(path.relative(SRC, full));
            }
          }
        }
        // Count test cases
        const testCount = (content.match(/\bit\s*\(/g) || []).length;
        const describeMatch = content.match(/describe\s*\(\s*['"`]([^'"`]+)/);
        if (describeMatch) {
          const name = describeMatch[1];
          if (!testMap.has(name)) testMap.set(name, []);
          testMap.get(name).push(`${path.relative(SRC, full)}:${testCount}tests`);
        }
      }
    }
  }
  walk(SRC);
  return testMap;
}

function auditComponent(filePath, relPath, dir) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  const lineCount = lines.length;
  const componentName = path.basename(filePath, '.tsx');

  const issues = [];
  const info = {
    name: componentName,
    path: relPath,
    dir,
    lineCount,
    issues: [],
    score: 100, // Start perfect, deduct
  };

  // 1. displayName check
  const hasDisplayName = /\.displayName\s*=/.test(content);
  const needsDisplayName = DISPLAY_NAME_REQUIRED.includes(dir);
  if (needsDisplayName && !hasDisplayName) {
    issues.push({ severity: 'warn', rule: 'display-name', message: `Missing displayName (required in ${dir}/)` });
    info.score -= 5;
  }
  info.hasDisplayName = hasDisplayName;

  // 2. AccessControlledProps check
  const hasAccessControl = /AccessControlledProps|resolveAccessState|access.*control/i.test(content);
  const needsAccessControl = ACCESS_CONTROL_REQUIRED.includes(dir);
  if (needsAccessControl && !hasAccessControl) {
    issues.push({ severity: 'warn', rule: 'access-control', message: `Missing AccessControlledProps (required in ${dir}/)` });
    info.score -= 10;
  }
  info.hasAccessControl = hasAccessControl;

  // 3. forwardRef check
  const hasForwardRef = /forwardRef|React\.forwardRef/.test(content);
  const needsForwardRef = DISPLAY_NAME_REQUIRED.includes(dir);
  if (needsForwardRef && !hasForwardRef && !['Provider', 'Context'].some(s => componentName.includes(s))) {
    issues.push({ severity: 'info', rule: 'forward-ref', message: 'No forwardRef (recommended for primitives/components)' });
    info.score -= 3;
  }
  info.hasForwardRef = hasForwardRef;

  // 4. cn() usage
  info.usesCn = /\bcn\s*\(/.test(content);

  // 5. Type exports
  const typeExports = content.match(/export\s+(?:type|interface)\s+(\w+)/g) || [];
  info.exportedTypes = typeExports.map(t => t.replace(/export\s+(?:type|interface)\s+/, ''));
  if (info.exportedTypes.length === 0 && lineCount > 50) {
    issues.push({ severity: 'info', rule: 'type-exports', message: 'No exported types/interfaces' });
    info.score -= 2;
  }

  // 6. Hardcoded strings
  const hardcodedStrings = [];
  for (const { pattern, lang, type } of HARDCODED_PATTERNS) {
    const cloned = new RegExp(pattern.source, pattern.flags);
    let match;
    while ((match = cloned.exec(content)) !== null) {
      const lineNum = content.substring(0, match.index).split('\n').length;
      hardcodedStrings.push({ text: match[0], lang, type, line: lineNum });
    }
  }
  if (hardcodedStrings.length > 0) {
    issues.push({
      severity: 'warn',
      rule: 'i18n-hardcoded',
      message: `${hardcodedStrings.length} hardcoded UI string(s): ${hardcodedStrings.map(s => `L${s.line}:${s.text}`).join(', ')}`,
    });
    info.score -= Math.min(15, hardcodedStrings.length * 3);
  }
  info.hardcodedStrings = hardcodedStrings;

  // 7. Empty/null handling patterns
  const hasEmptyCheck = /\.length\s*===?\s*0|!.*\.length|isEmpty|\.filter|\.some/i.test(content);
  const hasNullCheck = /\?\.|!= null|!== null|!== undefined|\?\? /.test(content);
  info.hasEmptyCheck = hasEmptyCheck;
  info.hasNullCheck = hasNullCheck;

  // 8. Props interface detection
  const propsMatch = content.match(/interface\s+(\w+Props)\s*(?:extends[^{]*)?\{/);
  info.propsInterface = propsMatch ? propsMatch[1] : null;
  if (!propsMatch && lineCount > 30) {
    issues.push({ severity: 'info', rule: 'props-interface', message: 'No Props interface found' });
    info.score -= 2;
  }

  // 9. aria/a11y attributes
  info.hasAriaAttributes = /aria-|role=/.test(content);

  info.issues = issues;
  info.score = Math.max(0, info.score);
  return info;
}

// ── Main ──
const args = process.argv.slice(2);
const isCI = args.includes('--ci');
const isJSON = args.includes('--json');

console.log('🔍 Design System Component Audit\n');

// Discover all components
const allComponents = [];
for (const dir of COMPONENT_DIRS) {
  allComponents.push(...findComponents(dir));
}

// Discover test coverage
const testMap = findTestFiles();

// Audit each component
const results = [];
for (const { fullPath, relPath, dir } of allComponents) {
  const result = auditComponent(fullPath, relPath, dir);
  const name = result.name;
  result.hasTests = testMap.has(name);
  result.testInfo = testMap.get(name) || [];
  if (!result.hasTests && result.lineCount > 30) {
    result.issues.push({ severity: 'warn', rule: 'test-coverage', message: 'No test file found' });
    result.score -= 10;
    result.score = Math.max(0, result.score);
  }
  results.push(result);
}

// ── Report ──
if (isJSON) {
  console.log(JSON.stringify(results, null, 2));
  process.exit(0);
}

// Summary by directory
const dirSummary = {};
for (const r of results) {
  if (!dirSummary[r.dir]) dirSummary[r.dir] = { count: 0, avgScore: 0, issues: 0, noTest: 0, noAccessControl: 0, hardcoded: 0 };
  const s = dirSummary[r.dir];
  s.count++;
  s.avgScore += r.score;
  s.issues += r.issues.length;
  if (!r.hasTests) s.noTest++;
  if (!r.hasAccessControl && ACCESS_CONTROL_REQUIRED.includes(r.dir)) s.noAccessControl++;
  s.hardcoded += r.hardcodedStrings.length;
}

console.log('┌─────────────────┬───────┬───────┬────────┬─────────┬───────────┬──────────┐');
console.log('│ Directory       │ Count │ Score │ Issues │ No Test │ No Access │ Hardcode │');
console.log('├─────────────────┼───────┼───────┼────────┼─────────┼───────────┼──────────┤');
for (const [dir, s] of Object.entries(dirSummary).sort((a, b) => a[0].localeCompare(b[0]))) {
  const avg = Math.round(s.avgScore / s.count);
  const scoreColor = avg >= 80 ? '\x1b[32m' : avg >= 60 ? '\x1b[33m' : '\x1b[31m';
  console.log(`│ ${dir.padEnd(15)} │ ${String(s.count).padStart(5)} │ ${scoreColor}${String(avg).padStart(4)}\x1b[0m% │ ${String(s.issues).padStart(6)} │ ${String(s.noTest).padStart(7)} │ ${String(s.noAccessControl).padStart(9)} │ ${String(s.hardcoded).padStart(8)} │`);
}
console.log('└─────────────────┴───────┴───────┴────────┴─────────┴───────────┴──────────┘');

const totalComponents = results.length;
const avgScore = Math.round(results.reduce((s, r) => s + r.score, 0) / totalComponents);
const totalIssues = results.reduce((s, r) => s + r.issues.length, 0);
const noTestCount = results.filter(r => !r.hasTests && r.lineCount > 30).length;

console.log(`\nTotal: ${totalComponents} components | Avg score: ${avgScore}% | Issues: ${totalIssues} | No tests: ${noTestCount}`);

// Show worst offenders
const worst = results.filter(r => r.score < 70).sort((a, b) => a.score - b.score).slice(0, 15);
if (worst.length > 0) {
  console.log('\n⚠️  Components needing attention (score < 70):');
  for (const r of worst) {
    console.log(`  ${r.score}% │ ${r.path}`);
    for (const issue of r.issues) {
      console.log(`      ${issue.severity === 'warn' ? '⚠' : 'ℹ'} [${issue.rule}] ${issue.message}`);
    }
  }
}

// CI gate
if (isCI) {
  const failing = results.filter(r => r.score < 50);
  if (failing.length > 0) {
    console.error(`\n❌ CI GATE FAILED: ${failing.length} component(s) below 50% quality score`);
    for (const r of failing) {
      console.error(`  ${r.score}% │ ${r.path}`);
    }
    process.exit(1);
  }
  console.log('\n✅ CI GATE PASSED: All components above 50% quality score');
}
