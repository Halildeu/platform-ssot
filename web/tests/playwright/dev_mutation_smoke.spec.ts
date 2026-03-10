import { test, expect } from '@playwright/test';
import fs from 'node:fs';

type AuditEventWire = {
  id: string | number;
  correlationId?: string | null;
};

type UsersListResponse = {
  items?: Array<{
    id: string | number;
    email: string;
    fullName?: string;
    status?: string;
    enabled?: boolean;
    sessionTimeoutMinutes?: number;
  }>;
};

type UserDetailResponse = {
  id?: string | number;
  email?: string;
  status?: string;
  enabled?: boolean;
  sessionTimeoutMinutes?: number;
};

type RolesListResponse = {
  items?: Array<{
    id: string | number;
    name?: string;
    permissions?: Array<string | number>;
  }>;
};

type RoleDetailResponse = {
  id?: string | number;
  name?: string;
  permissions?: Array<string | number>;
};

type PermissionCatalogItem = {
  id?: string | number;
  code?: string;
};

type PermissionListResponse = {
  items?: PermissionCatalogItem[];
  total?: number;
};

const REPORT_PATH = '/Users/halilkocoglu/Documents/dev/.cache/reports/real_user_mutation_smoke.v1.json';

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const writeReport = (payload: unknown) => {
  fs.writeFileSync(REPORT_PATH, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
};

async function login(page: import('@playwright/test').Page, root: string) {
  await page.goto(`${root}/login`, { waitUntil: 'domcontentloaded' });
  await page.waitForLoadState('networkidle');
  if (page.url().startsWith(`${root}/login`)) {
    const shellLoginButton = page.getByRole('button', { name: /^giriş yap$/i }).first();
    if (await shellLoginButton.isVisible().catch(() => false)) {
      await shellLoginButton.click();
    }
  }
  await page.waitForLoadState('networkidle');
  if (page.url().startsWith('http://localhost:8081')) {
    await page.locator('input[name="username"]').fill('admin@example.com');
    await page.locator('input[name="password"]').fill('admin1234');
    await page.locator('input[type="submit"], button[type="submit"]').click();
  }
  await page.waitForURL((url) => url.toString().startsWith(root) && !url.toString().includes('/login'), {
    timeout: 60_000,
  });
  await page.waitForFunction(() => {
    const state = (window as any).__shellStore?.getState?.()?.auth;
    return Boolean(state?.initialized && state?.token);
  }, { timeout: 30_000 });
}

async function readToken(page: import('@playwright/test').Page): Promise<string> {
  const token = await page.evaluate(() => window.localStorage.getItem('token'));
  if (!token) {
    throw new Error('Token localStorage içinde bulunamadı.');
  }
  return token;
}

async function api<T>(root: string, token: string, path: string, init?: RequestInit): Promise<T> {
  const headers = new Headers(init?.headers ?? {});
  headers.set('authorization', `Bearer ${token}`);
  if (init?.body && !headers.has('content-type')) {
    headers.set('content-type', 'application/json');
  }
  const response = await fetch(`${root}${path}`, {
    ...init,
    headers,
  });
  const text = await response.text();
  if (!response.ok) {
    throw new Error(`API hata ${response.status} ${path}: ${text}`);
  }
  return text ? (JSON.parse(text) as T) : ({} as T);
}

async function waitForUserState(
  root: string,
  token: string,
  email: string,
  predicate: (user: UserDetailResponse) => boolean,
  timeoutMs = 20_000,
) {
  const startedAt = Date.now();
  while (Date.now() - startedAt < timeoutMs) {
    const detail = await api<UserDetailResponse>(
      root,
      token,
      `/api/v1/users/by-email?email=${encodeURIComponent(email)}`,
    );
    if (predicate(detail)) {
      return detail;
    }
    await sleep(500);
  }
  throw new Error(`Kullanıcı durumu beklenen hale gelmedi: ${email}`);
}

async function fetchLatestAuditEvents(root: string, token: string) {
  return api<{ events?: AuditEventWire[] }>(root, token, '/api/audit/events?page=0&size=20');
}

test('real users/access mutation smoke with rollback', async ({ page, baseURL }) => {
  test.setTimeout(240_000);
  const root = baseURL ?? 'http://localhost:3000';
  const report: Record<string, unknown> = {
    startedAt: new Date().toISOString(),
    root,
    console_error_count: 0,
    console_warning_count: 0,
    page_error_count: 0,
    bad_response_count: 0,
    status: 'IN_PROGRESS',
  };
  const consoleErrors: string[] = [];
  const consoleWarnings: string[] = [];
  const pageErrors: string[] = [];
  const badResponses: Array<{ url: string; status: number }> = [];

  page.on('console', (message) => {
    if (message.type() === 'error') {
      consoleErrors.push(message.text());
    } else if (message.type() === 'warning') {
      consoleWarnings.push(message.text());
    }
  });
  page.on('pageerror', (error) => {
    pageErrors.push(String(error));
  });
  page.on('response', (response) => {
    const status = response.status();
    if (status >= 400 && !response.url().includes('/audit/events/live')) {
      badResponses.push({ url: response.url(), status });
    }
  });

  try {
    await login(page, root);
    const token = await readToken(page);

    const users = await api<UsersListResponse>(root, token, '/api/v1/users?page=1&pageSize=20');
    const targetUser = (users.items ?? []).find((item) => item.email && item.email !== 'admin@example.com');
    if (!targetUser) {
      throw new Error('Mutasyon smoke için uygun kullanıcı bulunamadı.');
    }
    const targetUserId = String(targetUser.id);
    const targetUserEmail = targetUser.email;
    const originalUserEnabled =
      typeof targetUser.enabled === 'boolean'
        ? targetUser.enabled
        : String(targetUser.status ?? 'ACTIVE').toUpperCase() === 'ACTIVE';
    const originalUserStatus = originalUserEnabled ? 'ACTIVE' : 'INACTIVE';
    const originalSessionTimeout = Number(targetUser.sessionTimeoutMinutes ?? 15);

    await page.goto(`${root}/admin/users`, { waitUntil: 'domcontentloaded' });
    await expect(page.getByTestId('users-grid-root')).toBeVisible({ timeout: 30_000 });
    await expect(page.getByText(targetUserEmail, { exact: false }).first()).toBeVisible({ timeout: 30_000 });
    await page.getByText(targetUserEmail, { exact: false }).first().dblclick();

    const statusSwitch = page.getByRole('switch').first();
    await expect(statusSwitch).toBeVisible({ timeout: 30_000 });
    const nextEnabled = !originalUserEnabled;
    const toggleResponsePromise = page.waitForResponse((response) =>
      response.url().includes(`/api/v1/users/${encodeURIComponent(targetUserId)}/activation`) && response.request().method() === 'PUT',
    );
    await statusSwitch.click();
    const toggleResponse = await toggleResponsePromise;
    if (!toggleResponse.ok()) {
      throw new Error(`Users status toggle başarısız: ${toggleResponse.status()}`);
    }
    const toggleResponseBody = await toggleResponse.json() as { auditId?: string };
    const usersToggleAuditId = String(toggleResponseBody?.auditId ?? '');
    if (!usersToggleAuditId) {
      throw new Error('Users status toggle için auditId bulunamadı.');
    }

    const toggledUser = await waitForUserState(
      root,
      token,
      targetUserEmail,
      (detail) => Boolean(detail.enabled) === nextEnabled,
    );

    const sessionInput = page.locator('input[type="number"]').first();
    const sessionSaveButton = page.getByRole('button', { name: /kaydet|save/i }).first();
    const updatedSessionTimeout = originalSessionTimeout >= 60 ? originalSessionTimeout - 1 : originalSessionTimeout + 1;
    await sessionInput.fill(String(updatedSessionTimeout));
    await expect(sessionInput).toHaveValue(String(updatedSessionTimeout));
    await expect(sessionSaveButton).toBeEnabled();
    await sessionInput.press('Tab');
    await sessionSaveButton.click();
    const sessionUpdatedUser = await waitForUserState(
      root,
      token,
      targetUserEmail,
      (detail) => Number(detail.sessionTimeoutMinutes ?? 0) === updatedSessionTimeout,
    );

    await api(
      root,
      token,
      `/api/v1/users/${encodeURIComponent(targetUserId)}`,
      {
        method: 'PUT',
        body: JSON.stringify({ sessionTimeoutMinutes: originalSessionTimeout }),
      },
    );
    await waitForUserState(
      root,
      token,
      targetUserEmail,
      (detail) => Number(detail.sessionTimeoutMinutes ?? 0) === originalSessionTimeout,
    );

    await api(
      root,
      token,
      `/api/v1/users/${encodeURIComponent(targetUserId)}/activation`,
      {
        method: 'PUT',
        body: JSON.stringify({ active: originalUserEnabled }),
      },
    );
    await waitForUserState(
      root,
      token,
      targetUserEmail,
      (detail) => Boolean(detail.enabled) === originalUserEnabled,
    );

    report.users = {
      targetUserId,
      targetUserEmail,
      originalStatus: originalUserStatus,
      originalEnabled: originalUserEnabled,
      toggledStatus: toggledUser.enabled === false ? 'INACTIVE' : 'ACTIVE',
      originalSessionTimeout,
      updatedSessionTimeout,
      sessionTimeoutAfterSave: sessionUpdatedUser.sessionTimeoutMinutes,
      auditId: usersToggleAuditId,
      rolledBack: true,
    };

    const roles = await api<RolesListResponse>(root, token, '/api/v1/roles');
    const targetRole = (roles.items ?? []).find((item) => item.id != null);
    if (!targetRole) {
      throw new Error('Mutasyon smoke için uygun rol bulunamadı.');
    }
    const roleId = String(targetRole.id);
    const roleDetail = await api<RoleDetailResponse>(root, token, `/api/v1/roles/${encodeURIComponent(roleId)}`);
    const originalPermissionIds = Array.isArray(roleDetail.permissions) ? roleDetail.permissions.map(String) : [];
    const permissions = await api<PermissionListResponse>(root, token, '/api/v1/permissions');
    const permissionItems = Array.isArray(permissions.items) ? permissions.items : [];
    const permissionToAdd = permissionItems.find((perm) => perm.id != null && !originalPermissionIds.includes(String(perm.id)));
    const permissionToRemove = permissionItems.find((perm) => perm.id != null && originalPermissionIds.includes(String(perm.id)));
    const toggleTarget = permissionToAdd ?? permissionToRemove;
    if (!toggleTarget?.id) {
      throw new Error('Permission save smoke için uygun permission bulunamadı.');
    }
    const chosenPermissionId = String(toggleTarget.id);
    const chosenPermissionCode = String(toggleTarget.code ?? toggleTarget.id);

    await page.goto(`${root}/access/roles`, { waitUntil: 'domcontentloaded' });
    await expect(page.getByText(String(targetRole.name ?? ''), { exact: false }).first()).toBeVisible({ timeout: 30_000 });
    await page.getByText(String(targetRole.name ?? ''), { exact: false }).first().click();
    const permissionCheckbox = page.getByLabel(chosenPermissionCode).first();
    await expect(permissionCheckbox).toBeVisible({ timeout: 30_000 });

    const updateResponsePromise = page.waitForResponse((response) =>
      response.url().includes(`/api/v1/roles/${encodeURIComponent(roleId)}/permissions`) && response.request().method() === 'PUT',
    );
    await permissionCheckbox.click();
    await page.getByRole('button', { name: /kaydet|save/i }).last().click();
    const updateResponse = await updateResponsePromise;
    if (!updateResponse.ok()) {
      throw new Error(`Role permission update başarısız: ${updateResponse.status()}`);
    }
    const updateResponseBody = await updateResponse.json() as { auditId?: string };
    const roleAuditId = String(updateResponseBody?.auditId ?? '');
    if (!roleAuditId) {
      throw new Error('Role permission update için auditId dönmedi.');
    }

    const roleAfterUpdate = await api<RoleDetailResponse>(root, token, `/api/v1/roles/${encodeURIComponent(roleId)}`);
    const updatedPermissionIds = Array.isArray(roleAfterUpdate.permissions) ? roleAfterUpdate.permissions.map(String) : [];
    const expectedHasPermission = !originalPermissionIds.includes(chosenPermissionId);
    if (updatedPermissionIds.includes(chosenPermissionId) !== expectedHasPermission) {
      throw new Error('Role permission update backend durumuna yansımadı.');
    }

    const latestAuditEvents = await fetchLatestAuditEvents(root, token);
    const auditVisibleInApi = Boolean((latestAuditEvents.events ?? []).find((event) =>
      String(event.id) === roleAuditId || String(event.correlationId ?? '') === roleAuditId,
    ));

    await page.goto(`${root}/audit/events?auditId=${encodeURIComponent(roleAuditId)}`, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('.ag-root').first()).toBeVisible({ timeout: 30_000 });
    await page.waitForTimeout(1_500);
    const auditVisibleInUi = await page.getByText(roleAuditId, { exact: false }).first().isVisible().catch(() => false);

    await api(
      root,
      token,
      `/api/v1/roles/${encodeURIComponent(roleId)}/permissions`,
      {
        method: 'PUT',
        body: JSON.stringify({ permissionIds: originalPermissionIds }),
      },
    );
    const roleAfterRollback = await api<RoleDetailResponse>(root, token, `/api/v1/roles/${encodeURIComponent(roleId)}`);
    const rollbackPermissionIds = Array.isArray(roleAfterRollback.permissions)
      ? roleAfterRollback.permissions.map(String).sort()
      : [];
    const originalSorted = [...originalPermissionIds].map(String).sort();
    if (JSON.stringify(rollbackPermissionIds) !== JSON.stringify(originalSorted)) {
      throw new Error('Role permission rollback başarısız.');
    }

    report.access = {
      roleId,
      roleName: targetRole.name,
      toggledPermissionId: chosenPermissionId,
      toggledPermissionCode: chosenPermissionCode,
      auditId: roleAuditId,
      auditVisibleInApi,
      auditVisibleInUi,
      rolledBack: true,
    };

    report.console_error_count = consoleErrors.length;
    report.console_warning_count = consoleWarnings.length;
    report.page_error_count = pageErrors.length;
    report.bad_response_count = badResponses.length;
    report.console_errors = consoleErrors;
    report.console_warnings = consoleWarnings;
    report.page_errors = pageErrors;
    report.bad_responses = badResponses;
    report.status = 'OK';
    report.finishedAt = new Date().toISOString();
    writeReport(report);
  } catch (error) {
    report.console_error_count = consoleErrors.length;
    report.console_warning_count = consoleWarnings.length;
    report.page_error_count = pageErrors.length;
    report.bad_response_count = badResponses.length;
    report.console_errors = consoleErrors;
    report.console_warnings = consoleWarnings;
    report.page_errors = pageErrors;
    report.bad_responses = badResponses;
    report.error = error instanceof Error ? error.message : String(error);
    report.status = 'FAIL';
    report.finishedAt = new Date().toISOString();
    writeReport(report);
    throw error;
  }
});
