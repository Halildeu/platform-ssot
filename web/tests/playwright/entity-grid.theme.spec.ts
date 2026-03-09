import { test, expect } from '@playwright/test';
import { authenticateAndNavigate } from './utils/auth';

const densities: Array<'comfortable' | 'compact'> = ['comfortable', 'compact'];

test.describe('EntityGrid runtime axes', () => {
  test('local density toggle updates data attributes', async ({ page, baseURL }) => {
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
    await authenticateAndNavigate(page, baseURL, '/admin/reports/users', ['REPORTING_MODULE']);

    const gridScope = page.locator('[data-theme-scope="entity-grid"]').first();
    await expect(gridScope).toBeVisible({ timeout: 30000 });

    const themeSelect = page.getByLabel(/^Tema$/i);
    const densityButtons = {
      comfortable: gridScope.getByRole('button', { name: /^Konforlu$/i }).first(),
      compact: gridScope.getByRole('button', { name: /^Sıkı$/i }).first(),
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
      await expect(gridScope).toHaveAttribute('data-grid-theme', candidate);
      await expect(themeSelect).toHaveValue(candidate);

      for (const localDensity of densities) {
        await densityButtons[localDensity].click();
        await expect(gridScope).toHaveAttribute('data-density', localDensity);
      }
    }
  });

  test('applies ThemeController axes across entity-grid routes', async ({ page, baseURL }) => {
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
    await authenticateAndNavigate(page, baseURL, '/admin/reports/users', [
      'REPORTING_MODULE',
      'VIEW_USERS',
    ]);
    const routes = [
      { path: '/admin/reports/users', name: 'Reporting' },
      { path: '/admin/users', name: 'Users' },
    ];

    for (let index = 0; index < routes.length; index += 1) {
      const route = routes[index];
      await page.goto(`${baseURL ?? 'http://localhost:3000'}${route.path}`, { waitUntil: 'domcontentloaded' });

      const gridScope = page.locator('[data-theme-scope="entity-grid"]').first();
      await expect(gridScope).toBeVisible({ timeout: 30_000 });

      if (index === 0) {
        const themeSelect = page.getByLabel(/^Tema$/i);
        const optionValues = await themeSelect.locator('option').evaluateAll((nodes) =>
          nodes
            .map((node) => (node as HTMLOptionElement).value)
            .map((value) => String(value ?? '').trim())
            .filter(Boolean),
        );
        expect(optionValues.length).toBeGreaterThan(0);
        const preferred = optionValues.includes('violet') ? 'violet' : optionValues[0];
        await themeSelect.selectOption(preferred);
        await expect(gridScope).toHaveAttribute('data-grid-theme', preferred);
        await expect(themeSelect).toHaveValue(preferred);
      }

      const compactButton = gridScope.getByRole('button', { name: /^(Sıkı|Compact)$/i }).first();
      const comfortableButton = gridScope.getByRole('button', { name: /^(Konforlu|Comfortable)$/i }).first();

      await compactButton.click();
      await expect(gridScope).toHaveAttribute('data-density', 'compact');

      await comfortableButton.click();
      await expect(gridScope).toHaveAttribute('data-density', 'comfortable');
    }
  });
});
