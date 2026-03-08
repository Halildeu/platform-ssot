import { QueryClient } from '@tanstack/react-query';

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

type ShellServices = {
  auth: {
    getToken: () => string | null;
    onTokenChange: (listener: (token: string | null) => void) => () => void;
  };
  query: QueryClient;
  telemetry: {
    emit: (event: ShellTelemetryEvent) => void;
  };
  notify: {
    push: (entry: ShellNotificationEntry) => void;
  };
  featureFlags: {
    isEnabled: (flag: string) => boolean;
  };
  contract: {
    contract_id: string;
    version: string;
  };
};

const queryClient = new QueryClient();
const tokenListeners = new Set<(token: string | null) => void>();

const services: ShellServices = {
  auth: {
    getToken: () => null,
    onTokenChange: (listener) => {
      tokenListeners.add(listener);
      listener(null);
      return () => tokenListeners.delete(listener);
    },
  },
  query: queryClient,
  telemetry: {
    emit: (event) => {
      if (process.env.NODE_ENV !== 'production') {
        console.info('[storybook:mfe_shell/services] telemetry', event);
      }
    },
  },
  notify: {
    push: (entry) => {
      if (process.env.NODE_ENV !== 'production') {
        console.info('[storybook:mfe_shell/services] notify', entry);
      }
    },
  },
  featureFlags: {
    isEnabled: () => false,
  },
  contract: {
    contract_id: 'storybook-shell-services-mock',
    version: '1.0',
  },
};

export const configureShellServices = (): void => {};

export const getShellServices = (): ShellServices => services;

export const shellServicesContract = services.contract;
