# STORY-0306 – Ethics: Intake & Case Mailbox (MVP)

ID: STORY-0306-ethics-intake-and-case-mailbox  
Epic: ETHICS-MVP  
Status: Design  
Owner: TBD  
Upstream: `PB-0004`, `PRD-0004`, `SPEC-0013`  
Downstream: AC-0306, TP-0306

-------------------------------------------------------------------------------
## 1. AMAÇ
-------------------------------------------------------------------------------

- Anonimlik politikasını (BM-0001-CORE-DEC-001) MVP seviyesinde netleştirmek ve delivery zincirine bağlamak.
- Güvenli iki yönlü iletişim (case mailbox) davranışını (BM-0001-CORE-DEC-002) tanımlamak.

-------------------------------------------------------------------------------
## 2. TANIM
-------------------------------------------------------------------------------

- Bir reporter (bildiren) olarak, güvenli şekilde bildirim oluşturup iki yönlü iletişimle takip etmek istiyorum; böylece anonimlik korunurken süreç şeffaf ilerler.

-------------------------------------------------------------------------------
## 3. KAPSAM VE SINIRLAR
-------------------------------------------------------------------------------

Dahil:
- Anonimlik politikasının PRD seviyesinde netleştirilmesi (MVP).
- Case mailbox (güvenli iki yönlü iletişim) akışının tanımlanması.

Hariç:
- Audit/evidence derinlemesine teknik tasarım (STORY-0308 kapsamı).
- COI ve access boundary detayları (STORY-0307 kapsamı).

-------------------------------------------------------------------------------
## 4. ACCEPTANCE KRİTERLERİ
-------------------------------------------------------------------------------

- [ ] Given: `PB-0004`, `PRD-0004`, `SPEC-0013` ve `STORY-0306` zinciri vardır. When: MVP intake akışı gözden geçirilir. Then: anonimlik politikası ve case mailbox davranışı net olmalıdır.
- [ ] Given: `BM-0001-CORE-DEC-001` ve `BM-0001-CORE-DEC-002` vardır. When: PRD ve Story linkleri incelenir. Then: trace ve referans bütünlüğü sağlanmış olmalıdır.
- [ ] Given: doc-qa gate seti çalıştırılır. When: `STORY-0306` zinciri doğrulanır. Then: PASS olmalıdır.

-------------------------------------------------------------------------------
## 5. BAĞIMLILIKLAR
-------------------------------------------------------------------------------

- `docs/01-product/PROBLEM-BRIEFS/PB-0004-ethics-speakup-and-case-management.md`
- `docs/01-product/PRD/PRD-0004-ethics-speakup-and-case-management-mvp.md`
- `docs/03-delivery/SPECS/SPEC-0013-ethics-case-management-contract-v1.md`

-------------------------------------------------------------------------------
## 6. ÖZET
-------------------------------------------------------------------------------

- Intake + case mailbox davranışı SSOT: `PRD-0004` + `SPEC-0013`.
- Zincir: `STORY-0306` ↔ `AC-0306` ↔ `TP-0306`.

-------------------------------------------------------------------------------
## 7. LİNKLER (İSTEĞE BAĞLI)
-------------------------------------------------------------------------------

- PB: docs/01-product/PROBLEM-BRIEFS/PB-0004-ethics-speakup-and-case-management.md
- PRD: docs/01-product/PRD/PRD-0004-ethics-speakup-and-case-management-mvp.md
- SPEC: docs/03-delivery/SPECS/SPEC-0013-ethics-case-management-contract-v1.md
- Acceptance: docs/03-delivery/ACCEPTANCE/AC-0306-ethics-intake-and-case-mailbox.md
- Test Plan: docs/03-delivery/TEST-PLANS/TP-0306-ethics-intake-and-case-mailbox.md
