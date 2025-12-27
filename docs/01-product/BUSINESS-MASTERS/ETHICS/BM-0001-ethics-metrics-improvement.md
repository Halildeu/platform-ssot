# BM-0001: Etik Programı — Metrics & Improvement (v0.1)

-------------------------------------------------------------------------------
1. AMAÇ
-------------------------------------------------------------------------------

Programın etkinliğini ölçmek ve sürekli iyileştirme döngüsünü kurmak.

-------------------------------------------------------------------------------
2. KAPSAM
-------------------------------------------------------------------------------

- KPI/KRI seti (operasyon + risk)
- Kapanış kalite skoru modeli (M3 imzası)
- PDCA ritmi (trend → aksiyon → doğrulama)

KPI/KRI Seti (Örnek):
- BM-0001-MET-KPI-001: Intake hacmi (kanal bazlı)
- BM-0001-MET-KPI-002: Triage süresi (p50/p95)
- BM-0001-MET-KPI-003: Kapanış süresi (p50/p95)
- BM-0001-MET-KPI-004: SLA ihlal oranı
- BM-0001-MET-KPI-005: Tekrar eden vaka oranı (kategori bazlı)
- BM-0001-MET-KPI-006: Reopen oranı
- BM-0001-MET-KPI-007: Misilleme sinyali (check-in sonuçları)
- BM-0001-MET-KPI-008: Kapanış kalite skoru ortalaması

Kapanış Kalite Skoru (M3 imzası):
BM-0001-MET-KPI-009: Kapanış kalite skoru modeli
Kapanış “tamamlandı” demek değildir; aşağıdakiler puanlanır:
- Doğru sınıflandırma yapıldı mı?
- Bulgular dayanaklı mı?
- Aksiyon planı var mı ve sahipleri net mi?
- Doğrulama yapıldı mı?
- Misilleme riski değerlendirildi mi?

-------------------------------------------------------------------------------
3. KAPSAM DIŞI
-------------------------------------------------------------------------------

- Kurumsal BI/DWH tasarımı ve dashboard implementasyonu (delivery seviyesinde türetilir).
- “Tek metrikle başarı” yaklaşımı (guardrail ile engellenir).

-------------------------------------------------------------------------------
4. İŞLETİM MODELİ
-------------------------------------------------------------------------------

PDCA ritmi:
- Aylık: trend & tekrar eden desenler
- 3 aylık: politika/kontrol iyileştirme backlog’u
- Yıllık: program etkinliği değerlendirmesi

-------------------------------------------------------------------------------
5. KARAR NOKTALARI (ID'Lİ)
-------------------------------------------------------------------------------

- BM-0001-MET-DEC-001: KPI seti “hız” yerine kalite+uyum sinyalleriyle dengeli tutulacak mı? (Evet.)
- BM-0001-MET-DEC-002: Kapanış kalite skoru (CQS) programın ana başarı sinyali olacak mı? (Evet.)

-------------------------------------------------------------------------------
6. GUARDRAIL'LER (ID'Lİ)
-------------------------------------------------------------------------------

- BM-0001-MET-GRD-001: Metrikler “makyaj” için değil; iyileştirme için kullanılır.
- BM-0001-MET-GRD-002: Yanlış teşviklerden kaçın: sadece hız değil, kalite de ölçülür.

-------------------------------------------------------------------------------
7. VARSAYIMLAR (ID'Lİ)
-------------------------------------------------------------------------------

- BM-0001-MET-ASM-001: KPI tanımları ve ölçüm kaynakları (intake/triage/close/audit) işletilebilir şekilde bulunacak.
- BM-0001-MET-ASM-002: Program sahipliği (owner) metrikleri düzenli review edecek.

-------------------------------------------------------------------------------
8. DOĞRULAMA PLANI (ID'Lİ)
-------------------------------------------------------------------------------

- BM-0001-MET-VAL-001: Pilot sırasında KPI hesaplarının doğruluğu örneklem ile doğrulanacak.
- BM-0001-MET-VAL-002: CQS (kapanış kalite skoru) için örnek vaka setiyle puanlama tutarlılığı kontrol edilecek.

-------------------------------------------------------------------------------
9. TOP 10 SÜRPRİZ ÖNLEYİCİ (ID'Lİ)
-------------------------------------------------------------------------------

- BM-0001-MET-RSK-001: Yanlış teşvik (yalnız hız) → CQS + tekrar oranı ile dengele
- BM-0001-MET-RSK-002: Ölçüm drift (tanım değişikliği) → KPI sözleşmesi + versiyonlama
- BM-0001-MET-RSK-003: Eksik veri → “unknown/na” yönetimi + kalite sinyali
- BM-0001-MET-RSK-004: Gösterge şişirme → audit örneklemi + RCA

-------------------------------------------------------------------------------
10. LİNKLER
-------------------------------------------------------------------------------

- PB: `docs/01-product/PROBLEM-BRIEFS/PB-0004-ethics-speakup-and-case-management.md`
- PRD: `docs/01-product/PRD/PRD-0004-ethics-speakup-and-case-management-mvp.md`
- BM Core: `docs/01-product/BUSINESS-MASTERS/ETHICS/BM-0001-ethics-core-operating-model.md`
- TRACE: `docs/03-delivery/TRACES/TRACE-0001-ethics-bm-to-delivery.tsv`
