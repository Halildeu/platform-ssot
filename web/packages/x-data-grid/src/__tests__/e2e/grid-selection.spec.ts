import { test, expect, type Page } from '@playwright/test';

/* ---------------------------------------------------------------------------
 * Wave 2.3 — Selection E2E
 *
 * Validates single-row click selection, checkbox multi-select, header
 * checkbox select-all, range selection, and the DataGridSelectionBar
 * integration.
 * -----------------------------------------------------------------------*/

async function seedRows(page: Page, count = 200) {
  await page.evaluate((n) => {
    const rows = Array.from({ length: n }, (_, i) => ({
      id: i,
      name: `Row ${String(i).padStart(4, '0')}`,
      value: i * 5,
      status: (['active', 'inactive', 'pending'] as const)[i % 3],
    }));
    (window as any).__TEST_GRID__.setRowData(rows);
  }, count);
  await page.waitForSelector('.ag-body-viewport .ag-row', { timeout: 5000 });
}

/** Return IDs of currently selected rows. */
async function getSelectedIds(page: Page): Promise<number[]> {
  return page.evaluate(() => {
    const api = (window as any).__TEST_GRID__.api;
    const selected = api.getSelectedRows();
    return selected.map((r: any) => r.id);
  });
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

test.describe('Data Grid Selection', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/test/grid');
    await page.waitForSelector('[data-testid="data-grid"]', { timeout: 10_000 });
    await seedRows(page);
  });

  test('selects single row on click', async ({ page }) => {
    const row = page.locator('.ag-body-viewport .ag-row[row-index="2"]');
    await row.click();
    await page.waitForTimeout(200);

    const selected = await getSelectedIds(page);
    expect(selected).toHaveLength(1);
    expect(selected[0]).toBe(2);

    // Row should have visual selection class
    await expect(row).toHaveClass(/ag-row-selected/);
  });

  test('clicking another row deselects previous (single select mode)', async ({ page }) => {
    // Click row 2
    await page.locator('.ag-body-viewport .ag-row[row-index="2"]').click();
    await page.waitForTimeout(100);

    // Click row 5
    await page.locator('.ag-body-viewport .ag-row[row-index="5"]').click();
    await page.waitForTimeout(200);

    const selected = await getSelectedIds(page);
    expect(selected).toHaveLength(1);
    expect(selected[0]).toBe(5);
  });

  test('selects multiple rows with checkbox column', async ({ page }) => {
    // Enable checkbox selection mode via test harness
    await page.evaluate(() => {
      (window as any).__TEST_GRID__.api.setGridOption('rowSelection', {
        mode: 'multiRow',
        checkboxes: true,
      });
    });
    await page.waitForTimeout(200);

    // Click checkboxes on rows 0, 2, 4
    for (const idx of [0, 2, 4]) {
      const checkbox = page.locator(
        `.ag-body-viewport .ag-row[row-index="${idx}"] .ag-selection-checkbox`,
      );
      await checkbox.click();
      await page.waitForTimeout(100);
    }

    const selected = await getSelectedIds(page);
    expect(selected).toHaveLength(3);
    expect(selected).toContain(0);
    expect(selected).toContain(2);
    expect(selected).toContain(4);
  });

  test('select all with header checkbox', async ({ page }) => {
    // Enable checkbox selection
    await page.evaluate(() => {
      (window as any).__TEST_GRID__.api.setGridOption('rowSelection', {
        mode: 'multiRow',
        checkboxes: true,
        headerCheckbox: true,
      });
    });
    await page.waitForTimeout(200);

    // Click the header checkbox
    const headerCheckbox = page.locator('.ag-header-select-all');
    await headerCheckbox.click();
    await page.waitForTimeout(300);

    const selected = await getSelectedIds(page);
    expect(selected).toHaveLength(200);
  });

  test('header checkbox deselects all when all are selected', async ({ page }) => {
    // Enable and select all
    await page.evaluate(() => {
      const api = (window as any).__TEST_GRID__.api;
      api.setGridOption('rowSelection', {
        mode: 'multiRow',
        checkboxes: true,
        headerCheckbox: true,
      });
      api.selectAll();
    });
    await page.waitForTimeout(200);

    let selected = await getSelectedIds(page);
    expect(selected).toHaveLength(200);

    // Click header checkbox again to deselect
    const headerCheckbox = page.locator('.ag-header-select-all');
    await headerCheckbox.click();
    await page.waitForTimeout(200);

    selected = await getSelectedIds(page);
    expect(selected).toHaveLength(0);
  });

  test('Ctrl+click adds to selection in multi-row mode', async ({ page }) => {
    await page.evaluate(() => {
      (window as any).__TEST_GRID__.api.setGridOption('rowSelection', {
        mode: 'multiRow',
      });
    });
    await page.waitForTimeout(200);

    // Click row 1
    await page.locator('.ag-body-viewport .ag-row[row-index="1"]').click();
    await page.waitForTimeout(100);

    // Ctrl+click row 3
    await page
      .locator('.ag-body-viewport .ag-row[row-index="3"]')
      .click({ modifiers: ['ControlOrMeta'] });
    await page.waitForTimeout(200);

    const selected = await getSelectedIds(page);
    expect(selected).toHaveLength(2);
    expect(selected).toContain(1);
    expect(selected).toContain(3);
  });

  test('Shift+click selects range', async ({ page }) => {
    await page.evaluate(() => {
      (window as any).__TEST_GRID__.api.setGridOption('rowSelection', {
        mode: 'multiRow',
      });
    });
    await page.waitForTimeout(200);

    // Click row 2
    await page.locator('.ag-body-viewport .ag-row[row-index="2"]').click();
    await page.waitForTimeout(100);

    // Shift+click row 6
    await page
      .locator('.ag-body-viewport .ag-row[row-index="6"]')
      .click({ modifiers: ['Shift'] });
    await page.waitForTimeout(200);

    const selected = await getSelectedIds(page);
    // Should select rows 2, 3, 4, 5, 6
    expect(selected).toHaveLength(5);
    for (let i = 2; i <= 6; i++) {
      expect(selected).toContain(i);
    }
  });

  test('selection bar shows count and actions', async ({ page }) => {
    // Enable multi-select and select 3 rows
    await page.evaluate(() => {
      const api = (window as any).__TEST_GRID__.api;
      api.setGridOption('rowSelection', { mode: 'multiRow', checkboxes: true });
    });
    await page.waitForTimeout(200);

    for (const idx of [0, 1, 2]) {
      await page
        .locator(`.ag-body-viewport .ag-row[row-index="${idx}"] .ag-selection-checkbox`)
        .click();
      await page.waitForTimeout(100);
    }

    // DataGridSelectionBar should appear with count
    const selectionBar = page.locator('[data-testid="selection-bar"]');
    await expect(selectionBar).toBeVisible();
    await expect(selectionBar).toContainText('3');
  });

  test('selection persists after sort', async ({ page }) => {
    // Select row with id=5
    await page.evaluate(() => {
      const api = (window as any).__TEST_GRID__.api;
      api.setGridOption('rowSelection', { mode: 'multiRow', checkboxes: true });
      const node = api.getRowNode('5');
      node?.setSelected(true);
    });
    await page.waitForTimeout(200);

    // Sort by name descending
    await page.evaluate(() => {
      (window as any).__TEST_GRID__.api.applyColumnState({
        state: [{ colId: 'name', sort: 'desc' }],
      });
    });
    await page.waitForTimeout(300);

    const selected = await getSelectedIds(page);
    expect(selected).toContain(5);
  });
});
