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

- `docker exec platform-permission-service-1 env | grep SPRING_PROFILES_ACTIVE`
  çıktısında `local` yok
- `curl -X POST http://localhost:8090/api/v1/authz/check` auth'suz istek
  **401/403** döner (şu an 200 — local profile permitAll)
- `curl -sI https://ai.acik.com/api/v1/authz/version -H 'Authorization: Bearer …'`
  200; token'sız 401
- Vault-backed secret okuma staging'de çalışır (bir servisin DB password'ünü
  Vault'tan çekebildiği log ile doğrulanır)
- GHCR image pull staging deploy'da başarılı
  (`docker pull ghcr.io/halildeu/platform-auth-service:sha-xxxx`)
- nginx `/api/*` 200 döner; upstream `127.0.0.1:8080` (staging gateway host port)
- doctor-infra.sh yeni profile drift check PASS
- Zanzibar canary metrics prod-like değerler üretiyor:
  `deny_rate`, `tuple_sync_outbox_failed_total`, `openfga_circuit_breaker_state`

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
- 6 maddelik geçiş planı, yüksek risk (canary geçici down olabilir).
- Deploy planlaması + rollback runbook'u gerekli.

-------------------------------------------------------------------------------
7. LİNKLER (İSTEĞE BAĞLI)
-------------------------------------------------------------------------------

- Memory: `feedback_infra_stability.md` (güncel)
- Deploy infra: `deploy/docker-compose.prod.yml`, `.github/workflows/deploy-backend.yml`
- Vault fix: PR #377, RB-vault-dev-path-migration.md
- Zanzibar canary: `.claude/plans/zanzibar-master-plan.md`
- Decision registry: `decisions/topics/security-local-dev.v1.json`
