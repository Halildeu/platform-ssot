# AC-0031 – End-to-end Doc Chain Consistency Acceptance

ID: AC-0031  
Story: STORY-0031-doc-chain-consistency  
Status: Done  
Owner: @team/platform-arch

-------------------------------------------------------------------------------
1. AMAÇ
-------------------------------------------------------------------------------

- PB → PRD → TECH-DESIGN / ADR → STORY → AC / TP → RUNBOOK zincirinin,
  tanımlanan kurallara göre script ile doğrulanabildiğini test edilebilir
  şekilde tanımlamak.

-------------------------------------------------------------------------------
2. KAPSAM
-------------------------------------------------------------------------------

- Örnek bir veya birkaç feature/Story için tüm doc zinciri.  
- PROJECT-FLOW’da bulunan Story’ler ve upstream/downstream dokümanları.  

-------------------------------------------------------------------------------
3. GIVEN / WHEN / THEN SENARYOLARI
-------------------------------------------------------------------------------

- [x] Senaryo 1 – Eksiksiz zincir:  
  Given: PB, PRD, TECH-DESIGN, ADR, STORY, AC, TP ve RUNBOOK dokümanları
  tanımlı bir örnek feature vardır.  
    When: `check_doc_chain.py` ilgili Story ID ile çalıştırılır.  
    Then: Script bu feature için “eksik doküman yok” sonucunu üretir.

- [x] Senaryo 2 – Eksik downstream (RUNBOOK/TP):  
  Given: PB, PRD, TECH-DESIGN ve STORY dokümanları mevcut, ancak RUNBOOK
  veya TP henüz yazılmamıştır.  
    When: `check_doc_chain.py` aynı Story ID ile çalıştırılır.  
    Then: Çıktıda eksik halkalar (“RUNBOOK eksik”, “TP eksik”) net olarak
    listelenir.

- [x] Senaryo 3 – Sadece PB/PRD olan işler:  
  Given: Sadece PB ve PRD yazılmış, henüz Story açılmamış feature’lar
  vardır.  
    When: `check_doc_chain.py` PB/PRD havuzu için çalıştırılır.  
    Then: Bu işler “Discover/Shape aşamasında, henüz delivery zincirine
    geçmemiş” olarak işaretlenir.

-------------------------------------------------------------------------------
4. NOTLAR / KISITLAR
-------------------------------------------------------------------------------

- Script, doküman içeriğinin doğruluğunu değil yalnızca zincirin
  **varlığını ve temel referans bağlantılarını** kontrol eder.  
- İçerik kalitesi ve şablon uyumu STORY-0026/AC-0026/TP-0031 kapsamındadır.

-------------------------------------------------------------------------------
5. ÖZET
-------------------------------------------------------------------------------

- `check_doc_chain.py` veya eşdeğer mekanizma, örnek feature’lar üzerinde
  tüm doc zincirini güvenilir şekilde analiz edebiliyorsa ve eksik halkaları
  net biçimde raporluyorsa bu acceptance tamamlanmış sayılır.
- 2026-03-09 global çalıştırmasında mevcut STORY zincirleri için hata
  üretilmemiş ve mekanizma PASS vermiştir.

-------------------------------------------------------------------------------
6. LİNKLER (İSTEĞE BAĞLI)
-------------------------------------------------------------------------------

- Story: docs/03-delivery/STORIES/STORY-0031-doc-chain-consistency.md  
- Test Plan: docs/03-delivery/TEST-PLANS/TP-0031-doc-chain-consistency.md  
