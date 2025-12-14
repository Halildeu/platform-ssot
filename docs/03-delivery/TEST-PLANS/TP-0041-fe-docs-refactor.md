# TP-0041 – FE Dokümanları Refaktör Test Planı

ID: TP-0041  
Story: STORY-0041-fe-docs-refactor
Status: Planned  
Owner: @team/frontend

-------------------------------------------------------------------------------
## 1. AMAÇ
-------------------------------------------------------------------------------

- FE dokümantasyon refaktörünün, AC-0041’de tanımlanan kriterleri ve
  Doc QA script’lerinin beklentilerini sağladığını doğrulamak.

-------------------------------------------------------------------------------
## 2. KAPSAM
-------------------------------------------------------------------------------

- `docs/00-handbook/WEB-PROJECT-LAYOUT.md`, `STYLE-WEB-001.md`.  
- `docs/02-architecture/clients/WEB-ARCH.md`.  
- `docs/03-delivery/guides/**` altında FE ile ilgili rehberler.  
- `web/docs/**` altında kalan legacy FE dokümanları (sadece referans).

-------------------------------------------------------------------------------
## 3. STRATEJİ
-------------------------------------------------------------------------------

- Doc QA script’leri ile format ve ID kontrolleri:
  - `python3 scripts/check_doc_templates.py`
  - `python3 scripts/check_doc_ids.py`
  - `python3 scripts/check_story_links.py`
  - `python3 scripts/check_doc_chain.py`
  - `python3 scripts/check_governance_migration.py`
- Elle doğrulama:
  - Frontend mimari/stil rehberine erişim: yalnız `docs/` altında mı?  
  - WEB-ARCH.md, WEB-PROJECT-LAYOUT.md ve STYLE-WEB-001.md içindeki
    linkler çalışıyor mu?

-------------------------------------------------------------------------------
## 4. TEST SENARYOLARI ÖZETİ
-------------------------------------------------------------------------------

- [ ] Geliştirici, “frontend mimarisi” için yalnız `docs/02-architecture/clients/WEB-ARCH.md`
      ve `WEB-PROJECT-LAYOUT.md` dokümanlarına bakarak ana yapıyı anlayabiliyor.  
- [ ] Doc QA script’leri FE dokümanları için de hatasız çalışıyor.  
- [ ] `web/docs` altındaki dokümanlar, WEB-ARCH.md içinde linklenen
      “legacy/detay” kaynaklar olarak görülebiliyor.

-------------------------------------------------------------------------------
## 5. ÇEVRE VE ARAÇLAR
-------------------------------------------------------------------------------

- Python 3, Doc QA script’leri.  
- Metin arama için `rg`, diff için Git araçları.  

-------------------------------------------------------------------------------
## 6. ÖZET
-------------------------------------------------------------------------------

- Bu test planı, FE dokümantasyonunun backend tarafında olduğu gibi yeni
  `docs/` mimarisine taşındığını ve Doc QA altyapısıyla uyumlu çalıştığını
  doğrular.

