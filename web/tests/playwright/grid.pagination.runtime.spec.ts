import { expect, test, type Locator, type Page } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import { authenticateAndNavigate } from './utils/auth';

const REPORT_PATH = path.resolve(
  __dirname,
  '../../..',
  '.cache/reports/grid_pagination_runtime_smoke.v1.json',
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

async function expectPageIndicator(footer: Locator, currentPage: number) {
  await expect
    .poll(async () => {
      const text = (await footer.textContent()) ?? '';
      return text.replace(/\s+/g, ' ').trim();
    }, { timeout: UI_TIMEOUT_MS })
    .toContain(`Page ${currentPage}`);
}

async function getPageCount(footer: Locator) {
  const text = ((await footer.textContent()) ?? '').replace(/\s+/g, ' ').trim();
  const match = text.match(/Page\s+\d+\s*\/\s*(\d+)/i);
  return match ? Number(match[1]) : 1;
}

async function changePageSize(footer: Locator, nextValue: string) {
  const select = footer.locator('select').first();
  await expect(select).toBeVisible({ timeout: 15_000 });
  await select.selectOption(nextValue);
  await expect(select).toHaveValue(nextValue, { timeout: 15_000 });
}

test.describe('Entity grid pagination runtime smoke', () => {
  test('users server/client ve reporting server footer akislari calisir', async ({ page, baseURL }) => {
    const isPermitAll = (process.env.PW_FAKE_AUTH ?? '').trim() === '1'
      || (process.env.AUTH_MODE ?? '').trim().toLowerCase() === 'permitall';
    test.skip(isPermitAll, 'Requires real backend data for pagination — skipped in permitAll');

    test.setTimeout(240_000);
    const root = baseURL ?? 'http://localhost:3000';
    const report: Record<string, unknown> = {
      startedAt: new Date().toISOString(),
      root,
      status: 'IN_PROGRESS',
      steps: [],
    };

    const pushStep = (step: string, details?: Record<string, unknown>) => {
      const steps = (report.steps as Array<Record<string, unknown>>) ?? [];
      steps.push({ step, ...details });
      report.steps = steps;
    };

    try {
      const usersAuth = await authenticateAndNavigate(page, baseURL, '/admin/users', ['VIEW_USERS', 'VIEW_REPORTS']);
      await page.goto(`${usersAuth.root}/admin/users`, { waitUntil: 'domcontentloaded' });
      pushStep('auth_ok');

      await page.waitForURL(/\/admin\/users$/, { timeout: UI_TIMEOUT_MS });
      await expect(page.getByTestId('users-grid-root')).toBeVisible({ timeout: UI_TIMEOUT_MS });
      await waitForGrid(page);
      const usersServerFooter = await getFooter(page);
      await expectPageIndicator(usersServerFooter, 1);
      await expect(usersServerFooter.locator('select').first()).toHaveValue('50', { timeout: 15_000 });
      await changePageSize(usersServerFooter, '25');
      const usersServerPageCount = await getPageCount(usersServerFooter);
      const usersServerNextButton = usersServerFooter.getByRole('button', { name: /next page/i });
      if (usersServerPageCount > 1) {
        await expect(usersServerNextButton).toBeEnabled();
        await usersServerNextButton.click();
        await expectPageIndicator(usersServerFooter, 2);
      } else {
        await expect(usersServerNextButton).toBeDisabled();
      }
      pushStep('users_server_footer_ok', { pageSize: '25', pageCount: usersServerPageCount });

      const modeSelect = page.locator('select').filter({ has: page.locator('option[value="server"]') }).filter({
        has: page.locator('option[value="client"]'),
      }).first();
      await expect(modeSelect).toBeVisible({ timeout: 15_000 });
      await modeSelect.selectOption('client');
      await waitForGrid(page);
      const usersClientFooter = await getFooter(page);
      await expectPageIndicator(usersClientFooter, 1);
      await changePageSize(usersClientFooter, '25');
      const usersClientPageCount = await getPageCount(usersClientFooter);
      const usersClientNextButton = usersClientFooter.getByRole('button', { name: /next page/i });
      if (usersClientPageCount > 1) {
        await expect(usersClientNextButton).toBeEnabled();
        await usersClientNextButton.click();
        await expectPageIndicator(usersClientFooter, 2);
      } else {
        await expect(usersClientNextButton).toBeDisabled();
      }
      pushStep('users_client_footer_ok', { pageSize: '25', pageCount: usersClientPageCount });

      const reportingAuth = await authenticateAndNavigate(page, baseURL, '/admin/reports/users', ['VIEW_USERS', 'VIEW_REPORTS']);
      await page.goto(`${reportingAuth.root}/admin/reports/users`, { waitUntil: 'domcontentloaded' });
      await page.waitForURL(/\/admin\/reports\/users$/, { timeout: UI_TIMEOUT_MS });
      await expect(page.getByTestId('report-page-users')).toBeVisible({ timeout: UI_TIMEOUT_MS });
      await waitForGrid(page);
      const reportingFooter = await getFooter(page);
      await expectPageIndicator(reportingFooter, 1);
      await changePageSize(reportingFooter, '25');
      const reportingPageCount = await getPageCount(reportingFooter);
      const reportingNextButton = reportingFooter.getByRole('button', { name: /next page/i });
      if (reportingPageCount > 1) {
        await expect(reportingNextButton).toBeEnabled();
        await reportingNextButton.click();
        await expectPageIndicator(reportingFooter, 2);
      } else {
        await expect(reportingNextButton).toBeDisabled();
      }
      pushStep('reporting_server_footer_ok', { pageSize: '25', pageCount: reportingPageCount });

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
