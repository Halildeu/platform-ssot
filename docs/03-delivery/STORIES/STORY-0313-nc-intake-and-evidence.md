# STORY-0313 – NC: Intake & Evidence (MVP)

ID: STORY-0313-nc-intake-and-evidence  
Epic: NC-MVP  
Status: Design  
Owner: TBD  
Upstream: `PB-0005`, `PRD-0005`, `SPEC-0015`  
Downstream: AC-0313, TP-0313

-------------------------------------------------------------------------------
## 1. AMAÇ
-------------------------------------------------------------------------------

- NC kaydının (intake) minimum alan setini ve sınıflandırma yaklaşımını netleştirmek.
- Kanıt/ek (evidence/attachment) beklentilerini ve audit izini delivery zincirine bağlamak.

-------------------------------------------------------------------------------
## 2. TANIM
-------------------------------------------------------------------------------

- Bir saha kullanıcısı olarak, uygunsuzluğu hızlıca kaydedip kanıt eklemek istiyorum; böylece tekrar eden sorunlar ölçülebilir şekilde azaltılabilir.

-------------------------------------------------------------------------------
## 3. KAPSAM VE SINIRLAR
-------------------------------------------------------------------------------

Dahil:
- NC kaydı (kategori/şiddet/lokasyon/açıklama) minimum kontratı.
- Kanıt/ek ekleme beklentisi (versiyon/immutability expectation) + erişim logu sinyali.

Hariç:
- SLA breach/eskalasyon detayları (SLA story’sinde ele alınır).
- CAPA aksiyon yaşam döngüsü (STORY-0314).

-------------------------------------------------------------------------------
## 4. ACCEPTANCE KRİTERLERİ
-------------------------------------------------------------------------------

- [ ] Given: `PB-0005`, `PRD-0005`, `SPEC-0015` ve `STORY-0313` zinciri vardır. When: NC intake kontratı incelenir. Then: minimum alanlar ve evidence beklentisi net olmalıdır.
- [ ] Given: doc-qa gate seti çalıştırılır. When: `STORY-0313` zinciri doğrulanır. Then: PASS olmalıdır.

-------------------------------------------------------------------------------
## 5. BAĞIMLILIKLAR
-------------------------------------------------------------------------------

- `docs/01-product/PROBLEM-BRIEFS/PB-0005-nc-capa-management.md`
- `docs/01-product/PRD/PRD-0005-nc-capa-management-mvp.md`
- `docs/03-delivery/SPECS/SPEC-0015-nc-capa-contract-v1.md`

-------------------------------------------------------------------------------
## 6. ÖZET
-------------------------------------------------------------------------------

- NC intake + evidence kontratı SSOT: `PRD-0005` + `SPEC-0015`.
- Zincir: `STORY-0313` ↔ `AC-0313` ↔ `TP-0313`.

-------------------------------------------------------------------------------
## 7. LİNKLER (İSTEĞE BAĞLI)
-------------------------------------------------------------------------------

- PB: docs/01-product/PROBLEM-BRIEFS/PB-0005-nc-capa-management.md
- PRD: docs/01-product/PRD/PRD-0005-nc-capa-management-mvp.md
- SPEC: docs/03-delivery/SPECS/SPEC-0015-nc-capa-contract-v1.md
- Acceptance: docs/03-delivery/ACCEPTANCE/AC-0313-nc-intake-and-evidence.md
- Test Plan: docs/03-delivery/TEST-PLANS/TP-0313-nc-intake-and-evidence.md

## Platform Dependencies
- Platform Spec: `SPEC-0014`
- Evidence / Attachment
- Audit Trail & View Log
- Case / Work Item Engine

