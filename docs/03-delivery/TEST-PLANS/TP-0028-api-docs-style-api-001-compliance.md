# TEST-PLAN – API Docs STYLE-API-001 Compliance

ID: TP-0028  
Story: STORY-0028-api-docs-style-api-001-compliance
Status: Planned  
Owner: @team/backend

Not: Aşağıdaki başlıklar ve sıralama **zorunludur**. Yeni bir Test Plan
yazılırken bu H2 başlıkları ve numaraları bire bir korunmalı; agent sadece
bu başlıkların altını doldurabilir.

-------------------------------------------------------------------------------
## 1. AMAÇ
-------------------------------------------------------------------------------

- `.api.md` sözleşmeleri için STYLE-API-001 uyum kontrolü script’inin
  AC-0028’de tanımlanan senaryolara göre doğru çalıştığını doğrulamak.

-------------------------------------------------------------------------------
## 2. KAPSAM
-------------------------------------------------------------------------------

- `docs/03-delivery/api/users.api.md` ve en az bir ek `.api.md` dokümanı.  
- Global modda tüm `.api.md` dosyalarının taranması.

-------------------------------------------------------------------------------
## 3. STRATEJİ
-------------------------------------------------------------------------------

- En az bir “örnek” API dokümanı seçip, script’i yalnız bu dosya için
  çalıştırmak ve eksik başlık/alan raporlarının beklendiği gibi olduğunu
  kontrol etmek.  
- Ardından tüm `.api.md` dosyaları için script’i çalıştırmak ve PASS/FAIL
  sonuçlarını gözden geçirmek.  
- Gerekirse bilerek eksik veya hatalı alanlar ekleyip script’in bunları
  yakalayıp yakalamadığını test etmek.

-------------------------------------------------------------------------------
## 4. TEST SENARYOLARI ÖZETİ
-------------------------------------------------------------------------------

- [ ] Tek bir `.api.md` için zorunlu başlık/alan kontrolleri.  
- [ ] Tüm `.api.md` dosyaları için toplu PASS/FAIL raporu.  
- [ ] Bilinçli olarak eklenen eksik alanların script tarafından
  yakalanması.

-------------------------------------------------------------------------------
## 5. ÇEVRE VE ARAÇLAR
-------------------------------------------------------------------------------

- Python 3 çalışma ortamı.  
- `scripts/check_api_docs.py` (veya eşdeğer API doküman QA script’i).  
- Mevcut `docs/03-delivery/api/*.api.md` dokümanları.  

-------------------------------------------------------------------------------
## 6. RİSKLER / ÖNCELİKLER
-------------------------------------------------------------------------------

- Script’in aşırı katı olması ve gereksiz false positive üretmesi,
  geliştirici deneyimini olumsuz etkileyebilir.  
- STYLE-API-001.md’de yapılacak yapısal değişikliklerin script’e
  yansıtılması gerekir; aksi halde script güncelliğini kaybeder.

-------------------------------------------------------------------------------
## 7. ÖZET
-------------------------------------------------------------------------------

- Bu test planı, API doküman QA script’inin temel senaryolarda beklendiği
  gibi çalıştığını ve STYLE-API-001 uyumsuzluklarını güvenilir şekilde
  raporlayabildiğini doğrular.

-------------------------------------------------------------------------------
## 8. LİNKLER (İSTEĞE BAĞLI)
-------------------------------------------------------------------------------

- Story: docs/03-delivery/STORIES/STORY-0028-api-docs-style-api-001-compliance.md  
- Acceptance: docs/03-delivery/ACCEPTANCE/AC-0028-api-docs-style-api-001-compliance.md  

