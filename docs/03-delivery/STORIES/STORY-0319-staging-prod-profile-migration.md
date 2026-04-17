# STORY-0319: Staging'i Prod Profile'a Geçirme

ID: STORY-0319-staging-prod-profile-migration
Epic: EPIC-infra-canary-readiness
Status: Planned
Owner: @halil
Risk_Level: high
Upstream: feedback_infra_stability.md (2026-04-14 kullanıcı direktifi)
Downstream: AC-0319, TP-0319, RB-staging-prod-profile

Not: Aşağıdaki başlıklar ve sıralama **zorunludur**.

-------------------------------------------------------------------------------
1. AMAÇ
-------------------------------------------------------------------------------

- Staging ortamını gerçek canary testi yapılabilir hale getirmek.
- Local profile permit-all davranışı staging'de JWT/OpenFGA katmanını devre
  dışı bırakıyor; bu canary/Zanzibar doğrulamasını anlamsız kılıyor.
- Kullanıcı direktifi (2026-04-14): "Local yalnızca geliştirici makinesinde;
  staging = prod-like."

-------------------------------------------------------------------------------
2. TANIM
-------------------------------------------------------------------------------

- Kısa story tanımı:
  - Bir platform mühendisi olarak, staging'e attığım yeni authz/Vault/Keycloak
    değişikliklerinin production'da olacağı gibi çalıştığını görmek istiyorum;
    böylece canary metrics'i (deny rate, tuple sync, explain) gerçek yük altında
    doğrulanabilir.

-------------------------------------------------------------------------------
3. KAPSAM VE SINIRLAR
-------------------------------------------------------------------------------

- Kapsam:
  - 7 backend servis `SPRING_PROFILES_ACTIVE=prod,docker` veya eşdeğeri
    (`local` kaldırılır)
  - Staging GHCR image pull çalışır — 2026-04-13 crash sonrası kalıcı fix
  - Keycloak issuer/audience staging hostname ile uyumlu (canlı
    `https://ai.acik.com/realms/serban`)
  - Vault AppRole credentials staging'de çalışır; secrets gerçekten okunur
  - nginx `WEB_GATEWAY_UPSTREAM` DEPLOY_ENV-aware (staging 8080 / prod 8082)
  - doctor-infra.sh yeni check: staging'de `SPRING_PROFILES_ACTIVE` içinde
    `local` görülürse FAIL
- Sınır dışı:
  - Production environment (bu story sadece staging)
  - Tam feature-parity test plan (ayrı TP-0319)
  - Rollback düzenlemesi (RB-staging-prod-profile'de detaylandırılacak)

-------------------------------------------------------------------------------
4. ACCEPTANCE KRİTERLERİ
-------------------------------------------------------------------------------

> **Truth alignment (2026-04-17):** Önceki "canary metrics prod-like üretiyor"
> acceptance ifadesi normatif çatışma üretiyordu (`RB-zanzibar-canary.md`
> STORY-0319'u Stage 2 **prereq** olarak konumluyor, çıktısı değil). Acceptance
> metin revize edildi — canary metrics üretimi bu story'nin ÇIKTISI değil,
> sonraki iş paketidir (Dalga 1 Stage 2 synthetic canary run).

Prereq kapsamı (bu story'nin kapanışı):

- `docker exec platform-*-1 env | grep SPRING_PROFILES_ACTIVE` çıktısında
  hiçbir servis için `local` yok (7 servis: user, auth, variant, core-data,
  api-gateway, permission, report). doctor-infra L1 doğrular.
- `curl -X POST http://localhost:8090/api/v1/authz/check` auth'suz istek
  **401/403** döner (permitAll kapalı). doctor-infra L2 doğrular.
- Canonical env (`/home/halil/platform/env/backend.env`) `ERP_OPENFGA_*` +
  `PERMISSION_SERVICE_BASE_URL` + `AUTHZ_USER_TABLE` + `SECURITY_JWT_ISSUER(S)`
  non-blank. doctor-infra L3-L8 doğrular.
- Vault-backed secret okuma staging'de FİİLEN egzersiz edilir:
  auth-service ve permission-service container'larında Spring Cloud
  Vault client aktif (PR #3'te staging-specific override); actuator
  `/health/vault` endpoint internal-only "UP" döner. report-service
  bu turda kapsam dışı — mevcut host-side AppRole render pattern
  ile secret fetch korunur (in-container client egzersizi follow-up).
- GHCR image pull staging deploy'da GERÇEKTEN kullanılır:
  `BUILD_LOCAL=false` + `DOCKER_PULL_POLICY=always` workflow config +
  `docker pull ghcr.io/halildeu/platform-ssot-<service>:sha-<commit>` adım
  SUCCESS + `docker images` staging host'ta GHCR digest'leri listeler.
- nginx `/api/*` 200 döner; upstream `127.0.0.1:8080` (staging gateway).
  `deploy/ubuntu/run-frontend-nginx-container.sh` DEPLOY_ENV-aware
  fallback tek kaynak — workflow-level hardcoded override yok.
- doctor-infra.sh L1-L8 post-deploy CI guard olarak otomatik çalışır
  (deploy-backend.yml `post-deploy-doctor-infra` job). FAIL → deploy FAIL.
- `RENDER_ENV_BEFORE_DEPLOY=true` default; `render-backend-env.sh` 7
  servisin `{SERVICE}_PROFILES=prod,docker` değerini canonical env'e yazar.
- `backend/.env.prod.example` `API_GATEWAY_PORT=8082` (prod compose ile senkron,
  drift kapandı).

Kapsam dışı (ayrı iş paketleri):

- Zanzibar canary metrics prod-like değer üretimi → Dalga 1 Stage 2
  synthetic canary run (RB-zanzibar-canary.md §3.2; master plan Rev 23+ P1).
- Production environment (sadece staging).
- Full feature-parity test plan (TP-0319 detay).
- Vault KMS auto-unseal (RB-vault-kms-autounseal, P1.10 tamamlandı).

-------------------------------------------------------------------------------
5. BAĞIMLILIKLAR
-------------------------------------------------------------------------------

- Vault unseal otomatiği çalışır durumda (PR #377, RB-vault-dev-path-migration)
- GHCR pull authentication — secret `GHCR_TOKEN` staging runner'da çalışır
- Keycloak realm config staging hostname'e adapte (issuer/audience)
- Deploy-backend workflow DEPLOY_ENV=prod-like ayrımı (PR #372 pattern'i
  genişletilir — WEB_GATEWAY_UPSTREAM DEPLOY_ENV-aware render)

-------------------------------------------------------------------------------
6. ÖZET
-------------------------------------------------------------------------------

- Staging'in local profile'da çalışması bilinçli karar DEĞİL, GHCR crash
  sonrası geçici çözüm idi.
- Kullanıcı tercihi netleşti (2026-04-14): staging = prod-like.
- Uzun vadeli kalıcı çözüm 4 PR iskeletinde paketlendi (2026-04-17 audit):
  - PR #1 docs + truth alignment (bu STORY revizyonu + AC-0319 + TP-0319 + RB-staging-prod-profile)
  - PR #2 render contract + profile taşıma (`render-backend-env.sh` `{SERVICE}_PROFILES` + `.env.prod.example` drift fix + `RENDER_ENV_BEFORE_DEPLOY=true` default)
  - PR #3 Vault AppRole staging egzersiz + GHCR pull staging (`BUILD_LOCAL=false`)
  - PR #4 post-deploy doctor-infra CI guard + nginx workflow DEPLOY_ENV-aware cleanup
- Canary metrics üretimi **bu story'nin çıktısı değil** — Dalga 1 Stage 2
  synthetic canary run'a taşındı (STORY-0319 prereq'tir).
- Deploy planlaması + rollback runbook'u `RB-staging-prod-profile.md` §4.

-------------------------------------------------------------------------------
7. LİNKLER (İSTEĞE BAĞLI)
-------------------------------------------------------------------------------

- Acceptance: **AC-0319** (`docs/03-delivery/ACCEPTANCE/AC-0319-staging-prod-profile-migration.md`)
- Test plan: **TP-0319** (`docs/03-delivery/TEST-PLANS/TP-0319-staging-prod-profile-migration.md`)
- Operasyonel runbook: **RB-staging-prod-profile** (`docs/04-operations/RUNBOOKS/RB-staging-prod-profile.md`)
- Downstream canary runbook: `docs/04-operations/RUNBOOKS/RB-zanzibar-canary.md`
  (§3.1 bu story'yi prereq olarak işaretler)
- Env drift guard: `docs/04-operations/RUNBOOKS/RB-backend-env-drift-guard.md`
- Deploy infra kaynakları: `deploy/docker-compose.prod.yml`, `.github/workflows/deploy-backend.yml`
- Vault path migration: PR #377, `docs/04-operations/RUNBOOKS/RB-vault-dev-path-migration.md`
- Doctor-infra guard: `backend/scripts/doctor-infra.sh` L1-L8
- Decision registry: `decisions/topics/security-local-dev.v1.json` (D-105 + C-103 compose default `local,docker` korunur)
- Zanzibar master plan: `.claude/plans/zanzibar-master-plan.md`
- User preference (2026-04-14): staging = prod-like (agent memory; repo dışı)
