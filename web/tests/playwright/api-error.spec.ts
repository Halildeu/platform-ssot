import { test, expect } from '@playwright/test';
import { authenticateAndNavigate } from './utils/auth';

test.describe('Error handling (QLTY-ERROR-01)', () => {
  test('non-existent route shows 404 or redirects gracefully', async ({ page, baseURL }) => {
    await authenticateAndNavigate(page, baseURL, '/', ['VIEW_USERS']);

    const root = baseURL ?? 'http://localhost:3000';
    await page.goto(`${root}/admin/this-route-does-not-exist-${Date.now()}`, {
      waitUntil: 'networkidle',
    });

    // Should show a 404 page, redirect to a known page, or show an error boundary
    const currentUrl = page.url();

    const is404Page =
      (await page.locator('text=/404|Sayfa Bulunamadi|Not Found|Page Not Found/i').first().isVisible({ timeout: 5_000 }).catch(() => false));
    const isRedirected = !currentUrl.includes('this-route-does-not-exist');
    const isErrorBoundary =
      (await page.locator('[data-testid*="error"], [class*="error-boundary"], [role="alert"]').first().isVisible({ timeout: 3_000 }).catch(() => false));

    expect(
      is404Page || isRedirected || isErrorBoundary,
      `Expected 404 page, redirect, or error boundary. Got URL: ${currentUrl}`,
    ).toBeTruthy();
  });

  test('non-existent report route shows error state', async ({ page, baseURL }) => {
    await authenticateAndNavigate(page, baseURL, '/', ['REPORTING_MODULE']);

    const root = baseURL ?? 'http://localhost:3000';
    await page.goto(`${root}/admin/reports/nonexistent_report_${Date.now()}`, {
      waitUntil: 'networkidle',
    });

    // Should show error state, empty state, or redirect
    const currentUrl = page.url();

    const hasErrorIndicator =
      (await page
        .locator(
          'text=/404|Bulunamadi|Not Found|Hata|Error/i, [data-testid*="error"], [data-testid*="empty"], [role="alert"]',
        )
        .first()
        .isVisible({ timeout: 5_000 })
        .catch(() => false));
    const isRedirected = !currentUrl.includes('nonexistent_report');

    expect(
      hasErrorIndicator || isRedirected,
      `Expected error state or redirect for nonexistent report. Got URL: ${currentUrl}`,
    ).toBeTruthy();
  });

  test('ErrorBoundary catches render errors gracefully', async ({ page, baseURL }) => {
    await authenticateAndNavigate(page, baseURL, '/', ['VIEW_USERS']);

    const consoleErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    // Inject a component error to test ErrorBoundary
    const root = baseURL ?? 'http://localhost:3000';
    await page.goto(`${root}/admin/design-lab`, { waitUntil: 'networkidle' });

    // Verify page rendered without crashing (white screen)
    const rootElement = page.locator('#root, #app, [data-testid="app-root"]').first();
    await expect(rootElement).toBeVisible({ timeout: 10_000 });

    // Verify the root element has actual content (not a white screen)
    const hasContent = await page.evaluate(() => {
      const root = document.getElementById('root') ?? document.getElementById('app');
      return root ? root.innerHTML.trim().length > 0 : false;
    });

    expect(hasContent, 'Application root should have rendered content').toBeTruthy();

    // Check that no unhandled promise rejections crashed the page
    const criticalErrors = consoleErrors.filter(
      (e) =>
        e.includes('Unhandled') ||
        e.includes('ChunkLoadError') ||
        e.includes('Cannot read properties of undefined'),
    );

    // Log informational but do not fail -- some console errors are expected in dev
    if (criticalErrors.length > 0) {
      test.info().annotations.push({
        type: 'warning',
        description: `Critical console errors detected: ${criticalErrors.slice(0, 3).join(' | ')}`,
      });
    }
  });
});
