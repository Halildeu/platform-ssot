# STORY-0315 – Fleet Operations Management (MVP)

ID: STORY-0315-fleet-operations-management  
Epic: FLEET-MVP  
Status: Design  
Owner: TBD  
Upstream: `PB-0006`, `PRD-0006`, `SPEC-0016`, `ADR-0001`  
Downstream: AC-0315, TP-0315

-------------------------------------------------------------------------------
## 1. AMAÇ
-------------------------------------------------------------------------------

- `PRD-0006` kapsamındaki filo operasyon akışlarını (kayıt/bakım/uyum/ceza/yakıt) kontrat seviyesinde netleştirmek.
- Shared capability first (`SPEC-0014`) ile platform bağımlılıklarını açıkça tanımlamak.

-------------------------------------------------------------------------------
## 2. TANIM
-------------------------------------------------------------------------------

- Bir filo yöneticisi olarak, araçların kayıt/bakım/uyum/ceza/yakıt süreçlerini tek yerden izlemek istiyorum; böylece uyum riski azalır ve maliyet görünür olur.

-------------------------------------------------------------------------------
## 3. KAPSAM VE SINIRLAR
-------------------------------------------------------------------------------

Dahil:
- Araç kimliği (VIN/plaka history) ve doküman sürümleme kontratı.
- Due-date ve bildirim beklentileri (policy-first).
- Bakım, ceza ve yakıt için minimum kayıt + raporlama sözleşmesi.

Hariç:
- Telematics canlı takip ve predictive maintenance.
- Otomatik ceza/itiraz veya otomatik bakım onayı (human-in-the-loop dışı).

-------------------------------------------------------------------------------
## 4. ACCEPTANCE KRİTERLERİ
-------------------------------------------------------------------------------

- [ ] Given: `PB-0006`, `PRD-0006`, `SPEC-0016` vardır. When: zincir incelenir. Then: MVP kapsam ve anti-pattern guardrail’leri net olmalıdır.
- [ ] Given: `SPEC-0014` vardır. When: platform bağımlılıkları tanımlanır. Then: Custom notification/audit/evidence yazılmadığı açıkça görülmelidir.
- [ ] Given: Doc QA gate seti çalıştırılır. When: `STORY-0315` zinciri doğrulanır. Then: PASS olmalıdır.

-------------------------------------------------------------------------------
## 5. BAĞIMLILIKLAR
-------------------------------------------------------------------------------

- `docs/01-product/PROBLEM-BRIEFS/PB-0006-fleet-operations-management.md`
- `docs/01-product/PRD/PRD-0006-fleet-operations-management-mvp.md`
- `docs/03-delivery/SPECS/SPEC-0016-fleet-operations-management-contract-v1.md`
- `docs/03-delivery/SPECS/SPEC-0014-platform-capabilities-catalog-v1.md`
- `docs/02-architecture/services/fleet-operations/ADR/ADR-0001-fleet-vehicle-identity-and-document-immutability.md`

-------------------------------------------------------------------------------
## 6. ÖZET
-------------------------------------------------------------------------------

- Fleet MVP sözleşmesi: `PRD-0006` + `SPEC-0016`.
- Zincir: `STORY-0315` ↔ `AC-0315` ↔ `TP-0315`.

-------------------------------------------------------------------------------
## 7. LİNKLER (İSTEĞE BAĞLI)
-------------------------------------------------------------------------------

- PB: docs/01-product/PROBLEM-BRIEFS/PB-0006-fleet-operations-management.md
- PRD: docs/01-product/PRD/PRD-0006-fleet-operations-management-mvp.md
- SPEC: docs/03-delivery/SPECS/SPEC-0016-fleet-operations-management-contract-v1.md
- ADR: docs/02-architecture/services/fleet-operations/ADR/ADR-0001-fleet-vehicle-identity-and-document-immutability.md
- Acceptance: docs/03-delivery/ACCEPTANCE/AC-0315-fleet-operations-management.md
- Test Plan: docs/03-delivery/TEST-PLANS/TP-0315-fleet-operations-management.md

## Platform Dependencies
- Platform Spec: `SPEC-0014`
- Case / Work Item Engine
- SLA & Calendar
- Audit Trail & View Log
- Evidence / Attachment
- Notification & Communications
- Search & Reporting

