# PB-0001 – User Notification Preferences Performance

ID: PB-0001

-------------------------------------------------------------------------------
1. AMAÇ
-------------------------------------------------------------------------------

- Kullanıcı bildirim tercihleri (e‑posta, SMS, push vb.) ekranı ve API’lerinde
  yaşanan performans ve deneyim sorunlarını, iş etkisi ve metriklerle birlikte
  kısa ve net şekilde tanımlamak.

-------------------------------------------------------------------------------
2. KAPSAM
-------------------------------------------------------------------------------

- Ürün: Web admin paneli + son kullanıcı profil ekranı.
- Modül: User notification preferences (tercihlerin okunması/güncellenmesi).
- Ortamlar: Özellikle prod ortamı; stage/test gözlemleri destekleyici kabul
  edilebilir.

-------------------------------------------------------------------------------
3. SORUN TANIMI
-------------------------------------------------------------------------------

- Mevcut durum:
  - Kullanıcı veya admin, notification preferences ekranına girdiğinde mevcut
    tercihlerin yüklenmesi zaman zaman yavaşlıyor.
  - Tercihleri kaydet butonuna basıldığında API bazen geç yanıt veriyor; bazı
    durumlarda “kaydedildi mi emin değilim” hissi oluşuyor.
- Problemin belirtileri:
  - Peak saatlerde notification preferences API’lerinin P95 yanıt süreleri
    belirgin şekilde yükseliyor.
  - Monitoring/alerting tarafında zaman zaman timeout veya 5xx artışı görülüyor.
  - Kullanıcı destek taleplerinde “bildirimleri kapattım ama hâlâ mail geliyor”
    ve “hangi bildirimleri açtım/kapatım anlamıyorum” şikâyetleri yer alıyor.
- Kimler etkileniyor?
  - Son kullanıcılar: Bildirim spam’i veya kritik uyarılardan haberdar
    olamama gibi deneyim sorunları yaşıyor.
  - Operasyon/ürün ekipleri: “Bildirim çalışıyor mu?” sorusuna hızlı ve net
    cevap veremiyor; sorun analizi için log/raporlarla uğraşmak zorunda kalıyor.

-------------------------------------------------------------------------------
4. HEDEF VE BAŞARI KRİTERLERİ
-------------------------------------------------------------------------------

- Performans hedefleri (örnek):
  - Notification preferences GET/PATCH uçlarında P95 yanıt süresi ≤ 500ms.
  - İlgili uçlarda time-out oranı %1’in altında.
- Deneyim hedefleri:
  - “Tercihleri kaydet” işlemi için kullanıcı tarafında net başarı/başarısızlık
    mesajları ve idempotent davranış.
  - Destek taleplerinde “bildirim tercihi çalışmıyor” kategorisindeki ticket
    sayısında anlamlı azalma.

-------------------------------------------------------------------------------
5. VARSAYIMLAR / RİSKLER
-------------------------------------------------------------------------------

- Varsayımlar:
  - Yavaşlık, büyük user base + yeterince optimize edilmemiş sorgular ve/veya
    çok karmaşık veri modeli kombinasyonundan kaynaklanıyor olabilir.
  - Bazı bildirim türlerinde backend ile üçüncü parti servisler arasında ek
    gecikmeler veya hatalar olabilir.
- Riskler:
  - Bildirim tercihleri alanındaki sorunlar, kullanıcıların bildirim kanallarını
    tamamen kapatmasına ve etkileşimin düşmesine yol açabilir.
  - Yanlış veya çelişkili ayarlar, regülasyon ve gizlilik/opt‑in kuralları
    açısından risk yaratabilir.

-------------------------------------------------------------------------------
6. ÖZET
-------------------------------------------------------------------------------

- User notification preferences alanında hem performans hem de deneyim
  açısından sorunlar var; bu, kullanıcı memnuniyetini ve uyum riskini etkiliyor.
- Somut metrik hedefleri belirlenmeli ve sonraki adımda bu problemi adresleyen
  PRD + teknik tasarım + Story/Acceptance zinciri hazırlanmalıdır.

-------------------------------------------------------------------------------
7. LİNKLER / SONRAKİ ADIMLAR
-------------------------------------------------------------------------------

- İlgili PRD: `docs/01-product/PRD/PRD-0001-user-notification-preferences-api.md`
