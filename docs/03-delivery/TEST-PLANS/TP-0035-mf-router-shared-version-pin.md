# TEST-PLAN – MF Router Shared & Version Pin

ID: TP-0035  
Story: STORY-0035-mf-router-shared-version-pin
Status: Planned  
Owner: @team/frontend

Not: Aşağıdaki başlıklar ve sıralama **zorunludur**. Yeni bir Test Plan
yazılırken bu H2 başlıkları ve numaraları bire bir korunmalı; agent sadece
bu başlıkların altını doldurabilir.

-------------------------------------------------------------------------------
## 1. AMAÇ
-------------------------------------------------------------------------------

- MF router shared & version pin kuralının AC-0035’te tanımlanan tüm
  senaryolarda doğru çalıştığını doğrulamak.

-------------------------------------------------------------------------------
## 2. KAPSAM
-------------------------------------------------------------------------------

- Tüm MFE’lerin MF shared config ve package.json dosyaları.  
- Router smoke testleri (Playwright/e2e).  
- CI pipeline çıktıları.

-------------------------------------------------------------------------------
## 3. STRATEJİ
-------------------------------------------------------------------------------

- Statik analiz ile MF shared config + package.json versiyonlarını
  karşılaştırmak.  
- Playwright veya benzeri e2e harness’i ile router drift/çift kopya
  durumlarını tetiklemek.  
- CI’de ilgili job’ların her PR’de çalıştığını ve kırmızı durumda
  build’i durdurduğunu doğrulamak.

-------------------------------------------------------------------------------
## 4. TEST SENARYOLARI ÖZETİ
-------------------------------------------------------------------------------

- [ ] MF shared config ile package.json versiyonları uyumlu.  
- [ ] Router drift/çift kopya durumunda smoke test fail ediyor.  
- [ ] CI job’ları router pin kuralını ihlal eden değişiklikleri engelliyor.

-------------------------------------------------------------------------------
## 5. ÇEVRE VE ARAÇLAR
-------------------------------------------------------------------------------

- Node.js + MF config dosyaları.  
- Playwright veya benzeri e2e test aracı.  
- CI pipeline (ör. GitHub Actions/other).

-------------------------------------------------------------------------------
## 6. RİSKLER / ÖNCELİKLER
-------------------------------------------------------------------------------

- Router sürümlerindeki uyumsuzlukların yalnız runtime’da görülmesi; bu
  nedenle smoke testlerin ve statik kontrollerin güncel tutulması kritik.  
- Paylaşılan router versiyonunun upgrade’lerinde MF shared config’in
  unutulması.

-------------------------------------------------------------------------------
## 7. ÖZET
-------------------------------------------------------------------------------

- Bu test planı, MF router shared & version pin kuralının hem config hem
  test hem de CI katmanında güvenilir şekilde uygulandığını doğrular.

-------------------------------------------------------------------------------
## 8. LİNKLER (İSTEĞE BAĞLI)
-------------------------------------------------------------------------------

- Story: docs/03-delivery/STORIES/STORY-0035-mf-router-shared-version-pin.md  
- Acceptance: docs/03-delivery/ACCEPTANCE/AC-0035-mf-router-shared-version-pin.md  
