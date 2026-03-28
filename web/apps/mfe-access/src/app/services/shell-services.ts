import {
  api,
  registerAuthTokenResolver,
  registerTraceIdResolver,
  registerUnauthorizedHandler,
} from '@mfe/shared-http';
import type { ApiInstance } from '@mfe/shared-http';
import type { ShellNotificationEntry, ShellTelemetryEvent } from 'mfe_shell/services';
import { isRuntimeDev } from '../runtime/env';

export type RemoteShellServices = {
  notify: { push: (entry: ShellNotificationEntry) => void };
  telemetry: { emit: (event: ShellTelemetryEvent) => void };
  http: ApiInstance;
  auth: {
    getToken: () => string | null;
    getUser: () => unknown;
  };
};

const createNoopServices = (): RemoteShellServices => ({
  notify: {
    push: (entry: ShellNotificationEntry) => {
      if (isRuntimeDev()) {
        console.info('[mfe-access] noop notify', entry);
      }
    },
  },
  telemetry: {
    emit: (event: ShellTelemetryEvent) => {
      if (isRuntimeDev()) {
        console.info('[mfe-access] noop telemetry', event);
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
  };
  // API isteklerinde shell'in token ve trace id'sini kullan
  registerAuthTokenResolver(() => currentServices?.auth.getToken() ?? null);
  registerTraceIdResolver(() => {
    // Trace ID üretimi shell tarafında yapılıyorsa oradan okunur; yoksa null döner
    return null;
  });
  // Unauthorized durumda shell tarafı zaten 401'leri yönetecek; access MFE tarafında ekstra redirect yok
  registerUnauthorizedHandler(() => undefined);
  if (isRuntimeDev()) {
    console.debug('[mfe-access] shell services configured');
  }
};

export const getShellServices = (): RemoteShellServices => {
  if (!currentServices) {
    if (isRuntimeDev()) {
      console.warn('[mfe-access] Shell servisleri henüz konfigüre edilmedi; noop kullanılacak.');
      return fallbackServices;
    }
    throw new Error('[mfe-access] Shell servisleri konfigüre edilmedi.');
  }
  return currentServices;
};
