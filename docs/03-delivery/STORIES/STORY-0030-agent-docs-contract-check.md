# STORY-0030 – Agent Docs Contract Check

ID: STORY-0030-agent-docs-contract-check  
Epic: QLTY-DOC-QA  
Status: Planned  
Owner: @team/platform-arch  
Upstream: AGENT-CODEX.core.md, AGENT-CODEX.docs.md, CODEX-CONTEXT-TEST-GUIDE.md, DOCS-WORKFLOW.md  
Downstream: AC-0030, TP-0030

-------------------------------------------------------------------------------
## 1. AMAÇ
-------------------------------------------------------------------------------

- AGENT-CODEX.* dokümanları, DOCS-WORKFLOW, DOCS-PROJECT-LAYOUT ve
  CODEX-CONTEXT-TEST-GUIDE arasındaki “kontrat”ın (dosya yolları, komut
  türleri, şablon kuralları) tutarlı olmasını sağlamak.  
- Bu kontratı otomatik kontrol eden küçük bir script tanımlayarak, agent
  ile dokümanlar arasındaki uyumsuzlukları erken yakalamak.

-------------------------------------------------------------------------------
## 2. TANIM
-------------------------------------------------------------------------------

- Dokümantasyon/AI‑Ops ekibi olarak, AGENT-CODEX, DOCS-WORKFLOW ve config dokümanlarının her zaman var olan dosyaları ve doğru komut tiplerini referans etmesini istiyoruz; böylece agent yanlış kurallara veya eksik path’lere göre davranmasın.
- Bir ai agent olarak, bu sözleşmenin script ile düzenli kontrol edilmesini istiyorum; böylece dokümanlardaki değişiklikler fark edildiğinde beni uyarabilsin.

-------------------------------------------------------------------------------
## 3. KAPSAM VE SINIRLAR
-------------------------------------------------------------------------------

Dahil:
- AGENT-CODEX.core.md, AGENT-CODEX.docs.md ve diğer AGENT-CODEX.* dosyaları.  
- DOCS-WORKFLOW.md, DOCS-PROJECT-LAYOUT.md, NUMARALANDIRMA-STANDARDI.md.  
- CODEX-CONTEXT-TEST-GUIDE.md ve `~/.codex/config.toml` içindeki
  `project_doc_fallback_filenames` listesi.  
- Bu dokümanlardaki dosya adı, path ve komut tiplerinin (örn. “Bu projeye
  başla”, “Bu projeyi test et”, “Sadece Doc QA çalıştır”) script ile
  kontrol edilmesi.

Hariç:
- Agent’in cevap formatının stil detayları (ör. cümle uzunluğu); bu konular
  AGENT-CODEX.docs’un diğer bölümlerinde ele alınmıştır.  
- İşlevsel testler veya entegrasyon testleri (ayrı TP’lerde ele alınır).

-------------------------------------------------------------------------------
## 4. ACCEPTANCE KRİTERLERİ
-------------------------------------------------------------------------------

- [ ] Script, AGENT-CODEX.* ve DOCS-WORKFLOW içindeki tüm dosya yolu ve
  ID referanslarını okuyup, bu dosyaların gerçekten var olup olmadığını
  kontrol eder.  
- [ ] `~/.codex/config.toml` içindeki `project_doc_fallback_filenames`
  değeri, ilgili dokümanların fiziksel varlığıyla tutarlıdır; eksik veya
  eski dosya adı kalmaz.  
- [ ] Script, desteklenen doğal komut tiplerini (“Bu projeye başla:
  STORY-XXXX”, “Bu projeyi test et: STORY-XXXX / TP-XXXX”, “Sadece Doc QA
  çalıştır”) kontrol eder ve dokümanlarla uyuşmayan bir durum varsa
  raporlar.  
- [ ] Eksikler giderildikten sonra script tekrar çalıştırıldığında aynı
  hatalar görünmez.

-------------------------------------------------------------------------------
## 5. BAĞIMLILIKLAR
-------------------------------------------------------------------------------

- AGENT-CODEX.core.md, AGENT-CODEX.docs.md ve diğer AGENT-CODEX.*  
- docs/00-handbook/DOCS-WORKFLOW.md  
- docs/00-handbook/DOCS-PROJECT-LAYOUT.md  
- NUMARALANDIRMA-STANDARDI.md  
- docs/03-delivery/guides/CODEX-CONTEXT-TEST-GUIDE.md  
- `~/.codex/config.toml`

-------------------------------------------------------------------------------
## 6. ÖZET
-------------------------------------------------------------------------------

- Bu Story ile agent’in dayandığı core doküman seti için otomatik bir
  “kontrat kontrolü” mekanizması kurulmuş olur.  
- Amaç, doküman değişikliklerinin agent davranışını bozmasını engellemek
  ve uyumsuzlukları hızlıca yakalamaktır.

-------------------------------------------------------------------------------
## 7. LİNKLER (İSTEĞE BAĞLI)
-------------------------------------------------------------------------------

- Story: docs/03-delivery/STORIES/STORY-0030-agent-docs-contract-check.md  
- Acceptance: docs/03-delivery/ACCEPTANCE/AC-0030-agent-docs-contract-check.md  
- Test Plan: `docs/03-delivery/TEST-PLANS/TP-0030-agent-docs-contract-check.md`  
