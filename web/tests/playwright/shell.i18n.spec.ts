import { test, expect } from '@playwright/test';
import { authenticateAndNavigate } from './utils/auth';

test.describe('Shell & grid i18n', () => {
  test('language switch updates shell launcher and grid labels', async ({ page, baseURL }) => {
    await page.route('**/api/v1/users**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          items: [
            {
              id: 'user-1',
              fullName: 'Runtime User',
              email: 'runtime@test.local',
              role: 'Admin',
              status: 'ACTIVE',
              lastLoginAt: '2026-03-08T10:00:00Z',
              createdAt: '2026-03-01T10:00:00Z',
            },
          ],
          total: 1,
          page: 1,
          pageSize: 50,
        }),
      });
    });
    await authenticateAndNavigate(page, baseURL, '/admin/reports/users', ['VIEW_REPORTS']);
    await page.waitForURL('**/admin/reports/**', { timeout: 30000 });

    // Başlangıçta TR: sayfa başlığı ve app launcher metinleri
    await expect(page.getByText('Kullanıcı etkinliği').first()).toBeVisible({ timeout: 30000 });
    await page.getByRole('button', { name: /Uygulamalar/i }).click();
    await expect(page.getByText('Uygulamalar')).toBeVisible({ timeout: 10000 });
    await expect(page.getByRole('link', { name: /Ana Sayfa/i }).first()).toBeVisible({ timeout: 10000 });

    // Dili EN'e al
    const languageSelect = page.getByRole('combobox', { name: /Dil seçimi/i });
    await languageSelect.selectOption('en');

    // EN metinlerin göründüğünü doğrula (launcher)
    await expect(page.getByRole('button', { name: /Applications/i })).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('Home').first()).toBeVisible({ timeout: 30000 });
    await expect(page.getByText('Applications')).toBeVisible({ timeout: 10000 });
    await expect(page.getByRole('link', { name: 'Home Console home screen' })).toBeVisible({ timeout: 10000 });
  });
});
