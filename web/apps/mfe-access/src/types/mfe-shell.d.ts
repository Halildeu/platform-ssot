import type { ApiInstance } from '@mfe/shared-http';

declare module 'mfe_shell/services' {
  export type ShellNotificationType = 'success' | 'info' | 'warning' | 'error' | 'loading';

  export type ShellNotificationEntry = {
    id?: string;
    message: string;
    description?: string;
    type?: ShellNotificationType;
    createdAt?: number;
    meta?: Record<string, unknown>;
  };

  export type ShellTelemetryEvent = {
    type: string;
    payload?: Record<string, unknown>;
    meta?: Record<string, unknown>;
    timestamp?: number;
  };

  export interface ShellNotificationService {
    push(entry: ShellNotificationEntry): void;
  }

  export interface ShellTelemetryService {
    emit(event: ShellTelemetryEvent): void;
  }

  export interface ShellServices {
    notify: ShellNotificationService;
    telemetry: ShellTelemetryService;
    http: ApiInstance;
    auth: {
      getToken: () => string | null;
      getUser: () => unknown;
    };
  }

  export function getShellServices(): ShellServices;
}
