# TEST-PLAN – Staging Prod-Profile Geçişi

ID: TP-0319  
Story: STORY-0319-staging-prod-profile-migration  
Status: Planned  
Owner: @halil

Not: Aşağıdaki başlıklar ve sıralama **zorunludur**.

-------------------------------------------------------------------------------
## 1. AMAÇ
-------------------------------------------------------------------------------

- AC-0319 senaryolarının (profile migration + GHCR pull + Vault AppRole +
  doctor-infra guard + nginx cleanup) staging ortamında doğrulanmasını
  planlamak.
- Her senaryo için test katmanı (unit / integration / staging rehearsal /
  post-deploy CI), kanıt artefaktı ve fail kriteri tanımlamak.

-------------------------------------------------------------------------------
## 2. KAPSAM
-------------------------------------------------------------------------------

- Profile migration testleri: runtime (`docker exec printenv`) + compose
  default integrity (D-105 + C-103 korunması).
- Vault AppRole integration: `spring.cloud.vault.kv` secret fetch, boot
  log assertion, fail-fast disabled → graceful degradation path.
- GHCR pull flow: workflow step output, image digest assertion,
  credential rotation fallback.
- nginx workflow cleanup: stage/prod DEPLOY_ENV-aware path symmetry,
  hardcoded override removal.
- doctor-infra L1-L8 entegrasyonu: local run + post-deploy CI step
  (SSH tunnel ile staging host'a).
- Dalga 1 Stage 2 prereq doğrulaması: STORY-0319 tamamlandıktan sonra
  canary run önkoşulları karşılanıyor mu.

-------------------------------------------------------------------------------
## 3. STRATEJİ
-------------------------------------------------------------------------------

- **PR #1** (docs + truth alignment):
  - Doc-qa strictness check (AC/TP/RB zorunlu heading'ler).
  - STORY-0319 revizyonu: canary metrics üretimi Stage 2'ye taşı,
    acceptance "prereq" formuna al.
- **PR #2** (render contract + profile taşıma):
  - `render-backend-env.sh` unit test: `{SERVICE}_PROFILES` output shape.
  - `.env.prod.example` vs `deploy/docker-compose.prod.yml` drift test
    (API_GATEWAY_PORT = 8082 senkron).
  - Staging rehearsal: `RENDER_ENV_BEFORE_DEPLOY=true` deploy → canonical
    env profile prod,docker içerir.
- **PR #3** (Vault actuator + GHCR pull; scope: auth + permission):
  - Backend integration test: auth-service ve permission-service
    `application-prod.yml` Spring Cloud Vault + actuator bootstrap
    (Testcontainers Vault). report-service scope dışı.
  - GHCR pull staging rehearsal: `BUILD_LOCAL=false +
    DOCKER_PULL_POLICY=always` deploy → `docker images` assertion.
  - Actuator smoke: auth (8088) + permission (8090)
    `/actuator/health/vault` internal-only UP.
  - Break-glass runbook drill: GHCR rate-limit / Vault sealed-loop /
    host-side render token expired prosedürü manual check.
- **PR #4** (post-deploy CI guard + nginx cleanup):
  - deploy-backend workflow `post-deploy-doctor-infra` job eklenir.
  - nginx workflow stage/prod DEPLOY_ENV-aware fallback pattern.
  - CI smoke: stage deploy → doctor-infra PASS → workflow SUCCESS;
    fail scenario rehearsal (canonical env drift test artifact).

-------------------------------------------------------------------------------
## 4. TEST SENARYOLARI ÖZETİ
-------------------------------------------------------------------------------

- [ ] PR #1 doc strictness: AC-0319 + TP-0319 + RB-staging-prod-profile
  required headings (AMAÇ/KAPSAM/vb.) PASS
- [ ] PR #1 story revizyon: `docs/03-delivery/STORIES/STORY-0319-*` içinde
  `canary metrics prod-like` ifadesi kaldırıldı / Stage 2 prereq'ine
  taşındı
- [ ] PR #2 render-backend-env.sh unit: verilen profile input'ları
  output canonical env'inde `USER_SERVICE_PROFILES=prod,docker` ...
  7 servis için
- [ ] PR #2 drift fix: `.env.prod.example` API_GATEWAY_PORT=8082
  (şu an 8080 → drift) + prod compose ile senkron
- [ ] PR #2 staging rehearsal: deploy sonrası canonical env'de
  `REPORT_SERVICE_PROFILES=prod,docker` mevcut (no blank)
- [ ] PR #3 auth/permission `application-prod.yml` Testcontainers Vault
  bootstrap PASS (report-service scope dışı — host-side render devam)
- [ ] PR #3 deploy-backend workflow_dispatch inputs eklendi: `build_local`,
  `docker_pull_policy` (şu an sadece `env` input var — bkz. deploy-backend.yml:10-17)
- [ ] PR #3 GHCR pull rehearsal: staging deploy `docker pull` adımı
  SUCCESS, local-build fallback kullanılmıyor
- [ ] PR #3 Vault actuator smoke staging: auth (8088) + permission (8090)
  `/actuator/health/vault` status UP (log-parse değil)
- [ ] PR #3 break-glass drill: GHCR credential rotation + Vault sealed
  recovery prosedürü runbook'ta kayıtlı
- [ ] PR #4 doctor-infra CI smoke: deploy sonrası L1-L8 PASS; drift
  scenario FAIL → workflow RED
- [ ] PR #4 nginx cleanup: stage workflow hardcoded override
  kaldırıldı; script fallback + explicit vars tek kaynak
- [ ] Dalga 1 Stage 2 prereq doğrulaması: STORY-0319 complete sonrası
  `RB-zanzibar-canary.md` §3.1 önkoşullar (profile + JWT filter +
  doctor-infra PASS) karşılanıyor

-------------------------------------------------------------------------------
## 5. ORTAM VE VERİ
-------------------------------------------------------------------------------

- **Staging**: `ai.acik.com` (host-backed), self-hosted runner.
- **Test verisi**:
  - admin@example.com (super admin) — profile migration sonrası login +
    `/authz/me` superAdmin=True kalması gerekir
  - Canary personaları — `canary-read-only`, `canary-restricted`,
    `canary-scope-limited` (P1.9 persona) — canary run dışında prereq
    doğrulaması
- **Credentials**:
  - GHCR: `GHCR_USERNAME` + `GHCR_TOKEN` stage environment secrets
  - Vault: staging AppRole `backend-deploy-role` (host-side render akışı
    için — tüm servisler ortak canonical env üretimini bu role ile yapar;
    PR #377'de kurulmuş). PR #3 sonrası auth + permission için container-side
    `spring.cloud.vault` AppRole config'i eklenir; report-service scope dışı.
  - Keycloak: `canary-load` client (admin realm scope için) +
    `frontend` client (kullanıcı login için)

-------------------------------------------------------------------------------
## 6. DÖNÜT VE RAPOR
-------------------------------------------------------------------------------

- CI raporu feature-contract gating:
  - **PR #1 docs-only** → mevcut `zanzibar-prod-cutover-prep` contract
    retarget edilmez; docs-only path (STORIES/ACCEPTANCE/TEST-PLANS/RUNBOOKS)
    `policies/policy_ux_catalog_enforcement.v1.json` include scope dışı ve
    `**/*.md` exclude kuralına tabi — UX catalog mapping gerektirmez ve
    contract `change_path_globs` dışındadır (her iki gate docs-only PR için muaf).
  - **PR #2 retarget** → yeni `feature_execution_contract.v1.json`
    `feature_id=staging-prod-profile-migration` açılır, 0320 contract
    `prior_story_refs` listesine aktarılır. Path globs STORY-0319 kapsamı.
  - **PR #3 + PR #4** → aynı yeni contract altında, `change_path_globs`
    ilgili path'leri önceden içerir (retarget tek seferlik).
  - Her PR için `.cache/reports/feature_execution_contract_ci.v1.json`
    `status=PASS` (PR #1 hariç — docs-only).
- Staging rehearsal: PR #3 sonrası `.cache/reports/staging-prod-profile-rehearsal-<DATE>.md`
  elle yazılır (GHCR pull success + auth/permission `/actuator/health/vault`
  UP + doctor-infra PASS çıktısı).
- Post-deploy CI guard: PR #4 merge sonrası `.github/workflows/deploy-backend.yml`
  `post-deploy-doctor-infra` job adımının ardışık 5 başarılı run'ı
  (ilk 5 merge + smoke).
- Handoff: her PR için session handoff dosyası + master plan delta
  güncellenir.

-------------------------------------------------------------------------------
## 7. RİSKLER VE AZALTMA
-------------------------------------------------------------------------------

- **Vault sealed-loop** (AppRole aktif olunca): staging'de `VAULT_DEV_PATH`
  + unseal sidecar doğru konfigüre olmalı (RB-vault-dev-path-migration).
  Mitigasyon: break-glass `RENDER_ENV_BEFORE_DEPLOY=false` geçici rollback.
- **GHCR rate-limit / authentication fail**: staging deploy BLOCKED.
  Mitigasyon: `docker login ghcr.io` pre-step + token rotation runbook;
  emergency `BUILD_LOCAL=true` manual override (runbook §4).
- **Canonical env drift silent**: post-deploy doctor-infra PASS
  olmadan deploy FAIL eden CI guard eklenmezse manuel kaçabilir.
  PR #4 zorunlu.
- **D-105 + C-103 ihlali (compose default değişikliği)**: PR review'da
  `backend/docker-compose.yml` default'larının korunması check edilir;
  hardening SADECE canonical env + render contract üzerinden.
- **Prod template drift (API_GATEWAY_PORT 8080 vs 8082)**: PR #2
  template senkronizasyonu ile kapanır; yeni drift için doctor-infra
  I2/I3 check extend edilebilir.
- **Normatif çatışma tekrar oluşması (STORY ↔ runbook)**: PR #1 truth
  alignment ve runbook cross-reference ile kalıcı bağ.
