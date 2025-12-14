# STORY-0033 – Auth REST/DTO v1 Migration

ID: STORY-0033-auth-rest-dto-v1  
Epic: QLTY-REST-AUTH  
Status: Done  
Owner: @team/backend  
Upstream: STYLE-API-001.md, DOCS-WORKFLOW.md  
Downstream: AC-0033, TP-0033

-------------------------------------------------------------------------------
## 1. AMAÇ
-------------------------------------------------------------------------------

- Auth servisinde `/api/v1/auth/**` path’leri ve DTO tabanlı modelin
  devreye alınmasını, legacy auth uçlarının ise deprecated edilmesini
  dokümante etmek.  
- Login, kayıt, şifre sıfırlama ve e‑posta doğrulama akışlarının ortak bir
  ErrorResponse şeması ile çalışmasını sağlamak.

-------------------------------------------------------------------------------
## 2. TANIM
-------------------------------------------------------------------------------

- Backend ekibi olarak, kimlik doğrulama akışlarının v1 REST path’leri altında standardize olmasını istiyoruz; böylece FE/MFE ve diğer servisler tek bir sözleşmeye bağlı kalabilsin.
- Bir api tüketicisi olarak, login/kayıt/şifre işlemlerinde açık hata kodları ve izlenebilir JSON yapısı istiyorum; böylece problemleri hızlıca teşhis edebileyim.

-------------------------------------------------------------------------------
## 3. KAPSAM VE SINIRLAR
-------------------------------------------------------------------------------

Dahil:
- `/api/v1/auth/sessions`, `/registrations`, `/password-resets`,
  `/password-resets/{token}`, `/email-verifications/{token}` uçları.  
- DTO’ların `...Dto` standardına göre düzenlenmesi ve ErrorResponse yapısı.  
- `docs/03-delivery/api/auth.api.md` dokümanının v1/legacy ayrımını ve hata
  modelini içermesi.

Hariç:
- Keycloak/IdP tarafındaki derin yapılandırma değişiklikleri.  
- Yetkilendirme (authorization) kapsam/genişletme işleri (ayrı Story’ler ile
  yönetilir).

-------------------------------------------------------------------------------
## 4. ACCEPTANCE KRİTERLERİ
-------------------------------------------------------------------------------

- [x] `/api/v1/auth/*` uçları login, kayıt, şifre sıfırlama ve e‑posta
  doğrulama akışlarını kapsar.  
- [x] Legacy `/api/auth/*` uçları geriye dönük uyumluluk için çalışır ancak
  dokümantasyonda deprecated olarak işaretlenmiştir.  
- [x] Başarısız login/işlemler ErrorResponse şeması ile JSON döner ve
  `meta.traceId` alanı taşır.  
- [x] `docs/03-delivery/api/auth.api.md` v1 path’leri, legacy uçları ve hata
  modelini açıkça belgelemektedir.

-------------------------------------------------------------------------------
## 5. BAĞIMLILIKLAR
-------------------------------------------------------------------------------

- docs/00-handbook/STYLE-API-001.md  
- docs/03-delivery/api/auth.api.md  
- docs/03-delivery/api/common-headers.md  
- İlgili backend testleri (`AuthControllerV1Test` vb.)

-------------------------------------------------------------------------------
## 6. ÖZET
-------------------------------------------------------------------------------

- Auth REST/DTO v1 geçişi, yeni docs yapısında STORY/AC/TP ve API dokümanları
  ile izlenebilir hale getirilmiştir; legacy path’ler kontrollü şekilde
  deprecated edilmiştir.

-------------------------------------------------------------------------------
## 7. LİNKLER (İSTEĞE BAĞLI)
-------------------------------------------------------------------------------

- Story: docs/03-delivery/STORIES/STORY-0033-auth-rest-dto-v1.md  
- Acceptance: docs/03-delivery/ACCEPTANCE/AC-0033-auth-rest-dto-v1.md  
- Test Plan: `docs/03-delivery/TEST-PLANS/TP-0033-auth-rest-dto-v1.md`  
- API: docs/03-delivery/api/auth.api.md  
