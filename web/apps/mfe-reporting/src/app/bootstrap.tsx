import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import ReportingApp from './reporting/ReportingApp';
import { configureShellServices } from './services/shell-services';

const container = document.getElementById('root');

if (container) {
  configureShellServices({});
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <BrowserRouter>
        <ReportingApp />
      </BrowserRouter>
    </React.StrictMode>,
  );
}
