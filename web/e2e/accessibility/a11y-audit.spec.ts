import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

/**
 * Accessibility audit tests using axe-core.
 *
 * Runs axe on 10 key component pages and asserts that there are no critical
 * or serious violations. Minor and moderate violations are logged as warnings
 * but do not fail the test.
 */

// ---------------------------------------------------------------------------
// Pages to audit
// ---------------------------------------------------------------------------
const A11Y_PAGES = [
  { name: 'Button', path: '/admin/design-lab/components/form_inputs/Button' },
  { name: 'Input', path: '/admin/design-lab/components/form_inputs/Input' },
  { name: 'Select', path: '/admin/design-lab/components/form_inputs/Select' },
  { name: 'Checkbox', path: '/admin/design-lab/components/form_inputs/Checkbox' },
  { name: 'TableSimple', path: '/admin/design-lab/components/data_display/TableSimple' },
  { name: 'Tabs', path: '/admin/design-lab/components/data_display/Tabs' },
  { name: 'Accordion', path: '/admin/design-lab/components/data_display/Accordion' },
  { name: 'MenuBar', path: '/admin/design-lab/components/navigation/MenuBar' },
  { name: 'Breadcrumb', path: '/admin/design-lab/components/navigation/Breadcrumb' },
  { name: 'Badge', path: '/admin/design-lab/components/general_identity/Badge' },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

interface AxeViolation {
  id: string;
  impact?: string | null;
  description: string;
  helpUrl: string;
  nodes: { html: string; failureSummary?: string }[];
}

function formatViolations(violations: AxeViolation[]): string {
  return violations
    .map((v) => {
      const nodeSnippets = v.nodes
        .slice(0, 3) // Show at most 3 nodes per violation
        .map((n) => `    - ${n.html}\n      ${n.failureSummary ?? ''}`)
        .join('\n');
      return `[${v.impact?.toUpperCase()}] ${v.id}: ${v.description}\n  ${v.helpUrl}\n${nodeSnippets}`;
    })
    .join('\n\n');
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

test.describe('Accessibility Audit (axe-core)', () => {
  for (const page_ of A11Y_PAGES) {
    test(`${page_.name} — no critical or serious a11y violations`, async ({ page }) => {
      await page.goto(page_.path, { waitUntil: 'networkidle' });
      await page.waitForTimeout(1500); // allow lazy content to load

      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze();

      // Separate violations by severity
      const critical = results.violations.filter((v) => v.impact === 'critical');
      const serious = results.violations.filter((v) => v.impact === 'serious');
      const minor = results.violations.filter(
        (v) => v.impact === 'minor' || v.impact === 'moderate',
      );

      // Log moderate/minor as warnings (do not fail)
      if (minor.length > 0) {
        console.warn(
          `[${page_.name}] ${minor.length} minor/moderate a11y issue(s):\n${formatViolations(minor)}`,
        );
      }

      // Fail on critical + serious
      const blocking = [...critical, ...serious];
      expect(
        blocking,
        `${blocking.length} critical/serious violation(s) on ${page_.name}:\n${formatViolations(blocking)}`,
      ).toHaveLength(0);
    });
  }

  // -----------------------------------------------------------------------
  // Bonus: Design Lab landing page audit
  // -----------------------------------------------------------------------
  test('Design Lab landing page — no critical or serious a11y violations', async ({ page }) => {
    await page.goto('/admin/design-lab', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1500);

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    const blocking = results.violations.filter(
      (v) => v.impact === 'critical' || v.impact === 'serious',
    );

    expect(
      blocking,
      `${blocking.length} critical/serious violation(s) on Design Lab landing:\n${formatViolations(blocking)}`,
    ).toHaveLength(0);
  });
});
