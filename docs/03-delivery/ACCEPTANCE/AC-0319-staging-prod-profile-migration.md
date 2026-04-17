# AC-0319 – Staging Prod-Profile Geçişi Acceptance

ID: AC-0319  
Story: STORY-0319-staging-prod-profile-migration  
Status: Planned  
Owner: @halil

-------------------------------------------------------------------------------
## 1. AMAÇ
-------------------------------------------------------------------------------

- STORY-0319 kapsamındaki staging'i prod-like profile'a geçirme iş paketinin
  kabul kriterlerini netleştirmek.
- "Prereq kapsamı" (profile + JWT filter + doctor-infra PASS) ile "canary
  metrics üretim kapsamı" (Dalga 1 Stage 2 synthetic canary run) ayrımını
  formal olarak çizmek — normatif çatışmayı kapatmak (STORY ↔ `RB-zanzibar-canary`).
- Her acceptance maddesinin runtime kanıt kaynağını (doctor-infra.sh check ID,
  workflow job, canlı endpoint) açıkça bağlamak.

-------------------------------------------------------------------------------
## 2. KAPSAM
-------------------------------------------------------------------------------

Prereq kapsamı (bu AC):
- 7 backend servis staging'de `SPRING_PROFILES_ACTIVE` içinde `local` YOK
- Gateway JWT filter staging'de aktif (`/api/*` token'sız 401/403)
- Vault AppRole + Spring Cloud Vault staging'de fiilen egzersiz edilir (disabled fallback yok)
- GHCR pull staging deploy'da gerçekten kullanılır (BUILD_LOCAL=false + DOCKER_PULL_POLICY=always)
- Canonical env render contract `{SERVICE}_PROFILES=prod,docker` taşır
- nginx gateway upstream DEPLOY_ENV-aware formal pattern (workflow ve script senkron)
- doctor-infra.sh L1-L8 staging post-deploy'ta otomatik çalıştırılır (CI guard)

Bu AC dışı:
- Zanzibar canary metrics prod-like değer üretimi → **Dalga 1 Stage 2
  synthetic canary run** (RB-zanzibar-canary.md + master plan Rev 23+ scope).
  STORY-0319 o run'ın **prereq'idir**, çıktısı değildir.
- Production rollout (sadece staging)
- OpenFGA model version management (Dalga 4 backlog)

-------------------------------------------------------------------------------
## 3. GIVEN / WHEN / THEN SENARYOLARI
-------------------------------------------------------------------------------

- [ ] Senaryo 1 — Profile runtime assertion (doctor-infra L1):
  - Given: Staging host'ta 7 backend container çalışıyor
    (user, auth, variant, core-data, api-gateway, permission, report).
  - When: `bash /home/halil/platform/repo/backend/scripts/doctor-infra.sh`
    çalışır.
  - Then: L1-{service} her servis için PASS döner;
    `SPRING_PROFILES_ACTIVE` içinde `local` kelimesi yok.

- [ ] Senaryo 2 — Gateway JWT filter (doctor-infra L2):
  - Given: Staging stack healthy.
  - When: `curl -X POST http://localhost:8090/api/v1/authz/check`
    token'sız çağrılır.
  - Then: HTTP 401 veya 403 döner (permitAll kapalı).

- [ ] Senaryo 3 — Canonical env drift guard (doctor-infra L3-L8):
  - Given: Deploy sonrası `/home/halil/platform/env/backend.env` canonical.
  - When: L3-L8 check'leri `ERP_OPENFGA_ENABLED`, `ERP_OPENFGA_STORE_ID`,
    `ERP_OPENFGA_MODEL_ID`, `PERMISSION_SERVICE_BASE_URL`, `AUTHZ_USER_TABLE`,
    `SECURITY_JWT_ISSUER(S)` değerlerini kontrol eder.
  - Then: Hepsi non-blank; `SECURITY_JWT_ISSUER(S)` `ai.acik.com` içerir.

- [ ] Senaryo 4 — Vault actuator smoke (auth + permission):
  - Given: PR #3 sonrası staging'de auth-service ve permission-service
    için Spring Cloud Vault container override aktif
    (`SPRING_CLOUD_VAULT_ENABLED=true`); report-service bu acceptance
    kapsamı dışı (host-side AppRole render ile secret fetch korunur).
  - When: Staging host'ta
    `curl -fsS http://localhost:8088/actuator/health/vault` ve
    `curl -fsS http://localhost:8090/actuator/health/vault` çağrılır.
  - Then: Her iki endpoint `{"status":"UP"}` döner; staging host
    internal-only (public değil). Log-parse fallback gerekmez.

- [ ] Senaryo 5 — GHCR pull staging deploy:
  - Given: `BACKEND_SSH_DEPLOY_ENABLED=true` + `BUILD_LOCAL=false` +
    `DOCKER_PULL_POLICY=always` staging deploy-backend workflow'unda.
  - When: Deploy-backend workflow `main` branch'e merge sonrası
    tetiklenir.
  - Then: `docker pull ghcr.io/halildeu/platform-ssot-<service>:sha-<commit>`
    adımı PASS döner; `docker images` çıktısı GHCR image ID'lerini listeler.

- [ ] Senaryo 6 — nginx gateway upstream DEPLOY_ENV-aware:
  - Given: Stage self-hosted runner ve prod SSH deploy yolları.
  - When: `deploy/ubuntu/run-frontend-nginx-container.sh` hem stage
    (DEPLOY_ENV=stage) hem prod (DEPLOY_ENV=prod) çağrılır.
  - Then: Stage'de upstream `http://127.0.0.1:8080`, prod'da
    `http://127.0.0.1:8082` render edilir; workflow-level hardcoded
    override yok, tek kaynak script fallback + explicit `WEB_GATEWAY_UPSTREAM`.

- [ ] Senaryo 7 — Post-deploy CI guard:
  - Given: deploy-backend workflow başarılı tamamlanır.
  - When: Workflow `post-deploy-doctor-infra` job'ı çalışır (staging
    host'ta SSH ile `doctor-infra.sh` koşturulur).
  - Then: L1-L8 PASS → workflow SUCCESS; FAIL → workflow RED + annotation
    "staging-prod-profile drift tespit edildi" + rollback prosedürü çağrısı.

-------------------------------------------------------------------------------
## 4. NOTLAR / KISITLAR
-------------------------------------------------------------------------------

- **D-105 + C-103 korunur:** `backend/docker-compose.yml` default
  `SPRING_PROFILES_ACTIVE=local,docker` değişmez. Hardening canonical env
  + render contract + runtime guard üzerinden yapılır.
- **Compose vault disabled default korunur:** bazı servislerde
  `SPRING_CLOUD_VAULT_ENABLED=false` default (compose) — staging canonical
  env `SPRING_CLOUD_VAULT_ENABLED=true` override eder.
- **Canonical env repo'da versioned tutulmaz:** `backend/.env.prod.example`
  template kaynak; staging canonical `/home/halil/platform/env/backend.env`
  sadece staging host'ta. Drift guard doctor-infra + post-deploy CI ile.
- **Runbook:** `RB-staging-prod-profile` prod-like migration steps +
  rollback + staging regression guard.
- **Normatif truth alignment:** STORY-0319 metni acceptance'a `canary
  metrics üretir` yazdığı durum revize edildi. `as-written` rolü:
  "Dalga 1 Stage 2 synthetic canary run'un prereq'i — profile + JWT +
  doctor PASS". Canary metric üretimi bu story'nin çıktısı değil.
- **Feature contract kararı (2026-04-17):**
  - PR #1 **docs-only** — mevcut `feature_execution_contract.v1.json`
    (`feature_id=zanzibar-prod-cutover-prep`) retarget edilmez; STORY-0319
    dokümanları contract dışı kalır. Docs-only PR'lar UX catalog mapping
    gate'ine de tabi değildir — `policies/policy_ux_catalog_enforcement.v1.json`
    include scope `web/**`, `frontend/**`, `mobile/**`, `apps/**`, `ui/**`,
    `extensions/**/web/**`, `extensions/**/src/**` ile sınırlı ve `**/*.md`
    açıkça exclude edilmiş. Bu PR'daki 4 markdown dokümanı UX catalog
    scope dışı, enforcement-check mapping gerektirmez.
  - PR #2 merge'ünden önce yeni `feature_execution_contract.v1.json`
    retarget: `feature_id=staging-prod-profile-migration`, path globs
    STORY-0319 kapsamına daraltılır (render-backend-env.sh, .env.prod.example,
    deploy-backend.yml, doctor-infra.sh, RB-staging-prod-profile.md).
    0320 contract `prior_story_refs` listesine aktarılır (izlenebilirlik).
  - Bu ayrım uzun vadede STORY-0319 ve STORY-0320 iş akışlarının CI
    enforcement-check gating'ini birbirinden izole eder — one story,
    one contract, one verdict.

-------------------------------------------------------------------------------
## 5. ÖZET
-------------------------------------------------------------------------------

- 7 senaryo STORY-0319 "staging = prod-like" prereq'ini doğrular.
- Canary metrics üretim acceptance'ı Dalga 1 Stage 2'ye taşındı
  (truth alignment).
- Runtime evidence zinciri: doctor-infra L1-L8 → post-deploy CI guard
  → her deploy sonrası fail-closed.
- 4 PR iskeleti: PR #1 (docs + truth alignment), PR #2 (render contract
  + profile taşıma), PR #3 (Vault AppRole + GHCR pull staging egzersiz),
  PR #4 (post-deploy CI guard + nginx workflow cleanup).

-------------------------------------------------------------------------------
## 6. LİNKLER (İSTEĞE BAĞLI)
-------------------------------------------------------------------------------

- Story: `docs/03-delivery/STORIES/STORY-0319-staging-prod-profile-migration.md`
- Test plan: `docs/03-delivery/TEST-PLANS/TP-0319-staging-prod-profile-migration.md`
- Runbook: `docs/04-operations/RUNBOOKS/RB-staging-prod-profile.md`
- Canary runbook (downstream): `docs/04-operations/RUNBOOKS/RB-zanzibar-canary.md`
- Env drift guard runbook: `docs/04-operations/RUNBOOKS/RB-backend-env-drift-guard.md`
- Decision registry: `decisions/topics/security-local-dev.v1.json` (D-105 + C-103)
- Master plan: `.claude/plans/zanzibar-master-plan.md`
