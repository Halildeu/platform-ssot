# TEST-PLAN – Login API Rate Limiting

ID: TP-0101  
Story: STORY-0101-login-api-rate-limiting
Status: Planned  
Owner: Halil K.

Not: Aşağıdaki başlıklar ve sıralama **zorunludur**. Yeni bir Test Plan
yazılırken bu H2 başlıkları ve numaraları bire bir korunmalı; agent sadece
bu başlıkların altını doldurabilir.

-------------------------------------------------------------------------------
## 1. AMAÇ
-------------------------------------------------------------------------------

- Login uçlarında rate limiting’in doğru çalıştığını ve regresyon yaratmadığını doğrulamak.

-------------------------------------------------------------------------------
## 2. KAPSAM
-------------------------------------------------------------------------------

- `/auth/login` ve ilişkili kritik uçlar.  
- Negatif senaryolar (limit aşımı).  
- Telemetry/log doğrulaması.

-------------------------------------------------------------------------------
## 3. STRATEJİ
-------------------------------------------------------------------------------

- Integration test: hızlı tekrar eden isteklerle limit davranışı.  
- Negatif test: limit aşıldığında 429 + hata zarfı.  
- Smoke: normal login akışının etkilenmediğini doğrulama.

-------------------------------------------------------------------------------
## 4. TEST SENARYOLARI ÖZETİ
-------------------------------------------------------------------------------

- [ ] Limit altında login başarılı.  
- [ ] Limit aşılınca 429 + standart error zarfı.  
- [ ] Block olayları telemetry/log’da görülebilir.

-------------------------------------------------------------------------------
## 5. ÇEVRE VE ARAÇLAR
-------------------------------------------------------------------------------

- Local/dev ortamı.  
- HTTP client (curl/postman) ve/veya integration test harness.

-------------------------------------------------------------------------------
## 6. RİSKLER / ÖNCELİKLER
-------------------------------------------------------------------------------

- Yanlış limit ayarı gerçek kullanıcıları etkileyebilir (yüksek öncelik).  
- Telemetry eksikliği incident triage’ı zorlaştırır.

-------------------------------------------------------------------------------
## 7. ÖZET
-------------------------------------------------------------------------------

- Login rate limiting doğrulanır; güvenlik ve UX dengesi korunur.

-------------------------------------------------------------------------------
## 8. LİNKLER (İSTEĞE BAĞLI)
-------------------------------------------------------------------------------

- Story: docs/03-delivery/STORIES/STORY-0101-login-api-rate-limiting.md  
- Acceptance: docs/03-delivery/ACCEPTANCE/AC-0101-login-api-rate-limiting.md  

