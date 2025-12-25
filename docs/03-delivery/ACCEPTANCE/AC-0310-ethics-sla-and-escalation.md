# AC-0310 – Ethics SLA & Escalation Acceptance (MVP)

ID: AC-0310  
Story: STORY-0310-ethics-sla-and-escalation  
Status: Draft  
Owner: TBD

-------------------------------------------------------------------------------
## 1. AMAÇ
-------------------------------------------------------------------------------

- `STORY-0310` kapsamındaki SLA semantiği ve eskalasyon kuralları için kabul kriterlerini tanımlamak.

-------------------------------------------------------------------------------
## 2. KAPSAM
-------------------------------------------------------------------------------

- SLA ihlal oranı metriği (BM-0001-MET-KPI-004).
- SLA hesaplama semantiği kararı (ADR-0005).

-------------------------------------------------------------------------------
## 3. GIVEN / WHEN / THEN SENARYOLARI
-------------------------------------------------------------------------------

### Senaryo 1 – SLA semantiği deterministik

- [ ] Given: `ADR-0005` vardır.  
  When: iş günü/saat dilimi/tatil yaklaşımı incelenir.  
  Then: SLA hesaplaması deterministik olmalıdır.

### Senaryo 2 – KPI tanımı

- [ ] Given: `BM-0001-MET-KPI-004` vardır.  
  When: KPI tanımı incelenir.  
  Then: breach ölçümü ve eskalasyon ilişkisi net olmalıdır.

### Senaryo 3 – Doc QA PASS

- [ ] Given: `STORY-0310` zinciri eklidir.  
  When: Doc QA script seti çalıştırılır.  
  Then: PASS olmalıdır.  
  Kanıt/Evidence (önerilen):
  - `python3 scripts/docflow_next.py render-flow --check`
  - `python3 scripts/check_doc_templates.py`
  - `python3 scripts/check_doc_ids.py`
  - `python3 scripts/check_unique_delivery_ids.py`
  - `python3 scripts/check_doc_locations.py`
  - `python3 scripts/check_story_links.py STORY-0310`
  - `python3 scripts/check_doc_chain.py STORY-0310`

-------------------------------------------------------------------------------
## 4. NOTLAR / KISITLAR
-------------------------------------------------------------------------------

- Takvim kaynağı ve entegrasyon detayları bu story kapsamı dışındadır.

-------------------------------------------------------------------------------
## 5. ÖZET
-------------------------------------------------------------------------------

- SLA & eskalasyon acceptance kriterleri tanımlıdır.

-------------------------------------------------------------------------------
## 6. LİNKLER (İSTEĞE BAĞLI)
-------------------------------------------------------------------------------

- Story: docs/03-delivery/STORIES/STORY-0310-ethics-sla-and-escalation.md  
- Test Plan: docs/03-delivery/TEST-PLANS/TP-0310-ethics-sla-and-escalation.md  
- ADR: docs/02-architecture/services/ethics-case-management/ADR/ADR-0005-ethics-sla-calendar-semantics.md  
