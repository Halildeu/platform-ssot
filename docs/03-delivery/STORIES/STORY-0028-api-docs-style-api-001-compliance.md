# STORY-0028 – API Docs STYLE-API-001 Compliance

ID: STORY-0028-api-docs-style-api-001-compliance  
Epic: QLTY-DOC-QA  
Status: Planned  
Owner: @team/backend  
Upstream: STYLE-API-001.md, STORY-0003-api-docs-refactor, STORY-0004-api-openapi-refactor  
Downstream: AC-0028, TP-0028

-------------------------------------------------------------------------------
## 1. AMAÇ
-------------------------------------------------------------------------------

- Tüm `.api.md` dokümanlarının (users, auth, permission, audit, notification
  vb.) STYLE-API-001 rehberi ile tutarlı olmasını sağlamak.  
- Bu uyumu otomatik kontrol eden ve CI + AI agent tarafından kullanılabilen
  küçük bir Doc QA script’i tanımlamak.

-------------------------------------------------------------------------------
## 2. TANIM
-------------------------------------------------------------------------------

- Bir backend/api docs sorumlusu olarak, tüm API dokümanlarının aynı şablona (başlıklar, DTO listeleri, status-code ve error zarfı, security, linkler) uymasını istiyorum; böylece ekipler yanlış veya eksik sözleşmelerle çalışmasın.
- Bir ai agent olarak, `.api.md` dokümanlarının structure’ının öngörülebilir olmasını istiyorum; böylece bu dokümanlardan güvenilir şekilde senaryo ve test üretebileyim.

-------------------------------------------------------------------------------
## 3. KAPSAM VE SINIRLAR
-------------------------------------------------------------------------------

Dahil:
- `docs/03-delivery/api/*.api.md` altındaki tüm API sözleşmeleri
  (ör. `users.api.md`, `auth.api.md`, `permission.api.md`,
  `audit-events.api.md`, `notification-preferences.api.md`,
  `notification-digest.api.md`).  
- STYLE-API-001.md içindeki zorunlu bölüm ve alanların (başlık yapısı, DTO
  özetleri, status-code listesi, error zarfı, security, linkler) script ile
  kontrol edilmesi.  
- Script çıktısının hem CI pipeline’ında hem de etkileşimli kullanımda
  (Doc QA) “eksikler / yapılacaklar” listesi üretmesi.

Hariç:
- Yeni endpoint tasarımı veya mevcut API davranışının değiştirilmesi.  
- OpenAPI şemalarının ve client codegen pipeline’larının detaylı yönetimi
  (ayrı story’lerde ele alınır).

-------------------------------------------------------------------------------
## 4. ACCEPTANCE KRİTERLERİ
-------------------------------------------------------------------------------

- [ ] En az bir API dokümanı için (örn. `users.api.md`), STYLE-API-001’de
  tanımlanan başlıklar ve alanlar script ile doğrulanır; eksikler raporlanır.  
- [ ] Tüm mevcut `.api.md` dosyaları için script çalıştırıldığında, eksik
  DTO/field listeleri, status-code veya error-response bölümleri açıkça
  listelenir.  
- [ ] Script çıktısı CI’de “fail” / “pass” şeklinde okunabilir; AI agent
  bu çıktıyı kullanarak ilgili API dokümanlarına patch önerileri üretebilir.  
- [ ] Eksikler giderildikten sonra script tekrar çalıştırıldığında aynı
  hatalar görülmez.

-------------------------------------------------------------------------------
## 5. BAĞIMLILIKLAR
-------------------------------------------------------------------------------

- docs/00-handbook/STYLE-API-001.md  
- docs/03-delivery/api/*.api.md  
- STORY-0003-api-docs-refactor, STORY-0004-api-openapi-refactor  
- Mevcut Doc QA altyapısı (STORY-0026, STORY-0027, STORY-0031)  

-------------------------------------------------------------------------------
## 6. ÖZET
-------------------------------------------------------------------------------

- Bu Story ile `.api.md` sözleşmeleri için STYLE-API-001’e uyumu otomatik
  kontrol eden temel bir Doc QA katmanı eklenir.  
- Amaç, hem insanlar hem AI agent için API doküman kalitesini sürekli ve
  görünür kılmaktır.

-------------------------------------------------------------------------------
## 7. LİNKLER (İSTEĞE BAĞLI)
-------------------------------------------------------------------------------

- Spec: docs/00-handbook/STYLE-API-001.md  
- Story: docs/03-delivery/STORIES/STORY-0028-api-docs-style-api-001-compliance.md  
- Acceptance: docs/03-delivery/ACCEPTANCE/AC-0028-api-docs-style-api-001-compliance.md  
- Test Plan: `docs/03-delivery/TEST-PLANS/TP-0028-api-docs-style-api-001-compliance.md`  
