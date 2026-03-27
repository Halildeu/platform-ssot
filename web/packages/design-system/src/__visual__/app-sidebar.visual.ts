import { test, expect } from '@playwright/test';

/* ------------------------------------------------------------------ */
/*  Visual Regression — AppSidebar Components                          */
/*                                                                     */
/*  Captures baseline screenshots of AppSidebar sub-components via     */
/*  Storybook.                                                         */
/* ------------------------------------------------------------------ */

const STORYBOOK_BASE = 'http://localhost:6006';

async function openStory(page: import('@playwright/test').Page, storyId: string) {
  await page.goto(`${STORYBOOK_BASE}/iframe.html?id=${storyId}&viewMode=story`, {
    waitUntil: 'networkidle',
  });
  await page.waitForTimeout(500);
}

/* ---- AppSidebarFooter ---- */

test.describe('AppSidebarFooter', () => {
  test('default', async ({ page }) => {
    await openStory(page, 'components-app-sidebar-footer--default');
    await expect(page).toHaveScreenshot('app-sidebar-footer-default.png');
  });
});

/* ---- AppSidebarGroup ---- */

test.describe('AppSidebarGroup', () => {
  test('default', async ({ page }) => {
    await openStory(page, 'components-app-sidebar-group--default');
    await expect(page).toHaveScreenshot('app-sidebar-group-default.png');
  });
});

/* ---- AppSidebarHeader ---- */

test.describe('AppSidebarHeader', () => {
  test('default', async ({ page }) => {
    await openStory(page, 'components-app-sidebar-header--default');
    await expect(page).toHaveScreenshot('app-sidebar-header-default.png');
  });
});

/* ---- AppSidebarNavItem ---- */

test.describe('AppSidebarNavItem', () => {
  test('default', async ({ page }) => {
    await openStory(page, 'components-app-sidebar-nav-item--default');
    await expect(page).toHaveScreenshot('app-sidebar-nav-item-default.png');
  });
});

/* ---- AppSidebarResizer ---- */

test.describe('AppSidebarResizer', () => {
  test('default', async ({ page }) => {
    await openStory(page, 'components-app-sidebar-resizer--default');
    await expect(page).toHaveScreenshot('app-sidebar-resizer-default.png');
  });
});

/* ---- AppSidebarSearch ---- */

test.describe('AppSidebarSearch', () => {
  test('default', async ({ page }) => {
    await openStory(page, 'components-app-sidebar-search--default');
    await expect(page).toHaveScreenshot('app-sidebar-search-default.png');
  });
});

/* ---- AppSidebarSection ---- */

test.describe('AppSidebarSection', () => {
  test('default', async ({ page }) => {
    await openStory(page, 'components-app-sidebar-section--default');
    await expect(page).toHaveScreenshot('app-sidebar-section-default.png');
  });
});

/* ---- AppSidebarSeparator ---- */

test.describe('AppSidebarSeparator', () => {
  test('default', async ({ page }) => {
    await openStory(page, 'components-app-sidebar-separator--default');
    await expect(page).toHaveScreenshot('app-sidebar-separator-default.png');
  });
});

/* ---- AppSidebarTrigger ---- */

test.describe('AppSidebarTrigger', () => {
  test('default', async ({ page }) => {
    await openStory(page, 'components-app-sidebar-trigger--default');
    await expect(page).toHaveScreenshot('app-sidebar-trigger-default.png');
  });
});
