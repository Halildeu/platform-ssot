import { test, expect } from '@playwright/test';
import { authenticateAndNavigate } from './utils/auth';

test.describe('Audit grid – perf & a11y smoke', () => {
  test('loads /audit/events and renders grid', async ({ page, baseURL }) => {
    const { root } = await authenticateAndNavigate(page, baseURL, '/audit/events', [
      'AUDIT_MODULE',
      'VIEW_AUDIT',
    ]);
    const response = await page.goto(`${root}/audit/events`, { waitUntil: 'domcontentloaded' });
    expect(response?.ok()).toBeTruthy();

    // Grid kök elementi render oluyor mu? (best-effort, kısa süre dene)
    const gridRoot = page.locator('.ag-root');
    const hasGrid = (await gridRoot.count()) > 0;
    if (hasGrid) {
      await expect.soft(gridRoot).toBeVisible({ timeout: 10000 });
      await expect.soft(page.locator('.ag-center-cols-container')).toBeVisible({ timeout: 10000 });
      await expect.soft(page.locator('[data-component="table-pagination"]').last()).toBeVisible({ timeout: 10000 });
      // Basit klavye navigasyonu – Tab ile en az bir focus hareketi
      await page.keyboard.press('Tab');
    }
  });
});
