# AC-0028 – API Docs STYLE-API-001 Compliance Acceptance

ID: AC-0028  
Story: STORY-0028-api-docs-style-api-001-compliance  
Status: Planned  
Owner: @team/backend

-------------------------------------------------------------------------------
## 1. AMAÇ
-------------------------------------------------------------------------------

- `.api.md` dokümanlarının STYLE-API-001 rehberine uygunluğunu test edilebilir
  kriterlerle doğrulamak.

-------------------------------------------------------------------------------
## 2. KAPSAM
-------------------------------------------------------------------------------

- `docs/03-delivery/api/*.api.md` altında yer alan tüm API sözleşmeleri.  
- STYLE-API-001.md içindeki zorunlu başlık ve alanların script ile
  kontrolü.

-------------------------------------------------------------------------------
## 3. GIVEN / WHEN / THEN SENARYOLARI
-------------------------------------------------------------------------------

- [ ] Senaryo 1 – Tek bir API dokümanı için kontrol:
  - Given: `docs/03-delivery/api/users.api.md` ve STYLE-API-001.md mevcuttur.  
    When: API doküman QA script’i (`check_api_docs.py`) yalnız bu dosya için
    çalıştırılır.  
    Then: Zorunlu başlıklar (Özet, Endpoint’ler, DTO’lar, Status-code &
    ErrorResponse, Security, Linkler) kontrol edilir; eksik bölümler
    okunabilir şekilde raporlanır.

- [ ] Senaryo 2 – Tüm `.api.md` dosyaları için toplu kontrol:
  - Given: `docs/03-delivery/api/*.api.md` altındaki tüm sözleşmeler ve
    STYLE-API-001.md mevcuttur.  
    When: Script global modda çalıştırılır.  
    Then: Her dosya için PASS/FAIL sonucu üretilir; eksik alanlar dosya
    bazında listelenir.

- [ ] Senaryo 3 – İyileştirme sonrası tekrar koşum:
  - Given: İlk çalıştırmada raporlanan eksikler ilgili `.api.md` dosyalarında
    giderilmiştir.  
    When: Script aynı kapsamla yeniden çalıştırılır.  
    Then: Önceden raporlanan eksikler tekrar görünmez; tüm kontrol edilen
    dosyalar PASS durumundadır.

-------------------------------------------------------------------------------
## 4. NOTLAR / KISITLAR
-------------------------------------------------------------------------------

- Bu acceptance, yalnız Markdown API sözleşmelerini kapsar; OpenAPI şemaları
  ve client codegen pipeline’ları ayrı story’lerde ele alınacaktır.  
- Script’in içerik kalitesini (ör. açıklamanın “iyi” yazılıp yazılmadığını)
  değil, yalnız bölüm/alan varlığını ve temel yapıyı kontrol etmesi beklenir.

-------------------------------------------------------------------------------
## 5. ÖZET
-------------------------------------------------------------------------------

- STYLE-API-001 uyum kontrolü script’i, hem tekil hem toplu koşumlarda API
  dokümanlarındaki eksik bölümleri güvenilir şekilde raporlayabiliyorsa bu
  acceptance tamamlanmış sayılır.

-------------------------------------------------------------------------------
## 6. LİNKLER (İSTEĞE BAĞLI)
-------------------------------------------------------------------------------

- Story: docs/03-delivery/STORIES/STORY-0028-api-docs-style-api-001-compliance.md  
- Test Plan: docs/03-delivery/TEST-PLANS/TP-0028-api-docs-style-api-001-compliance.md  

