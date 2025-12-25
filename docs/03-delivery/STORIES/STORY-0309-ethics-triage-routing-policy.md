# STORY-0309 – Ethics: Triage Routing Policy (MVP)

ID: STORY-0309-ethics-triage-routing-policy  
Epic: ETHICS-MVP  
Status: Design  
Owner: TBD  
Upstream: `PB-0004`, `PRD-0004`, `SPEC-0013`  
Downstream: AC-0309, TP-0309

-------------------------------------------------------------------------------
## 1. AMAÇ
-------------------------------------------------------------------------------

- Vaka tipleri ve yönlendirme politikasını (BM-0001-CORE-DEC-003) delivery seviyesinde netleştirmek.
- “Etik / İK / InfoSec / Finans / Misilleme” sınırlarının pratikte hangi akışa gittiğini deterministik hale getirmek.

-------------------------------------------------------------------------------
## 2. TANIM
-------------------------------------------------------------------------------

- Bir vaka yöneticisi olarak, vaka tiplerine göre deterministik bir routing/policy istiyorum; böylece yanlış sürece düşen vakalar azaltılır ve audit trail korunur.

-------------------------------------------------------------------------------
## 3. KAPSAM VE SINIRLAR
-------------------------------------------------------------------------------

Dahil:
- Vaka tipleri ve yönlendirme kuralları (policy).
- “Etik dışı” yönlendirmelerde audit trail korunması gereksinimi.

Hariç:
- UI/UX ekran akışları.
- SLA ve eskalasyon (STORY-0310).

-------------------------------------------------------------------------------
## 4. ACCEPTANCE KRİTERLERİ
-------------------------------------------------------------------------------

- [ ] Given: `BM-0001-CORE-DEC-003` vardır. When: routing policy okunur. Then: vaka tipi → hedef süreç eşlemesi net olmalıdır.
- [ ] Given: `PRD-0004` ve `SPEC-0013` vardır. When: policy referansları incelenir. Then: izlenebilirlik (Trace) bozulmamalıdır.
- [ ] Given: doc-qa gate seti çalıştırılır. When: `STORY-0309` zinciri doğrulanır. Then: PASS olmalıdır.

-------------------------------------------------------------------------------
## 5. BAĞIMLILIKLAR
-------------------------------------------------------------------------------

- `docs/01-product/PRD/PRD-0004-ethics-speakup-and-case-management-mvp.md`
- `docs/03-delivery/SPECS/SPEC-0013-ethics-case-management-contract-v1.md`

-------------------------------------------------------------------------------
## 6. ÖZET
-------------------------------------------------------------------------------

- Triage routing policy SSOT: `PRD-0004` + `SPEC-0013`.
- Zincir: `STORY-0309` ↔ `AC-0309` ↔ `TP-0309`.

-------------------------------------------------------------------------------
## 7. LİNKLER (İSTEĞE BAĞLI)
-------------------------------------------------------------------------------

- PB: docs/01-product/PROBLEM-BRIEFS/PB-0004-ethics-speakup-and-case-management.md
- PRD: docs/01-product/PRD/PRD-0004-ethics-speakup-and-case-management-mvp.md
- SPEC: docs/03-delivery/SPECS/SPEC-0013-ethics-case-management-contract-v1.md
- Acceptance: docs/03-delivery/ACCEPTANCE/AC-0309-ethics-triage-routing-policy.md
- Test Plan: docs/03-delivery/TEST-PLANS/TP-0309-ethics-triage-routing-policy.md
