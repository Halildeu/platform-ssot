import { test, expect } from '@playwright/test';
import { authenticateAndNavigate } from './utils/auth';

const USERS_LINK_LABEL = /Users|Kullanıcılar/;

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

    await authenticateAndNavigate(page, baseURL, '/', ['user-read']);

    const responsePromise = page.waitForResponse(
      (resp) => resp.url().includes('/api/v1/users') && resp.status() === 200,
    );

    await page.getByRole('link', { name: USERS_LINK_LABEL }).click();
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

    await authenticateAndNavigate(page, baseURL, '/', ['user-read']);

    const responsePromise = page.waitForResponse(
      (resp) => resp.url().includes('/api/v1/users') && resp.status() === 403,
    );

    await page.getByRole('link', { name: USERS_LINK_LABEL }).click();
    await expect(page).toHaveURL(/\/admin\/users/);
    await responsePromise;
    await expect(page.getByText('Profiliniz henüz oluşturulmamış', { exact: false }).first()).toBeVisible();
    await expect(page).not.toHaveURL(/\/login/);
  });
});
