# STORY-0314 – NC: CAPA Workflow (MVP)

ID: STORY-0314-nc-capa-workflow  
Epic: NC-MVP  
Status: Design  
Owner: TBD  
Upstream: `PB-0005`, `PRD-0005`, `SPEC-0015`  
Downstream: AC-0314, TP-0314

-------------------------------------------------------------------------------
## 1. AMAÇ
-------------------------------------------------------------------------------

- CAPA aksiyonlarının owner + due date + doğrulama ile takip edilmesini tanımlamak.
- SLA ve bildirim davranışlarını platform yetenekleri üzerinden konumlandırmak.

-------------------------------------------------------------------------------
## 2. TANIM
-------------------------------------------------------------------------------

- Bir kalite yöneticisi olarak, CAPA aksiyonlarını sahip ve süre ile yönetmek istiyorum; böylece kapanış kalitesi ölçülebilir şekilde artar.

-------------------------------------------------------------------------------
## 3. KAPSAM VE SINIRLAR
-------------------------------------------------------------------------------

Dahil:
- CAPA aksiyon akışı: create → assign → due → verify → close.
- SLA breach/eskalasyon (policy) beklentisi (kontrat seviyesinde).
- Bildirim tetikleri (atama/hatırlatma/kapanış).

Hariç:
- RCA metodolojisinin derin içeriği (şablon + minimum çıktı ile sınırlı).
- UI/UX detayları (ayrı UX dokümanı/story).

-------------------------------------------------------------------------------
## 4. ACCEPTANCE KRİTERLERİ
-------------------------------------------------------------------------------

- [ ] Given: `PRD-0005` ve `SPEC-0015` vardır. When: CAPA workflow kontratı incelenir. Then: aksiyon yaşam döngüsü ve SLA/bildirim beklentileri net olmalıdır.
- [ ] Given: doc-qa gate seti çalıştırılır. When: `STORY-0314` zinciri doğrulanır. Then: PASS olmalıdır.

-------------------------------------------------------------------------------
## 5. BAĞIMLILIKLAR
-------------------------------------------------------------------------------

- `docs/01-product/PRD/PRD-0005-nc-capa-management-mvp.md`
- `docs/03-delivery/SPECS/SPEC-0015-nc-capa-contract-v1.md`
- `docs/03-delivery/SPECS/SPEC-0014-platform-capabilities-catalog-v1.md`

-------------------------------------------------------------------------------
## 6. ÖZET
-------------------------------------------------------------------------------

- CAPA workflow SSOT: `PRD-0005` + `SPEC-0015`.
- Zincir: `STORY-0314` ↔ `AC-0314` ↔ `TP-0314`.

-------------------------------------------------------------------------------
## 7. LİNKLER (İSTEĞE BAĞLI)
-------------------------------------------------------------------------------

- PB: docs/01-product/PROBLEM-BRIEFS/PB-0005-nc-capa-management.md
- PRD: docs/01-product/PRD/PRD-0005-nc-capa-management-mvp.md
- SPEC: docs/03-delivery/SPECS/SPEC-0015-nc-capa-contract-v1.md
- Acceptance: docs/03-delivery/ACCEPTANCE/AC-0314-nc-capa-workflow.md
- Test Plan: docs/03-delivery/TEST-PLANS/TP-0314-nc-capa-workflow.md

## Platform Dependencies
- Platform Spec: `SPEC-0014`
- Case / Work Item Engine
- SLA & Calendar
- Notification & Communications
- Search & Reporting

