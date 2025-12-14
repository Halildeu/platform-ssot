# TEST-PLAN – Theme & Layout System v1.0 (Docs Migration)

ID: TP-0037  
Story: STORY-0037-theme-layout-system-v1
Status: Done  
Owner: @team/frontend

Not: Aşağıdaki başlıklar ve sıralama **zorunludur**. Yeni bir Test Plan
yazılırken bu H2 başlıkları ve numaraları bire bir korunmalı; agent sadece
bu başlıkların altını doldurabilir.

-------------------------------------------------------------------------------
## 1. AMAÇ
-------------------------------------------------------------------------------

- Theme & Layout System v1.0 ile ilgili governance içeriğinin yeni
  doküman zincirinde eksiksiz temsil edildiğini test etmek.

-------------------------------------------------------------------------------
## 2. KAPSAM
-------------------------------------------------------------------------------

- STORY-0037 / AC-0037 metinlerinin Theme & Layout System v1.0 kararlarını
  tam ve tutarlı şekilde özetlemesi.  
- PROJECT-FLOW satırının STORY-0037 için güncel olması.  

-------------------------------------------------------------------------------
## 3. STRATEJİ
-------------------------------------------------------------------------------

- Metin kontrolü: Yeni STORY/AC/TP zincirinde amaç/kapsam/başarı kriterlerinin
  Theme & Layout System v1.0 kararlarını karşıladığının gözden geçirilmesi.  
- Script kontrollü doğrulama:
  - `python3 scripts/check_doc_templates.py`
  - `python3 scripts/check_doc_ids.py`
  - `python3 scripts/check_story_links.py`
  - `python3 scripts/check_doc_chain.py`
  - `python3 scripts/check_governance_migration.py`

-------------------------------------------------------------------------------
## 4. TEST SENARYOLARI ÖZETİ
-------------------------------------------------------------------------------

- [x] PROJECT-FLOW satırı E03-S01 ID’sini içerir ve doğru STORY/AC/TP
  zincirine bağlanır.  
- [x] STORY-0037 ve AC-0037 metinleri Theme & Layout System v1.0 için
  kritik kararları eksiksiz özetler.  
- [x] Governance migration script’i çalıştırıldığında E03-S01 ID’si zaten
  “unmigrated” listesinden düşmüş olarak görünür.

-------------------------------------------------------------------------------
## 5. ÇEVRE VE ARAÇLAR
-------------------------------------------------------------------------------

- python3 (doc QA script’leri için).  
