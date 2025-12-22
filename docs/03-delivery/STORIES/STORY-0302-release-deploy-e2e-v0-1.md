# STORY-0302 – Release & Deploy E2E v0.1 (Canlıya Alma ve Son Kullanıcıya Sunum)

ID: STORY-9999-release-deploy-e2e-v0-1  
Epic: OPS-RELEASE-E2E  
Status: Planned  
Owner: @team/platform  
Upstream: docs/00-handbook/DEV-GUIDE.md, docs/00-handbook/DOCS-WORKFLOW.md, docs/00-handbook/DOC-HIERARCHY.md, NUMARALANDIRMA-STANDARDI.md  
Downstream: AC-0302, TP-0302

-------------------------------------------------------------------------------
## 1. AMAÇ
-------------------------------------------------------------------------------

- PR → Prod hattında (docs/web/backend) deterministik “kalite kapısı” ve deploy sözleşmesini tek Story altında kilitlemek.  
- Son kullanıcıya sunumu (URL/ortamlar/rollback/doğrulama) denetlenebilir hale getirmek.  
- “Auto-merge yok” varsayımıyla PR-Bot + Merge-Bot modelini (label gate + checks PASS) standartlaştırmak.  

-------------------------------------------------------------------------------
## 2. TANIM
-------------------------------------------------------------------------------

- Bir platform/ops ekibi olarak, PR’dan prod’a kadar uçtan uca deterministik CI kapısı, publish bundle, deploy ve post-deploy doğrulama sözleşmesi istiyorum; böylece sürümleme/rollback ve kullanıcıya sunum tutarlı ve tekrar edilebilir olsun.

-------------------------------------------------------------------------------
## 3. KAPSAM VE SINIRLAR
-------------------------------------------------------------------------------

Dahil (v0.1):
- CI gate (ci-gate): always-run yaklaşımı + docs/web/backend/security alt gate matrisi.  
- PR-Bot + Merge-Bot: auto-merge olmadan label gate + squash merge.  
- WEB publish bundle: canonical root `web/dist` + required artefacts + URL contract.  
- WEB prod remote contract: localhost remotes yok; same-origin relative path contract.  
- URL şablonu (format sabit): app.<env>.<domain>, api.<env>.<domain>  
- Backend deploy: GHCR + self-hosted runner + prod compose sözleşmesi (tag/rollback/healthcheck).  
- DB migrations: Flyway expand/contract policy + breaking-change lint yaklaşımı.  
- Post-deploy validation: Web smoke (Playwright) + Backend healthchecks + minimum guardrail metrikleri.  

Kapsam dışı (v0.1):
- Provider seçimi (Netlify vs self-hosted) detaylarının tam implementasyonu (ayrı Story/ADR ile netleşir).  
- Tam observability stack kurulumu (Grafana/Prometheus/Sentry vb.) — sadece minimum ölçüm ve doğrulama kontratı.  

-------------------------------------------------------------------------------
## 4. ACCEPTANCE KRİTERLERİ
-------------------------------------------------------------------------------

- [ ] Given v0.1 doküman zinciri (STORY/AC/TP) ve PROJECT-FLOW SSOT güncel, When Doc QA çalıştırılır, Then kontroller PASS olmalıdır.  
- [ ] Given publish bundle contract `web/dist`, When web build+bundle çalışır, Then required artefacts eksiksiz olmalıdır.  
- [ ] Given prod webpack config’leri, When “localhost remote” taraması yapılır, Then prod config’te localhost kalmamalıdır.  
- [ ] Given backend deploy kontratı, When deploy sonrası healthcheck yapılır, Then servisler sağlıklı görünmelidir.  
- [ ] Given migration policy, When breaking change pattern’leri bulunur, Then lint FAIL etmelidir (forward-fix stratejisi).  

-------------------------------------------------------------------------------
## 5. BAĞIMLILIKLAR
-------------------------------------------------------------------------------

- GitHub repo policy: required checks / branch rules (Merge-Bot fail-safe için).  
- Self-hosted runner erişimi (prod/stage), GHCR auth ve secrets modeli (Vault → GH secrets).  
- Web artefact contract’ı: `web/netlify.toml` publish root hizası.  

-------------------------------------------------------------------------------
## 6. ÖZET
-------------------------------------------------------------------------------

- Uçtan uca release/deploy sözleşmesi (ci-gate + publish bundle + deploy + doğrulama) v0.1 olarak kilitlenir.  
- Auto-merge olmadan “tam insansız + kalite” için bot/label/check mantığı standardize edilir.  

-------------------------------------------------------------------------------
## 7. LİNKLER (İSTEĞE BAĞLI)
-------------------------------------------------------------------------------

- Story: docs/03-delivery/STORIES/STORY-0302-release-deploy-e2e-v0-1.md  
- Acceptance: docs/03-delivery/ACCEPTANCE/AC-0302-release-deploy-e2e-v0-1.md  
- Test Plan: docs/03-delivery/TEST-PLANS/TP-0302-release-deploy-e2e-v0-1.md  
- DEV-GUIDE: docs/00-handbook/DEV-GUIDE.md  
- DOCS-WORKFLOW: docs/00-handbook/DOCS-WORKFLOW.md  
- DOC-HIERARCHY: docs/00-handbook/DOC-HIERARCHY.md  
- RUNBOOK template: docs/99-templates/RUNBOOK.template.md  
- Web smoke runbook: docs/04-operations/RUNBOOKS/RB-web-playwright-smoke.md  

-------------------------------------------------------------------------------
## 8. NORMATİF CHECKLIST (SSOT)
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
