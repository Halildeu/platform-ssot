import React from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { I18nProvider, I18nManager } from 'mfe_shell/i18n';
import { getDictionary } from '@mfe/i18n-dicts';
import AccessApp from './AccessApp.ui';
import { configureShellServices } from './services/shell-services';
import { isRuntimeDev } from './runtime/env';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const manager = new I18nManager({
  initialLocale: 'tr',
  fallbackLocale: 'en',
  defaultNamespace: 'access',
  loadDictionary: async (locale, namespace, etag) => {
    const result = getDictionary(locale, namespace);
    if (!result) {
      return { dictionary: {} };
    }
    if (etag && etag === result.version) {
      return { notModified: true };
    }
    return {
      dictionary: result.dictionary,
      etag: result.version,
    };
  },
});

configureShellServices({});

const container = document.getElementById('root');

if (!container) {
  throw new Error('[mfe-access] root elementi bulunamadı.');
}

const root = createRoot(container);
root.render(
  <QueryClientProvider client={queryClient}>
    <I18nProvider manager={manager}>
      <AccessApp />
    </I18nProvider>
    {isRuntimeDev() ? <ReactQueryDevtools initialIsOpen={false} /> : null}
  </QueryClientProvider>,
);
