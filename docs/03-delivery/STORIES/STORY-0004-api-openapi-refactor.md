# STORY-0004 – API OpenAPI & Client Artefact Refactor

ID: STORY-0004-api-openapi-refactor  
Epic: API  
Status: Done  
Owner: @team/backend  
Upstream: PRD-000X-api-hardening (varsayım)  
Downstream: AC-0004, TP-0004

## 1. AMAÇ

Legacy OpenAPI dosyalarını, Postman/Insomnia koleksiyonlarını ve client örneklerini
kurulan yeni doküman mimarisi ile uyumlu hale getirmek; STYLE-API-001 ve
NUMARALANDIRMA-STANDARDI’ne uygun, tek bir API doküman sistemi oluşturmak.

## 2. TANIM

- Backend ekibi olarak, OpenAPI şemaları, client koleksiyonları ve örnek çağrıların yeni docs yapısında (`openapi/` + `client-examples/`) toplanmasını istiyoruz; böylece API tüketicileri için tek ve tutarlı bir referans seti olsun.
- Bir entegratör/client olarak, updated OpenAPI ve client örneklerine tek yerden erişmek istiyorum; böylece entegrasyonlarımı güncel sözleşmelere göre güvenle kurabileyim.

## 3. KAPSAM VE SINIRLAR

Dahil:
- OpenAPI şemalarının `docs/03-delivery/api/openapi/` altına taşınması.
- İstemci örneklerinin (`curl`, Postman, Insomnia)  
  `docs/03-delivery/api/client-examples/` altına alınması.
- Ortak header/kimlik doğrulama standartlarının `STYLE-API-001.md` ile
  hizalanması.
- API dokümanları (users/auth/permission/audit) ile OpenAPI arasında
  path/response/error zarfı açısından tutarlılık sağlanması.

Hariç:
- Yeni business endpoint tasarımı veya mevcut kontratların davranışsal
  değiştirilmesi (bu story yalnız doküman ve şema hizalama işini kapsar).

## 4. ACCEPTANCE KRİTERLERİ

- [x] Tüm uçlar `STYLE-API-001`’e göre adlandırılmış ve `/api/v1/**` versiyon
  şemasını kullanmaktadır.
- [x] Path, response ve error zarfı yapısı OpenAPI dosyaları ve
  `docs/03-delivery/api/*.md` API dokümanlarında birebir aynıdır.
- [x] Eski OpenAPI ve client dosyaları `backend/docs/legacy/**` altında arşiv
  olarak korunmaktadır.

## 5. BAĞIMLILIKLAR

- STYLE-API-001.md ve INTERFACE-CONTRACT şablonları  
- Legacy OpenAPI ve client koleksiyonları (`backend/docs/legacy/**`)  
- AC-0004, TP-0004 ve ilgili TECH-DESIGN / API dokümanları

## 6. ÖZET

- OpenAPI şemaları ve client örnekleri yeni `openapi/` ve `client-examples/` klasörlerine taşınmış ve STYLE-API-001 ile hizalanmıştır.
- Eski şema ve koleksiyonlar arşivlenmiş, STORY-0004 akışı PROJECT-FLOW’da tamamlanmıştır.

## 7. LİNKLER (İSTEĞE BAĞLI)

- Acceptance: docs/03-delivery/ACCEPTANCE/AC-0004-api-openapi-refactor.md  
- Test Plan: `docs/03-delivery/TEST-PLANS/TP-0004-api-openapi-refactor.md`  
