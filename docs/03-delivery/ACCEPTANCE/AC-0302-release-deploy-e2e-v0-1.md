# AC-0302 – Release & Deploy E2E v0.1 Acceptance

ID: AC-0302  
Story: STORY-0302-release-deploy-e2e-v0-1  
Status: Planned  
Owner: @team/platform

-------------------------------------------------------------------------------
## 1. AMAÇ
-------------------------------------------------------------------------------

- Release/Deploy hattının “kalite kapısı” ve kullanıcıya sunum sözleşmesini test edilebilir kabul kriterlerine çevirmek.

-------------------------------------------------------------------------------
## 2. KAPSAM
-------------------------------------------------------------------------------

- CI gate (ci-gate) + required checks stratejisi.  
- Web publish bundle (`web/dist`) + prod remote URL contract (localhost yok).  
- Backend deploy (GHCR + runner + compose) + healthcheck.  
- Flyway migration policy (expand/contract) + breaking-change lint yaklaşımı.  
- Post-deploy doğrulama: web smoke + backend health + minimum guardrail metrikleri.  

-------------------------------------------------------------------------------
## 3. GIVEN / WHEN / THEN SENARYOLARI
-------------------------------------------------------------------------------

### Ortak

- [ ] Senaryo 1 – Doküman zinciri ve SSOT güncel:
  - Given: `STORY-0302`, `AC-0302`, `TP-0302` ve `docs/03-delivery/PROJECT-FLOW.tsv` günceldir.  
  - When: Doc QA ve zincir kontrolleri çalıştırılır.  
  - Then: Şablon/ID/lokasyon/zincir kontrolleri PASS olmalıdır.  
  - Kanıt/Evidence (önerilen):
    - Script: `python3 scripts/check_doc_ids.py`  
    - Script: `python3 scripts/check_doc_locations.py`  
    - Script: `python3 scripts/check_doc_templates.py`  
    - Script: `python3 scripts/check_story_links.py STORY-0302`  
    - Script: `python3 scripts/check_doc_chain.py STORY-0302`  

### Web

- [ ] Senaryo 2 – Publish bundle contract (canonical `web/dist`):
  - Given: `web/netlify.toml` publish root “dist” olarak tanımlıdır.  
  - When: Web build + publish bundle çalıştırılır.  
  - Then: `web/dist` altında required artefacts bulunur (index.html + remoteEntry.js + remotes).  
  - Kanıt/Evidence (önerilen):
    - Dosya: `web/netlify.toml`  
    - Komut: `npm -C web ci && npm -C web run build`  
    - Komut: `npm -C web run publish:bundle`  

- [ ] Senaryo 3 – Prod remote contract (localhost yok):
  - Given: Prod webpack config’leri repoda bulunur.  
  - When: “localhost” taraması yapılır.  
  - Then: Prod config’te localhost remote URL kalmamalıdır.  
  - Kanıt/Evidence (önerilen):
    - Dosya: `web/apps/mfe-shell/webpack.prod.js`  
    - Dosya: `web/apps/mfe-reporting/webpack.prod.js`  
    - Dosya: `web/apps/mfe-users/webpack.prod.js`  

### Backend

- [ ] Senaryo 4 – Deploy sonrası healthcheck:
  - Given: Backend servisleri health endpoint sunar (Spring Actuator).  
  - When: Deploy tamamlandıktan sonra healthcheck çağrıları yapılır.  
  - Then: Kritik servisler “UP” dönmelidir (gateway/auth/user/permission).  
  - Kanıt/Evidence (önerilen):
    - Referans: `backend/docker-compose.yml` (healthcheck örnekleri)  
    - Komut: `curl -fsS http://<host>:8080/actuator/health`  

### Operations / E2E

- [ ] Senaryo 5 – Post-deploy web smoke:
  - Given: Web smoke runbook’u tanımlıdır.  
  - When: Deploy sonrası smoke senaryoları çalıştırılır.  
  - Then: Smoke PASS olmalıdır (kritik route’lar açılır, konsol error=0 hedefi).  
  - Kanıt/Evidence (önerilen):
    - Runbook: `docs/04-operations/RUNBOOKS/RB-web-playwright-smoke.md`  
    - Komut: `npm -C web run smoke:playwright`  

-------------------------------------------------------------------------------
## 4. NOTLAR / KISITLAR
-------------------------------------------------------------------------------

- “Breaking migration” durumunda geri alma yerine forward-fix varsayımı (expand/contract) dokümante edilmelidir.  
- Publish bundle ve prod remote contract, hosting sağlayıcısından bağımsız (relative path) olmalıdır.  

-------------------------------------------------------------------------------
## 5. ÖZET
-------------------------------------------------------------------------------

- Doc chain + PROJECT-FLOW SSOT deterministik PASS.  
- Web artefact (publish bundle) ve prod remote contract doğrulanabilir.  
- Backend deploy sonrası healthcheck + smoke koşumları tanımlı.  

-------------------------------------------------------------------------------
## 6. LİNKLER (İSTEĞE BAĞLI)
-------------------------------------------------------------------------------

- Story: docs/03-delivery/STORIES/STORY-0302-release-deploy-e2e-v0-1.md  
- Test Plan: docs/03-delivery/TEST-PLANS/TP-0302-release-deploy-e2e-v0-1.md  

-------------------------------------------------------------------------------
## 7. NORMATİF CHECKLIST (SSOT)
-------------------------------------------------------------------------------

**WEB Release Readiness Checklist v0.1**

**Keşif Özeti**
- Netlify publish kökü `web/dist` bekliyor (`web/netlify.toml:7`), SRI artefact path’leri de `dist/**` bekliyor (`web/security/sri-manifest.json:5`); fakat build çıktıları şu an `web/apps/dist/**` + `web/apps/mfe-audit/dist` + `web/apps/mfe-reporting/dist` altında.
- Shell prod remote URL contract’ı hardcoded ve same-origin path: `web/apps/mfe-shell/webpack.prod.js:19`.
- Prod config’te iki kritik sapma var:
  - Reporting → Shell remote’u localhost: `web/apps/mfe-reporting/webpack.prod.js:17`
  - Users → Reporting remote’u yanlış path: `web/apps/mfe-users/webpack.prod.js:21`

**Tasarım**
- **1) WEB Publish Bundle Contract v0.1 (canonical root = `web/dist`)**
  - **Dosya ağacı (minimum)**
    - `web/dist/`
      - `index.html` (shell)
      - `remoteEntry.js` (shell)
      - `access/remoteEntry.js`
      - `ethic/remoteEntry.js`
      - `users/remoteEntry.js`
      - `suggestions/remoteEntry.js`
      - `audit/remoteEntry.js` (varsa/isteniyorsa)
      - `reports/remoteEntry.js` (varsa/isteniyorsa)
      - (opsiyonel) `ui-kit/remoteEntry.js`
      - `*.js`, `*.css`, `*.map` (index.html/remoteEntry’nin referans ettiği chunk’lar)
  - **Required artefacts**
    - Zorunlu: `index.html`, `/remoteEntry.js`, `/access/remoteEntry.js`, `/ethic/remoteEntry.js`, `/users/remoteEntry.js`, `/suggestions/remoteEntry.js`
    - Şarta bağlı: `/audit/remoteEntry.js`, `/reports/remoteEntry.js` (shell prod remotes bunları bekliyor: `web/apps/mfe-shell/webpack.prod.js:22` ve `web/apps/mfe-shell/webpack.prod.js:24`)
  - **URL contract (host bağımsız / absolute URL yok)**
    - Shell: `/<root>/remoteEntry.js` (same-origin path)
    - Remotes: `/<root>/<mfe>/remoteEntry.js` (örn. `/users/remoteEntry.js`, `/reports/remoteEntry.js`)
    - Prod remotes için referans: `web/apps/mfe-shell/webpack.prod.js:19`

- **2) Publish bundle step – en düşük riskli yaklaşım**
  - Öneri: **bash script** (Netlify/CI için ekstra runtime bağımlılığı eklemez; repo zaten bash CI script’leri kullanıyor).
  - **Temizle davranışı**
    - Sadece `web/dist` temizlenir (canonical publish root); `web/apps/dist` gibi kaynak output’lar temizlenmez (paralel build nedeniyle race riskini artırır; shell’de `clean:false` bunun için: `web/apps/mfe-shell/webpack.prod.js:13` + paralel build: `web/package.json:48`).
  - **Kopyalama map’i (source → dest)**
    - `web/apps/dist/*` → `web/dist/`
    - `web/apps/mfe-audit/dist/*` → `web/dist/audit/` (varsa/isteniyorsa)
    - `web/apps/mfe-reporting/dist/*` → `web/dist/reports/` (varsa/isteniyorsa)
    - (opsiyonel) `web/packages/dist/ui-kit/*` → `web/dist/ui-kit/`
  - **Eksik dist olursa fail**
    - CI için öneri: audit/reports “varsa” yerine pratikte **shell prod remotes’ta referanslandığı sürece required** say (aksi halde runtime 404).
    - Eğer erken aşamada opsiyonel kalacaksa: `REQUIRE_AUDIT=0/1`, `REQUIRE_REPORTS=0/1` gibi env flag ile kontrol (default: 1).
  - **“publish:bundle PASS” kriterleri**
    - `web/dist/index.html` ve `web/dist/remoteEntry.js` var
    - `web/dist/{access,ethic,users,suggestions}/remoteEntry.js` var
    - (opsiyonel/flag) `web/dist/{audit,reports}/remoteEntry.js` var
    - Kopyalama sonrası bu dosyalar yoksa exit code != 0

- **3) webpack.prod.js – minimum patch listesi (relative path contract’a uyum)**
  - `web/apps/mfe-reporting/webpack.prod.js:17` → `mfe_shell` remote: `http://localhost:3000/remoteEntry.js` yerine `mfe_shell@/remoteEntry.js`
  - `web/apps/mfe-users/webpack.prod.js:21` → `mfe_reporting` remote: `mfe_reporting@/remoteEntry.js` yerine `mfe_reporting@/reports/remoteEntry.js`
  - Doğrulama sinyali: shell zaten `/reports/remoteEntry.js` bekliyor (`web/apps/mfe-shell/webpack.prod.js:24`)

- **4) SRI (sri-manifest.json) gereksinimi değerlendirmesi**
  - Şu an CI/workflow’larda SRI check çalışmıyor (workflow’larda `verify-sri.mjs` referansı yok; script mevcut: `web/scripts/security/verify-sri.mjs:18`).
  - SRI “required” yapılacaksa:
    - Ön koşul: publish bundle ile artefact’ler gerçekten `web/dist/**` altında üretilmeli (manifest zaten `dist/**` bekliyor: `web/security/sri-manifest.json:5`).
    - Kapsam kararı: shell prod’da kullanılan remotes için manifest’e `audit` ve `reports` de eklenmeli (aksi halde SRI coverage eksik kalır).
  - Not: Mevcut kodda runtime’da `integrity=` kullanım sinyali yok; bu yüzden SRI şu aşamada “build-time guardrail” olarak değer katar, “runtime enforcement” değil.

**Uygulama Adımları**
- `web/scripts/ci/publish_bundle.sh` → `web/dist` clean + copy map + assert + fail-fast (opsiyonel REQUIRE_* flag’leri)
- `web/package.json` → `publish:bundle` (ve gerekirse `build:publish`) script’lerini ekle; Netlify/CI bu script’i çağıracak şekilde hizala
- `web/apps/mfe-reporting/webpack.prod.js` → `mfe_shell` remote’u same-origin path’e çek
- `web/apps/mfe-users/webpack.prod.js` → `mfe_reporting` remote path’ini `/reports/remoteEntry.js` yap
- `web/security/sri-manifest.json` → (SRI required olacaksa) `audit`/`reports` artefact kayıtlarını ekle + rotasyon akışını netleştir
- `.github/workflows/ci-gate.yml` (veya mevcut `web-qa.yml`) → web gate’e `build + publish bundle + artefact assert` adımını ekle

