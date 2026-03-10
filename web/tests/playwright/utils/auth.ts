import type { Page } from '@playwright/test';

export const JWT_HEADER = 'eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0';
export const JWT_SIGNATURE = 'shell';
const AUTH_CHANNEL_NAME = 'shell-auth';
const SESSION_TTL_MS = 60 * 60 * 1000;
const DEFAULT_AUTH_MODE = 'none';

export interface TestTokenPayload {
  permissions: string[];
  sessionTimeoutMinutes?: number;
  [key: string]: unknown;
}

export interface TestUserProfile {
  id: string;
  fullName: string;
  email: string;
  permissions: string[];
  role: string;
}

export interface TestSession {
  token: string;
  user: TestUserProfile;
}

type TokenCache = {
  token: string;
  expiresAtMs: number;
};

let cachedToken: TokenCache | null = null;

const sanitizeBase64 = (value: string) =>
  value
    .replace(/=+$/, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

export const buildTestToken = (permissions: string[] = []): TestSession => {
  const tokenPayload: TestTokenPayload = {
    permissions,
    sessionTimeoutMinutes: 60,
  };
  const encodedPayload = sanitizeBase64(Buffer.from(JSON.stringify(tokenPayload)).toString('base64'));

  const user: TestUserProfile = {
    id: 'e03-runtime-user',
    fullName: 'Runtime Test User',
    email: 'runtime@test.local',
    permissions,
    role: 'ADMIN',
  };

  return {
    token: `${JWT_HEADER}.${encodedPayload}.${JWT_SIGNATURE}`,
    user,
  };
};

const resolveAuthMode = () => (process.env.PW_AUTH_MODE ?? DEFAULT_AUTH_MODE).trim().toLowerCase();

const readInjectedToken = () => (process.env.PW_TEST_TOKEN ?? '').trim();
const shouldUseFakeAuth = () => (process.env.PW_FAKE_AUTH ?? '').trim() === '1';
const readFakeAuthPermissions = (fallback: string[]) => {
  const raw = (process.env.PW_FAKE_AUTH_PERMISSIONS ?? '').trim();
  if (!raw) return fallback;
  return raw
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean);
};
const installFakeAuthEnv = async (page: Page, permissions: string[]) => {
  const resolvedPermissions = readFakeAuthPermissions(permissions);
  await page.addInitScript(
    ({ nextPermissions }) => {
      const current = (window as Window & { __env__?: Record<string, string>; __ENV__?: Record<string, string> }).__env__ ?? {};
      const merged = {
        ...current,
        VITE_AUTH_MODE: 'permitAll',
        VITE_ENABLE_FAKE_AUTH: '1',
        VITE_FAKE_AUTH_PERMISSIONS: nextPermissions.join(','),
        VITE_FAKE_AUTH_EMAIL: 'runtime@test.local',
        VITE_FAKE_AUTH_NAME: 'Runtime Test User',
        VITE_FAKE_AUTH_DISPLAY: 'Runtime Test User',
        VITE_FAKE_AUTH_ROLE: 'ADMIN',
      };
      (window as Window & { __env__?: Record<string, string>; __ENV__?: Record<string, string> }).__env__ = merged;
      (window as Window & { __env__?: Record<string, string>; __ENV__?: Record<string, string> }).__ENV__ = merged;
    },
    { nextPermissions: resolvedPermissions },
  );
};

const hasTokenEndpointConfig = () => {
  const url = (process.env.KEYCLOAK_TOKEN_URL ?? '').trim();
  const clientId = (process.env.KEYCLOAK_CLIENT_ID ?? '').trim();
  const clientSecret = (process.env.KEYCLOAK_CLIENT_SECRET ?? '').trim();
  return Boolean(url && clientId && clientSecret);
};

const fetchClientCredentialsToken = async (): Promise<string> => {
  if (cachedToken && Date.now() + 30_000 < cachedToken.expiresAtMs) {
    return cachedToken.token;
  }

  const tokenUrl = (process.env.KEYCLOAK_TOKEN_URL ?? '').trim();
  const clientId = (process.env.KEYCLOAK_CLIENT_ID ?? '').trim();
  const clientSecret = (process.env.KEYCLOAK_CLIENT_SECRET ?? '').trim();
  const scope = (process.env.KEYCLOAK_SCOPE ?? 'openid').trim();

  if (!tokenUrl || !clientId || !clientSecret) {
    throw new Error('TOKEN_NOT_PROVIDED');
  }

  const body = new URLSearchParams();
  body.set('grant_type', 'client_credentials');
  body.set('client_id', clientId);
  body.set('client_secret', clientSecret);
  if (scope) body.set('scope', scope);

  const response = await fetch(tokenUrl, {
    method: 'POST',
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
    },
    body: body.toString(),
  });

  let payload: unknown = null;
  try {
    payload = await response.json();
  } catch {
    // ignore
  }

  const accessToken = (payload as { access_token?: unknown } | null)?.access_token;
  if (!response.ok || typeof accessToken !== 'string' || !accessToken.trim()) {
    const status = response.status;
    const errorHint = (payload as { error?: unknown; error_description?: unknown } | null) ?? {};
    const err = String(errorHint.error ?? '').trim();
    const desc = String(errorHint.error_description ?? '').trim();
    const details = [err, desc].filter(Boolean).join(' ');
    throw new Error(details ? `TOKEN_ENDPOINT_FAILED (${status}): ${details}` : `TOKEN_ENDPOINT_FAILED (${status})`);
  }

  const expiresInRaw = (payload as { expires_in?: unknown } | null)?.expires_in;
  const expiresInSec = typeof expiresInRaw === 'number' ? expiresInRaw : Number(expiresInRaw ?? 0);
  const ttlMs = Number.isFinite(expiresInSec) && expiresInSec > 0 ? expiresInSec * 1000 : SESSION_TTL_MS;
  cachedToken = { token: accessToken, expiresAtMs: Date.now() + ttlMs };

  return accessToken;
};

export const buildAuthSession = async (permissions: string[] = []): Promise<TestSession> => {
  const authMode = resolveAuthMode();
  if (authMode !== 'token_injection') {
    return buildTestToken(permissions);
  }

  const injectedToken = readInjectedToken();
  const token = injectedToken || (hasTokenEndpointConfig() ? await fetchClientCredentialsToken() : '');
  if (!token) throw new Error('TOKEN_NOT_PROVIDED');

  return {
    token,
    user: {
      id: 'e03-runtime-user',
      fullName: 'Runtime Test User',
      email: 'runtime@test.local',
      permissions,
      role: 'ADMIN',
    },
  };
};

export const applyAuthState = async (page: Page, session: TestSession, ttlMs: number = SESSION_TTL_MS) => {
  await page.evaluate(
    ([channelName, token, profile, ttl, eventName]) => {
      const payload = { token, profile, expiresAt: Date.now() + ttl };
      if (typeof window.BroadcastChannel === 'function') {
        const channel = new BroadcastChannel(channelName);
        channel.postMessage(payload);
      } else {
        window.dispatchEvent(new CustomEvent(eventName, { detail: payload }));
      }
    },
    [AUTH_CHANNEL_NAME, session.token, session.user, ttlMs, 'shell:set-auth-state'],
  );
};

export const authenticateAndNavigate = async (
  page: Page,
  baseURL: string | undefined,
  targetPath: string,
  permissions: string[],
) => {
  if (shouldUseFakeAuth()) {
    const root = baseURL ?? 'http://localhost:3000';
    await installFakeAuthEnv(page, permissions);
    await page.goto(`${root}${targetPath}`, { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => typeof (window as any).__shellStore !== 'undefined', { timeout: 30_000 });
    return { session: buildTestToken(readFakeAuthPermissions(permissions)), root };
  }
  const session = await buildAuthSession(permissions);
  const root = baseURL ?? 'http://localhost:3000';
  const expiresAt = Date.now() + SESSION_TTL_MS;
  await page.goto(`${root}/login`, { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => typeof (window as any).__shellStore !== 'undefined', { timeout: 30_000 });
  await page.evaluate(
    ({ token, user, ttl, expiresAtMs }) => {
      const store = (window as any).__shellStore;
      if (!store) {
        console.warn('[auth.sync] shell store not available');
        return;
      }
      try {
        window.localStorage.setItem('token', token);
        window.localStorage.setItem('user', JSON.stringify(user));
        window.localStorage.setItem('tokenExpiresAt', String(expiresAtMs));
      } catch {
        // ignore
      }
      store.dispatch({
        type: 'auth/setKeycloakSession',
        payload: {
          token,
          profile: user,
          expiresAt: expiresAtMs,
        },
      });
      store.dispatch({ type: 'auth/setAuthInitialized', payload: true });
    },
    { token: session.token, user: session.user, ttl: SESSION_TTL_MS, expiresAtMs: expiresAt },
  );
  await page.waitForFunction(() => {
    const state = (window as any).__shellStore?.getState?.()?.auth;
    return Boolean(state?.initialized && state?.token);
  }, { timeout: 30_000 });
  await applyAuthState(page, session);
  await page.evaluate((nextPath) => {
    window.history.pushState({}, '', nextPath);
    window.dispatchEvent(new PopStateEvent('popstate'));
  }, targetPath);
  await page.waitForFunction((nextPath) => window.location.pathname === nextPath, targetPath, { timeout: 30_000 });
  await applyAuthState(page, session);
  await page.waitForFunction(() => {
    const state = (window as any).__shellStore?.getState?.()?.auth;
    return Boolean(state?.initialized && state?.token);
  }, { timeout: 30_000 });
  return { session, root };
};
