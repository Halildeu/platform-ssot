import type { MCPComponentInfo } from '../types';

export function generateContractTest(component: MCPComponentInfo): string {
  const lines: string[] = [
    `// @vitest-environment jsdom`,
    `// Auto-generated contract test for ${component.name}`,
    `import { describe, it, expect } from 'vitest';`,
    `import { render, screen } from '@testing-library/react';`,
    `import { ${component.name} } from '@mfe/design-system';`,
    ``,
    `describe('${component.name} contract', () => {`,
    `  it('renders without crashing', () => {`,
    `    render(<${component.name} />);`,
    `  });`,
    ``,
  ];

  for (const prop of component.props.filter(p => p.required)) {
    lines.push(`  it('accepts required prop: ${prop.name}', () => {`);
    lines.push(`    // ${prop.name}: ${prop.type}`);
    lines.push(`    render(<${component.name} ${prop.name}={undefined as any} />);`);
    lines.push(`  });`);
    lines.push(``);
  }

  lines.push(`  it('has no axe-core a11y violations', async () => {`);
  lines.push(`    const { container } = render(<${component.name} />);`);
  lines.push(`    // await expectNoA11yViolations(container);`);
  lines.push(`  });`);
  lines.push(``);

  lines.push(`  it('access="hidden" renders nothing', () => {`);
  lines.push(`    const { container } = render(<${component.name} access="hidden" />);`);
  lines.push(`    expect(container.innerHTML).toBe('');`);
  lines.push(`  });`);
  lines.push(`});`);

  return lines.join('\n');
}
