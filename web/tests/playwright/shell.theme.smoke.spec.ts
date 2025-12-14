import { test, expect } from '@playwright/test';
import {
  RUNTIME_THEME_MATRIX_THEMES,
  RUNTIME_THEME_MATRIX_DENSITIES,
  RUNTIME_THEME_MATRIX_APPEARANCE_MAP,
  RUNTIME_THEME_MATRIX_ACCESS_STATES,
  THEME_MATRIX_HIDDEN_LABEL,
} from '../../apps/mfe-shell/src/features/theme/theme-matrix.constants';

test.describe('Shell theme attributes', () => {
  test('sets html theme axes attributes', async ({ page, baseURL }) => {
    const root = baseURL ?? 'http://localhost:3000';
    const response = await page.goto(`${root}/`, { waitUntil: 'domcontentloaded' });
    expect(response?.ok()).toBeTruthy();

    await page.waitForFunction(() => {
      return (
        document.documentElement.hasAttribute('data-theme')
        && document.documentElement.hasAttribute('data-accent')
        && document.documentElement.hasAttribute('data-density')
        && document.documentElement.hasAttribute('data-radius')
        && document.documentElement.hasAttribute('data-elevation')
        && document.documentElement.hasAttribute('data-motion')
      );
    }, { timeout: 10_000 });

    const attrs = await page.evaluate(() => ({
      theme: document.documentElement.getAttribute('data-theme'),
      accent: document.documentElement.getAttribute('data-accent'),
      density: document.documentElement.getAttribute('data-density'),
      radius: document.documentElement.getAttribute('data-radius'),
      elevation: document.documentElement.getAttribute('data-elevation'),
      motion: document.documentElement.getAttribute('data-motion'),
    }));

    expect(attrs?.theme).toBeTruthy();
    expect(attrs?.accent).toBeTruthy();
    expect(attrs?.density).toBeTruthy();
    expect(attrs?.radius).toBeTruthy();
    expect(attrs?.elevation).toBeTruthy();
    expect(attrs?.motion).toBeTruthy();
  });

  test('Theme panel selects global palette themes', async ({ page, baseURL }) => {
    const root = baseURL ?? 'http://localhost:3000';
    const response = await page.goto(`${root}/`, { waitUntil: 'domcontentloaded' });
    expect(response?.ok()).toBeTruthy();

    await page.getByTestId('runtime-panel-trigger').click();
    const runtimePanel = page.getByTestId('runtime-panel');
    await expect(runtimePanel).toBeVisible();

    const palette = runtimePanel.getByTestId('global-theme-palette');
    await expect(palette).toBeVisible();

    const paletteButtons = palette.locator('button[role="listitem"]');
    await expect(paletteButtons.first()).toBeVisible();

    const count = await paletteButtons.count();
    if (count > 1) {
      await paletteButtons.nth(1).click();
      await expect(paletteButtons.nth(1)).toHaveAttribute('aria-pressed', 'true');
    }
  });

  test('Theme matrix route renders 4 theme × 2 density × access kombinasyonları', async ({ page, baseURL }) => {
    const root = baseURL ?? 'http://localhost:3000';
    const response = await page.goto(`${root}/runtime/theme-matrix`, { waitUntil: 'networkidle' });
    expect(response?.ok()).toBeTruthy();

    for (const theme of RUNTIME_THEME_MATRIX_THEMES) {
      for (const density of RUNTIME_THEME_MATRIX_DENSITIES) {
        const scope = page.locator(`[data-theme-scope="chromatic-${theme}-${density}"]`);
        await expect(scope).toBeVisible();
        await expect(scope).toHaveAttribute('data-theme', theme);
        await expect(scope).toHaveAttribute('data-density', density);
        await expect(scope).toHaveAttribute('data-appearance', RUNTIME_THEME_MATRIX_APPEARANCE_MAP[theme]);

        for (const accessState of RUNTIME_THEME_MATRIX_ACCESS_STATES) {
          await expect(scope.locator(`[data-access-state="${accessState}"]`).first()).toBeVisible();
        }

        await expect(scope.getByRole('button', { name: THEME_MATRIX_HIDDEN_LABEL })).toHaveCount(0);
      }
    }
  });

  test('Runtime Theme Matrix enforces access semantics across previews', async ({ page, baseURL }) => {
    const root = baseURL ?? 'http://localhost:3000';
    const response = await page.goto(`${root}/runtime/theme-matrix`, { waitUntil: 'networkidle' });
    expect(response?.ok()).toBeTruthy();

    const hiddenContainers = page.locator('[data-testid^="hidden-action-"]');
    const containerCount = await hiddenContainers.count();
    for (let index = 0; index < containerCount; index += 1) {
      await expect(hiddenContainers.nth(index).locator('button')).toHaveCount(0);
    }

    const detailDrawer = page.getByTestId('detail-drawer-preview');
    await expect(detailDrawer.locator('[data-access-state="readonly"]')).toBeVisible();

    const formDrawer = page.getByTestId('form-drawer-preview');
    await expect(formDrawer.getByRole('button', { name: 'Kaydet' })).toBeDisabled();

    const accessDrawer = page.getByTestId('access-drawer-preview');
    await expect(accessDrawer.getByRole('button', { name: /Rol Ata/i })).toBeDisabled();
    await expect(accessDrawer.getByRole('button', { name: /Rolleri İncele/i })).toHaveAttribute('aria-readonly', 'true');

    const reportingPreview = page.getByTestId('reporting-preview-item').first();
    await expect(reportingPreview.getByRole('button', { name: /Excel \(Tümü\)/i })).toBeDisabled();
    await expect(reportingPreview.getByRole('button', { name: /CSV \(Görünür\)/i })).toHaveAttribute(
      'aria-readonly',
      'true',
    );

    const notificationPreview = page.getByTestId('notification-preview');
    await expect(notificationPreview.locator('.rounded-xl')).toHaveCount(3);
  });

  test('Theme personalization smoke: global/user theme CRUD + user overrides editor', async ({ page, baseURL }) => {
    const root = baseURL ?? 'http://localhost:3000';
    const response = await page.goto(`${root}/`, { waitUntil: 'domcontentloaded' });
    expect(response?.ok()).toBeTruthy();

    // Runtime panel aç
    await page.getByTestId('runtime-panel-trigger').click();
    const runtimePanel = page.getByTestId('runtime-panel');
    await expect(runtimePanel).toBeVisible();

    const userThemeList = runtimePanel.locator('[data-testid="user-theme-list"]');
    const initialUserThemeCount = await userThemeList.locator('button').count();

    if (initialUserThemeCount === 0) {
      await runtimePanel.getByTestId('theme-fork-button').click();
      await expect(userThemeList).toBeVisible({ timeout: 30_000 });
    }

    await userThemeList.locator('button').first().click();

    const openEditorButton = runtimePanel.getByTestId('user-theme-colors-button');
    await expect(openEditorButton).toBeEnabled({ timeout: 30_000 });
    await openEditorButton.click();

    const editor = page.getByTestId('user-theme-editor');
    await expect(editor).toBeVisible();
    await expect(editor.locator('section').first()).toBeVisible();
    await expect(editor.locator('input[placeholder*="#rrggbb"]').first()).toBeVisible();

    await editor.getByRole('button', { name: 'Kapat' }).click();
    await expect(page.getByTestId('user-theme-editor-overlay')).toBeHidden();
  });
});
