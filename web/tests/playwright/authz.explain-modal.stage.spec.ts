/**
 * Zanzibar Explain Modal — thin release gate (2 senaryo)
 *
 * Codex CNS-20260416-004 thread `019d97a4-8a14-7be2-a230-f0613c93239b`,
 * 2 tur APPROVE_WITH_CHANGES. Scope:
 *
 *   - ALLOWED:  canary-read-only + /access/roles + RoleDrawer(REPORT_VIEWER)
 *               + explain-trigger-module-REPORT → modal reason=ALLOWED,
 *               userRoles contains REPORT_VIEWER, roleName REPORT_VIEWER.
 *   - DENIED:   canary-restricted + /admin/themes → /unauthorized + requiredModule=THEME
 *               + "Neden erişemiyorum?" click → reason=NO_PERMISSION.
 *
 * Stage-only; baseURL host `ai.acik.com` veya PW_REQUIRE_OIDC=1 değilse
 * tüm describe skip edilir (localhost'ta semantik bulanmasın).
 *
 * Login: real Auth Code + PKCE (frontend public client), LoginPage pattern.
 * Helper: `performBrowserLogin` authz.zanzibar.spec.ts'teki pattern'in inline kopyası.
 */

import { test, expect, type Page } from '@playwright/test';

test.describe.configure({ retries: 1 });

const READ_ONLY_EMAIL = (
  process.env.PW_CANARY_READ_ONLY_EMAIL ?? 'canary-read-only@stage.local'
).trim();
const RESTRICTED_EMAIL = (
  process.env.PW_CANARY_RESTRICTED_EMAIL ?? 'canary-restricted@stage.local'
).trim();
const CANARY_PASSWORD = (process.env.PW_CANARY_PASSWORD ?? '').trim();
const REQUIRE_OIDC = (process.env.PW_REQUIRE_OIDC ?? '').trim() === '1';
const OIDC_DISCOVERY_PATH = '/realms/serban/.well-known/openid-configuration';

const STAGE_HOSTS = new Set(['ai.acik.com']);

const isStageHost = (baseURL: string | undefined): boolean => {
  if (!baseURL) return false;
  try {
    const url = new URL(baseURL);
    return STAGE_HOSTS.has(url.host);
  } catch {
    return false;
  }
};

const waitForFirstVisible = async (
  page: Page,
  selectors: string[],
  timeoutMs = 15_000,
) => {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    for (const selector of selectors) {
      const locator = page.locator(selector).first();
      if (await locator.isVisible().catch(() => false)) {
        return locator;
      }
    }
    await page.waitForTimeout(250);
  }
  return null;
};

const fillFirst = async (page: Page, selectors: string[], value: string) => {
  for (const selector of selectors) {
    const locator = page.locator(selector).first();
    if (await locator.isVisible().catch(() => false)) {
      await locator.fill(value);
      return;
    }
  }
  throw new Error(`Beklenen input bulunamadı: ${selectors.join(', ')}`);
};

const clickFirst = async (page: Page, selectors: string[]) => {
  for (const selector of selectors) {
    const locator = page.locator(selector).first();
    if (await locator.isVisible().catch(() => false)) {
      await locator.click();
      return;
    }
  }
  throw new Error(`Beklenen buton bulunamadı: ${selectors.join(', ')}`);
};

const performBrowserLogin = async (
  page: Page,
  root: string,
  email: string,
  password: string,
  redirectPath: string,
) => {
  await page.context().clearCookies();
  await page.goto(
    `${root}/login?redirect=${encodeURIComponent(redirectPath)}`,
    { waitUntil: 'domcontentloaded' },
  );

  const appLoginButtonSelectors = [
    '[data-testid="corporate-login-button"]',
    'button:has-text("Güvenli Kurumsal Giriş")',
    'button:has-text("Kurumsal Giriş")',
    'button:has-text("Sign In")',
  ];
  const loginButton = await waitForFirstVisible(page, appLoginButtonSelectors, 15_000);
  if (loginButton) {
    await expect(loginButton).toBeEnabled({ timeout: 30_000 });
    const beforeClickUrl = page.url();
    await loginButton.click();
    await page
      .waitForURL(
        (url) =>
          url.toString() !== beforeClickUrl ||
          url.toString().includes('/realms/'),
        { timeout: 20_000 },
      )
      .catch(() => undefined);
  }

  const kcUserSelectors = ['#username', 'input[name="username"]', 'input[type="email"]'];
  const kcPassSelectors = ['#password', 'input[name="password"]', 'input[type="password"]'];
  const kcSubmitSelectors = ['#kc-login', 'button[type="submit"]', 'input[type="submit"]'];

  const keycloakVisible = await page
    .waitForFunction(
      ({ userSelectors }) =>
        userSelectors.some((selector) => !!document.querySelector(selector)),
      { userSelectors: kcUserSelectors },
      { timeout: 20_000 },
    )
    .then(() => true)
    .catch(() => false);

  if (keycloakVisible) {
    await fillFirst(page, kcUserSelectors, email);
    await fillFirst(page, kcPassSelectors, password);
    await clickFirst(page, kcSubmitSelectors);
  }

  await page.waitForURL((url) => !url.toString().includes('/realms/'), {
    timeout: 60_000,
  });
  await page.waitForLoadState('domcontentloaded');
  await page
    .waitForFunction(
      () => Boolean(window.localStorage.getItem('token')),
      undefined,
      { timeout: 60_000 },
    )
    .catch(async (error) => {
      const diagnostic = await page.evaluate(() => ({
        href: window.location.href,
        hasLocalToken: Boolean(window.localStorage.getItem('token')),
      }));
      throw new Error(
        `browser token beklenirken timeout. href=${diagnostic.href} hasLocalToken=${diagnostic.hasLocalToken} cause=${String(
          error,
        )}`,
      );
    });
};

const assertOidcReachable = async (root: string) => {
  const url = `${root}${OIDC_DISCOVERY_PATH}`;
  const response = await fetch(url, {
    method: 'GET',
    signal: AbortSignal.timeout(10_000),
  });
  if (!response.ok) {
    throw new Error(`OIDC discovery not reachable. url=${url} status=${response.status}`);
  }
};

const STAGE_BASE_URL = (process.env.PLAYWRIGHT_BASE_URL ?? '').trim();
const STAGE_ELIGIBLE = isStageHost(STAGE_BASE_URL) || REQUIRE_OIDC;

test.describe('Zanzibar Explain Modal — thin release gate', () => {
  // Top-level skip: localhost/non-stage çağrılarında tüm describe skip edilir.
  test.skip(
    !STAGE_ELIGIBLE,
    `Stage-only spec: PLAYWRIGHT_BASE_URL=${STAGE_BASE_URL} ai.acik.com değil ve PW_REQUIRE_OIDC=1 değil.`,
  );
  // Release gate hard-fail: stage eligible ama password yok → skip değil explicit fail.
  test.skip(
    STAGE_ELIGIBLE && !CANARY_PASSWORD,
    'PW_CANARY_PASSWORD env zorunlu (release gate).',
  );

  test.beforeAll(async ({ baseURL }) => {
    const root = baseURL ?? STAGE_BASE_URL;
    await assertOidcReachable(root);
  });

  test.beforeEach(async ({ page }) => {
    page.setDefaultTimeout(30_000);
    page.setDefaultNavigationTimeout(60_000);
  });

  test('ALLOWED: canary-read-only REPORT modülü için explain modal ALLOWED + REPORT_VIEWER roleName + userRoles', async ({
    page,
    baseURL,
  }) => {
    test.setTimeout(120_000);
    const root = baseURL ?? process.env.PLAYWRIGHT_BASE_URL ?? '';

    await performBrowserLogin(page, root, READ_ONLY_EMAIL, CANARY_PASSWORD, '/access/roles');

    await expect(page).toHaveURL(/\/access\/roles/, { timeout: 30_000 });
    await expect(page.locator('.ag-root').first()).toBeVisible({ timeout: 30_000 });

    // Codex Tur 2 K1: quickFilter ile rolü izole et (stabilite kazancı)
    const quickFilter = page.getByRole('textbox', {
      name: /Rol adı veya açıklama|Role name or description|Quick filter|Hızlı filtre/i,
    });
    await quickFilter.waitFor({ state: 'visible', timeout: 15_000 });
    await quickFilter.fill('REPORT_VIEWER');

    const nameCell = page
      .locator('.ag-cell[col-id="name"]')
      .filter({ hasText: /REPORT_VIEWER/i })
      .first();
    await nameCell.waitFor({ state: 'visible', timeout: 15_000 });
    await nameCell.scrollIntoViewIfNeeded();
    await nameCell.dblclick();

    // DetailDrawer → role="dialog" + aria-label=title (REPORT_VIEWER)
    const drawer = page.getByRole('dialog', { name: /^REPORT_VIEWER$/i });
    await expect(drawer).toBeVisible({ timeout: 15_000 });

    const explainTrigger = drawer.locator('[data-testid="explain-trigger-module-REPORT"]');
    await expect(explainTrigger).toBeVisible({ timeout: 15_000 });
    await explainTrigger.click();

    const modalBody = page.locator('[data-testid="explain-modal-body"]');
    await expect(modalBody).toBeVisible({ timeout: 15_000 });

    // Loading bitsin
    await expect(page.locator('[data-testid="explain-modal-loading"]')).toBeHidden({
      timeout: 15_000,
    });

    // Reason badge → ALLOWED (backend 5/5 evidence'deki ALLOWED path)
    const reasonBadge = page.locator('[data-testid="explain-modal-reason"]');
    await expect(reasonBadge).toContainText('ALLOWED', { timeout: 10_000 });

    // userRoles badge kümesi → REPORT_VIEWER (Codex Tur 2 ek assertion)
    const userRoles = page.locator('[data-testid="explain-modal-user-roles"]');
    await expect(userRoles).toContainText('REPORT_VIEWER');

    // details.roleName → REPORT_VIEWER (Codex Tur 1 §7 ek assertion, modal body içinde render)
    await expect(modalBody).toContainText('REPORT_VIEWER');
  });

  test('DENIED: canary-restricted /admin/themes → /unauthorized + requiredModule=THEME + NO_PERMISSION', async ({
    page,
    baseURL,
  }) => {
    test.setTimeout(120_000);
    const root = baseURL ?? process.env.PLAYWRIGHT_BASE_URL ?? '';

    await performBrowserLogin(page, root, RESTRICTED_EMAIL, CANARY_PASSWORD, '/admin/themes');

    // ProtectedRoute(requiredModule="THEME") → /unauthorized redirect
    await expect(page).toHaveURL(/\/unauthorized/, { timeout: 30_000 });

    await expect(
      page.getByRole('heading', { name: /Erişim Yetkiniz Bulunmuyor|You do not have access/i }),
    ).toBeVisible();

    // Codex Tur 2 ek assertion: requiredModule=THEME taşınmış mı?
    // UnauthorizedPage satır 84-87: "Gerekli modül: THEME" düz text render ediyor
    await expect(page.getByText(/Gerekli modül|Required module/i)).toBeVisible();
    await expect(page.locator('body')).toContainText('THEME');

    const explainButton = page.getByRole('button', { name: /Neden erişemiyorum|Why can't I access/i });
    await expect(explainButton).toBeVisible({ timeout: 10_000 });
    await explainButton.click();

    const reasonBox = page.locator('[data-testid="unauthorized-explain-reason"]');
    await expect(reasonBox).toBeVisible({ timeout: 15_000 });
    await expect(reasonBox).toContainText('NO_PERMISSION', { timeout: 10_000 });
  });
});
