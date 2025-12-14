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
  if (tokenCache === token) {
    return;
  }
  tokenCache = token ?? null;
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
    unsubscribeAuthSource = init.subscribeAuthToken((token) => emitTokenChange(token, true));
  } else {
    emitTokenChange(getAuthTokenImpl(), true);
  }
};

export const getShellServices = (): ShellServices => {
  const targetQueryClient = queryClientRef;
  if (!targetQueryClient) {
    if (process.env.NODE_ENV !== 'production') {
      if (!fallbackQueryClient) {
        fallbackQueryClient = new QueryClient();
      }
      console.warn('[shell] Shell servisleri henüz konfigüre edilmedi; fallback noop döndürülüyor.');
      return createShellServices(fallbackQueryClient);
    }
    throw new Error('[shell] configureShellServices önce çağrılmalıdır.');
  }
  return createShellServices(targetQueryClient);
};

export const shellServicesContract = contract;

function createShellServices(queryClient: QueryClient | null): ShellServices {
  return {
    auth: {
      getToken: () => tokenCache ?? getAuthTokenImpl() ?? null,
      onTokenChange: (listener: AuthListener) => {
        authListeners.add(listener);
        listener(tokenCache ?? getAuthTokenImpl() ?? null);
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
