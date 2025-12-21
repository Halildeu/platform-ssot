# AC-0304 – Autopilot Auto-Fix + Deploy + Rollback v0.1 Acceptance

ID: AC-0304  
Story: STORY-0304-autopilot-auto-fix-deploy-rollback-v0-1  
Status: Planned  
Owner: @team/platform

-------------------------------------------------------------------------------
## 1. AMAÇ
-------------------------------------------------------------------------------

- STORY-0304 kapsamı için test edilebilir kabul kriterlerini kilitlemek.

-------------------------------------------------------------------------------
## 2. KAPSAM
-------------------------------------------------------------------------------

- Doc zinciri: STORY/AC/TP-0304 + PROJECT-FLOW satırı.  
- Ops akışı: auto-fix (kill-switch + guardrail), deploy/validate/rollback (kill-switch).  

-------------------------------------------------------------------------------
## 3. GIVEN / WHEN / THEN SENARYOLARI
-------------------------------------------------------------------------------

### Ortak

- [ ] Senaryo 1 – Doc zinciri PASS:
  - Given: `STORY-0304`, `AC-0304`, `TP-0304` ve `docs/03-delivery/PROJECT-FLOW.tsv` günceldir.  
  - When: Doc QA ve zincir kontrolleri çalıştırılır.  
  - Then: kontroller PASS olmalıdır.  
  - Kanıt/Evidence (önerilen):
    - Script: `python3 scripts/check_doc_chain.py STORY-0304`  
    - Script: `python3 scripts/check_story_links.py STORY-0304`  

### Operations

- [ ] Senaryo 2 – AUTO_FIX kill-switch:
  - Given: `AUTO_FIX_ENABLED` kapalıdır.  
  - When: `ci-gate` FAIL için auto-fix workflow’u tetiklenir.  
  - Then: bot PR açmamalıdır (noop + summary).  

- [ ] Senaryo 3 – DEPLOY kill-switch:
  - Given: `DEPLOY_ENABLED` kapalıdır.  
  - When: main’e merge olur.  
  - Then: deploy/validate job’ları skip olmalıdır.  

-------------------------------------------------------------------------------
## 4. NOTLAR / KISITLAR
-------------------------------------------------------------------------------

- Bu zincir, 0303 dokümanlarını değiştirmeden 0304 ile ilerlemek için açılmıştır.

-------------------------------------------------------------------------------
## 5. ÖZET
-------------------------------------------------------------------------------

- Doc zinciri PASS ve kill-switch davranışları net olmalıdır.

-------------------------------------------------------------------------------
## 6. LİNKLER (İSTEĞE BAĞLI)
-------------------------------------------------------------------------------

- Story: docs/03-delivery/STORIES/STORY-0304-autopilot-auto-fix-deploy-rollback-v0-1.md  
- Test Plan: docs/03-delivery/TEST-PLANS/TP-0304-autopilot-auto-fix-deploy-rollback-v0-1.md  
- Runbook: docs/04-operations/RUNBOOKS/RB-insansiz-flow.md  

