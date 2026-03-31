import React from 'react';
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { registerGridVariantsTokenResolver } from '../../lib/grid-variants/variants.api';
import { configureShellServices } from '../services/shell-services';

type ReportingProvidersProps = {
  children: React.ReactNode;
};

export const ReportingProviders: React.FC<ReportingProvidersProps> = ({ children }) => {
  // Shell's QueryClient shared via window bridge (MF loadShare bypass)
  const shellQueryClient = (typeof window !== 'undefined'
    ? (window as Record<string, unknown>).__SHELL_QUERY_CLIENT__
    : undefined) as QueryClient | undefined;
  const fallbackQueryClientRef = React.useRef<QueryClient>();

  React.useEffect(() => {
    let cancelled = false;

    const attachShellServices = async () => {
      try {
        const module = await import('mfe_shell/services');
        if (cancelled) {
          return;
        }
        const services = module.getShellServices();
        configureShellServices(services);
        registerGridVariantsTokenResolver(() => services.auth.getToken());
      } catch {
        if (!cancelled) {
          registerGridVariantsTokenResolver();
        }
      }
    };

    attachShellServices();

    return () => {
      cancelled = true;
      registerGridVariantsTokenResolver();
    };
  }, []);

  if (!shellQueryClient && !fallbackQueryClientRef.current) {
    fallbackQueryClientRef.current = new QueryClient();
  }
  const client = shellQueryClient ?? fallbackQueryClientRef.current!;

  return (
    <QueryClientProvider client={client}>
      {children}
    </QueryClientProvider>
  );
};
