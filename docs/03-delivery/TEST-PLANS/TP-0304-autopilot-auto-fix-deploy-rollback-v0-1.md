# TP-0304 – Autopilot Auto-Fix + Deploy + Rollback v0.1 Test Plan

ID: TP-0304  
Story: STORY-0304-autopilot-auto-fix-deploy-rollback-v0-1  
Status: Planned  
Owner: @team/platform

-------------------------------------------------------------------------------
## 1. AMAÇ
-------------------------------------------------------------------------------

- Autopilot v0.1 akışının (0304 zinciri) minimum smoke doğrulamasını tanımlamak.

-------------------------------------------------------------------------------
## 2. KAPSAM
-------------------------------------------------------------------------------

- Docs: template/ID/link/flow kontrolleri.  
- Ops: auto-fix noop (kill-switch) ve deploy/validate skip (kill-switch).  

-------------------------------------------------------------------------------
## 3. STRATEJİ
-------------------------------------------------------------------------------

- Önce doküman zinciri PASS alınır; sonra ops workflow’ları kill-switch OFF durumunda noop/skip davranışı ile doğrulanır.

-------------------------------------------------------------------------------
## 4. TEST SENARYOLARI ÖZETİ
-------------------------------------------------------------------------------

- [ ] Senaryo 1 – Doc chain + story links PASS (`check_doc_chain`, `check_story_links`).  
- [ ] Senaryo 2 – AUTO_FIX_ENABLED kapalıyken auto-fix workflow noop.  
- [ ] Senaryo 3 – DEPLOY_ENABLED kapalıyken deploy/validate job’ları skip.  

-------------------------------------------------------------------------------
## 5. ÇEVRE VE ARAÇLAR
-------------------------------------------------------------------------------

- GitHub Actions workflows:
  - `ci-gate`, `auto-fix`, `deploy-web`, `deploy-backend`, `post-deploy-validate`, `rollback`

-------------------------------------------------------------------------------
## 6. RİSKLER / ÖNCELİKLER
-------------------------------------------------------------------------------

- En kritik risk: yanlışlıkla deploy (mitigasyon: kill-switch + required params).  

-------------------------------------------------------------------------------
## 7. ÖZET
-------------------------------------------------------------------------------

- 0304 zinciri için minimum smoke senaryoları tanımlanmıştır.

-------------------------------------------------------------------------------
## 8. LİNKLER (İSTEĞE BAĞLI)
-------------------------------------------------------------------------------

- Story: docs/03-delivery/STORIES/STORY-0304-autopilot-auto-fix-deploy-rollback-v0-1.md  
- Acceptance: docs/03-delivery/ACCEPTANCE/AC-0304-autopilot-auto-fix-deploy-rollback-v0-1.md  
- Runbook: docs/04-operations/RUNBOOKS/RB-insansiz-flow.md  

