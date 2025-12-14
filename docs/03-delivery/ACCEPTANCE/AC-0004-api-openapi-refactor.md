# AC-0004 – API OpenAPI & Client Artefact Refactor Acceptance

ID: AC-0004  
Story: STORY-0004-api-openapi-refactor  
Status: Done  
Owner: @team/backend

## 1. AMAÇ

- OpenAPI şemaları ve client artefact’lerin (Postman/Insomnia/curl) yeni
  `docs/03-delivery/api/openapi/` ve `client-examples/` klasörlerine taşınmış,
  STYLE-API-001 ve NUMARALANDIRMA-STANDARDI ile uyumlu olduğunu doğrulamak.

## 2. KAPSAM

- `docs/03-delivery/api/openapi/*.yaml` OpenAPI şemaları.
- `docs/03-delivery/api/client-examples/` altındaki client koleksiyonları.
- `.md` API dokümanları ile OpenAPI şemaları arasındaki tutarlılık.

## 3. GIVEN / WHEN / THEN SENARYOLARI

### Genel Kriterler

- [x] Given: STYLE-API-001 ve NUMARALANDIRMA-STANDARDI.md okunmuştur.  
      When: Geliştirici veya agent API/OpenAPI dokümanlarını incelemek ister.  
      Then: Tüm güncel API şemaları ve istemci örnekleri `docs/` hiyerarşisi
      altında bulunur; backend/docs yalnız legacy arşividir.

### Teknik Kriterler

- [x] Given: `docs/03-delivery/api` klasör yapısı oluşturulmuştur.  
      When: OpenAPI şemaları kontrol edilir.  
      Then: `docs/03-delivery/api/openapi/*.yaml` altında kullanıcı ve
      permission API’ları için şemalar bulunur (users.yaml, permission.yaml).

- [x] Given: API istemci örnekleri mevcuttur.  
      When: Client koleksiyonları kontrol edilir.  
      Then: Postman/Insomnia/curl örnekleri
      `docs/03-delivery/api/client-examples/` altında bulunur.

- [x] Given: API `.md` dokümanları oluşturulmuştur.  
      When: `docs/03-delivery/api/*.md` ile OpenAPI şemaları karşılaştırılır.  
      Then: v1 path’leri ve ana veri zarfı (PagedResult / ErrorResponse)
      açısından OpenAPI ve `.md` dokümanları aynı domain modelini temsil eder;
      legacy path’ler OpenAPI veya `.md` içinde ayrıca “Legacy” olarak
      işaretlenmiştir.

### Operasyonel Kriterler

- [x] Given: Mühendisler API sözleşmesini güncellemek ister.  
      When: `docs/03-delivery/api/*.md` ve OpenAPI şemaları güncellenir.  
      Then: Eski `backend/docs/legacy/root/03-delivery/api/**` dosyaları
      yalnız tarihçe için kullanılır; README’de yeni adresler açıkça belirtilir.

## 4. NOTLAR / KISITLAR

- Bu acceptance yalnız OpenAPI ve client artefact’lerin yeni klasöre taşınmasını
  ve dokümanlarla hizalanmasını kapsar; endpoint davranış değişiklikleri kapsam dışıdır.

## 5. ÖZET

- OpenAPI şemaları ve client örnekleri yeni klasörlere taşınmış, `.md` API dokümanları ile tutarlı hale getirilmiştir.
- Legacy içerikler arşivlenmiş, yeni geliştirmeler için docs/ altında tek bir sistem oluşturulmuştur.

## 6. LİNKLER (İSTEĞE BAĞLI)

- Story: docs/03-delivery/STORIES/STORY-0004-api-openapi-refactor.md  
- Test Plan (ileride): docs/03-delivery/TEST-PLANS/TP-0004-api-openapi-refactor.md  
- API Dokümanları: docs/03-delivery/api/*.md  
