import { test, expect, type Page } from '@playwright/test';

/* ---------------------------------------------------------------------------
 * Wave 2.3 — Sort & Filter E2E
 *
 * Validates that sorting and filtering work correctly across 10K rows,
 * including column-header click sorting, quick-filter text, column-level
 * filters, and filter clearing.
 * -----------------------------------------------------------------------*/

const ROW_COUNT = 10_000;

async function seedRows(page: Page, count = ROW_COUNT) {
  await page.evaluate((n) => {
    const rows = Array.from({ length: n }, (_, i) => ({
      id: i,
      name: `Row ${String(i).padStart(5, '0')}`,
      value: Math.round(Math.random() * 10_000) / 10,
      date: new Date(2025, 0, 1 + (i % 365)).toISOString(),
      status: (['active', 'inactive', 'pending'] as const)[i % 3],
      country: (['TR', 'DE', 'US', 'UK', 'FR'] as const)[i % 5],
    }));
    (window as any).__TEST_GRID__.setRowData(rows);
  }, count);
  await page.waitForSelector('.ag-body-viewport .ag-row', { timeout: 5000 });
}

/** Return the text content of the first visible row's "name" cell. */
async function getFirstRowName(page: Page): Promise<string> {
  return page.evaluate(() => {
    const cell = document.querySelector<HTMLElement>(
      '.ag-body-viewport .ag-row[row-index="0"] [col-id="name"]',
    );
    return cell?.textContent?.trim() ?? '';
  });
}

/** Return the displayed row count from AG Grid's API. */
async function getDisplayedRowCount(page: Page): Promise<number> {
  return page.evaluate(() => {
    return (window as any).__TEST_GRID__.api.getDisplayedRowCount();
  });
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

test.describe('Data Grid Sort & Filter', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/test/grid');
    await page.waitForSelector('[data-testid="data-grid"]', { timeout: 10_000 });
    await seedRows(page);
  });

  // -- Sorting --

  test('sorts 10K rows ascending by column header click', async ({ page }) => {
    // Click the "name" column header to trigger ascending sort
    const nameHeader = page.locator('.ag-header-cell[col-id="name"]');
    await nameHeader.click();
    await page.waitForTimeout(300);

    const firstName = await getFirstRowName(page);
    // Padded names: "Row 00000" should be first when sorted ascending
    expect(firstName).toBe('Row 00000');

    // Verify sort icon is visible
    const sortIcon = nameHeader.locator('.ag-sort-ascending-icon');
    await expect(sortIcon).toBeVisible();
  });

  test('sorts descending on second header click', async ({ page }) => {
    const nameHeader = page.locator('.ag-header-cell[col-id="name"]');

    // First click = ascending
    await nameHeader.click();
    await page.waitForTimeout(200);

    // Second click = descending
    await nameHeader.click();
    await page.waitForTimeout(300);

    const firstName = await getFirstRowName(page);
    expect(firstName).toBe('Row 09999');
  });

  test('multi-column sort with shift+click', async ({ page }) => {
    // Sort by status first
    const statusHeader = page.locator('.ag-header-cell[col-id="status"]');
    await statusHeader.click();
    await page.waitForTimeout(200);

    // Shift-click name header for secondary sort
    const nameHeader = page.locator('.ag-header-cell[col-id="name"]');
    await nameHeader.click({ modifiers: ['Shift'] });
    await page.waitForTimeout(300);

    // Verify both sort indicators are visible
    await expect(statusHeader.locator('.ag-sort-ascending-icon')).toBeVisible();
    await expect(nameHeader.locator('.ag-sort-ascending-icon')).toBeVisible();
  });

  test('sort completes in under 300 ms for 10K rows', async ({ page }) => {
    const durationMs = await page.evaluate(() => {
      const api = (window as any).__TEST_GRID__.api;
      const start = performance.now();
      api.applyColumnState({ state: [{ colId: 'name', sort: 'asc' }] });
      const end = performance.now();
      return end - start;
    });

    expect(durationMs).toBeLessThan(300);
  });

  // -- Filtering --

  test('filters with quick filter text', async ({ page }) => {
    const beforeCount = await getDisplayedRowCount(page);
    expect(beforeCount).toBe(ROW_COUNT);

    // Apply quick filter via API (mirrors GridToolbar search input)
    await page.evaluate(() => {
      (window as any).__TEST_GRID__.api.setGridOption('quickFilterText', 'Row 00001');
    });
    await page.waitForTimeout(300);

    const afterCount = await getDisplayedRowCount(page);
    // "Row 00001" matches Row 00001 only (exact padded match)
    expect(afterCount).toBeGreaterThanOrEqual(1);
    expect(afterCount).toBeLessThan(20); // narrow result set
  });

  test('applies column filter for status = active', async ({ page }) => {
    await page.evaluate(() => {
      (window as any).__TEST_GRID__.api.setFilterModel({
        status: {
          type: 'set',
          values: ['active'],
        },
      });
      (window as any).__TEST_GRID__.api.onFilterChanged();
    });
    await page.waitForTimeout(300);

    const filteredCount = await getDisplayedRowCount(page);
    // With 10K rows and 3 statuses, ~3333 should be "active"
    expect(filteredCount).toBeGreaterThan(3000);
    expect(filteredCount).toBeLessThan(3700);
  });

  test('applies combined column filters', async ({ page }) => {
    await page.evaluate(() => {
      const api = (window as any).__TEST_GRID__.api;
      api.setFilterModel({
        status: { type: 'set', values: ['active'] },
        country: { type: 'set', values: ['TR'] },
      });
      api.onFilterChanged();
    });
    await page.waitForTimeout(300);

    const filteredCount = await getDisplayedRowCount(page);
    // ~10000 / 3 statuses / 5 countries ≈ 667
    expect(filteredCount).toBeGreaterThan(500);
    expect(filteredCount).toBeLessThan(900);
  });

  test('clears all filters and restores full dataset', async ({ page }) => {
    // Apply a filter first
    await page.evaluate(() => {
      const api = (window as any).__TEST_GRID__.api;
      api.setFilterModel({
        status: { type: 'set', values: ['pending'] },
      });
      api.onFilterChanged();
    });
    await page.waitForTimeout(200);

    const filteredCount = await getDisplayedRowCount(page);
    expect(filteredCount).toBeLessThan(ROW_COUNT);

    // Clear all filters
    await page.evaluate(() => {
      const api = (window as any).__TEST_GRID__.api;
      api.setFilterModel(null);
      api.onFilterChanged();
    });
    await page.waitForTimeout(200);

    const restoredCount = await getDisplayedRowCount(page);
    expect(restoredCount).toBe(ROW_COUNT);
  });

  test('filter chips reflect active filters', async ({ page }) => {
    await page.evaluate(() => {
      const api = (window as any).__TEST_GRID__.api;
      api.setFilterModel({
        status: { type: 'set', values: ['active'] },
      });
      api.onFilterChanged();
    });
    await page.waitForTimeout(300);

    // DataGridFilterChips should render a chip for the active filter
    const chip = page.locator('[data-testid="filter-chip-status"]');
    await expect(chip).toBeVisible();
    await expect(chip).toContainText('active');
  });
});
