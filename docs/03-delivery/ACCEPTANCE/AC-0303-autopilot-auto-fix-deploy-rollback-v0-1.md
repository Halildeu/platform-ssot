# AC-0303 – Autopilot Auto-Fix + Deploy + Rollback v0.1 Acceptance

ID: AC-0303  
Story: STORY-0303-autopilot-auto-fix-deploy-rollback-v0-1  
Status: Planned  
Owner: @team/platform

-------------------------------------------------------------------------------
## 1. AMAÇ
-------------------------------------------------------------------------------

- Auto-fix, deploy, post-deploy validate ve rollback akışlarını test edilebilir kabul kriterlerine çevirmek.

-------------------------------------------------------------------------------
## 2. KAPSAM
-------------------------------------------------------------------------------

- `ci-gate` failure → auto-fix PR üretimi (guardrails + allowlist + marker comment).  
- `main` push → deploy-web/deploy-backend (kill-switch ile).  
- Deploy sonrası doğrulama + FAIL durumunda rollback + incident kaydı.  

-------------------------------------------------------------------------------
## 3. GIVEN / WHEN / THEN SENARYOLARI
-------------------------------------------------------------------------------

### Ortak

- [ ] Senaryo 1 – SSOT doküman zinciri PASS:
  - Given: `STORY-0303`, `AC-0303`, `TP-0303` ve `docs/03-delivery/PROJECT-FLOW.tsv` günceldir.  
  - When: Doc QA ve zincir kontrolleri çalıştırılır.  
  - Then: Şablon/ID/lokasyon/zincir kontrolleri PASS olmalıdır.  
  - Kanıt/Evidence (önerilen):
    - Script: `python3 scripts/check_doc_ids.py`  
    - Script: `python3 scripts/check_doc_locations.py`  
    - Script: `python3 scripts/check_doc_templates.py`  
    - Script: `python3 scripts/check_story_links.py STORY-0303`  
    - Script: `python3 scripts/check_doc_chain.py STORY-0303`  

- [ ] Senaryo 2 – Kill switch: AUTO_FIX kapalıysa noop:
  - Given: `AUTO_FIX_ENABLED` repo secret’ı `false/empty` konumundadır.  
  - When: `ci-gate` FAIL olan bir PR için auto-fix workflow_run tetiklenir.  
  - Then: Bot PR açmamalıdır (noop + step summary).  

- [ ] Senaryo 3 – Kill switch: DEPLOY kapalıysa noop:
  - Given: `DEPLOY_ENABLED` repo secret’ı `false/empty` konumundadır.  
  - When: main’e merge olur.  
  - Then: Deploy workflow’ları “build/validate” yapabilir ama gerçek deploy adımı çalışmamalıdır (noop + summary).  

### Operations – Auto-Fix

- [ ] Senaryo 4 – ci-gate FAIL → auto-fix PR açılır:
  - Given: PR üzerinde `ci-gate` FAIL olmuştur ve workflow_run event’i `pull_request`’tır.  
  - When: Auto-fix workflow’u çalışır.  
  - Then:
    - `bot/fix-<run_id>` branch oluşturulmalıdır,  
    - PR açılmalıdır (base=main, head=bot/fix-<run_id>),  
    - PR’a marker comment upsert edilmelidir: `<!-- auto-fix:v1 -->`,  
    - PR’a `pr-bot/ready-to-merge` label’ı best-effort eklenmelidir.  
  - Kanıt/Evidence (önerilen):
    - Workflow (Phase-2): .github/workflows/auto-fix.yml  
    - Script (Phase-2): scripts/auto_fix.py  
    - PR comment: `<!-- auto-fix:v1 -->`  

- [ ] Senaryo 5 – Guardrail: bot branch’lerinde recursion yok:
  - Given: Fail eden PR branch’i `bot/fix-*` prefix’ine sahiptir.  
  - When: Auto-fix workflow’u tetiklenir.  
  - Then: Bot patch üretmemeli ve PR açmamalıdır (noop).  

### Operations – Deploy / Validate / Rollback

- [ ] Senaryo 6 – main → deploy-web ve post-deploy validate:
  - Given: `DEPLOY_ENABLED=true` ve web deploy hedef secrets’ları tanımlıdır.  
  - When: Web değişikliği `main`’e merge olur.  
  - Then: `deploy-web` build+deploy yapmalı, ardından `post-deploy-validate` web smoke PASS olmalıdır.  

- [ ] Senaryo 7 – main → deploy-backend ve backend healthcheck:
  - Given: `DEPLOY_ENABLED=true`, GHCR push ve backend deploy prerequisites hazırdır.  
  - When: Backend değişikliği `main`’e merge olur.  
  - Then: `deploy-backend` image build+push yapmalı; deploy sonrası healthcheck PASS olmalıdır.  

- [ ] Senaryo 8 – post-deploy FAIL → rollback + incident:
  - Given: Deploy sonrası doğrulama FAIL olur.  
  - When: rollback workflow’u tetiklenir.  
  - Then: Rollback uygulanmalı ve incident marker comment yazılmalıdır: `<!-- incident:v1 -->`.  

-------------------------------------------------------------------------------
## 4. NOTLAR / KISITLAR
-------------------------------------------------------------------------------

- Auto-fix v0.1 yalnız allowlist + rule-based fix setini uygular; bilinmeyen hatalarda noop + digest yazmak tercih edilir.  
- Deploy/rollback adımları secrets olmadan noop kalır; SSOT sözleşme korunur, yanlışlıkla prod deploy yapılmaz.  

-------------------------------------------------------------------------------
## 5. ÖZET
-------------------------------------------------------------------------------

- Auto-fix PR üretimi, deploy, validate ve rollback akışları “kill-switch + marker comment” ile izlenebilir ve fail-safe çalışır.  

-------------------------------------------------------------------------------
## 6. LİNKLER (İSTEĞE BAĞLI)
-------------------------------------------------------------------------------

- Story: docs/03-delivery/STORIES/STORY-0303-autopilot-auto-fix-deploy-rollback-v0-1.md  
- Test Plan: docs/03-delivery/TEST-PLANS/TP-0303-autopilot-auto-fix-deploy-rollback-v0-1.md  
- Runbook: docs/04-operations/RUNBOOKS/RB-insansiz-flow.md  
