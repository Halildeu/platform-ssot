# AC-0308 – Ethics Audit Trail & Evidence Handling Acceptance (MVP)

ID: AC-0308  
Story: STORY-0308-ethics-audit-trail-and-evidence-handling  
Status: Draft  
Owner: TBD

-------------------------------------------------------------------------------
## 1. AMAÇ
-------------------------------------------------------------------------------

- `STORY-0308` kapsamındaki evidence immutability ve audit trail kabul kriterlerini tanımlamak.

-------------------------------------------------------------------------------
## 2. KAPSAM
-------------------------------------------------------------------------------

- Delil silinmez; ek/sürüm yaklaşımı (BM-0001-CTRL-GRD-003).
- Görüntüleme/değiştirme audit log zorunlu (BM-0001-CTRL-GRD-004).
- ADR kararlarının dokümante edilmesi (`ADR-0004`).

-------------------------------------------------------------------------------
## 3. GIVEN / WHEN / THEN SENARYOLARI
-------------------------------------------------------------------------------

### Senaryo 1 – Evidence immutability

- [ ] Given: `ADR-0004` ve `BM-0001-CTRL-GRD-003` vardır.  
  When: evidence politikası incelenir.  
  Then: “silme yok, ek/sürüm var” kararı net olmalıdır.

### Senaryo 2 – Audit log zorunluluğu

- [ ] Given: `BM-0001-CTRL-GRD-004` vardır.  
  When: audit trail gereksinimi değerlendirilir.  
  Then: görüntüleme/değişiklik audit log zorunlu olmalıdır.

### Senaryo 3 – Doc QA PASS

- [ ] Given: `STORY-0308` zinciri eklidir.  
  When: Doc QA script seti çalıştırılır.  
  Then: PASS olmalıdır.  
  Kanıt/Evidence (önerilen):
  - `python3 scripts/docflow_next.py render-flow --check`
  - `python3 scripts/check_doc_templates.py`
  - `python3 scripts/check_doc_ids.py`
  - `python3 scripts/check_unique_delivery_ids.py`
  - `python3 scripts/check_doc_locations.py`
  - `python3 scripts/check_story_links.py STORY-0308`
  - `python3 scripts/check_doc_chain.py STORY-0308`

-------------------------------------------------------------------------------
## 4. NOTLAR / KISITLAR
-------------------------------------------------------------------------------

- Depolama/retention ve legal hold kapsamı bu story dışındadır.

-------------------------------------------------------------------------------
## 5. ÖZET
-------------------------------------------------------------------------------

- Evidence immutability ve audit trail için acceptance kriterleri tanımlıdır.

-------------------------------------------------------------------------------
## 6. LİNKLER (İSTEĞE BAĞLI)
-------------------------------------------------------------------------------

- Story: docs/03-delivery/STORIES/STORY-0308-ethics-audit-trail-and-evidence-handling.md  
- Test Plan: docs/03-delivery/TEST-PLANS/TP-0308-ethics-audit-trail-and-evidence-handling.md  
- ADR: docs/02-architecture/services/ethics-case-management/ADR/ADR-0004-ethics-evidence-immutability-policy.md  
- SPEC: docs/03-delivery/SPECS/SPEC-0013-ethics-case-management-contract-v1.md  
