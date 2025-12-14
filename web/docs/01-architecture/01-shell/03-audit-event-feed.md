---
title: "Audit Event Feed Tasarımı"
status: in_review
owner: "@team/platform-fe"
last_review: 2025-11-04
tags: ["audit", "frontend", "manifest"]
---

# Audit Event Feed Tasarımı

Bu doküman Sprint 4 kapsamındaki `Audit Event Feed` MFE'sinin hedeflerini, akışlarını ve teknik gereksinimlerini özetler.

## 1. Amaç
- Sistem genelinde üretilen audit olaylarını tek ekranda sunmak.
- 100K+ kayıt üzerinde hızlı filtreleme ve infinite scroll desteği sağlamak.
- Değişiklik (before/after) diff tabı ve dışa aktarma (CSV/JSON) fonksiyonlarını eklemek.
- Access/Security MFE'lerinden gelen audit deep-link'lerini highlight etmek.

## 2. Kullanıcı Aktörleri
- **Denetçi / Uyum Ekibi:** Olayları hukuki kayıt için dışa aktarır, diff inceler.
- **Destek Uzmanı:** Belirli kullanıcıya ait olayları hızlı filtreler, gerekirse Access/Security ekranına geri döner.
- **Security Admin:** Kritik olay alert edildiğinde detayına iner.

## 3. Veri Kaynağı
- Backend servis: `audit-service` (planlanan) veya mevcut `permission-service` audit endpoint'i (`/api/audit/events`).
- API özellikleri:
  - Query parametreleri: `page`, `size`, `sort`, `filter[userEmail]`, `filter[service]`, `filter[level]`, `dateFrom`, `dateTo`.
  - Geri dönüş modeli: `{ events: AuditEventDTO[], page: number, total: number }`.
  - `AuditEventDTO` alanları: `id`, `timestamp`, `userEmail`, `service`, `level`, `action`, `details`, `metadata`, `before`, `after`, `correlationId`.
  - Export uçları: `/api/audit/events/export?format=csv|json&filters...`.

## 4. UI / Manifest Kurgusu
- Shell manifest yol: `web/apps/mfe-audit/src/manifest/audit/events.manifest.ts` (yeni).
- Layout: `PageLayout` + `FilterBar` + `AG Grid` (server-side row model).
- Grid kolonları:
  1. Timestamp (relative + absolute).
  2. User / Service.
  3. Action + Level (etiket).
  4. Korrelasyon (`correlationId`).
  5. "Detay" butonu -> Drawer.
- Drawer sekmeleri:
  - **Özet:** Temel metadata.
  - **Diff:** `before` vs `after` JSON highlight.
  - **Raw JSON:** Tam payload.
- Toolbar aksiyonları:
  - Export CSV.
  - Export JSON.
  - Seçili filtreyi kaydet (gelecekte).

## 5. Teknik Detaylar
- **Önyükleme:** `web/apps/mfe-audit` Module Federation remote olarak tanımlandı (`mfe_audit`); shell `webpack.dev|prod.js` remotes listesine eklendi.
- **AG Grid:** `rowModelType = 'infinite'`, `cacheBlockSize = 200`, `maxBlocksInCache = 3`. Sütunlar `AuditEventFeed.tsx` içerisinde tanımlı.
- **Diff Görünümü:** Özel `JsonPreview` bileşeni ile `before/after` alanları drawer sekmelerinde biçimlendirilmiş JSON olarak gösterilir.
- **Canlı Akış:** `useAuditLiveStream` hook'u `/api/audit/events/live` endpoint’ini SSE ile dinler; hata durumunda 15 sn interval ile fallback refresh tetikler (SP4-2 acceptance). Grid ilk veri sorgusunu başarıyla tamamlamadan SSE aktif hâle gelmez, bu sayede mock/CI ortamlarında gereksiz bağlantı beklemeleri engellenir.
- **Performans:** 100K kayıt senaryosu için `PAGE_SIZE = 200` ile infinite scroll; saha testi `scripts/audit-feed/perf-test.md` üzerinden yürütülür.
- **Erişilebilirlik:** Drawer focus trap ve klavye erişimi implementasyon sırasında kontrol edilecek (SP4-3 a11y acceptance).
- **Telemetry:** Shell hizmetleri aracılığıyla aşağıdaki event’ler yayımlanır:
  - `fe.audit.grid_fetch` / `fe.audit.grid_fetch_failed`
  - `fe.audit.deeplink_requested` / `fe.audit.deeplink_resolved`
  - `fe.audit.live_event_received` / `fe.audit.live_fallback_poll`
  - `fe.audit.drawer_open`, `fe.audit.drawer_tab`
  - `fe.audit.export`
  Bu event’ler Grafana `security/keycloak-access` paneli altındaki “Audit Stream” bölümüne taşınır.
- **Feature Flag:** `audit_feed_enabled` shell tarafından okunacak; varsayılan `false`.
- **Kalite Otomasyonu:** `npm run test:quality` komutu Lighthouse (`web/apps/mfe-audit/lighthouserc.json`) ile performans (Perf ≥ %80, FCP ≤ 2.5s, TTI ≤ 3s) ve `@axe-core/cli` ile WCAG 2A/2AA a11y denetimlerini çalıştırır; GitHub Actions (`.github/workflows/audit-quality.yml`) üzerinden PR’larda zorunludur.

## 6. Açık Maddeler
- [ ] Export işlemleri için backend rate limit kontrolü.
- [ ] Performans senaryosu çalıştırılıp sonuçlar kayıt altına alınacak (`scripts/audit-feed/perf-test.md`).

## 7. Bağımlılıklar
- `ADR-004 Telemetry & Audit Taksonomisi`.
- `docs/operations/observability/security-dashboard.md` (audit panelleri eklenecek).
- Access/Security MFE'lerinden gelen `auditId` deep-link formatı.

## 8. Takvim
- **Sprint 4 (SP4-1)**: UI + manifest + API entegrasyonu (DoD: 100K kayıt < 2 sn). 2026-01-16.
- **Sprint 4 (SP4-2)**: Deep-link highlight (Access/Security → Audit). SSE POC'e bağlı.
- **Sprint 4 (SP4-3)**: Perf/a11y paketleri.
