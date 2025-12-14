# TEST-PLAN – Theme Runtime Integration (Docs Migration)

ID: TP-0038  
Story: STORY-0038-theme-runtime-integration
Status: Done  
Owner: @team/frontend

Not: Aşağıdaki başlıklar ve sıralama **zorunludur**. Yeni bir Test Plan
yazılırken bu H2 başlıkları ve numaraları bire bir korunmalı; agent sadece
bu başlıkların altını doldurabilir.

-------------------------------------------------------------------------------
## 1. AMAÇ
-------------------------------------------------------------------------------

- Theme runtime entegrasyonuna ilişkin governance zincirinin eksiksiz
  oluşturulduğunu test etmek.

-------------------------------------------------------------------------------
## 2. KAPSAM
-------------------------------------------------------------------------------

- STORY-0038 / AC-0038 metinlerinin Theme Runtime Integration kararlarını
  eksiksiz ve tutarlı şekilde özetlemesi.  
- PROJECT-FLOW satırında STORY-0038 için doğru Epic/SPEC/Acceptance
  bilgilerinin görünmesi.

-------------------------------------------------------------------------------
## 3. STRATEJİ
-------------------------------------------------------------------------------

- Yeni STORY/AC metinlerinin Theme Runtime Integration kararlarını kapsayıp
  kapsamadığının gözden geçirilmesi.  
- Script tabanlı doğrulama:
  - `python3 scripts/check_doc_templates.py`
  - `python3 scripts/check_doc_ids.py`
  - `python3 scripts/check_story_links.py`
  - `python3 scripts/check_doc_chain.py`
  - `python3 scripts/check_governance_migration.py`

-------------------------------------------------------------------------------
## 4. TEST SENARYOLARI ÖZETİ
-------------------------------------------------------------------------------

- [x] PROJECT-FLOW satırı STORY-0038 için doğru Epic/SPEC/Acceptance
  alanlarını içerir.  
- [x] Governance migration script’i çalıştırıldığında E03-S02 ID’si zaten
  “unmigrated” listesinden düşmüş olarak görünür.

-------------------------------------------------------------------------------
## 5. ÇEVRE VE ARAÇLAR
-------------------------------------------------------------------------------

- python3, Git diff araçları, doc QA script seti.  
