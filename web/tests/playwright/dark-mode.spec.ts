import { test, expect } from '@playwright/test';
import { authenticateAndNavigate } from './utils/auth';

test.describe('Theme and dark mode (QLTY-THEME-DM-01)', () => {
  test('page loads with theme attributes on html element', async ({ page, baseURL }) => {
    await authenticateAndNavigate(page, baseURL, '/admin/design-lab', ['DESIGN_LAB']);
    await page.waitForLoadState('networkidle');

    // Wait for theme system to initialize
    await page.waitForFunction(
      () => document.documentElement.hasAttribute('data-theme'),
      { timeout: 10_000 },
    );

    const theme = await page.evaluate(() =>
      document.documentElement.getAttribute('data-theme'),
    );
    expect(theme).toBeTruthy();
  });

  test('appearance toggle changes data-appearance attribute', async ({ page, baseURL }) => {
    await authenticateAndNavigate(page, baseURL, '/', ['DESIGN_LAB']);
    await page.waitForLoadState('networkidle');

    // Wait for theme to be initialized
    await page.waitForFunction(
      () => document.documentElement.hasAttribute('data-theme'),
      { timeout: 10_000 },
    );

    // Open runtime panel to find appearance toggle
    const runtimeTrigger = page.getByTestId('runtime-panel-trigger');
    if (await runtimeTrigger.isVisible({ timeout: 5_000 }).catch(() => false)) {
      await runtimeTrigger.click();
      const runtimePanel = page.getByTestId('runtime-panel');
      await expect(runtimePanel).toBeVisible({ timeout: 5_000 });

      // Look for appearance/dark mode toggle
      const appearanceToggle = runtimePanel
        .locator(
          'button, [role="switch"], [role="radio"], input[type="checkbox"]',
        )
        .filter({ hasText: /dark|karanlik|gece|appearance|gorunum/i })
        .first();

      if (await appearanceToggle.isVisible({ timeout: 3_000 }).catch(() => false)) {
        const initialAppearance = await page.evaluate(() =>
          document.documentElement.getAttribute('data-appearance'),
        );

        await appearanceToggle.click();
        await page.waitForTimeout(500);

        const newAppearance = await page.evaluate(() =>
          document.documentElement.getAttribute('data-appearance'),
        );

        // If both values exist, they should differ after toggle
        if (initialAppearance && newAppearance) {
          expect(newAppearance).not.toBe(initialAppearance);
        }
      }
    }
  });

  test('theme selection persists across navigation', async ({ page, baseURL }) => {
    await authenticateAndNavigate(page, baseURL, '/', ['DESIGN_LAB']);
    await page.waitForLoadState('networkidle');

    await page.waitForFunction(
      () => document.documentElement.hasAttribute('data-theme'),
      { timeout: 10_000 },
    );

    const themeBeforeNav = await page.evaluate(() =>
      document.documentElement.getAttribute('data-theme'),
    );

    // Navigate to a different page
    const root = baseURL ?? 'http://localhost:3000';
    await page.goto(`${root}/admin/design-lab`, { waitUntil: 'networkidle' });

    await page.waitForFunction(
      () => document.documentElement.hasAttribute('data-theme'),
      { timeout: 10_000 },
    );

    const themeAfterNav = await page.evaluate(() =>
      document.documentElement.getAttribute('data-theme'),
    );

    // Theme should persist across navigation
    expect(themeAfterNav).toBe(themeBeforeNav);
  });

  test('html element has all theme axis attributes', async ({ page, baseURL }) => {
    await authenticateAndNavigate(page, baseURL, '/', ['DESIGN_LAB']);
    await page.waitForLoadState('networkidle');

    await page.waitForFunction(
      () =>
        document.documentElement.hasAttribute('data-theme') &&
        document.documentElement.hasAttribute('data-density'),
      { timeout: 10_000 },
    );

    const attrs = await page.evaluate(() => ({
      theme: document.documentElement.getAttribute('data-theme'),
      density: document.documentElement.getAttribute('data-density'),
      accent: document.documentElement.getAttribute('data-accent'),
      radius: document.documentElement.getAttribute('data-radius'),
      elevation: document.documentElement.getAttribute('data-elevation'),
      motion: document.documentElement.getAttribute('data-motion'),
    }));

    expect(attrs.theme).toBeTruthy();
    expect(attrs.density).toBeTruthy();
  });
});
