# STORY-0003 – API Dokümanlarının Yeni Sisteme Taşınması

ID: STORY-0003-api-docs-refactor  
Epic: QLTY-API-Docs  
Status: Done  
Owner: @team/backend  
Upstream: (legacy) QLTY-REST-USER-01, QLTY-REST-AUTH-01, QLTY-01-S3-API-Style-Guide-Rollout  
Downstream: AC-0003, docs/03-delivery/api/*.md, TP-0003

## 1. AMAÇ

Backend’e ait kullanıcı, auth, permission ve audit API sözleşmelerinin
`backend/docs/legacy/root/03-delivery/api/**` altındaki eski yerleşimden
çıkarılıp yeni `docs/03-delivery/api/` klasörü altında, STYLE-API-001 ve
NUMARALANDIRMA standardı ile uyumlu tek kaynak haline getirilmesi.

## 2. TANIM

- Bir backend dokümantasyon sorumlusu olarak, all users/auth/permission/audit API sözleşmelerinin yeni `docs/03-delivery/api/` altında toplanmasını istiyorum; böylece tek ve güncel bir API referansım olsun.
- Bir tüketici (fe/3rd‑party) olarak, legacy path’ler yerine yeni API dokümanlarını kullanmak istiyorum; böylece yanlış veya eski sözleşmelere bakmayayım.

## 3. KAPSAM VE SINIRLAR

Dahil:
- Mevcut API dokümanlarının (`users.api.md`, `auth.api.md`, `permission.api.md`,
  `audit-events.api.md`, `common-headers.md`) en güncel halinin yeni docs/
  hiyerarşisinde tanımlanması.
- `docs/03-delivery/guides/GUIDE-0001-api-client-updates.md` ve ilgili backend/front-end
  rehberlerinin yeni path’lerle çalışır hale getirilmesi.
- Legacy API dokümanlarının `backend/docs/legacy/**` altında arşiv olarak
  korunması; yeni geliştirme için yalnız `docs/03-delivery/api/*.md` dizisinin
  referans alınması.

Hariç:
- Yeni business endpoint tasarımı (bu story yalnız doküman taşıma ve hizalama
  işini kapsar).
- OpenAPI şema üretimi ve client codegen (ileride ayrı story ile ele alınır).

## 4. ACCEPTANCE KRİTERLERİ

- [x] `docs/03-delivery/api/users.api.md`, `auth.api.md`, `permission.api.md`,
  `audit-events.api.md`, `common-headers.md` dosyaları STYLE-API-001 rehberi
  ile uyumlu, okunabilir ve günceldir.
- [x] FE/BE ve 3rd‑party entegrasyon dokümanları `docs/03-delivery/api/*.md`
  path’lerini referans gösterir; legacy path’lere yalnız tarihçe amaçlı link
  verilir.
- [x] API istemci güncelleme rehberi (`API_CLIENT_UPDATES`) ve ilgili tech-design
  dokümanları yeni path’lerle hizalanmıştır.

## 5. BAĞIMLILIKLAR

- STYLE-API-001.md  
- Legacy API dokümanları (`backend/docs/legacy/root/03-delivery/api/*.md`)  
- İlgili TECH-DESIGN dokümanları ve AC-0003 / TP-0003

- Eski API dokümanlarındaki bazı detaylar (özellikle örnekler ve edge-case
  açıklamaları) özetleme sırasında kaybolabilir; ihtiyaç halinde legacy
  dokümanlara referans verilmelidir.
- OpenAPI şemaları ve Postman/Insomnia koleksiyonları henüz yeni yapıya
  taşınmamıştır; bu story yalnız Markdown API sözleşmelerini kapsar.

## 6. ÖZET

- Eski API sözleşmeleri yeni `docs/03-delivery/api/` altında STYLE-API-001 ile hizalanmıştır.
- Legacy dokümanlar tarihçe için saklanmış, yeni geliştirme için tek referans yeni klasör olmuştur.

## 7. LİNKLER (İSTEĞE BAĞLI)

- Acceptance: docs/03-delivery/ACCEPTANCE/AC-0003-api-docs-refactor.md  
- Test Plan: `docs/03-delivery/TEST-PLANS/TP-0003-api-docs-refactor.md`  
- API Dokümanları: docs/03-delivery/api/*.md  
