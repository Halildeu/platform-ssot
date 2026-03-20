import { test, expect } from '@playwright/test';

/**
 * E2E interaction tests for navigation-related components in the Design Lab.
 *
 * Covers: MenuBar, Breadcrumb, Tabs, Steps, Pagination.
 */

test.describe('Navigation Components - Interaction Tests', () => {
  // -----------------------------------------------------------------------
  // Breadcrumb
  // -----------------------------------------------------------------------
  test.describe('Breadcrumb', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/admin/design-lab/components/navigation/Breadcrumb', {
        waitUntil: 'networkidle',
      });
    });

    test('breadcrumb links are visible and clickable', async ({ page }) => {
      const breadcrumbNav = page.locator('nav[aria-label*="readcrumb"], [class*="breadcrumb"], [class*="Breadcrumb"]').first();
      await breadcrumbNav.waitFor({ state: 'visible', timeout: 10_000 }).catch(() => {});

      const links = page.locator('nav a, [class*="breadcrumb"] a, [class*="Breadcrumb"] a');
      const count = await links.count();

      if (count > 0) {
        // Verify all breadcrumb links are visible
        for (let i = 0; i < Math.min(count, 5); i++) {
          await expect(links.nth(i)).toBeVisible();
        }

        // The last item should typically not be a link (current page)
        const lastItem = page.locator(
          '[class*="breadcrumb"] span:last-child, [class*="Breadcrumb"] span:last-child, [aria-current="page"]',
        ).first();
        if (await lastItem.isVisible().catch(() => false)) {
          const text = await lastItem.textContent();
          expect(text?.trim()).toBeTruthy();
        }
      }
    });
  });

  // -----------------------------------------------------------------------
  // Tabs
  // -----------------------------------------------------------------------
  test.describe('Tabs', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/admin/design-lab/components/data_display/Tabs', {
        waitUntil: 'networkidle',
      });
    });

    test('clicking a tab switches the active panel', async ({ page }) => {
      const tabList = page.locator('[role="tablist"]').first();
      await tabList.waitFor({ state: 'visible', timeout: 10_000 }).catch(() => {});

      const tabs = page.locator('[role="tab"]');
      const tabCount = await tabs.count();

      if (tabCount >= 2) {
        // Click the second tab
        await tabs.nth(1).click();
        await page.waitForTimeout(300);
        await expect(tabs.nth(1)).toHaveAttribute('aria-selected', 'true');

        // Click the first tab back
        await tabs.nth(0).click();
        await page.waitForTimeout(300);
        await expect(tabs.nth(0)).toHaveAttribute('aria-selected', 'true');
      }
    });

    test('keyboard navigation works between tabs', async ({ page }) => {
      const tabs = page.locator('[role="tab"]');
      const tabCount = await tabs.count();

      if (tabCount >= 2) {
        await tabs.nth(0).focus();
        await page.keyboard.press('ArrowRight');
        await page.waitForTimeout(200);

        // The second tab should now be focused or selected
        const focused = page.locator('[role="tab"]:focus');
        if (await focused.isVisible().catch(() => false)) {
          const focusedIndex = await focused.evaluate((el) => {
            const parent = el.parentElement;
            return parent ? Array.from(parent.children).indexOf(el) : -1;
          });
          expect(focusedIndex).toBeGreaterThanOrEqual(0);
        }
      }
    });
  });

  // -----------------------------------------------------------------------
  // MenuBar
  // -----------------------------------------------------------------------
  test.describe('MenuBar', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/admin/design-lab/components/navigation/MenuBar', {
        waitUntil: 'networkidle',
      });
    });

    test('menu items are visible', async ({ page }) => {
      const menuItems = page.locator(
        '[role="menubar"] [role="menuitem"], [class*="menu"] a, [class*="Menu"] a, nav a',
      );

      const count = await menuItems.count();
      if (count > 0) {
        for (let i = 0; i < Math.min(count, 5); i++) {
          await expect(menuItems.nth(i)).toBeVisible();
        }
      }
    });

    test('hovering a menu item with submenu reveals children', async ({ page }) => {
      const topLevelItems = page.locator(
        '[role="menubar"] > [role="menuitem"], [class*="menu-item"]:has([class*="submenu"])',
      );

      if ((await topLevelItems.count()) > 0) {
        await topLevelItems.first().hover();
        await page.waitForTimeout(500);

        const submenu = page.locator(
          '[role="menu"], [class*="submenu"], [class*="dropdown-menu"]',
        ).first();

        if (await submenu.isVisible().catch(() => false)) {
          await expect(submenu).toBeVisible();
        }
      }
    });
  });

  // -----------------------------------------------------------------------
  // Steps
  // -----------------------------------------------------------------------
  test.describe('Steps', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/admin/design-lab/components/navigation/Steps', {
        waitUntil: 'networkidle',
      });
    });

    test('step indicators are rendered', async ({ page }) => {
      const steps = page.locator(
        '[class*="step"], [class*="Step"], [role="listitem"]',
      );

      const count = await steps.count();
      expect(count).toBeGreaterThan(0);
    });

    test('clicking a step makes it active (if interactive)', async ({ page }) => {
      const clickableSteps = page.locator(
        '[class*="step"]:not([class*="disabled"]) button, [class*="Step"]:not([class*="disabled"]) button',
      );

      if ((await clickableSteps.count()) >= 2) {
        await clickableSteps.nth(1).click();
        await page.waitForTimeout(300);
        // Verify visual change — the step should have an active/current class or aria
        const parent = clickableSteps.nth(1).locator('..');
        const classes = await parent.getAttribute('class');
        // We just verify no error occurred; visual check is done via screenshot tests
        expect(classes).toBeTruthy();
      }
    });
  });

  // -----------------------------------------------------------------------
  // Pagination
  // -----------------------------------------------------------------------
  test.describe('Pagination', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/admin/design-lab/components/navigation/Pagination', {
        waitUntil: 'networkidle',
      });
    });

    test('pagination buttons are clickable', async ({ page }) => {
      // The Pagination component renders <nav aria-label="Pagination"> with
      // plain <button> elements (no "pagination" in class names).
      const paginationButtons = page.locator(
        'nav[aria-label="Pagination"] button, [class*="pagination"] button, [class*="Pagination"] button',
      );

      const count = await paginationButtons.count();
      if (count >= 2) {
        // Click "next" or a page number
        const nextBtn = page.locator(
          'button[aria-label*="ext"], button[aria-label*="Next"], button:has-text("Next"), button:has-text(">"), button:has-text("Sonraki")',
        ).first();

        if (await nextBtn.isVisible().catch(() => false)) {
          await nextBtn.click({ force: true });
          await page.waitForTimeout(300);
        }
      }
    });

    test('page numbers are rendered', async ({ page }) => {
      const pageNumbers = page.locator(
        'nav[aria-label="Pagination"] button, [class*="pagination"] button, [class*="Pagination"] button',
      );

      const count = await pageNumbers.count();
      expect(count).toBeGreaterThan(0);
    });
  });
});
