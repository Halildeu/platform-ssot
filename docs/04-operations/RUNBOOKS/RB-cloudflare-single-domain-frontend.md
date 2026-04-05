# RB-cloudflare-single-domain-frontend – Cloudflare Single Domain Frontend

ID: RB-cloudflare-single-domain-frontend
Service: cloudflare-single-domain-frontend
Status: Draft
Owner: @team/platform

-------------------------------------------------------------------------------
1. AMAÇ
-------------------------------------------------------------------------------

- `ai.acik.com` altında shell, remote MFE artefaktları ve `/api` proxy'sini tek origin olarak yayınlamak.
- Frontend statik dağıtımı Cloudflare edge üzerinde tutarken backend gateway'i Ubuntu origin'inde bırakmak.
- Tek domain altında CORS yükünü azaltmak ve Module Federation remote sözleşmesini path-bazlı hale getirmek.

-------------------------------------------------------------------------------
2. KAPSAM
-------------------------------------------------------------------------------

- Bu runbook aşağıdaki tek-domain yayın modelini kapsar:
  - `/` -> `mfe-shell`
  - `/remoteEntry.js` -> `mfe-shell` Module Federation entry
  - `/remotes/users/*` -> `mfe-users`
  - `/remotes/access/*` -> `mfe-access`
  - `/remotes/audit/*` -> `mfe-audit`
  - `/remotes/reporting/*` -> `mfe-reporting`
  - `/api/*` -> Ubuntu backend gateway
  - `/actuator/*` -> Ubuntu backend gateway
- Repo artefaktları:
  - `web/deploy/cloudflare/worker.mjs`
  - `web/deploy/cloudflare/wrangler.ai-acik-com.example.jsonc`
  - `web/scripts/cloudflare/render-wrangler-config.mjs`
  - `web/scripts/cloudflare/build-single-domain.mjs`

-------------------------------------------------------------------------------
3. BAŞLATMA / DURDURMA
-------------------------------------------------------------------------------

Build ve assemble adımları:

- Varsayılan çekirdek remote setiyle build:
  - `cd web && npm run build:cloudflare:single-domain`
- Opsiyonel remote'ları dahil ederek build:
  - `cd web && CF_INCLUDE_SUGGESTIONS=true CF_INCLUDE_ETHIC=true CF_INCLUDE_SCHEMA_EXPLORER=true npm run build:cloudflare:single-domain`
- Çıktı dizini:
  - `web/dist/cloudflare-single-domain`
- Assemble çıktısında beklenen minimum dosyalar:
  - `index.html`
  - `cloudflare-manifest.json`
  - `remotes/users/remoteEntry.js`
  - `remotes/access/remoteEntry.js`
  - `remotes/audit/remoteEntry.js`
  - `remotes/reporting/remoteEntry.js`
- Gerekli runtime env:
  - `CLOUDFLARE_PUBLIC_ORIGIN=https://ai.acik.com`
  - `VITE_GATEWAY_URL=https://ai.acik.com/api`
  - `MFE_USERS_URL=https://ai.acik.com/remotes/users/remoteEntry.js`
  - `MFE_ACCESS_URL=https://ai.acik.com/remotes/access/remoteEntry.js`
  - `MFE_AUDIT_URL=https://ai.acik.com/remotes/audit/remoteEntry.js`
  - `MFE_REPORTING_URL=https://ai.acik.com/remotes/reporting/remoteEntry.js`
  - `CLOUDFLARE_WORKER_NAME=ai-acik-com`
  - `CLOUDFLARE_ZONE_NAME=ai.acik.com`
  - `CLOUDFLARE_ROUTE_PATTERN=ai.acik.com/*`
  - `CLOUDFLARE_ACCOUNT_ID=<cloudflare-account-id>`
  - `CLOUDFLARE_BACKEND_ORIGIN=https://<cloudflare-reachable-origin>`

-------------------------------------------------------------------------------
4. GÖZLEMLEME / LOG / METRİKLER
-------------------------------------------------------------------------------

- Build çıktısı:
  - `web/dist/cloudflare-single-domain/cloudflare-manifest.json`
  - `web/dist/cloudflare-single-domain/index.html`
  - `web/dist/cloudflare-single-domain/remotes/*/remoteEntry.js`
- Cloudflare Worker gözlemleri:
  - `/api/*` ve `/actuator/*` istekleri origin proxy loglarında görünmelidir.
  - `remoteEntry.js` yanıtları `no-store` cache başlığıyla dönmelidir.
  - HTML yanıtları `must-revalidate` cache başlığıyla dönmelidir.
  - `CLOUDFLARE_BACKEND_ORIGIN` private `10.x` ise deploy öncesi blocker kabul edilmelidir.
- Smoke doğrulamaları:
  - `GET /`
  - `GET /remoteEntry.js`
  - `GET /remotes/users/remoteEntry.js`
  - `GET /remotes/access/remoteEntry.js`
  - `GET /remotes/audit/remoteEntry.js`
  - `GET /remotes/reporting/remoteEntry.js`
  - `GET /api/actuator/health` veya Cloudflare route'u üzerinden backend health yüzeyi

-------------------------------------------------------------------------------
5. ARIZA DURUMLARI VE ADIMLAR
-------------------------------------------------------------------------------

- [ ] Arıza senaryosu 1 – `remoteEntry.js` 404 dönüyor
  - Given: `GET /remotes/<slug>/remoteEntry.js` başarısız
  - When: Cloudflare asset route doğru ama dosya yok
  - Then:
    - `web/dist/cloudflare-single-domain/remotes/<slug>/remoteEntry.js` dosyasının assemble çıktısında bulunduğunu doğrula.
    - İlgili remote build logunu kontrol et.
    - `build-single-domain.mjs` içinde remote slug/path eşleşmesini doğrula.

- [ ] Arıza senaryosu 2 – `/api` istekleri origin'e ulaşmıyor
  - Given: frontend açılıyor ama backend çağrıları hata veriyor
  - When: Worker proxy path'leri 5xx veya timeout dönüyor
  - Then:
    - `CLOUDFLARE_BACKEND_ORIGIN` değerini doğrula.
    - Worker route'unun `/api/*` ve `/actuator/*` path'lerini origin'e taşıdığını doğrula.
    - Origin'in Cloudflare edge tarafindan erisilebilir oldugunu doğrula.
    - Ubuntu gateway health yüzeyinin origin tarafinda erişilebilir olduğunu doğrula.

- [ ] Arıza senaryosu 3 – Shell açılıyor ama remote yüklenmiyor
  - Given: shell render oldu, ilgili ekran remote yüklerken düşüyor
  - When: `MFE_*_URL` runtime değerleri eski veya farklı origin'e bakıyor
  - Then:
    - `cloudflare-manifest.json` ile runtime env URL'lerini karşılaştır.
    - Shell build'inin aynı origin path sözleşmesiyle üretildiğini doğrula.
    - Gerekirse ilgili path için Cloudflare cache purge uygula.

-------------------------------------------------------------------------------
6. ÖZET
-------------------------------------------------------------------------------

- Shell ve çekirdek remotelar tek komutla path-bazlı Cloudflare bundle'ına assemble edilir.
- Tek-domain modelinde frontend aynı origin'den, backend ise Worker proxy üzerinden servis edilir.
- Public canlı için dış bağımlılık Cloudflare zone/delegation ve route tanımıdır.

-------------------------------------------------------------------------------
7. LİNKLER (İSTEĞE BAĞLI)
-------------------------------------------------------------------------------

- `wrangler.ai-acik-com.example.jsonc` dosyası zone ve route bilgileri geldikten sonra gerçek `wrangler.jsonc` haline getirilir.
- `render-wrangler-config.mjs`, GitHub environment var/secret degerlerinden gercek deploy config'ini uretir.
- `worker.mjs`, `/api` ve `/actuator` path'lerini `BACKEND_ORIGIN` hedefine proxy eder.
- `remoteEntry.js` dosyaları `no-store`, HTML yanıtları `must-revalidate` cache başlıklarıyla servis edilir.
- Public canlı için Cloudflare zone veya child-zone delegation tarafı tamamlanmış olmalıdır.
