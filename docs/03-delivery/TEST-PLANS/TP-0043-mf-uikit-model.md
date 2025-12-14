# TEST-PLAN – MF UI Kit Model Unification (Docs Migration)

ID: TP-0043  
Story: STORY-0043-mf-uikit-model
Status: Planned  
Owner: @team/frontend

Not: Aşağıdaki başlıklar ve sıralama **zorunludur**. Yeni bir Test Plan
yazılırken bu H2 başlıkları ve numaraları bire bir korunmalı; agent sadece
bu başlıkların altını doldurabilir.

-------------------------------------------------------------------------------
## 1. AMAÇ
-------------------------------------------------------------------------------

- MF UI Kit modeline ilişkin governance zincirinin eksiksiz
  oluşturulduğunu test etmek.

-------------------------------------------------------------------------------
## 2. KAPSAM
-------------------------------------------------------------------------------

- STORY-0043 / AC-0043 metinlerinin MF UI Kit modeline dair kararları
  eksiksiz ve tutarlı şekilde özetlemesi.  
- PROJECT-FLOW satırında QLTY-MF-UIKIT-01 / QLTY-MF-UIKIT-01- alias
  ID’lerinin STORY-0043 ile eşleşmesi.

-------------------------------------------------------------------------------
## 3. STRATEJİ
-------------------------------------------------------------------------------

- Yeni STORY/AC metinlerinin UI Kit modeline dair governance kararlarını
  kapsayıp kapsamadığını gözden geçirmek.  
- Script tabanlı doğrulama:
  - `python3 scripts/check_doc_templates.py`
  - `python3 scripts/check_doc_ids.py`
  - `python3 scripts/check_story_links.py`
  - `python3 scripts/check_doc_chain.py`
  - `python3 scripts/check_governance_migration.py`

-------------------------------------------------------------------------------
## 4. TEST SENARYOLARI ÖZETİ
-------------------------------------------------------------------------------

- [ ] PROJECT-FLOW satırında QLTY-MF-UIKIT-01 alias ID’leri görünür ve
  STORY-0043 / AC-0043 / TP-0101 zinciriyle eşleşir.  
- [ ] Governance migration script’i çalıştırıldığında QLTY-MF-UIKIT-01
  ve alias ID’leri “unmigrated” listesinde yer almaz.

-------------------------------------------------------------------------------
## 5. ÇEVRE VE ARAÇLAR
-------------------------------------------------------------------------------

- python3, Git diff, doc QA script’leri.  
