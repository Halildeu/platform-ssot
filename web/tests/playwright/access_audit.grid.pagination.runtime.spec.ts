import { expect, test, type Locator, type Page } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import { authenticateAndNavigate } from './utils/auth';

const REPORT_PATH = path.resolve(
  __dirname,
  '../../..',
  '.cache/reports/access_audit_grid_pagination_runtime_smoke.v1.json',
);
const UI_TIMEOUT_MS = 60_000;

const writeReport = (payload: unknown) => {
  fs.mkdirSync(path.dirname(REPORT_PATH), { recursive: true });
  fs.writeFileSync(REPORT_PATH, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
};

async function waitForGrid(page: Page) {
  await expect(page.locator('.ag-root')).toBeVisible({ timeout: UI_TIMEOUT_MS });
  await expect(page.locator('.ag-center-cols-container')).toBeVisible({ timeout: UI_TIMEOUT_MS });
}

async function getFooter(page: Page): Promise<Locator> {
  const footer = page.locator('[data-component="table-pagination"]').last();
  await expect(footer).toBeVisible({ timeout: UI_TIMEOUT_MS });
  return footer;
}

async function changePageSize(footer: Locator, nextValue: string) {
  const select = footer.locator('select').first();
  await expect(select).toBeVisible({ timeout: 15_000 });
  await select.selectOption(nextValue);
  await expect(select).toHaveValue(nextValue, { timeout: 15_000 });
}

async function expectFooterTextContains(footer: Locator, text: string) {
  await expect
    .poll(async () => {
      const content = (await footer.textContent()) ?? '';
      return content.replace(/\s+/g, ' ').trim();
    }, { timeout: UI_TIMEOUT_MS })
    .toContain(text);
}

test.describe('Access ve audit pagination runtime smoke', () => {
  test('access footer controls ve audit pagination akislari calisir', async ({ page, baseURL }) => {
    test.setTimeout(180_000);

    const report: Record<string, unknown> = {
      startedAt: new Date().toISOString(),
      root: baseURL ?? 'http://localhost:3000',
      status: 'IN_PROGRESS',
      steps: [],
    };

    const pushStep = (step: string, details?: Record<string, unknown>) => {
      const steps = (report.steps as Array<Record<string, unknown>>) ?? [];
      steps.push({ step, ...details });
      report.steps = steps;
    };

    try {
      const accessAuth = await authenticateAndNavigate(page, baseURL, '/access/roles', ['ACCESS_MODULE']);
      await page.goto(`${accessAuth.root}/access/roles`, { waitUntil: 'domcontentloaded' });
      await page.waitForURL(/\/access\/roles$/, { timeout: UI_TIMEOUT_MS });
      await expect(page.locator('[data-testid="access-grid"]')).toHaveCount(1, { timeout: UI_TIMEOUT_MS });
      await waitForGrid(page);

      const accessFooter = await getFooter(page);
      const accessPreviousButton = accessFooter.getByRole('button', { name: /previous page/i });
      const accessNextButton = accessFooter.getByRole('button', { name: /next page/i });

      await expect(accessPreviousButton).toBeDisabled();
      await expect(accessNextButton).toBeDisabled();
      await changePageSize(accessFooter, '25');
      await expect(accessPreviousButton).toBeDisabled();
      await expect(accessNextButton).toBeDisabled();
      pushStep('access_footer_controls_ok', {
        pageSize: '25',
        totalPages: 1,
      });

      const auditAuth = await authenticateAndNavigate(page, baseURL, '/audit/events', [
        'AUDIT_MODULE',
        'VIEW_AUDIT',
      ]);
      await page.goto(`${auditAuth.root}/audit/events`, { waitUntil: 'domcontentloaded' });
      await page.waitForURL(/\/audit\/events$/, { timeout: UI_TIMEOUT_MS });
      await expect(page.locator('[data-testid="audit-grid"]')).toHaveCount(1, { timeout: UI_TIMEOUT_MS });
      await waitForGrid(page);

      const auditFooter = await getFooter(page);
      await expectFooterTextContains(auditFooter, 'Page 1 / 3');

      const auditNextButton = auditFooter.getByRole('button', { name: /next page/i });
      await expect(auditNextButton).toBeEnabled();
      await auditNextButton.click();
      await expectFooterTextContains(auditFooter, 'Page 2 / 3');

      await changePageSize(auditFooter, '25');
      await expectFooterTextContains(auditFooter, 'Page 1 / 1');
      pushStep('audit_footer_runtime_ok', {
        pageAfterNext: 2,
        pageSize: '25',
      });

      report.status = 'OK';
      report.finishedAt = new Date().toISOString();
      writeReport(report);
    } catch (error) {
      report.status = 'FAILED';
      report.finishedAt = new Date().toISOString();
      report.error = error instanceof Error ? error.message : String(error);
      writeReport(report);
      throw error;
    }
  });
});
