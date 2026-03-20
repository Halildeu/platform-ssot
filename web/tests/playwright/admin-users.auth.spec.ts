import { test, expect } from '@playwright/test';
import { authenticateAndNavigate } from './utils/auth';

const USERS_LINK_LABEL = /Users|Kullanıcılar/;
const USERS_OVERFLOW_TEST_ID = 'shell-header-navbar-overflow-admin-users';
const USERS_OVERFLOW_TRIGGER_TEST_ID = 'shell-header-navbar-overflow-trigger';

const disableUsersDevFallback = async (page: Parameters<typeof test>[0]['page']) => {
  await page.addInitScript(() => {
    const runtimeWindow = window as Window & {
      __env__?: Record<string, string>;
      __ENV__?: Record<string, string>;
    };
    const current = runtimeWindow.__env__ ?? runtimeWindow.__ENV__ ?? {};
    const nextEnv = {
      ...current,
      VITE_USERS_DISABLE_DEV_FALLBACK: '1',
    };
    runtimeWindow.__env__ = nextEnv;
    runtimeWindow.__ENV__ = nextEnv;
  });
};

const navigateToUsersFromHeader = async (page: Parameters<typeof test>[0]['page']) => {
  const directLink = page.getByRole('link', { name: USERS_LINK_LABEL }).first();

  if (await directLink.isVisible().catch(() => false)) {
    await directLink.click();
    return;
  }

  const overflowTrigger = page.getByTestId(USERS_OVERFLOW_TRIGGER_TEST_ID);
  await expect(overflowTrigger).toBeVisible();
  await overflowTrigger.click();
  await page.getByTestId(USERS_OVERFLOW_TEST_ID).click();
};

test.describe('Admin Users auth flow', () => {
  test('admin@example.com kullanıcıları menüsünden 200 yanıtlı grid görür', async ({ page, baseURL }) => {
    await page.route('**/api/v1/users**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          items: [],
          total: 0,
          page: 1,
          pageSize: 0,
        }),
      });
    });

    await disableUsersDevFallback(page);
    await authenticateAndNavigate(page, baseURL, '/', ['user-read']);

    const responsePromise = page.waitForResponse(
      (resp) => resp.url().includes('/api/v1/users') && resp.status() === 200,
    );

    await navigateToUsersFromHeader(page);
    await expect(page).toHaveURL(/\/admin\/users/);
    await responsePromise;
    await expect(page.locator('.ag-root')).toBeVisible();
  });

  test('profil eksik kullanıcı login ekranına düşmeden uyarı görür', async ({ page, baseURL }) => {
    await page.route('**/api/v1/users**', async (route) => {
      await route.fulfill({
        status: 403,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'PROFILE_MISSING' }),
      });
    });

    await disableUsersDevFallback(page);
    await authenticateAndNavigate(page, baseURL, '/', ['user-read']);

    const responsePromise = page.waitForResponse(
      (resp) => resp.url().includes('/api/v1/users') && resp.status() === 403,
    );

    await navigateToUsersFromHeader(page);
    await expect(page).toHaveURL(/\/admin\/users/);
    await responsePromise;
    await expect(page.getByText('Profiliniz henüz oluşturulmamış', { exact: false }).first()).toBeVisible();
    await expect(page).not.toHaveURL(/\/login/);
  });
});
