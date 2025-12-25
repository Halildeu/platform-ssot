# STORY-0312 – Ethics: Closure Quality Score (MVP)

ID: STORY-0312-ethics-closure-quality-score  
Epic: ETHICS-MVP  
Status: Design  
Owner: TBD  
Upstream: `PB-0004`, `PRD-0004`, `SPEC-0013`  
Downstream: AC-0312, TP-0312

-------------------------------------------------------------------------------
## 1. AMAÇ
-------------------------------------------------------------------------------

- Kapanış kalite skorunu (BM-0001-MET-KPI-009) MVP’de uygulanabilir kriter setiyle tanımlamak.
- “Hız” baskısını kalite metriği ile dengelemek (PRD-0004 risk mitigasyonu).

-------------------------------------------------------------------------------
## 2. TANIM
-------------------------------------------------------------------------------

- Bir program sahibi olarak, kapanışın kalitesini ölçen deterministik bir skor istiyorum; böylece kapanışlar sadece “kapandı” değil, kaliteyle değerlendirilebilir olur.

-------------------------------------------------------------------------------
## 3. KAPSAM VE SINIRLAR
-------------------------------------------------------------------------------

Dahil:
- MVP minimum 5 kriterli kapanış kalite skoru tanımı.
- Skorun raporlanması için gereksinim (OBS story later).

Hariç:
- Dashboard tasarımı ve metrik altyapısı (OBS/monitoring dokümanları).

-------------------------------------------------------------------------------
## 4. ACCEPTANCE KRİTERLERİ
-------------------------------------------------------------------------------

- [ ] Given: `BM-0001-MET-KPI-009` vardır. When: kapanış kalite skoru tanımı incelenir. Then: kriterler test edilebilir ve net olmalıdır.
- [ ] Given: `PRD-0004` riskleri vardır. When: kalite/hız dengesi değerlendirilir. Then: kalite skoru bu dengeyi desteklemelidir.
- [ ] Given: doc-qa gate seti çalıştırılır. When: `STORY-0312` zinciri doğrulanır. Then: PASS olmalıdır.

-------------------------------------------------------------------------------
## 5. BAĞIMLILIKLAR
-------------------------------------------------------------------------------

- `docs/03-delivery/SPECS/SPEC-0013-ethics-case-management-contract-v1.md`

-------------------------------------------------------------------------------
## 6. ÖZET
-------------------------------------------------------------------------------

- Kapanış kalite skoru gereksinimi tanımlıdır.
- Zincir: `STORY-0312` ↔ `AC-0312` ↔ `TP-0312`.

-------------------------------------------------------------------------------
## 7. LİNKLER (İSTEĞE BAĞLI)
-------------------------------------------------------------------------------

- PRD: docs/01-product/PRD/PRD-0004-ethics-speakup-and-case-management-mvp.md
- SPEC: docs/03-delivery/SPECS/SPEC-0013-ethics-case-management-contract-v1.md
- Acceptance: docs/03-delivery/ACCEPTANCE/AC-0312-ethics-closure-quality-score.md
- Test Plan: docs/03-delivery/TEST-PLANS/TP-0312-ethics-closure-quality-score.md
