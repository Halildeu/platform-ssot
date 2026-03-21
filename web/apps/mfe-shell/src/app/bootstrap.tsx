// frontend/mfe-shell/src/bootstrap.tsx
// AG Grid setup delegated to @mfe/design-system (single owner)

import React from 'react';

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

// Feature flags: runtime kill switches for safe rollout
import { initFeatureFlags } from '../lib/feature-flags';
initFeatureFlags();

import { createRoot } from 'react-dom/client';
import ShellApp from './ShellApp';

const container = document.getElementById('root');
if (!container) {
  throw new Error('Uygulama baslatilamadi: root elementi bulunamadi.');
}
const root = createRoot(container);
root.render(<ShellApp />);
