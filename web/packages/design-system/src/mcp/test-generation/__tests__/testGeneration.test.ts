// @vitest-environment node
import { describe, it, expect } from 'vitest';
import { generateContractTest } from '../generateContractTest';
import { generateVisualScenarios } from '../generateVisualScenarios';
import type { MCPComponentInfo } from '../../types';

const mockComponent: MCPComponentInfo = {
  name: 'TestButton',
  description: 'A test button',
  category: 'interactive',
  lifecycle: 'stable',
  props: [
    { name: 'label', type: 'string', required: true, default: '', description: 'Button label' },
    { name: 'variant', type: "'primary' | 'secondary' | 'ghost'", required: false, default: 'primary', description: 'Visual variant' },
    { name: 'size', type: "'sm' | 'md' | 'lg'", required: false, default: 'md', description: 'Button size' },
    { name: 'disabled', type: 'boolean', required: false, default: 'false', description: 'Disabled state' },
  ],
  importStatement: "import { TestButton } from '@mfe/design-system';",
  examples: [],
  relatedComponents: ['IconButton'],
  accessibilityNotes: ['Use aria-label for icon-only buttons'],
};

describe('generateContractTest', () => {
  it('generates valid test code string', () => {
    const code = generateContractTest(mockComponent);
    expect(code).toContain('describe');
    expect(code).toContain('TestButton');
    expect(code).toContain('vitest');
  });

  it('includes required prop tests', () => {
    const code = generateContractTest(mockComponent);
    expect(code).toContain('label');
  });

  it('includes a11y test', () => {
    const code = generateContractTest(mockComponent);
    expect(code).toContain('a11y');
  });

  it('includes access control test', () => {
    const code = generateContractTest(mockComponent);
    expect(code).toContain('access="hidden"');
  });
});

describe('generateVisualScenarios', () => {
  it('generates theme × density matrix', () => {
    const scenarios = generateVisualScenarios(mockComponent);
    expect(scenarios.length).toBeGreaterThanOrEqual(4); // 2 themes × 2 densities
    const names = scenarios.map(s => s.name);
    expect(names).toContain('TestButton-light-comfortable');
    expect(names).toContain('TestButton-dark-compact');
  });

  it('includes variant scenarios for union-type props', () => {
    const scenarios = generateVisualScenarios(mockComponent);
    const variantScenarios = scenarios.filter(s => s.name.includes('variant'));
    expect(variantScenarios.length).toBeGreaterThan(0);
  });

  it('scenario objects have correct shape', () => {
    const scenarios = generateVisualScenarios(mockComponent);
    for (const s of scenarios) {
      expect(s).toHaveProperty('name');
      expect(s).toHaveProperty('theme');
      expect(s).toHaveProperty('density');
      expect(s).toHaveProperty('props');
    }
  });

  it('limits variant values to max 3', () => {
    const scenarios = generateVisualScenarios(mockComponent);
    const sizeScenarios = scenarios.filter(s => s.name.includes('size'));
    expect(sizeScenarios.length).toBeLessThanOrEqual(3);
  });
});
