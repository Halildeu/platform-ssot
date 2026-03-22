import { test, expect } from '@playwright/test';
import { authenticateAndNavigate } from './utils/auth';

const MAX_LOAD_TIME_MS = 5_000;

test.describe('Performance metrics (QLTY-PERF-01)', () => {
  test('design lab loads within acceptable time', async ({ page, baseURL }) => {
    await authenticateAndNavigate(page, baseURL, '/', ['DESIGN_LAB']);

    const root = baseURL ?? 'http://localhost:3000';
    const startTime = Date.now();

    await page.goto(`${root}/admin/design-lab`, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('main, [data-page], #root').first()).toBeVisible({
      timeout: 10_000,
    });

    const loadTime = Date.now() - startTime;

    expect(
      loadTime,
      `Page load took ${loadTime}ms, expected < ${MAX_LOAD_TIME_MS}ms`,
    ).toBeLessThan(MAX_LOAD_TIME_MS);

    test.info().annotations.push({
      type: 'performance',
      description: `Design Lab load time: ${loadTime}ms`,
    });
  });

  test('no console errors during navigation', async ({ page, baseURL }) => {
    const consoleErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    await authenticateAndNavigate(page, baseURL, '/', ['DESIGN_LAB', 'VIEW_USERS', 'REPORTING_MODULE']);

    const root = baseURL ?? 'http://localhost:3000';
    const routes = [
      '/admin/design-lab',
      '/admin/users',
      '/admin/reports/users',
    ];

    for (const route of routes) {
      await page.goto(`${root}${route}`, { waitUntil: 'domcontentloaded' });
      await page.waitForLoadState('networkidle');
    }

    // Filter out known benign errors (favicon, source maps, HMR)
    const criticalErrors = consoleErrors.filter(
      (e) =>
        !e.includes('favicon') &&
        !e.includes('.map') &&
        !e.includes('HMR') &&
        !e.includes('hot-update') &&
        !e.includes('DevTools') &&
        !e.includes('third-party cookie') &&
        !e.includes('net::ERR_CONNECTION_REFUSED'),
    );

    // Log all errors for debugging
    if (criticalErrors.length > 0) {
      test.info().annotations.push({
        type: 'warning',
        description: `Console errors: ${criticalErrors.slice(0, 5).join(' | ')}`,
      });
    }

    // Critical JS errors that indicate broken functionality
    const fatalErrors = criticalErrors.filter(
      (e) =>
        e.includes('Uncaught') ||
        e.includes('TypeError') ||
        e.includes('ReferenceError') ||
        e.includes('SyntaxError') ||
        e.includes('ChunkLoadError'),
    );

    expect(
      fatalErrors,
      `Fatal JS errors during navigation: ${fatalErrors.join(' | ')}`,
    ).toHaveLength(0);
  });

  test('multi-route navigation shows stable memory usage', async ({ page, baseURL }) => {
    await authenticateAndNavigate(page, baseURL, '/', ['DESIGN_LAB', 'VIEW_USERS', 'REPORTING_MODULE']);

    const root = baseURL ?? 'http://localhost:3000';

    // Collect initial heap via performance.memory (Chromium only)
    const initialHeap: number | null = await page.evaluate(() => {
      const mem = (performance as any).memory;
      return mem ? mem.usedJSHeapSize : null;
    });

    const routes = [
      '/admin/design-lab',
      '/admin/users',
      '/admin/reports/users',
    ];

    // Navigate through routes
    for (const route of routes) {
      await page.goto(`${root}${route}`, { waitUntil: 'domcontentloaded' });
      await page.waitForLoadState('networkidle');
    }

    // Navigate back to collect final metrics
    await page.goto(`${root}/admin/design-lab`, { waitUntil: 'networkidle' });

    const finalHeap: number | null = await page.evaluate(() => {
      const mem = (performance as any).memory;
      return mem ? mem.usedJSHeapSize : null;
    });

    if (initialHeap != null && finalHeap != null) {
      // Log memory usage
      const heapGrowthMB = (finalHeap - initialHeap) / (1024 * 1024);
      test.info().annotations.push({
        type: 'performance',
        description: `Heap growth over ${routes.length} navigations: ${heapGrowthMB.toFixed(2)}MB (${(initialHeap / (1024 * 1024)).toFixed(2)}MB → ${(finalHeap / (1024 * 1024)).toFixed(2)}MB)`,
      });

      // Heap should not grow excessively (> 100MB indicates a leak)
      const MAX_HEAP_GROWTH_MB = 100;
      expect(
        heapGrowthMB,
        `Heap grew by ${heapGrowthMB.toFixed(2)}MB, which exceeds ${MAX_HEAP_GROWTH_MB}MB threshold`,
      ).toBeLessThan(MAX_HEAP_GROWTH_MB);
    } else {
      // performance.memory not available (non-Chromium); skip gracefully
      test.info().annotations.push({
        type: 'info',
        description: 'performance.memory not available in this browser -- memory check skipped',
      });
    }
  });

  test('performance.timing reports reasonable values', async ({ page, baseURL }) => {
    await authenticateAndNavigate(page, baseURL, '/', ['DESIGN_LAB']);

    const root = baseURL ?? 'http://localhost:3000';
    await page.goto(`${root}/admin/design-lab`, { waitUntil: 'networkidle' });

    const perfTiming = await page.evaluate(() => {
      const entries = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
      if (entries.length === 0) return null;
      const nav = entries[0];
      return {
        domContentLoaded: nav.domContentLoadedEventEnd - nav.startTime,
        loadComplete: nav.loadEventEnd - nav.startTime,
        domInteractive: nav.domInteractive - nav.startTime,
        ttfb: nav.responseStart - nav.requestStart,
      };
    });

    if (perfTiming) {
      test.info().annotations.push({
        type: 'performance',
        description: `TTFB: ${perfTiming.ttfb.toFixed(0)}ms, DOMContentLoaded: ${perfTiming.domContentLoaded.toFixed(0)}ms, DOM Interactive: ${perfTiming.domInteractive.toFixed(0)}ms, Load: ${perfTiming.loadComplete.toFixed(0)}ms`,
      });

      // DOMContentLoaded should be within reasonable bounds
      expect(perfTiming.domContentLoaded).toBeLessThan(10_000);
    }
  });
});
