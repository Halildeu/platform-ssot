# BM-0002: Uygunsuzluk (NC) & CAPA — Controls (Uyum, Kalite, Risk) (v0.1)

-------------------------------------------------------------------------------
1. AMAÇ
-------------------------------------------------------------------------------

NC/CAPA sürecinin denetlenebilir, ölçülebilir ve “kapanmadan kapanmış” sayılmayacak şekilde işletilmesini sağlayan kontrol setini tanımlamak.

-------------------------------------------------------------------------------
2. KAPSAM
-------------------------------------------------------------------------------

- Yetki sınırları ve audit trail beklentisi
- Delil/ek disiplininin kontrol boyutu
- Kapanış kalite kontrolü (policy)
- Eskalasyon ve SLA disiplininin kontrol boyutu

-------------------------------------------------------------------------------
3. KAPSAM DIŞI
-------------------------------------------------------------------------------

- Kurumsal compliance denetim prosedürlerinin detayları (policy dokümanları).
- Teknik erişim modeli implementasyonu (ADR/SPEC seviyesinde türetilir).

-------------------------------------------------------------------------------
4. İŞLETİM MODELİ
-------------------------------------------------------------------------------

Kontroller, NC yaşam döngüsünde “gating” olarak uygulanır:
- Yetki: need-to-know görünürlük + audit.
- Evidence: silinmez/sürümlenir + erişim loglanır.
- Kapanış: doğrulama adımı tamamlanmadan kapatma yapılamaz.
- SLA/Eskalasyon: due date ve breach semantiği tek SSOT ile izlenir.

-------------------------------------------------------------------------------
5. KARAR NOKTALARI (ID'Lİ)
-------------------------------------------------------------------------------

- BM-0002-CTRL-DEC-001: Need-to-know görünürlük zorunlu mu? (Evet.)
- BM-0002-CTRL-DEC-002: Evidence için “silinmez + sürümlenir” beklentisi zorunlu mu? (Evet.)
- BM-0002-CTRL-DEC-003: RCA şablonu doldurulmadan kapanış engellenecek mi? (Evet.)

-------------------------------------------------------------------------------
6. GUARDRAIL'LER (ID'Lİ)
-------------------------------------------------------------------------------

- BM-0002-CTRL-GRD-001: Yetkisiz kullanıcı NC detaylarını göremez (need-to-know).
- BM-0002-CTRL-GRD-002: Delil/ek silinmez; yeni sürüm eklenir (audit + chain-of-custody beklentisi).
- BM-0002-CTRL-GRD-003: CAPA aksiyonu “tamamlandı” sayılmadan doğrulama adımı zorunludur.
- BM-0002-CTRL-GRD-004: RCA şablonu doldurulmadan CAPA kapanışı yapılmaz.
- BM-0002-CTRL-GRD-005: Export/rapor çıktılarında redaksiyon policy ile uygulanır (PII varsa).

-------------------------------------------------------------------------------
7. VARSAYIMLAR (ID'Lİ)
-------------------------------------------------------------------------------

- BM-0002-CTRL-ASM-001: Denetim/Audit izleri kurumsal standartlara göre tutulacak.
- BM-0002-CTRL-ASM-002: Retention ve legal hold politikaları netleşecek.

-------------------------------------------------------------------------------
8. DOĞRULAMA PLANI (ID'Lİ)
-------------------------------------------------------------------------------

- BM-0002-CTRL-VAL-001: 10 senaryo yetkisiz erişim denemesi (read/write/export) çalıştırılacak.
- BM-0002-CTRL-VAL-002: 10 senaryo evidence sürümleme + view log doğrulaması yapılacak.
- BM-0002-CTRL-VAL-003: Kapanış gating (RCA/verification eksikken) negatif senaryoları test edilecek.

-------------------------------------------------------------------------------
9. TOP 10 SÜRPRİZ ÖNLEYİCİ (ID'Lİ)
-------------------------------------------------------------------------------

- BM-0002-CTRL-RSK-001: Yetki drift → policy test seti + audit örneklemi
- BM-0002-CTRL-RSK-002: Evidence kaybı → sürümleme + immutable log beklentisi
- BM-0002-CTRL-RSK-003: “Kapatmış gibi” kapanış → verification zorunluluğu
- BM-0002-CTRL-RSK-004: Retention belirsizliği → policy SSOT + rollout planı

-------------------------------------------------------------------------------
10. LİNKLER
-------------------------------------------------------------------------------

- BM Core: `docs/01-product/BUSINESS-MASTERS/NC/BM-0002-nc-core-operating-model.md`
- PB: `docs/01-product/PROBLEM-BRIEFS/PB-0005-nc-capa-management.md`
- PRD: `docs/01-product/PRD/PRD-0005-nc-capa-management-mvp.md`
- Delivery SPEC: `docs/03-delivery/SPECS/SPEC-0015-nc-capa-contract-v1.md`
- Platform Spec: `docs/03-delivery/SPECS/SPEC-0014-platform-capabilities-catalog-v1.md`
