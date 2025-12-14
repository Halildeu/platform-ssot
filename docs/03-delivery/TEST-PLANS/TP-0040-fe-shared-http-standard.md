# TEST-PLAN – FE Shared HTTP Standard (Docs Migration)

ID: TP-0040  
Story: STORY-0040-fe-shared-http-standard
Status: Planned  
Owner: @team/frontend

Not: Aşağıdaki başlıklar ve sıralama **zorunludur**. Yeni bir Test Plan
yazılırken bu H2 başlıkları ve numaraları bire bir korunmalı; agent sadece
bu başlıkların altını doldurabilir.

-------------------------------------------------------------------------------
## 1. AMAÇ
-------------------------------------------------------------------------------

- Shared HTTP standardına ilişkin governance zincirinin eksiksiz
  oluşturulduğunu test etmek.

-------------------------------------------------------------------------------
## 2. KAPSAM
-------------------------------------------------------------------------------

- STORY-0040 / AC-0040 metinlerinin FE Shared HTTP standardını eksiksiz
  ve tutarlı şekilde özetlemesi.  
- PROJECT-FLOW satırında QLTY-FE-SHARED-HTTP-01 alias ID’sinin
  STORY-0040 ile eşleşmesi.

-------------------------------------------------------------------------------
## 3. STRATEJİ
-------------------------------------------------------------------------------

- Yeni STORY/AC metinlerinin shared HTTP kararlarını kapsayıp kapsamadığını
  gözden geçirmek.  
- Script tabanlı doğrulama:
  - `python3 scripts/check_doc_templates.py`
  - `python3 scripts/check_doc_ids.py`
  - `python3 scripts/check_story_links.py`
  - `python3 scripts/check_doc_chain.py`
  - `python3 scripts/check_governance_migration.py`

-------------------------------------------------------------------------------
## 4. TEST SENARYOLARI ÖZETİ
-------------------------------------------------------------------------------

- [ ] PROJECT-FLOW satırında QLTY-FE-SHARED-HTTP-01 alias ID’si görünür ve
  STORY-0040 / AC-0040 / TP-0101 zinciriyle eşleşir.  
- [ ] Governance migration script’i çalıştırıldığında QLTY-FE-SHARED-HTTP-01
  ID’si “unmigrated” listesinde yer almaz.

-------------------------------------------------------------------------------
## 5. ÇEVRE VE ARAÇLAR
-------------------------------------------------------------------------------

- python3, Git diff, doc QA script’leri.  
