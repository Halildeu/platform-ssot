import { test, expect } from '@playwright/test';

/**
 * Responsive viewport tests for complex Design Lab components.
 *
 * Verifies that components render correctly at mobile (375px), tablet (768px),
 * and desktop (1280px) widths without horizontal overflow.
 *
 * Generate baselines:
 *   npx playwright test e2e/responsive/viewport-tests.spec.ts --update-snapshots
 */

// ---------------------------------------------------------------------------
// Components to test at multiple viewports
// ---------------------------------------------------------------------------
const RESPONSIVE_COMPONENTS = [
  { name: 'TableSimple', path: '/admin/design-lab/components/data_display/TableSimple' },
  { name: 'SearchFilterListing', path: '/admin/design-lab/components/search_filtering/SearchFilterListing' },
  { name: 'MenuBar', path: '/admin/design-lab/components/navigation/MenuBar' },
  { name: 'Accordion', path: '/admin/design-lab/components/data_display/Accordion' },
  { name: 'CommandPalette', path: '/admin/design-lab/components/ai_native_helpers/CommandPalette' },
];

const VIEWPORTS = [
  { label: 'mobile', width: 375, height: 812 },
  { label: 'tablet', width: 768, height: 1024 },
  { label: 'desktop', width: 1280, height: 800 },
] as const;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Check that the page has no horizontal overflow.
 * Returns the delta (scrollWidth - clientWidth); 0 means no overflow.
 */
async function getHorizontalOverflow(page: import('@playwright/test').Page): Promise<number> {
  return page.evaluate(() => {
    const body = document.body;
    const html = document.documentElement;
    const scrollWidth = Math.max(body.scrollWidth, html.scrollWidth);
    const clientWidth = Math.max(body.clientWidth, html.clientWidth);
    return scrollWidth - clientWidth;
  });
}

/**
 * Locate the primary content area for screenshotting.
 */
async function getContentLocator(page: import('@playwright/test').Page) {
  const preview = page
    .locator('section, div')
    .filter({ hasText: /LIVE PREVIEW|LİVE PREVİEW|Live Preview/ })
    .first();

  if (await preview.isVisible().catch(() => false)) {
    return preview;
  }

  return page.locator('main, [class*="content"]').first();
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

test.describe('Responsive Viewport Tests', () => {
  for (const component of RESPONSIVE_COMPONENTS) {
    for (const vp of VIEWPORTS) {
      test(`${component.name} @ ${vp.label} (${vp.width}px) — no horizontal overflow`, async ({
        browser,
      }) => {
        const context = await browser.newContext({
          viewport: { width: vp.width, height: vp.height },
        });
        const page = await context.newPage();

        await page.goto(component.path, { waitUntil: 'networkidle' });
        await page.waitForTimeout(1000);

        // Assert no horizontal overflow
        const overflow = await getHorizontalOverflow(page);
        expect(overflow, `Horizontal overflow detected (${overflow}px)`).toBeLessThanOrEqual(2);

        await context.close();
      });

      test(`${component.name} @ ${vp.label} (${vp.width}px) — visual snapshot`, async ({
        browser,
      }) => {
        const context = await browser.newContext({
          viewport: { width: vp.width, height: vp.height },
        });
        const page = await context.newPage();

        await page.goto(component.path, { waitUntil: 'networkidle' });
        await page.waitForTimeout(1000);

        const content = await getContentLocator(page);
        await expect(content).toHaveScreenshot(
          `${component.name}-${vp.label}-${vp.width}.png`,
          { animations: 'disabled' },
        );

        await context.close();
      });
    }
  }
});
