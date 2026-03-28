import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

/* ---------------------------------------------------------------------------
 * Wave 2.3 — Accessibility E2E
 *
 * Validates keyboard navigation, ARIA attributes, screen-reader
 * announcements, and axe-core audit for the data grid.
 *
 * Dependency: @axe-core/playwright (devDependency)
 * -----------------------------------------------------------------------*/

async function seedRows(page: Page, count = 100) {
  await page.evaluate((n) => {
    const rows = Array.from({ length: n }, (_, i) => ({
      id: i,
      name: `Row ${i}`,
      value: i * 10,
      status: (['active', 'inactive', 'pending'] as const)[i % 3],
    }));
    (window as any).__TEST_GRID__.setRowData(rows);
  }, count);
  await page.waitForSelector('.ag-body-viewport .ag-row', { timeout: 5000 });
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

test.describe('Data Grid Accessibility', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/test/grid');
    await page.waitForSelector('[data-testid="data-grid"]', { timeout: 10_000 });
    await seedRows(page);
  });

  test('grid container has correct ARIA role', async ({ page }) => {
    // AG Grid should render with role="treegrid" or role="grid"
    const gridRole = await page.evaluate(() => {
      const grid = document.querySelector('.ag-root');
      return grid?.getAttribute('role');
    });

    expect(['grid', 'treegrid']).toContain(gridRole);
  });

  test('navigates cells with arrow keys', async ({ page }) => {
    // Focus the first cell
    const firstCell = page.locator('.ag-body-viewport .ag-row[row-index="0"] .ag-cell').first();
    await firstCell.click();
    await page.waitForTimeout(100);

    // Press ArrowRight to move to next cell
    await page.keyboard.press('ArrowRight');
    await page.waitForTimeout(100);

    const focusedColId = await page.evaluate(() => {
      const focused = document.activeElement;
      return focused?.getAttribute('col-id') ?? '';
    });

    // Should have moved from first column to second
    expect(focusedColId).not.toBe('');

    // Press ArrowDown to move to next row
    await page.keyboard.press('ArrowDown');
    await page.waitForTimeout(100);

    const focusedRowIndex = await page.evaluate(() => {
      const focused = document.activeElement;
      const row = focused?.closest('.ag-row');
      return row?.getAttribute('row-index') ?? '';
    });

    expect(focusedRowIndex).toBe('1');
  });

  test('navigates to header with ArrowUp from first row', async ({ page }) => {
    // Focus a cell in the first data row
    const firstCell = page.locator('.ag-body-viewport .ag-row[row-index="0"] .ag-cell').first();
    await firstCell.click();
    await page.waitForTimeout(100);

    // ArrowUp from first data row should move focus to header
    await page.keyboard.press('ArrowUp');
    await page.waitForTimeout(100);

    const isHeaderFocused = await page.evaluate(() => {
      const focused = document.activeElement;
      return focused?.closest('.ag-header-cell') !== null;
    });

    expect(isHeaderFocused).toBe(true);
  });

  test('Tab key moves focus out of grid', async ({ page }) => {
    // Focus a cell
    const firstCell = page.locator('.ag-body-viewport .ag-row[row-index="0"] .ag-cell').first();
    await firstCell.click();
    await page.waitForTimeout(100);

    // Tab should move focus to the next focusable element outside the grid
    await page.keyboard.press('Tab');
    await page.waitForTimeout(100);

    const isCellFocused = await page.evaluate(() => {
      const focused = document.activeElement;
      return focused?.closest('.ag-cell') !== null;
    });

    expect(isCellFocused).toBe(false);
  });

  test('passes axe-core audit', async ({ page }) => {
    const results = await new AxeBuilder({ page })
      .include('[data-testid="data-grid"]')
      // Disable rules that AG Grid cannot fully satisfy out of the box
      .disableRules([
        'scrollable-region-focusable', // AG Grid manages focus internally
      ])
      .analyze();

    // No critical or serious violations
    const serious = results.violations.filter(
      (v) => v.impact === 'critical' || v.impact === 'serious',
    );

    if (serious.length > 0) {
      const summary = serious
        .map((v) => `[${v.impact}] ${v.id}: ${v.description} (${v.nodes.length} nodes)`)
        .join('\n');
      throw new Error(`Accessibility violations:\n${summary}`);
    }

    expect(serious).toHaveLength(0);
  });

  test('announces sort changes to screen reader', async ({ page }) => {
    // AG Grid uses an aria-live region for announcements
    const liveRegion = page.locator('[aria-live="polite"]').first();

    // Click column header to sort
    const nameHeader = page.locator('.ag-header-cell[col-id="name"]');
    await nameHeader.click();
    await page.waitForTimeout(500);

    // Check that the live region received sort announcement
    const announcement = await liveRegion.textContent();
    expect(announcement?.toLowerCase()).toMatch(/sort|ascending|descending|order/);
  });

  test('column headers have aria-sort attribute', async ({ page }) => {
    // Before sort — no aria-sort
    const beforeSort = await page.evaluate(() => {
      const header = document.querySelector('.ag-header-cell[col-id="name"]');
      return header?.getAttribute('aria-sort');
    });
    expect(beforeSort).toBeNull();

    // Apply sort
    await page.evaluate(() => {
      (window as any).__TEST_GRID__.api.applyColumnState({
        state: [{ colId: 'name', sort: 'asc' }],
      });
    });
    await page.waitForTimeout(300);

    const afterSort = await page.evaluate(() => {
      const header = document.querySelector('.ag-header-cell[col-id="name"]');
      return header?.getAttribute('aria-sort');
    });
    expect(afterSort).toBe('ascending');
  });

  test('row selection is announced via aria-selected', async ({ page }) => {
    // Click first row to select it
    const firstRow = page.locator('.ag-body-viewport .ag-row[row-index="0"]');
    await firstRow.click();
    await page.waitForTimeout(200);

    const ariaSelected = await firstRow.getAttribute('aria-selected');
    expect(ariaSelected).toBe('true');
  });
});
