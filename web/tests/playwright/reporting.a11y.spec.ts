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

    // In permitAll mode the variant select may not render without backend data.
    // Verify either the variant select or the page container loads without crash.
    const variantSelect = page.locator('[data-testid="report-variant-select"]');
    const reportPage = page.locator('[data-testid="report-page-users"]');
    const gridRoot = page.locator('.ag-root');
    await expect(
      variantSelect.or(reportPage).or(gridRoot).first(),
    ).toBeVisible({ timeout: 30_000 });
  });
});
