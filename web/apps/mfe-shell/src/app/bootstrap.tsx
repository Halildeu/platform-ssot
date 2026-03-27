// frontend/mfe-shell/src/bootstrap.tsx
// AG Grid setup delegated to @mfe/design-system (single owner)

import React from 'react';

// Inject build-time env vars into window.__env__ so that
// design-system (separate chunk) can read them at runtime.
// Vite's define config replaces process.env with a JSON object.
if (typeof window !== 'undefined') {
  (window as any).__env__ = {
    ...(window as any).__env__,
    ...((typeof process !== 'undefined' && process.env) || {}),
  };
}

// Side-effect import: registers all AG Grid modules + license
// This is the SINGLE source of truth for module registration.
// Do NOT register AG Grid modules anywhere else in the monorepo.
import '@mfe/design-system/advanced/data-grid/setup';

// Observability: init Sentry early, before React tree mounts
import { initSentry } from '../lib/sentry';
initSentry();

// RUM: Web Vitals collection after Sentry is ready
import { initRUM } from '../lib/rum';
initRUM();

// OpenTelemetry: distributed trace context propagation
import { initOtel } from '../lib/otel';
initOtel();

// Feature flags: runtime kill switches for safe rollout
import { initFeatureFlags } from '../lib/feature-flags';
initFeatureFlags();

// Quiet-green: suppress known non-actionable console noise in development
if (process.env.NODE_ENV === 'development') {
  const KNOWN_NOISE = [
    'AG Grid:',
    'ag-grid',
    'Unknown event handler property',
    'onValueChange',
    'act(...)',
    'ReactDOM.render is no longer supported',
    'Vite CJS',
  ];
  const origWarn = console.warn;
  const origError = console.error;
  console.warn = (...args: unknown[]) => {
    const msg = String(args[0] ?? '');
    if (KNOWN_NOISE.some((n) => msg.includes(n))) return;
    origWarn.apply(console, args);
  };
  console.error = (...args: unknown[]) => {
    const msg = String(args[0] ?? '');
    if (KNOWN_NOISE.some((n) => msg.includes(n))) return;
    origError.apply(console, args);
  };
}

import { createRoot } from 'react-dom/client';
import { setupAgGridLicense } from '@mfe/design-system';
import ShellApp from './ShellApp';

// AG Grid lisansını MFE'ler yüklenmeden önce set et
setupAgGridLicense();

const container = document.getElementById('root');
if (!container) {
  throw new Error('Uygulama baslatilamadi: root elementi bulunamadi.');
}
const root = createRoot(container);
root.render(<ShellApp />);
