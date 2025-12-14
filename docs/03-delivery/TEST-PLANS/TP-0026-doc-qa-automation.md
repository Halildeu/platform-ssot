# TP-0026 – Doc QA & Template Automation Test Planı

ID: TP-0026  
Story: STORY-0026-doc-qa-automation
Status: In-Progress  
Owner: @team/platform-arch

-------------------------------------------------------------------------------
1. AMAÇ
-------------------------------------------------------------------------------

- Doc QA & Template Automation script’lerinin AC-0026’da tanımlanan temel
  davranışları karşıladığını doğrulamak.

-------------------------------------------------------------------------------
2. KAPSAM
-------------------------------------------------------------------------------

- Şablon kontrol script’i (STORY/AC/TP/RUNBOOK).  
- ID kontrol script’i (benzersizlik ve dosya adı ↔ ID uyumu).  

-------------------------------------------------------------------------------
3. STRATEJİ
-------------------------------------------------------------------------------

- Mevcut doküman seti üzerinde script’leri çalıştırıp sonuçlarını incelemek.  
- Bilerek bozulmuş örnek dosyalar üzerinde script’lerin hata yakalayıp
  yakalamadığını test etmek.
- Etkileşimli senaryo: Script çıktısına göre dokümanları Codex ile birlikte
  güncellemek ve script’leri tekrar çalıştırarak hataların temizlendiğini
  doğrulamak.

-------------------------------------------------------------------------------
4. TEST SENARYOLARI ÖZETİ
-------------------------------------------------------------------------------

- [x] Şablonları doğru olan dokümanlar için “OK” çıktısı alınması.  
- [x] Başlığı eksik/yanlış olan bir dokümanda hatanın raporlanması.  
- [x] ID’si dosya adıyla uyuşmayan bir dokümanda hatanın raporlanması.  

-------------------------------------------------------------------------------
5. ÇEVRE VE ARAÇLAR
-------------------------------------------------------------------------------

- Python 3 çalışma ortamı.  
- `scripts/check_doc_templates.py` ve ileride eklenecek diğer QA script’leri.  

-------------------------------------------------------------------------------
6. RİSKLER / ÖNCELİKLER
-------------------------------------------------------------------------------

- Script’lerin çok katı olması veya false positive üretmesi durumunda
  geliştirici deneyimi olumsuz etkilenebilir.  

-------------------------------------------------------------------------------
7. ÖZET
-------------------------------------------------------------------------------

- Bu test planı, Doc QA & Template Automation altyapısının temel senaryolarda
  beklendiği gibi çalıştığını doğrular.

-------------------------------------------------------------------------------
8. LİNKLER (İSTEĞE BAĞLI)
-------------------------------------------------------------------------------

- Story: docs/03-delivery/STORIES/STORY-0026-doc-qa-automation.md  
- Acceptance: docs/03-delivery/ACCEPTANCE/AC-0026-doc-qa-automation.md  
