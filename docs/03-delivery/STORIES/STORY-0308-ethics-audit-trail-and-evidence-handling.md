# STORY-0308 – Ethics: Audit Trail & Evidence Handling (MVP)

ID: STORY-0308-ethics-audit-trail-and-evidence-handling  
Epic: ETHICS-MVP  
Status: Design  
Owner: TBD  
Upstream: `PB-0004`, `PRD-0004`, `SPEC-0013`, `ADR-0004`  
Downstream: AC-0308, TP-0308

-------------------------------------------------------------------------------
## 1. AMAÇ
-------------------------------------------------------------------------------

- Evidence immutability ve audit trail kararını ADR ile sabitlemek (`ADR-0004`).
- Acceptance seviyesinde “delil silinmez” ve “audit log zorunlu” guardrail’lerini izlenebilir hale getirmek.

-------------------------------------------------------------------------------
## 2. TANIM
-------------------------------------------------------------------------------

- Bir denetçi olarak, vakadaki delil eklerinin silinmediği ve tüm görüntüleme/değişikliklerin audit log’a düştüğü bir süreç istiyorum; böylece denetlenebilirlik sağlanır.

-------------------------------------------------------------------------------
## 3. KAPSAM VE SINIRLAR
-------------------------------------------------------------------------------

Dahil:
- Evidence immutability politikası (BM-0001-CTRL-GRD-003).
- Audit log zorunluluğu (BM-0001-CTRL-GRD-004).

Hariç:
- Observability/dashboard tasarımı (OBS hedefi; ayrı story).
- Depolama/retention detayları (ayrı ADR/SPEC).

-------------------------------------------------------------------------------
## 4. ACCEPTANCE KRİTERLERİ
-------------------------------------------------------------------------------

- [ ] Given: `ADR-0004` vardır. When: evidence policy okunur. Then: “silme yok, ek/sürüm var” kararı net olmalıdır.
- [ ] Given: `BM-0001-CTRL-GRD-004` vardır. When: audit trail gereksinimi değerlendirilir. Then: görüntüleme/değişiklik audit log zorunlu olmalıdır.
- [ ] Given: doc-qa gate seti çalıştırılır. When: `STORY-0308` zinciri doğrulanır. Then: PASS olmalıdır.

-------------------------------------------------------------------------------
## 5. BAĞIMLILIKLAR
-------------------------------------------------------------------------------

- `docs/02-architecture/services/ethics-case-management/ADR/ADR-0004-ethics-evidence-immutability-policy.md`
- `docs/03-delivery/SPECS/SPEC-0013-ethics-case-management-contract-v1.md`

-------------------------------------------------------------------------------
## 6. ÖZET
-------------------------------------------------------------------------------

- Evidence + audit trail SSOT: `ADR-0004` + `SPEC-0013`.
- Zincir: `STORY-0308` ↔ `AC-0308` ↔ `TP-0308`.

-------------------------------------------------------------------------------
## 7. LİNKLER (İSTEĞE BAĞLI)
-------------------------------------------------------------------------------

- PB: docs/01-product/PROBLEM-BRIEFS/PB-0004-ethics-speakup-and-case-management.md
- PRD: docs/01-product/PRD/PRD-0004-ethics-speakup-and-case-management-mvp.md
- SPEC: docs/03-delivery/SPECS/SPEC-0013-ethics-case-management-contract-v1.md
- ADR: docs/02-architecture/services/ethics-case-management/ADR/ADR-0004-ethics-evidence-immutability-policy.md
- Acceptance: docs/03-delivery/ACCEPTANCE/AC-0308-ethics-audit-trail-and-evidence-handling.md
- Test Plan: docs/03-delivery/TEST-PLANS/TP-0308-ethics-audit-trail-and-evidence-handling.md

## Platform Dependencies
- Platform Spec: `SPEC-0014`
- Evidence / Attachment
- Audit Trail & View Log
