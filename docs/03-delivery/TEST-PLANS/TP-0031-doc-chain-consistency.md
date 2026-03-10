# TEST-PLAN – Test Planı Şablonu

ID: TP-0031  
Story: STORY-0031-doc-chain-consistency
Status: Done  
Owner: @team/platform-arch

Not: Aşağıdaki başlıklar ve sıralama **zorunludur**. Yeni bir Test Plan
yazılırken bu H2 başlıkları ve numaraları bire bir korunmalı; agent sadece
bu başlıkların altını doldurabilir.

-------------------------------------------------------------------------------
1. AMAÇ
-------------------------------------------------------------------------------

- End-to-end doküman zinciri kontrol mekanizmasının (örn. `check_doc_chain.py`)
  AC-0031’de tanımlanan senaryolara göre doğru çalıştığını doğrulamak.

-------------------------------------------------------------------------------
2. KAPSAM
-------------------------------------------------------------------------------

- Örnek bir veya birkaç feature/Story için PB/PRD/TECH-DESIGN/ADR/STORY/
  AC/TP/RUNBOOK dokümanları.  
- Sadece PB/PRD’ye sahip, henüz Story açılmamış işler.

-------------------------------------------------------------------------------
3. STRATEJİ
-------------------------------------------------------------------------------

- En az bir “tam zincir” feature seçip, script’i bu Story ID ile
  çalıştırmak ve “eksik yok” çıktısını doğrulamak.  
- Eksik downstream halkaları (ör. RUNBOOK veya TP) olan bir feature
  seçip, script’in bu eksikleri doğru raporladığını kontrol etmek.  
- Sadece PB/PRD’ye sahip işler için script’i çalıştırıp, bunların
  “Discover/Shape aşamasında” olarak işaretlenmesini doğrulamak.  
- Gerektiğinde bilerek eksik/yanlış referanslar içeren küçük örnekler
  oluşturup script’in hata üretip üretmediğini gözlemlemek.

-------------------------------------------------------------------------------
4. TEST SENARYOLARI ÖZETİ
-------------------------------------------------------------------------------

- [x] Tam zincir feature için “eksik yok” çıktısı.  
- [x] Eksik RUNBOOK/TP olan feature için eksik halkaların raporlanması.  
- [x] Sadece PB/PRD’ye sahip işler için “erken aşama” etiketi.  
- [x] Yanlış ID veya yanlış referans içeren dokümanlar için hata
  çıktısı.

-------------------------------------------------------------------------------
5. ÇEVRE VE ARAÇLAR
-------------------------------------------------------------------------------

- Python 3 çalışma ortamı.  
- `scripts/check_doc_chain.py` (veya eşdeğer doc chain kontrol script’i).  
- Mevcut docs/ hiyerarşisi.

-------------------------------------------------------------------------------
6. RİSKLER / ÖNCELİKLER
-------------------------------------------------------------------------------

- Script’in çok karmaşık hale gelmesi ve yanlış pozitif/negatif sonuçlar
  üretmesi, geliştirici deneyimini zorlaştırabilir.  
- DOCS-WORKFLOW veya klasör yapısında değişiklik olduğunda script’in
  güncellenmesi gerekir.

-------------------------------------------------------------------------------
7. ÖZET
-------------------------------------------------------------------------------

- Bu test planı, uçtan uca doküman zinciri kontrolünün temel senaryolarda
  beklendiği gibi çalıştığını ve eksik halkaları güvenilir şekilde
  raporlayabildiğini doğrular.
- 2026-03-09 itibarıyla `python3 scripts/check_doc_chain.py` global PASS
  sonucu vermiştir.

-------------------------------------------------------------------------------
8. LİNKLER (İSTEĞE BAĞLI)
-------------------------------------------------------------------------------

- Story: docs/03-delivery/STORIES/STORY-0031-doc-chain-consistency.md  
- Acceptance: docs/03-delivery/ACCEPTANCE/AC-0031-doc-chain-consistency.md  
