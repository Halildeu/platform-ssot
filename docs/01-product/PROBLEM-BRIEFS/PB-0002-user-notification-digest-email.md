# PB-0002 – User Notification Digest E-mail

ID: PB-0002

-------------------------------------------------------------------------------
1. AMAÇ
-------------------------------------------------------------------------------

- Kullanıcılara günlük/haftalık “notification digest” e‑mail’i gönderme
  ihtiyacını, iş etkisi ve metrikleriyle birlikte kısa ve net şekilde
  tanımlamak.

-------------------------------------------------------------------------------
2. KAPSAM
-------------------------------------------------------------------------------

- Ürün: Web admin paneli + son kullanıcı uygulaması (e‑mail bildirimleri).
- Modül: Notification digest (günlük/haftalık özet mail).
- Ortamlar: Özellikle prod; stage/test gözlemleri destekleyici kabul
  edilebilir.

-------------------------------------------------------------------------------
3. SORUN TANIMI
-------------------------------------------------------------------------------

- Mevcut durum:
  - Kullanıcılar gün içinde çok sayıda tekil bildirim alıyor; inbox gürültüsü
    artıyor.
  - Önemli ama zaman kritik olmayan bildirimler, diğer mailler arasında
    kaybolabiliyor.
- Problemin belirtileri:
  - Bildirim e‑maillerinde düşük açılma oranları (open rate).
  - “Çok fazla mail alıyorum” şikâyetleri ve toplu unsubscribe davranışı.
  - Önemli özetteki aksiyonların (örn. rapor hazır, onay bekliyor) geç
    tamamlanması.
- Kimler etkileniyor?
  - Son kullanıcılar: Bildirim spam’i hissediyor, ama gerçek öneme göre
    önceliklendirilmiş bir özet alamıyor.
  - Ürün/operasyon ekipleri: Özellik kullanımını ve önemli aksiyonların
    tamamlanma hızını sağlıklı takip edemiyor.

-------------------------------------------------------------------------------
4. HEDEF VE BAŞARI KRİTERLERİ
-------------------------------------------------------------------------------

- Performans / davranış hedefleri (örnek):
  - Digest e‑mail open rate’inde mevcut tekil bildirim maillerine göre
    anlamlı artış.
  - Önemli aksiyonların (ör. bekleyen onaylar) digest sonrasında belirli süre
    içinde tamamlanma oranında artış.
- Deneyim hedefleri:
  - Kullanıcı, hangi bildirimleri günlük/haftalık digest’te görmek istediğini
    basitçe yönetebilmeli.
  - Digest formatı kolay okunur, mobil uyumlu ve aksiyon linklerini net
    şekilde içermelidir.

-------------------------------------------------------------------------------
5. VARSAYIMLAR / RİSKLER
-------------------------------------------------------------------------------

- Varsayımlar:
  - Mevcut bildirim tercihleri ve email altyapısı digest için yeniden
    kullanılabilir (ek API’ler ile).
  - Kullanıcıların önemli bir kısmı, tekil bildirim yağmuru yerine özet
    formatı tercih edecektir.
- Riskler:
  - Yanlış segment veya içerik seçimi, kritik anlık bildirimlerin geç
    görülmesine yol açabilir.
  - Digest’in kendisi de spam hissi yaratacak şekilde tasarlanırsa, toplu
    unsubscribe artabilir.

-------------------------------------------------------------------------------
6. ÖZET
-------------------------------------------------------------------------------

- Tekil bildirim maillerinin sayısı yüksek, etkisi düşük; kullanıcılar hem
  yorgunluk hem de kaçırılan fırsatlar yaşıyor.
- Günlük/haftalık notification digest e‑mail özelliğiyle, önemli olaylar tek
  bir derli toplu e‑mail’de sunularak deneyim ve iş etkisi iyileştirilecektir.

-------------------------------------------------------------------------------
7. LİNKLER / SONRAKİ ADIMLAR
-------------------------------------------------------------------------------

- İlgili PRD: `docs/01-product/PRD/PRD-0002-user-notification-digest-email.md`

