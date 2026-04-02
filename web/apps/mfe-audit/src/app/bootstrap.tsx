import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuditApp } from '../app/components/AuditApp';
import { configureShellServices } from './services/shell-services';

const queryClient = new QueryClient();

configureShellServices({});

const container = document.getElementById('root');

if (container) {
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <AuditApp />
        </QueryClientProvider>
      </BrowserRouter>
    </React.StrictMode>,
  );
}
