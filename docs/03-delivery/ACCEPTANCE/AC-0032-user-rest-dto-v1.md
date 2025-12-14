# AC-0032 – User REST/DTO v1 Migration Acceptance

ID: AC-0032  
Story: STORY-0032-user-rest-dto-v1  
Status: Planned  
Owner: @team/backend

-------------------------------------------------------------------------------
## 1. AMAÇ
-------------------------------------------------------------------------------

- User servisinde v1 REST/DTO geçişinin işlevsel ve dokümantasyon açısından
  beklendiği gibi tamamlandığını test edilebilir kriterlerle doğrulamak.

-------------------------------------------------------------------------------
## 2. KAPSAM
-------------------------------------------------------------------------------

- `/api/v1/users/**` uçları.  
- Legacy `/api/users/*` uçları (deprecated mod).  
- `docs/03-delivery/api/users.api.md` API dokümanı.

-------------------------------------------------------------------------------
## 3. GIVEN / WHEN / THEN SENARYOLARI
-------------------------------------------------------------------------------

- [ ] Senaryo 1 – Listeleme zarfı:
  - Given: Sistemde yeterli sayıda kullanıcı kaydı vardır.  
    When: `GET /api/v1/users?page=1&pageSize=50` çağrılır.  
    Then: Yanıt `items/total/page/pageSize` alanlarını içerir ve sonuçlar
    deterministiktir.

- [ ] Senaryo 2 – Advanced filter:
  - Given: Geçerli `advancedFilter` ile filtrelenebilir kullanıcılar vardır.  
    When: `advancedFilter` whitelist içindeki alanlarla çağrılır.  
    Then: Yanıt yalnız filtreye uyan kullanıcıları döner; whitelist dışı
    alan kullanılırsa 400 `invalid_advanced_filter` döner.

- [ ] Senaryo 3 – Detay ve aktivasyon:
  - Given: Aktif bir kullanıcı ve pasif bir kullanıcı mevcuttur.  
    When: `/api/v1/users/{id}` ve `/activation` uçları kullanılır.  
    Then: DTO alanları dokümantasyondaki şema ile uyumludur; aktivasyon
    isteği kullanıcının durumunu günceller.

- [ ] Senaryo 4 – Legacy uçlar:
  - Given: Eski FE veya entegrasyonlar legacy `/api/users/*` uçlarını kullanmaktadır.  
    When: Bu uçlara istek gönderilir.  
    Then: Uçlar çalışmaya devam eder ama log’larda/deprecated header’larda
    v1 path’lerin tercih edilmesi gerektiği belirtilir.

-------------------------------------------------------------------------------
## 4. NOTLAR / KISITLAR
-------------------------------------------------------------------------------

- Performans ve edge case senaryoları TP-0032 test planında ayrıntılı
  olarak listelenmelidir.  
- Legacy uçlar için tamamen kapatma kararı alınırsa ayrı bir Story ile
  yönetilmelidir.

-------------------------------------------------------------------------------
## 5. ÖZET
-------------------------------------------------------------------------------

- User REST/DTO v1 geçişi, hem yeni v1 path’ler hem de legacy uyumluluk
  açısından güvenilir kabul kriterleriyle doğrulandığında bu acceptance
  tamamlanmış sayılır.

-------------------------------------------------------------------------------
## 6. LİNKLER (İSTEĞE BAĞLI)
-------------------------------------------------------------------------------

- Story: docs/03-delivery/STORIES/STORY-0032-user-rest-dto-v1.md  
- Test Plan: docs/03-delivery/TEST-PLANS/TP-0032-user-rest-dto-v1.md  

