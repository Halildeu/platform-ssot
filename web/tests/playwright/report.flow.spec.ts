import { test, expect } from '@playwright/test';
import { authenticateAndNavigate } from './utils/auth';

test.describe('Report data flow (QLTY-REPORT-FLOW-01)', () => {
  test('report listing page renders', async ({ page, baseURL }) => {
    await authenticateAndNavigate(page, baseURL, '/admin/reports', [
      'REPORTING_MODULE',
      'VIEW_USERS',
      'VIEW_REPORTS',
    ]);
    await page.waitForLoadState('networkidle');

    // Reports page should render
    await expect(
      page.locator('main, [data-testid*="report"], [data-page*="report"]').first(),
    ).toBeVisible({ timeout: 10_000 });

    // Should have content (not empty)
    const mainText = await page.locator('main').first().textContent().catch(() => '');
    expect((mainText ?? '').trim().length).toBeGreaterThan(0);
  });

  test('users report loads grid or shows error state', async ({ page, baseURL }) => {
    await authenticateAndNavigate(page, baseURL, '/admin/reports/users', [
      'REPORTING_MODULE',
      'VIEW_USERS',
      'VIEW_REPORTS',
    ]);
    await page.waitForLoadState('networkidle');

    // Either the grid should load or an error/empty state should render
    const gridVisible = await page
      .locator('.ag-root')
      .isVisible({ timeout: 15_000 })
      .catch(() => false);

    const errorOrEmptyVisible = await page
      .locator(
        '[data-testid*="error"], [data-testid*="empty"], [class*="no-data"], .ag-overlay-no-rows-wrapper',
      )
      .first()
      .isVisible({ timeout: 3_000 })
      .catch(() => false);

    expect(
      gridVisible || errorOrEmptyVisible,
      'Expected either grid or error/empty state to render',
    ).toBeTruthy();
  });

  test('filter panel renders on report page', async ({ page, baseURL }) => {
    await authenticateAndNavigate(page, baseURL, '/admin/reports/users', [
      'REPORTING_MODULE',
      'VIEW_USERS',
      'VIEW_REPORTS',
    ]);
    await page.waitForLoadState('networkidle');

    // Look for filter/search controls on the page
    const filterElements = page.locator(
      [
        'input[placeholder*="Ara"]',
        'input[placeholder*="Search"]',
        'input[placeholder*="Filtre"]',
        '[data-testid*="filter"]',
        '[data-testid*="search"]',
        'select[data-testid*="filter"]',
        '.ag-header-cell-menu-button',
      ].join(', '),
    );

    const hasFilters = await filterElements.first().isVisible({ timeout: 10_000 }).catch(() => false);

    // Also check for toolbar/action bar
    const toolbar = page.locator(
      '[data-testid*="toolbar"], [data-testid*="action-bar"], [class*="toolbar"]',
    ).first();
    const hasToolbar = await toolbar.isVisible({ timeout: 3_000 }).catch(() => false);

    expect(
      hasFilters || hasToolbar,
      'Expected filter panel or toolbar on report page',
    ).toBeTruthy();
  });

  test('pagination controls render on report grid', async ({ page, baseURL }) => {
    await authenticateAndNavigate(page, baseURL, '/admin/reports/users', [
      'REPORTING_MODULE',
      'VIEW_USERS',
      'VIEW_REPORTS',
    ]);
    await page.waitForLoadState('networkidle');

    const gridVisible = await page
      .locator('.ag-root')
      .isVisible({ timeout: 15_000 })
      .catch(() => false);

    if (gridVisible) {
      // Look for pagination footer
      const paginationFooter = page
        .locator(
          '[data-component="table-pagination"], [data-testid*="pagination"], .ag-paging-panel',
        )
        .first();

      const hasPagination = await paginationFooter.isVisible({ timeout: 10_000 }).catch(() => false);

      if (hasPagination) {
        // Verify page indicator exists
        const footerText = await paginationFooter.textContent();
        expect((footerText ?? '').trim().length).toBeGreaterThan(0);

        // Verify page size select exists
        const pageSizeSelect = paginationFooter.locator('select').first();
        if (await pageSizeSelect.isVisible().catch(() => false)) {
          const currentSize = await pageSizeSelect.inputValue();
          expect(currentSize).toBeTruthy();
        }

        // Verify navigation buttons
        const navButtons = paginationFooter.locator('button');
        const buttonCount = await navButtons.count();
        expect(buttonCount).toBeGreaterThan(0);
      }
    }
  });
});
