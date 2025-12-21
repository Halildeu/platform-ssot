# STORY-0304 – Autopilot Auto-Fix + Deploy + Rollback v0.1

ID: STORY-0304-autopilot-auto-fix-deploy-rollback-v0-1  
Epic: OPS-RELEASE-E2E  
Status: Planned  
Owner: @team/platform  
Upstream: docs/00-handbook/DEV-GUIDE.md, docs/00-handbook/DOCS-WORKFLOW.md, docs/04-operations/RUNBOOKS/RB-insansiz-flow.md, docs/03-delivery/STORIES/STORY-0302-release-deploy-e2e-v0-1.md  
Downstream: AC-0304, TP-0304

-------------------------------------------------------------------------------
## 1. AMAÇ
-------------------------------------------------------------------------------

- `ops/0304-*` hattını ayrı zincirle izlemek (0303’e dokunmadan).  
- Auto-fix → merge → deploy/validate/rollback akışını kill-switch + guardrail ile netleştirmek.  

-------------------------------------------------------------------------------
## 2. TANIM
-------------------------------------------------------------------------------

- Bir platform/ops ekibi olarak, insansız “FAIL → auto-fix → merge → deploy → rollback” akışını izlenebilir ve fail-safe şekilde çalıştırmak istiyorum.

-------------------------------------------------------------------------------
## 3. KAPSAM VE SINIRLAR
-------------------------------------------------------------------------------

Dahil (v0.1):
- Docs zinciri: STORY/AC/TP-0304 + PROJECT-FLOW satırı.  
- Ops akışı: auto-fix (rule-based), deploy-web/deploy-backend, post-deploy validate, rollback (kill-switch ile).  

Kapsam dışı (v0.1):
- LLM tabanlı patch üretimi.  
- `DEPLOY_ENABLED=true` olmadan deploy/rollback denemeleri.  

-------------------------------------------------------------------------------
## 4. ACCEPTANCE KRİTERLERİ
-------------------------------------------------------------------------------

- [ ] Given STORY/AC/TP-0304 ve PROJECT-FLOW satırı vardır, When doc check’ler koşulur, Then PASS olmalıdır.  
- [ ] Given `AUTO_FIX_ENABLED` kapalıdır, When `ci-gate` FAIL tetiklenir, Then bot PR açmamalıdır (noop).  
- [ ] Given `DEPLOY_ENABLED` kapalıdır, When main’e merge olur, Then deploy/validate job’ları skip olmalıdır.  

-------------------------------------------------------------------------------
## 5. BAĞIMLILIKLAR
-------------------------------------------------------------------------------

- Tek required check: `.github/workflows/ci-gate.yml`.  
- Runbook: `docs/04-operations/RUNBOOKS/RB-insansiz-flow.md`.  
- Secrets: `AUTO_FIX_ENABLED`, `DEPLOY_ENABLED` (ve ilgili deploy/rollback parametreleri).  

-------------------------------------------------------------------------------
## 6. ÖZET
-------------------------------------------------------------------------------

- Bu Story, autopilot v0.1 akışını 0304 zinciriyle başlatır ve 0303 zincirine dokunmadan ilerlemek için SSOT kaydı sağlar.

-------------------------------------------------------------------------------
## 7. LİNKLER (İSTEĞE BAĞLI)
-------------------------------------------------------------------------------

- Story: docs/03-delivery/STORIES/STORY-0304-autopilot-auto-fix-deploy-rollback-v0-1.md  
- Acceptance: docs/03-delivery/ACCEPTANCE/AC-0304-autopilot-auto-fix-deploy-rollback-v0-1.md  
- Test Plan: docs/03-delivery/TEST-PLANS/TP-0304-autopilot-auto-fix-deploy-rollback-v0-1.md  
- Runbook: docs/04-operations/RUNBOOKS/RB-insansiz-flow.md  
- Workflow: .github/workflows/ci-gate.yml  

