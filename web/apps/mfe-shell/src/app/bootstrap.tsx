// frontend/mfe-shell/src/bootstrap.tsx
// AG Grid setup delegated to @mfe/design-system (single owner)

import React from 'react';

// Side-effect import: registers all AG Grid modules + license
// This is the SINGLE source of truth for module registration.
// Do NOT register AG Grid modules anywhere else in the monorepo.
import '@mfe/design-system/advanced/data-grid/setup';

import { createRoot } from 'react-dom/client';
import ShellApp from './ShellApp';

const container = document.getElementById('root');
if (!container) {
  throw new Error('Uygulama baslatilamadi: root elementi bulunamadi.');
}
const root = createRoot(container);
root.render(<ShellApp />);
