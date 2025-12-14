# TEST-PLAN – Auth REST/DTO v1 Migration

ID: TP-0033  
Story: STORY-0033-auth-rest-dto-v1
Status: Planned  
Owner: @team/backend

Not: Aşağıdaki başlıklar ve sıralama **zorunludur**. Yeni bir Test Plan
yazılırken bu H2 başlıkları ve numaraları bire bir korunmalı; agent sadece
bu başlıkların altını doldurabilir.

-------------------------------------------------------------------------------
## 1. AMAÇ
-------------------------------------------------------------------------------

- Auth REST/DTO v1 geçişinin login, kayıt, şifre sıfırlama ve e‑posta
  doğrulama akışlarını AC-0033’teki kriterlere göre doğrulamak.

-------------------------------------------------------------------------------
## 2. KAPSAM
-------------------------------------------------------------------------------

- `/api/v1/auth/sessions`, `/registrations`, `/password-resets`,
  `/password-resets/{token}`, `/email-verifications/{token}`.  
- Legacy `/api/auth/*` uçlarının smoke test’i.  
- `docs/03-delivery/api/auth.api.md` dokümanı.

-------------------------------------------------------------------------------
## 3. STRATEJİ
-------------------------------------------------------------------------------

- Entegrasyon testleri ile (örn. `AuthControllerV1Test`) pozitif ve negatif
  login/kayıt/şifre akışlarını kapsamak.  
- Hata durumlarında ErrorResponse yapısını doğrulamak.  
- Legacy uçlar için kısa smoke test ile geriye dönük uyumluluğun korunup
  korunmadığını kontrol etmek.

-------------------------------------------------------------------------------
## 4. TEST SENARYOLARI ÖZETİ
-------------------------------------------------------------------------------

- [ ] Başarılı login/kayıt akışları.  
- [ ] Hatalı parola, geçersiz token, expired token senaryoları.  
- [ ] Şifre sıfırlama ve e‑posta doğrulama akışının uçtan uca testi.  
- [ ] Legacy `/api/auth/*` uçlarının çalışması ve v1’e yönlendirme/deprecation
  sinyalleri.

-------------------------------------------------------------------------------
## 5. ÇEVRE VE ARAÇLAR
-------------------------------------------------------------------------------

- Java ve test runner (JUnit/MockMvc).  
- `mvn -pl auth-service test` veya eşdeğer komut.  
- Gerekirse Postman/Insomnia koleksiyonu.

-------------------------------------------------------------------------------
## 6. RİSKLER / ÖNCELİKLER
-------------------------------------------------------------------------------

- Hatalı error handling, FE tarafında belirsiz durumlar yaratabilir.  
- Legacy uçların uzun süre açık kalması teknik borcu artırabilir; kapatma
  planı ayrı Story ile yönetilmelidir.

-------------------------------------------------------------------------------
## 7. ÖZET
-------------------------------------------------------------------------------

- Bu test planı, Auth REST/DTO v1 geçişinin hem yeni v1 uçları hem de
  legacy uyumluluk açısından güvenilir şekilde çalıştığını doğrular.

-------------------------------------------------------------------------------
## 8. LİNKLER (İSTEĞE BAĞLI)
-------------------------------------------------------------------------------

- Story: docs/03-delivery/STORIES/STORY-0033-auth-rest-dto-v1.md  
- Acceptance: docs/03-delivery/ACCEPTANCE/AC-0033-auth-rest-dto-v1.md  
- API: docs/03-delivery/api/auth.api.md  

