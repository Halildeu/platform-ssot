# AC-0307 – Ethics COI & Access Boundary Acceptance (MVP)

ID: AC-0307  
Story: STORY-0307-ethics-coi-and-access-boundary  
Status: Draft  
Owner: TBD

-------------------------------------------------------------------------------
## 1. AMAÇ
-------------------------------------------------------------------------------

- `STORY-0307` kapsamındaki COI ve access boundary kararlarının kabul kriterlerini tanımlamak.

-------------------------------------------------------------------------------
## 2. KAPSAM
-------------------------------------------------------------------------------

- COI kontrolü + erişim engeli + bağımsız atama (BM-0001-CTRL-GRD-001).
- Need-to-know erişim sınırları.
- ADR kararlarının dokümante edilmesi (`ADR-0003`).

-------------------------------------------------------------------------------
## 3. GIVEN / WHEN / THEN SENARYOLARI
-------------------------------------------------------------------------------

### Senaryo 1 – COI erişim engeli

- [ ] Given: `BM-0001-CTRL-GRD-001` vardır.  
  When: COI kontrolü uygulanır.  
  Then: COI olan kişi vakaya erişemez/atanamaz; bağımsız atama yapılır.

### Senaryo 2 – ADR karar bütünlüğü

- [ ] Given: `ADR-0003` vardır.  
  When: erişim/atama sınırı kararları incelenir.  
  Then: kararlar net ve tek anlamlı olmalıdır.

### Senaryo 3 – Doc QA PASS

- [ ] Given: `STORY-0307` zinciri eklidir.  
  When: Doc QA script seti çalıştırılır.  
  Then: PASS olmalıdır.  
  Kanıt/Evidence (önerilen):
  - `python3 scripts/docflow_next.py render-flow --check`
  - `python3 scripts/check_doc_templates.py`
  - `python3 scripts/check_doc_ids.py`
  - `python3 scripts/check_unique_delivery_ids.py`
  - `python3 scripts/check_doc_locations.py`
  - `python3 scripts/check_story_links.py STORY-0307`
  - `python3 scripts/check_doc_chain.py STORY-0307`

### Senaryo 4 – Platform capability reuse (anti-pattern guardrail)

- [ ] Given: `SPEC-0014` vardır.  
  When: implementasyon yaklaşımı planlanır.  
  Then: Custom implementation yapılmayacak; ilgili capability sözleşmesine uyulacak (Platform Spec: SPEC-0014).

-------------------------------------------------------------------------------
## 4. NOTLAR / KISITLAR
-------------------------------------------------------------------------------

- COI sinyali kaynağı (HR vb.) bu story’de detaylandırılmaz; kontrat seviyesinde kalınır.

-------------------------------------------------------------------------------
## 5. ÖZET
-------------------------------------------------------------------------------

- COI ve access boundary için acceptance kriterleri tanımlıdır.

-------------------------------------------------------------------------------
## 6. LİNKLER (İSTEĞE BAĞLI)
-------------------------------------------------------------------------------

- Story: docs/03-delivery/STORIES/STORY-0307-ethics-coi-and-access-boundary.md  
- Test Plan: docs/03-delivery/TEST-PLANS/TP-0307-ethics-coi-and-access-boundary.md  
- ADR: docs/02-architecture/services/ethics-case-management/ADR/ADR-0003-ethics-coi-access-boundary.md  
- SPEC: docs/03-delivery/SPECS/SPEC-0013-ethics-case-management-contract-v1.md  
