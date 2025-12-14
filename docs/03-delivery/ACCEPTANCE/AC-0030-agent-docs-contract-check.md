# AC-0030 – Agent Docs Contract Check Acceptance

ID: AC-0030  
Story: STORY-0030-agent-docs-contract-check  
Status: Planned  
Owner: @team/platform-arch

-------------------------------------------------------------------------------
## 1. AMAÇ
-------------------------------------------------------------------------------

- Agent ile dokümanlar arasındaki kontratın (dosya yolları, ID’ler, komut
  tipleri) script ile güvenilir şekilde kontrol edilebildiğini doğrulamak.

-------------------------------------------------------------------------------
## 2. KAPSAM
-------------------------------------------------------------------------------

- AGENT-CODEX.* dokümanları.  
- DOCS-WORKFLOW.md, DOCS-PROJECT-LAYOUT.md, NUMARALANDIRMA-STANDARDI.md.  
- CODEX-CONTEXT-TEST-GUIDE.md ve `~/.codex/config.toml`.

-------------------------------------------------------------------------------
## 3. GIVEN / WHEN / THEN SENARYOLARI
-------------------------------------------------------------------------------

- [ ] Senaryo 1 – Eksik veya yanlış path:
  - Given: AGENT-CODEX.docs.md içinde artık var olmayan bir dosya
    referansı olduğunu varsayalım.  
    When: Agent contract script’i (`check_agent_docs_contract.py`) çalıştırılır.  
    Then: Script, bu referansı “geçersiz path” olarak raporlar.

- [ ] Senaryo 2 – Config ile dokümanların uyumu:
  - Given: `~/.codex/config.toml` içindeki `project_doc_fallback_filenames`
    listesi ve ilgili dokümanlar mevcuttur.  
    When: Aynı script çalıştırılır.  
    Then: Tüm listelenen dosyaların varlığı doğrulanır; eksik veya yanlış
    isimlendirilmiş dosya varsa raporlanır.

- [ ] Senaryo 3 – Komut tipleri:
  - Given: AGENT-CODEX.docs ve CODEX-CONTEXT-TEST-GUIDE dokümanlarında
    desteklenen doğal komut tipleri tanımlıdır.  
    When: Script bu tanımları okur.  
    Then: Desteklenen komut seti ile gerçek davranış arasında tutarsızlık
    varsa (ör. dokümanda yazılı ama uygulanmayan bir komut) raporlanır.

-------------------------------------------------------------------------------
## 4. NOTLAR / KISITLAR
-------------------------------------------------------------------------------

- Script içerik kalitesini değil, yalnız dokümanlar arası referans ve
  kontrat uyumunu kontrol eder.  
- `~/.codex/config.toml` yolu ortama göre değişebilir; script bu yolu
  parametre olarak alabilecek şekilde tasarlanmalıdır.

-------------------------------------------------------------------------------
## 5. ÖZET
-------------------------------------------------------------------------------

- Agent docs contract check script’i, core doküman seti ile gerçek dosya
  sistemi/config durumu arasındaki uyumsuzlukları güvenilir şekilde
  raporluyorsa bu acceptance tamamlanmış sayılır.

-------------------------------------------------------------------------------
## 6. LİNKLER (İSTEĞE BAĞLI)
-------------------------------------------------------------------------------

- Story: docs/03-delivery/STORIES/STORY-0030-agent-docs-contract-check.md  
- Test Plan: docs/03-delivery/TEST-PLANS/TP-0030-agent-docs-contract-check.md  

