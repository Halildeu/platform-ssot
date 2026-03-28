import axeCore from 'axe-core';
import { expect } from 'vitest';

/**
 * Runs axe-core accessibility audit on a container element.
 * Reports violations as test failures with helpful descriptions.
 *
 * @example
 * ```tsx
 * it('has no a11y violations', async () => {
 *   const { container } = render(<Button>Click</Button>);
 *   await expectNoA11yViolations(container);
 * });
 * ```
 */
export async function expectNoA11yViolations(container: HTMLElement): Promise<void> {
  const results = await axeCore.run(container, {
    rules: {
      // Relax rules that are too strict for unit test context
      'color-contrast': { enabled: false }, // CSS variables not resolved in jsdom
      'region': { enabled: false }, // No landmark regions in unit tests
    },
  });

  if (results.violations.length > 0) {
    const violationMessages = results.violations.map((violation) => {
      const nodes = violation.nodes.map((node) =>
        `  - ${node.html}\n    ${node.failureSummary}`,
      ).join('\n');
      return `[${violation.impact}] ${violation.id}: ${violation.description}\n${nodes}`;
    }).join('\n\n');

    expect.fail(`axe-core found ${results.violations.length} accessibility violation(s):\n\n${violationMessages}`);
  }
}
