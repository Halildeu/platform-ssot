# STORY-0303 – Autopilot Auto-Fix + Deploy + Rollback v0.1

ID: STORY-0303-autopilot-auto-fix-deploy-rollback-v0-1  
Epic: OPS-RELEASE-E2E  
Status: Planned  
Owner: @team/platform  
Upstream: docs/00-handbook/DEV-GUIDE.md, docs/00-handbook/DOCS-WORKFLOW.md, docs/04-operations/RUNBOOKS/RB-insansiz-flow.md, docs/03-delivery/STORIES/STORY-0302-release-deploy-e2e-v0-1.md  
Downstream: AC-0303, TP-0303

-------------------------------------------------------------------------------
## 1. AMAÇ
-------------------------------------------------------------------------------

- `ci-gate` FAIL olduğunda otomatik “auto-fix PR” üretmek (fail-safe, allowlist, limitli).  
- `main` merge sonrası deploy + post-deploy doğrulama + (gerekirse) rollback akışını SSOT olarak tanımlayıp implement etmek.  
- PR Conversation’da marker’lı comment’lerle izlenebilirlik sağlamak (spam yok).  

-------------------------------------------------------------------------------
## 2. TANIM
-------------------------------------------------------------------------------

- Bir platform/ops ekibi olarak, “FAIL → log-digest → auto-fix PR → PASS → otomatik merge → deploy → post-deploy validate → rollback” akışını insansız ve denetlenebilir şekilde çalıştırmak istiyorum; böylece manuel müdahale ve toparlanma süresi azalırken kalite kapısı bypass edilmesin.

-------------------------------------------------------------------------------
## 3. KAPSAM VE SINIRLAR
-------------------------------------------------------------------------------

Dahil (v0.1):
- Auto-fix bot:
  - Tetik: `ci-gate` workflow_run (PR event) + failure.  
  - Çıktı: `bot/fix-<run_id>` branch + PR + `<!-- auto-fix:v1 -->` marker comment.  
  - Güvenlik: allowlist path (ör. `docs/**`, `web/**` belirli alt set, `scripts/**` belirli alt set), boyut limitleri, max retry.  
  - Rule-based küçük düzeltmeler (deterministik):
    - Docs ID satırı filename’e göre düzeltme (örn. `STORY-0302` dosyasında `ID:` bozulmuşsa).  
    - “Missing file/module” gibi sabit pattern’lerde stub/placeholder üretimi (allowlist içinde).  
    - Boş test glob nedeniyle CI fail → “skip when no tests” wrapper patch’i (allowlist içinde).  

- Deploy bot (main push):
  - Web: build + publish bundle assert (canonical publish root) + deploy (kill-switch ile).  
  - Backend: build image + push GHCR (sha tag) + deploy (opsiyonel, kill-switch ile).  

- Post-deploy validate + rollback:
  - Deploy workflow’ları sonrası doğrulama (web smoke + backend healthcheck).  
  - FAIL durumunda rollback akışı (web önceki release’e dönüş / backend önceki tag’a dönüş) + incident marker comment.  

Kapsam dışı (v0.1):
- LLM tabanlı patch üretimi (yalnız rule-based fix seti).  
- Prod altyapı detaylarının (sunucu/hosting) tam implementasyonu; workflow’lar kill-switch ile güvenli/noop çalışır.  
- İnsan onayı gerektiren branch rules (required reviews) altında “tam insansız merge” garantisi.  

-------------------------------------------------------------------------------
## 4. ACCEPTANCE KRİTERLERİ
-------------------------------------------------------------------------------

- [ ] Given STORY/AC/TP ve PROJECT-FLOW SSOT güncel, When Doc QA çalıştırılır, Then kontroller PASS olmalıdır.  
- [ ] Given `ci-gate` FAIL olan bir PR vardır, When auto-fix bot tetiklenir, Then bot allowlist içinde patch üretip PR açmalıdır.  
- [ ] Given auto-fix PR açılmıştır, When `ci-gate` PASS olur, Then merge-bot squash merge etmelidir (label gate).  
- [ ] Given main’e merge olmuştur, When deploy workflow’ları koşar, Then deploy + post-deploy validate PASS olmalıdır (DEPLOY_ENABLED=on ise).  
- [ ] Given post-deploy validate FAIL olur, When rollback tetiklenir, Then rollback uygulanmalı ve incident marker comment yazılmalıdır.  

-------------------------------------------------------------------------------
## 5. BAĞIMLILIKLAR
-------------------------------------------------------------------------------

- Repo policy: `GITHUB_TOKEN` write izinleri (PR create/comment/merge) ve required checks/rulesets.  
- Deploy secrets ve hedefler (web hosting / backend runner / GHCR).  
- `ci-gate` (single required check) ve bot workflow isimlerinin SSOT olarak sabit kalması.  

-------------------------------------------------------------------------------
## 6. ÖZET
-------------------------------------------------------------------------------

- v0.1’de “auto-fix + deploy + rollback” akışı fail-safe ve kill-switch’li olarak devreye alınır.  
- Kanıtlar PR Conversation marker comment’leri ve workflow run linkleri ile izlenebilir olur.  

-------------------------------------------------------------------------------
## 7. LİNKLER (İSTEĞE BAĞLI)
-------------------------------------------------------------------------------

- Story: docs/03-delivery/STORIES/STORY-0303-autopilot-auto-fix-deploy-rollback-v0-1.md  
- Acceptance: docs/03-delivery/ACCEPTANCE/AC-0303-autopilot-auto-fix-deploy-rollback-v0-1.md  
- Test Plan: docs/03-delivery/TEST-PLANS/TP-0303-autopilot-auto-fix-deploy-rollback-v0-1.md  
- Story (v0.1 sözleşme): docs/03-delivery/STORIES/STORY-0302-release-deploy-e2e-v0-1.md  
- Runbook: docs/04-operations/RUNBOOKS/RB-insansiz-flow.md  
- Workflow: .github/workflows/ci-gate.yml  
