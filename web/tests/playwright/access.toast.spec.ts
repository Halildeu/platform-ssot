import { test, expect } from '@playwright/test';
import { authenticateAndNavigate } from './utils/auth';

declare global {
  interface Window {
    __capturedToasts?: Array<{ type?: string; text: string }>;
  }
}

const captureToasts = () => {
  window.__capturedToasts = [];
  window.addEventListener('app:toast', (event) => {
    window.__capturedToasts?.push(event.detail);
  });
};

test.describe('Access toast notifications', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(captureToasts);
  });

  test('clone role triggers success toast', async ({ page, baseURL }) => {
    await authenticateAndNavigate(page, baseURL, '/access/roles', ['ACCESS_MODULE', 'MANAGE_ACCESS']);
    await page.waitForSelector('.ag-center-cols-container .ag-row', { timeout: 30000 });

    await page.getByRole('checkbox', { name: /Press Space to toggle row selection/i }).first().click();
    await page.getByRole('button', { name: /Rolü Klonla/i }).click();
    await page.getByRole('button', { name: /^(Oluştur|access\\.clone\\.okText)$/i }).click();

    await expect
      .poll(async () => {
        const toasts = await page.evaluate(() => window.__capturedToasts ?? []);
        return toasts.length;
      }, { timeout: 15000 })
      .toBeGreaterThan(0);

    const toasts = await page.evaluate(() => window.__capturedToasts ?? []);
    expect(toasts[0]?.text ?? '').toContain('Rol');
  });
});
