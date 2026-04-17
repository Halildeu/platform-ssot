# STORY-0320: Zanzibar Prod Cutover Hazırlığı (Vault KMS + Canonical Service-Token + NO_SCOPE UI)

ID: STORY-0320-zanzibar-prod-cutover-prep
Epic: EPIC-infra-canary-readiness
Status: Planned
Owner: @halil
Risk_Level: high
Upstream: `.claude/plans/zanzibar-master-plan.md` (Rev 24), P1 backlog (post-TAM KAPANIŞ)
Downstream: AC-0320, TP-0320, RB-vault-kms-autounseal

Not: Aşağıdaki başlıklar ve sıralama **zorunludur**.

-------------------------------------------------------------------------------
1. AMAÇ
-------------------------------------------------------------------------------

- Zanzibar Dalga 2 release gate sonrası P1 backlog'un son üç kalemini (P1.8 /
  P1.9 / P1.10) tek umbrella altında toplayarak prod cutover'ı destekleyen
  operasyonel ve UX eksiklerini kapatmak.
- P1.10 Vault KMS auto-unseal: prod deploy blocker. Shamir sidecar loop
  compliance ihlali (disk plaintext unseal key). Cloud KMS ile self-unseal.
- P1.8 Canonical service-token path: staging'deki "Hybrid B" manuel seed
  workaround'u yerine auth-service mint + user-service non-local JWT
  converter; canary automation script unblock.
- P1.9 NO_SCOPE UI modal refactor: explain modal `scopeType/scopeRefId`
  eksik → 5. reason (NO_SCOPE) için UX path yok.

-------------------------------------------------------------------------------
2. TANIM
-------------------------------------------------------------------------------

- Bir platform mühendisi olarak prod deploy öncesi:
  - Vault restart sonrası manuel unseal gerekmeden self-unseal olmasını,
  - Canary matrix'in manuel persona seed olmadan (Hybrid B path kaldırıldı)
    otomatik çalışmasını,
  - Kullanıcının `/unauthorized` sayfasında `NO_SCOPE` reason'ını anlaşılır
    bir modal ile görmesini istiyorum.
- Son kullanıcı etkisi: prod availability (Vault), oncall yükü (canary
  otomasyonu), UX netliği (NO_SCOPE açıklama).

-------------------------------------------------------------------------------
3. KAPSAM VE SINIRLAR
-------------------------------------------------------------------------------

- Kapsam (3 alt iş paketi, 3 PR):
  - **P1.10 Vault KMS Auto-Unseal** (PR #446 hazır):
    - 4 provider template (AWS/GCP/Azure/Transit) — HCL empty stanza,
      env-driven config
    - 1 no-op placeholder (Shamir default, staging korunur)
    - Compose wiring (`VAULT_SEAL_FILE` env-driven mount)
    - Deploy script (`VAULT_SEAL_MODE` conditional sidecar skip)
    - Runbook (`RB-vault-kms-autounseal`)
  - **P1.8 Canonical Service-Token Path**:
    - auth-service mint policy allowlist genişletme (user-service audience +
      `users:internal` permission)
    - user-service non-local `SecurityConfig`'e `ServiceAuthenticationToken`
      converter
    - `zanzibar-canary-setup.mjs` token split (3 ayrı token tipi)
  - **P1.9 NO_SCOPE UI Modal Refactor**:
    - `useExplainPermission` signature: `scopeType`, `scopeRefId`
    - `ExplainPermissionModal` scope picker UI
    - Backend `/authz/explain` payload `scopeType/scopeRefId` accept
- Sınır dışı:
  - Real cloud KMS integration rehearsal (prod cutover staging test; bu
    story'nin acceptance criteria'sında referanslanır, otomatik çalışmaz)
  - Vault data migration from staging Shamir → prod KMS (prod fresh init
    bekleniyor; migration `RB-vault-kms-autounseal` §6.1 appendix)
  - Canary load real execution (P1.8 unblock sonrası ayrı run)

-------------------------------------------------------------------------------
4. ACCEPTANCE KRİTERLERİ
-------------------------------------------------------------------------------

P1.10:
- `backend/devops/vault/vault-seal-{awskms,gcpckms,azurekeyvault,transit}.hcl`
  mevcut; her biri empty stanza + provider env var comment
- `backend/devops/vault/vault-seal-disabled.hcl` Shamir placeholder
- `backend/docker-compose.yml` vault service `-config=/vault/config/` +
  `VAULT_SEAL_FILE` env-driven mount
- `deploy/docker-compose.prod.yml` aynı pattern
- `deploy/ubuntu/deploy-backend.sh` `VAULT_SEAL_MODE != shamir` iken
  vault-unseal sidecar skip + preflight diagnostic branching
- `docs/04-operations/RUNBOOKS/RB-vault-kms-autounseal.md` 7 section
  (AMAÇ/KAPSAM/BAŞLATMA-DURDURMA/GÖZLEMLEME/ARIZA/ÖZET/LİNKLER) + migration
  appendix
- Staging regresyon yok: `VAULT_SEAL_MODE=shamir` default, vault-unseal
  sidecar çalışmaya devam eder, `vault status` `sealed=false`

P1.8:
- auth-service `application.properties` mint allowlist'te user-service
  audience + `users:internal` permission
- user-service non-local `SecurityConfig`'de `ServiceAuthenticationToken`
  converter aktif
- `zanzibar-canary-setup.mjs` 3 farklı token tipi (Keycloak admin, user-service
  internal, permission-service role admin) ayrı akışlar
- Canary persona seed canonical path'le sıfırdan çalışır (Hybrid B manual
  kaldırılır, memory workaround güncellenir)

P1.9:
- `web/packages/auth/src/useExplainPermission.ts` signature'a `scopeType`,
  `scopeRefId` eklendi
- `ExplainPermissionModal` scope picker input (optional, company/project/
  warehouse seçimi)
- Backend `/authz/explain` controller + service scopeType/scopeRefId payload
  accept + reason `NO_SCOPE` path'i doğru döner
- Playwright Senaryo 3 (NO_SCOPE) spec eklenir

Ortak:
- Her bir alt iş paketi ayrı PR, aynı umbrella contract (`feature_id`
  retarget edilmiş) altında.
- CI `enforcement-check` + `module-delivery-gate` green.
- Codex review her PR için APPROVE.
- Post-deploy staging canlı kanıtı runbook'a bağlı (P1.10 rehearsal, P1.8
  canary re-run, P1.9 E2E Senaryo 3).

-------------------------------------------------------------------------------
5. BAĞIMLILIKLAR
-------------------------------------------------------------------------------

- STORY-0316 cross-plane auth session audit foundation (mevcut ACTIVE
  contract'ın source story'si) — retarget sonrası `prior_story_refs`
  listesine düşer.
- STORY-0319 staging-prod-profile-migration — prod cutover path'in prereq'i
  (P1.10 devreye alındığında staging profile prod-like).
- `feature_execution_contract.v1.json` retarget — tek aktif contract,
  umbrella feature_id'ye geçer.
- HashiCorp Vault 1.21.4 (seal stanza docs compat), Spring Cloud 2025.0.1
  (service token path), React 18 + MFE runtime (NO_SCOPE UI).

-------------------------------------------------------------------------------
6. ÖZET
-------------------------------------------------------------------------------

- Zanzibar TAM KAPANIŞ sonrası prod cutover için kalan 3 "must-have" iş:
  KMS auto-unseal + canonical service-token + NO_SCOPE UI.
- Umbrella story pattern: 3 PR aynı contract altında, semantik drift yok.
- Risk: Vault KMS rehearsal real cloud olmadan test edilemez; staging
  default Shamir kalır; prod cutover manual runbook adımlarını gerektirir.
- P1.6 canary-admin KC NPE (deferred P2) bu story'nin **dışında** kalır —
  admin@example.com super admin path ile çalışıyor.

-------------------------------------------------------------------------------
7. LİNKLER (İSTEĞE BAĞLI)
-------------------------------------------------------------------------------

- Acceptance: **AC-0320** (`docs/03-delivery/ACCEPTANCE/AC-0320-zanzibar-prod-cutover-prep.md`)
- Test plan: **TP-0320** (`docs/03-delivery/TEST-PLANS/TP-0320-zanzibar-prod-cutover-prep.md`)
- Operasyonel runbook: **RB-vault-kms-autounseal** (`docs/04-operations/RUNBOOKS/RB-vault-kms-autounseal.md`)
- `.claude/plans/zanzibar-master-plan.md` Rev 24 — P1 backlog
- `.claude/plans/session-handoff-20260417-p1-track-a.md` — bu session kapanışı
- `feedback_zanzibar_hybrid_b_persona_seed.md` — P1.8 workaround memory
- `feedback_canary_admin_kc_login_deferred.md` — P1.6 defer
- PR #446 (P1.10), PR #438-#444 (bu session'da merged)
