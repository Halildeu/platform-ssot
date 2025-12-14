# TEST-PLAN – Theme Overlay & Grid Tone (Docs Migration)

ID: TP-0039  
Story: STORY-0039-theme-overlay-and-grid-tone
Status: Done  
Owner: @team/frontend

Not: Aşağıdaki başlıklar ve sıralama **zorunludur**. Yeni bir Test Plan
yazılırken bu H2 başlıkları ve numaraları bire bir korunmalı; agent sadece
bu başlıkların altını doldurabilir.

-------------------------------------------------------------------------------
## 1. AMAÇ
-------------------------------------------------------------------------------

- Theme overlay ve grid yüzey tonu ile ilgili governance zincirinin
  eksiksiz oluşturulduğunu test etmek.

-------------------------------------------------------------------------------
## 2. KAPSAM
-------------------------------------------------------------------------------

- STORY-0039 / AC-0039 metinlerinin tema overlay ve grid yüzey tonu
  kararlarını eksiksiz özetlemesi.  
- PROJECT-FLOW satırında STORY-0039 için doğru Epic/SPEC/Acceptance
  bilgilerinin görünmesi.

-------------------------------------------------------------------------------
## 3. STRATEJİ
-------------------------------------------------------------------------------

- STORY ve ACCEPTANCE metinlerinin overlay ve grid yüzey tonu ile ilgili
  governance kararlarını kapsayıp kapsamadığının gözden geçirilmesi.  
- Script tabanlı doğrulama:
  - `python3 scripts/check_doc_templates.py`
  - `python3 scripts/check_doc_ids.py`
  - `python3 scripts/check_story_links.py`
  - `python3 scripts/check_doc_chain.py`
  - `python3 scripts/check_governance_migration.py`

-------------------------------------------------------------------------------
## 4. TEST SENARYOLARI ÖZETİ
-------------------------------------------------------------------------------

- [x] PROJECT-FLOW satırında STORY-0039 için doğru Epic/SPEC/Acceptance
  alanları görünür.  
- [x] Governance migration script’i çalıştırıldığında E03-S03 ID’si zaten
  “unmigrated” listesinden düşmüş olarak görünür.

-------------------------------------------------------------------------------
## 5. ÇEVRE VE ARAÇLAR
-------------------------------------------------------------------------------

- python3, Git diff, doc QA script’leri.  
