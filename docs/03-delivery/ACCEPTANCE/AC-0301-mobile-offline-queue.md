# AC-0301 – Mobile Offline Queue Acceptance

ID: AC-0301  
Story: STORY-0301-mobile-offline-queue  
Status: Done  
Owner: Halil K.

## 1. AMAÇ

- Offline queue davranışının kullanıcı senaryolarında doğru çalıştığını doğrulamak.

## 2. KAPSAM

- Offline enqueue, online flush, retry/backoff ve kullanıcı geri bildirimi.

## 3. GIVEN / WHEN / THEN SENARYOLARI

- [x] Senaryo 1 – Offline enqueue  
      Given: Cihaz offline  
      When: Kullanıcı aksiyon yapar  
      Then: İstek kuyruklanır ve kaybolmaz

- [x] Senaryo 2 – Online flush  
      Given: Kuyrukta bekleyen işler var  
      When: Cihaz online olur  
      Then: İşler sırayla gönderilir ve başarıyla tamamlanır

- [x] Senaryo 3 – Retry ve hata  
      Given: Geçici hata oluşur  
      When: Retry/backoff çalışır  
      Then: Geçici hata düzelince gönderim tamamlanır; kalıcı hatada kullanıcı bilgilendirilir

## 4. NOTLAR / KISITLAR

- Conflict resolution kapsam dışıdır; bu acceptance “queue” davranışını doğrular.

## 5. ÖZET

- Offline queue akışı (enqueue → flush → retry) uçtan uca doğrulanmıştır.

## 6. LİNKLER (İSTEĞE BAĞLI)

- Story: docs/03-delivery/STORIES/STORY-0301-mobile-offline-queue.md  
- Test Plan: docs/03-delivery/TEST-PLANS/TP-0301-mobile-offline-queue.md  

