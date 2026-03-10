# TEST-PLAN – Agent Docs Contract Check

ID: TP-0030  
Story: STORY-0030-agent-docs-contract-check
Status: Done  
Owner: @team/platform-arch

Not: Aşağıdaki başlıklar ve sıralama **zorunludur**. Yeni bir Test Plan
yazılırken bu H2 başlıkları ve numaraları bire bir korunmalı; agent sadece
bu başlıkların altını doldurabilir.

-------------------------------------------------------------------------------
## 1. AMAÇ
-------------------------------------------------------------------------------

- Authority marker kontrolü ve transition reference consumer raporunun
  AC-0030’daki senaryolara göre doğru çalıştığını doğrulamak.

-------------------------------------------------------------------------------
## 2. KAPSAM
-------------------------------------------------------------------------------

- `AGENTS.md`, `AGENT-CODEX.*`, kritik handbook girişleri ve seçili
  runbook’lar.  
- `scripts/check_transition_authority_map.py` ve
  `scripts/report_transition_reference_consumers.py`.  
- `doc-qa.yml`.

-------------------------------------------------------------------------------
## 3. STRATEJİ
-------------------------------------------------------------------------------

- Gerçek repo durumu üzerinde authority marker check’i çalıştırıp beklenen
  `OK` sonucunu doğrulamak.  
- Transition reference consumer raporunu üretip sayımların ve top consumer
  listesinin okunabilir olduğunu kontrol etmek.  
- Aynı komutları `doc-qa.yml` içinde koşturulabilir hale getirmek.

-------------------------------------------------------------------------------
## 4. TEST SENARYOLARI ÖZETİ
-------------------------------------------------------------------------------

- [x] Authority marker check için `OK` sonucu.  
- [x] Transition consumer JSON/Markdown rapor üretimi.  
- [x] Workflow entegrasyonu doğrulaması.

-------------------------------------------------------------------------------
## 5. ÇEVRE VE ARAÇLAR
-------------------------------------------------------------------------------

- Python 3 çalışma ortamı.  
- `scripts/check_transition_authority_map.py`  
- `scripts/report_transition_reference_consumers.py`  
- İlgili dokümanlar ve `doc-qa.yml`

-------------------------------------------------------------------------------
## 6. RİSKLER / ÖNCELİKLER
-------------------------------------------------------------------------------

- Tüketici raporunun bir kısmı kontrol scriptlerinin kendi string
  sabitlerinden etkilenebilir.  
- Referans sayısının fazla olması tek başına hata değildir; cleanup sırası
  ayrıca yorumlanmalıdır.

-------------------------------------------------------------------------------
## 7. ÖZET
-------------------------------------------------------------------------------

- Bu test planı, authority marker kontrolü ile transition reference consumer
  raporunun güvenilir ve tekrarlanabilir biçimde çalıştığını doğrular.

-------------------------------------------------------------------------------
## 8. LİNKLER (İSTEĞE BAĞLI)
-------------------------------------------------------------------------------

- Story: docs/03-delivery/STORIES/STORY-0030-agent-docs-contract-check.md  
- Acceptance: docs/03-delivery/ACCEPTANCE/AC-0030-agent-docs-contract-check.md  
