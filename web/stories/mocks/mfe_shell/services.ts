import { QueryClient } from '@tanstack/react-query';

export type ShellTelemetryEvent = {
  type: string;
  payload?: Record<string, unknown>;
  meta?: Record<string, unknown>;
  timestamp?: number;
};

export type ShellNotificationEntry = {
  id?: string;
  message: string;
  description?: string;
  type?: string;
  createdAt?: number;
  meta?: Record<string, unknown>;
};

const queryClient = new QueryClient();

const services = {
  auth: {
    getToken: () => null,
    onTokenChange: (listener: (token: string | null) => void) => {
      listener(null);
      return () => undefined;
    },
  },
  query: queryClient,
  telemetry: {
    emit: (_event: ShellTelemetryEvent) => undefined,
  },
  notify: {
    push: (_entry: ShellNotificationEntry) => undefined,
  },
  featureFlags: {
    isEnabled: (_flag: string) => false,
  },
  contract: {
    name: 'storybook-shell-services-mock',
    version: 1,
  },
};

export const getShellServices = () => services;
