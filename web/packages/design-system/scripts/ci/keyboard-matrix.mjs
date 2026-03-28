#!/usr/bin/env node
/**
 * keyboard-matrix.mjs — Keyboard navigation coverage audit
 * Checks which interactive components have keyboard interaction tests.
 */
import fs from 'fs';
import path from 'path';

const SRC = 'src';

// Interactive components that MUST have keyboard tests
const INTERACTIVE_COMPONENTS = [
  'Button', 'Input', 'Select', 'Checkbox', 'Radio', 'Switch', 'Tabs',
  'Accordion', 'Dialog', 'Drawer', 'Modal', 'Dropdown', 'Popover',
  'Tooltip', 'CommandPalette', 'DatePicker', 'TimePicker', 'Slider',
  'Tree', 'MenuBar', 'NavigationRail', 'Pagination', 'SearchInput',
  'Combobox', 'Cascader', 'Autocomplete', 'InlineEdit', 'FilterPresets',
  'DataExportDialog', 'DateRangePicker', 'ColorPicker', 'InputNumber',
  'Upload', 'Transfer', 'TreeTable', 'TableSimple',
];

// Keyboard patterns to look for in tests
const KB_PATTERNS = [
  { name: 'Enter', pattern: /key.*Enter|Enter.*key|{Enter}|keyboard.*Enter/i },
  { name: 'Escape', pattern: /key.*Escape|Escape.*key|{Escape}|keyboard.*Escape/i },
  { name: 'Tab', pattern: /user\.tab|key.*Tab|Tab.*key|{Tab}/i },
  { name: 'ArrowDown', pattern: /ArrowDown|Arrow.*Down/i },
  { name: 'ArrowUp', pattern: /ArrowUp|Arrow.*Up/i },
  { name: 'Space', pattern: /key.*Space|Space.*key|{ }/i },
];

function findTestFiles(componentName) {
  // Search in common test locations
  const results = [];
  const kebab = componentName.replace(/([A-Z])/g, (_, c, i) => i ? `-${c.toLowerCase()}` : c.toLowerCase());

  const searchDirs = [
    `${SRC}/primitives/${kebab}/__tests__`,
    `${SRC}/components/${kebab}/__tests__`,
    `${SRC}/enterprise/__tests__`,
    `${SRC}/advanced/data-grid/__tests__`,
    `${SRC}/form/__tests__`,
    `${SRC}/__tests__`,
  ];

  for (const dir of searchDirs) {
    if (!fs.existsSync(dir)) continue;
    for (const f of fs.readdirSync(dir)) {
      if (!f.endsWith('.test.tsx') && !f.endsWith('.test.ts')) continue;
      const content = fs.readFileSync(path.join(dir, f), 'utf-8');
      if (content.includes(componentName) || content.includes(`<${componentName}`)) {
        results.push({ path: path.join(dir, f), content });
      }
    }
  }
  return results;
}

function main() {
  console.log('⌨️  Keyboard Navigation Matrix\n');

  const matrix = [];
  let covered = 0;

  for (const name of INTERACTIVE_COMPONENTS) {
    const testFiles = findTestFiles(name);
    const allContent = testFiles.map(f => f.content).join('\n');

    const keys = {};
    for (const { name: kbName, pattern } of KB_PATTERNS) {
      keys[kbName] = pattern.test(allContent);
    }

    const hasAnyKb = Object.values(keys).some(Boolean);
    if (hasAnyKb) covered++;

    matrix.push({ name, keys, covered: hasAnyKb, testCount: testFiles.length });
  }

  // Print matrix
  const header = '  Component                  Enter Esc   Tab   ↓     ↑     Space';
  console.log(header);
  console.log('  ' + '─'.repeat(header.length - 2));

  for (const row of matrix) {
    const cells = KB_PATTERNS.map(p => row.keys[p.name] ? '  ✅  ' : '  ·   ');
    const status = row.covered ? '✅' : '❌';
    console.log(`  ${status} ${row.name.padEnd(25)} ${cells.join('')}`);
  }

  const pct = Math.round(covered / INTERACTIVE_COMPONENTS.length * 100);
  console.log(`\n  Coverage: ${covered}/${INTERACTIVE_COMPONENTS.length} (${pct}%)`);
  console.log(`  ${pct >= 70 ? '✅' : '❌'} Keyboard matrix: ${pct}% (threshold: 70%)`);
}

main();
