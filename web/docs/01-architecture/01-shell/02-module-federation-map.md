---
title: "Module Federation — React Router Paylaşımı"
status: published
owner: "@team/platform-fe"
last_review: 2025-11-08
tags: ["frontend", "module-federation", "routing"]
---

# React / Router Tekil Paylaşımı (Kalıcı Çözüm)

Host (shell) ve remote (mfe-* uygulamaları) tek bir `react`, `react-dom`, `react-router`, `react-router-dom` kopyasını paylaşmalıdır. Aksi durumda `useNavigate only in a Router` gibi hatalar görülür.

## 1) Webpack 5 — Host (Shell) örnek

```js
// webpack.config.js
const { ModuleFederationPlugin } = require('webpack').container;
const deps = require('./package.json').dependencies;

module.exports = {
  // ...
  plugins: [
    new ModuleFederationPlugin({
      name: 'mfe_shell',
      remotes: {
        mfe_access: 'mfe_access@http://localhost:3005/remoteEntry.js',
        // diğer MF'ler
      },
      shared: {
        react: { singleton: true, requiredVersion: deps.react },
        'react-dom': { singleton: true, requiredVersion: deps['react-dom'] },
        'react-router': { singleton: true, requiredVersion: deps['react-router'] },
        'react-router-dom': { singleton: true, requiredVersion: deps['react-router-dom'] },
      },
    }),
  ],
};
```

### Bu repoda (örnek) shell ayar özeti

Shell (dev): web/apps/mfe-shell/webpack.dev.js

```js
new ModuleFederationPlugin({
  name: 'mfe_shell',
  remotes: {
    mfe_suggestions: 'mfe_suggestions@http://localhost:3001/remoteEntry.js',
    mfe_ethic:       'mfe_ethic@http://localhost:3002/remoteEntry.js',
    mfe_ui_kit:      'mfe_ui_kit@http://localhost:3003/remoteEntry.js',
    mfe_access:      'mfe_access@http://localhost:3005/remoteEntry.js',
    mfe_audit:       'mfe_audit@http://localhost:3006/remoteEntry.js',
    mfe_users:       'mfe_users@http://localhost:3004/remoteEntry.js',
    mfe_reporting:   'mfe_reporting@http://localhost:3007/remoteEntry.js',
  },
  shared: {
    // ...deps,
    react:             { singleton: true, requiredVersion: deps.react },
    'react-dom':       { singleton: true, requiredVersion: deps['react-dom'] },
    'react-router':    { singleton: true, requiredVersion: deps['react-router'] ?? '^6' },
    'react-router-dom':{ singleton: true, requiredVersion: deps['react-router-dom'] },
    // AG Grid ve diğer tekil paylaşımlar burada
  },
})
```

Shell (prod): web/apps/mfe-shell/webpack.prod.js benzer shared bloğu ile çalışır (remote URL’leri path‑bazlıdır).

## 2) Webpack 5 — Remote (mfe-access) örnek

```js
// webpack.config.js
const { ModuleFederationPlugin } = require('webpack').container;
const deps = require('./package.json').dependencies;

module.exports = {
  // ...
  plugins: [
    new ModuleFederationPlugin({
      name: 'mfe_access',
      filename: 'remoteEntry.js',
      exposes: {
        './App': './src/app/AccessApp.ui.tsx',
      },
      shared: {
        react: { singleton: true, requiredVersion: deps.react },
        'react-dom': { singleton: true, requiredVersion: deps['react-dom'] },
        'react-router': { singleton: true, requiredVersion: deps['react-router'] },
        'react-router-dom': { singleton: true, requiredVersion: deps['react-router-dom'] },
      },
    }),
  ],
};
```

### Bu repoda (örnek) access ayar özeti

Remote (dev): web/apps/mfe-access/webpack.dev.js

```js
new ModuleFederationPlugin({
  name: 'mfe_access',
  filename: 'remoteEntry.js',
  remotes: {
    mfe_shell:   'mfe_shell@http://localhost:3000/remoteEntry.js',
    mfe_ui_kit:  'mfe_ui_kit@http://localhost:3003/remoteEntry.js',
  },
  exposes: {
    './AccessApp': './src/app/AccessApp.ui.tsx',
  },
  shared: {
    // ...deps,
    react:             { singleton: true, requiredVersion: deps.react },
    'react-dom':       { singleton: true, requiredVersion: deps['react-dom'] },
    'react-router':    { singleton: true, requiredVersion: '^6' },
    'react-router-dom':{ singleton: true, requiredVersion: '^6' },
    // AG Grid ve antd paylaşımları
  },
})
```

Remote (prod): web/apps/mfe-access/webpack.prod.js benzer shared bloğu ile çalışır.

Not: Bu projede Vite yasaktır. Module Federation için sadece Webpack 5 kullanılır.

## 3) Uygulama Kuralları

- Remote içinde `BrowserRouter`/`MemoryRouter` kullanmayın; Router host’tan gelir.
- Shell, remote’ları tek Router altında mount eder: `/<modul>/*` rota deseni.
- Versiyon hizalaması: `yarn why react-router-dom` / `npm ls react-router-dom` ile tek kopya olduğundan emin olun; `yarn dedupe` / `npm dedupe` uygulayın.

Önemli: Remote uygulamalar Router sarması yapmamalıdır; fallback kullanmayın. Router host (shell) içinde sağlanır.

## 4) Hata Dayanıklılığı

- Shell, MFE mount noktalarını bir `ErrorBoundary` ile sarmalı. UI‑Kit `ErrorBoundary` komponenti kullanılabilir:

```tsx
import { ErrorBoundary } from 'mfe-ui-kit';
<ErrorBoundary>
  <RemoteAccessApp />
  {/* <Route path="/access/*" element={<RemoteAccessApp />} /> */}
</ErrorBoundary>
```

Shell’de ErrorBoundary bileşeni: packages/ui-kit/src/lib/error/ErrorBoundary.tsx

## 5) Geçiş Notu

- MF paylaşımı oturduktan ve doğrulandıktan sonra `apps/mfe-access/src/app/AccessApp.ui.tsx` içindeki geçici `MemoryRouter` fallback’i kaldırın (Router host’tan gelecektir).

## 6) Checklist (tekrar kullanılabilir)

- [ ] Host ve tüm remotelarda `react`, `react-dom`, `react-router`, `react-router-dom` → `singleton: true`
- [ ] Host/remote package.json sürümleri hizalı (örn. `^6.27.0`)
- [ ] `yarn dedupe react react-dom react-router react-router-dom` veya `npm dedupe`
- [ ] Remote’lar Router sarması yapmıyor (BrowserRouter/MemoryRouter yok)
- [ ] Shell tek Router altında remote’ları mount ediyor (`path="/<modul>/*"`)
- [ ] Shell mount noktaları `ErrorBoundary` ile sarılı
- [ ] Doğrulama: `useInRouterContext()` true (remote içinde), “useNavigate yalnız Router içinde” hatası yok

Ek (tüm MFE’ler için önerilen shared bloğu)

```js
shared: {
  react: { singleton: true, requiredVersion: deps.react },
  'react-dom': { singleton: true, requiredVersion: deps['react-dom'] },
  'react-router': { singleton: true, requiredVersion: deps['react-router'] },
  'react-router-dom': { singleton: true, requiredVersion: deps['react-router-dom'] },
}
```

## 7) Sorun Giderme

- “useNavigate yalnız Router içinde” hatası:
  - İki kopya `react-router-dom` yükleniyor olabilir → dedupe ve shared/sürüm kontrolü
  - Remote içinde Router sarması varsa kaldırın
- “Invalid hook call”/“two React copies” uyarısı:
  - `react` ve `react-dom`’un tek kopya olduğundan emin olun (singleton + dedupe)

## 8) Doğrulama Adımları (Hızlı)
- Shell dev’i açın ve `apps/mfe-shell` altında tanımlı route’lardan birine gidin (örn. `/access/roles`).
- Konsolda “useNavigate yalnız Router içinde” veya “Invalid hook call” uyarısı görmüyorsanız MF paylaşımı sağlıklı.
- `useInRouterContext()` değeri remote içinde `true` olmalı (geçici fallback devre dışı kalır).
