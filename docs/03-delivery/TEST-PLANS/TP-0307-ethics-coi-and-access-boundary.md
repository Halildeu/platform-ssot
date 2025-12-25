# TP-0307 – Ethics COI & Access Boundary Test Plan (MVP)

ID: TP-0307  
Story: STORY-0307-ethics-coi-and-access-boundary  
Status: Draft  
Owner: TBD

-------------------------------------------------------------------------------
## 1. AMAÇ
-------------------------------------------------------------------------------

- `STORY-0307` doküman zincirinin Doc QA gate’lerine uyumunu doğrulamak.

-------------------------------------------------------------------------------
## 2. KAPSAM
-------------------------------------------------------------------------------

- COI ve access boundary kararlarının (`ADR-0003`) zincire doğru bağlanması.
- Doc QA: render-flow drift, template, ID, location, unique ID, story links, doc chain.

-------------------------------------------------------------------------------
## 3. STRATEJİ
-------------------------------------------------------------------------------

- Önce `PROJECT-FLOW` senkronlanır, sonra Doc QA gate seti çalıştırılır.
- COI senaryoları acceptance seviyesinde “negatif test” olarak doğrulanır (implementasyon ayrı story).

-------------------------------------------------------------------------------
## 4. TEST SENARYOLARI ÖZETİ
-------------------------------------------------------------------------------

- [ ] `python3 scripts/docflow_next.py render-flow --check` PASS.  
- [ ] `python3 scripts/check_doc_templates.py` PASS.  
- [ ] `python3 scripts/check_doc_ids.py` ve `python3 scripts/check_unique_delivery_ids.py` PASS.  
- [ ] `python3 scripts/check_doc_locations.py` PASS.  
- [ ] `python3 scripts/check_story_links.py STORY-0307` PASS.  
- [ ] `python3 scripts/check_doc_chain.py STORY-0307` PASS.  

-------------------------------------------------------------------------------
## 5. LİNKLER (İSTEĞE BAĞLI)
-------------------------------------------------------------------------------

- Story: docs/03-delivery/STORIES/STORY-0307-ethics-coi-and-access-boundary.md  
- Acceptance: docs/03-delivery/ACCEPTANCE/AC-0307-ethics-coi-and-access-boundary.md  
- ADR: docs/02-architecture/services/ethics-case-management/ADR/ADR-0003-ethics-coi-access-boundary.md  
- SPEC: docs/03-delivery/SPECS/SPEC-0013-ethics-case-management-contract-v1.md  
