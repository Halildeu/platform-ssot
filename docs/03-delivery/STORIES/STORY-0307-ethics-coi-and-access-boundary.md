# STORY-0307 – Ethics: COI & Access Boundary (MVP)

ID: STORY-0307-ethics-coi-and-access-boundary  
Epic: ETHICS-MVP  
Status: Design  
Owner: TBD  
Upstream: `PB-0004`, `PRD-0004`, `SPEC-0013`, `ADR-0003`  
Downstream: AC-0307, TP-0307

-------------------------------------------------------------------------------
## 1. AMAÇ
-------------------------------------------------------------------------------

- COI (çıkar çatışması) guardrail’ini (BM-0001-CTRL-GRD-001) delivery seviyesinde netleştirmek.
- Need-to-know erişim sınırlarını ve COI ile etkileşimini ADR ile sabitlemek (`ADR-0003`).

-------------------------------------------------------------------------------
## 2. TANIM
-------------------------------------------------------------------------------

- Bir vaka yöneticisi olarak, COI olan kişilerin vakaya erişemediği ve bağımsız atamanın garanti edildiği bir erişim/atama sınırı istiyorum; böylece tarafsızlık korunur.

-------------------------------------------------------------------------------
## 3. KAPSAM VE SINIRLAR
-------------------------------------------------------------------------------

Dahil:
- COI kontrolünün “en az” işleyişi (atama öncesi kontrol, engelleme, yeniden atama).
- Rol bazlı görünürlük (need-to-know) sınırları.

Hariç:
- Evidence/immutability teknik detayları (STORY-0308).
- Ürün UI/UX detayları (ileride PRD ekleri).

-------------------------------------------------------------------------------
## 4. ACCEPTANCE KRİTERLERİ
-------------------------------------------------------------------------------

- [ ] Given: `ADR-0003` vardır. When: access boundary kararları okunur. Then: COI bloklama + bağımsız atama kararı net olmalıdır.
- [ ] Given: `BM-0001-CTRL-GRD-001` guardrail’i vardır. When: Story/AC uygulanır. Then: COI olan kişi erişemez/atanamaz.
- [ ] Given: doc-qa gate seti çalıştırılır. When: `STORY-0307` zinciri doğrulanır. Then: PASS olmalıdır.

-------------------------------------------------------------------------------
## 5. BAĞIMLILIKLAR
-------------------------------------------------------------------------------

- `docs/02-architecture/services/ethics-case-management/ADR/ADR-0003-ethics-coi-access-boundary.md`
- `docs/03-delivery/SPECS/SPEC-0013-ethics-case-management-contract-v1.md`

-------------------------------------------------------------------------------
## 6. ÖZET
-------------------------------------------------------------------------------

- COI ve access boundary SSOT: `ADR-0003` + `SPEC-0013`.
- Zincir: `STORY-0307` ↔ `AC-0307` ↔ `TP-0307`.

-------------------------------------------------------------------------------
## 7. LİNKLER (İSTEĞE BAĞLI)
-------------------------------------------------------------------------------

- PB: docs/01-product/PROBLEM-BRIEFS/PB-0004-ethics-speakup-and-case-management.md
- PRD: docs/01-product/PRD/PRD-0004-ethics-speakup-and-case-management-mvp.md
- SPEC: docs/03-delivery/SPECS/SPEC-0013-ethics-case-management-contract-v1.md
- ADR: docs/02-architecture/services/ethics-case-management/ADR/ADR-0003-ethics-coi-access-boundary.md
- Acceptance: docs/03-delivery/ACCEPTANCE/AC-0307-ethics-coi-and-access-boundary.md
- Test Plan: docs/03-delivery/TEST-PLANS/TP-0307-ethics-coi-and-access-boundary.md

## Platform Dependencies
- Platform Spec: `SPEC-0014`
- COI Engine
- Case / Work Item Engine
- Audit Trail & View Log
