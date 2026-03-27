# Vite Migration Plan v2.0

> **Versiyon:** 2.0 | **Tarih:** 2026-03-27 | **Durum:** DRAFT — Onay bekliyor
> **Risk Seviyesi:** YÜKSEK | **Tahmini Efor:** 3 hafta (POC dahil)
>
> v1.0 → v2.0 değişiklikler: POC kapsamı genişletildi, migration kontratı netleştirildi,
> dev POC / prod cutover ayrıldı, design-system ayrı workstream'e alındı,
> silme adımları production sonrasına taşındı, envanter repo gerçeğine güncellendi.
> v2.0 → v2.1 düzeltmeler: Visual test komutu (`e2e/visual/`), versiyon range'leri eklendi.

---

## 1. Migration Kontratı

> **Bu planın tek bir geçiş modeli vardır. Hybrid/coexistence model yoktur.**

### Kural 1: Big-Bang Cutover
Tüm 7 app **tek bir cutover commit'inde** Webpack'ten Vite'a geçer.
Webpack MF ↔ Vite MF cross-bundler interop desteklenmez.
Batch migration **yalnızca geliştirme sıralamasını** belirler; her batch kendi
başına deploy edilmez.

### Kural 2: Webpack Config'ler Korunur
Webpack config dosyaları cutover commit'ine kadar **silinmez**.
`package.json`'da `start:webpack` script'i production soak test sonrasına kadar kalır.
Rollback = `git revert` + `start:webpack`.

### Kural 3: Design-System Ayrı Workstream
`packages/design-system` zaten **tsup** ile build alıyor.
Vite build'e geçirmek bu planın kapsamında **değildir**.
Design-system webpack config'i (webpack.common.cjs, webpack.dev.cjs) sadece
Storybook/dev-time kullanımdaysa, Vite geçişi gerekmez.

### Kural 4: Dev POC ≠ Prod Cutover
Dev POC'da stub remote'lar kullanılabilir (env flag ile devre dışı bırakma).
Prod cutover'da **tüm remote'lar aktif** olmalıdır. İki aşama ayrı başarı
kriterleri ve ayrı go/no-go kararları taşır.

---

## 2. Doğrulanmış Mevcut Durum

### Mimari

```
┌──────────────────────────────────────────────────────────────────────┐
│                        mfe_shell (3000) — HOST                       │
│  Webpack 5.103.0 + ModuleFederationPlugin                            │
│  Exposes: ./logic, ./services, ./i18n                                │
│  CSS: @tailwindcss/webpack 4.2.2 (index.css) + css-loader (AG Grid)  │
│  Env: DefinePlugin + InjectRuntimeEnv (window.__env__)               │
│  Proxy: 7 kural (keycloak, reports, authz, users, services,         │
│         cockpit, gateway)                                            │
└────────┬─────────┬──────────┬──────────┬──────────┬──────────────────┘
         │         │          │          │          │
  ┌──────▼──┐ ┌────▼───┐ ┌───▼────┐ ┌───▼───┐ ┌───▼─────┐
  │suggest. │ │ ethic  │ │ users  │ │access │ │ audit   │
  │ (3001)  │ │(3002)  │ │(3004)  │ │(3005) │ │ (3006)  │
  │OPSIYONEL│ │OPSIYON.│ │ZORUNLU │ │OPSIYO.│ │OPSIYONEL│
  └─────────┘ └────────┘ └───┬────┘ └───────┘ └─────────┘
                              │
                       ┌──────▼──────┐
                       │ reporting   │
                       │  (3007)     │
                       │  ZORUNLU    │
                       └─────────────┘
```

### App Envanter (repo'dan doğrulanmış)

| App | Port | Exposes | Consumes | Proxy | CSS | Remote Mode |
|-----|------|---------|----------|-------|-----|-------------|
| **mfe-shell** | 3000 | logic, services, i18n | 6 remote | 7 kural | TW4/webpack + css-loader | Host |
| **mfe-suggestions** | 3001 | SuggestionsApp | shell | — | postcss-loader ⚠️ | Opsiyonel (env stub) |
| **mfe-ethic** | 3002 | EthicApp | shell | — | postcss-loader ⚠️ | Opsiyonel (env stub) |
| **mfe-users** | 3004 | UsersApp, shell-services | shell, reporting | 2 kural | css-loader | Zorunlu |
| **mfe-access** | 3005 | AccessApp, shell-services | shell | — | css-loader | Opsiyonel (env stub) |
| **mfe-audit** | 3006 | AuditApp, shell-services | shell (Promise-based ⚠️) | — | css-loader | Opsiyonel (env stub) |
| **mfe-reporting** | 3007 | ReportingApp, grid, shell-services | shell | — | css-loader | Zorunlu |
| **design-system** | — | ./library (tsup build) | — | — | css-loader | **Kapsam dışı** |

⚠️ = Geçiş öncesi düzeltilmesi gereken sorun

### Versiyon Tablosu (doğrulanmış 2026-03-27)

| Paket | Mevcut | Vite 8 Uyumu | Aksiyon |
|-------|--------|--------------|---------|
| Node.js | 22.22.2 | ✅ | — |
| pnpm | 10.12.4 | ✅ | — |
| **vite** | **^8.0.1** (devDep) | ✅ | Zaten kurulu |
| **@vitejs/plugin-react** | **^6.0.1** (devDep) | ✅ | Zaten kurulu, upgrade gereksiz |
| TypeScript | 5.9.3 | ✅ | — |
| React | 18.2.0 | ✅ | — |
| React Router | 6.30.2 (range: ^6.27.0) | ✅ | — |
| Redux Toolkit | 2.10.1 (range: ^2.8.2) | ✅ | — |
| TanStack Query | 5.90.10 | ✅ | — |
| AG Grid | 34.3.1 | ✅ | — |
| Tailwind CSS | 4.2.2 | ✅ | `@tailwindcss/vite` kurulmalı |
| Vitest | 4.1.0 | ✅ | Zaten Vite-based |
| Storybook | 10.3.1 | ✅ | Zaten @storybook/react-vite |
| Playwright | 1.58.2 | ✅ | Bundler bağımsız |
| esbuild | 0.27.4 | ✅ | — |

### Kurulması Gereken Tek Paket

| Paket | Neden |
|-------|-------|
| `@module-federation/vite` | MF plugin |
| `@tailwindcss/vite` | TW4 CSS native |

### Root Orchestration (kritik — v1'de eksikti)

| Dosya | Amaç | Vite'da Güncellenmeli |
|-------|------|----------------------|
| `scripts/health/run-dev-servers.sh` | 7 MFE başlatma (profile-based) | ✅ webpack serve → vite dev |
| `package.json` `dev:all`, `dev:remotes`, `start` | Profil script'leri | ✅ |
| `.github/workflows/ui-kit-ci.yml` (satır 150) | E2E'de webpack serve | ✅ vite preview |

### Shell Proxy Kuralları (7 adet — doğrulanmış)

| # | Context | Target | Not |
|---|---------|--------|-----|
| 1 | `/auth/realms` | localhost:8081 | Keycloak, pathRewrite |
| 2 | `/api/v1/reports`, `/api/v1/dashboards` | localhost:8095 | report-service |
| 3 | `/api/v1/authz` | localhost:8090 | permission-service |
| 4 | `/api/v1/users` | localhost:8089 | user-service |
| 5 | `/api/services` | localhost:8795 | service-manager-api |
| 6 | `/cockpit-api` | localhost:8790 | orchestrator, rewrite |
| 7 | `/api` | localhost:8080 | gateway (catchall) |

---

## 3. Risk Kaydı

### 🔴 KRİTİK

| # | Risk | Etki | Mitigation | Kontrol Noktası |
|---|------|------|------------|-----------------|
| R1 | MF singleton React reload döngüsü | App boot imkansız | POC'da test; fail → Rspack | Aşama 1, K2 |
| R2 | CSS production kaybı (MF CSS bundling) | Stil tamamen bozulur | Visual regression baseline + karşılaştır | Aşama 1, K4 |
| R3 | mfe-audit Promise-based remote | Vite MF'de desteklenmeyebilir | Aşama 0'da static URL'ye çevir | Aşama 0.1 |
| R4 | Cross-bundler MF uyumsuzluğu | Kademeli deploy imkansız | Big-bang cutover kontratı (Kural 1) | Aşama 2 |

### 🟡 ORTA

| # | Risk | Etki | Mitigation |
|---|------|------|------------|
| R5 | AG Grid lazy chunk yükleme farklılığı | Grid bozulabilir | AG Grid Vite uyumluluk notu kontrol |
| R6 | Env injection string-replace kırılganlığı | Sessiz bozulma | `vite-plugin-html-env` veya `/env.js` static dosya modeli |
| R7 | postcss-loader hâlâ ethic + suggestions'ta | CSS farklı render | Aşama 0'da kaldır |
| R8 | run-dev-servers.sh webpack-bağımlı | Ekip workflow kırılır | Aşama 2'de güncelle |
| R9 | CI workflow webpack serve kullanıyor | CI kırılır | Aşama 2'de güncelle |

### 🟢 DÜŞÜK

| # | Risk | Mitigation |
|---|------|------------|
| R10 | CJS require() → ESM import | Config dosyaları zaten CJS, vite.config.ts ESM olacak |
| R11 | publicPath farklılıkları | Vite `base` config |
| R12 | CORS headers | Vite `server.cors: true` |

---

## 4. Aşamalar

### Aşama 0: Hazırlık (1-2 gün) — WEBPACK'TE KALIYORUZ

> Hiçbir Vite dosyası oluşturulmaz. Sadece mevcut sorunlar düzeltilir.

| # | İş | Dosya | Neden |
|---|-----|-------|-------|
| 0.1 | mfe-audit Promise-based remote → static URL | `mfe-audit/webpack.dev.js`, `webpack.prod.js` | R3 — Vite MF static URL bekler |
| 0.2 | postcss-loader kaldır (ethic + suggestions) | `mfe-ethic/webpack.common.js`, `mfe-suggestions/webpack.common.js` | R7 — CSS pipeline standartlaştır |
| 0.3 | Visual regression baseline al | `npx playwright test e2e/visual/` | Karşılaştırma referansı |
| 0.4 | Git branch: `feat/vite-migration` | — | İzole çalışma |
| 0.5 | Shared MF config'i merkezi dosyaya çıkar | Yeni: `shared-federation.config.js` | 7 app'te tekrar eden shared deps |

**Doğrulama:** `npm run start` → tüm app'ler çalışıyor, visual regression baseline alındı.

---

### Aşama 1: Dev POC (3-5 gün) — SADECE DEV MODE

> **Kapsam:** mfe-shell + mfe-users + mfe-reporting
> (Shell + 2 zorunlu remote. Diğer 4 remote env stub ile devre dışı.)

> **Neden 3 app?** Shell tek başına gerçek boot path'i test etmez.
> mfe-users reporting'i consume ediyor → 3'lü zincir en küçük gerçekçi senaryo.

#### 1.1 Paket Kurulumu

```bash
pnpm add -D @module-federation/vite @tailwindcss/vite
```

#### 1.2 index.html Taşıma

Vite'ta giriş HTML'i **app root'unda** olmalı, `public/` altında değil.

```
apps/mfe-shell/
├── index.html          ← YENİ (Vite entry)
├── public/
│   ├── silent-check-sso.html  ← Kalıyor (statik asset)
│   └── (diğer statik dosyalar)
├── src/
│   └── index.tsx
└── vite.config.ts      ← YENİ
```

**Shell index.html (root):**
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Platform</title>
  </head>
  <body>
    <script>
      window.__env__ = window.__env__ || {};
      window.__earlyErrors = [];
      window.addEventListener('error', function(e) {
        window.__earlyErrors.push({ msg: e.message, file: e.filename, line: e.lineno, col: e.colno });
      });
    </script>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
    <script type="module" src="/src/index.tsx"></script>
  </body>
</html>
```

**Remote app'ler (users, reporting) index.html (root):**
```html
<!DOCTYPE html>
<html lang="tr">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>MFE Users</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/app/index.tsx"></script>
  </body>
</html>
```

#### 1.3 Env Injection — Static `/env.js` Modeli

> String-replace yerine ayrı JS dosyası üretilir. HTML değişse bile bozulmaz.

**Vite plugin:**
```typescript
// plugins/inject-env.ts
import { loadEnv, type Plugin } from 'vite';
import fs from 'fs';
import path from 'path';

const ALLOWLIST = new Set([
  'NODE_ENV', 'AUTH_MODE', 'AG_GRID_LICENSE_KEY',
  'SHELL_SKIP_REMOTE_SERVICES',
  'SHELL_ENABLE_SUGGESTIONS_REMOTE', 'SHELL_ENABLE_ETHIC_REMOTE',
  'SHELL_ENABLE_ACCESS_REMOTE', 'SHELL_ENABLE_AUDIT_REMOTE',
  'SHELL_ENABLE_USERS_REMOTE',
]);

export function injectEnv(): Plugin {
  return {
    name: 'inject-runtime-env',
    configureServer(server) {
      // Dev: serve /env.js dynamically
      server.middlewares.use('/env.js', (_req, res) => {
        const payload = buildPayload(server.config.mode);
        res.setHeader('Content-Type', 'application/javascript');
        res.end(`window.__env__ = ${JSON.stringify(payload)};`);
      });
    },
    generateBundle() {
      // Prod: emit env.js as static asset (overridden at deploy time)
      this.emitFile({
        type: 'asset',
        fileName: 'env.js',
        source: `window.__env__ = window.__env__ || {};`,
      });
    },
    transformIndexHtml() {
      return [{ tag: 'script', attrs: { src: '/env.js' }, injectTo: 'head-prepend' }];
    },
  };
}

function buildPayload(mode: string) {
  const envLocal = loadDotEnv();
  const merged = { ...envLocal, ...process.env };
  const payload: Record<string, string> = {};
  for (const [k, v] of Object.entries(merged)) {
    if (ALLOWLIST.has(k) || k.startsWith('VITE_')) {
      if (typeof v === 'string') payload[k] = v;
    }
  }
  payload.NODE_ENV = payload.NODE_ENV || mode;
  return payload;
}

function loadDotEnv() {
  const envPath = path.resolve(process.cwd(), '.env.local');
  if (!fs.existsSync(envPath)) return {};
  const result: Record<string, string> = {};
  for (const line of fs.readFileSync(envPath, 'utf-8').split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq > 0) {
      const key = trimmed.slice(0, eq).trim();
      let val = trimmed.slice(eq + 1).trim();
      // Handle quoted values
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      result[key] = val;
    }
  }
  return result;
}
```

#### 1.4 vite.config.ts Dosyaları

**apps/mfe-shell/vite.config.ts** — tam şablon:

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { federation } from '@module-federation/vite';
import { injectEnv } from './plugins/inject-env';
import path from 'path';

export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    tailwindcss(),
    injectEnv(),
    federation({
      name: 'mfe_shell',
      filename: 'remoteEntry.js',
      exposes: {
        './logic': './src/exposed-logic.ts',
        './services': './src/app/services/shell-services.ts',
        './i18n': './src/app/i18n/index.ts',
      },
      remotes: {
        mfe_suggestions: 'mfe_suggestions@http://localhost:3001/remoteEntry.js',
        mfe_ethic: 'mfe_ethic@http://localhost:3002/remoteEntry.js',
        mfe_users: 'mfe_users@http://localhost:3004/remoteEntry.js',
        mfe_access: 'mfe_access@http://localhost:3005/remoteEntry.js',
        mfe_audit: 'mfe_audit@http://localhost:3006/remoteEntry.js',
        mfe_reporting: 'mfe_reporting@http://localhost:3007/remoteEntry.js',
      },
      shared: {
        react: { singleton: true, requiredVersion: '18.2.0' },
        'react-dom': { singleton: true, requiredVersion: '18.2.0' },
        'react-router': { singleton: true },
        'react-router-dom': { singleton: true },
        '@reduxjs/toolkit': { singleton: true },
        'react-redux': { singleton: true },
        '@tanstack/react-query': { singleton: true },
        '@mfe/design-system': { singleton: true, requiredVersion: false },
        clsx: { singleton: true },
        'tailwind-merge': { singleton: true },
        'ag-grid-community': { singleton: true, strictVersion: true },
        'ag-grid-enterprise': { singleton: true, strictVersion: true },
        'ag-grid-react': { singleton: true, strictVersion: true },
        '@platform/capabilities': { singleton: true, requiredVersion: false },
        '@mfe/shared-http': { singleton: true, requiredVersion: false },
        '@mfe/i18n-dicts': { singleton: true, requiredVersion: false },
      },
    }),
  ],

  resolve: {
    alias: {
      '@platform/capabilities': path.resolve(__dirname, '../../packages/platform-capabilities/src'),
      '@mfe/design-system': path.resolve(__dirname, '../../packages/design-system/src'),
      '@mfe/i18n-dicts': path.resolve(__dirname, '../../packages/i18n-dicts/src'),
      '@mfe/shared-http': path.resolve(__dirname, '../../packages/shared-http/src'),
    },
  },

  server: {
    port: 3000,
    cors: true,
    proxy: {
      '/auth/realms': {
        target: 'http://localhost:8081',
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/auth/, ''),
      },
      '/api/v1/reports': { target: 'http://localhost:8095', changeOrigin: true },
      '/api/v1/dashboards': { target: 'http://localhost:8095', changeOrigin: true },
      '/api/v1/authz': { target: 'http://localhost:8090', changeOrigin: true },
      '/api/v1/users': { target: 'http://localhost:8089', changeOrigin: true },
      '/api/services': { target: 'http://localhost:8795', changeOrigin: true },
      '/cockpit-api': {
        target: 'http://localhost:8790',
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/cockpit-api/, '/api'),
      },
      '/api': { target: 'http://localhost:8080', changeOrigin: true },
    },
  },

  build: {
    target: 'esnext',
    outDir: 'dist',
    sourcemap: mode === 'development',
  },
}));
```

**apps/mfe-users/vite.config.ts** — remote şablon:

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { federation } from '@module-federation/vite';
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'mfe_users',
      filename: 'remoteEntry.js',
      exposes: {
        './UsersApp': './src/app/UsersApp.ui.tsx',
        './shell-services': './src/app/services/shell-services.ts',
      },
      remotes: {
        mfe_shell: 'mfe_shell@http://localhost:3000/remoteEntry.js',
        mfe_reporting: 'mfe_reporting@http://localhost:3007/remoteEntry.js',
      },
      shared: {
        react: { singleton: true, requiredVersion: '18.2.0' },
        'react-dom': { singleton: true, requiredVersion: '18.2.0' },
        'react-router': { singleton: true },
        'react-router-dom': { singleton: true },
        '@reduxjs/toolkit': { singleton: true },
        'react-redux': { singleton: true },
        '@tanstack/react-query': { singleton: true },
        '@mfe/design-system': { singleton: true, requiredVersion: false },
        'ag-grid-community': { singleton: true, strictVersion: true },
        'ag-grid-enterprise': { singleton: true, strictVersion: true },
        'ag-grid-react': { singleton: true, strictVersion: true },
        '@mfe/shared-http': { singleton: true, requiredVersion: false },
        '@mfe/i18n-dicts': { singleton: true, requiredVersion: false },
      },
    }),
  ],

  resolve: {
    alias: {
      '@platform/capabilities': path.resolve(__dirname, '../../packages/platform-capabilities/src'),
      '@mfe/design-system': path.resolve(__dirname, '../../packages/design-system/src'),
      '@mfe/shared-http': path.resolve(__dirname, '../../packages/shared-http/src'),
      '@mfe/i18n-dicts': path.resolve(__dirname, '../../packages/i18n-dicts/src'),
    },
  },

  server: {
    port: 3004,
    cors: true,
    headers: { 'Access-Control-Allow-Origin': '*' },
    proxy: {
      '/api/auth': { target: 'http://localhost:8088', changeOrigin: true },
      '/api': { target: 'http://localhost:8080', changeOrigin: true },
    },
  },

  build: {
    target: 'esnext',
    outDir: 'dist/users',
  },
});
```

#### 1.5 package.json Script Güncellemeleri (POC sırasında)

```jsonc
// apps/mfe-shell/package.json
{
  "scripts": {
    "start": "vite dev",
    "start:webpack": "npx kill-port 3000 || true && webpack serve --config webpack.dev.js",
    "build": "vite build",
    "build:webpack": "webpack --mode=production --config webpack.prod.js"
  }
}
```

Aynı pattern users ve reporting için.

#### 1.6 POC'da Opsiyonel Remote'ları Devre Dışı Bırakma

Shell `.env.local`'a:
```
SHELL_ENABLE_SUGGESTIONS_REMOTE=false
SHELL_ENABLE_ETHIC_REMOTE=false
SHELL_ENABLE_ACCESS_REMOTE=false
SHELL_ENABLE_AUDIT_REMOTE=false
```

Shell'in `webpack.remotes.js`'teki stub mekanizması zaten bunu destekliyor.
Vite config'te de aynı env check yapılacak.

---

### Aşama 1 Başarı Kriterleri (Dev POC Go/No-Go)

| # | Kriter | Test | Fail → |
|---|--------|------|--------|
| **K1** | Shell + Users + Reporting dev'de yükleniyor | localhost:3000 → login → users → reporting | DURDUR |
| **K2** | React singleton çalışıyor (tek instance) | Console: duplicate React uyarısı yok | DURDUR |
| **K3** | HMR çalışıyor (sayfa yenilemeden güncelleme) | Component'ta text değiştir → hot update | DURDUR |
| **K4** | TW4 CSS doğru render (padding, color, dark) | Visual regression: baseline delta < %2 | Sorun analiz et |
| **K5** | AG Grid lisanslı yükleniyor | Grid sayfası → watermark yok | Sorun analiz et |
| **K6** | Dark mode toggle çalışıyor | Dark butonu → arka plan koyu | Sorun analiz et |
| **K7** | 7 proxy kuralı çalışıyor | API çağrıları 200 OK | Sorun analiz et |
| **K8** | window.__env__ doğru inject | Console: `window.__env__.AUTH_MODE` | Sorun analiz et |
| **K9** | `vite build` başarılı | Exit code 0, dist/ oluşuyor | Sorun analiz et |
| **K10** | Dev server başlatma < 5 sn | Zamanlama | Bilgi amaçlı |

> **K1, K2 veya K3 fail → PLAN DURDURULUR. Rspack değerlendirilir.**
> **K4-K9 fail → 2 gün ek süre, düzeltilebilir mi değerlendirilir.**

---

### Aşama 2: Full Dev Migration (1 hafta) — Sadece POC başarılı ise

> Tüm remote'lar Vite'a geçirilir. Ama henüz prod deploy yok.

| Gün | İş | App'ler |
|-----|----|---------|
| Pzt | Batch A: vite.config.ts + index.html + smoke | mfe-access + mfe-audit (Promise-based → static) |
| Sal | Batch B: vite.config.ts + index.html + smoke | mfe-ethic + mfe-suggestions |
| Çar | Orchestration güncelle | `run-dev-servers.sh`: webpack serve → vite dev |
| Çar | Root scripts güncelle | `dev:all`, `dev:remotes`, `start` |
| Per | Entegrasyon test | Tüm 7 app birlikte (profile: full) |
| Per | CI workflow güncelle | `.github/workflows/ui-kit-ci.yml` → vite preview |
| Cum | E2E + visual regression full suite | Playwright tüm testler |

#### Aşama 2 Tamamlanma Kriterleri

| # | Kriter |
|---|--------|
| C1 | `bash ./scripts/health/run-dev-servers.sh --profile full` → 7 app başarılı |
| C2 | `npm run start` → tüm app'ler Vite ile yükleniyor |
| C3 | E2E test suite ≥ %95 pass |
| C4 | Visual regression delta < %2 |
| C5 | Doctor 79 check pass |
| C6 | CI workflow green |

---

### Aşama 3: Prod Cutover (3-5 gün)

| # | İş | Detay |
|---|-----|-------|
| 3.1 | Prod build: tüm app'ler | `vite build` → dist/ |
| 3.2 | Bundle size karşılaştır | webpack dist vs vite dist (tolerans: +%10) |
| 3.3 | Lighthouse benchmark | Core Web Vitals |
| 3.4 | Docker image güncelle | Build command: vite build |
| 3.5 | Staging deploy | Blue-green deploy |
| 3.6 | Soak test (2-3 gün) | Full QA + monitoring |
| 3.7 | **KARAR NOKTASI:** prod'a geçilsin mi? | Ekip onayı |
| 3.8 | Production deploy | Canary → %100 |
| 3.9 | 1 hafta izleme | Error rate, performance |
| 3.10 | **Webpack temizliği** (staging soak sonrası) | Config'leri sil, start:webpack kaldır |

> **Webpack config'ler ve bağımlılıklar EN ERKEN staging soak test sonrası silinir.**
> Prod deploy öncesi DEĞİL.

---

## 5. Dosya Değişiklik Planı

### Yeni Dosyalar

| Dosya | Aşama | İçerik |
|-------|-------|--------|
| `apps/mfe-shell/vite.config.ts` | 1 | Host + federation + proxy + env |
| `apps/mfe-shell/index.html` | 1 | Root entry (public/'tan taşınır) |
| `apps/mfe-shell/plugins/inject-env.ts` | 1 | Env injection plugin |
| `apps/mfe-users/vite.config.ts` | 1 | Remote config |
| `apps/mfe-users/index.html` | 1 | Root entry |
| `apps/mfe-reporting/vite.config.ts` | 1 | Remote config |
| `apps/mfe-reporting/index.html` | 1 | Root entry |
| `apps/mfe-access/vite.config.ts` | 2 | Remote config |
| `apps/mfe-access/index.html` | 2 | Root entry |
| `apps/mfe-audit/vite.config.ts` | 2 | Remote config |
| `apps/mfe-audit/index.html` | 2 | Root entry |
| `apps/mfe-ethic/vite.config.ts` | 2 | Remote config |
| `apps/mfe-ethic/index.html` | 2 | Root entry |
| `apps/mfe-suggestions/vite.config.ts` | 2 | Remote config |
| `apps/mfe-suggestions/index.html` | 2 | Root entry |
| `shared-federation.config.js` | 0 | Merkezi shared deps |

### Değişecek Dosyalar

| Dosya | Aşama | Değişiklik |
|-------|-------|------------|
| `apps/*/package.json` (7) | 1-2 | scripts: start → vite dev, build → vite build |
| `apps/mfe-audit/webpack.dev.js` | 0 | Promise-based remote → static URL |
| `apps/mfe-audit/webpack.prod.js` | 0 | Promise-based remote → static URL |
| `apps/mfe-ethic/webpack.common.js` | 0 | postcss-loader kaldır |
| `apps/mfe-suggestions/webpack.common.js` | 0 | postcss-loader kaldır |
| `scripts/health/run-dev-servers.sh` | 2 | webpack serve → vite dev |
| `package.json` (root) | 2 | scripts güncelle |
| `.github/workflows/ui-kit-ci.yml` | 2 | webpack serve → vite preview |
| `apps/mfe-shell/src/index.css` | 1 | @tailwindcss/webpack referansları temizle |
| `apps/mfe-shell/src/index.tsx` | 1 | CSS import yorumu güncelle |

### SİLİNECEK Dosyalar (SADECE Aşama 3.10 sonrası)

| Dosya | Sayı | Not |
|-------|------|-----|
| `apps/*/webpack.common.js` | 7 | Staging soak sonrası |
| `apps/*/webpack.dev.js` | 7 | Staging soak sonrası |
| `apps/*/webpack.prod.js` | 7 | Staging soak sonrası |
| `apps/mfe-shell/webpack.remotes.js` | 1 | Staging soak sonrası |
| `apps/mfe-shell/public/index.html` | 1 | Root index.html'e taşındıktan sonra |
| `apps/mfe-shell/public/tailwind.css` | 1 | @tailwindcss/vite native |
| `apps/mfe-shell/public/tw4-*.css/html` | ~3 | Debug artifacts |
| `packages/design-system/webpack.*.cjs/js` | 3 | **KAPSAM DIŞI** (ayrı karar) |

---

## 6. Rollback Planı

### Seviye 1: Git Revert (anında)
```bash
git revert <cutover-commit>
```
Webpack config'ler yerinde (Kural 2). `start:webpack` çalışır.

### Seviye 2: Script Fallback
```bash
# Herhangi bir app'te Vite sorun çıkarırsa:
cd apps/mfe-shell && npm run start:webpack
```
Her app'te `start:webpack` script'i Aşama 3.10'a kadar korunur.

### Seviye 3: Rspack Pivot
POC K1-K3 fail → Webpack config'leri Rspack'e çevir.
Rspack config ≈ webpack config (%95 aynı API). 1-2 günde geçilir.
```bash
# webpack.common.js'te:
# const { ModuleFederationPlugin } = require('webpack').container;
# →
# const { ModuleFederationPlugin } = require('@rspack/core').container;
```

---

## 7. Zaman Çizelgesi

```
Hafta 0 (Hazırlık — Webpack'te):
├── Pazartesi: Aşama 0 (promise fix, postcss kaldır, visual baseline)
└── Salı: Aşama 0 tamamla, branch oluştur

Hafta 1 (Dev POC):
├── Çarşamba: Shell + Users + Reporting vite.config.ts
├── Perşembe: Smoke test + debug
├── Cuma: POC karar noktası
│   ├── K1-K3 ✅ → Hafta 2'ye devam
│   └── K1-K3 ❌ → DURDUR, Rspack değerlendir

Hafta 2 (Full Dev Migration — sadece POC pass ise):
├── Pazartesi: Batch A (access + audit)
├── Salı: Batch B (ethic + suggestions)
├── Çarşamba: Orchestration (run-dev-servers.sh, CI)
├── Perşembe: Entegrasyon test
└── Cuma: Full E2E + visual regression

Hafta 3 (Prod Cutover):
├── Pazartesi: Prod build + bundle analiz
├── Salı: Docker + CI güncelle
├── Çarşamba: Staging deploy
├── Perşembe-Cuma: Soak test
└── (Sonraki hafta): Prod deploy → izleme → webpack temizliği
```

---

## 8. Başarı Metrikleri

| Metrik | Mevcut (Webpack) | Hedef (Vite) | Kabul Edilebilir |
|--------|-----------------|--------------|------------------|
| Dev server başlatma | ~15-20 sn | < 3 sn | < 5 sn |
| HMR (component değişiklik) | ~8-15 sn | < 1 sn | < 3 sn |
| Full build (7 app) | ~3-5 dk | < 1 dk | < 2 dk |
| Bundle size (shell) | ~26 MB | ≤ 26 MB | ≤ 30 MB (+%15) |
| Config dosya sayısı | 24 (webpack) | 8 (vite) | — |
| Visual regression delta | — | < %1 | < %2 |
| Doctor check | 79 pass | 79 pass | 79 pass |
| E2E test | 47+ pass | 47+ pass | ≥ %95 pass |

---

## 9. Açık Sorular

| # | Soru | Varsayılan | Onay Gerekli |
|---|------|------------|--------------|
| Q1 | POC fail → otomatik Rspack'e geçelim mi? | Evet | ✅ |
| Q2 | Prod deploy: canary mı, big-bang mı? | Canary (%10 → %50 → %100) | ✅ |
| Q3 | Webpack temizliği ne zaman? | Staging soak sonrası | ✅ |
| Q4 | design-system webpack config'i ne olacak? | Kapsam dışı, ayrı karar | ✅ |

---

## 10. Onay

- [ ] Migration kontratı (Bölüm 1) onaylandı
- [ ] Açık sorular (Q1-Q4) yanıtlandı
- [ ] Risk kaydı (Bölüm 3) kabul edildi
- [ ] Zaman çizelgesi (Bölüm 7) uygun
- [ ] Go/No-Go kriterleri (K1-K10) kabul edildi
- [ ] Rollback planı (Bölüm 6) yeterli

> **Onay sonrası ilk adım:** Aşama 0.1 — mfe-audit Promise-based remote düzeltme.
