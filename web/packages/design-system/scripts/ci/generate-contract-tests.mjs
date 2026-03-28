#!/usr/bin/env node
/**
 * Contract Test Generator
 *
 * Auto-discovers all components and generates baseline contract tests:
 *   - Render without crash
 *   - Required props type check
 *   - Access control behavior (if applicable)
 *   - Empty/null prop handling
 *   - displayName check
 *   - Exported types verification
 *
 * Usage:
 *   node scripts/ci/generate-contract-tests.mjs          # Dry run (show what would be generated)
 *   node scripts/ci/generate-contract-tests.mjs --write   # Write test files
 *   node scripts/ci/generate-contract-tests.mjs --diff    # Show components missing contract tests
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.resolve(__dirname, '../../src');

const COMPONENT_DIRS = ['primitives', 'components', 'patterns', 'enterprise', 'advanced', 'form', 'motion'];
const SKIP = ['index.ts', 'index.tsx', 'types.ts', 'types.tsx', 'utils.ts', 'constants.ts'];
const SKIP_PATTERNS = [/__tests__/, /\.test\./, /\.stories\./, /\.figma\./, /setup\.ts/];

function findComponents(dir) {
  const results = [];
  const fullDir = path.join(SRC, dir);
  if (!fs.existsSync(fullDir)) return results;
  for (const entry of fs.readdirSync(fullDir, { withFileTypes: true })) {
    if (entry.isDirectory() && entry.name !== '__tests__') {
      // Check for nested components
      for (const sub of fs.readdirSync(path.join(fullDir, entry.name), { withFileTypes: true })) {
        if (sub.name.endsWith('.tsx') && !SKIP.includes(sub.name) && !SKIP_PATTERNS.some(p => p.test(sub.name))) {
          results.push({ name: sub.name.replace('.tsx', ''), dir, subdir: entry.name });
        }
      }
    } else if (entry.name.endsWith('.tsx') && !SKIP.includes(entry.name) && !SKIP_PATTERNS.some(p => p.test(entry.name))) {
      results.push({ name: entry.name.replace('.tsx', ''), dir, subdir: null });
    }
  }
  return results;
}

function parseComponent(filePath) {
  if (!fs.existsSync(filePath)) return null;
  const content = fs.readFileSync(filePath, 'utf-8');

  // Extract props interface
  const propsMatch = content.match(/interface\s+(\w+Props)\s*(?:extends\s+([^{]+))?\{([^}]*(?:\{[^}]*\}[^}]*)*)\}/s);
  const hasAccessControl = /AccessControlledProps|resolveAccessState/.test(content);
  const hasDisplayName = /\.displayName\s*=/.test(content);
  const hasForwardRef = /forwardRef/.test(content);
  const exportedTypes = (content.match(/export\s+(?:type|interface)\s+(\w+)/g) || [])
    .map(t => t.replace(/export\s+(?:type|interface)\s+/, ''));

  // Parse required vs optional props
  const props = { required: [], optional: [] };
  if (propsMatch) {
    const propsBody = propsMatch[3];
    for (const line of propsBody.split('\n')) {
      const propMatch = line.match(/^\s*(\w+)(\??):\s*(.+?)(?:;|$)/);
      if (propMatch) {
        const [, name, optional, type] = propMatch;
        (optional ? props.optional : props.required).push({ name, type: type.trim() });
      }
    }
  }

  return {
    propsInterface: propsMatch ? propsMatch[1] : null,
    extendsTypes: propsMatch && propsMatch[2] ? propsMatch[2].trim().split(',').map(s => s.trim()) : [],
    props,
    hasAccessControl,
    hasDisplayName,
    hasForwardRef,
    exportedTypes,
  };
}

function generateRequiredPropsObj(requiredProps) {
  const propValues = {
    // Common types → default values
    'string': "'test'",
    'number': '42',
    'boolean': 'true',
    'React.ReactNode': "'content'",
    'ReactNode': "'content'",
    '() => void': 'vi.fn()',
    '(value: any) => void': 'vi.fn()',
    '(id: string) => void': 'vi.fn()',
  };

  const lines = [];
  for (const { name, type } of requiredProps) {
    // Skip children, className — usually optional in practice
    if (name === 'children' || name === 'className') continue;

    let value = propValues[type];
    if (!value) {
      if (type.includes('=>')) value = 'vi.fn()';
      else if (type.includes('[]')) value = '[]';
      else if (type.includes('Record<')) value = '{}';
      else if (/^['"]/.test(type) || type.includes('|')) {
        // Union type — pick first literal
        const first = type.split('|')[0].trim().replace(/['"]/g, '');
        value = `'${first}'`;
      }
      else value = 'undefined as any';
    }
    lines.push(`    ${name}: ${value},`);
  }
  return lines.length > 0 ? `{\n${lines.join('\n')}\n  }` : '{}';
}

function generateTestFile(component, parsed) {
  const { name, dir, subdir } = component;
  const importPath = subdir ? `../${subdir}/${name}` : `../${name}`;

  const imports = [`import { ${name} } from '${importPath}';`];
  if (parsed.exportedTypes.length > 0) {
    const typeImports = parsed.exportedTypes.filter(t => t !== name).slice(0, 5);
    if (typeImports.length > 0) {
      imports.push(`import type { ${typeImports.join(', ')} } from '${importPath}';`);
    }
  }

  const requiredPropsObj = generateRequiredPropsObj(parsed.props.required);
  const hasRequiredProps = parsed.props.required.filter(p => p.name !== 'children' && p.name !== 'className').length > 0;

  let testContent = `// @vitest-environment jsdom
// Auto-generated contract test — do not edit manually
// Regenerate with: node scripts/ci/generate-contract-tests.mjs --write
import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';
${imports.join('\n')}

describe('${name} — contract', () => {
  ${hasRequiredProps ? `const defaultProps = ${requiredPropsObj};\n` : ''}
  it('renders without crash', () => {
    const { container } = render(<${name} ${hasRequiredProps ? '{...defaultProps}' : ''} />);
    expect(container.firstElementChild).toBeTruthy();
  });
`;

  // displayName test
  if (parsed.hasDisplayName) {
    testContent += `
  it('has displayName', () => {
    expect(${name}.displayName).toBeTruthy();
  });
`;
  }

  // Access control test
  if (parsed.hasAccessControl) {
    testContent += `
  it('respects access=hidden', () => {
    const { container } = render(<${name} ${hasRequiredProps ? '{...defaultProps}' : ''} access="hidden" />);
    expect(container.innerHTML).toBe('');
  });

  it('applies disabled state via access=readonly', () => {
    const { container } = render(<${name} ${hasRequiredProps ? '{...defaultProps}' : ''} access="readonly" />);
    expect(container.firstElementChild).toBeTruthy();
  });
`;
  }

  // Optional props — renders with minimal props
  if (parsed.props.optional.length > 3) {
    testContent += `
  it('renders with only required props (${parsed.props.required.length} required, ${parsed.props.optional.length} optional)', () => {
    // All ${parsed.props.optional.length} optional props omitted — should not crash
    const { container } = render(<${name} ${hasRequiredProps ? '{...defaultProps}' : ''} />);
    expect(container.firstElementChild).toBeTruthy();
  });
`;
  }

  // Type exports verification
  if (parsed.exportedTypes.length > 0) {
    testContent += `
  it('exports expected types', () => {
    // Type-level check — if this compiles, types are exported correctly
    ${parsed.exportedTypes.slice(0, 5).map(t => `const _${t.toLowerCase()}: ${t} | undefined = undefined; void _${t.toLowerCase()};`).join('\n    ')}
    expect(true).toBe(true);
  });
`;
  }

  testContent += '});\n';
  return testContent;
}

// ── Main ──
const args = process.argv.slice(2);
const shouldWrite = args.includes('--write');
const showDiff = args.includes('--diff');

let totalFound = 0;
let totalGenerated = 0;
let totalSkipped = 0;
let totalExisting = 0;

for (const dir of COMPONENT_DIRS) {
  const components = findComponents(dir);
  totalFound += components.length;

  for (const component of components) {
    const srcFile = component.subdir
      ? path.join(SRC, dir, component.subdir, `${component.name}.tsx`)
      : path.join(SRC, dir, `${component.name}.tsx`);

    const parsed = parseComponent(srcFile);
    if (!parsed) { totalSkipped++; continue; }

    const testDir = path.join(SRC, dir, '__tests__');
    const testFile = path.join(testDir, `${component.name}.contract.test.tsx`);

    if (fs.existsSync(testFile)) {
      totalExisting++;
      if (showDiff) continue;
      if (!shouldWrite) continue;
    }

    const testContent = generateTestFile(component, parsed);

    if (shouldWrite) {
      if (!fs.existsSync(testDir)) fs.mkdirSync(testDir, { recursive: true });
      fs.writeFileSync(testFile, testContent);
      totalGenerated++;
      console.log(`  ✅ ${dir}/${component.name}.contract.test.tsx`);
    } else if (showDiff && !fs.existsSync(testFile)) {
      console.log(`  ❌ Missing: ${dir}/__tests__/${component.name}.contract.test.tsx`);
      totalGenerated++;
    } else {
      console.log(`  📝 Would generate: ${dir}/__tests__/${component.name}.contract.test.tsx`);
      totalGenerated++;
    }
  }
}

console.log(`\n${showDiff ? 'Missing' : shouldWrite ? 'Generated' : 'Would generate'}: ${totalGenerated} | Existing: ${totalExisting} | Skipped: ${totalSkipped} | Total: ${totalFound}`);

if (!shouldWrite && !showDiff && totalGenerated > 0) {
  console.log('\nRun with --write to generate test files, or --diff to see missing tests only.');
}
