declare module 'mfe_shell/services' {
  import type { QueryClient } from '@tanstack/react-query';

  export interface ShellAuthService {
    getToken(): string | null;
    onTokenChange(listener: (token: string | null) => void): () => void;
  }

  export interface ShellTelemetryService {
    emit(event: { type: string; payload?: Record<string, unknown> }): void;
  }

  export interface ShellNotificationService {
    push(entry: { message: string; description?: string; type?: string }): void;
  }

  export interface ShellServices {
    auth: ShellAuthService;
    telemetry: ShellTelemetryService;
    notify: ShellNotificationService;
    query: QueryClient;
  }

  export function getShellServices(): ShellServices;
}
