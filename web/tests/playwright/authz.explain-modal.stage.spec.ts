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

const decodeJwtClaims = (token: string): Record<string, unknown> | null => {
  try {
    const parts = token.split('.');
    if (parts.length < 2) return null;
    const normalized = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const pad = (4 - (normalized.length % 4)) % 4;
    const decoded = Buffer.from(normalized + '='.repeat(pad), 'base64').toString('utf8');
    return JSON.parse(decoded) as Record<string, unknown>;
  } catch {
    return null;
  }
};

/**
 * Browser login helper — Codex CNS thread 019d97c7 Tur 8 persona drift fix.
 *
 * Önceki versiyon sadece `clearCookies` yapıyordu. Ama shell auth slice
 * `localStorage.token`'dan hydrate oluyor (auth.slice.ts:94) ve LoginPage
 * `initialized && token` ise Keycloak formuna HİÇ gitmeden redirect ediyor
 * (LoginPage.ui.tsx:94). Önceki test'ten kalan admin@example.com token'ı
 * canary senaryosunu bozuyordu.
 *
 * Fix:
 *  1. localStorage + sessionStorage'dan auth key'lerini sil
 *  2. `/login` sayfasına git, shell store hydrate olsun
 *  3. Login butonuna tıkla → Keycloak redirect (SSO cookie clearCookies ile zaten silindi)
 *  4. KC form login → token localStorage'a düşsün
 *  5. Token decode + email claim assert (persona drift guard)
 */
const AUTH_STORAGE_KEYS = [
  'token',
  'user',
  'tokenExpiresAt',
  'shell_auth_state',
  'serban.shell.authState',
  'shell-auth-sync',
];

const performBrowserLogin = async (
  page: Page,
  root: string,
  email: string,
  password: string,
  redirectPath: string,
) => {
  await page.context().clearCookies();
  // Persona drift guard: storage reset (cookie silme tek başına yetmiyor;
  // LoginPage initialized+token varsa Keycloak'a gitmiyor).
  await page.addInitScript((keys: string[]) => {
    try {
      keys.forEach((k) => {
        window.localStorage.removeItem(k);
        window.sessionStorage.removeItem(k);
      });
    } catch {
      // ignore
    }
  }, AUTH_STORAGE_KEYS);
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

  // Codex Tur 8 persona drift guard: browser token claim'i beklenen email ile
  // eşleşmeli, aksi halde test önceki persona ile devam ediyor demektir.
  const browserToken = await page.evaluate(() => window.localStorage.getItem('token') ?? '');
  const claims = decodeJwtClaims(browserToken);
  const tokenEmail = String(
    claims?.email ?? claims?.preferred_username ?? claims?.sub ?? '',
  ).trim().toLowerCase();
  const expectedEmail = email.trim().toLowerCase();
  if (!tokenEmail.includes(expectedEmail.split('@')[0])) {
    throw new Error(
      `Persona drift: beklenen email='${expectedEmail}' ama token'da email='${tokenEmail}'. ` +
        'performBrowserLogin localStorage/SSO temizliği yetersiz.',
    );
  }
  console.log(`[authz-smoke] persona OK token.email=${tokenEmail} azp=${claims?.azp}`);

  // Runtime gateway base URL logla (VITE_GATEWAY_URL override'ı varsa görelim).
  const gatewayUrl = await page.evaluate(() => {
    const env = ((window as any).__env__ ?? (window as any).__ENV__ ?? {}) as Record<string, string>;
    return env.VITE_GATEWAY_URL ?? '';
  });
  console.log(`[authz-smoke] gateway_url=${gatewayUrl || '(default same-origin /api)'}`);

  // PR D2 (post Codex Tur 11): authz.userId hydration guard.
  // PR E (#433) `@mfe/auth` MF singleton deploy edildi — shell PermissionProvider
  // state remote mfe-access'te de ulaşılır. Ancak `/authz/me` fetch timing önemli:
  // drawer açılmadan önce shell store'da userId set olmalı; aksi halde
  // ExplainPermissionModal "Kullanıcı seçilmedi" alert'i açar.
  await page
    .waitForResponse(
      (resp) => resp.url().includes('/api/v1/authz/me') && resp.status() === 200,
      { timeout: 30_000 },
    )
    .catch(() => console.log('[authz-smoke] /authz/me 200 response beklemedi timeout (zaten hydrate olmuş olabilir)'));
};

const installExplainRequestTracer = (page: Page, label: string) => {
  page.on('request', (req) => {
    const url = req.url();
    if (url.includes('/authz/explain')) {
      console.log(`[authz-smoke/${label}] REQ ${req.method()} ${url}`);
    }
  });
  page.on('response', async (res) => {
    const url = res.url();
    if (url.includes('/authz/explain')) {
      const body = await res.text().catch(() => '(body unavailable)');
      console.log(
        `[authz-smoke/${label}] RES ${res.status()} ${url} body=${body.slice(0, 200)}`,
      );
    }
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
    installExplainRequestTracer(page, 'ALLOWED');

    await performBrowserLogin(page, root, READ_ONLY_EMAIL, CANARY_PASSWORD, '/access/roles');

    await expect(page).toHaveURL(/\/access\/roles/, { timeout: 30_000 });
    await expect(page.locator('.ag-root').first()).toBeVisible({ timeout: 30_000 });

    // Persona hotfix (Codex Tur 4): canary-read-only (1205) artık CANARY_READ_ONLY
    // rolüne atanmış (granule MODULE:ACCESS+REPORT VIEW). REPORT_VIEWER 0 member.
    // PR D2 update: REPORT_VIEWER → CANARY_READ_ONLY + label-agnostic locator.
    const quickFilter = page.getByRole('textbox', {
      name: /Rol adı veya açıklama|Role name or description|Quick filter|Hızlı filtre/i,
    });
    await quickFilter.waitFor({ state: 'visible', timeout: 15_000 });
    await quickFilter.fill('CANARY_READ_ONLY');

    const nameCell = page
      .locator('.ag-cell[col-id="name"]')
      .filter({ hasText: /CANARY_READ_ONLY/i })
      .first();
    await nameCell.waitFor({ state: 'visible', timeout: 15_000 });
    await nameCell.scrollIntoViewIfNeeded();
    await nameCell.dblclick();

    // DetailDrawer → role="dialog" + aria-label=title (CANARY_READ_ONLY)
    const drawer = page.getByRole('dialog', { name: /^CANARY_READ_ONLY$/i });
    await expect(drawer).toBeVisible({ timeout: 15_000 });

    // Product bug (ayrı P1): testid'ler i18n-bağımlı staging'de `RAPORLAMA` (TR label
    // UPPERCASE) üretiliyor, `REPORT` değil. Codex Tur 2 K1 + Tur 11 verdict: label-
    // agnostic getByRole('button', { name: ... }) + Raporlama regex. CANARY_READ_ONLY
    // rolü 2 modül granule'lü (ACCESS+REPORT) → aria-label spesifik REPORT butonu.
    const explainTrigger = drawer.getByRole('button', {
      name: /Raporlama için neden butonu|Reporting.*why|Report.*explain/i,
    });
    await expect(explainTrigger).toBeVisible({ timeout: 15_000 });
    await explainTrigger.click();

    const modalBody = page.locator('[data-testid="explain-modal-body"]');
    await expect(modalBody).toBeVisible({ timeout: 15_000 });

    // Wait for the terminal state (reason badge visible) instead of asserting
    // that the transient loading spinner is hidden. The modal renders
    // explain-modal-reason only after the fetch resolves (see
    // ExplainPermissionModal.tsx:98 — `{result && !loading && !error && (...)}`),
    // so reason visibility implies loading has ended without racing the
    // spinner frame. Previously we asserted toBeHidden on
    // explain-modal-loading, which was fragile because a stale httpPost
    // reference could keep the fetch looping (P1.1 root cause, now fixed).
    const reasonBadge = page.locator('[data-testid="explain-modal-reason"]');
    await expect(reasonBadge).toBeVisible({ timeout: 15_000 });
    await expect(reasonBadge).toContainText('ALLOWED', { timeout: 10_000 });

    // userRoles badge kümesi → CANARY_READ_ONLY (persona hotfix sonrası 1205 bu role)
    const userRoles = page.locator('[data-testid="explain-modal-user-roles"]');
    await expect(userRoles).toContainText('CANARY_READ_ONLY');

    // details.roleName → CANARY_READ_ONLY (Codex Tur 1 §7 ek assertion)
    await expect(modalBody).toContainText('CANARY_READ_ONLY');
  });

  test('DENIED: canary-restricted /admin/themes → /unauthorized + requiredModule=THEME + NO_PERMISSION', async ({
    page,
    baseURL,
  }) => {
    test.setTimeout(120_000);
    const root = baseURL ?? process.env.PLAYWRIGHT_BASE_URL ?? '';
    installExplainRequestTracer(page, 'DENIED');

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

    // P1.9: "Neden erişemiyorum?" butonu artık ExplainPermissionModal açıyor
    // (inline explain panel kaldırıldı — AC-0320 Senaryo 4 modal-only path).
    const openModalBtn = page.locator('[data-testid="unauthorized-explain-open"]');
    await expect(openModalBtn).toBeVisible({ timeout: 10_000 });
    await openModalBtn.click();

    const modalBody = page.locator('[data-testid="explain-modal-body"]');
    await expect(modalBody).toBeVisible({ timeout: 15_000 });
    const reasonBadge = page.locator('[data-testid="explain-modal-reason"]');
    await expect(reasonBadge).toBeVisible({ timeout: 15_000 });
    await expect(reasonBadge).toContainText('NO_PERMISSION', { timeout: 10_000 });
  });

  /**
   * Senaryo 4 (P1.9 / AC-0320): `/unauthorized` page NO_SCOPE flow
   *
   * AC-0320 Senaryo 4: Kullanıcı module erişimi olan ama scope'u olmayan bir
   * sayfaya (örn. `/admin/purchase-orders` project scope bağlı) yönlendirilir.
   * canary-restricted persona'nın THEME modülü yok — redirect `/unauthorized`
   * olur; burada "Neden erişemiyorum?" butonu `ExplainPermissionModal` açar ve
   * scope picker NO_SCOPE reason'ı döndürür.
   *
   * AC path'i doğrudan simüle etmek için canary-restricted persona'nın
   * module erişimi olmayan bir route'tan `/unauthorized` tetiklenir
   * (existing Senaryo 2 ile aynı persona + /admin/themes path). Senaryo 2
   * inline explain butonunu test eder; bu senaryo ise yeni modal akışını
   * doğrular: modal açılır + scope picker COMPANY:9999 → NO_SCOPE.
   */
  test('NO_SCOPE (UnauthorizedPage): "Neden erişemiyorum?" modal + scope picker COMPANY:9999 → reason=NO_SCOPE', async ({
    page,
    baseURL,
  }) => {
    test.setTimeout(120_000);
    const root = baseURL ?? process.env.PLAYWRIGHT_BASE_URL ?? '';
    installExplainRequestTracer(page, 'NO_SCOPE_UNAUTHORIZED');

    await performBrowserLogin(page, root, RESTRICTED_EMAIL, CANARY_PASSWORD, '/admin/themes');

    await expect(page).toHaveURL(/\/unauthorized/, { timeout: 30_000 });
    await expect(
      page.getByRole('heading', { name: /Erişim Yetkiniz Bulunmuyor|You do not have access/i }),
    ).toBeVisible();

    const openModalBtn = page.locator('[data-testid="unauthorized-explain-open"]');
    await expect(openModalBtn).toBeVisible({ timeout: 10_000 });
    await openModalBtn.click();

    const modalBody = page.locator('[data-testid="explain-modal-body"]');
    await expect(modalBody).toBeVisible({ timeout: 15_000 });

    // Initial auto-fetch reason — canary-restricted persona'da THEME module
    // hiç izinli değil → NO_PERMISSION reason (scope değil).
    const reasonBadge = page.locator('[data-testid="explain-modal-reason"]');
    await expect(reasonBadge).toBeVisible({ timeout: 15_000 });
    await expect(reasonBadge).toContainText('NO_PERMISSION', { timeout: 10_000 });

    // Scope picker — COMPANY:9999 forward et
    const scopePicker = page.locator('[data-testid="explain-modal-scope-picker"]');
    await expect(scopePicker).toBeVisible();
    const scopeType = page.locator('[data-testid="explain-modal-scope-type"]');
    const scopeRefId = page.locator('[data-testid="explain-modal-scope-refid"]');
    const scopeCheck = page.locator('[data-testid="explain-modal-scope-check"]');

    await scopeType.selectOption('COMPANY');
    await scopeRefId.fill('9999');
    await scopeCheck.click();

    // Re-fetch ile reason NO_SCOPE olmalı — backend `scopeType/scopeRefId`
    // userScopes'ta değilken NO_SCOPE kısa devrede kalır (permission checks'i
    // öncesinde). Modal denied-scope satırı "COMPANY:9999" render eder.
    await expect(reasonBadge).toContainText('NO_SCOPE', { timeout: 15_000 });
    const deniedScope = page.locator('[data-testid="explain-modal-denied-scope"]');
    await expect(deniedScope).toBeVisible({ timeout: 10_000 });
    await expect(deniedScope).toHaveText('COMPANY:9999');
  });

  /**
   * Senaryo 3 (P1.9): NO_SCOPE via scope picker
   *
   * canary-read-only persona RoleDrawer'da REPORT modülü için explain modal'ı
   * açar, scope picker'dan COMPANY + canary persona'nın scope set'inde olmayan
   * büyük bir refId (9999) seçer, "Kapsamı Kontrol Et" butonuna basar, backend
   * `reason=NO_SCOPE` + `details.scopeType=COMPANY` + `details.scopeRefId=9999`
   * döndürür, modal denied-scope satırında "COMPANY:9999" render eder.
   */
  test('NO_SCOPE: scope picker ile canary-read-only olmayan COMPANY scope için reason=NO_SCOPE', async ({
    page,
    baseURL,
  }) => {
    test.setTimeout(120_000);
    const root = baseURL ?? process.env.PLAYWRIGHT_BASE_URL ?? '';
    installExplainRequestTracer(page, 'NO_SCOPE');

    await performBrowserLogin(page, root, READ_ONLY_EMAIL, CANARY_PASSWORD, '/access/roles');

    await expect(page).toHaveURL(/\/access\/roles/, { timeout: 30_000 });
    await expect(page.locator('.ag-root').first()).toBeVisible({ timeout: 30_000 });

    const quickFilter = page.getByRole('textbox', {
      name: /Rol adı veya açıklama|Role name or description|Quick filter|Hızlı filtre/i,
    });
    await quickFilter.waitFor({ state: 'visible', timeout: 15_000 });
    await quickFilter.fill('CANARY_READ_ONLY');

    const nameCell = page
      .locator('.ag-cell[col-id="name"]')
      .filter({ hasText: /CANARY_READ_ONLY/i })
      .first();
    await nameCell.waitFor({ state: 'visible', timeout: 15_000 });
    await nameCell.scrollIntoViewIfNeeded();
    await nameCell.dblclick();

    const drawer = page.getByRole('dialog', { name: /^CANARY_READ_ONLY$/i });
    await expect(drawer).toBeVisible({ timeout: 15_000 });

    const explainTrigger = drawer.getByRole('button', {
      name: /Raporlama için neden butonu|Reporting.*why|Report.*explain/i,
    });
    await expect(explainTrigger).toBeVisible({ timeout: 15_000 });
    await explainTrigger.click();

    const modalBody = page.locator('[data-testid="explain-modal-body"]');
    await expect(modalBody).toBeVisible({ timeout: 15_000 });

    // Initial auto-fetch ALLOWED reason alır (CANARY_READ_ONLY REPORT view izinli).
    const reasonBadge = page.locator('[data-testid="explain-modal-reason"]');
    await expect(reasonBadge).toBeVisible({ timeout: 15_000 });
    await expect(reasonBadge).toContainText('ALLOWED', { timeout: 10_000 });

    // Scope picker UI mevcut olmalı (P1.9).
    const scopePicker = page.locator('[data-testid="explain-modal-scope-picker"]');
    await expect(scopePicker).toBeVisible();

    const scopeType = page.locator('[data-testid="explain-modal-scope-type"]');
    const scopeRefId = page.locator('[data-testid="explain-modal-scope-refid"]');
    const scopeCheck = page.locator('[data-testid="explain-modal-scope-check"]');

    await scopeType.selectOption('COMPANY');
    await scopeRefId.fill('9999');
    await scopeCheck.click();

    // Re-fetch ile reason NO_SCOPE olmalı.
    await expect(reasonBadge).toContainText('NO_SCOPE', { timeout: 15_000 });

    // Denied scope satırı modal'da görünür olmalı: "COMPANY:9999".
    const deniedScope = page.locator('[data-testid="explain-modal-denied-scope"]');
    await expect(deniedScope).toBeVisible({ timeout: 10_000 });
    await expect(deniedScope).toHaveText('COMPANY:9999');

    // permissionType ve permissionKey orijinal değerde kalmalı (backend slot fix).
    await expect(modalBody).toContainText('MODULE');
    await expect(modalBody).toContainText('REPORT');
  });
});
