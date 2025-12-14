# STORY-0032 – User REST/DTO v1 Migration

ID: STORY-0032-user-rest-dto-v1  
Epic: QLTY-REST-USER  
Status: Done  
Owner: @team/backend  
Upstream: STYLE-API-001.md, DOCS-WORKFLOW.md  
Downstream: AC-0032, TP-0032

-------------------------------------------------------------------------------
## 1. AMAÇ
-------------------------------------------------------------------------------

- User servisinde v1 REST path’lerinin (`/api/v1/users/**`) ve DTO isimlendirme
  standartlarının devreye alınmasını, legacy uçların ise kontrollü şekilde
  deprecated edilmesini dokümante etmek.  
- Yeni REST/DTO modelinin hem API dokümanları (`users.api.md`) hem de testler
  üzerinden izlenebilir olmasını sağlamak.

-------------------------------------------------------------------------------
## 2. TANIM
-------------------------------------------------------------------------------

- Backend ekibi olarak, kullanıcı listeleme/detay/aktivasyon uçlarının `/api/v1/users/**` altında tek ve tutarlı bir sözleşmeyle çalışmasını istiyoruz; böylece FE ve diğer servisler legacy path’lere bağımlı kalmasın.
- Bir api tüketicisi olarak, deterministik sayfalama, whitelist’li `advancedFilter` ve açık hata modeli istiyorum; böylece karmaşık aramalarda bile öngörülebilir sonuçlar alayım.

-------------------------------------------------------------------------------
## 3. KAPSAM VE SINIRLAR
-------------------------------------------------------------------------------

Dahil:
- `/api/v1/users` listeleme uçları (PagedResult zarfı: `items/total/page/pageSize`).  
- `/api/v1/users/{id}`, `/api/v1/users/by-email` detay uçları.  
- `/api/v1/users/{id}/activation` uçları ile aktif/pasif işaretleme.  
- `docs/03-delivery/api/users.api.md` dokümanının STYLE-API-001 ile uyumlu
  v1/legacy ayrımını içermesi.

Hariç:
- Yeni business özellikleri (ek alanlar, yeni filtreler vb.).  
- Backend iç mimarideki derin refaktörler (örneğin repository katmanı).

-------------------------------------------------------------------------------
## 4. ACCEPTANCE KRİTERLERİ
-------------------------------------------------------------------------------

- [x] `/api/v1/users` uçları deterministik sayfalama ve whitelist’li
  `advancedFilter/sort` sözleşmesine uyar.  
- [x] `/api/v1/users/{id}` ve `/by-email` uçları beklenen DTO’ları döner.  
- [x] `/api/v1/users/{id}/activation` uçları kullanıcıyı aktif/pasif
  işaretler; audit bilgisi üretilir.  
- [x] Legacy `/api/users/*` uçları geriye dönük uyumluluk için çalışır ama
  dokümantasyonda deprecated olarak işaretlidir.  
- [x] `docs/03-delivery/api/users.api.md` v1/legacy ayrımı, hata modeli ve
  bağlantıları içerir.

-------------------------------------------------------------------------------
## 5. BAĞIMLILIKLAR
-------------------------------------------------------------------------------

- docs/00-handbook/STYLE-API-001.md  
- docs/03-delivery/api/users.api.md  
- docs/02-architecture/services/user-service/TECH-DESIGN-user-service-overview.md  
- İlgili backend testleri (`UserControllerV1Test` vb.)

-------------------------------------------------------------------------------
## 6. ÖZET
-------------------------------------------------------------------------------

- User REST/DTO v1 geçişi yeni docs yapısında STORY/AC/TP ve API dokümanları
  ile izlenebilir hale getirilmiştir.  
- Legacy path’ler kontrollü şekilde deprecated edilmiştir; yeni geliştirme
  için tek referans v1 uçlarıdır.

-------------------------------------------------------------------------------
## 7. LİNKLER (İSTEĞE BAĞLI)
-------------------------------------------------------------------------------

- Story: docs/03-delivery/STORIES/STORY-0032-user-rest-dto-v1.md  
- Acceptance: docs/03-delivery/ACCEPTANCE/AC-0032-user-rest-dto-v1.md  
- Test Plan: `docs/03-delivery/TEST-PLANS/TP-0032-user-rest-dto-v1.md`  
- API: docs/03-delivery/api/users.api.md  
- TECH-DESIGN: docs/02-architecture/services/user-service/TECH-DESIGN-user-service-overview.md  
