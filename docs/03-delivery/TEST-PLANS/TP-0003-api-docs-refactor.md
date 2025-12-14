# TP-0003 – API Dokümanlarının Yeni Sisteme Taşınması Test Planı

ID: TP-0003  
Story: STORY-0003-api-docs-refactor
Status: Done  
Owner: @team/backend

-------------------------------------------------------------------------------
1. AMAÇ
-------------------------------------------------------------------------------

- `docs/03-delivery/api/*.md` altına taşınan API sözleşmelerinin (users/auth/permission/audit)
  STYLE-API-001 ile uyumlu, okunabilir ve güncel olduğunu doğrulamak.
- Legacy `backend/docs/legacy/**` referanslarının günlük kullanım için gerekmeyecek
  seviyede azaltıldığını ve yeni `docs/` ağacının tek kaynak olduğunu teyit etmek.

-------------------------------------------------------------------------------
2. KAPSAM
-------------------------------------------------------------------------------

- `docs/03-delivery/api/users.api.md`
- `docs/03-delivery/api/auth.api.md`
- `docs/03-delivery/api/permission.api.md`
- `docs/03-delivery/api/audit-events.api.md`
- `docs/03-delivery/api/common-headers.md`

-------------------------------------------------------------------------------
3. STRATEJİ
-------------------------------------------------------------------------------

- Doküman kalitesi / format:
  - Bölüm başlıkları, DTO ve status-code bölümleri STYLE-API-001 ile uyumlu mu?
- Link / yerleşim:
  - `docs/03-delivery/api/README.md` ve ilgili rehberler yeni path’lere işaret ediyor mu?
- Negatif kontroller:
  - Eski/yanlış path’lere doküman içinde referans kalmış mı? (`backend/docs/**`)

-------------------------------------------------------------------------------
4. TEST SENARYOLARI ÖZETİ
-------------------------------------------------------------------------------

- [x] `docs/03-delivery/api/*.api.md` dosyaları mevcut ve okunabilir.  
- [x] `common-headers.md` tüm API sözleşmelerinde referanslanır.  
- [x] Legacy path referansları yalnız tarihçe amaçlıdır (günlük kullanım için şart değildir).  
- [x] `docs/03-delivery/guides/API_CLIENT_UPDATES.md` yeni path’lerle uyumludur.  

-------------------------------------------------------------------------------
5. ÇEVRE VE ARAÇLAR
-------------------------------------------------------------------------------

- `rg "backend/docs" docs` (legacy referansları hızlı taramak için)
- `python3 scripts/check_api_docs.py` (varsa) + Doc QA script seti

-------------------------------------------------------------------------------
6. RİSKLER / ÖNCELİKLER
-------------------------------------------------------------------------------

- En kritik risk:
  - FE/3rd‑party ekiplerin yanlış/legacy sözleşmeye bakması.
- Öncelik:
  - `users/auth/permission/audit` sözleşmelerinin tek kaynak olması.

-------------------------------------------------------------------------------
7. ÖZET
-------------------------------------------------------------------------------

- Bu test planı, API doküman taşıma işinin “tek kaynak + stil uyumu” hedefini
  doğrular.

-------------------------------------------------------------------------------
8. LİNKLER (İSTEĞE BAĞLI)
-------------------------------------------------------------------------------

- Story: docs/03-delivery/STORIES/STORY-0003-api-docs-refactor.md  
- Acceptance: docs/03-delivery/ACCEPTANCE/AC-0003-api-docs-refactor.md  
- API Dokümanları: docs/03-delivery/api/*.md  
