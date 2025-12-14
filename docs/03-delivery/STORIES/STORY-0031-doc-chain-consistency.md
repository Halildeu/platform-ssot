# STORY-0031 – End-to-end Doc Chain Consistency

ID: STORY-0031-doc-chain-consistency  
Epic: QLTY-DOC-QA  
Status: Planned  
Owner: @team/platform-arch  
Upstream: DOCS-WORKFLOW, DOCS-PROJECT-LAYOUT, NUMARALANDIRMA-STANDARDI  
Downstream: AC-0031, TP-0031

## 1. AMAÇ

- PB → PRD → TECH-DESIGN / ADR → STORY → AC / TP → RUNBOOK / MONITORING /
  RELEASE-NOTES zincirinin uçtan uca tutarlı olmasını sağlamak.  
- Bu zinciri, belirli bir Story ID veya feature için otomatik kontrol eden
  ve eksik halkaları “sonraki adımlar” olarak raporlayan bir kontrol
  mekanizması (ör. `check_doc_chain.py`) tanımlamak.

## 2. TANIM

- Ürün/teknoloji ekibi olarak, her feature için PB/PRD/TECH-DESIGN/ADR/ STORY/AC/TP/RUNBOOK dokümanlarının aynı zincirde görünmesini istiyoruz; böylece sürecin hangi aşamada olduğu herhangi bir anda okunabilir olsun.
- Bir ai agent olarak, verilen bir Story veya feature ID’sinden yola çıkarak hangi upstream/downstream dokümanların eksik olduğunu otomatik görebileyim istiyorum; böylece insan müdahalesine gerek kalmadan eksik şablonları oluşturmak için net bir görev listem olsun.

## 3. KAPSAM VE SINIRLAR

Dahil:
- Belirli bir Story ID veya feature için, aşağıdaki halkalar arasında
  bağlantı kontrolü:  
  - PB (Problem Brief)  
  - PRD  
  - TECH-DESIGN / DATA-MODEL / ADR  
  - STORY / ACCEPTANCE / TEST-PLAN  
  - RUNBOOK / MONITORING / RELEASE-NOTES  
- DOCS-WORKFLOW’deki Discover → Operate aşamalarına göre her halkada
  hangi doküman türlerinin beklenmesi gerektiğinin tanımlanması.  
- Zincirde eksik olan halkaların “şu doküman eksik, şablona göre aç”
  şeklinde raporlanması.

Hariç:
- Gerçek iş önceliklendirme (hangi Story önce alınmalı?)  
- Doküman içeriğinin doğruluğu; içerik kalitesi STORY-0026 ve diğer Doc QA
  story’lerinin kapsamındadır.

## 4. ACCEPTANCE KRİTERLERİ

- [ ] Belirli bir Story ID (örn. STORY-0007) verildiğinde, script
  `check_doc_chain.py STORY-0007` çalıştırıldığında:  
  - Upstream PB/PRD, TECH-DESIGN/ADR ve downstream AC/TP/RUNBOOK için
    beklenen dokümanların varlığı kontrol edilir.  
  - Eksik halkalar okunabilir bir liste halinde raporlanır.

- [ ] Sadece PB/PRD yazılmış ancak Story açılmamış feature’lar (Discover/
  Shape aşamasında kalmış işler) “erken aşama – henüz delivery yok”
  şeklinde işaretlenir.  

- [ ] Tüm zincir halkaları mevcut olan en az bir feature için script
  “eksik yok” çıktısı üretir ve bu feature örnek olarak AC-0031 ve
  TP-0031 içinde belgelenir.

## 5. BAĞIMLILIKLAR

- DOCS-WORKFLOW (Discover → Operate ve doc türleri).  
- DOCS-PROJECT-LAYOUT (klasör yapısı).  
- NUMARALANDIRMA-STANDARDI (ID havuzları).  
- PROJECT-FLOW (Story durum tablosu).  
- Mevcut PB/PRD/TECH-DESIGN/ADR/STORY/AC/TP/RUNBOOK dokümanları.

## 6. ÖZET

- Bu Story, tek bir feature veya Story için tüm doc zincirinin
  (PB’den RUNBOOK’a kadar) eksiksiz ve tutarlı olup olmadığını otomatik
  kontrol edebilen bir mekanizmanın tanımını yapar.  
- Amaç, hem insanlar hem AI agent için “bu iş hangi fazda, hangi
  dokümanlar eksik?” sorusuna hızlı ve standart bir yanıt verebilmektir.

## 7. LİNKLER (İSTEĞE BAĞLI)

- Story: docs/03-delivery/STORIES/STORY-0031-doc-chain-consistency.md  
- Acceptance: docs/03-delivery/ACCEPTANCE/AC-0031-doc-chain-consistency.md  
- Test Plan: `docs/03-delivery/TEST-PLANS/TP-0031-doc-chain-consistency.md`  
