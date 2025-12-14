# TP-0007 – User Notification Preferences API Test Planı

ID: TP-0007  
Story: STORY-0007-user-notification-preferences-api
Status: Done  
Owner: @team/backend

-------------------------------------------------------------------------------
1. AMAÇ
-------------------------------------------------------------------------------

- User notification preferences API uçlarının (GET/PATCH) PRD-0001’deki iş
  gereksinimleri ve AC-0007 kabul kriterleriyle uyumlu olduğunu doğrulamak.

-------------------------------------------------------------------------------
2. KAPSAM
-------------------------------------------------------------------------------

- `GET /api/v1/notification-preferences`
- `PATCH /api/v1/notification-preferences`
- İleride admin uçları eklenirse:
  - `GET /api/v1/admin/users/{id}/notification-preferences`

-------------------------------------------------------------------------------
3. STRATEJİ
-------------------------------------------------------------------------------

- Fonksiyonel testler:
  - Geçerli kullanıcı için tercihleri okuma/güncelleme akışları.
  - Yetkisiz/yanlış yetkili erişim denemeleri.
- Negatif testler:
  - Geçersiz gövde, desteklenmeyen kanal isimleri, eksik alanlar.
- Performans:
  - Temel latency ölçümleri (örnek: P95 yanıt süreleri).

-------------------------------------------------------------------------------
4. TEST SENARYOLARI ÖZETİ
-------------------------------------------------------------------------------

- [x] Mevcut tercihleri okuma (mutlu akış).  
- [x] Tercihleri güncelleme (mutlu akış).  
- [x] Yetkisiz erişim (401/403).  
- [x] Geçersiz istek gövdesi (400).  
- [ ] Temel performans doğrulaması (örnek hacimle).

-------------------------------------------------------------------------------
5. ÇEVRE VE ARAÇLAR
-------------------------------------------------------------------------------

- Ortamlar:
  - Test/stage ortamları (örn. `test`, `stage`) ve temel konfigürasyonları.
- Araçlar:
  - HTTP istemcileri (curl, Postman, Insomnia).
  - Log ve monitoring panelleri (örn. Grafana, Kibana).

-------------------------------------------------------------------------------
6. RİSKLER / ÖNCELİKLER
-------------------------------------------------------------------------------

- En kritik riskler:
  - Yanlış tercih güncellemelerinin kullanıcıya beklenmeyen bildirimler
    göndermesi (veya kritik bildirimlerin kesilmesi).
  - Üçüncü parti provider gecikmelerinin performans hedeflerini etkilemesi.
- Öncelikli senaryolar:
  - Kullanıcı tercihlerini okuma/güncelleme mutlu akışları.
  - Yetkisiz erişimin doğru şekilde engellenmesi.

-------------------------------------------------------------------------------
7. ÖZET
-------------------------------------------------------------------------------

- Bu test planı, notification preferences API uçlarının fonksiyonel,
  güvenlik ve temel performans gereksinimlerini doğrulamayı hedefler.
- Odak: mutlu akışlar, yetkisiz erişim ve temel hata/gönderim senaryolarıdır.

-------------------------------------------------------------------------------
8. LİNKLER (İSTEĞE BAĞLI)
-------------------------------------------------------------------------------

- Story: docs/03-delivery/STORIES/STORY-0007-user-notification-preferences-api.md  
- Acceptance: docs/03-delivery/ACCEPTANCE/AC-0007-user-notification-preferences-api.md  
- PRD: docs/01-product/PRD/PRD-0001-user-notification-preferences-api.md  

Kanıt/Evidence:
- `backend/user-service/src/test/java/com/example/user/controller/NotificationPreferencesControllerV1Test.java`
- `./backend/mvnw -pl user-service test`
