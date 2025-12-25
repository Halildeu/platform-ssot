# TP-0314 – NC CAPA Workflow Test Plan (MVP)

ID: TP-0314  
Story: STORY-0314-nc-capa-workflow  
Status: Draft  
Owner: TBD

-------------------------------------------------------------------------------
## 1. AMAÇ
-------------------------------------------------------------------------------

- `STORY-0314` doküman zincirinin ve platform bağımlılıklarının Doc QA gate’lerine uyumunu doğrulamak.

-------------------------------------------------------------------------------
## 2. KAPSAM
-------------------------------------------------------------------------------

- Doc QA: render-flow drift, template, ID, location, unique ID, story links, doc chain.
- İçerik doğrulama: CAPA workflow + SLA/bildirim beklentileri (manuel).

-------------------------------------------------------------------------------
## 3. STRATEJİ
-------------------------------------------------------------------------------

- `PROJECT-FLOW.tsv` güncellenir ve `render-flow` ile `PROJECT-FLOW.md` senkronlanır.
- Ardından Doc QA gate seti çalıştırılır; PASS olmadan tamamlandı sayılmaz.

-------------------------------------------------------------------------------
## 4. TEST SENARYOLARI ÖZETİ
-------------------------------------------------------------------------------

- [ ] `python3 scripts/docflow_next.py render-flow --check` PASS.  
- [ ] `python3 scripts/check_doc_templates.py` PASS.  
- [ ] `python3 scripts/check_doc_ids.py` ve `python3 scripts/check_unique_delivery_ids.py` PASS.  
- [ ] `python3 scripts/check_doc_locations.py` PASS.  
- [ ] `python3 scripts/check_story_links.py STORY-0314` PASS.  
- [ ] `python3 scripts/check_doc_chain.py STORY-0314` PASS.  

-------------------------------------------------------------------------------
## 5. LİNKLER (İSTEĞE BAĞLI)
-------------------------------------------------------------------------------

- Story: docs/03-delivery/STORIES/STORY-0314-nc-capa-workflow.md  
- Acceptance: docs/03-delivery/ACCEPTANCE/AC-0314-nc-capa-workflow.md  
- PRD: docs/01-product/PRD/PRD-0005-nc-capa-management-mvp.md  
- SPEC: docs/03-delivery/SPECS/SPEC-0015-nc-capa-contract-v1.md  

## Platform Contract
- Capability contract uyumu doğrulanır (`SPEC-0014`).

