# TP-0311 – Ethics Retaliation Check-in Test Plan (MVP)

ID: TP-0311  
Story: STORY-0311-ethics-retaliation-checkin  
Status: Draft  
Owner: TBD

-------------------------------------------------------------------------------
## 1. AMAÇ
-------------------------------------------------------------------------------

- `STORY-0311` doküman zincirinin Doc QA gate’lerine uyumunu doğrulamak.

-------------------------------------------------------------------------------
## 2. KAPSAM
-------------------------------------------------------------------------------

- Check-in ve misilleme policy dokümantasyonu ve trace bütünlüğü.
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
- [ ] `python3 scripts/check_story_links.py STORY-0311` PASS.  
- [ ] `python3 scripts/check_doc_chain.py STORY-0311` PASS.  

-------------------------------------------------------------------------------
## 5. LİNKLER (İSTEĞE BAĞLI)
-------------------------------------------------------------------------------

- Story: docs/03-delivery/STORIES/STORY-0311-ethics-retaliation-checkin.md  
- Acceptance: docs/03-delivery/ACCEPTANCE/AC-0311-ethics-retaliation-checkin.md  

## Platform Contract
- Capability contract uyumu doğrulanır (`SPEC-0014`).
