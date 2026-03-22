import type { UserProfile } from '@mfe/shared-types';

export type AuthMode = 'keycloak' | 'permitAll';

type KeycloakConfig = {
  url: string;
  realm: string;
  clientId: string;
  appPublicOrigin: string;
  silentCheckSsoRedirectUri: string;
  enableSilentCheckSso: boolean;
};

type FakeAuthProfile = Pick<UserProfile, 'email' | 'fullName' | 'displayName' | 'role' | 'permissions'>;

export type AuthConfig = {
  mode: AuthMode;
  keycloak: KeycloakConfig;
  enableFakeAuth: boolean;
  fakeUser: FakeAuthProfile;
};

/**
 * Read environment values from webpack DefinePlugin or window.__env__.
 *
 * IMPORTANT: webpack DefinePlugin does static string replacement at compile time.
 * `process.env[key]` (dynamic access) is NOT replaced — only `process.env.KEY`
 * (static access) gets replaced. We build a static lookup map so DefinePlugin
 * can replace each value correctly.
 */
const getEnvValue = (key: string): string | undefined => {
  // Static map — DefinePlugin replaces these at compile time
  const staticEnv: Record<string, string | undefined> = {
    NODE_ENV: process.env.NODE_ENV,
    AUTH_MODE: process.env.AUTH_MODE,
    VITE_AUTH_MODE: process.env.VITE_AUTH_MODE,
    VITE_KEYCLOAK_URL: process.env.VITE_KEYCLOAK_URL,
    KEYCLOAK_URL: process.env.KEYCLOAK_URL,
    VITE_KEYCLOAK_REALM: process.env.VITE_KEYCLOAK_REALM,
    KEYCLOAK_REALM: process.env.KEYCLOAK_REALM,
    VITE_KEYCLOAK_CLIENT_ID: process.env.VITE_KEYCLOAK_CLIENT_ID,
    KEYCLOAK_CLIENT_ID: process.env.KEYCLOAK_CLIENT_ID,
    VITE_ENABLE_FAKE_AUTH: process.env.VITE_ENABLE_FAKE_AUTH,
    VITE_FRONTEND_PUBLIC_ORIGIN: process.env.VITE_FRONTEND_PUBLIC_ORIGIN,
    FRONTEND_PUBLIC_ORIGIN: process.env.FRONTEND_PUBLIC_ORIGIN,
    VITE_APP_PUBLIC_ORIGIN: process.env.VITE_APP_PUBLIC_ORIGIN,
    APP_PUBLIC_ORIGIN: process.env.APP_PUBLIC_ORIGIN,
    VITE_KEYCLOAK_SILENT_CHECK_URI: process.env.VITE_KEYCLOAK_SILENT_CHECK_URI,
    VITE_KEYCLOAK_ENABLE_SILENT_CHECK_SSO: process.env.VITE_KEYCLOAK_ENABLE_SILENT_CHECK_SSO,
    KEYCLOAK_ENABLE_SILENT_CHECK_SSO: process.env.KEYCLOAK_ENABLE_SILENT_CHECK_SSO,
    SHELL_SKIP_REMOTE_SERVICES: process.env.SHELL_SKIP_REMOTE_SERVICES,
    SHELL_ENABLE_SUGGESTIONS_REMOTE: process.env.SHELL_ENABLE_SUGGESTIONS_REMOTE,
    SHELL_ENABLE_ETHIC_REMOTE: process.env.SHELL_ENABLE_ETHIC_REMOTE,
  };

  const fromStatic = staticEnv[key];
  if (typeof fromStatic === 'string' && fromStatic.length > 0) {
    return fromStatic;
  }

  // Runtime fallback: window.__env__ (for runtime config injection)
  if (typeof window !== 'undefined') {
    const win = window as Window & {
      __env__?: Record<string, string | undefined>;
      __ENV__?: Record<string, string | undefined>;
    };
    const candidate = win.__env__?.[key] ?? win.__ENV__?.[key];
    if (typeof candidate === 'string') {
      return candidate;
    }
  }
  return undefined;
};

const parseBoolean = (value: string | undefined): boolean => {
  if (!value) {
    return false;
  }
  const normalized = value.trim().toLowerCase();
  return normalized === 'true' || normalized === '1' || normalized === 'yes' || normalized === 'on';
};

const parseList = (value: string | undefined, fallback: string[]): string[] => {
  if (!value) {
    return fallback;
  }
  return value
    .split(',')
    .map((part) => part.trim())
    .filter((part) => part.length > 0);
};

const LOCAL_ALLOWED_APP_ORIGINS = new Set([
  'http://localhost:3000',
  'http://127.0.0.1:3000',
]);

const normalizeOrigin = (value: string): string => value.trim().replace(/\/+$/, '');

const isLocalAppOrigin = (origin: string): boolean =>
  origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:');

const resolveAppPublicOrigin = (): string => {
  const fromEnv =
    getEnvValue('VITE_FRONTEND_PUBLIC_ORIGIN') ??
    getEnvValue('FRONTEND_PUBLIC_ORIGIN') ??
    getEnvValue('VITE_APP_PUBLIC_ORIGIN') ??
    getEnvValue('APP_PUBLIC_ORIGIN');
  if (fromEnv) {
    return normalizeOrigin(fromEnv);
  }
  if (typeof window !== 'undefined' && window.location?.origin) {
    const currentOrigin = normalizeOrigin(window.location.origin);
    if (LOCAL_ALLOWED_APP_ORIGINS.has(currentOrigin)) {
      return currentOrigin;
    }
    if (currentOrigin.startsWith('https://')) {
      return currentOrigin;
    }
  }
  return 'http://localhost:3000';
};

const normalizeRedirectPath = (value: string | undefined): string => {
  if (!value) {
    return '/';
  }
  if (value.startsWith('/')) {
    return value;
  }
  try {
    const parsed = new URL(value, resolveAppPublicOrigin());
    return `${parsed.pathname}${parsed.search}${parsed.hash}` || '/';
  } catch {
    return '/';
  }
};

export const buildAppRedirectUri = (value?: string): string =>
  `${resolveAppPublicOrigin()}${normalizeRedirectPath(value)}`;

const resolveAuthMode = (): AuthMode => {
  const raw = getEnvValue('VITE_AUTH_MODE') ?? getEnvValue('AUTH_MODE');
  if (raw && raw.toLowerCase() === 'permitall') {
    return 'permitAll';
  }
  return 'keycloak';
};

const resolveSilentCheckUri = (): string => {
  const fromEnv = getEnvValue('VITE_KEYCLOAK_SILENT_CHECK_URI');
  if (fromEnv) {
    return fromEnv;
  }
  return `${resolveAppPublicOrigin()}/silent-check-sso.html`;
};

const resolveSilentCheckEnabled = (appPublicOrigin: string): boolean => {
  const fromEnv =
    getEnvValue('VITE_KEYCLOAK_ENABLE_SILENT_CHECK_SSO') ??
    getEnvValue('KEYCLOAK_ENABLE_SILENT_CHECK_SSO');
  if (typeof fromEnv === 'string' && fromEnv.trim().length > 0) {
    return parseBoolean(fromEnv);
  }
  // Local development oturumu zaten token/user snapshot'i ile restore ediliyor.
  // check-sso localde gereksiz iframe warning'i urettigi icin default'u kapali
  // tutuyoruz; ihtiyac halinde env ile tekrar acilabilir.
  return !isLocalAppOrigin(appPublicOrigin);
};

const authMode = resolveAuthMode();

const appPublicOrigin = resolveAppPublicOrigin();

const keycloakConfig: KeycloakConfig = {
  url:
    getEnvValue('VITE_KEYCLOAK_URL') ??
    getEnvValue('KEYCLOAK_URL') ??
    'http://localhost:8081',
  realm:
    getEnvValue('VITE_KEYCLOAK_REALM') ??
    getEnvValue('KEYCLOAK_REALM') ??
    'serban',
  clientId:
    getEnvValue('VITE_KEYCLOAK_CLIENT_ID') ??
    getEnvValue('KEYCLOAK_CLIENT_ID') ??
    'frontend',
  appPublicOrigin,
  silentCheckSsoRedirectUri: resolveSilentCheckUri(),
  enableSilentCheckSso: resolveSilentCheckEnabled(appPublicOrigin),
};

const fakeProfile: FakeAuthProfile = {
  email: getEnvValue('VITE_FAKE_AUTH_EMAIL') ?? 'dev.shell@example.com',
  fullName: getEnvValue('VITE_FAKE_AUTH_NAME') ?? 'Dev Mode User',
  displayName: getEnvValue('VITE_FAKE_AUTH_DISPLAY') ?? 'Dev User',
  role: getEnvValue('VITE_FAKE_AUTH_ROLE') ?? 'ADMIN',
  permissions: parseList(getEnvValue('VITE_FAKE_AUTH_PERMISSIONS'), ['ADMIN']),
};

const enableFakeAuth =
  authMode === 'permitAll' &&
  parseBoolean(getEnvValue('VITE_ENABLE_FAKE_AUTH')) &&
  (typeof process === 'undefined' || process.env?.NODE_ENV !== 'production');

export const authConfig: AuthConfig = {
  mode: authMode,
  keycloak: keycloakConfig,
  enableFakeAuth,
  fakeUser: fakeProfile,
};

export const isPermitAllMode = (): boolean => authConfig.mode === 'permitAll';
export const isKeycloakMode = (): boolean => authConfig.mode === 'keycloak';
