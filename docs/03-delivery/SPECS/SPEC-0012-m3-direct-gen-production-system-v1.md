# SPEC-0012 – M3 Direct-Gen Üretim Sistemi v1 (BM → Benchmark → Türetme)

ID: SPEC-0012  
Status: Draft  
Owner: TBD

## 1. AMAÇ

Her konu için aynı mantık ve aynı kalite barıyla çalışan üretim hattı kurmak:
**Business Master Doc (BM) → Benchmark/Trend/GAP → Delivery Pack türetme**.

Hedef:
- Codex’in production-grade kod üretmesi için gereken kritik detayları tek bir zincirde toplamak.
- “Sürpriz” oranını düşürmek (net kararlar, guardrail’ler, ölçüm sinyalleri).

## 2. ÜRETİM HATTI (3 FAZ)

### 2.1 Faz 1: Business Master Doc (BM)

BM bir “işletilebilir sözleşme”tir. Her bölümde aşağıdakiler bulunur:
- Karar: E/H (açık, tek anlamlı)
- Guardrail: sınır, istisna, “asla yapma”
- Ölçüm sinyali: KPI/KRI, log/metric, audit işareti

Kurallar:
- Varsayım uydurulmaz: **Varsayımlar + Doğrulama Planı** zorunlu.
- “Top 10 sürpriz önleyici liste” zorunlu.
- Claim Map + M3 Rubrik denetimi zorunlu.

### 2.2 Faz 2: Benchmark / Trend / GAP

Bu faz “yazı” değil, kararları besleyen yapılandırılmış çıktıdır:
- Capability Matrix (beklenen yetenekler ve olgunluk)
- Trend özeti (kısa; kararları etkileyen 3–7 başlık)
- Gap listesi (her gap: etki + risk + öneri)
- AI yapılabilirlik + risk/governance notu

Kural:
- Her “gap” sonraki fazda ya roadmap’e girer ya da “bilinçli kapsam dışı” olarak işaretlenir.

### 2.3 Faz 3: Türetme (Delivery Pack)

BM/Benchmark çıktıları delivery dokümanlarına deterministik şekilde türetilir:
- BM’deki her **Karar** → en az 1 SPEC/ADR maddesi
- BM’deki her **Guardrail** → en az 1 negatif acceptance senaryosu
- BM’deki her **Ölçüm sinyali** → observability gereksinimi + rapor maddesi
- Benchmark’taki her **Gap** → roadmap veya explicit out-of-scope

## 3. M3 KALİTE STANDARDI (Template doluluğu değil)

### 3.1 Zorunlu 6 Parça (her konu için)

1) Amaç & kapsam/kapsam dışı  
2) Varsayımlar + doğrulama planı  
3) Tasarım kararları + trade-off  
4) Uygulama kontratı (Codex yakıtı): API/DTO, veri, yetki, hata modeli, edge-case davranışı  
5) NFR + reliability: performans/ölçek/timeout-retry/idempotency/rate limit/data lifecycle  
6) Operasyon + test + rollout/rollback + gözlemlenebilirlik  

### 3.2 BM Item ID Standardı (Zorunlu)

BM dokümanlarında “Karar / Guardrail / Ölçüm” maddeleri **ID’li** yazılır.
Amaç: izlenebilir türetme (Trace Pack) ve mekanik kalite kontrol.

#### ID Formatı

- `BM-<BM_NO>-<DOC>-<TYPE>-<SEQ>`
  - `<BM_NO>`: BM dosya numarası (`0001`)
  - `<DOC>`: `CORE` / `CTRL` / `MET`
  - `<TYPE>`: `DEC` / `GRD` / `KPI` / `RSK` / `ASM` / `VAL`
  - `<SEQ>`: `001..999`

Örnekler:
- `BM-0001-CORE-DEC-001` (Core / Decision)
- `BM-0001-CTRL-GRD-002` (Controls / Guardrail)
- `BM-0001-MET-KPI-003` (Metrics / KPI)

### 3.3 Trace Pack Formatı (Zorunlu)

Trace Pack, BM maddelerinin Delivery hedeflerine izlenebilir dönüşümünü taşır.

#### TRACE TSV kolonları

- `BM_ITEM_ID` (zorunlu)
- `BM_SECTION`
- `TARGET_TYPE` (`PB`/`PRD`/`SPEC`/`ADR`/`STORY`/`AC`/`TP`/`RB`/`OBS` vb.)
- `TARGET_ID`
- `NOTES`

Kurallar (minimum):
- Her `DEC` maddesi en az 1 `SPEC` veya `ADR` hedefiyle eşleşir.
- Her `GRD` maddesi en az 1 negatif acceptance senaryosuna (`AC`) eşleşir.
- Her `KPI` maddesi en az 1 observability/dashboard hedefiyle (`OBS`) eşleşir.

## 4. YERLEŞİM VE İSİM STANDARDI

### 4.1 Klasör yerleşimi

- BM Pack: `docs/01-product/BUSINESS-MASTERS/<TOPIC>/`
- Benchmark Pack: `docs/01-product/BENCHMARKS/<TOPIC>/`
- Trace Pack: `docs/03-delivery/TRACES/`
- Delivery: `docs/03-delivery/**` (mevcut)
- Runbook: `docs/04-operations/RUNBOOKS/**` (`check_doc_locations` kuralı)

### 4.2 Dosya isim standardı

- BM: `BM-0001-<topic>-<kısa-açıklama>.md`
- BENCH: `BENCH-0001-<topic>-<kısa-açıklama>.md`
- TRACE: `TRACE-0001-<topic>-bm-to-delivery.tsv`
- `<topic>` slug: `kebab-case` (örn. `ethics`); konu klasörü `ETHICS` gibi uppercase olabilir.
- Trace TSV: ilk satır header; her satır “BM maddesi → hedef doküman” eşlemesidir.

## 5. ÇIKTI PAKETLERİ (SOMUT)

### 5.1 BM Pack (ETHICS)

- `docs/01-product/BUSINESS-MASTERS/ETHICS/BM-0001-ethics-core-operating-model.md`
- `docs/01-product/BUSINESS-MASTERS/ETHICS/BM-0001-ethics-controls-trust-protection.md`
- `docs/01-product/BUSINESS-MASTERS/ETHICS/BM-0001-ethics-metrics-improvement.md`

### 5.2 Benchmark Pack (ETHICS)

- `docs/01-product/BENCHMARKS/ETHICS/BENCH-0001-ethics-capability-matrix.md`
- `docs/01-product/BENCHMARKS/ETHICS/BENCH-0001-ethics-gaps-trends-ai.md`

### 5.3 Delivery Pack

- `docs/03-delivery/SPECS/SPEC-0012-m3-direct-gen-production-system-v1.md`
- `docs/03-delivery/STORIES/STORY-0305-m3-direct-gen-production-system-v1.md`
- `docs/03-delivery/ACCEPTANCE/AC-0305-m3-direct-gen-production-system-v1.md`
- `docs/03-delivery/TEST-PLANS/TP-0305-m3-direct-gen-production-system-v1.md`

### 5.4 Trace Pack (ETHICS)

- `docs/03-delivery/TRACES/TRACE-0001-ethics-bm-to-delivery.tsv`

## 6. APPENDIX A — Etik konusu üzerinden örnek

### A1) BM örnek iskeleti (kodsuz)

- Kuzey Yıldızı: güven / tarafsızlık / koruma
- İşletim modeli: intake → triage → inceleme → karar → aksiyon → kapanış → iyileştirme
- Çıkar çatışması yönetimi (COI)
- Kapanış kalite skoru
- Misilleme koruma süreci
- Ölçümler (KPI/KRI)

### A2) Benchmark matrisi örneği

- Intake kanal çeşitliliği + anonimlik + güvenli iki yönlü iletişim
- COI mekanizması
- Audit/delil zinciri
- Misilleme sinyali
- Kapanış kalitesi
- AI özellikleri + AI governance

### A3) Türetme örneği

- BM kararları → SPEC/ADR maddeleri
- Guardrail → negatif acceptance
- Ölçüm → observability + dashboard

## 7. LİNKLER

- Story: `docs/03-delivery/STORIES/STORY-0305-m3-direct-gen-production-system-v1.md`
- Acceptance: `docs/03-delivery/ACCEPTANCE/AC-0305-m3-direct-gen-production-system-v1.md`
- Test Plan: `docs/03-delivery/TEST-PLANS/TP-0305-m3-direct-gen-production-system-v1.md`
- BM Pack (ETHICS): `docs/01-product/BUSINESS-MASTERS/ETHICS/`
- Benchmark Pack (ETHICS): `docs/01-product/BENCHMARKS/ETHICS/`
- Trace Pack (ETHICS): `docs/03-delivery/TRACES/TRACE-0001-ethics-bm-to-delivery.tsv`
