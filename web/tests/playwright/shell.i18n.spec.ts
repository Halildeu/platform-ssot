import { test, expect } from '@playwright/test';
import { authenticateAndNavigate } from './utils/auth';

test.describe('Shell & grid i18n', () => {
  test('language switch updates shell launcher and grid labels', async ({ page, baseURL }) => {
    await authenticateAndNavigate(page, baseURL, '/admin/reports/users', ['VIEW_REPORTS']);
    await page.waitForURL('**/admin/reports/**', { timeout: 30000 });

    // Başlangıçta TR: sayfa başlığı ve app launcher metinleri
    await expect(page.getByText('Kullanıcı etkinliği').first()).toBeVisible({ timeout: 30000 });
    await page.getByRole('button').filter({ hasText: '🧩' }).click();
    await expect(page.getByText('Uygulamalar')).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('Ana Sayfa')).toBeVisible({ timeout: 10000 });

    // Dili EN'e al
    const languageSelect = page.getByRole('combobox').first();
    await languageSelect.selectOption('en');

    // EN metinlerin göründüğünü doğrula (launcher)
    await expect(page.getByText('Home').first()).toBeVisible({ timeout: 30000 });
    await expect(page.getByText('Applications')).toBeVisible({ timeout: 10000 });
    await expect(page.getByRole('link', { name: 'Home Console home screen' })).toBeVisible({ timeout: 10000 });
  });
});
