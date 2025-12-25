# TP-0310 – Ethics SLA & Escalation Test Plan (MVP)

ID: TP-0310  
Story: STORY-0310-ethics-sla-and-escalation  
Status: Draft  
Owner: TBD

-------------------------------------------------------------------------------
## 1. AMAÇ
-------------------------------------------------------------------------------

- `STORY-0310` doküman zincirinin Doc QA gate’lerine uyumunu doğrulamak.

-------------------------------------------------------------------------------
## 2. KAPSAM
-------------------------------------------------------------------------------

- SLA semantiği ADR’i (`ADR-0005`) ve KPI referanslarının zincire bağlanması.
- Doc QA: render-flow drift, template, ID, location, unique ID, story links, doc chain.

-------------------------------------------------------------------------------
## 3. STRATEJİ
-------------------------------------------------------------------------------

- Önce `PROJECT-FLOW` senkronlanır, sonra Doc QA gate seti çalıştırılır.

-------------------------------------------------------------------------------
## 4. TEST SENARYOLARI ÖZETİ
-------------------------------------------------------------------------------

- [ ] `python3 scripts/docflow_next.py render-flow --check` PASS.  
- [ ] `python3 scripts/check_doc_templates.py` PASS.  
- [ ] `python3 scripts/check_doc_ids.py` ve `python3 scripts/check_unique_delivery_ids.py` PASS.  
- [ ] `python3 scripts/check_doc_locations.py` PASS.  
- [ ] `python3 scripts/check_story_links.py STORY-0310` PASS.  
- [ ] `python3 scripts/check_doc_chain.py STORY-0310` PASS.  

-------------------------------------------------------------------------------
## 5. LİNKLER (İSTEĞE BAĞLI)
-------------------------------------------------------------------------------

- Story: docs/03-delivery/STORIES/STORY-0310-ethics-sla-and-escalation.md  
- Acceptance: docs/03-delivery/ACCEPTANCE/AC-0310-ethics-sla-and-escalation.md  
- ADR: docs/02-architecture/services/ethics-case-management/ADR/ADR-0005-ethics-sla-calendar-semantics.md  
