import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';
export * from './telemetryClient';

type AuthMode = 'keycloak' | 'permitAll';

type TokenResolver = () => string | null;
type TraceIdResolver = () => string | null;
type UnauthorizedHandler = (error: AxiosError) => void;
type EnvRecord = Record<string, string | undefined>;
type SharedHttpRequestConfig = AxiosRequestConfig & {
  __suppressGlobalForbiddenToast?: boolean;
  __suppressGlobalProfileMissingToast?: boolean;
};

const getEnvValue = (key: string): string | undefined => {
  if (typeof process !== 'undefined' && typeof process.env?.[key] === 'string') {
    return process.env[key];
  }
  if (typeof window !== 'undefined') {
    const win = window as Window & {
      __env__?: EnvRecord;
      __ENV__?: EnvRecord;
    };
    const candidate = win.__env__?.[key] ?? win.__ENV__?.[key];
    if (typeof candidate === 'string') {
      return candidate;
    }
  }
  return undefined;
};

const resolveAuthMode = (): AuthMode => {
  const raw = getEnvValue('VITE_AUTH_MODE') ?? getEnvValue('AUTH_MODE');
  if (raw && raw.toLowerCase() === 'permitall') {
    return 'permitAll';
  }
  return 'keycloak';
};

const trimTrailingSlash = (value: string) => value.replace(/\/+$/, '');

const resolveGatewayBaseUrl = (): string => {
  const fromEnv = getEnvValue('VITE_GATEWAY_URL');
  // Varsayılan olarak, same-origin proxy (/api) kullan.
  // Gerekirse VITE_GATEWAY_URL ile tam gateway URL'si verilebilir.
  const base = fromEnv || '/api';
  return trimTrailingSlash(base);
};

const defaultTokenResolver: TokenResolver = () => null;

const defaultTraceResolver: TraceIdResolver = () => null;

let tokenResolver: TokenResolver = defaultTokenResolver;
let traceResolver: TraceIdResolver = defaultTraceResolver;
let unauthorizedHandler: UnauthorizedHandler | null = null;
let authMode: AuthMode = resolveAuthMode();
let authRedirectInProgress = false;
const PROFILE_MISSING_CODE = 'PROFILE_MISSING';
const GLOBAL_TOAST_DEDUPE_MS = 2_000;
// İlk yüklemede auth init tamamlanmadan gelebilecek 401'leri yutmak için küçük tolerans
const appStartTime = Date.now();
const INITIAL_401_GRACE_MS = 5_000;
let initialUnauthorizedIgnored = false;
let lastGlobalToast: { message: string; at: number } | null = null;

const AUTH_STORAGE_KEYS = ['token', 'user', 'tokenExpiresAt', 'shell_auth_state', 'serban.shell.authState', 'shell-auth-sync'];

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const clearPersistedAuth = () => {
  if (typeof window === 'undefined') {
    return;
  }
  try {
    AUTH_STORAGE_KEYS.forEach((key) => window.localStorage.removeItem(key));
  } catch {
    // ignore
  }
};

const dispatchGlobalToast = (message: string) => {
  const now = Date.now();
  if (
    lastGlobalToast
    && lastGlobalToast.message === message
    && now - lastGlobalToast.at < GLOBAL_TOAST_DEDUPE_MS
  ) {
    return;
  }
  lastGlobalToast = { message, at: now };
  if (typeof window === 'undefined') {
    return;
  }
  try {
    window.dispatchEvent(
      new CustomEvent('app:toast', {
        detail: { type: 'error', text: message },
      }),
    );
  } catch {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('[shared-http] toast dispatch failed', message);
    }
  }
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const redirectToLogin = () => {
  if (typeof window === 'undefined' || authRedirectInProgress) {
    return;
  }
  authRedirectInProgress = true;
  const { location } = window;
  const current =
    `${location.pathname ?? ''}${location.search ?? ''}${location.hash ?? ''}` || '/';
  const isOnLogin = location.pathname?.startsWith('/login');
  const redirect = isOnLogin ? '/' : current;
  const target = `/login?redirect=${encodeURIComponent(redirect)}`;
  location.replace(target);
};

const handleUnauthorized = (reason = 'unauthorized') => {
  if (typeof window === 'undefined') {
    return;
  }
  const hasToken = Boolean(tokenResolver());
  const locationSafe = typeof window !== 'undefined' && window.location ? window.location : null;
  // Eğer henüz token alınmamışsa (ör. sayfa yeni yüklendi, keycloak init bekleniyor),
  // 401 geldiyse login sayfasına zorla yönlendirmeyelim; init tamamlanınca tekrar denenecek.
  if (!hasToken) {
    if (process.env.NODE_ENV !== 'production') {
      console.debug('[LOGIN REDIRECT SKIP]', { reason, path: locationSafe?.pathname ?? 'n/a' });
    }
    return;
  }
  // Sayfa yüklenir yüklenmez gelen ilk 401'leri (muhtemel init yarışı) yut.
  const sinceStart = Date.now() - appStartTime;
  if (!initialUnauthorizedIgnored && sinceStart < INITIAL_401_GRACE_MS) {
    initialUnauthorizedIgnored = true;
    if (process.env.NODE_ENV !== 'production') {
      console.debug('[LOGIN REDIRECT SKIP - GRACE]', { reason, sinceStart });
    }
    return;
  }
  // Önceki davranış redirect+logout idi; artık yalnızca isteği düşürüp handler’a bildiriyoruz.
  if (process.env.NODE_ENV !== 'production') {
    console.debug('[401 HANDLE]', { reason, path: locationSafe?.pathname ?? 'n/a' });
  }
  abortPendingRequests();
};

const handleForbidden = () => {
  dispatchGlobalToast('Bu işlem için yetkiniz bulunmuyor.');
};

const handleProfileMissing = () => {
  dispatchGlobalToast('Profiliniz henüz oluşturulmamış. Lütfen sistem yöneticisiyle iletişime geçin.');
};

const extractErrorCode = (error: AxiosError): string | null => {
  const data = error.response?.data;
  if (!data) {
    return null;
  }
  if (typeof data === 'string') {
    return data;
  }
  if (typeof data === 'object' && data !== null) {
    const structured = data as Record<string, unknown>;
    if (typeof structured.message === 'string') {
      return structured.message;
    }
    if (typeof structured.detail === 'string') {
      return structured.detail;
    }
    if (typeof structured.errorCode === 'string') {
      return structured.errorCode;
    }
    if (typeof structured.title === 'string') {
      return structured.title;
    }
  }
  return null;
};

export const registerAuthTokenResolver = (resolver?: TokenResolver): void => {
  tokenResolver = resolver ?? defaultTokenResolver;
};

export const registerTraceIdResolver = (resolver?: TraceIdResolver): void => {
  traceResolver = resolver ?? defaultTraceResolver;
};

export const registerUnauthorizedHandler = (handler?: UnauthorizedHandler): void => {
  unauthorizedHandler = handler ?? null;
};

export const configureSharedHttp = (config?: { authMode?: AuthMode }): void => {
  if (config?.authMode) {
    authMode = config.authMode;
  }
};

const api = axios.create({
  baseURL: resolveGatewayBaseUrl(),
  withCredentials: false,
});

const ensureHeaders = (config: AxiosRequestConfig) => {
  if (!config.headers) {
    config.headers = {};
  }
  return config.headers;
};

const pendingControllers = new Set<AbortController>();
const requestControllerMap = new WeakMap<AxiosRequestConfig, AbortController>();

const trackPendingRequest = (config: AxiosRequestConfig) => {
  if (typeof AbortController === 'undefined') {
    return;
  }
  if (config.signal) {
    return;
  }
  const controller = new AbortController();
  config.signal = controller.signal;
  requestControllerMap.set(config, controller);
  pendingControllers.add(controller);
};

const releasePendingRequest = (config?: AxiosRequestConfig) => {
  if (!config) {
    return;
  }
  const controller = requestControllerMap.get(config);
  if (!controller) {
    return;
  }
  pendingControllers.delete(controller);
  requestControllerMap.delete(config);
};

const abortPendingRequests = () => {
  pendingControllers.forEach((controller) => {
    try {
      controller.abort();
    } catch {
      // ignore abort errors
    }
  });
  pendingControllers.clear();
};

const isPermitAllMode = () => authMode === 'permitAll';

const installInterceptors = (client: AxiosInstance) => {
  client.interceptors.request.use((config) => {
    trackPendingRequest(config);
    const headers = ensureHeaders(config);
    const token = tokenResolver();
    if (process.env.NODE_ENV !== 'production') {
      try {
        const base = config.baseURL ?? resolveGatewayBaseUrl();
        const path = typeof config.url === 'string' ? config.url : '';
        const prefix = path.startsWith('/') ? '' : '/';
        console.debug(
          `[AUTH DEBUG] url=${trimTrailingSlash(base)}${prefix}${path} method=${config.method ?? 'get'} hasToken=${Boolean(
            token,
          )}`,
        );
      } catch {
        console.debug('[AUTH DEBUG] url=<unknown> method=<unknown> hasToken', Boolean(token));
      }
    }
    if (token && !headers.Authorization) {
      headers.Authorization = `Bearer ${token}`;
    }
    const traceId = traceResolver();
    if (traceId && !headers['X-Trace-Id']) {
      headers['X-Trace-Id'] = traceId;
    }
    return config;
  });

  client.interceptors.response.use(
    (response) => {
      releasePendingRequest(response.config);
      return response;
    },
    (error: AxiosError) => {
      releasePendingRequest(error.config);
      const requestConfig = (error.config ?? {}) as SharedHttpRequestConfig;
      const status = error?.response?.status;
      if (status === 401 && !isPermitAllMode()) {
        handleUnauthorized('http-401');
        unauthorizedHandler?.(error);
        return Promise.reject(error);
      }
      if (status === 403) {
        const errorCode = extractErrorCode(error);
        if (errorCode === PROFILE_MISSING_CODE) {
          if (!requestConfig.__suppressGlobalProfileMissingToast) {
            handleProfileMissing();
          }
        } else {
          if (!requestConfig.__suppressGlobalForbiddenToast) {
            handleForbidden();
          }
        }
        return Promise.reject(error);
      }
      return Promise.reject(error);
    },
  );
};

installInterceptors(api);

export const resolveAuthToken = (): string | null => tokenResolver();
export const resolveTraceId = (): string | null => traceResolver();
export const getGatewayBaseUrl = (): string => api.defaults.baseURL ?? resolveGatewayBaseUrl();

export const conditionalGet = async <T>(
  url: string,
  config?: AxiosRequestConfig & { etag?: string },
) => {
  const { etag, ...rest } = config ?? {};
  const headers = { ...(rest.headers ?? {}) } as Record<string, unknown>;
  if (typeof etag === 'string' && etag.length > 0 && typeof headers['If-None-Match'] !== 'string') {
    headers['If-None-Match'] = etag;
  }
  return api.get<T>(url, {
    ...rest,
    headers: headers as unknown as import('axios').RawAxiosRequestHeaders,
    validateStatus: (status) => (status >= 200 && status < 300) || status === 304,
  });
};

export { api };
export type ApiInstance = typeof api;
export { fetchManifest, fetchPageLayout } from './manifest';
