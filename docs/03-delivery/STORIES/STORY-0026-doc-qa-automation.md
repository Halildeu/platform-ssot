# STORY-0026 – Doc QA & Template Automation

ID: STORY-0026-doc-qa-automation  
Epic: QLTY-DOC-QA  
Status: Done  
Owner: @team/platform-arch  
Upstream: DOCS-WORKFLOW, NUMARALANDIRMA-STANDARDI  
Downstream: AC-0026, TP-0026

## 1. AMAÇ

Doküman şablonları, ID kuralları ve STORY/AC/TP/RUNBOOK zincirinin otomatik
olarak denetlenmesi için Doc QA & Template Automation altyapısını kurmak;
elle yapılan format/kural kontrollerini script’lere devrederek kaliteyi
ve hızını artırmak.

## 2. TANIM

- Ekip olarak, doküman kalitesi ve şablon uyumunun otomatik doğrulanmasını istiyoruz; böylece elle kontrol ve gözden kaçan hatalar minimuma insin.
- Bir ai agent olarak, dokümanların her zaman aynı yapıda olmasını istiyorum; böylece dokümanları hızlı ve güvenilir şekilde okuyup kullanabileyim.

## 3. KAPSAM VE SINIRLAR

Dahil:
- Şablon uyum kontrolü (STORY/AC/TP/RUNBOOK) için script’ler.  
- ID benzersizliği ve dosya adı ↔ `ID:` meta uyumu için kontroller.  
- STORY/AC/TP ↔ PROJECT-FLOW tutarlılığını kontrol eden script’ler.  
- API dokümanları için STYLE-API-001’e uyum kontrolleri (temel seviye).
- Script çıktılarının hem CI ortamında hem de etkileşimli kullanımda
  (geliştirici + AI agent birlikte) adım listesi olarak kullanılması.

Hariç:
- Her projeye özel, tamamen farklı doküman formatları; yalnız mevcut
  standart şablonlar kapsamdadır.

## 4. ACCEPTANCE KRİTERLERİ

- [ ] En az bir script STORY/AC/TP/RUNBOOK için şablon başlıklarını ve
  `ID:` meta satırını kontrol eder (ör. `check_doc_templates.py`).  
- [ ] ID benzersizliği ve dosya adı ↔ ID uyumu için temel kontrol
  script’i hazırdır.  
- [ ] STORY/AC/TP ↔ PROJECT-FLOW bağlantılarını doğrulayan script için
  iskelet oluşturulmuştur.  

## 5. BAĞIMLILIKLAR

- DOCS-WORKFLOW ve NUMARALANDIRMA-STANDARDI kuralları.  
- PROJECT-FLOW ve mevcut STORY/AC/TP/RUNBOOK dokümanları.  

## 6. ÖZET

- Bu Story ile doküman kalitesi için temel otomasyon altyapısı kurulacak
  ve sonraki fazlarda genişletilebilecek bir Doc QA projesi başlatılacaktır.

## 7. LİNKLER (İSTEĞE BAĞLI)

- Acceptance: docs/03-delivery/ACCEPTANCE/AC-0026-doc-qa-automation.md  
- Test Plan: `docs/03-delivery/TEST-PLANS/TP-0026-doc-qa-automation.md`  
