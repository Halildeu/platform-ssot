# BM-0003: Fleet Operations Management — Controls (Uyum, Risk, Denetim) (v0.1)

-------------------------------------------------------------------------------
1. AMAÇ
-------------------------------------------------------------------------------

Filo operasyonunda “uyum ve maliyet” güvenilirliğini sağlayan kontrol mekanizmalarını tanımlamak.

-------------------------------------------------------------------------------
2. KAPSAM
-------------------------------------------------------------------------------

- Veri sınıfları & gizlilik (business seviyede)
- Rol bazlı erişim (RBAC) ve permission boundary (need-to-know)
- Audit trail + view log beklentisi
- Evidence/attachment sürümleme ve erişim logu
- Bildirim içerik kontrolü (template/allowlist)
- Raporlama çıktılarında maskeleme/redaksiyon

Veri Sınıfları & Gizlilik (business seviyede):
- Plaka/VIN: operasyonel veri; erişim role bağlıdır.
- Sürücü/atama verisi (varsa): PII sayılır; maskeleme ve minimum erişim uygulanır.
- Ceza dokümanları/itiraz ekleri: hassas olabilir; görünürlük politika ile sınırlanır.

-------------------------------------------------------------------------------
3. KAPSAM DIŞI
-------------------------------------------------------------------------------

- Retention değerlerinin sayısal tarifleri (policy seviyesinde netleşir).
- Güvenlik/infra implementasyon detayları (delivery ADR/SPEC).

-------------------------------------------------------------------------------
4. İŞLETİM MODELİ
-------------------------------------------------------------------------------

Kontrol seti, tüm operasyon akışlarında “gating” olarak çalışır:
- RBAC: kritik aksiyonlar ayrı yetki ile korunur.
- Audit: kritik alan değişiklikleri ve görüntüleme loglanır.
- Evidence: silinmez/sürümlenir; erişim loglanır.
- Reporting: permission boundary’ye uyar; export redaksiyon policy ile uygulanır.

Platform Dependencies (Shared Capability First):
- Platform Spec: `docs/03-delivery/SPECS/SPEC-0014-platform-capabilities-catalog-v1.md`
- Audit Trail & View Log
- Evidence / Attachment
- Notification & Communications
- Search & Reporting

-------------------------------------------------------------------------------
5. KARAR NOKTALARI (ID'Lİ)
-------------------------------------------------------------------------------

- BM-0003-CTRL-DEC-001: Rol bazlı erişim modeli (Fleet Admin / Maintenance / Finance / Viewer) zorunlu mu? (Evet.)
- BM-0003-CTRL-DEC-002: Audit log “minimum alan seti” sabit mi? (Evet; actor + action + entity + before/after + correlation.)
- BM-0003-CTRL-DEC-003: Kritik doküman saklama süresi (retention) policy ile yönetilecek mi? (Evet; legal/denetim gereksinimine göre.)

-------------------------------------------------------------------------------
6. GUARDRAIL'LER (ID'Lİ)
-------------------------------------------------------------------------------

- BM-0003-CTRL-GRD-001: Kritik alan değişiklikleri (plaka, durum, muayene/sigorta tarihler, ceza durumu) audit trail’e düşer.
- BM-0003-CTRL-GRD-002: Doküman/ekler silinmez; yeni sürüm eklenir; görüntüleme loglanır.
- BM-0003-CTRL-GRD-003: Ceza “ödeme/itiraz” aksiyonları ayrı yetki ile korunur (en azından Finance rolü).
- BM-0003-CTRL-GRD-004: Arama/rapor sonuçları permission boundary’yi aşamaz (need-to-know).
- BM-0003-CTRL-GRD-005: Takvim semantiği tek SSOT’tur; her modül kendi iş günü hesabını yazmaz.
- BM-0003-CTRL-GRD-006: Bildirim içerikleri template + allowlist ile gönderilir; serbest metin/PII sızıntısı engellenir.
- BM-0003-CTRL-GRD-007: “Kaynak sistem” ve manuel giriş ayrımı tutulur; reconcile raporu üretilebilir olmalıdır.
- BM-0003-CTRL-GRD-008: Raporlama çıktıları için veri maskeleme/redaksiyon policy ile uygulanır (özellikle sürücü bilgisi).

-------------------------------------------------------------------------------
7. VARSAYIMLAR (ID'Lİ)
-------------------------------------------------------------------------------

- BM-0003-CTRL-ASM-001: Rol/organizasyon modeli (şirket/şube) tanımlı veya tanımlanabilir.
- BM-0003-CTRL-ASM-002: Denetim (audit) ve saklama gereksinimleri (yıl bazında) iş birimi tarafından onaylanabilir.

-------------------------------------------------------------------------------
8. DOĞRULAMA PLANI (ID'Lİ)
-------------------------------------------------------------------------------

- BM-0003-CTRL-VAL-001: 15 senaryo RBAC testi: yetkisiz görüntüleme/değişiklik denemeleri.
- BM-0003-CTRL-VAL-002: 10 senaryo audit/evidence testi: sürümleme + görüntüleme logu doğrulaması.

-------------------------------------------------------------------------------
9. TOP 10 SÜRPRİZ ÖNLEYİCİ (ID'Lİ)
-------------------------------------------------------------------------------

- BM-0003-CTRL-RSK-001: Yetki drift → policy test seti + audit örneklemi
- BM-0003-CTRL-RSK-002: PII sızıntısı (export/bildirim) → allowlist + redaksiyon
- BM-0003-CTRL-RSK-003: Retention belirsizliği → policy SSOT + rollout planı

-------------------------------------------------------------------------------
10. LİNKLER
-------------------------------------------------------------------------------

- BM Core: `docs/01-product/BUSINESS-MASTERS/FLEET/BM-0003-fleet-operations-core-operating-model.md`
- PB: `docs/01-product/PROBLEM-BRIEFS/PB-0006-fleet-operations-management.md`
- PRD: `docs/01-product/PRD/PRD-0006-fleet-operations-management-mvp.md`
- BENCH Pack: `docs/01-product/BENCHMARKS/FLEET/`
- TRACE: `docs/03-delivery/TRACES/TRACE-0002-fleet-operations-bm-to-delivery.tsv`
