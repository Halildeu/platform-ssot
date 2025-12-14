# AC-0010 – API v1 Standardization Acceptance

ID: AC-0010  
Story: STORY-0010-api-v1-standardization  
Status: Planned  
Owner: @team/platform-arch

## 1. AMAÇ

- API v1 standardizasyonunun (path, zarf, hata modeli) QLTY-API-V1-STANDARDIZATION-01
  gereksinimlerini karşıladığını test edilebilir kriterlerle doğrulamak.

## 2. KAPSAM

- `/api/v1/**` path standardı.
- `PagedResult` zarfı ve `ErrorResponse` hata modeli.
- STYLE-API-001 ve mimari doküman güncellemeleri.

## 3. GIVEN / WHEN / THEN SENARYOLARI

- [ ] Senaryo 1 – v1 path standardı:
  - Given: users, variants, permissions, auth servisleri için v1 controller’lar
    tanımlanmıştır.  
    When: İstemci `/api/v1/**` path’lerine istek gönderir.  
    Then: Tüm yayınlanan uçlar v1 path’leri üzerinden çalışır; legacy path’ler
    `@Deprecated` olarak etiketlenmiş ve API dokümanlarında işaretlenmiştir.

- [ ] Senaryo 2 – PagedResult ve parametre sözleşmesi:
  - Given: Listeleme uçları PagedResult zarfı ve STYLE-API-001 parametre
    sözleşmesi ile güncellenmiştir.  
    When: Listeleme istekleri `page/size/sort/search/advancedFilter` parametreleri
    ile yapılır.  
    Then: Cevaplar `items/total/page/pageSize` zarfını kullanır ve yalnız whitelist
    edilen parametreler kabul edilir.

- [ ] Senaryo 3 – Doküman ve mimari güncellemeler:
  - Given: STYLE-API-001, backend ve frontend architecture dokümanları güncellenmemiştir.  
    When: API v1 standardizasyonu tamamlanır.  
    Then: STYLE-API-001’de PagedResult ve v1 standardı açıkça belirtilmiş,
    BACKEND-ARCH-STATUS “API Versioning” ve FRONTEND-ARCH-STATUS “v1 Service
    Layer Alignment” bölümleri güncellenmiş, PROJECT_FLOW ve session-log
    kayıtları işlenmiştir.

## 4. NOTLAR / KISITLAR

- Detaylı senaryolar ve otomasyon akışları TP-0010 test planında listelenecektir.

## 5. ÖZET

- `/api/v1/**` path standardı, PagedResult zarfı ve ErrorResponse hata modeli
  tüm ana servislerde tutarlı biçimde uygulanmıştır.

## 6. LİNKLER (İSTEĞE BAĞLI)

- Story: docs/03-delivery/STORIES/STORY-0010-api-v1-standardization.md  
- Test Plan: docs/03-delivery/TEST-PLANS/TP-0010-api-v1-standardization.md  
- Legacy Acceptance: backend/docs/legacy/root/05-governance/07-acceptance/QLTY-API-V1-STANDARDIZATION-01.acceptance.md  

