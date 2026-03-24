import { test, expect } from '@playwright/test';

/* ------------------------------------------------------------------ */
/*  Visual Regression — Internal Utilities                             */
/*                                                                     */
/*  Captures baseline screenshots of internal components and hooks     */
/*  via Storybook.                                                     */
/* ------------------------------------------------------------------ */

const STORYBOOK_BASE = 'http://localhost:6006';

async function openStory(page: import('@playwright/test').Page, storyId: string) {
  await page.goto(`${STORYBOOK_BASE}/iframe.html?id=${storyId}&viewMode=story`, {
    waitUntil: 'networkidle',
  });
  await page.waitForTimeout(500);
}

/* ---- MenuSurface ---- */

test.describe('MenuSurface', () => {
  test('default', async ({ page }) => {
    await openStory(page, 'internal-menu-surface--default');
    await expect(page).toHaveScreenshot('menu-surface-default.png');
  });
});

/* ---- OverlaySurface ---- */

test.describe('OverlaySurface', () => {
  test('default', async ({ page }) => {
    await openStory(page, 'internal-overlay-surface--default');
    await expect(page).toHaveScreenshot('overlay-surface-default.png');
  });
});

/* ---- PortalProvider ---- */

test.describe('PortalProvider', () => {
  test('default', async ({ page }) => {
    await openStory(page, 'internal-portal-provider--default');
    await expect(page).toHaveScreenshot('portal-provider-default.png');
  });
});

/* ---- aria-live ---- */

test.describe('aria-live', () => {
  test('default', async ({ page }) => {
    await openStory(page, 'internal-aria-live--default');
    await expect(page).toHaveScreenshot('aria-live-default.png');
  });
});

/* ---- focus-trap ---- */

test.describe('focus-trap', () => {
  test('default', async ({ page }) => {
    await openStory(page, 'internal-focus-trap--default');
    await expect(page).toHaveScreenshot('focus-trap-default.png');
  });
});

/* ---- portal ---- */

test.describe('portal', () => {
  test('default', async ({ page }) => {
    await openStory(page, 'internal-portal--default');
    await expect(page).toHaveScreenshot('portal-default.png');
  });
});

/* ---- roving-tabindex ---- */

test.describe('roving-tabindex', () => {
  test('default', async ({ page }) => {
    await openStory(page, 'internal-roving-tabindex--default');
    await expect(page).toHaveScreenshot('roving-tabindex-default.png');
  });
});

/* ---- usePortal ---- */

test.describe('usePortal', () => {
  test('default', async ({ page }) => {
    await openStory(page, 'internal-use-portal--default');
    await expect(page).toHaveScreenshot('use-portal-default.png');
  });
});
