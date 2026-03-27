import { test, expect } from '@playwright/test';

/* ------------------------------------------------------------------ */
/*  Visual Regression — Providers                                      */
/*                                                                     */
/*  Captures baseline screenshots verifying provider-wrapped            */
/*  rendering via Storybook.                                           */
/* ------------------------------------------------------------------ */

const STORYBOOK_BASE = 'http://localhost:6006';

async function openStory(page: import('@playwright/test').Page, storyId: string) {
  await page.goto(`${STORYBOOK_BASE}/iframe.html?id=${storyId}&viewMode=story`, {
    waitUntil: 'networkidle',
  });
  await page.waitForTimeout(500);
}

/* ---- DesignSystemProvider ---- */

test.describe('DesignSystemProvider', () => {
  test('default', async ({ page }) => {
    await openStory(page, 'providers-design-system-provider--default');
    await expect(page).toHaveScreenshot('design-system-provider-default.png');
  });
});

/* ---- DirectionProvider ---- */

test.describe('DirectionProvider', () => {
  test('default', async ({ page }) => {
    await openStory(page, 'providers-direction-provider--default');
    await expect(page).toHaveScreenshot('direction-provider-default.png');
  });
});

/* ---- LocaleProvider ---- */

test.describe('LocaleProvider', () => {
  test('default', async ({ page }) => {
    await openStory(page, 'providers-locale-provider--default');
    await expect(page).toHaveScreenshot('locale-provider-default.png');
  });
});

/* ---- ThemeProvider ---- */

test.describe('ThemeProvider', () => {
  test('default', async ({ page }) => {
    await openStory(page, 'providers-theme-provider--default');
    await expect(page).toHaveScreenshot('theme-provider-default.png');
  });
});
