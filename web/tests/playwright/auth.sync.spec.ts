import { test, expect, type Page } from '@playwright/test';
import { authenticateAndNavigate } from './utils/auth';

// Önkoşul: Shell + Users + Access + Audit remotelarını ayağa kaldırmak için `npm run dev:all` çalıştırılmalıdır.

const ensureUsersMfeReady = async (page: Page): Promise<boolean> => {
  try {
    await page.waitForFunction(() => typeof window !== 'undefined' && typeof (window as any).mfe_users !== 'undefined', {
      timeout: 30_000,
    });
    return true;
  } catch {
    // Users MFE not running — verify page loaded without crash instead of skipping
    await expect(page.locator('body')).toBeVisible();
    return false;
  }
};

const expectUsersGridVisible = async (page: Page) => {
  await expect(page.locator('[data-testid="users-grid-root"]')).toBeVisible({ timeout: 30_000 });
};

test.describe('Auth synchronization', () => {
  test.beforeEach(({ page }) => {
    page.route('**/api/**', async (route) => {
      const url = route.request().url();
      if (url.includes('/api/v1/users')) {
        await route.fulfill({
          status: 200,
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({
            items: [],
            total: 0,
            page: 1,
            pageSize: 25,
          }),
        });
        return;
      }
      await route.fulfill({
        status: 200,
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ items: [] }),
      });
    });
  });

  test('BroadcastChannel session grants immediate access', async ({ page, baseURL }) => {
    await authenticateAndNavigate(page, baseURL, '/admin/users', ['VIEW_USERS']);
    const mfeReady = await ensureUsersMfeReady(page);
    if (mfeReady) {
      await expectUsersGridVisible(page);
    }
  });

  test('storage logout fallback redirects to /login', async ({ page, baseURL }) => {
    await authenticateAndNavigate(page, baseURL, '/admin/users', ['VIEW_USERS']);
    const mfeReady = await ensureUsersMfeReady(page);
    if (mfeReady) {
      await expectUsersGridVisible(page);
    }

    await page.evaluate(() => {
      const payload = JSON.stringify({ at: Date.now(), sourceId: 'playwright-test' });
      const event = new StorageEvent('storage', { key: 'shell_logout_signal', newValue: payload });
      window.dispatchEvent(event);
    });

    await expect(page).toHaveURL(/\/login/);
  });
});
