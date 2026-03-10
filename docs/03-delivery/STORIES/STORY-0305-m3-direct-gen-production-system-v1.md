# STORY-0305 – M3 Direct-Gen Üretim Sistemi v1 (BM → Benchmark → Türetme)

ID: STORY-0305-m3-direct-gen-production-system-v1  
Epic: DOCS-PRODUCTION  
Status: Done  
Owner: @team/platform  
Upstream: docs/03-delivery/../00-handbook/DEV-GUIDE.md, docs/03-delivery/../00-handbook/DOCS-WORKFLOW.md, docs/03-delivery/../00-handbook/DOC-MATURITY-RUBRIC.md, docs/03-delivery/SPECS/SPEC-0012-m3-direct-gen-production-system-v1.md  
Downstream: AC-0305, TP-0305

-------------------------------------------------------------------------------
## 1. AMAÇ
-------------------------------------------------------------------------------

- Her konu için aynı mantık ve aynı kalite barıyla çalışan doküman üretim hattını SSOT olarak tanımlamak.
- BM → Benchmark/Trend/GAP → Delivery Pack türetme kural setini netleştirmek (karar/guardrail/ölçüm sinyali).

-------------------------------------------------------------------------------
## 2. TANIM
-------------------------------------------------------------------------------

- Bir dokümantasyon/üretim ekibi olarak, konudan bağımsız tekrarlanabilir bir “üretim hattı” ile production-grade doküman zinciri üretmek istiyorum; böylece belirsizlik ve sürprizler azalır.

-------------------------------------------------------------------------------
## 3. KAPSAM VE SINIRLAR
-------------------------------------------------------------------------------

Dahil:
- `SPEC-0012` ile üretim hattının (BM/Benchmark/Türetme) tanımı.
- M3 kalite standardı (içerik kalitesi kriterleri).
- Repo uyumlu yerleşim kararı (BM/Benchmark için öneri + gate uyumu notu).
- Appendix: etik konusu üzerinden örnek.

Hariç:
- Auto-PR enable/policy değişimi (bu story: dokümantasyon sistemi).
- Kod üretimi entegrasyonu (sonraki story).

Not (Risk/Varsayım):
- Varsayım: BM/BENCH/TRACE örnekleri “exemplar” olarak repo içinde tutulur.
- Risk: SSOT dışı kural değişiklikleri versionlanmazsa (yeni SPEC açılmadan) drift ve sürpriz oranı artar.

-------------------------------------------------------------------------------
## 4. ACCEPTANCE KRİTERLERİ
-------------------------------------------------------------------------------

- [x] Given: `SPEC-0012`, `STORY-0305`, `AC-0305`, `TP-0305` eklidir. When: doc-qa gate koşulur. Then: PASS olmalıdır.
- [x] Given: `SPEC-0012` okunur. When: üretim hattı bölümleri kontrol edilir. Then: BM→Benchmark→Türetme + M3 (6 parça) + türetme kuralları + Appendix A mevcut olmalıdır.
- [x] Given: yerleşim kuralı (RUNBOOKS path). When: BM/Benchmark yerleşim önerisi değerlendirilir. Then: gate ihlali yaratmadan “öneri” olarak dokümante edilmelidir.

-------------------------------------------------------------------------------
## 5. BAĞIMLILIKLAR
-------------------------------------------------------------------------------

- `docs/03-delivery/../00-handbook/DOCS-PROJECT-LAYOUT.md`
- `docs/03-delivery/../00-handbook/DOCS-WORKFLOW.md`
- `docs/03-delivery/../00-handbook/DOC-MATURITY-RUBRIC.md`

-------------------------------------------------------------------------------
## 6. ÖZET
-------------------------------------------------------------------------------

- M3 üretim hattı için tek SSOT: `SPEC-0012`.
- Delivery zinciri: `STORY-0305` ↔ `AC-0305` ↔ `TP-0305`.

-------------------------------------------------------------------------------
## 7. LİNKLER (İSTEĞE BAĞLI)
-------------------------------------------------------------------------------

- SPEC: docs/03-delivery/SPECS/SPEC-0012-m3-direct-gen-production-system-v1.md
- Acceptance: docs/03-delivery/ACCEPTANCE/AC-0305-m3-direct-gen-production-system-v1.md
- Test Plan: docs/03-delivery/TEST-PLANS/TP-0305-m3-direct-gen-production-system-v1.md
- Runbook: docs/04-operations/RUNBOOKS/RB-insansiz-flow.md
