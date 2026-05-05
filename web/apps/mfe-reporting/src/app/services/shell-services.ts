import { api } from '@mfe/shared-http';
import type { ApiInstance } from '@mfe/shared-http';
import type { ShellNotificationEntry, ShellTelemetryEvent } from 'mfe_shell/services';

// In single-domain builds, @mfe/shared-http is NOT shared via Module
// Federation — each remote gets its own copy without the shell's token
// resolver. Add a request interceptor that reads the token from the
// shell's Keycloak instance (attached to window by the shell).
api.interceptors.request.use((config) => {
  if (config.headers?.Authorization) return config;
  // Try shell's Keycloak instance first
  const kc = (window as Record<string, unknown>).__keycloak as { token?: string } | undefined;
  const token = kc?.token;
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export type RemoteShellServices = {
  notify: { push: (entry: ShellNotificationEntry) => void };
  telemetry: { emit: (event: ShellTelemetryEvent) => void };
  http: ApiInstance;
  auth: {
    getToken: () => string | null;
    getUser: () => unknown;
  };
  /**
   * Optional accessor for the active company id (Workcube tenant scope).
   *
   * Reporting MFE injects {@code X-Company-Id} into report API calls when
   * this resolver returns a non-blank value. Source priority is enforced
   * by the host shell — typically: explicit WorkspaceSwitcher selection
   * (persisted to localStorage) → first allowed COMPANY scope from
   * AuthzMe → undefined.
   *
   * Backend contract: header is OPTIONAL when the user has exactly one
   * COMPANY scope (auto-selected server-side). Required for super-admin
   * and multi-company users; missing header → 400.
   */
  getCurrentCompanyId?: () => string | number | null | undefined;
};

const createNoopServices = (): RemoteShellServices => ({
  notify: {
    push: (entry: ShellNotificationEntry) => {
      if (process.env.NODE_ENV !== 'production') {
        console.info('[mfe-reporting] noop notify', entry);
      }
    },
  },
  telemetry: {
    emit: (event: ShellTelemetryEvent) => {
      if (process.env.NODE_ENV !== 'production') {
        console.info('[mfe-reporting] noop telemetry', event);
      }
    },
  },
  http: api,
  auth: {
    getToken: () => null,
    getUser: () => null,
  },
});

let currentServices: RemoteShellServices | null = null;
const fallbackServices = createNoopServices();

export const configureShellServices = (services: Partial<RemoteShellServices>): void => {
  currentServices = {
    notify: services.notify ?? fallbackServices.notify,
    telemetry: services.telemetry ?? fallbackServices.telemetry,
    http: services.http ?? fallbackServices.http,
    auth: services.auth ?? fallbackServices.auth,
    // Optional fields preserved as-is (no fallback) so the absence of a
    // host implementation degrades to the api.ts localStorage fallback
    // instead of being silently overridden.
    getCurrentCompanyId: services.getCurrentCompanyId,
  };
  if (process.env.NODE_ENV !== 'production') {
    console.debug('[mfe-reporting] shell services configured');
  }
};

export const getShellServices = (): RemoteShellServices => {
  if (!currentServices) {
    // Always return fallback instead of throwing — Module Federation
    // shell-services wiring is async, and dashboard components may
    // render before wiring completes. Throwing causes token-less
    // requests (401) on dashboard endpoints.
    console.warn('[mfe-reporting] Shell servisleri henüz konfigüre edilmedi; fallback kullanılacak.');
    return fallbackServices;
  }
  return currentServices;
};
