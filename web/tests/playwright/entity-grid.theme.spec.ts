import { test, expect } from '@playwright/test';
import { authenticateAndNavigate } from './utils/auth';

const densities: Array<'comfortable' | 'compact'> = ['comfortable', 'compact'];

test.describe('EntityGrid runtime axes', () => {
  test('local density toggle updates data attributes', async ({ page, baseURL }) => {
    const { root } = await authenticateAndNavigate(page, baseURL, '/admin/reports/users', ['REPORTING_MODULE']);
    const response = await page.goto(`${root}/admin/reports/users`, { waitUntil: 'domcontentloaded' });
    expect(response?.ok()).toBeTruthy();

    const gridScope = page.locator('[data-theme-scope="entity-grid"]').first();
    await expect(gridScope).toBeVisible({ timeout: 30000 });

    const themeSelect = page.getByLabel('Tema seçimi');
    const densityButtons = {
      comfortable: page.getByRole('button', { name: 'Konforlu' }),
      compact: page.getByRole('button', { name: 'Sıkı' }),
    };

    const optionValues = await themeSelect.locator('option').evaluateAll((nodes) =>
      nodes
        .map((node) => (node as HTMLOptionElement).value)
        .map((value) => String(value ?? '').trim())
        .filter(Boolean),
    );
    const candidates = optionValues.slice(0, 4);
    expect(candidates.length).toBeGreaterThan(0);

    for (const candidate of candidates) {
      await themeSelect.selectOption(candidate);
      await expect
        .poll(() => page.evaluate(() => document.documentElement.getAttribute('data-accent')))
        .toBe(candidate);

      for (const localDensity of densities) {
        await densityButtons[localDensity].click();
        await expect(gridScope).toHaveAttribute('data-density', localDensity);
      }
    }
  });

  test('applies ThemeController axes across Access/Audit/Reporting grids', async ({ page, baseURL }) => {
    const { root } = await authenticateAndNavigate(page, baseURL, '/admin/reports/users', [
      'REPORTING_MODULE',
      'ACCESS_MODULE',
      'AUDIT_MODULE',
    ]);
    const routes = [
      { path: '/admin/reports/users', name: 'Reporting' },
      { path: '/access/roles', name: 'Access' },
      { path: '/audit/events', name: 'Audit' },
    ];

    for (let index = 0; index < routes.length; index += 1) {
      const route = routes[index];
      const response = await page.goto(`${root}${route.path}`, { waitUntil: 'domcontentloaded' });
      expect(response?.ok()).toBeTruthy();

      const gridScope = page.locator('[data-theme-scope="entity-grid"]').first();
      await expect(gridScope).toBeVisible({ timeout: 30_000 });

      if (index === 0) {
        const themeSelect = page.getByLabel('Tema seçimi');
        const optionValues = await themeSelect.locator('option').evaluateAll((nodes) =>
          nodes
            .map((node) => (node as HTMLOptionElement).value)
            .map((value) => String(value ?? '').trim())
            .filter(Boolean),
        );
        expect(optionValues.length).toBeGreaterThan(0);
        const preferred = optionValues.includes('violet') ? 'violet' : optionValues[0];
        await themeSelect.selectOption(preferred);
        await expect
          .poll(() => page.evaluate(() => document.documentElement.getAttribute('data-accent')))
          .toBe(preferred);
      }

      const compactButton = page.getByRole('button', { name: /Sıkı|Compact/i }).first();
      const comfortableButton = page.getByRole('button', { name: /Konforlu|Comfortable/i }).first();

      await compactButton.click();
      await expect(gridScope).toHaveAttribute('data-density', 'compact');

      await comfortableButton.click();
      await expect(gridScope).toHaveAttribute('data-density', 'comfortable');
    }
  });
});
