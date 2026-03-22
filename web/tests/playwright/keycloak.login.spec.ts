import { test, expect } from '@playwright/test';

const KEYCLOAK_URL = 'http://localhost:8081';

async function isKeycloakReachable(): Promise<boolean> {
  try {
    const response = await fetch(KEYCLOAK_URL, {
      method: 'GET',
      signal: AbortSignal.timeout(5_000),
    });
    return response.ok || response.status < 500;
  } catch {
    return false;
  }
}

function isPermitAllMode(): boolean {
  const authMode = (process.env.VITE_AUTH_MODE ?? process.env.AUTH_MODE ?? '').trim().toLowerCase();
  const fakeAuth = (process.env.PW_FAKE_AUTH ?? '').trim();
  return authMode === 'permitall' || fakeAuth === '1';
}

test.describe('Keycloak login flow (QLTY-AUTH-LOGIN-01)', () => {
  const permitAll = isPermitAllMode();

  test.beforeEach(async () => {
    if (!permitAll) {
      const reachable = await isKeycloakReachable();
      test.skip(!reachable, 'Keycloak is not running at localhost:8081 -- skipping login tests');
    }
  });

  test('unauthenticated visit redirects to login', async ({ page, baseURL }) => {
    const root = baseURL ?? 'http://localhost:3000';

    // Navigate without any auth state
    await page.goto(root, { waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('networkidle');

    // Should redirect to /login or a Keycloak URL
    const currentUrl = page.url();
    const redirectedToLogin =
      currentUrl.includes('/login') ||
      currentUrl.includes('/auth/realms') ||
      currentUrl.includes('keycloak') ||
      currentUrl.includes('/realms/');

    expect(
      redirectedToLogin,
      `Expected redirect to login page, but URL is: ${currentUrl}`,
    ).toBeTruthy();
  });

  test('login page renders authentication UI', async ({ page, baseURL }) => {
    const root = baseURL ?? 'http://localhost:3000';

    await page.goto(`${root}/login`, { waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('networkidle');

    // In permitAll mode: dev-mode banner with "Devam Et" or "Geliştirme modunda" text.
    // In normal mode: login heading ("Giriş Yap"), corporate login button, or Keycloak form.
    const loginIndicators = [
      page.getByRole('heading', { name: /Giriş Yap|Login|Sign In/i }),
      page.getByRole('button', { name: /Kurumsal Giriş|Corporate Login|Sign In|Devam Et|Continue/i }),
      page.getByText(/Geliştirme modunda|Development mode|PermitAll/i),
      page.locator('input[type="password"]'),
      page.locator('#kc-form-login'),
      page.locator('[data-testid*="login"]'),
    ];

    // At least one indicator should be visible
    let found = false;
    for (const indicator of loginIndicators) {
      if (await indicator.isVisible({ timeout: 1_000 }).catch(() => false)) {
        found = true;
        break;
      }
    }

    // Final check with longer timeout on the heading (most reliable)
    if (!found) {
      await expect(
        page.getByRole('heading', { name: /Giriş Yap|Login|Sign In/i }),
      ).toBeVisible({ timeout: 10_000 });
    }
  });

  test('Keycloak server is reachable', async () => {
    test.skip(permitAll, 'Running in permitAll mode -- Keycloak not required');

    const response = await fetch(KEYCLOAK_URL, {
      method: 'GET',
      signal: AbortSignal.timeout(10_000),
    });

    // Keycloak should respond (200, 302, or other non-5xx)
    expect(response.status).toBeLessThan(500);
  });
});
