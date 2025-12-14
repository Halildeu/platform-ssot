import React from 'react';
import {
  QueryClient,
  QueryClientProvider,
  QueryClientContext,
} from '@tanstack/react-query';
import { registerGridVariantsTokenResolver } from '../../lib/grid-variants/variants.api';
import { configureShellServices } from '../services/shell-services';

type ReportingProvidersProps = {
  children: React.ReactNode;
};

export const ReportingProviders: React.FC<ReportingProvidersProps> = ({ children }) => {
  const existingQueryClient = React.useContext(QueryClientContext);
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

  if (!existingQueryClient) {
    if (!fallbackQueryClientRef.current) {
      fallbackQueryClientRef.current = new QueryClient();
    }
    return (
      <QueryClientProvider client={fallbackQueryClientRef.current}>
        {children}
      </QueryClientProvider>
    );
  }

  return <>{children}</>;
};
