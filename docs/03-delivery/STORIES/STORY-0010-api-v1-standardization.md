# STORY-0010 – API v1 Standardization

ID: STORY-0010-api-v1-standardization  
Epic: QLTY-API-V1  
Status: Planned  
Owner: @team/platform-arch  
Upstream: QLTY-API-V1-STANDARDIZATION-01 (legacy)  
Downstream: AC-0010, TP-0010

## 1. AMAÇ

Backend servisleri ve frontend istemcilerinin tamamının `/api/v1/**`
path’lerini ve STYLE-API-001 pagination/sort/search/advancedFilter sözleşmesini
tekilleştirmesini sağlamak; PagedResult zarfı, hata modeli (`ErrorResponse`)
ve versiyonlama kurallarını tüm API dokümanlarında güncel hale getirmek.

## 2. TANIM

- Backend geliştiricisi olarak, tüm public REST uçlarının tutarlı bir response zarfı ile `/api/v1/**` altında olmasını istiyorum; böylece API’lar tutarlı ve öngörülebilir olur.
- Frontend geliştiricisi olarak, shared HTTP client’lerin `/api/v1/**` path’leri ve STYLE-API-001 parametre sözleşmesine göre çalışmasını istiyorum; böylece servis katmanı her projede aynı davranışı gösterir.

## 3. KAPSAM VE SINIRLAR

Dahil:
- Servis controller’larında legacy `/api/...` path’lerinin `@Deprecated`
  olarak işaretlenmesi ve v1 uçlarının resmi rota olması (users, roles,
  permissions, variants, auth).
- FE service katmanlarının `@mfe/shared-http` üzerinden `/api/v1/...`
  path’lerini kullanması ve pagination/sort/search parametrelerini
  STYLE-API-001’e göre normalize etmesi.
- API dokümanları (`docs/03-delivery/api/*.md`) ile BACKEND-ARCH-STATUS
  “API Versioning” bölümü ve FRONTEND-ARCH-STATUS “v1 Service Layer Alignment”
  bölümünün güncellenmesi.
- QA/Manual checklist: v1 response zarfı + hata modeli + traceId/headers,
  session-log plan kaydı `[API-V1-STANDARDIZATION-PLAN]`.

Hariç (NON-GOALS):
- Yeni domain endpoint tasarımları (yalnız v1 standardizasyonu kapsar).
- Backend dışı protokoller (gRPC, messaging).

## 4. ACCEPTANCE KRİTERLERİ

- [ ] users/variants/permissions/auth servislerinin yayınlanan uçları
  `/api/v1/**` path’i üzerinden erişilir; legacy path’ler `@Deprecated`
  olarak etiketlenir ve dokümante edilir.  
- [ ] API cevapları `PagedResult` zarfı (`items`, `total`, `page`, `pageSize`)
  ile döner; `sort`, `search`, `advancedFilter` parametreleri STYLE-API-001’deki
  whitelist ile uyumludur.  
- [ ] STYLE-API-001 dokümanında v1 standardizasyonu ve PagedResult
  zorunluluğu açık şekilde belirtilmiş; ilgili STORY referansı eklenmiştir.  

## 5. BAĞIMLILIKLAR

- Legacy QLTY-API-V1-STANDARDIZATION-01 story snapshot’ı  
- Legacy QLTY-API-V1-STANDARDIZATION-01 acceptance snapshot’ı  
- STYLE-API-001: STYLE-API-001.md  
- API README: docs/03-delivery/api/README.md  

## 6. ÖZET

- API v1 standardizasyonu, backend ve frontend tarafında `/api/v1/**`
  path’leri ile tek tip response zarfı + hata modeli kullanımını sağlar.

## 7. LİNKLER (İSTEĞE BAĞLI)

- Acceptance: docs/03-delivery/ACCEPTANCE/AC-0010-api-v1-standardization.md  
- Test Plan: `docs/03-delivery/TEST-PLANS/TP-0010-api-v1-standardization.md`  
