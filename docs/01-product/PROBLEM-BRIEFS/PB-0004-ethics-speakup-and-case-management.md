# PB-0004 – Etik Bildirim ve Vaka Yönetimi (Speak-Up + Case Management)

ID: PB-0004  
Status: Draft  
Owner: TBD

-------------------------------------------------------------------------------
1. AMAÇ
-------------------------------------------------------------------------------

Etik bildirim süreçleri dağınık ve izlenebilir değilse güven kaybı, misilleme riski ve uyum açıkları oluşur.
Bu PB, speak-up ve vaka yönetimi problemini “iş etkisi + doğrulanabilir başarı kriterleri” ile çerçeveler.

-------------------------------------------------------------------------------
2. KAPSAM
-------------------------------------------------------------------------------

Dahil:
- Güvenli bildirim (intake) ve iki yönlü takip (case mailbox) ihtiyacı.
- Tarafsız triage ve COI (çıkar çatışması) guardrail’leri.
- Denetlenebilir inceleme: delil (evidence) disiplini ve audit trail beklentisi.
- Kapanış kalitesi ve temel metrik seti.

Hariç:
- Otomatik yaptırım kararı.
- İnsan onayı olmadan AI ile karar üretimi.

-------------------------------------------------------------------------------
3. SORUN TANIMI
-------------------------------------------------------------------------------

Mevcut durum:
- Bildirim kanalları ve süreç adımları standardize değil; vaka ilerleyişi izlenebilir değil.

Belirtiler:
- “Kim neyi ne zaman yaptı/gördü?” sorusu audit seviyesinde cevaplanamıyor.
- Misilleme riski süreç olarak takip edilmediğinde güven kaybı oluşuyor.

Kimler etkileniyor?
- Bildiren: güvenli takip ve gizlilik beklentisi.
- Vaka yöneticisi/komite: tarafsızlık, COI yönetimi, denetlenebilir karar kaydı.
- Denetçi/uyum: audit izi ve raporlama.

-------------------------------------------------------------------------------
4. HEDEF VE BAŞARI KRİTERLERİ
-------------------------------------------------------------------------------

- Güvenli intake + tarafsız triage + denetlenebilir inceleme işletilir.
- Kapanış kalitesi ölçülür ve tekrar eden riskler azalır.
- Misilleme koruması süreç olarak işler.

-------------------------------------------------------------------------------
5. VARSAYIMLAR / RİSKLER
-------------------------------------------------------------------------------

Varsayımlar:
- Etik komite/karar mekanizması mevcut veya kurulacak.

Riskler:
- Gizlilik ihlali veya COI atama hatası güveni zedeler.
- Delil disiplini ve view log yoksa denetim izi zayıflar.

-------------------------------------------------------------------------------
6. ÖZET
-------------------------------------------------------------------------------

- Speak-up ve vaka yönetimi, kurum içi güveni belirleyen kritik bir operasyon sistemidir.
- Başarı, “hız” kadar “kapanış kalitesi + audit izi + misilleme koruması” ile ölçülmelidir.

-------------------------------------------------------------------------------
7. LİNKLER / SONRAKİ ADIMLAR
-------------------------------------------------------------------------------

- PRD: `docs/01-product/PRD/PRD-0004-ethics-speakup-and-case-management-mvp.md`
- BM/Trace (izlenebilirlik):
  - `BM-0001-CORE-DEC-001` (anonimlik)
  - `BM-0001-CTRL-GRD-001` (COI)
  - `BM-0001-CTRL-GRD-003` (delil immutability)
  - `BM-0001-MET-KPI-009` (kapanış kalite skoru)
- TRACE: `docs/03-delivery/TRACES/TRACE-0001-ethics-bm-to-delivery.tsv`
