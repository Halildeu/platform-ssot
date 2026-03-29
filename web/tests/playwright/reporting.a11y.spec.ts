import { test, expect } from '@playwright/test';
import { authenticateAndNavigate } from './utils/auth';

test.describe('Reporting shell guard & deep-link', () => {
  test('redirects to login when token missing', async ({ page, baseURL }) => {
    await page.goto(`${baseURL}/admin/reports/users`, { waitUntil: 'domcontentloaded' });
    await expect(page.getByText('Giriş Yap').first()).toBeVisible({ timeout: 15000 });
  });

  test('loads reports when VIEW_REPORTS permission granted', async ({ page, baseURL }) => {
    await authenticateAndNavigate(page, baseURL, '/admin/reports/users', ['VIEW_REPORTS']);
    await page.waitForURL('**/admin/reports/**', { timeout: 30000 });

    // Current report toolbar renders the variant selector via the shared grid contract.
    const variantSelect = page.locator('[data-component="variant-selector"] select');
    const reportPage = page.locator('[data-testid="report-page-users"]');
    const gridRoot = page.locator('.ag-root');
    await expect(
      variantSelect.or(reportPage).or(gridRoot).first(),
    ).toBeVisible({ timeout: 30_000 });
  });
});
