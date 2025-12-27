# AC-0315 – Fleet Operations Management Acceptance (MVP)

ID: AC-0315  
Story: STORY-0315-fleet-operations-management  
Status: Draft  
Owner: TBD

-------------------------------------------------------------------------------
## 1. AMAÇ
-------------------------------------------------------------------------------

- `STORY-0315` kapsamındaki filo operasyon yönetimi beklentileri için test edilebilir kabul kriterlerini tanımlamak.

-------------------------------------------------------------------------------
## 2. KAPSAM
-------------------------------------------------------------------------------

- Araç kimliği ve doküman sürümleme guardrail’leri.
- Due-date + bildirim yaklaşımı (platform capability reuse).
- Doc QA gate seti ve doküman zinciri tutarlılığı.

-------------------------------------------------------------------------------
## 3. GIVEN / WHEN / THEN SENARYOLARI
-------------------------------------------------------------------------------

### Ortak

#### Senaryo 1 – Zincir ve kontrat SSOT (MVP)

- [ ] Given: `PB-0006`, `PRD-0006`, `SPEC-0016` vardır.  
  When: dokümanlar incelenir.  
  Then: MVP kapsam, non-goals ve minimum sözleşme net olmalıdır.

#### Senaryo 2 – Platform capability reuse (anti-pattern guardrail)

- [ ] Given: `SPEC-0014` vardır.  
  When: Platform Dependencies listesi kontrol edilir.  
  Then: Bildirim/audit/evidence/reporting için custom implementasyon yaklaşımı yoktur; capability sözleşmesi reuse edilir.

#### Senaryo 3 – Negatif: kayıt ve doküman silme yok

- [ ] Given: `SPEC-0016` sözleşmesi vardır.  
  When: “araç kaydı silme” veya “doküman silme” beklentisi oluşur.  
  Then: Silme yoktur; status ile kapatma + doküman sürümleme uygulanır.

#### Senaryo 4 – Negatif: odometre geriye gidemez

- [ ] Given: bakım/yakıt kayıtlarında odometre alanı kullanılır.  
  When: odometre daha düşük bir değerle güncellenmek istenir.  
  Then: Bloklanır; istisna için gerekçe + audit zorunludur.

#### Senaryo 5 – Doc QA PASS

- [ ] Given: `STORY-0315` zinciri eklidir.  
  When: Doc QA script seti çalıştırılır.  
  Then: PASS olmalıdır.
  - Kanıt/Evidence:
    - `python3 scripts/docflow_next.py render-flow --check`
    - `python3 scripts/check_doc_templates.py`
    - `python3 scripts/check_doc_ids.py`
    - `python3 scripts/check_unique_delivery_ids.py`
    - `python3 scripts/check_id_registry.py`
    - `python3 scripts/check_doc_locations.py`
    - `python3 scripts/check_story_links.py STORY-0315`
    - `python3 scripts/check_doc_chain.py STORY-0315`

-------------------------------------------------------------------------------
## 4. NOTLAR / KISITLAR
-------------------------------------------------------------------------------

- MVP’de entegrasyonlar (yakıt kartı/ceza) opsiyoneldir; manuel giriş ile başlayabilir.

-------------------------------------------------------------------------------
## 5. ÖZET
-------------------------------------------------------------------------------

- Filo operasyon yönetimi için zincir ve platform reuse acceptance kriterleri tanımlıdır.

-------------------------------------------------------------------------------
## 6. LİNKLER (İSTEĞE BAĞLI)
-------------------------------------------------------------------------------

- Story: docs/03-delivery/STORIES/STORY-0315-fleet-operations-management.md  
- Test Plan: docs/03-delivery/TEST-PLANS/TP-0315-fleet-operations-management.md  
- PRD: docs/01-product/PRD/PRD-0006-fleet-operations-management-mvp.md  
- SPEC: docs/03-delivery/SPECS/SPEC-0016-fleet-operations-management-contract-v1.md  

