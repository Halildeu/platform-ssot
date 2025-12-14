# TEST-PLAN – User REST/DTO v1 Migration

ID: TP-0032  
Story: STORY-0032-user-rest-dto-v1
Status: Planned  
Owner: @team/backend

Not: Aşağıdaki başlıklar ve sıralama **zorunludur**. Yeni bir Test Plan
yazılırken bu H2 başlıkları ve numaraları bire bir korunmalı; agent sadece
bu başlıkların altını doldurabilir.

-------------------------------------------------------------------------------
## 1. AMAÇ
-------------------------------------------------------------------------------

- User REST/DTO v1 geçişinin fonksiyonel, hata modeli ve geriye dönük
  uyumluluk açısından AC-0032’de tanımlanan kriterlere uygun olduğunu
  doğrulamak.

-------------------------------------------------------------------------------
## 2. KAPSAM
-------------------------------------------------------------------------------

- `/api/v1/users`, `/api/v1/users/{id}`, `/api/v1/users/by-email`,
  `/api/v1/users/{id}/activation`.  
- Legacy `/api/users/*` uçları (okuma amaçlı smoke test).  
- API dokümanı `docs/03-delivery/api/users.api.md`.

-------------------------------------------------------------------------------
## 3. STRATEJİ
-------------------------------------------------------------------------------

- Entegrasyon testleri (örn. `UserControllerV1Test`) ile başlıca pozitif ve
  negatif akışları kapsamak.  
- Smoke test olarak legacy uçların halen çalıştığını, fakat dokümantasyonda
  deprecated edildiğini doğrulamak.  
- Hata senaryolarında ErrorResponse yapısının STYLE-API-001 ile uyumunu
  kontrol etmek.

-------------------------------------------------------------------------------
## 4. TEST SENARYOLARI ÖZETİ
-------------------------------------------------------------------------------

- [ ] V1 listeleme ve advancedFilter kombinasyonları (pozitif/negatif).  
- [ ] Detay ve aktivasyon uçlarının doğru DTO ile yanıt vermesi.  
- [ ] Legacy `/api/users/*` uçlarının çalışması ve log/deprecated sinyali.  
- [ ] ErrorResponse yapısının JSON şemasının doğrulanması.

-------------------------------------------------------------------------------
## 5. ÇEVRE VE ARAÇLAR
-------------------------------------------------------------------------------

- Java ve test runner (JUnit/MockMvc).  
- `mvn -pl user-service test` veya eşdeğer komut.  
- Gerekirse Postman/Insomnia koleksiyonu.

-------------------------------------------------------------------------------
## 6. RİSKLER / ÖNCELİKLER
-------------------------------------------------------------------------------

- Legacy ve v1 path’lerin aynı anda uzun süre açık kalması, teknik borç
  oluşturabilir.  
- Yanlış advancedFilter/sort davranışı, FE tarafında zor teşhis edilen
  problemler yaratabilir.

-------------------------------------------------------------------------------
## 7. ÖZET
-------------------------------------------------------------------------------

- Bu test planı, User REST/DTO v1 geçişinin hem yeni v1 uçları hem de
  legacy uyumluluk açısından güvenilir şekilde çalıştığını doğrular.

-------------------------------------------------------------------------------
## 8. LİNKLER (İSTEĞE BAĞLI)
-------------------------------------------------------------------------------

- Story: docs/03-delivery/STORIES/STORY-0032-user-rest-dto-v1.md  
- Acceptance: docs/03-delivery/ACCEPTANCE/AC-0032-user-rest-dto-v1.md  
- API: docs/03-delivery/api/users.api.md  

