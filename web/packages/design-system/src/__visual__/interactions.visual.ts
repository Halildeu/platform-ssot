import { test, expect } from '@playwright/test';

const STORYBOOK_URL = 'http://localhost:6006';

async function goToStory(page: import('@playwright/test').Page, storyId: string) {
  await page.goto(`${STORYBOOK_URL}/iframe.html?id=${storyId}&viewMode=story`);
  await page.waitForLoadState('networkidle');
}

async function goToStoryDark(page: import('@playwright/test').Page, storyId: string) {
  await page.goto(
    `${STORYBOOK_URL}/iframe.html?id=${storyId}&viewMode=story&globals=theme:dark`,
  );
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(500);
}

// ──────────────────────────────────────────────────────────────────────────────
// Interaction-state visual tests
// These capture hover, focus, disabled, checked, and toggled states.
// ──────────────────────────────────────────────────────────────────────────────

test('Button - hover state', async ({ page }) => {
  await goToStory(page, 'components-primitives-button--default');
  const button = page.locator('button:visible').first();
  await button.hover();
  await expect(page).toHaveScreenshot('button-hover.png');
});

test('Button - focus state', async ({ page }) => {
  await goToStory(page, 'components-primitives-button--default');
  const button = page.locator('button').first();
  await button.focus();
  await expect(page).toHaveScreenshot('button-focus.png');
});

test('Button - disabled state', async ({ page }) => {
  await goToStory(page, 'components-primitives-button--disabled');
  await expect(page).toHaveScreenshot('button-disabled.png');
});

test('Input - focus state', async ({ page }) => {
  await goToStory(page, 'components-primitives-input--default');
  const input = page.locator('input').first();
  await input.focus();
  await expect(page).toHaveScreenshot('input-focus.png');
});

test('Input - error state', async ({ page }) => {
  await goToStory(page, 'components-primitives-input--with-error');
  await expect(page).toHaveScreenshot('input-error.png');
});

test('Input - disabled state', async ({ page }) => {
  await goToStory(page, 'components-primitives-input--disabled');
  await expect(page).toHaveScreenshot('input-disabled.png');
});

test('Select - focused', async ({ page }) => {
  await goToStory(page, 'components-primitives-select--default');
  const select = page.locator('select').first();
  await select.focus();
  await expect(page).toHaveScreenshot('select-focused.png');
});

test('Checkbox - checked', async ({ page }) => {
  await goToStory(page, 'components-primitives-checkbox--default');
  const checkbox = page.locator('input[type="checkbox"]').first();
  await checkbox.check();
  await expect(page).toHaveScreenshot('checkbox-checked.png');
});

test('Switch - toggled', async ({ page }) => {
  await goToStory(page, 'components-primitives-switch--default');
  const switchEl = page.locator('[role="switch"]').first();
  await switchEl.click();
  await expect(page).toHaveScreenshot('switch-toggled.png');
});

test('Radio - selected', async ({ page }) => {
  await goToStory(page, 'components-primitives-radio--default');
  const radio = page.locator('input[type="radio"]').first();
  await radio.check();
  await expect(page).toHaveScreenshot('radio-selected.png');
});

test('Alert - all variants visible', async ({ page }) => {
  await goToStory(page, 'components-primitives-alert--all-variants');
  await expect(page).toHaveScreenshot('alert-all-variants.png');
});

test('Badge - all variants visible', async ({ page }) => {
  await goToStory(page, 'components-primitives-badge--all-variants');
  await expect(page).toHaveScreenshot('badge-all-variants.png');
});

// ──────────────────────────────────────────────────────────────────────────────
// Dark Mode — Interaction-state visual tests
// These capture hover, focus, disabled, checked, and toggled states in dark mode.
// ──────────────────────────────────────────────────────────────────────────────

test('Button - hover state (dark)', async ({ page }) => {
  await goToStoryDark(page, 'components-primitives-button--default');
  const button = page.locator('button:visible').first();
  await button.hover();
  await expect(page).toHaveScreenshot('button-hover-dark.png');
});

test('Button - focus state (dark)', async ({ page }) => {
  await goToStoryDark(page, 'components-primitives-button--default');
  const button = page.locator('button').first();
  await button.focus();
  await expect(page).toHaveScreenshot('button-focus-dark.png');
});

test('Button - disabled state (dark)', async ({ page }) => {
  await goToStoryDark(page, 'components-primitives-button--disabled');
  await expect(page).toHaveScreenshot('button-disabled-dark.png');
});

test('Input - focus state (dark)', async ({ page }) => {
  await goToStoryDark(page, 'components-primitives-input--default');
  const input = page.locator('input').first();
  await input.focus();
  await expect(page).toHaveScreenshot('input-focus-dark.png');
});

test('Input - error state (dark)', async ({ page }) => {
  await goToStoryDark(page, 'components-primitives-input--with-error');
  await expect(page).toHaveScreenshot('input-error-dark.png');
});

test('Input - disabled state (dark)', async ({ page }) => {
  await goToStoryDark(page, 'components-primitives-input--disabled');
  await expect(page).toHaveScreenshot('input-disabled-dark.png');
});

test('Select - focused (dark)', async ({ page }) => {
  await goToStoryDark(page, 'components-primitives-select--default');
  const select = page.locator('select').first();
  await select.focus();
  await expect(page).toHaveScreenshot('select-focused-dark.png');
});

test('Checkbox - checked (dark)', async ({ page }) => {
  await goToStoryDark(page, 'components-primitives-checkbox--default');
  const checkbox = page.locator('input[type="checkbox"]').first();
  await checkbox.check();
  await expect(page).toHaveScreenshot('checkbox-checked-dark.png');
});

test('Switch - toggled (dark)', async ({ page }) => {
  await goToStoryDark(page, 'components-primitives-switch--default');
  const switchEl = page.locator('[role="switch"]').first();
  await switchEl.click();
  await expect(page).toHaveScreenshot('switch-toggled-dark.png');
});

test('Radio - selected (dark)', async ({ page }) => {
  await goToStoryDark(page, 'components-primitives-radio--default');
  const radio = page.locator('input[type="radio"]').first();
  await radio.check();
  await expect(page).toHaveScreenshot('radio-selected-dark.png');
});

test('Alert - all variants visible (dark)', async ({ page }) => {
  await goToStoryDark(page, 'components-primitives-alert--all-variants');
  await expect(page).toHaveScreenshot('alert-all-variants-dark.png');
});

test('Badge - all variants visible (dark)', async ({ page }) => {
  await goToStoryDark(page, 'components-primitives-badge--all-variants');
  await expect(page).toHaveScreenshot('badge-all-variants-dark.png');
});
