# AC-0036 – FE Shell Auth Centralization Acceptance

ID: AC-0036  
Story: STORY-0036-fe-shell-auth-centralization  
Status: Planned  
Owner: @team/frontend

-------------------------------------------------------------------------------
## 1. AMAÇ
-------------------------------------------------------------------------------

- FE shell auth merkezileştirme kararının uygulamada gerçekten hayata
  geçmiş olduğunu doğrulamak.

-------------------------------------------------------------------------------
## 2. KAPSAM
-------------------------------------------------------------------------------

- Shell auth store ve provider davranışı.  
- MFE’lerin login/logout davranışı.  
- shared-http kullanımı.  
- Multi-tab oturum senkronizasyonu.

-------------------------------------------------------------------------------
## 3. GIVEN / WHEN / THEN SENARYOLARI
-------------------------------------------------------------------------------

- [ ] Senaryo 1 – Login yalnız shell’den:  
  - Given: FE stack çalışır durumdadır (shell + MFE’ler).  
    When: Kullanıcı login olmak ister.  
    Then: Login akışı yalnız shell üzerinden başlar; herhangi bir MFE
    kendi login ekranını veya doğrudan Keycloak yönlendirmesini tetiklemez.

- [ ] Senaryo 2 – shared-http zorunluluğu:  
  - Given: MFE kod tabanı incelenmektedir.  
    When: HTTP çağrılarının yapıldığı yerler aranır.  
    Then: Tüm çağrılar shared-http üzerinden geçer; doğrudan fetch/axios
    kullanımı yoktur veya yalnız test/harness kodlarında vardır.

- [ ] Senaryo 3 – Multi-tab logout:  
  - Given: Kullanıcı iki sekmede aynı anda oturum açmıştır.  
    When: Bir sekmede logout yapılır.  
    Then: Diğer sekmede de oturum durumu kısa süre içinde güncellenir
    (BroadcastChannel + storage fallback üzerinden).

-------------------------------------------------------------------------------
## 4. NOTLAR / KISITLAR
-------------------------------------------------------------------------------

- Detaylı Playwright veya smoke test senaryoları TP-0036 test planında
  listelenecektir.  
- Backend tarafındaki 401/403 davranışları ve audit log’ları ayrı
  backend story’lerinde ele alınır.

-------------------------------------------------------------------------------
## 5. ÖZET
-------------------------------------------------------------------------------

- Shell auth merkezileştirme kararı, login yalnız shell’den, HTTP yalnız
  shared-http üzerinden ve multi-tab senkronizasyonu ile birlikte
  doğrulandığında bu acceptance tamamlanmış sayılır.

-------------------------------------------------------------------------------
## 6. LİNKLER (İSTEĞE BAĞLI)
-------------------------------------------------------------------------------

- Story: docs/03-delivery/STORIES/STORY-0036-fe-shell-auth-centralization.md  
- Test Plan: docs/03-delivery/TEST-PLANS/TP-0036-fe-shell-auth-centralization.md  

