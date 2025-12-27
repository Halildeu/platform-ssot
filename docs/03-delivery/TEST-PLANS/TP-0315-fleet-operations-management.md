# TP-0315 – Fleet Operations Management Test Plan (MVP)

ID: TP-0315  
Story: STORY-0315-fleet-operations-management  
Status: Draft  
Owner: TBD

-------------------------------------------------------------------------------
## 1. AMAÇ
-------------------------------------------------------------------------------

- `STORY-0315` doküman zincirinin ve platform bağımlılıklarının Doc QA gate’lerine uyumunu doğrulamak.

-------------------------------------------------------------------------------
## 2. KAPSAM
-------------------------------------------------------------------------------

- Doc QA: render-flow drift, template, ID, location, unique ID, story links, doc chain, governance migration, registry.
- İçerik doğrulama: `PRD-0006` ve `SPEC-0016` kontrat maddeleri (manuel).

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
- [ ] `python3 scripts/check_id_registry.py` PASS.  
- [ ] `python3 scripts/check_doc_locations.py` PASS.  
- [ ] `python3 scripts/check_story_links.py STORY-0315` PASS.  
- [ ] `python3 scripts/check_doc_chain.py STORY-0315` PASS.  

-------------------------------------------------------------------------------
## 5. ÇEVRE VE ARAÇLAR
-------------------------------------------------------------------------------

- Python 3 (scripts)
- Git (diff için: `origin/main...HEAD`)

-------------------------------------------------------------------------------
## 6. RİSKLER / ÖNCELİKLER
-------------------------------------------------------------------------------

- Öncelik: ID registry + PROJECT-FLOW sync + template uyumu.
- Risk: Dış entegrasyonlar yokken “varsayım” ile teknik detay uydurmak; kontrat MVP seviyesinde tutulmalı.

-------------------------------------------------------------------------------
## 7. ÖZET
-------------------------------------------------------------------------------

- Bu TP, doküman zincirinin deterministik gate seti ile doğrulanmasını hedefler.

-------------------------------------------------------------------------------
## 8. LİNKLER (İSTEĞE BAĞLI)
-------------------------------------------------------------------------------

- Story: docs/03-delivery/STORIES/STORY-0315-fleet-operations-management.md  
- Acceptance: docs/03-delivery/ACCEPTANCE/AC-0315-fleet-operations-management.md  
- PRD: docs/01-product/PRD/PRD-0006-fleet-operations-management-mvp.md  
- SPEC: docs/03-delivery/SPECS/SPEC-0016-fleet-operations-management-contract-v1.md  

## Platform Contract
- Capability contract uyumu doğrulanır (`SPEC-0014`).

