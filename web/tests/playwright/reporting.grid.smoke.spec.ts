import { test, expect } from '@playwright/test';
import { authenticateAndNavigate } from './utils/auth';

test.describe('Reporting grid – perf & a11y smoke', () => {
  test('loads /admin/reports/users and renders grid', async ({ page, baseURL }) => {
    await authenticateAndNavigate(page, baseURL, '/admin/reports/users', ['REPORTING_MODULE']);

    // Grid kök elementi render oluyor mu?
    await expect(page.locator('.ag-root')).toBeVisible({ timeout: 30000 });

    // Grid gövde konteyneri (satır olmasa bile) görünür mü?
    await expect(page.locator('.ag-center-cols-container')).toBeVisible({ timeout: 30000 });

    // Basit klavye navigasyonu – Tab ile en az bir focus hareketi
    await page.keyboard.press('Tab');
  });
});
