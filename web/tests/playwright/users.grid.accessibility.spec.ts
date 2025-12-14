import { test, expect, type Page, type Locator } from '@playwright/test';
import { authenticateAndNavigate } from './utils/auth';

const focusWithTab = async (page: Page, locator: Locator, maxPresses = 40) => {
  for (let press = 0; press < maxPresses; press += 1) {
    const isFocused = await locator.evaluate((element) => element === document.activeElement);
    if (isFocused) {
      return true;
    }
    await page.keyboard.press('Tab');
  }
  return false;
};

test.describe('Users grid keyboard & a11y routes', () => {
  test('quick filter and variant select can be focused via keyboard', async ({ page, baseURL }) => {
    const { root } = await authenticateAndNavigate(page, baseURL, '/admin/users', ['USER_MANAGEMENT_MODULE']);
    const response = await page.goto(`${root}/admin/users`, { waitUntil: 'domcontentloaded' });
    expect(response?.ok()).toBeTruthy();

    const gridScope = page.locator('[data-theme-scope="entity-grid"]').first();
    await expect(gridScope).toBeVisible({ timeout: 30_000 });

    await page.mouse.click(4, 4);

    const quickFilterInput = page.getByLabel(/Filtre|Filter/i);
    const quickFilterFocused = await focusWithTab(page, quickFilterInput);
    expect(quickFilterFocused).toBeTruthy();
    await expect(quickFilterInput).toBeFocused();

    await quickFilterInput.fill('Runtime');

    const variantSelect = page.getByTestId('report-variant-select');
    const variantFocused = await focusWithTab(page, variantSelect);
    expect(variantFocused).toBeTruthy();
    await expect(variantSelect).toBeFocused();

    await variantSelect.press('ArrowDown');
    await variantSelect.press('Enter');

    await expect(gridScope).toHaveAttribute('data-density', 'comfortable');
  });
});
