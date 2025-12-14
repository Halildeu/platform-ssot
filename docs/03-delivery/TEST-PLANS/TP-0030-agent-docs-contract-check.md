# TEST-PLAN – Agent Docs Contract Check

ID: TP-0030  
Story: STORY-0030-agent-docs-contract-check
Status: Planned  
Owner: @team/platform-arch

Not: Aşağıdaki başlıklar ve sıralama **zorunludur**. Yeni bir Test Plan
yazılırken bu H2 başlıkları ve numaraları bire bir korunmalı; agent sadece
bu başlıkların altını doldurabilir.

-------------------------------------------------------------------------------
## 1. AMAÇ
-------------------------------------------------------------------------------

- Agent docs contract kontrol script’inin AC-0030’da tanımlanan senaryolara
  göre doğru çalıştığını doğrulamak.

-------------------------------------------------------------------------------
## 2. KAPSAM
-------------------------------------------------------------------------------

- AGENT-CODEX.* dokümanları, DOCS-WORKFLOW, DOCS-PROJECT-LAYOUT,
  NUMARALANDIRMA-STANDARDI.  
- CODEX-CONTEXT-TEST-GUIDE.md ve `~/.codex/config.toml`.

-------------------------------------------------------------------------------
## 3. STRATEJİ
-------------------------------------------------------------------------------

- Bilerek küçük path/ID hataları ekleyerek script’in bunları yakalayıp
  yakalamadığını gözlemlemek.  
- Gerçek config ve doküman seti üzerinde script’i çalıştırıp, raporlanan
  eksiklerin mantıklı ve eyleme dönük olduğunu doğrulamak.  
- Script çıktılarını CI veya etkileşimli Doc QA kullanımına bağlamak
  (örneğin “eksik doküman” → yeni Story/AC/TP önerisi).

-------------------------------------------------------------------------------
## 4. TEST SENARYOLARI ÖZETİ
-------------------------------------------------------------------------------

- [ ] Yanlış path/ID içeren agent dokümanları için hata raporu.  
- [ ] Config ile fiziksel doküman listesi arasındaki uyumsuzlukların
  yakalanması.  
- [ ] Gerçek ortamda “sıfır hata” durumu doğrulaması.

-------------------------------------------------------------------------------
## 5. ÇEVRE VE ARAÇLAR
-------------------------------------------------------------------------------

- Python 3 çalışma ortamı.  
- `scripts/check_agent_docs_contract.py` (veya eşdeğer agent kontrat script’i).  
- İlgili dokümanlar ve `~/.codex/config.toml`.

-------------------------------------------------------------------------------
## 6. RİSKLER / ÖNCELİKLER
-------------------------------------------------------------------------------

- Script’in ortam bağımlılıklarını (özellikle config yolu) doğru
  yönetememesi; farklı makinelerde farklı davranış.  
- Fazla karmaşık kontrollerin yanlış pozitif/negatif üretmesi.

-------------------------------------------------------------------------------
## 7. ÖZET
-------------------------------------------------------------------------------

- Bu test planı, agent docs contract check script’inin core doküman seti
  ile config arasındaki uyumsuzlukları güvenilir ve tekrarlanabilir şekilde
  raporlayabildiğini doğrular.

-------------------------------------------------------------------------------
## 8. LİNKLER (İSTEĞE BAĞLI)
-------------------------------------------------------------------------------

- Story: docs/03-delivery/STORIES/STORY-0030-agent-docs-contract-check.md  
- Acceptance: docs/03-delivery/ACCEPTANCE/AC-0030-agent-docs-contract-check.md  

