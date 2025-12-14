# TP-0004 – API OpenAPI & Client Artefact Refactor Test Planı

ID: TP-0004  
Story: STORY-0004-api-openapi-refactor
Status: Done  
Owner: @team/backend

-------------------------------------------------------------------------------
1. AMAÇ
-------------------------------------------------------------------------------

- OpenAPI şemaları, Markdown API dokümanları ve client örneklerinin
  birbirleriyle ve STYLE-API-001 ile uyumlu olduğunu doğrulamak.

-------------------------------------------------------------------------------
2. KAPSAM
-------------------------------------------------------------------------------

- `docs/03-delivery/api/openapi/*.yaml`
- `docs/03-delivery/api/*.md`
- `docs/03-delivery/api/client-examples/**`

-------------------------------------------------------------------------------
3. STRATEJİ
-------------------------------------------------------------------------------

- Statik kontrol:
  - OpenAPI path ve method’larının `.md` dokümanları ile eşleşmesi.
  - Status code açıklamalarının uyumu.
- Örnek istekler:
  - Client örneklerini kullanarak birkaç temel akışın (login, users list, role
    assign, audit list) manuel test edilmesi.

-------------------------------------------------------------------------------
4. TEST SENARYOLARI ÖZETİ
-------------------------------------------------------------------------------

- [x] OpenAPI vs `.md` path seti karşılaştırması (users/permission; auth/audit
      OpenAPI kapsamı ileride genişletilebilir).  
- [x] Ortak header kullanımının (`common-headers.md`) OpenAPI’deki security
      şemaları ile uyuşması.  
- [x] Client örnekleri ile en az bir happy path akışının her API için dokümante
      edilmesi (ör. login + users list + role assign + audit events).  
- [x] Eski OpenAPI dosyalarının backend/docs/legacy/** altında arşivlenmiş
      olması (doğrudan kullanılmıyor).  

-------------------------------------------------------------------------------
5. LİNKLER
-------------------------------------------------------------------------------

- Story: docs/03-delivery/STORIES/STORY-0004-api-openapi-refactor.md  
- Acceptance: docs/03-delivery/ACCEPTANCE/AC-0004-api-openapi-refactor.md  
- API Dokümanları: docs/03-delivery/api/*.md  
