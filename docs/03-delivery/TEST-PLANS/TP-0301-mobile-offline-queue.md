# TEST-PLAN – Mobile Offline Queue

ID: TP-0301  
Story: STORY-0301-mobile-offline-queue
Status: Done  
Owner: Halil K.

Not: Aşağıdaki başlıklar ve sıralama **zorunludur**. Yeni bir Test Plan
yazılırken bu H2 başlıkları ve numaraları bire bir korunmalı; agent sadece
bu başlıkların altını doldurabilir.

-------------------------------------------------------------------------------
## 1. AMAÇ
-------------------------------------------------------------------------------

- Offline queue davranışının fonksiyonel ve negatif senaryolarla doğrulanması.

-------------------------------------------------------------------------------
## 2. KAPSAM
-------------------------------------------------------------------------------

- Offline enqueue.  
- Online flush.  
- Retry/backoff ve hata yönetimi.

-------------------------------------------------------------------------------
## 3. STRATEJİ
-------------------------------------------------------------------------------

- Manuel/otomatik e2e: offline/online mod simülasyonu.  
- Negatif: geçici hata ve kalıcı hata senaryoları.  
- Log/telemetry doğrulaması.

-------------------------------------------------------------------------------
## 4. TEST SENARYOLARI ÖZETİ
-------------------------------------------------------------------------------

- [x] Offline enqueue çalışır.  
- [x] Online flush çalışır.  
- [x] Retry/backoff ve kalıcı hata davranışı doğru.

-------------------------------------------------------------------------------
## 5. ÇEVRE VE ARAÇLAR
-------------------------------------------------------------------------------

- Mobil cihaz/emülatör.  
- Network link conditioner / offline toggle.

-------------------------------------------------------------------------------
## 6. RİSKLER / ÖNCELİKLER
-------------------------------------------------------------------------------

- Kuyruk bozulursa veri kaybı riski (yüksek).  
- Retry fırtınası performans sorunlarına neden olabilir.

-------------------------------------------------------------------------------
## 7. ÖZET
-------------------------------------------------------------------------------

- Offline queue, en kritik senaryolarla doğrulanmış ve kapanmıştır.

-------------------------------------------------------------------------------
## 8. LİNKLER (İSTEĞE BAĞLI)
-------------------------------------------------------------------------------

- Story: docs/03-delivery/STORIES/STORY-0301-mobile-offline-queue.md  
- Acceptance: docs/03-delivery/ACCEPTANCE/AC-0301-mobile-offline-queue.md  

