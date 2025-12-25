# STORY-0310 – Ethics: SLA & Escalation Rules (MVP)

ID: STORY-0310-ethics-sla-and-escalation  
Epic: ETHICS-MVP  
Status: Design  
Owner: TBD  
Upstream: `PB-0004`, `PRD-0004`, `SPEC-0013`, `ADR-0005`  
Downstream: AC-0310, TP-0310

-------------------------------------------------------------------------------
## 1. AMAÇ
-------------------------------------------------------------------------------

- SLA ihlal oranı metriğini (BM-0001-MET-KPI-004) ölçülebilir hale getirmek için SLA semantiğini netleştirmek.
- SLA breach olduğunda eskalasyon kurallarını ADR ile sabitlemek (`ADR-0005`).

-------------------------------------------------------------------------------
## 2. TANIM
-------------------------------------------------------------------------------

- Bir operasyon sahibi olarak, SLA hesaplaması (iş günü takvimi + saat dilimi) net ve deterministik olsun istiyorum; böylece breach ve eskalasyon hatasız çalışır.

-------------------------------------------------------------------------------
## 3. KAPSAM VE SINIRLAR
-------------------------------------------------------------------------------

Dahil:
- SLA hesaplama semantiği (business day policy) ve eskalasyon kuralları.
- KPI tanımı: SLA ihlal oranı.

Hariç:
- Takvim yönetim altyapısı ve entegrasyon detayları.
- Dashboard/OBS implementasyonu (ayrı story).

-------------------------------------------------------------------------------
## 4. ACCEPTANCE KRİTERLERİ
-------------------------------------------------------------------------------

- [ ] Given: `ADR-0005` vardır. When: SLA semantiği okunur. Then: iş günü/tatil/saat dilimi yaklaşımı net olmalıdır.
- [ ] Given: `BM-0001-MET-KPI-004` vardır. When: KPI tanımı incelenir. Then: breach ölçümü ve eskalasyon ilişkisi net olmalıdır.
- [ ] Given: doc-qa gate seti çalıştırılır. When: `STORY-0310` zinciri doğrulanır. Then: PASS olmalıdır.

-------------------------------------------------------------------------------
## 5. BAĞIMLILIKLAR
-------------------------------------------------------------------------------

- `docs/02-architecture/services/ethics-case-management/ADR/ADR-0005-ethics-sla-calendar-semantics.md`
- `docs/03-delivery/SPECS/SPEC-0013-ethics-case-management-contract-v1.md`

-------------------------------------------------------------------------------
## 6. ÖZET
-------------------------------------------------------------------------------

- SLA semantiği SSOT: `ADR-0005`.
- Zincir: `STORY-0310` ↔ `AC-0310` ↔ `TP-0310`.

-------------------------------------------------------------------------------
## 7. LİNKLER (İSTEĞE BAĞLI)
-------------------------------------------------------------------------------

- PRD: docs/01-product/PRD/PRD-0004-ethics-speakup-and-case-management-mvp.md
- SPEC: docs/03-delivery/SPECS/SPEC-0013-ethics-case-management-contract-v1.md
- ADR: docs/02-architecture/services/ethics-case-management/ADR/ADR-0005-ethics-sla-calendar-semantics.md
- Acceptance: docs/03-delivery/ACCEPTANCE/AC-0310-ethics-sla-and-escalation.md
- Test Plan: docs/03-delivery/TEST-PLANS/TP-0310-ethics-sla-and-escalation.md
