# TP-0308 – Ethics Audit Trail & Evidence Handling Test Plan (MVP)

ID: TP-0308  
Story: STORY-0308-ethics-audit-trail-and-evidence-handling  
Status: Draft  
Owner: TBD

-------------------------------------------------------------------------------
## 1. AMAÇ
-------------------------------------------------------------------------------

- `STORY-0308` doküman zincirinin Doc QA gate’lerine uyumunu doğrulamak.

-------------------------------------------------------------------------------
## 2. KAPSAM
-------------------------------------------------------------------------------

- Evidence immutability (`ADR-0004`) ve audit trail gereksinimlerinin zincire bağlanması.
- Doc QA: render-flow drift, template, ID, location, unique ID, story links, doc chain.

-------------------------------------------------------------------------------
## 3. STRATEJİ
-------------------------------------------------------------------------------

- Önce `PROJECT-FLOW` senkronlanır, sonra Doc QA gate seti çalıştırılır.
- Evidence/audit gereksinimleri acceptance seviyesinde doğrulanır (implementasyon ayrı story).

-------------------------------------------------------------------------------
## 4. TEST SENARYOLARI ÖZETİ
-------------------------------------------------------------------------------

- [ ] `python3 scripts/docflow_next.py render-flow --check` PASS.  
- [ ] `python3 scripts/check_doc_templates.py` PASS.  
- [ ] `python3 scripts/check_doc_ids.py` ve `python3 scripts/check_unique_delivery_ids.py` PASS.  
- [ ] `python3 scripts/check_doc_locations.py` PASS.  
- [ ] `python3 scripts/check_story_links.py STORY-0308` PASS.  
- [ ] `python3 scripts/check_doc_chain.py STORY-0308` PASS.  

-------------------------------------------------------------------------------
## 5. LİNKLER (İSTEĞE BAĞLI)
-------------------------------------------------------------------------------

- Story: docs/03-delivery/STORIES/STORY-0308-ethics-audit-trail-and-evidence-handling.md  
- Acceptance: docs/03-delivery/ACCEPTANCE/AC-0308-ethics-audit-trail-and-evidence-handling.md  
- ADR: docs/02-architecture/services/ethics-case-management/ADR/ADR-0004-ethics-evidence-immutability-policy.md  
- SPEC: docs/03-delivery/SPECS/SPEC-0013-ethics-case-management-contract-v1.md  

## Platform Contract
- Capability contract uyumu doğrulanır (`SPEC-0014`).
