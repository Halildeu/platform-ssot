---
title: "FRONTEND-ARCH-STATUS – Mimari Durum & Yol Haritası"
scope: ["frontend", "mfe"]
owner: "@team/frontend-arch"
status: active
version: "rev2"
last_review: 2025-11-28
tags: ["architecture", "frontend", "mfe", "module-federation", "status", "roadmap"]
---

# FRONTEND-ARCH-STATUS – Mimari Durum & Yol Haritası

## 1. Özet
- Tüm MFE’ler `/api/v1/users|roles|permissions|variants` path’leri ile gateway → discovery → servis zincirine çağrı yapıyor. Yanıtlar PagedResult zarfı (`items/total/page/pageSize`) ile normalize, `page/pageSize/sort/search/advancedFilter` parametreleri STYLE-API-001 ile hizalı.
- Global QueryClientProvider shell içinde; tüm MFE’ler shared QueryClient kullanıyor (dev’de ReactQueryDevtools açık). Service katmanı TanStack Query + optimistic update kalıplarıyla standardize edildi.
- Güvenlik: Keycloak (realm=`master`, client=`frontend`) keycloak-js ile OIDC Authorization Code + PKCE + silent-check-sso kullanıyor. LoginPage shell içinde `/login` rotasında render ediliyor; ProtectedRoute yönlendirmeyi `/login?redirect=...` formatında yapıyor ve token yenileme `updateToken(30)` ile otomatik.
- Auth & HTTP katmanı: Keycloak login/init/logout/refresh yalnız shell’de koşturulur; access token store’da tutulur ve tüm remote MFE’ler shared shell servislerinden token state’ini okur. `@mfe/shared-http/api` paketi tek axios instance sağlar; baseURL `import.meta.env.VITE_GATEWAY_URL || 'http://localhost:8080/api'`, Authorization Bearer + `X-Trace-Id` interceptor’ları merkezi.
- UI/tema: Tailwind + semantic token sistemi + `packages/ui-kit` tek resmi modeldir; `mf_ui_kit` remote tamamen kaldırıldı, tüm import’lar paket üzerinden gelir.
- Auth zinciri FE → Gateway → Keycloak audience (`["frontend","user-service"]`) uyumludur; backend servisleri service-account client’larıyla audience kontrolü yapar.
- Backend secret kaynağı prod/test’te Vault + fail-fast; FE doğrudan Vault kullanmaz ancak gateway üzerinden gelen API’ler Vault ile çevrili ortamlardan gelir.

## 2. Hedef Mimari (Frontend)
- MFE: Shell (host) + domain bazlı remotes (users, reporting, access, audit, ethic, suggestions).
- Module Federation:
  - Router yalnız shell’de (BrowserRouter); remote’lar router sarması yapmaz.
  - Shared: `react`, `react-dom`, `react-router`, `react-router-dom` singleton, versiyonlar hizalı.
- UI Kit: Paket/remote modeli net; örnek import’lar tek modele göre verilir.
- Service/i18n: Tüm API çağrıları service katmanında; zarf/param/hata şeması STYLE-API-001’e göre. Kullanıcı metinleri i18n sözlüğünden gelir.

## 3. Mevcut Durum (Frontend)

### 3.1 Uygulama & MF Tablosu

| App / Paket             | Rol         | Tür                | Port | MF Remote                                           | Not / Sapma                                      |
|-------------------------|-------------|--------------------|------|-----------------------------------------------------|--------------------------------------------------|
| `mfe-shell`             | Host        | Shell              | 3000 | –                                                   | Shared: react, react-dom, react-query; react-router singleton MF listesinde eksik (risk). |
| `mfe-suggestions`       | Demo/örnek  | Remote MFE         | 3001 | `mfe_suggestions@http://localhost:3001/remoteEntry.js` | Shell logic tüketir                               |
| `mfe-ethic`             | Etik uyum   | Remote MFE         | 3002 | `mfe_ethic@http://localhost:3002/remoteEntry.js`    | UI Kit + TanStack Query                          |
| `mfe-users`             | Kullanıcı   | Remote MFE         | 3004 | `mfe_users@http://localhost:3004/remoteEntry.js`    | AG Grid SSRM + Query + v1 users API              |
| `mfe-access`            | Yetki/Rol   | Remote MFE         | 3005 | `mfe_access@http://localhost:3005/remoteEntry.js`   | Roles/permissions v1 API + TanStack Query        |
| `mfe-audit`             | Audit feed  | Remote MFE         | 3006 | `mfe_audit@http://localhost:3006/remoteEntry.js`    | AG Grid SSRM                                     |
| `mfe-reporting`         | Raporlama   | Remote MFE         | 3007 | `mfe_reporting@http://localhost:3007/remoteEntry.js`| Variants v1 API + ui-kit grid helper             |
| `packages/ui-kit`       | Shared lib  | NPM/monorepo paketi| –    | –                                                   | Tipler, stil token’ları, helpers                 |
| `packages/shared-types` | Shared lib  | NPM/monorepo paketi| –    | –                                                   | Domain modelleri                                 |
| `packages/i18n-dicts`   | Shared lib  | NPM/monorepo paketi| –    | –                                                   | i18n sözlük/manifest                             |
| `packages/config`       | Shared lib  | NPM/monorepo paketi| –    | –                                                   | ESLint/tsconfig/jest ayarları                    |

### 3.2 Sapmalar (Hedef vs Mevcut)
- **Router paylaşımı:** react-router singleton MF shared listesinde eksik; iki kopya riski var.
- **UI Kit modeli:** Paket modeli ana; `mf_ui_kit` sadece demo/story. MF shared pin/versiyon denetimi tamamlanmalı.
- **Auth/Keycloak:** Dev/local permitAll; prod/test için OIDC + Bearer header akışı henüz uygulanmadı (placeholder).
- **MF shared liste:** react-query devtools/cli versiyon pin’leri MFE’ler arası tam hizalanmalı (bekleyen görev).

### 3.3 Güvenlik & SPA Login Akışı
- `/login` rotası shell içinde kurumsal LoginPage bileşenini render eder; kullanıcı Keycloak ekranına yalnızca bu sayfadaki “Giriş yap” butonu `keycloak.login()` çağrısını tetiklediğinde yönlendirilir, kimlik bilgileri FE tarafında tutulmaz.
- LoginPage, keycloak-js ile OIDC Authorization Code + PKCE akışını başlatır; silent-check-sso dev/prod’da farklı davranır: prod/test ortamlarında otomatik session yenileme aktif, local/dev’de isteğe bağlıdır ve token süresi dolarsa kullanıcıya toast üzerinden bilgi verilir.
- ProtectedRoute auth context’ini dinler, kullanıcı yetkisi yoksa `/login?redirect=<son rota>` yönlendirmesi yapar ve Keycloak session’ı doğrulanana kadar remote bileşenleri render etmez.
- 401/403 yanıtlarında shared HTTP interceptor shell auth provider’ını logout + redirect akışına yönlendirir; toast/notification katmanı kullanıcıya bilgi verir.
- LoginPage için unit testi bulunur; “Kurumsal giriş” butonunun `keycloak.login` fonksiyonunu çağırdığını doğrulayarak SPA login senaryosunun regresyonu korunur.

### 3.4 v1 Service Layer Alignment
- Service katmanları (`apps/*/src/entities/**/api/*.ts`) `@mfe/shared-http/api`’yi kullanarak `/api/v1/**` path’lerine çağrı yapar; legacy `/api/users` vb. path’ler kaldırıldı (`QLTY-API-V1-STANDARDIZATION-01`).
- Pagination zarfı `items/total/page/pageSize`, `sort`, `search`, `advancedFilter` parametrik whitelist’i STYLE-API-001 ile hizalıdır; PagedResult parse helper’ları service katmanında paylaşılır ve kullanıcı, rol, izin, varyant API’lerinin tamamı aynı sözleşmeyi uygular.
- API dokümanları (users/permissions/variants/auth) v1/legacy ayrımını açıkça belirtir; FE tarafı yalnız v1 path’i tüketir.

### 3.5 Shell Merkezli Auth + Shared HTTP Layer
- Keycloak entegrasyonuna dair tüm lifecycle işlemleri (keycloak-js init, login/logout, token refresh, silent-check-sso, BroadcastChannel yayını) yalnız `mfe-shell` içinde çalışır. Remote MFE’ler Keycloak client başlatmaz, login tetiklemez ve ProtectedRoute mantığı içermez; Shell store’dan gelen auth durumuna güvenerek yalnız iş mantığı/UI render eder.
- Shell login olduktan sonra access token yalnız Redux store içindeki bellek alanında tutulur (kalıcı storage yoktur); shell-services aboneleri token değişimini BroadcastChannel’la paylaşır. Remote MFE’ler `getShellServices().auth.getToken()` veya `registerTokenResolver` üzerinden aynı token’ı okur.
- `QLTY-FE-SHARED-HTTP-01` sonucunda tüm MFE’ler `@mfe/shared-http` paketindeki axios instance’ını kullanır; baseURL `VITE_GATEWAY_URL || http://localhost:8080/api` olarak tekilleştirilmiştir. Bu instance Authorization: Bearer `<token>` ve `X-Trace-Id` header’larını otomatik ekler, 401/403 geldiğinde shell’deki login akışını yeniden tetikler.
- Shell guard yönlendirmesi `/login?redirect=<path>` formatındadır; kullanıcı bir kez login olduğunda `/admin/users`, `/access/roles`, `/admin/reports/...`, `/audit/events` gibi rotalar arasında gezerken tekrar Keycloak sayfası görmez.
- Paket jest/tsx testleri + gateway smoke testleri ile doğrulanır; WEB-PROJECT-LAYOUT ve STYLE-API-001 referansları bu katmanı işaret eder ve `@mfe/shared-http` harici fetch/axios kullanımları kod incelemelerinde reddedilir.
- Shell auth state’i (`accessToken`, `refreshToken`, `idToken`, `profile`) yalnız bellekte tutulur ve BroadcastChannel aracılığıyla tüm tarayıcı sekmelerine push edilir; BroadcastChannel desteklenmiyorsa logout sinyali kısa ömürlü `storage` eventiyle tetiklenir (token değeri yine kalıcı olarak yazılmaz). Hiçbir sekmede token kalıcı depoda saklanmaz; her MFE `ShellServices.auth` üzerinden token okuyup `registerTokenResolver` ile aynı değeri paylaşır.
- MFE’ler Keycloak login ekranına yönlendirme/çıkış tetiklemesi yapmaz; tüm login/logout/refresh/silent-check-sso akışı shell’de kalır. MFE içinde bağımsız login tetiklemek STYLE-WEB-001’de anti-pattern olarak işaretlenmiştir.

### 3.6 Shared HTTP & Interceptor Layer
- `packages/shared-http/src/index.ts` tek resmi HTTP client’tır; axios instance’ı baseURL=`import.meta.env.VITE_GATEWAY_URL || process.env.VITE_GATEWAY_URL || 'http://localhost:8080/api'` olacak şekilde ayağa kalkar.
- Request interceptor shell’in `registerAuthTokenResolver` API’siyle eşleşen resolver’dan token okur ve `Authorization: Bearer <token>` header’ını otomatik ekler; aynı noktada `X-Trace-Id` üretip isteğe işler. Token yoksa header set edilmez ve downstream servis default davranışı ile 401 döndürür.
- Response interceptor 401 gördüğünde shell tarafından verilen `registerUnauthorizedHandler` ile `/login?redirect=...` akışını tetikler; 403+5xx cevapları şu anda merkezi loglama/telemetry ile yakalanır ve ileride toast/hata katmanına bağlanacak ortak hook olarak kullanılacaktır.
- `apps/mfe-shell/src/app/ShellApp.ui.tsx`, auth slice (login/register/profile thunk’ları) ve telemetry client yalnız shared-http üzerinden HTTP çağrısı yapar; shell içindeki eski axios interceptor’ları kaldırılmış ve tüm token/trace davranışı ortak katmana taşınmıştır.
- Audit, reporting, users ve UI Kit grid-variants service katmanları fetch/axios.create yerine `@mfe/shared-http/api` kullanır; unauthorized/network senaryoları Axios error akışı üzerinden merkezi interceptor’la paylaşılır.
- Module Federation tarafında `@mfe/shared-http` workspace’e eklendi ve tüm webpack MF config’lerinde shared singleton olarak expose edildi; böylece shell + remote MFE’ler aynı client instance’ını paylaşır ve interceptor davranışı çevrim içi tutarlı kalır.

### 3.7 UI Kit Paket Modeli
- `packages/ui-kit` tasarım sistemi, tema token’ları, grid yardımcıları ve ErrorBoundary gibi paylaşılan bileşenlerin tek resmi kaynağıdır (`QLTY-MF-UIKIT-01`).
- `mf_ui_kit` remote kaldırıldı; Storybook/demo gereksinimleri doğrudan paket içindeki örneklerle çözüldü. Üretim kodu yalnız paket modelini kullanır; MF shared config’lerinde paket sürümü singleton olarak pinlenir.
- UI Kit paketinin sürümü MF shared config’lerinde singleton olarak pinlenir; WEB-PROJECT-LAYOUT dokümanında kaynak modeli anlatılmıştır.

### 3.8 Keycloak Client & Audience Mimarisı
- `frontend` client public client olarak çalışır (client authentication off), `Standard flow` açık, PKCE zorunlu, silent-check-sso script’i shell tarafından yüklenir.
- Keycloak’ta `audience-user-service` protokol mapper’ı sayesinde access token `aud: ["frontend","user-service"]` değerlerini taşır; backend servisleri (user/permission/variant/auth) service-account client’larını `Service accounts roles = ON` modunda kullanarak gateway arka plan çağrılarını yetkilendirir.
- FE env değişkenleri: `VITE_KEYCLOAK_URL`, `VITE_KEYCLOAK_REALM`, `VITE_KEYCLOAK_CLIENT_ID`, `VITE_KEYCLOAK_SILENT_CHECK_URI`, `VITE_AUTH_MODE` (keycloak/permitAll), `VITE_ENABLE_FAKE_AUTH` ve isteğe bağlı `VITE_FAKE_AUTH_*` (email/ad/permissions). shared-http interceptor Keycloak instance’ından token alır ve tüm MFE’lerde AuthenticationContext ile paylaşır.
- `VITE_AUTH_MODE=keycloak` prod/test profillerinde zorunludur; permitAll yalnızca dev/local profilinde (`NODE_ENV=development`) kısa süreli testler için açılır. PermitAll aktifken shell login ekranı kullanıcıyı bilgilendirir, shared-http Authorization header eklemez ve ProtectedRoute guardı login istemez.

### 3.9 Keycloak Persistence Policy v1.0
- FE ekipleri Keycloak datasının repo kökündeki `backend_keycloak_data` adlı named volume üzerinden tutulduğunu ve Compose proje adının `serban` olarak sabitlendiğini varsaymalıdır; volume adı değiştiğinde session-log’a kayıt düşülür.
- `docker compose down -v` veya `docker volume prune` komutları HARD-RESTRICTED’tir; FE dokümantasyonunda bu komutları önermek yasaktır. Güvenli yeniden başlatma için backend kökündeki `restart.sh` script’i paylaşılmalıdır.
- Realm export rutinleri `backend/keycloak/exports/` dizinine alınır (`docker compose exec keycloak /opt/keycloak/bin/kc.sh export --dir /opt/keycloak/data/export --realm master`). Prod/test FE release runbook’ları, release öncesi export alındığını doğrulamak zorundadır.
- Silent-check-sso domainleri (`http://localhost:3000`, `http://127.0.0.1:3000`, ilgili kurumsal prod hostnames) Keycloak client’ında Valid redirect + Web origin listelerine eklenmedikçe login başarısız olur; FE konfigleri bu listeyi genişletmek için backende PR açmalıdır.
- Keycloak volume kaybı **kritik seviye**dir; FE-CSIRT runbook’ında recovery adımları (stack’i durdur, güncel export’u kullanarak import et, silent-check-sso domainlerini doğrula) referans gösterilir.

## 4. Yol Haritası (Frontend Backlog)
- Kısa vade (0–3 ay):  
  - [ ] QLTY-MF-ROUTER-01: Shell + tüm remote’larda `react-router` + `react-router-dom` singleton; BrowserRouter yalnız shell (öncelik 1).  
  - [ ] QLTY-FE-KEYCLOAK-01: Keycloak OIDC client (prod/test), axios Bearer interceptor; dev/local permitAll (öncelik 2).  
  - [ ] QLTY-MF-UIKIT-01: UI Kit modeli (paket/remote) seçimi ve doküman/örneklerin hizalanması; MF remote adı/portunun netleştirilmesi (öncelik 3).  
  - [ ] SEC-VAULT-FAILOVER-01: Vault fail-fast senaryosu için FE hata yüzeyi / monitoring/runbook notu (öncelik 4).  
  - [ ] QLTY-FE-VERSIONS-01: Router/query/devtools versiyon pin & MF shared audit (öncelik 5).  
  - [ ] QLTY-FE-AUTH-01: Auth API çağrılarını service katmanına taşı, hata mesajlarını i18n’e al.
- Orta vade (3–9 ay):  
  - [ ] QLTY-FE-OBS-01: MF/tema/i18n için Playwright + görsel/axe regression ve logging/traceId entegrasyonu.

## 5. Cross-Cutting (Frontend)
- Observability: FE loglarında traceId kullanımı ve backend ile korelasyon planlanıyor (STYLE-API-001 meta.traceId).  
- CI/CD: Lint/test (Tailwind/semantic, stylelint, eslint) aktif; MF router/shared smoke testleri genişletilecek.  
- Güvenlik: Route guard’lar JWT claim’leriyle hizalı; MF remote’larda guard kontrolleri gözden geçirilecek.  
- Secret/Backend: FE doğrudan Vault kullanmaz; backend’in secret kaynağı Vault (fail-fast). FE gateway üzerinden gerçek API cevaplarını alır; backend Vault erişemezse servis start etmez.

## 6. Change Log
- 2025-11-22 – FE Access v1 migration, FE Users v1 migration, FE Variants v1 migration, TanStack Query Provider global, Gateway v1 proxy entegrasyonu, Vault-backed backend notu, Keycloak entegrasyon hazırlığı eklendi.  
- 2025-11-22 – Hedef/Mevcut/Sapma/Yol Haritası formatına geçirildi; MF tablosu ve sapmalar güncellendi.  
- 2025-11-22 – [FRONTEND-V1-MIGRATION] Users/Access/Variants v1 REST entegrasyonu, router singleton + Playwright smoke, global QueryClientProvider, Keycloak güvenlik bölümü güncellendi, deploy/hosting notları eklendi.  
- 2025-11-22 – [QLTY-MF-UIKIT-01] UI Kit paket modeli tek kaynak yapıldı; `mf_ui_kit` remote sadece demo/story için bırakıldı, tüm MFE’lerde paket importları kullanılıyor, grid-variants helper’ları tek kaynaktan (`packages/ui-kit`) geliyor.  
- 2025-11-22 – [QLTY-MF-UIKIT-01-FAZ4] Router smoke (RUN_MF_ROUTER_SMOKE=true) başarıyla geçti; UI Kit paket modeli tüm MFE’lerle birlikte MF loader’da stabil.
- 2025-11-23 – [QLTY-FE-KEYCLOAK-01-LOGIN-UI] mfe-shell içinde kurumsal LoginPage eklendi; Keycloak login akışı bu sayfadan tetikleniyor (kullanıcı adı/şifre FE’de işlenmiyor).
- 2025-11-23 – [JWT-AUDIENCE-FIX] Keycloak frontend client’a audience mapper eklendi (aud → frontend,user-service); FE token üretimi aynı issuer/JWKS ile user-service audience’ını içeriyor, baseURL `/api` proxy notu güncellendi.  
- 2025-11-23 – [ARCH-FINAL-KEYCLOAK-API] Keycloak audience mapper + /api proxy sabitlendi; UI Kit paket modeli final (packages/ui-kit tek resmi kaynak, mf_ui_kit sadece demo); LoginPage + ProtectedRoute kurumsal akışla finalize edildi.  
- 2025-11-23 – [SHARED-HTTP-MIGRATION] `@mfe/shared-http` paketi ile ortak HTTP istemcisi eklendi; baseURL tekillendi (`VITE_GATEWAY_URL || http://localhost:8080/api`), tüm MFE’ler aynı axios instance’ını kullanıyor, Authorization/X-Trace-Id/hata interceptors merkezi. `/api/...` çağrıları `/v1/...` ile sadeleşti, webpack proxy bağımlılığı kalktı; Variants/Users/Access + UI Kit grid-variants aynı HTTP katmanında.  
- 2025-11-28 – [E01-S10] Auth state yalnız bellek + BroadcastChannel üzerinde tutulacak şekilde güncellendi; logout sinyali için storage fallback davranışı ve JWT storage notu revize edildi.  

---

## 7. Mimari Tasarım (Kalıcı İçerik)

Bu bölüm, statü değişse de sabit kalan mimariyi özetler. Güncel durum ve sapmalar için Bölüm 3–4’e bakın.

### 7.1 Sistem Genel Görünüm ve Doküman Haritası
- Bu dosya: Frontend mimarisinin kanonik kaydı.  
- Backend mimarisi: `docs/01-architecture/BACKEND-ARCH-STATUS.md`  
- Mimari kararlar: `docs/05-governance/05-adr/ADR-*.md`  
- Proje dizin yapısı: `WEB-PROJECT-LAYOUT.md`  
- Stil/kod kalitesi: `STYLE-WEB-001.md` + `STYLE-API-001.md`

### 7.2 Amaç ve Kapsam
Frontend ekosisteminin (shell + MFE’ler, state, styling, API, performans, test) tamamını tek yerde dokümante ederek:
- Yeni geliştiricinin 1 günde sistemi kavramasını,
- Mimari sapmaların hızlı tespit edilmesini,
- FE/BE ekipleri arasında ortak dil kullanılmasını sağlar.

### Deployment / Hosting & Ortamlar
- FE, Webpack build’i sonrası statik bundle (dist/build) olarak çalışır; prod’da statik hosting/CDN (ör. Netlify veya eşdeğer) üzerinde barındırılır.
- Backend API çağrıları tek giriş noktası API Gateway’dir:
  - FE, ortam değişkeni `API_BASE_URL` üzerinden `/api/v1/...` path’lerine istek atar (örn. `https://gateway.company.com/api/v1/...`).
- Local/dev:
  - FE dev server `/api` path’ini `http://localhost:8080` (gateway) adresine proxy eder.
  - Keycloak dev için `http://localhost:8081` kullanılır.
- Prod/test:
  - Keycloak URL/Realm/ClientId env değişkenlerinden gelir (örn. `KEYCLOAK_URL`, `KEYCLOAK_REALM`, `KEYCLOAK_CLIENT_ID`); keycloak-js client bu env’leri kullanır.

### 7.3 Temel İlkeler
- Micro Frontend (Module Federation) – her domain/özellik bağımsız deploy edilir.
- Tek shell; tüm route, layout ve temel servisler (auth, tema, dil) shell üzerinden yürütülür.
- State izolasyonu:
  - MFE’ler kendi local/Zustand store’larını yönetebilir,
  - Global store sadece shell-common üzerinden paylaşılır.
- Code sharing:
  - `mfe-shell-common` üzerinden UI component, icon, token, hook paylaşımı.  
  - `ui-kit` paketi ile temel tasarım sisteminin tekrar kullanımı.
- API sözleşmeleri: STYLE-API-001’e göre ErrorResponse işleme, `traceId` header’ı zorunlu.

### 7.4 Teknoloji Yığını
- Framework: React 18 + TypeScript
- Build: Webpack 5 + Module Federation
- State:
  - Zustand (global ve domain store’ları),
  - TanStack Query (server state, caching, optimistic updates)
- Styling:
  - Tailwind CSS 3,
  - Headless UI,
  - `clsx` veya benzeri yardımcılar
- Routing:
  - React Router v6
  - Router yalnızca shell’de tanımlı, MFE’ler lazy load edilir.
- UI Kit:
  - `packages/ui-kit` (design tokens + temel bileşenler, grid-variants API + `mapVariantDtoToGridVariant`, ErrorBoundary vb.) resmi ve tek modeldir.
  - `mfe-shell-common` (Button, Modal, Table, Form, Toast vb.)
  - `mf_ui_kit` remote yalnızca demo/story amaçlıdır; runtime iş kodu paket modelini kullanır.
- Data Grid:
  - AG Grid Enterprise (lisanslı kullanım).
- Test:
  - Vitest + React Testing Library + MSW
  - Playwright E2E (kritik akışlar).
- Bundle Analysis:
  - `webpack-bundle-analyzer` veya benzeri araç CI’da koşar.

### 7.5 V1 API Entegrasyonu (Users / Access / Variants)
- Users (mfe-users):
  - API: `/api/v1/users`, `/api/v1/users/{id}`, `/api/v1/users/by-email`, `/api/v1/users/{id}/activation`
  - SSRM parametreleri: `page`, `pageSize`, `sort`, `search`, `advancedFilter` (STYLE-API-001 zarf: `items/total/page/pageSize`).
  - useGridUsers → TanStack Query datasource ile AG Grid SSRM çalışır.
- Access (mfe-access):
  - API: `/api/v1/roles`, `/api/v1/roles/{id}`, `/api/v1/roles/{id}/clone`, `/api/v1/roles/{id}/permissions`, `/api/v1/permissions`
  - useAccessRoles: TanStack useQuery/useMutation ile list/detail/update/clone/permission-assign akışları.
  - PagedResult zarfı service katmanında parse edilir (items/total/page/pageSize); SSRM parametreleri backend sözleşmesiyle hizalıdır.
  - Permission paneli: Checkbox list, RoleDetailDto.permissions + PermissionDto listesiyle senkron; Save → `updateRolePermissions` mutation çağrısı.
- Variants (mfe-reporting + ui-kit helper’ları):
  - API: `/api/v1/variants`, `/api/v1/variants/{id}`, `?gridId=<...>`
  - create/update/delete/apply akışları v1 DTO’lar ile; useGridVariants v1 path’e tam entegre.
  - SSRM apply: FE tarafında variant config (columns/sortModel/filterModel/pivot/quickFilter) AG Grid datasource’una uygulanır.
  - ui-kit grid-variants helper’ları v1 DTO formatına normalize edildi; mapping/normalize tek kaynaktan (`packages/ui-kit`) gelir.

### 7.6 Query Provider (Global)
- `mfe-shell` içinde global QueryClient tanımlı ve QueryClientProvider ile tüm MFE’lere shared ediliyor.
- Default opsiyonlar: staleTime=30s, retry=1, refetchOnWindowFocus=false.
- ReactQueryDevtools dev modda açık, prod’da kapalı.

### 7.7 Gateway / Proxy Zinciri
- FE → Gateway (8080) → Discovery → Servisler (proxy fallback yok).
- Tüm `/api/v1/**` path’leri gateway üzerinden yönlendirilir (users/roles/permissions/variants).
- Ortak HTTP istemcisi: `@mfe/shared-http/api` (baseURL: `import.meta.env.VITE_GATEWAY_URL || http://localhost:8080/api`); tüm MFE’ler yalnızca bu instance’ı kullanır.

### 7.8 Güvenlik & Keycloak
- keycloak-js client: url=`http://localhost:8081`, realm=`master`, clientId=`frontend`. Shell bootstrap’te `check-sso + pkce` ile init; token yenilemesi `updateToken` ile yapılır. Env değişkenleri: `VITE_KEYCLOAK_URL`, `VITE_KEYCLOAK_REALM`, `VITE_KEYCLOAK_CLIENT_ID`.  
- Login akışı: mfe-shell içindeki `/login` rotası kurumsal LoginPage’i gösterir; “Kurumsal Giriş” butonu `keycloak.login()` tetikler (Authorization Code + PKCE). Başarılı login sonrası access token alınır, axios interceptor `Authorization: Bearer <token>` header’ını ekler.  
- ProtectedRoute: Auth yoksa `/login?redirect=<path>` adresine yönlendirir; Keycloak login sonrası redirect parametresiyle hedef sayfaya geri döner. LoginPage butonunun `keycloak.login` tetiklediği unit test eklidir.  
- Sessiz oturum: `login-required` / `silent-check-sso` dev/prod’da çalışır; realm CSP frame-ancestors frontend host’u ile hizalıdır.  
- Prod/test: Gateway + backend servisler JWT zorunlu, başarısız token’da 401 → Keycloak login; FE Bearer interceptor zorunlu.  
- Local/dev: permitAll; Keycloak akışı isteğe bağlı, mevcut token varsa taşınır.  
- Kernel kuralları:  
  - FE’de hiçbir MFE kendi axios instance’ını kullanamaz; tüm çağrılar `@mfe/shared-http/api` üzerinden yapılır.  
  - Base URL tek noktadadır: `import.meta.env.VITE_GATEWAY_URL || 'http://localhost:8080/api'`.  
  - Development ortamında istekler doğrudan gateway’e gider; proxy fallback değildir.  
  - Tüm domain API’lerinde `/v1` prefix’i zorunludur.  
  - Token yönetimi keycloakClient + interceptor ile tek noktadan yapılır (Authorization + X-Trace-Id + hata yönlendirmeleri).  

### 7.9 Deployment / Hosting & Ortamlar
- FE Webpack ile statik bundle üretir (dist/build); Node/SSR yok, BrowserRouter tabanlı SPA çalışır.
- Prod: Statik hosting/CDN (örn. Netlify veya eşdeğeri) üzerinde barındırılır; API çağrıları tek giriş noktası olan api-gateway’e `/api/v1/...` path’i ile gider. API_BASE_URL, KEYCLOAK_URL/REALM/CLIENT_ID gibi bilgiler ortam değişkenlerinden gelir (örn. `https://gateway.company.com/api/v1/...`).
- Local/dev: Webpack dev server `/api` path’ini `http://localhost:8080` (gateway) adresine proxy eder; Keycloak dev için `http://localhost:8081` kullanılır.
- Prod/test: Keycloak URL/Realm/ClientId değerleri environment değişkenlerinden alınır; keycloak-js client bu env’leri kullanır.

### 7.5 MFE Haritası

| MFE              | Port (dev) | Remote Entry                           | Başlıca Bağımlılıklar                | Deploy Path   |
|------------------|------------|----------------------------------------|--------------------------------------|---------------|
| shell            | 3000       | –                                      | tüm MFE’ler, UI Kit, i18n, react-query | `/`           |
| mfe-users        | 3004       | http://localhost:3004/remoteEntry.js   | shell-common, auth hook, TanStack Q  | `/users`      |
| mfe-access       | 3005       | http://localhost:3005/remoteEntry.js   | shell-common, TanStack Query         | `/access/roles` |
| mfe-reporting    | 3007       | http://localhost:3007/remoteEntry.js   | shell-common, AG Grid, variants API  | `/reports`    |
| mfe-audit        | 3006       | http://localhost:3006/remoteEntry.js   | AG Grid SSRM                         | `/audit`      |
| mfe-shell-common | 3004       | http://localhost:3004/remoteEntry.js   | Tailwind, icons, base UI components  | `shared`      |

### 7.6 İstek Akışları

#### 7.6.1 Users Grid (SSRM)
- AG Grid SSRM → service katmanı `/api/v1/users?page/pageSize/sort/search/advancedFilter` (STYLE-API-001 zarf).
- QueryClient üzerinden datasource; applyFilter/sort FE tarafında SSRM parametresi olarak gider.

#### 7.6.2 Access (Role/Permission)
- Role list/detail/update/clone/permission-assign → `/api/v1/roles/**`, permissions → `/api/v1/permissions`.
- TanStack useQuery/useMutation; başarılı mutasyon sonrası ilgili query’ler invalidate.
- Permission paneli checkbox list; RoleDetailDto.permissions ile senkron.

#### 7.6.3 Grid Variant Yönetimi
- Variants list/detail/create/update/delete/apply → `/api/v1/variants`.
- apply akışı: Variant config (columns/sortModel/filterModel) FE’de SSRM datasource’a uygulanır.
- ui-kit grid-variants helper’ları v1 DTO ile hizalı, isCompatible/default normalize edildi; public API `packages/ui-kit` üzerinden tüketilir.

### 7.7 Performans & Bundle Stratejisi
- Dynamic import: Route seviyeleri ve ağır bağımlılıklar (AG Grid, chart) için.
- Prefetch: Önemli rotalar için `mouseover/viewport` tetikleyicili `preloadModule`.
- Shared dependencies: `react`, `react-dom`, `zustand`, `@tanstack/react-query` MF seviyesinde singleton.

### 7.8 Güvenlik & Operasyon
- JWT Storage:
  - Access/refresh token yalnız bellek-içi store + Keycloak oturumunda tutulur; kalıcı storage kullanılmaz, BroadcastChannel desteklenmiyorsa sadece logout sinyalini yaymak için kısa süreli `localStorage` yazımı yapılır (token içeriği persist edilmez).
- CSP:
  - webpack/Vite plugin ile nonce; prod ortamlarında sıkı CSP.
- Sentry/telemetri:
  - traceId, userId ve mfeName ile zenginleştirilecek.
- CI/CD:
  - `pnpm` + turborepo/Nx benzeri ile MFE bazlı build; shell remote manifestleri tüketir.

### 7.9 Referanslar
- Style Guide: `STYLE-WEB-001.md`
- API Style Guide: `STYLE-API-001.md`
- Monorepo & proje yapısı: `WEB-PROJECT-LAYOUT.md`
- ADR’ler: `docs/05-governance/05-adr/`
- Playwright testleri: `frontend/e2e/` klasörü
