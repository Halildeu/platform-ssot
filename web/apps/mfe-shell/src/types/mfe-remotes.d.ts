import type { ApiInstance } from '@mfe/shared-http';
import type { ShellNotificationEntry, ShellTelemetryEvent } from 'mfe_shell/services';

type RemoteShellServices = {
  notify: { push: (entry: ShellNotificationEntry) => void };
  telemetry: { emit: (event: ShellTelemetryEvent) => void };
  http: ApiInstance;
  auth: {
    getToken: () => string | null;
    getUser: () => unknown;
  };
};

declare module 'mfe_access/shell-services' {
  export function configureShellServices(services: RemoteShellServices): void;
}

declare module 'mfe_audit/shell-services' {
  export function configureShellServices(services: RemoteShellServices): void;
}

declare module 'mfe_users/shell-services' {
  export function configureShellServices(services: Partial<RemoteShellServices>): void;
}

declare module 'mfe_reporting/shell-services' {
  export function configureShellServices(services: Partial<RemoteShellServices>): void;
}
