import { test, expect } from '@playwright/test';

/* ------------------------------------------------------------------ */
/*  Visual Regression — Patterns                                       */
/*                                                                     */
/*  Captures baseline screenshots of pattern compositions via          */
/*  Storybook.                                                         */
/* ------------------------------------------------------------------ */

const STORYBOOK_BASE = 'http://localhost:6006';

async function openStory(page: import('@playwright/test').Page, storyId: string) {
  await page.goto(`${STORYBOOK_BASE}/iframe.html?id=${storyId}&viewMode=story`, {
    waitUntil: 'networkidle',
  });
  await page.waitForTimeout(500);
}

/* ---- PageHeader ---- */

test.describe('PageHeader', () => {
  test('default', async ({ page }) => {
    await openStory(page, 'patterns-pageheader--default');
    await expect(page).toHaveScreenshot('pageheader-default.png');
  });
});

/* ---- PageLayout ---- */

test.describe('PageLayout', () => {
  test('default', async ({ page }) => {
    await openStory(page, 'patterns-pagelayout--default');
    await expect(page).toHaveScreenshot('pagelayout-default.png');
  });
});

/* ---- FilterBar ---- */

test.describe('FilterBar', () => {
  test('default', async ({ page }) => {
    await openStory(page, 'patterns-filterbar--default');
    await expect(page).toHaveScreenshot('filterbar-default.png');
  });
});

/* ---- SummaryStrip ---- */

test.describe('SummaryStrip', () => {
  test('default', async ({ page }) => {
    await openStory(page, 'patterns-summarystrip--default');
    await expect(page).toHaveScreenshot('summarystrip-default.png');
  });
});

/* ---- MasterDetail ---- */

test.describe('MasterDetail', () => {
  test('default', async ({ page }) => {
    await openStory(page, 'patterns-masterdetail--default');
    await expect(page).toHaveScreenshot('masterdetail-default.png');
  });
});

/* ---- DetailDrawer ---- */

test.describe('DetailDrawer', () => {
  test('default', async ({ page }) => {
    await openStory(page, 'patterns-detaildrawer--default');
    await expect(page).toHaveScreenshot('detaildrawer-default.png');
  });
});

/* ---- DetailSummary ---- */

test.describe('DetailSummary', () => {
  test('default', async ({ page }) => {
    await openStory(page, 'patterns-detailsummary--default');
    await expect(page).toHaveScreenshot('detailsummary-default.png');
  });
});
