# AC-0309 – Ethics Triage Routing Policy Acceptance (MVP)

ID: AC-0309  
Story: STORY-0309-ethics-triage-routing-policy  
Status: Draft  
Owner: TBD

-------------------------------------------------------------------------------
## 1. AMAÇ
-------------------------------------------------------------------------------

- `STORY-0309` kapsamındaki triage routing policy için test edilebilir kabul kriterlerini tanımlamak.

-------------------------------------------------------------------------------
## 2. KAPSAM
-------------------------------------------------------------------------------

- Vaka tipleri ve yönlendirme (BM-0001-CORE-DEC-003).
- Doküman zinciri doğrulaması (doc-qa).

-------------------------------------------------------------------------------
## 3. GIVEN / WHEN / THEN SENARYOLARI
-------------------------------------------------------------------------------

### Senaryo 1 – Routing policy netliği

- [ ] Given: `BM-0001-CORE-DEC-003` vardır.  
  When: routing policy incelenir.  
  Then: vaka tipi → hedef süreç eşlemesi net olmalıdır.

### Senaryo 2 – Doc QA PASS

- [ ] Given: `STORY-0309` zinciri eklidir.  
  When: Doc QA script seti çalıştırılır.  
  Then: PASS olmalıdır.  
  Kanıt/Evidence (önerilen):
  - `python3 scripts/docflow_next.py render-flow --check`
  - `python3 scripts/check_doc_templates.py`
  - `python3 scripts/check_doc_ids.py`
  - `python3 scripts/check_unique_delivery_ids.py`
  - `python3 scripts/check_doc_locations.py`
  - `python3 scripts/check_story_links.py STORY-0309`
  - `python3 scripts/check_doc_chain.py STORY-0309`

-------------------------------------------------------------------------------
## 4. NOTLAR / KISITLAR
-------------------------------------------------------------------------------

- Bu story policy seviyesindedir; implementasyon detayları ayrı story’lere bölünebilir.

-------------------------------------------------------------------------------
## 5. ÖZET
-------------------------------------------------------------------------------

- Triage routing policy acceptance kriterleri tanımlıdır.

-------------------------------------------------------------------------------
## 6. LİNKLER (İSTEĞE BAĞLI)
-------------------------------------------------------------------------------

- Story: docs/03-delivery/STORIES/STORY-0309-ethics-triage-routing-policy.md  
- Test Plan: docs/03-delivery/TEST-PLANS/TP-0309-ethics-triage-routing-policy.md  
- SPEC: docs/03-delivery/SPECS/SPEC-0013-ethics-case-management-contract-v1.md  
