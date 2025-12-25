# AC-0311 – Ethics Retaliation Check-in Acceptance (MVP)

ID: AC-0311  
Story: STORY-0311-ethics-retaliation-checkin  
Status: Draft  
Owner: TBD

-------------------------------------------------------------------------------
## 1. AMAÇ
-------------------------------------------------------------------------------

- `STORY-0311` kapsamındaki misilleme check-in ve protection policy için kabul kriterlerini tanımlamak.

-------------------------------------------------------------------------------
## 2. KAPSAM
-------------------------------------------------------------------------------

- Check-in zaman pencereleri (BM-0001-CTRL-GRD-005).
- Misilleme iddiası ayrı vaka tipi (BM-0001-CTRL-GRD-006).

-------------------------------------------------------------------------------
## 3. GIVEN / WHEN / THEN SENARYOLARI
-------------------------------------------------------------------------------

### Senaryo 1 – Check-in politikası

- [ ] Given: `BM-0001-CTRL-GRD-005` vardır.  
  When: check-in akışı incelenir.  
  Then: 30/60/90 gün yaklaşımı net olmalıdır.

### Senaryo 2 – Misilleme ayrı vaka tipi

- [ ] Given: `BM-0001-CTRL-GRD-006` vardır.  
  When: misilleme iddiası oluşur.  
  Then: ayrı vaka tipi olarak açılabilmelidir (policy).

### Senaryo 3 – Doc QA PASS

- [ ] Given: `STORY-0311` zinciri eklidir.  
  When: Doc QA script seti çalıştırılır.  
  Then: PASS olmalıdır.  
  Kanıt/Evidence (önerilen):
  - `python3 scripts/docflow_next.py render-flow --check`
  - `python3 scripts/check_doc_templates.py`
  - `python3 scripts/check_doc_ids.py`
  - `python3 scripts/check_unique_delivery_ids.py`
  - `python3 scripts/check_doc_locations.py`
  - `python3 scripts/check_story_links.py STORY-0311`
  - `python3 scripts/check_doc_chain.py STORY-0311`

### Senaryo 4 – Platform capability reuse (anti-pattern guardrail)

- [ ] Given: `SPEC-0014` vardır.  
  When: implementasyon yaklaşımı planlanır.  
  Then: Custom implementation yapılmayacak; ilgili capability sözleşmesine uyulacak (Platform Spec: SPEC-0014).

-------------------------------------------------------------------------------
## 4. NOTLAR / KISITLAR
-------------------------------------------------------------------------------

- Bildirim kanalı entegrasyonları (SMS/e-posta vb.) bu story kapsamı dışındadır.

-------------------------------------------------------------------------------
## 5. ÖZET
-------------------------------------------------------------------------------

- Misilleme check-in acceptance kriterleri tanımlıdır.

-------------------------------------------------------------------------------
## 6. LİNKLER (İSTEĞE BAĞLI)
-------------------------------------------------------------------------------

- Story: docs/03-delivery/STORIES/STORY-0311-ethics-retaliation-checkin.md  
- Test Plan: docs/03-delivery/TEST-PLANS/TP-0311-ethics-retaliation-checkin.md  
