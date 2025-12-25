# BM-0003: Fleet Operations Management — Controls (Uyum, Risk, Denetim) (v0.1)

## Amaç
Filo operasyonunda “uyum ve maliyet” güvenilirliğini sağlayan kontrol mekanizmalarını tanımlamak.

## Veri Sınıfları & Gizlilik (business seviyede)
- Plaka/VIN: operasyonel veri; erişim role bağlıdır.
- Sürücü/atama verisi (varsa): PII sayılır; maskeleme ve minimum erişim uygulanır.
- Ceza dokümanları/itiraz ekleri: hassas olabilir; görünürlük politika ile sınırlanır.

## Karar Noktaları
- BM-0003-CTRL-DEC-001: Rol bazlı erişim modeli (Fleet Admin / Maintenance / Finance / Viewer) zorunlu mu? (Evet.)
- BM-0003-CTRL-DEC-002: Audit log “minimum alan seti” sabit mi? (Evet; actor + action + entity + before/after + correlation.)
- BM-0003-CTRL-DEC-003: Kritik doküman saklama süresi (retention) policy ile yönetilecek mi? (Evet; legal/denetim gereksinimine göre.)

## Guardrail’ler (Minimum Set)
- BM-0003-CTRL-GRD-001: Kritik alan değişiklikleri (plaka, durum, muayene/sigorta tarihler, ceza durumu) audit trail’e düşer.
- BM-0003-CTRL-GRD-002: Doküman/ekler silinmez; yeni sürüm eklenir; görüntüleme loglanır.
- BM-0003-CTRL-GRD-003: Ceza “ödeme/itiraz” aksiyonları ayrı yetki ile korunur (en azından Finance rolü).
- BM-0003-CTRL-GRD-004: Arama/rapor sonuçları permission boundary’yi aşamaz (need-to-know).
- BM-0003-CTRL-GRD-005: Takvim semantiği tek SSOT’tur; her modül kendi iş günü hesabını yazmaz.
- BM-0003-CTRL-GRD-006: Bildirim içerikleri template + allowlist ile gönderilir; serbest metin/PII sızıntısı engellenir.
- BM-0003-CTRL-GRD-007: “Kaynak sistem” ve manuel giriş ayrımı tutulur; reconcile raporu üretilebilir olmalıdır.
- BM-0003-CTRL-GRD-008: Raporlama çıktıları için veri maskeleme/redaksiyon policy ile uygulanır (özellikle sürücü bilgisi).

## Varsayımlar
- BM-0003-CTRL-ASM-001: Rol/organizasyon modeli (şirket/şube) tanımlı veya tanımlanabilir.
- BM-0003-CTRL-ASM-002: Denetim (audit) ve saklama gereksinimleri (yıl bazında) iş birimi tarafından onaylanabilir.

## Doğrulama
- BM-0003-CTRL-VAL-001: 15 senaryo RBAC testi: yetkisiz görüntüleme/değişiklik denemeleri.
- BM-0003-CTRL-VAL-002: 10 senaryo audit/evidence testi: sürümleme + görüntüleme logu doğrulaması.

## Platform Dependencies (Shared Capability First)
- Platform Spec: `SPEC-0014`
- Audit Trail & View Log
- Evidence / Attachment
- Notification & Communications
- Search & Reporting

