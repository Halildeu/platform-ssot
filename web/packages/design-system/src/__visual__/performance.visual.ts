import { test, expect } from '@playwright/test';

/* ------------------------------------------------------------------ */
/*  Visual Regression — Performance Components                         */
/*                                                                     */
/*  Captures baseline screenshots of performance-oriented components   */
/*  via Storybook.                                                     */
/* ------------------------------------------------------------------ */

const STORYBOOK_BASE = 'http://localhost:6006';

async function openStory(page: import('@playwright/test').Page, storyId: string) {
  await page.goto(`${STORYBOOK_BASE}/iframe.html?id=${storyId}&viewMode=story`, {
    waitUntil: 'networkidle',
  });
  await page.waitForTimeout(500);
}

/* ---- LazyComponent ---- */

test.describe('LazyComponent', () => {
  test('default', async ({ page }) => {
    await openStory(page, 'performance-lazy-component--default');
    await expect(page).toHaveScreenshot('lazy-component-default.png');
  });
});

/* ---- VirtualList ---- */

test.describe('VirtualList', () => {
  test('default', async ({ page }) => {
    await openStory(page, 'performance-virtual-list--default');
    await expect(page).toHaveScreenshot('virtual-list-default.png');
  });
});
