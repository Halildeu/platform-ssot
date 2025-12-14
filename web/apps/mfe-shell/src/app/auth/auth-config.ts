import type { UserProfile } from '@mfe/shared-types';

export type AuthMode = 'keycloak' | 'permitAll';

type KeycloakConfig = {
  url: string;
  realm: string;
  clientId: string;
  silentCheckSsoRedirectUri: string;
};

type FakeAuthProfile = Pick<UserProfile, 'email' | 'fullName' | 'displayName' | 'role' | 'permissions'>;

export type AuthConfig = {
  mode: AuthMode;
  keycloak: KeycloakConfig;
  enableFakeAuth: boolean;
  fakeUser: FakeAuthProfile;
};

const getEnvValue = (key: string): string | undefined => {
  if (typeof process !== 'undefined' && typeof process.env?.[key] === 'string') {
    return process.env[key];
  }
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
  if (typeof window !== 'undefined' && window.location?.origin) {
    return `${window.location.origin}/silent-check-sso.html`;
  }
  return 'http://localhost:3000/silent-check-sso.html';
};

const authMode = resolveAuthMode();

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
  silentCheckSsoRedirectUri: resolveSilentCheckUri(),
};

const fakeProfile: FakeAuthProfile = {
  email: getEnvValue('VITE_FAKE_AUTH_EMAIL') ?? 'dev.shell@example.com',
  fullName: getEnvValue('VITE_FAKE_AUTH_NAME') ?? 'Dev Mode Kullanıcısı',
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
