# BM-0002: Uygunsuzluk (NC) & CAPA — Metrics & Improvement (v0.1)

-------------------------------------------------------------------------------
1. AMAÇ
-------------------------------------------------------------------------------

NC/CAPA programının etkinliğini ölçmek ve tekrar oranını düşüren iyileştirme döngüsünü kurmak.

-------------------------------------------------------------------------------
2. KAPSAM
-------------------------------------------------------------------------------

KPI/KRI Seti (Örnek):
- BM-0002-MET-KPI-001: NC intake hacmi (kategori/tesis bazlı)
- BM-0002-MET-KPI-002: Triage süresi (p50/p95)
- BM-0002-MET-KPI-003: CAPA due date breach oranı
- BM-0002-MET-KPI-004: Kapanış süresi (p50/p95)
- BM-0002-MET-KPI-005: Reopen oranı
- BM-0002-MET-KPI-006: Tekrar eden uygunsuzluk oranı
- BM-0002-MET-KPI-007: RCA tamlık oranı (şablon doluluğu değil, kalite kontrol skoruyla)

İyileştirme Döngüsü:
- Haftalık: açık CAPA backlog / breach takibi
- Aylık: tekrar eden desenler → kontrol/policy güncelleme backlog’u
- Çeyreklik: program etkinliği değerlendirmesi

-------------------------------------------------------------------------------
3. KAPSAM DIŞI
-------------------------------------------------------------------------------

- Kurumsal BI/detay dashboard tasarımı ve implementasyonu (delivery seviyesine bırakılır).
- “Tek KPI ile başarı” yaklaşımı (guardrail ile engellenir).

-------------------------------------------------------------------------------
4. İŞLETİM MODELİ
-------------------------------------------------------------------------------

Önerilen işletim:
- Haftalık KPI review: açık CAPA + breach listesi + aksiyon sahipleri.
- Aylık trend review: tekrar eden desenler → backlog.
- Çeyreklik program review: etkinlik + kontrol/policy iyileştirmeleri.

-------------------------------------------------------------------------------
5. KARAR NOKTALARI (ID'Lİ)
-------------------------------------------------------------------------------

- BM-0002-MET-DEC-001: KPI seti “kapanış kalitesi + tekrar oranı” ile dengeli tutulacak mı? (Evet.)

-------------------------------------------------------------------------------
6. GUARDRAIL'LER (ID'Lİ)
-------------------------------------------------------------------------------

- BM-0002-MET-GRD-001: Metrikler “hız” için değil, kalite ve tekrar azaltma için kullanılır.

-------------------------------------------------------------------------------
7. VARSAYIMLAR (ID'Lİ)
-------------------------------------------------------------------------------

- BM-0002-MET-ASM-001: KPI ölçüm kaynakları (case engine, audit, evidence) erişilebilir olacak.
- BM-0002-MET-ASM-002: KPI tanımları (hesaplama semantiği) version’lanabilir olacak.

-------------------------------------------------------------------------------
8. DOĞRULAMA PLANI (ID'Lİ)
-------------------------------------------------------------------------------

- BM-0002-MET-VAL-001: Pilot KPI hesapları örneklem ile doğrulanacak (breach ve kapanış süreleri).
- BM-0002-MET-VAL-002: Trend raporları “duplicate/yanlış sınıflandırma” senaryolarıyla kontrol edilecek.

-------------------------------------------------------------------------------
9. TOP 10 SÜRPRİZ ÖNLEYİCİ (ID'Lİ)
-------------------------------------------------------------------------------

- BM-0002-MET-RSK-001: Ölçüm drift → KPI sözleşmesi + regression senaryoları
- BM-0002-MET-RSK-002: Veri eksikliği → kalite sinyali + manual reconcile
- BM-0002-MET-RSK-003: Yanlış teşvik (yalnız hız) → kalite/tekrar metrikleriyle dengele

-------------------------------------------------------------------------------
10. LİNKLER
-------------------------------------------------------------------------------

- BM Core: `docs/01-product/BUSINESS-MASTERS/NC/BM-0002-nc-core-operating-model.md`
- PRD: `docs/01-product/PRD/PRD-0005-nc-capa-management-mvp.md`
- Delivery SPEC: `docs/03-delivery/SPECS/SPEC-0015-nc-capa-contract-v1.md`
