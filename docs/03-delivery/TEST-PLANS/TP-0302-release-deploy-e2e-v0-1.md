# TP-0302 – Release & Deploy E2E v0.1 Test Plan

ID: TP-0302  
Story: STORY-0302-release-deploy-e2e-v0-1  
Status: Planned  
Owner: @team/platform

-------------------------------------------------------------------------------
## 1. AMAÇ
-------------------------------------------------------------------------------

- PR → Prod hattının (docs/web/backend) deterministik gate + deploy + doğrulama sözleşmesini test etmek.

-------------------------------------------------------------------------------
## 2. KAPSAM
-------------------------------------------------------------------------------

- L1 (docs-only): Doc QA + chain checks + PROJECT-FLOW SSOT.  
- L2 (deterministik): Web build/publish bundle assert + prod remote contract; Backend build/test + migration lint.  
- L3 (ops): Deploy stage smoke + rollback prosedürünün kontrollü testi.  

-------------------------------------------------------------------------------
## 3. STRATEJİ
-------------------------------------------------------------------------------

- “Always-run ci-gate” yaklaşımında, path bazlı değişime göre alt gate’ler seçici koşulur (ama tek required check tek PASS/FAIL üretir).  
- Docs-only PR’larda sadece doc gate koşar; web/backend gate noop veya skip olur.  
- Mixed PR’larda (docs+web, web+backend) ilgili tüm gate’ler birlikte PASS olmalıdır.  

-------------------------------------------------------------------------------
## 4. TEST SENARYOLARI ÖZETİ
-------------------------------------------------------------------------------

- [ ] Senaryo 1 – Docs-only PR (docs/**):
  - Beklenen: Doc QA + doc chain PASS, web/backend gate noop/skip (fail etmez).  

- [ ] Senaryo 2 – Web-only PR (web/**):
  - Beklenen: npm determinism + build + publish bundle assert PASS.  
  - Beklenen: prod remote contract (localhost yok) doğrulanır.  

- [ ] Senaryo 3 – Backend-only PR (backend/**):
  - Beklenen: Maven unit/compile PASS, container build/publish aşaması (varsa) PASS.  
  - Beklenen: migration policy lint (breaking change) FAIL/ALLOWLIST davranışı beklenen şekilde.  

- [ ] Senaryo 4 – Mixed PR (web/** + backend/**):
  - Beklenen: web + backend gate’leri birlikte PASS; fail-fast yok (tüm bulgular raporlanır).  

- [ ] Senaryo 5 – Deploy stage smoke (staging/prod):
  - Beklenen: web smoke PASS, backend healthchecks PASS, guardrail metrikleri eşik altında.  

- [ ] Senaryo 6 – Rollback testi:
  - Beklenen: önceki artefact/image tag’a dönüş sonrası healthcheck + smoke tekrar PASS.  

-------------------------------------------------------------------------------
## 5. ÇEVRE VE ARAÇLAR
-------------------------------------------------------------------------------

- CI: GitHub Actions (Node 20, Python 3.11, Maven).  
- Web: `npm ci`, `npm run build`, publish bundle + artefact assert.  
- Backend: Maven test + (opsiyonel) Docker build/push; Flyway migration policy.  
- Ops: self-hosted runner, GHCR, docker-compose, curl healthcheck, Playwright smoke.  

-------------------------------------------------------------------------------
## 6. RİSKLER / ÖNCELİKLER
-------------------------------------------------------------------------------

- Required checks + path filters çakışması (missing check) → ci-gate stratejisiyle minimize edilir.  
- Publish bundle olmadan prod remotes 404 riski → artefact assert “hard fail” olmalıdır.  
- DB rollback çoğu zaman mümkün değil → forward-fix + expand/contract kural seti netleşmelidir.  

-------------------------------------------------------------------------------
## 7. ÖZET
-------------------------------------------------------------------------------

- Bu TP, docs/web/backend değişim tiplerine göre gate’lerin deterministik çalıştığını ve deploy sonrası doğrulama/rollback kontratını test eder.

-------------------------------------------------------------------------------
## 8. LİNKLER (İSTEĞE BAĞLI)
-------------------------------------------------------------------------------

- Story: docs/03-delivery/STORIES/STORY-0302-release-deploy-e2e-v0-1.md  
- Acceptance: docs/03-delivery/ACCEPTANCE/AC-0302-release-deploy-e2e-v0-1.md  

-------------------------------------------------------------------------------
## 9. NORMATİF CHECKLIST (SSOT)
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

