# AC-0003 – API Dokümanlarının Yeni Sisteme Taşınması Acceptance

ID: AC-0003  
Story: STORY-0003-api-docs-refactor  
Status: Done  
Owner: @team/backend

## 1. AMAÇ

- Kullanıcı/auth/permission/audit API dokümanlarının yeni `docs/03-delivery/api/`
  klasörüne taşınmış, STYLE-API-001 ile hizalı ve legacy backend/docs yapısından
  ayrışmış olduğunu doğrulamak.

## 2. KAPSAM

- Yeni API dokümanlarının varlığı ve güncelliği.
- Ortak security/header kurallarının `common-headers.md` ile uyumu.
- API client update rehberinin yeni path’lerle uyumu.

## 3. GIVEN / WHEN / THEN SENARYOLARI

### Genel Kriterler

- [x] Given: Yeni doküman mimarisi (docs/00-handbook, 01–05, 99-templates) tanımlıdır.  
      When: Geliştirici veya agent API sözleşmesi arar.  
      Then: Kullanıcı/auth/permission/audit API dokümanları yalnız
      `docs/03-delivery/api/*.md` altında bulunur; backend/docs legacy dizini
      yalnız tarihçe amaçlıdır.

### Teknik Kriterler

- [x] Given: Legacy API dokümanları `backend/docs/legacy/root/03-delivery/api/*.md`
      altında arşivlenmiştir.  
      When: Yeni docs yapısı incelenir.  
      Then: `docs/03-delivery/api/users.api.md`, `auth.api.md`,
      `permission.api.md`, `audit-events.api.md`, `common-headers.md`
      dosyaları mevcuttur ve STYLE-API-001 rehberine uygun, okunabilir v1
      sözleşmeler içerir.

- [x] Given: Ortak security/header kuralları.  
      When: API dokümanlarındaki güvenlik ve header bölümleri incelenir.  
      Then: Tüm API dokümanları `Authorization: Bearer <jwt>` kullanımı ve
      scope header’ları için `docs/03-delivery/api/common-headers.md` dokümanına
      referans verir.

### Operasyonel Kriterler

- [x] Given: API istemci güncelleme rehberi güncellenmiştir.  
      When: `docs/03-delivery/guides/API_CLIENT_UPDATES.md` incelenir.  
      Then: Referans verdiği API paths `docs/03-delivery/api/*.md` ile
      uyumludur; legacy path’ler yalnız backend/docs/legacy altında tutulur.

- [x] Given: Agent/ekip bir API detayını güncellemek ister.  
      When: `docs/03-delivery/api/*.md` altında doküman üretir/günceller.  
      Then: Yeni dokümanlar isimlendirme ve stil açısından
      `STYLE-API-001.md` + `DOCS-PROJECT-LAYOUT.md` ile uyumlu kalır.

## 4. NOTLAR / KISITLAR

- Bu acceptance yalnız doküman ve path hizalamasını kapsar; OpenAPI şema üretimi
  ve client codegen ayrı story’ler ile ele alınacaktır.

## 5. ÖZET

- API sözleşmeleri yeni `docs/03-delivery/api/` klasöründe STYLE-API-001 ile uyumlu hale getirilmiştir.
- Legacy backend/docs API dokümanları yalnız tarihçe için kullanılmakta, yeni geliştirme için tek referans yeni path’lerdir.

## 6. LİNKLER (İSTEĞE BAĞLI)

- Story: docs/03-delivery/STORIES/STORY-0003-api-docs-refactor.md  
- API Dokümanları: docs/03-delivery/api/*.md  
- Legacy API: backend/docs/legacy/root/03-delivery/api/*.md  
