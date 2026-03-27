import { test, expect } from '@playwright/test';

/* ------------------------------------------------------------------ */
/*  Visual Regression — Primitives                                     */
/*                                                                     */
/*  Captures baseline screenshots of primitive components via          */
/*  Storybook. Each test navigates to the story iframe and takes a     */
/*  full-page screenshot that is committed as the golden baseline.     */
/* ------------------------------------------------------------------ */

const STORYBOOK_BASE = 'http://localhost:6006';

/** Navigate to a Storybook story by its ID and wait for render */
async function openStory(page: import('@playwright/test').Page, storyId: string) {
  await page.goto(`${STORYBOOK_BASE}/iframe.html?id=${storyId}&viewMode=story`, {
    waitUntil: 'networkidle',
  });
  // Wait for any animations to settle
  await page.waitForTimeout(500);
}

/* ---- Button ---- */

test.describe('Button', () => {
  test('default variants', async ({ page }) => {
    await openStory(page, 'primitives-button--default');
    await expect(page).toHaveScreenshot('button-default.png');
  });

  test('all sizes', async ({ page }) => {
    await openStory(page, 'primitives-button--sizes');
    await expect(page).toHaveScreenshot('button-sizes.png');
  });

  test('disabled state', async ({ page }) => {
    await openStory(page, 'primitives-button--disabled');
    await expect(page).toHaveScreenshot('button-disabled.png');
  });
});

/* ---- Input ---- */

test.describe('Input', () => {
  test('default', async ({ page }) => {
    await openStory(page, 'primitives-input--default');
    await expect(page).toHaveScreenshot('input-default.png');
  });

  test('with error', async ({ page }) => {
    await openStory(page, 'primitives-input--with-error');
    await expect(page).toHaveScreenshot('input-error.png');
  });
});

/* ---- Checkbox ---- */

test.describe('Checkbox', () => {
  test('default', async ({ page }) => {
    await openStory(page, 'primitives-checkbox--default');
    await expect(page).toHaveScreenshot('checkbox-default.png');
  });
});

/* ---- Radio ---- */

test.describe('Radio', () => {
  test('default', async ({ page }) => {
    await openStory(page, 'primitives-radio--default');
    await expect(page).toHaveScreenshot('radio-default.png');
  });
});

/* ---- Switch ---- */

test.describe('Switch', () => {
  test('default', async ({ page }) => {
    await openStory(page, 'primitives-switch--default');
    await expect(page).toHaveScreenshot('switch-default.png');
  });
});

/* ---- Select ---- */

test.describe('Select', () => {
  test('default', async ({ page }) => {
    await openStory(page, 'primitives-select--default');
    await expect(page).toHaveScreenshot('select-default.png');
  });
});

/* ---- Alert ---- */

test.describe('Alert', () => {
  test('variants', async ({ page }) => {
    await openStory(page, 'primitives-alert--default');
    await expect(page).toHaveScreenshot('alert-default.png');
  });
});

/* ---- Badge ---- */

test.describe('Badge', () => {
  test('default', async ({ page }) => {
    await openStory(page, 'primitives-badge--default');
    await expect(page).toHaveScreenshot('badge-default.png');
  });
});

/* ---- Card ---- */

test.describe('Card', () => {
  test('default', async ({ page }) => {
    await openStory(page, 'primitives-card--default');
    await expect(page).toHaveScreenshot('card-default.png');
  });
});

/* ---- Skeleton ---- */

test.describe('Skeleton', () => {
  test('default', async ({ page }) => {
    await openStory(page, 'primitives-skeleton--default');
    await expect(page).toHaveScreenshot('skeleton-default.png');
  });
});

/* ---- Spinner ---- */

test.describe('Spinner', () => {
  test('default', async ({ page }) => {
    await openStory(page, 'primitives-spinner--default');
    await expect(page).toHaveScreenshot('spinner-default.png');
  });
});

/* ---- Tooltip ---- */

test.describe('Tooltip', () => {
  test('default', async ({ page }) => {
    await openStory(page, 'primitives-tooltip--default');
    await expect(page).toHaveScreenshot('tooltip-default.png');
  });
});
