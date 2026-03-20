import { QueryClient } from '@tanstack/react-query';
import contract from './contract/shell-services.contract.json';
import { subscribeAuthState } from '../auth/auth-sync';

type AuthListener = (token: string | null) => void;

export type ShellTelemetryEvent = {
  type: string;
  payload?: Record<string, unknown>;
  meta?: Record<string, unknown>;
  timestamp?: number;
};

export type ShellNotificationType = 'success' | 'info' | 'warning' | 'error' | 'loading';

export type ShellNotificationEntry = {
  id?: string;
  message: string;
  description?: string;
  type?: ShellNotificationType;
  priority?: 'normal' | 'high';
  pinned?: boolean;
  createdAt?: number;
  meta?: Record<string, unknown>;
};

export interface ShellAuthService {
  getToken(): string | null;
  onTokenChange(listener: AuthListener): () => void;
}

export interface ShellTelemetryService {
  emit(event: ShellTelemetryEvent): void;
}

export interface ShellNotificationService {
  push(entry: ShellNotificationEntry): void;
}

export interface ShellFeatureFlagService {
  isEnabled(flag: string): boolean;
}

export interface ShellServices {
  auth: ShellAuthService;
  query: QueryClient;
  telemetry: ShellTelemetryService;
  notify: ShellNotificationService;
  featureFlags: ShellFeatureFlagService;
  contract: typeof contract;
}

export type ShellServicesInit = {
  queryClient: QueryClient;
  getAuthToken: () => string | null;
  subscribeAuthToken?: (listener: AuthListener) => () => void;
  notify?: (entry: ShellNotificationEntry) => void;
  telemetry?: (event: ShellTelemetryEvent) => void;
  isFeatureEnabled?: (flag: string) => boolean;
};

const authListeners = new Set<AuthListener>();
let unsubscribeAuthSource: (() => void) | null = null;

let queryClientRef: QueryClient | null = null;
let tokenCache: string | null = null;
let getAuthTokenImpl: () => string | null = () => tokenCache;
let fallbackQueryClient: QueryClient | null = null;
let warnedUnconfigured = false;

const normalizeToken = (token: string | null | undefined): string | null => {
  if (typeof token !== 'string') {
    return null;
  }
  const normalized = token.trim();
  if (!normalized || normalized === 'undefined' || normalized === 'null') {
    return null;
  }
  return normalized;
};

const defaultNotify = (entry: ShellNotificationEntry) => {
  if (process.env.NODE_ENV !== 'production') {
    console.info('[shell:notify]', entry);
  }
};

const defaultTelemetry = (event: ShellTelemetryEvent) => {
  if (process.env.NODE_ENV !== 'production') {
    console.info('[shell:telemetry]', event);
  }
};

let notifyImpl = defaultNotify;
let telemetryImpl = defaultTelemetry;
let featureFlagImpl: (flag: string) => boolean = () => false;

const emitTokenChange = (token: string | null) => {
  const normalizedToken = normalizeToken(token);
  if (tokenCache === normalizedToken) {
    return;
  }
  tokenCache = normalizedToken;
  authListeners.forEach((listener) => listener(tokenCache));
};

subscribeAuthState((payload) => {
  emitTokenChange(payload.token ?? null);
});

export const configureShellServices = (init: ShellServicesInit): void => {
  queryClientRef = init.queryClient;
  getAuthTokenImpl = init.getAuthToken;
  notifyImpl = init.notify ?? defaultNotify;
  telemetryImpl = init.telemetry ?? defaultTelemetry;
  featureFlagImpl = init.isFeatureEnabled ?? (() => false);

  unsubscribeAuthSource?.();
  if (init.subscribeAuthToken) {
    unsubscribeAuthSource = init.subscribeAuthToken((token) => emitTokenChange(token));
  } else {
    emitTokenChange(getAuthTokenImpl());
  }
};

export const getShellServices = (): ShellServices => {
  const targetQueryClient = queryClientRef;
  if (!targetQueryClient) {
    if (process.env.NODE_ENV !== 'production') {
      if (!fallbackQueryClient) {
        fallbackQueryClient = new QueryClient();
      }
      if (!warnedUnconfigured) {
        console.debug('[shell] Shell servisleri henüz konfigüre edilmedi; fallback noop döndürülüyor.');
        warnedUnconfigured = true;
      }
      return createShellServices(fallbackQueryClient);
    }
    throw new Error('[shell] configureShellServices must be called first.');
  }
  return createShellServices(targetQueryClient);
};

export const shellServicesContract = contract;

function createShellServices(queryClient: QueryClient | null): ShellServices {
  return {
    auth: {
      getToken: () => normalizeToken(tokenCache ?? getAuthTokenImpl() ?? null),
      onTokenChange: (listener: AuthListener) => {
        authListeners.add(listener);
        listener(normalizeToken(tokenCache ?? getAuthTokenImpl() ?? null));
        return () => authListeners.delete(listener);
      },
    },
    query: queryClient ?? fallbackQueryClient ?? new QueryClient(),
    telemetry: {
      emit: (event: ShellTelemetryEvent) => {
        const payload: ShellTelemetryEvent = {
          ...event,
          timestamp: event.timestamp ?? Date.now(),
        };
        telemetryImpl(payload);
      },
    },
    notify: {
      push: (entry: ShellNotificationEntry) => {
        const notification: ShellNotificationEntry = {
          ...entry,
          createdAt: entry.createdAt ?? Date.now(),
          type: entry.type ?? 'info',
        };
        notifyImpl(notification);
      },
    },
    featureFlags: {
      isEnabled: (flag: string) => Boolean(featureFlagImpl(flag)),
    },
    contract,
  };
}
