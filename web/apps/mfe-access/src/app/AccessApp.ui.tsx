import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import RolesPage from '../pages/roles/RolesPage.ui';

/**
 * AccessApp — MF remote entry component.
 *
 * Wraps AccessPage with its own QueryClientProvider because MF dev mode
 * runs each remote in a separate Vite server → React context from shell's
 * @tanstack/react-query instance is not accessible here.
 *
 * Uses shell's QueryClient via window bridge if available (production),
 * otherwise creates a standalone instance (dev / independent mode).
 */

class AccessAppErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): { hasError: boolean } {
    return { hasError: true };
  }

  componentDidCatch(error: unknown, info: React.ErrorInfo) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('[AccessApp] Unhandled error yakalandı', error, info.componentStack);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 24 }}>
          <h2>Erişim modülü yüklenirken beklenmeyen bir hata oluştu.</h2>
          <p>Lütfen sayfayı yenileyin. Sorun devam ederse sistem yöneticinizle iletişime geçin.</p>
        </div>
      );
    }
    return this.props.children;
  }
}

const AccessApp: React.FC = () => {
  const shellQueryClient = (typeof window !== 'undefined'
    ? (window as Record<string, unknown>).__SHELL_QUERY_CLIENT__
    : undefined) as QueryClient | undefined;

  const queryClientRef = React.useRef<QueryClient>();
  if (!shellQueryClient && !queryClientRef.current) {
    queryClientRef.current = new QueryClient({
      defaultOptions: {
        queries: { staleTime: 5 * 60 * 1000, retry: 1 },
      },
    });
  }
  const effectiveQueryClient = shellQueryClient ?? queryClientRef.current!;

  return (
    <QueryClientProvider client={effectiveQueryClient}>
      <AccessAppErrorBoundary>
        <RolesPage />
      </AccessAppErrorBoundary>
    </QueryClientProvider>
  );
};

export default AccessApp;
