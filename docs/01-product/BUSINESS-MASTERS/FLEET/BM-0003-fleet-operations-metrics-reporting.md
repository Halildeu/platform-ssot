# BM-0003: Fleet Operations Management — Metrics & Reporting (v0.1)

-------------------------------------------------------------------------------
1. AMAÇ
-------------------------------------------------------------------------------

Operasyonun uyum ve maliyet performansını ölçmek ve sürekli iyileştirme döngüsünü kurmak.

-------------------------------------------------------------------------------
2. KAPSAM
-------------------------------------------------------------------------------

KPI/KRI Seti (Minimum):
- BM-0003-MET-KPI-001: Aktif araç sayısı (durum bazlı)
- BM-0003-MET-KPI-002: 30 gün içinde süresi dolacak sigorta sayısı/oranı
- BM-0003-MET-KPI-003: 30 gün içinde süresi dolacak muayene sayısı/oranı
- BM-0003-MET-KPI-004: Bakım gecikme oranı (overdue)
- BM-0003-MET-KPI-005: Ortalama bakım kapanış süresi (p50/p95)
- BM-0003-MET-KPI-006: Yakıt tüketimi (L/100km) — araç ve filo bazlı
- BM-0003-MET-KPI-007: Yakıt anomali oranı (beklenen dışı tüketim/spike)
- BM-0003-MET-KPI-008: Trafik cezası maliyeti (aylık) + kapanış süresi
- BM-0003-MET-KPI-009: Doküman tamlık oranı (ruhsat/sigorta/muayene)
- BM-0003-MET-KPI-010: Bildirim teslim başarısızlık oranı (kanal bazlı)

Platform Dependencies (Shared Capability First):
- Platform Spec: `docs/03-delivery/SPECS/SPEC-0014-platform-capabilities-catalog-v1.md`
- Search & Reporting
- Notification & Communications (delivery metrics)

-------------------------------------------------------------------------------
3. KAPSAM DIŞI
-------------------------------------------------------------------------------

- Kurumsal BI/detay dashboard implementasyonu (delivery seviyesinde türetilir).
- Finans muhasebe fişi üretimi (ERP entegrasyonu).

-------------------------------------------------------------------------------
4. İŞLETİM MODELİ
-------------------------------------------------------------------------------

Önerilen işletim:
- Haftalık: uyum yaklaşan tarihler (muayene/sigorta) + bakım overdue listesi.
- Aylık: ceza maliyeti + kapanış süresi + yakıt anomali trendleri.
- Çeyreklik: KPI tanım/hesaplama semantiği review (drift engeli).

-------------------------------------------------------------------------------
5. KARAR NOKTALARI (ID'Lİ)
-------------------------------------------------------------------------------

- BM-0003-MET-DEC-001: Uyum KPI’ları (muayene/sigorta) için “yaklaşan süre” eşiği standard mı? (Evet; policy ile yönetilir.)

-------------------------------------------------------------------------------
6. GUARDRAIL'LER (ID'Lİ)
-------------------------------------------------------------------------------

- BM-0003-MET-GRD-001: Metrikler “suçlama” için değil; uyum, maliyet ve süreç iyileştirme için kullanılır.
- BM-0003-MET-GRD-002: Tek metrik optimize edilmez; hız yanında kalite ve uyum sinyalleri birlikte izlenir.

-------------------------------------------------------------------------------
7. VARSAYIMLAR (ID'Lİ)
-------------------------------------------------------------------------------

- BM-0003-MET-ASM-001: KPI ölçüm kaynakları (case/work item, evidence, notifications) erişilebilir olacak.
- BM-0003-MET-ASM-002: KPI tanımları (hesaplama semantiği) version’lanabilir olacak.

-------------------------------------------------------------------------------
8. DOĞRULAMA PLANI (ID'Lİ)
-------------------------------------------------------------------------------

- BM-0003-MET-VAL-001: Pilot sırasında KPI hesapları örneklem ile doğrulanacak (due-date, bakım süreleri, ceza kapanış).

-------------------------------------------------------------------------------
9. TOP 10 SÜRPRİZ ÖNLEYİCİ (ID'Lİ)
-------------------------------------------------------------------------------

- BM-0003-MET-RSK-001: Ölçüm drift → KPI sözleşmesi + regression dataset
- BM-0003-MET-RSK-002: Veri eksikliği → kalite sinyali + reconcile raporu
- BM-0003-MET-RSK-003: Yanlış teşvik (yalnız maliyet) → uyum ve kalite metrikleriyle dengele

-------------------------------------------------------------------------------
10. LİNKLER
-------------------------------------------------------------------------------

- BM Core: `docs/01-product/BUSINESS-MASTERS/FLEET/BM-0003-fleet-operations-core-operating-model.md`
- PRD: `docs/01-product/PRD/PRD-0006-fleet-operations-management-mvp.md`
- BENCH Pack: `docs/01-product/BENCHMARKS/FLEET/`
- TRACE: `docs/03-delivery/TRACES/TRACE-0002-fleet-operations-bm-to-delivery.tsv`
