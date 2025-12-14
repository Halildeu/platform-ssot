# TEST-PLAN – FE Shell Auth Centralization

ID: TP-0036  
Story: STORY-0036-fe-shell-auth-centralization
Status: Planned  
Owner: @team/frontend

Not: Aşağıdaki başlıklar ve sıralama **zorunludur**. Yeni bir Test Plan
yazılırken bu H2 başlıkları ve numaraları bire bir korunmalı; agent sadece
bu başlıkların altını doldurabilir.

-------------------------------------------------------------------------------
## 1. AMAÇ
-------------------------------------------------------------------------------

- FE shell auth merkezileştirmenin AC-0036’daki senaryolara göre güvenilir
  şekilde çalıştığını doğrulamak.

-------------------------------------------------------------------------------
## 2. KAPSAM
-------------------------------------------------------------------------------

- Shell auth store ve provider.  
- shared-http kullanımı.  
- Multi-tab oturum senkronizasyonu (BroadcastChannel + storage fallback).  
- Dev/prod profillerinde bu davranışın tutarlılığı.

-------------------------------------------------------------------------------
## 3. STRATEJİ
-------------------------------------------------------------------------------

- Unit/integration testleri ile shell auth store ve shared-http
  entegrasyonunu doğrulamak.  
- Playwright veya benzeri e2e testlerle çoklu sekme logout senaryosunu
  çalıştırmak.  
- Kod taraması veya script ile MFE’lerin doğrudan HTTP client kullanmadığını
  teyit etmek.

-------------------------------------------------------------------------------
## 4. TEST SENARYOLARI ÖZETİ
-------------------------------------------------------------------------------

- [ ] Shell auth store + provider davranışı.  
- [ ] shared-http üzerinden gateway’e giden çağrılar.  
- [ ] Multi-tab logout senaryosunun çalışması.  
- [ ] Dev/prod profillerinde beklenen auth modu (permitAll vs zorunlu auth).

-------------------------------------------------------------------------------
## 5. ÇEVRE VE ARAÇLAR
-------------------------------------------------------------------------------

- FE test runner (Vitest/Jest).  
- Playwright/Cypress gibi e2e araçlar.  
- Gerekirse gerçek Keycloak/QA ortamı.

-------------------------------------------------------------------------------
## 6. RİSKLER / ÖNCELİKLER
-------------------------------------------------------------------------------

- Bazı MFE’lerde shared-http dışında HTTP client kalması; bu nedenle kod
  taraması ve review süreci önemli.  
- Multi-tab senkronizasyonunda tarayıcı kısıtları (ör. BroadcastChannel
  desteği olmayan ortamlarda fallback davranışı).

-------------------------------------------------------------------------------
## 7. ÖZET
-------------------------------------------------------------------------------

- Bu test planı, FE shell auth merkezileştirme kararının yeni sistemde
  hem kod hem test hem de doküman seviyesiyle uyumlu çalıştığını
  doğrulamayı amaçlar.

-------------------------------------------------------------------------------
## 8. LİNKLER (İSTEĞE BAĞLI)
-------------------------------------------------------------------------------

- Story: docs/03-delivery/STORIES/STORY-0036-fe-shell-auth-centralization.md  
- Acceptance: docs/03-delivery/ACCEPTANCE/AC-0036-fe-shell-auth-centralization.md  

