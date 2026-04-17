# TEST-PLAN – Zanzibar Prod Cutover Hazırlığı

ID: TP-0320  
Story: STORY-0320-zanzibar-prod-cutover-prep  
Status: Planned  
Owner: @halil

Not: Aşağıdaki başlıklar ve sıralama **zorunludur**. Yeni bir Test Plan
yazılırken bu H2 başlıkları ve numaraları bire bir korunmalı; agent sadece
bu başlıkların altını doldurabilir.

-------------------------------------------------------------------------------
## 1. AMAÇ
-------------------------------------------------------------------------------

- AC-0320 senaryolarına göre P1.10 / P1.8 / P1.9 iş paketlerinin birlikte
  çalıştığını, staging regression'ı olmadığını ve prod cutover runbook'unun
  uygulanabilir olduğunu doğrulamak.

-------------------------------------------------------------------------------
## 2. KAPSAM
-------------------------------------------------------------------------------

- Vault seal template'leri + deploy wiring + runbook (P1.10)
- auth-service + user-service servis-token path + canary script (P1.8)
- `useExplainPermission` + modal scope picker + backend payload (P1.9)
- CI contract gate (enforcement-check + module-delivery-gate) umbrella story
  bağlanmasıyla green

-------------------------------------------------------------------------------
## 3. STRATEJİ
-------------------------------------------------------------------------------

- **P1.10**: Runbook adımlarını staging rehearsal ile doğrulamak (operatör
  manual). CI'da HCL template syntax + compose config validate + doc template
  strictness otomasyonu. Real cloud KMS integration rehearsal staging
  manual, not automated.
- **P1.8**: Auth-service ve user-service için JUnit integration testleri +
  canary-setup script unit test. Canonical path ile persona seed end-to-end
  staging rehearsal.
- **P1.9**: Web unit test (hook), Playwright E2E Senaryo 3 (NO_SCOPE stage
  spec ek). Backend controller test `scopeType/scopeRefId` payload accept.
- Umbrella CI gate: her PR kendi alt-iş paketine ait path globs'ları
  contract'ın `delivery_scope.change_path_globs` listesinde aktif olmalı →
  enforcement-check PASS.

-------------------------------------------------------------------------------
## 4. TEST SENARYOLARI ÖZETİ
-------------------------------------------------------------------------------

- [ ] P1.10 Shamir regression guard: staging `VAULT_SEAL_MODE=shamir` default
  kalınca vault-unseal sidecar çalışır, `sealed=false` (Senaryo 1)
- [ ] P1.10 HCL template syntax: `docker compose config --quiet` backend +
  prod → Exit 0; `bash -n deploy-backend.sh` → Exit 0
- [ ] P1.10 Runbook doc-qa strictness PASS (7 required heading, ID meta,
  fence-safe numbered lists)
- [ ] P1.10 Staging rehearsal (manual): AWS/GCP/Azure test hesabında KMS
  key + Vault restart × 3 → auto-unseal PASS (Senaryo 2)
- [ ] P1.8 auth-service mint integration test: user-service audience
  token_type=service mint başarılı (401/403 değil)
- [ ] P1.8 user-service non-local JWT converter: service token authenticate
  + `ScopeContextFilter` userId null değil
- [ ] P1.8 canary-setup canonical path: 4 persona seed canonical flow
  (`--use-hybrid-b=false`) sıfırdan çalışır (Senaryo 3)
- [ ] P1.9 `useExplainPermission` unit: `scopeType`/`scopeRefId` payload
  forward; mock httpPost doğru gövde
- [ ] P1.9 Backend controller test: `POST /v1/authz/explain`
  `{scopeType,scopeRefId}` accept + response `reason=NO_SCOPE` doğru path
- [ ] P1.9 Playwright Senaryo 3 (NO_SCOPE): scope picker → explain modal
  reason NO_SCOPE badge + açıklama metni (Senaryo 4)
- [ ] P1.10 Recovery key escrow drill (manual checklist, runbook §5.3)
  (Senaryo 5)
- [ ] P1.10 Break-glass KMS access failure drill (staging rehearsal,
  runbook §5.1) (Senaryo 6)
- [ ] Umbrella CI contract: PR #446 + P1.8 PR + P1.9 PR `enforcement-check`
  green (ortak `feature_id` retarget edilmiş tek contract)

-------------------------------------------------------------------------------
## 5. ORTAM VE VERİ
-------------------------------------------------------------------------------

- **Staging**: `ai.acik.com` (host-backed), Vault 1.21.4 Shamir + sidecar;
  P1.10 rehearsal için real cloud KMS test hesabı gerekli (AWS dev
  preferred); P1.8 için KC admin-cli + canary-load clients; P1.9 için
  3 canary persona (CANARY_READ_ONLY, CANARY_RESTRICTED, yeni NO_SCOPE test
  persona).
- **Test verisi**: admin@example.com (super admin), canary-read-only@stage.local
  (CANARY_READ_ONLY rol), canary-restricted@stage.local (CANARY_RESTRICTED),
  P1.9 için yeni "canary-scope-limited" persona (module VIEW ama project scope
  yok) — bu story'de persona seed ek adımı P1.8 canonical path sonrası
  otomatize.

-------------------------------------------------------------------------------
## 6. DÖNÜT VE RAPOR
-------------------------------------------------------------------------------

- CI raporu: her PR için `.cache/reports/feature_execution_contract_ci.v1.json`
  `status=PASS` (contract satisfy).
- Staging rehearsal raporu: `docs/handoffs/` altında session handoff (runbook
  §8 acceptance).
- P1.10 prod cutover execution logu: runbook §3.5 init + §3.6 audit bootstrap
  post-deploy.
- P1.8 canary-setup canonical run logu: `.cache/reports/canary-canonical-run.json`.
- P1.9 Playwright run: `test-results/authz.explain-modal.stage.*.json` Senaryo 3
  entry.

-------------------------------------------------------------------------------
## 7. RİSKLER VE AZALTMA
-------------------------------------------------------------------------------

- **P1.10 real cloud KMS test eksikliği**: prod cutover öncesi manuel staging
  rehearsal zorunlu (runbook §8). Geçilmeden prod deploy yasak.
- **P1.8 user-service non-local profile**: mevcut çalışan auth pattern'ini
  kırma riski. Integration test `prod,docker` profile ile doğrulanır, staging
  deploy sonrası smoke test zorunlu.
- **P1.9 scope picker UX drift**: mevcut modal iki tip (module/action/report)
  kullanıcıya ek karmaşıklık getirebilir. Scope picker opsiyonel field olarak
  tasarlanmalı (empty → backend global scope varsayar).
- **Contract retarget**: mevcut `feature_id=integration-profile` contract
  ACTIVE. Yeni umbrella feature_id'ye retarget edilirken `source_refs`
  zincirinde STORY-0316 prior olarak listelenir (izlenebilirlik).
- **Three-PR sequential merge**: P1.10 → P1.8 → P1.9 sırasında bir PR fail
  olursa umbrella contract diğer PR'ları da etkiler. Her merge sonrası
  staging smoke test zorunlu.
