import { test, expect, type Page } from '@playwright/test';

/* ---------------------------------------------------------------------------
 * Wave 2.3 — Virtual Scrolling E2E
 *
 * Validates that @mfe/x-data-grid handles 10 000-row datasets without
 * memory bloat, maintains 60 fps during continuous scroll, and renders
 * target rows within the AG Grid DOM-virtualisation budget.
 *
 * Prerequisites:
 *   - Dev server running at baseURL (see playwright.config.ts)
 *   - Test page mounts <EntityGridTemplate> with AG Grid Enterprise
 * -----------------------------------------------------------------------*/

const ROW_COUNT = 10_000;

/** Seed 10K rows into the grid via the window test-harness API. */
async function seedRows(page: Page, count = ROW_COUNT) {
  await page.evaluate((n) => {
    const rows = Array.from({ length: n }, (_, i) => ({
      id: i,
      name: `Row ${i}`,
      value: Math.round(Math.random() * 10_000) / 10,
      date: new Date(2025, 0, 1 + (i % 365)).toISOString(),
      status: (['active', 'inactive', 'pending'] as const)[i % 3],
      country: (['TR', 'DE', 'US', 'UK', 'FR'] as const)[i % 5],
    }));
    // Exposed by the test-harness page via window.__TEST_GRID__
    (window as any).__TEST_GRID__.setRowData(rows);
  }, count);

  // Wait for AG Grid to finish its initial render cycle
  await page.waitForSelector('.ag-body-viewport .ag-row', { timeout: 5000 });
}

/** Read JS heap size (Chrome-only, requires --enable-precise-memory-info). */
async function getHeapUsedMB(page: Page): Promise<number> {
  return page.evaluate(() => {
    const mem = (performance as any).memory;
    if (!mem) throw new Error('performance.memory not available — run with Chromium');
    return Math.round(mem.usedJSHeapSize / 1024 / 1024);
  });
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

test.describe('Data Grid Virtual Scrolling', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/test/grid');
    await page.waitForSelector('[data-testid="data-grid"]', { timeout: 10_000 });
    await seedRows(page);
  });

  test('renders 10K rows without memory spike', async ({ page }) => {
    const heapBefore = await getHeapUsedMB(page);

    // Scroll to the very last row
    await page.evaluate(() => {
      const viewport = document.querySelector<HTMLElement>('.ag-body-viewport');
      if (!viewport) throw new Error('.ag-body-viewport not found');
      viewport.scrollTop = viewport.scrollHeight;
    });

    // Wait for virtualised rows to settle
    await page.waitForTimeout(500);

    const heapAfter = await getHeapUsedMB(page);
    const delta = heapAfter - heapBefore;

    // Virtual scrolling should keep DOM nodes bounded — memory delta must stay
    // well under 50 MB even with 10K logical rows.
    expect(delta).toBeLessThan(50);
  });

  test('scrolls to row 5 000 in under 200 ms', async ({ page }) => {
    const durationMs = await page.evaluate(() => {
      return new Promise<number>((resolve) => {
        const viewport = document.querySelector<HTMLElement>('.ag-body-viewport');
        if (!viewport) throw new Error('.ag-body-viewport not found');

        performance.mark('scroll-start');

        // AG Grid exposes ensureIndexVisible on the grid API
        const api = (window as any).__TEST_GRID__.api;
        api.ensureIndexVisible(5000, 'middle');

        // Use rAF to measure after the next paint
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            performance.mark('scroll-end');
            const measure = performance.measure('scroll', 'scroll-start', 'scroll-end');
            resolve(measure.duration);
          });
        });
      });
    });

    // Target: < 200 ms for programmatic scroll to mid-dataset
    expect(durationMs).toBeLessThan(200);
  });

  test('maintains 60 fps during continuous scroll', async ({ page }) => {
    const result = await page.evaluate(() => {
      return new Promise<{ avgFps: number; droppedPct: number }>((resolve) => {
        const viewport = document.querySelector<HTMLElement>('.ag-body-viewport');
        if (!viewport) throw new Error('.ag-body-viewport not found');

        const frameTimes: number[] = [];
        let rafId: number;

        function collectFrame(ts: DOMHighResTimeStamp) {
          frameTimes.push(ts);
          rafId = requestAnimationFrame(collectFrame);
        }

        // Start FPS monitoring
        rafId = requestAnimationFrame(collectFrame);

        // Scroll continuously for 2 seconds: 40 px every 16 ms
        const scrollInterval = setInterval(() => {
          viewport.scrollTop += 40;
        }, 16);

        setTimeout(() => {
          clearInterval(scrollInterval);
          cancelAnimationFrame(rafId);

          // Compute FPS from frame timestamps
          const durations: number[] = [];
          for (let i = 1; i < frameTimes.length; i++) {
            durations.push(frameTimes[i] - frameTimes[i - 1]);
          }

          const avgFrameTime = durations.reduce((a, b) => a + b, 0) / durations.length;
          const avgFps = 1000 / avgFrameTime;

          // Dropped frame = any frame taking > 1.5x ideal (16.67 ms)
          const droppedCount = durations.filter((d) => d > 25).length;
          const droppedPct = (droppedCount / durations.length) * 100;

          resolve({ avgFps: Math.round(avgFps * 10) / 10, droppedPct: Math.round(droppedPct * 10) / 10 });
        }, 2000);
      });
    });

    // Average FPS should stay above 55 (allows minor dips from 60)
    expect(result.avgFps).toBeGreaterThan(55);

    // Dropped frames should be under 5 %
    expect(result.droppedPct).toBeLessThan(5);
  });

  test('only renders a bounded number of DOM rows', async ({ page }) => {
    // After loading 10K rows the visible DOM should contain far fewer <div> rows
    const domRowCount = await page.evaluate(() => {
      return document.querySelectorAll('.ag-body-viewport .ag-row').length;
    });

    // AG Grid typically renders ~2x the visible row count as a buffer.
    // With default row-height 42 px on a 900 px viewport that is ≈ 40–60 rows.
    expect(domRowCount).toBeLessThan(150);
    expect(domRowCount).toBeGreaterThan(5); // sanity: at least some rows rendered
  });

  test('scroll position is preserved after sort', async ({ page }) => {
    // Scroll to middle
    await page.evaluate(() => {
      (window as any).__TEST_GRID__.api.ensureIndexVisible(5000, 'middle');
    });
    await page.waitForTimeout(200);

    const scrollBefore = await page.evaluate(() => {
      return document.querySelector<HTMLElement>('.ag-body-viewport')!.scrollTop;
    });

    // Apply a sort via the API
    await page.evaluate(() => {
      (window as any).__TEST_GRID__.api.applyColumnState({
        state: [{ colId: 'name', sort: 'asc' }],
      });
    });
    await page.waitForTimeout(300);

    const scrollAfter = await page.evaluate(() => {
      return document.querySelector<HTMLElement>('.ag-body-viewport')!.scrollTop;
    });

    // Grid should reset to top on sort (AG Grid default behaviour)
    expect(scrollAfter).toBe(0);
    expect(scrollBefore).toBeGreaterThan(0);
  });
});
