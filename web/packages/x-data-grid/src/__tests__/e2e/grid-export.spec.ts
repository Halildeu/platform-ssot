import { test, expect, type Page } from '@playwright/test';
import * as fs from 'node:fs';
import * as path from 'node:path';

/* ---------------------------------------------------------------------------
 * Wave 2.3 — Export E2E
 *
 * Validates CSV and Excel export from the data grid, both for filtered
 * (visible) rows and full dataset export.
 * -----------------------------------------------------------------------*/

const ROW_COUNT = 500; // Smaller dataset for export tests — file I/O focused

async function seedRows(page: Page, count = ROW_COUNT) {
  await page.evaluate((n) => {
    const rows = Array.from({ length: n }, (_, i) => ({
      id: i,
      name: `Row ${String(i).padStart(4, '0')}`,
      value: Math.round(Math.random() * 10_000) / 10,
      status: (['active', 'inactive', 'pending'] as const)[i % 3],
    }));
    (window as any).__TEST_GRID__.setRowData(rows);
  }, count);
  await page.waitForSelector('.ag-body-viewport .ag-row', { timeout: 5000 });
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

test.describe('Data Grid Export', () => {
  let downloadDir: string;

  test.beforeEach(async ({ page }) => {
    downloadDir = test.info().outputDir;
    await page.goto('/test/grid');
    await page.waitForSelector('[data-testid="data-grid"]', { timeout: 10_000 });
    await seedRows(page);
  });

  test('exports visible rows to CSV', async ({ page }) => {
    // Apply a filter so we export a subset
    await page.evaluate(() => {
      const api = (window as any).__TEST_GRID__.api;
      api.setFilterModel({ status: { type: 'set', values: ['active'] } });
      api.onFilterChanged();
    });
    await page.waitForTimeout(200);

    // Trigger CSV export via the grid API (mirrors useGridExport hook)
    const [download] = await Promise.all([
      page.waitForEvent('download'),
      page.evaluate(() => {
        (window as any).__TEST_GRID__.api.exportDataAsCsv({
          fileName: 'test-export.csv',
          onlySelected: false,
        });
      }),
    ]);

    const filePath = path.join(downloadDir, 'test-export.csv');
    await download.saveAs(filePath);

    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.trim().split('\n');

    // Header + filtered rows (~167 active out of 500)
    expect(lines.length).toBeGreaterThan(100);
    expect(lines.length).toBeLessThan(250);

    // Header row should contain column names
    expect(lines[0]).toContain('name');
    expect(lines[0]).toContain('status');

    // Every data line should only contain "active" status
    for (const line of lines.slice(1)) {
      expect(line).toContain('active');
    }
  });

  test('exports all rows to CSV (unfiltered)', async ({ page }) => {
    const [download] = await Promise.all([
      page.waitForEvent('download'),
      page.evaluate(() => {
        (window as any).__TEST_GRID__.api.exportDataAsCsv({
          fileName: 'full-export.csv',
        });
      }),
    ]);

    const filePath = path.join(downloadDir, 'full-export.csv');
    await download.saveAs(filePath);

    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.trim().split('\n');

    // Header + 500 data rows
    expect(lines.length).toBe(ROW_COUNT + 1);
  });

  test('exports all rows to Excel', async ({ page }) => {
    // Excel export requires AG Grid Enterprise
    const [download] = await Promise.all([
      page.waitForEvent('download'),
      page.evaluate(() => {
        (window as any).__TEST_GRID__.api.exportDataAsExcel({
          fileName: 'test-export.xlsx',
          sheetName: 'Grid Data',
        });
      }),
    ]);

    const filePath = path.join(downloadDir, 'test-export.xlsx');
    await download.saveAs(filePath);

    // Verify file exists and has non-trivial size (XLSX is binary)
    const stats = fs.statSync(filePath);
    expect(stats.size).toBeGreaterThan(1024); // > 1 KB
  });

  test('exported CSV preserves column order', async ({ page }) => {
    const [download] = await Promise.all([
      page.waitForEvent('download'),
      page.evaluate(() => {
        (window as any).__TEST_GRID__.api.exportDataAsCsv({
          fileName: 'column-order.csv',
          columnKeys: ['id', 'name', 'value', 'status'],
        });
      }),
    ]);

    const filePath = path.join(downloadDir, 'column-order.csv');
    await download.saveAs(filePath);

    const content = fs.readFileSync(filePath, 'utf-8');
    const header = content.split('\n')[0];
    const columns = header.split(',').map((c) => c.replace(/"/g, '').trim());

    expect(columns).toEqual(['id', 'name', 'value', 'status']);
  });
});
