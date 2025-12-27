# BM-0001: Etik Programı — Core İşletim Modeli (v0.1)

-------------------------------------------------------------------------------
1. AMAÇ
-------------------------------------------------------------------------------

Etik bildirim sistemi “şikâyet kutusu” değil; kurum içi güvenin işletim sistemidir.

Güvenli bildirim → tarafsız ele alma → koruma → ölçülebilir iyileştirme döngüsünü işletmek.

-------------------------------------------------------------------------------
2. KAPSAM
-------------------------------------------------------------------------------

- Bildirim alımı (çok kanallı)
- Triage (sınıflandırma + öncelik + yönlendirme)
- İnceleme/soruşturma (delil, görev, zaman çizelgesi)
- Karar + aksiyon + kapanış
- Misilleme koruma
- Sürekli iyileştirme (trend → politika/kontrol iyileştirme)

-------------------------------------------------------------------------------
3. KAPSAM DIŞI
-------------------------------------------------------------------------------

- Otomatik “yargılama/ceza önerisi”
- İnsan onayı olmadan karar üretimi

-------------------------------------------------------------------------------
4. İŞLETİM MODELİ
-------------------------------------------------------------------------------

1) Intake  
2) Triage  
3) İnceleme  
4) Karar & Aksiyon  
5) Kapanış Kalite Kontrolü  
6) Misilleme Koruma Takibi  
7) Öğrenme & İyileştirme  

-------------------------------------------------------------------------------
5. KARAR NOKTALARI (ID'Lİ)
-------------------------------------------------------------------------------

- BM-0001-CORE-DEC-001: Anonim bildirim kabul edilecek mi?
- BM-0001-CORE-DEC-002: İki yönlü güvenli iletişim (case mailbox) olacak mı?
- BM-0001-CORE-DEC-003: Hangi vaka tipleri etik sisteminde kalır, hangileri yönlendirilir? (etik/İK/InfoSec/Finans vb.)
- BM-0001-CORE-DEC-004: Komite karar şablonu standart mı olacak?

-------------------------------------------------------------------------------
6. GUARDRAIL'LER (ID'Lİ)
-------------------------------------------------------------------------------

- BM-0001-CORE-GRD-001: Çıkar çatışması olan kişi vakaya erişemez / atanamaz.
- BM-0001-CORE-GRD-002: Need-to-know prensibi: yalnız gereken kadar görünürlük.
- BM-0001-CORE-GRD-003: Kapanış “kapandı” değil: kalite kontrol zorunlu.

-------------------------------------------------------------------------------
7. VARSAYIMLAR (ID'Lİ)
-------------------------------------------------------------------------------

- BM-0001-CORE-ASM-001: Etik komite/karar mekanizması mevcut veya kurulacak.
- BM-0001-CORE-ASM-002: En az bir güvenli kanal (web/telefon) işletilecek.

-------------------------------------------------------------------------------
8. DOĞRULAMA PLANI (ID'Lİ)
-------------------------------------------------------------------------------

- BM-0001-CORE-VAL-001: 4 haftalık pilot (1 lokasyon): triage kalitesi + SLA + erişim sınırları
- BM-0001-CORE-VAL-002: 10 senaryolu COI testi: yanlış atama/erişim denemeleri

-------------------------------------------------------------------------------
9. TOP 10 SÜRPRİZ ÖNLEYİCİ (ID'Lİ)
-------------------------------------------------------------------------------

- BM-0001-CORE-RSK-001: Yanlış atama (COI) → bağımsız atama + kontrol
- BM-0001-CORE-RSK-002: Gizlilik ihlali → erişim sınırları + görüntüleme logu
- BM-0001-CORE-RSK-003: “Kapatmış gibi” kapanış → kalite kontrol
- BM-0001-CORE-RSK-004: Misilleme görünmezliği → kapanış sonrası check-in
- BM-0001-CORE-RSK-005: Aşırı anonim suistimal → triage filtresi + trend analizi

-------------------------------------------------------------------------------
10. LİNKLER
-------------------------------------------------------------------------------

- PB: `docs/01-product/PROBLEM-BRIEFS/PB-0004-ethics-speakup-and-case-management.md`
- PRD: `docs/01-product/PRD/PRD-0004-ethics-speakup-and-case-management-mvp.md`
- BENCH Pack: `docs/01-product/BENCHMARKS/ETHICS/`
- TRACE: `docs/03-delivery/TRACES/TRACE-0001-ethics-bm-to-delivery.tsv`
- Delivery SPEC: `docs/03-delivery/SPECS/SPEC-0013-ethics-case-management-contract-v1.md`
- Platform Spec: `docs/03-delivery/SPECS/SPEC-0014-platform-capabilities-catalog-v1.md`
