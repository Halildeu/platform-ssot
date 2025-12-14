# TP-0023 – AuthZ Company Scope Filter Test Planı

ID: TP-0023  
Story: STORY-0023-authz-company-scope-filter
Status: Planned  
Owner: @team/backend

-------------------------------------------------------------------------------
1. AMAÇ
-------------------------------------------------------------------------------

- Company scope filtresi için tanımlanan acceptance kriterlerinin sağlandığını
  test etmek.

-------------------------------------------------------------------------------
2. KAPSAM
-------------------------------------------------------------------------------

- Company scope bazlı veri erişimi ve API çağrıları.

-------------------------------------------------------------------------------
3. STRATEJİ
-------------------------------------------------------------------------------

- Unit/integration testleri ile filtre davranışını doğrulama.  
- Örnek kullanıcı/company kombinasyonlarıyla senaryo testleri.

-------------------------------------------------------------------------------
4. TEST SENARYOLARI ÖZETİ
-------------------------------------------------------------------------------

- [ ] Yetkili company için veri erişimi.  
- [ ] Yetkisiz company için erişim reddi.  

-------------------------------------------------------------------------------
5. ÇEVRE VE ARAÇLAR
-------------------------------------------------------------------------------

- Backend test/stage ortamları, test veri setleri.  

-------------------------------------------------------------------------------
6. RİSKLER / ÖNCELİKLER
-------------------------------------------------------------------------------

- Yanlış filtreleme sonucu fazla/gizli verinin açığa çıkması.

-------------------------------------------------------------------------------
7. ÖZET
-------------------------------------------------------------------------------

- Bu test planı, company scope filtresinin temel güvenlik ve iş gereksinimlerini
  doğrular.

-------------------------------------------------------------------------------
8. LİNKLER (İSTEĞE BAĞLI)
-------------------------------------------------------------------------------

- Story: docs/03-delivery/STORIES/STORY-0023-authz-company-scope-filter.md  
- Acceptance: docs/03-delivery/ACCEPTANCE/AC-0023-authz-company-scope-filter.md  

