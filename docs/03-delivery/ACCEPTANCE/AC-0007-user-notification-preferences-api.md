# AC-0007 – User Notification Preferences API Acceptance

ID: AC-0007  
Story: STORY-0007-user-notification-preferences-api  
Status: Done  
Owner: @team/backend

## 1. AMAÇ

- User notification preferences API’lerinin işlevsel ve performans açısından
  PRD-0001 gereksinimlerini karşıladığını test edilebilir kriterlerle
  doğrulamak.

## 2. KAPSAM

- Kullanıcının kendi tercihlerini okuma/güncelleme uçları.
- İleride admin paneli için diğer kullanıcıların tercihlerini görüntüleme
  uçları (rol bazlı erişim).

## 3. GIVEN / WHEN / THEN SENARYOLARI

- [x] Senaryo 1 – Kullanıcı tercihlerini görüntüleme:
  - Given: Geçerli JWT ile giriş yapmış bir kullanıcı vardır ve notification
    preferences için kayıtlı ayarları mevcuttur.  
    When: Kullanıcı, notification preferences ekranına girer (API üzerinden
    GET isteği yapılır).  
    Then: API, kullanıcının tüm ilgili bildirim kanalları için geçerli
    tercihlerini başarıyla döndürür.

- [x] Senaryo 2 – Tercih güncelleme:
  - Given: Kullanıcı belirli bildirim türlerini açmak/kapatmak ister.  
    When: Kullanıcı, arayüz üzerinden bazı tercihlerini değiştirir ve Kaydet
    tuşuna basar (API’ye PATCH isteği yapılır).  
    Then: API 200 döner, yeni tercihler veri katmanında güncellenir ve
    kullanıcıya net bir başarı mesajı gösterilir.

- [x] Senaryo 3 – Yetkisiz erişim:
  - Given: Kimliği doğrulanmamış veya yeterli role sahip olmayan bir istek
    yapılır.  
    When: Notification preferences uçlarına erişim denenir.  
    Then: API 401/403 döner ve hassas kullanıcı ayarları hiçbir şekilde
    döndürülmez.

## 4. NOTLAR / KISITLAR

- Detaylı performans ve edge case senaryoları TP-0007 test planında
  listelenecektir.

Kanıt/Evidence:
- `backend/user-service/src/test/java/com/example/user/controller/NotificationPreferencesControllerV1Test.java`
- `backend/user-service/src/main/resources/db/migration/V9__create_user_notification_preferences.sql`
- `./backend/mvnw -pl user-service test`

## 5. ÖZET

- Kullanıcı, notification preferences ekranı üzerinden kendi bildirim
  tercihlerini güvenle görüntüleyip güncelleyebilir.
- Yetkisiz veya yetersiz yetkili istekler, notification preferences uçlarına
  erişemez (401/403 ile engellenir).
- Detaylı senaryolar TP-0007 test planında doğrulanır.

## 6. LİNKLER (İSTEĞE BAĞLI)

- Story: docs/03-delivery/STORIES/STORY-0007-user-notification-preferences-api.md  
- Test Plan: docs/03-delivery/TEST-PLANS/TP-0007-user-notification-preferences-api.md  
