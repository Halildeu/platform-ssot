// frontend/mfe-shell/src/bootstrap.js dosyasının OLMASI GEREKEN son hali

import React from 'react';
// AG Grid server-side modüllerini shell seviyesinde kaydet
import 'ag-grid-enterprise';
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import { AllEnterpriseModule, ServerSideRowModelModule, ServerSideRowModelApiModule } from 'ag-grid-enterprise';
ModuleRegistry.registerModules([
  AllCommunityModule,
  ServerSideRowModelModule,
  ServerSideRowModelApiModule,
  AllEnterpriseModule,
]);
import { createRoot } from 'react-dom/client';
import ShellApp from './ShellApp.ui';

const container = document.getElementById('root');
if (!container) {
  throw new Error('Uygulama baslatilamadi: root elementi bulunamadi.');
}
const root = createRoot(container);
root.render(<ShellApp />);
