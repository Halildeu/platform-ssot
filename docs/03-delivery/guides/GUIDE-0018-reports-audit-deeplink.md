# GUIDE-0018: reports audit deeplink

---
title: "Reports ↔ Audit Çift Yönlü Deep-Link"
status: in_progress
owner: "@team/frontend"
workflow_tickets:
  - FE-06
last_review: 2025-11-12
---

Amaç
- Users/Reports/Audit modülleri arasında `userId` / `auditId` taşıyan çift yönlü deep-link akışlarını tanımlamak ve E2E ile doğrulamak.

Kapsam
- Reports (Users): `/admin/reports/users?userId=<id>&search=<q>&status=<ALL|ACTIVE|INACTIVE>` → raporda ilgili kullanıcının ön seçim/filtresi
- Reports (Audit): `/admin/reports/audit?auditId=<id>&search=<q>&level=<info|warn|error>&service=<name>` → audit raporunda event/filtre ön seçimi
- Users → Audit: mutasyon sonrası `notifyAuditId(auditId)` + “Detay” linki (shell notify)
- Audit → Users: event context’ten `userId` ile Users’a dönüş linki (breadcrumb/toolbar CTA)

Kabul Kriterleri
- Reporting modüllerinde `createInitialFilters(params)` `userId`/`auditId`/`search`/`level`/`service` binding’lerini uygular.
- Guard yönlendirmeleri (login/unauthorized) çalışır; `/admin/reports/*` ve `/admin/audit/*` akışları ölçümlenir.
- E2E (Cypress) senaryoları yeşil; CI’da artefaktlar (video/screenshot) yüklenir.

Notlar
- i18n ve breadcrumb anahtarlarını ekleyin; kontrat için `03-reporting-schema-contract.md` dokümanını izleyin.

Uygulama ayrıntıları ve E2E planı: `docs/03-delivery/guides/GUIDE-0017-reports-audit-deeplink-impl.md`

1. AMAÇ
TBD

2. KAPSAM
TBD

3. KAPSAM DIŞI
TBD

4. BAĞLAM / ARKA PLAN
TBD

5. ADIM ADIM (KULLANIM)
TBD

6. SIK HATALAR / EDGE-CASE
TBD

7. LİNKLER
TBD
