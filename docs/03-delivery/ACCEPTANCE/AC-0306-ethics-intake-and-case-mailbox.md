# AC-0306 – Ethics Intake & Case Mailbox Acceptance (MVP)

ID: AC-0306  
Story: STORY-0306-ethics-intake-and-case-mailbox  
Status: Draft  
Owner: TBD

-------------------------------------------------------------------------------
## 1. AMAÇ
-------------------------------------------------------------------------------

- `STORY-0306` kapsamındaki intake + case mailbox davranışı için test edilebilir kabul kriterlerini tanımlamak.

-------------------------------------------------------------------------------
## 2. KAPSAM
-------------------------------------------------------------------------------

- Anonimlik politikası (BM-0001-CORE-DEC-001).
- Güvenli iki yönlü iletişim / case mailbox (BM-0001-CORE-DEC-002).
- Doküman zinciri doğrulaması (doc-qa).

-------------------------------------------------------------------------------
## 3. GIVEN / WHEN / THEN SENARYOLARI
-------------------------------------------------------------------------------

### Senaryo 1 – Intake + anonimlik politikası (MVP)

- [ ] Given: `PRD-0004` ve `SPEC-0013` vardır.  
  When: anonimlik politikası incelenir.  
  Then: `BM-0001-CORE-DEC-001` ile uyumlu ve net olmalıdır.

### Senaryo 2 – Case mailbox (iki yönlü iletişim)

- [ ] Given: `PRD-0004` vardır.  
  When: case mailbox davranışı incelenir.  
  Then: `BM-0001-CORE-DEC-002` ile uyumlu olmalıdır.

### Senaryo 3 – Doc QA PASS

- [ ] Given: `STORY-0306` zinciri eklidir.  
  When: Doc QA script seti çalıştırılır.  
  Then: PASS olmalıdır.  
  Kanıt/Evidence (önerilen):
  - `python3 scripts/docflow_next.py render-flow --check`
  - `python3 scripts/check_doc_templates.py`
  - `python3 scripts/check_doc_ids.py`
  - `python3 scripts/check_unique_delivery_ids.py`
  - `python3 scripts/check_doc_locations.py`
  - `python3 scripts/check_story_links.py STORY-0306`
  - `python3 scripts/check_doc_chain.py STORY-0306`

### Senaryo 4 – Platform capability reuse (anti-pattern guardrail)

- [ ] Given: `SPEC-0014` vardır.  
  When: implementasyon yaklaşımı planlanır.  
  Then: Custom implementation yapılmayacak; ilgili capability sözleşmesine uyulacak (Platform Spec: SPEC-0014).

-------------------------------------------------------------------------------
## 4. NOTLAR / KISITLAR
-------------------------------------------------------------------------------

- Bu aşama “doküman zinciri + kontrat” seviyesidir; implementasyon ayrı story’lerde ele alınır.

-------------------------------------------------------------------------------
## 5. ÖZET
-------------------------------------------------------------------------------

- Intake + case mailbox için acceptance kriterleri tanımlıdır.

-------------------------------------------------------------------------------
## 6. LİNKLER (İSTEĞE BAĞLI)
-------------------------------------------------------------------------------

- Story: docs/03-delivery/STORIES/STORY-0306-ethics-intake-and-case-mailbox.md  
- Test Plan: docs/03-delivery/TEST-PLANS/TP-0306-ethics-intake-and-case-mailbox.md  
- PRD: docs/01-product/PRD/PRD-0004-ethics-speakup-and-case-management-mvp.md  
- SPEC: docs/03-delivery/SPECS/SPEC-0013-ethics-case-management-contract-v1.md  
