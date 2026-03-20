import { test, expect } from '@playwright/test';

/* ------------------------------------------------------------------ */
/*  Visual Regression — Components                                     */
/*                                                                     */
/*  Captures baseline screenshots of composed components via Storybook */
/* ------------------------------------------------------------------ */

const STORYBOOK_BASE = 'http://localhost:6006';

async function openStory(page: import('@playwright/test').Page, storyId: string) {
  await page.goto(`${STORYBOOK_BASE}/iframe.html?id=${storyId}&viewMode=story`, {
    waitUntil: 'networkidle',
  });
  await page.waitForTimeout(500);
}

/* ---- Tabs ---- */

test.describe('Tabs', () => {
  test('default', async ({ page }) => {
    await openStory(page, 'components-tabs--default');
    await expect(page).toHaveScreenshot('tabs-default.png');
  });
});

/* ---- Accordion ---- */

test.describe('Accordion', () => {
  test('default', async ({ page }) => {
    await openStory(page, 'components-accordion--default');
    await expect(page).toHaveScreenshot('accordion-default.png');
  });
});

/* ---- DatePicker ---- */

test.describe('DatePicker', () => {
  test('default', async ({ page }) => {
    await openStory(page, 'components-datepicker--default');
    await expect(page).toHaveScreenshot('datepicker-default.png');
  });
});

/* ---- Steps ---- */

test.describe('Steps', () => {
  test('default', async ({ page }) => {
    await openStory(page, 'components-steps--default');
    await expect(page).toHaveScreenshot('steps-default.png');
  });
});

/* ---- Upload ---- */

test.describe('Upload', () => {
  test('default', async ({ page }) => {
    await openStory(page, 'components-upload--default');
    await expect(page).toHaveScreenshot('upload-default.png');
  });
});

/* ---- Timeline ---- */

test.describe('Timeline', () => {
  test('default', async ({ page }) => {
    await openStory(page, 'components-timeline--default');
    await expect(page).toHaveScreenshot('timeline-default.png');
  });
});

/* ---- Tree ---- */

test.describe('Tree', () => {
  test('default', async ({ page }) => {
    await openStory(page, 'components-tree--default');
    await expect(page).toHaveScreenshot('tree-default.png');
  });
});

/* ---- ColorPicker ---- */

test.describe('ColorPicker', () => {
  test('default', async ({ page }) => {
    await openStory(page, 'components-colorpicker--default');
    await expect(page).toHaveScreenshot('colorpicker-default.png');
  });
});

/* ---- Calendar ---- */

test.describe('Calendar', () => {
  test('default', async ({ page }) => {
    await openStory(page, 'components-calendar--default');
    await expect(page).toHaveScreenshot('calendar-default.png');
  });
});

/* ---- CommandPalette ---- */

test.describe('CommandPalette', () => {
  test('default', async ({ page }) => {
    await openStory(page, 'components-commandpalette--default');
    await expect(page).toHaveScreenshot('commandpalette-default.png');
  });
});
