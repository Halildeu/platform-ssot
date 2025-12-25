# AC-0313 – NC Intake & Evidence Acceptance (MVP)

ID: AC-0313  
Story: STORY-0313-nc-intake-and-evidence  
Status: Draft  
Owner: TBD

-------------------------------------------------------------------------------
## 1. AMAÇ
-------------------------------------------------------------------------------

- `STORY-0313` kapsamındaki NC intake + evidence beklentileri için test edilebilir kabul kriterlerini tanımlamak.

-------------------------------------------------------------------------------
## 2. KAPSAM
-------------------------------------------------------------------------------

- NC intake minimum kontratı (`PRD-0005`, `SPEC-0015`).
- Evidence/attachment ve audit beklentileri (platform capability reuse).
- Doküman zinciri doğrulaması (doc-qa).

-------------------------------------------------------------------------------
## 3. GIVEN / WHEN / THEN SENARYOLARI
-------------------------------------------------------------------------------

### Senaryo 1 – NC intake + evidence kontratı (MVP)

- [ ] Given: `PRD-0005` ve `SPEC-0015` vardır.  
  When: NC intake alanları ve evidence beklentisi incelenir.  
  Then: minimum alan seti ve evidence yaklaşımı net olmalıdır.

### Senaryo 2 – Doc QA PASS

- [ ] Given: `STORY-0313` zinciri eklidir.  
  When: Doc QA script seti çalıştırılır.  
  Then: PASS olmalıdır.  
  Kanıt/Evidence (önerilen):
  - `python3 scripts/docflow_next.py render-flow --check`
  - `python3 scripts/check_doc_templates.py`
  - `python3 scripts/check_doc_ids.py`
  - `python3 scripts/check_unique_delivery_ids.py`
  - `python3 scripts/check_doc_locations.py`
  - `python3 scripts/check_story_links.py STORY-0313`
  - `python3 scripts/check_doc_chain.py STORY-0313`

### Senaryo 3 – Platform capability reuse (anti-pattern guardrail)

- [ ] Given: `SPEC-0014` vardır.  
  When: implementasyon yaklaşımı planlanır.  
  Then: Custom implementation yapılmayacak; ilgili capability sözleşmesine uyulacak (Platform Spec: SPEC-0014).

-------------------------------------------------------------------------------
## 4. NOTLAR / KISITLAR
-------------------------------------------------------------------------------

- Bu aşama “kontrat + zincir” seviyesidir; UI/implementasyon ayrı story’lerde ele alınır.

-------------------------------------------------------------------------------
## 5. ÖZET
-------------------------------------------------------------------------------

- NC intake + evidence acceptance kriterleri tanımlıdır.

-------------------------------------------------------------------------------
## 6. LİNKLER (İSTEĞE BAĞLI)
-------------------------------------------------------------------------------

- Story: docs/03-delivery/STORIES/STORY-0313-nc-intake-and-evidence.md  
- Test Plan: docs/03-delivery/TEST-PLANS/TP-0313-nc-intake-and-evidence.md  
- PRD: docs/01-product/PRD/PRD-0005-nc-capa-management-mvp.md  
- SPEC: docs/03-delivery/SPECS/SPEC-0015-nc-capa-contract-v1.md  

