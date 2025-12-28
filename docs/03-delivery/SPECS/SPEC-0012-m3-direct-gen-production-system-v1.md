# SPEC-0012 – M3 Direct-Gen Üretim Sistemi v1 (BM → Benchmark → Türetme)

ID: SPEC-0012  
Status: Draft  
Owner: @team/platform

## 1. AMAÇ

Her konu için aynı mantık ve aynı kalite barıyla çalışan üretim hattı kurmak:
**Business Master Doc (BM) → Benchmark/Trend/GAP → Delivery Pack türetme**.

Hedef:
- Codex’in production-grade kod üretmesi için gereken kritik detayları tek bir zincirde toplamak.
- “Sürpriz” oranını düşürmek (net kararlar, guardrail’ler, ölçüm sinyalleri).

## 2. KAPSAM

- BM → BENCH → TRACE → delivery dokümanları için deterministik üretim hattı ve kalite standardı.
- Kontrat seviyesi SSOT: kurallar, türetme mantığı, izlenebilirlik (Trace Pack), yerleşim/isim standardı.
- Kapsam dışı: servis bazlı implementasyon adımları ve dosya değişiklik listeleri (Tech-Design/STORY/AC/TP alanı).

## 3. KONTRAT (SSOT)

### ÜRETİM HATTI (3 FAZ)

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

### M3 KALİTE STANDARDI (Template doluluğu değil)

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
- `TARGET_TYPE` (`PB`/`PRD`/`PLATFORM_SPEC`/`SPEC`/`ADR`/`STORY`/`AC`/`TP`/`RB`/`OBS` vb.)
- `TARGET_ID`
- `NOTES`

Kurallar (minimum):
- Her `DEC` maddesi en az 1 `PLATFORM_SPEC` veya `SPEC` veya `ADR` hedefiyle eşleşir.
- Her `GRD` maddesi en az 1 negatif acceptance senaryosuna (`AC`) eşleşir.
- Her `KPI` maddesi en az 1 observability/dashboard hedefiyle (`OBS`) eşleşir.
  - Not: `PLATFORM_SPEC` hedefleri için `TARGET_ID` bir `SPEC-XXXX` ID’sidir; `NOTES` içinde ilgili capability adı yazılır.

### 3.4 Trace Coverage Standardı

#### Full Coverage (Reference Exemplar)

Reference exemplar olarak işaretlenen konularda Trace Pack %100 kapsama sahip olmalıdır:
- BM dokümanlarında tanımlı tüm `BM_ITEM_ID` değerleri, `TRACE` TSV’de en az bir hedef (`TARGET_TYPE/TARGET_ID`) ile eşleşir.
- Amaç: uçtan uca izlenebilirlik ve türetme disiplininin “altın standart” örneğini oluşturmak.

Notlar:
- Eşleme “program-level” (`PB`/`PRD`/`SPEC`) veya “delivery-level” (`ADR`/`STORY`/`AC`/`TP`/`RB`/`OBS`) olabilir.
- Bu kural ilk örnek için Ethics üzerinde uygulanır: `docs/03-delivery/TRACES/TRACE-0001-ethics-bm-to-delivery.tsv`.

### 3.5 Shared Capability First (Zorunlu)

Yeni bir domain ihtiyacı geldiğinde varsayılan yaklaşım: önce “shared platform capability” olarak ele al, sonra gerekirse domain içine indir.

#### Extraction kriterleri (hepsi sağlanmalı)

- **2+ domain**: en az iki bağımsız domain/use-case tarafından tekrar kullanılacağı net (mevcut veya çok yakın roadmap).
- **Stabil kontrat**: giriş/çıkış, hata semantiği, versiyonlama ve yetki sınırları net; domain’e özel detaylar extension/policy olarak taşınabilir.
- **Doğru bağımlılık yönü**: domain’ler capability’ye bağımlı olur; capability domain’e bağımlı olmaz (platform → domain değil, domain → platform).

#### Kural: Delivery SPEC’lerde “Platform Dependencies” zorunlu

Her delivery-level `SPEC-XXXX` dokümanında aşağıdaki bölüm **zorunludur**:
- `Platform Dependencies`: bu delivery’nin çalışması için gerekli capability’lerin listesi (yoksa `None`).

#### Trace kuralı

Trace Pack içinde capability bağlantısı gerekiyorsa:
- `TARGET_TYPE=PLATFORM_SPEC`
- `TARGET_ID=<SPEC-XXXX>` (capability kataloğu / capability spec)
- `NOTES` içinde `platform_capability: <name>` alanı bulunur.

SSOT (v1):
- Platform capability kataloğu: `docs/03-delivery/SPECS/SPEC-0014-platform-capabilities-catalog-v1.md`.

### YERLEŞİM VE İSİM STANDARDI

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

### ÇIKTI PAKETLERİ (SOMUT)

### 5.1 BM Pack (ETHICS)

- `docs/01-product/BUSINESS-MASTERS/ETHICS/BM-0001-ethics-core-operating-model.md`
- `docs/01-product/BUSINESS-MASTERS/ETHICS/BM-0001-ethics-controls-trust-protection.md`
- `docs/01-product/BUSINESS-MASTERS/ETHICS/BM-0001-ethics-metrics-improvement.md`

### 5.2 Benchmark Pack (ETHICS)

- `docs/01-product/BENCHMARKS/ETHICS/BENCH-0001-ethics-capability-matrix.md`
- `docs/01-product/BENCHMARKS/ETHICS/BENCH-0001-ethics-gaps-trends-ai.md`

### 5.3 Delivery Pack

- `docs/01-product/PROBLEM-BRIEFS/PB-0004-ethics-speakup-and-case-management.md`
- `docs/01-product/PRD/PRD-0004-ethics-speakup-and-case-management-mvp.md`
- `docs/03-delivery/SPECS/SPEC-0012-m3-direct-gen-production-system-v1.md`
- `docs/03-delivery/STORIES/STORY-0305-m3-direct-gen-production-system-v1.md`
- `docs/03-delivery/ACCEPTANCE/AC-0305-m3-direct-gen-production-system-v1.md`
- `docs/03-delivery/TEST-PLANS/TP-0305-m3-direct-gen-production-system-v1.md`

### 5.4 Trace Pack (ETHICS)

- `docs/03-delivery/TRACES/TRACE-0001-ethics-bm-to-delivery.tsv`

### APPENDIX A — Etik konusu üzerinden örnek

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

## 4. GOVERNANCE (DEĞİŞİKLİK POLİTİKASI)

Bu doküman **M3 Direct-Gen üretim sisteminin SSOT’u** olarak kilitlenmiştir.

### Değişiklik Politikası

- Bu dokümanda “kural değişikliği” yapılmaz.
- Yeni/iyileştirilmiş kurallar için **yeni bir SPEC versiyonu** açılır (örn. `SPEC-0016-...`).
- Örnek (exemplar) iyileştirmeleri (BM/BENCH/TRACE) bu SPEC’i değiştirmeden yapılabilir; ancak sistem kuralı etkileniyorsa yeni SPEC gerekir.

## 5. LİNKLER

- Story: `docs/03-delivery/STORIES/STORY-0305-m3-direct-gen-production-system-v1.md`
- Acceptance: `docs/03-delivery/ACCEPTANCE/AC-0305-m3-direct-gen-production-system-v1.md`
- Test Plan: `docs/03-delivery/TEST-PLANS/TP-0305-m3-direct-gen-production-system-v1.md`
- Problem Brief: `docs/01-product/PROBLEM-BRIEFS/PB-0004-ethics-speakup-and-case-management.md`
- PRD: `docs/01-product/PRD/PRD-0004-ethics-speakup-and-case-management-mvp.md`
- BM Pack (ETHICS): `docs/01-product/BUSINESS-MASTERS/ETHICS/`
- Benchmark Pack (ETHICS): `docs/01-product/BENCHMARKS/ETHICS/`
- Trace Pack (ETHICS): `docs/03-delivery/TRACES/TRACE-0001-ethics-bm-to-delivery.tsv`
- Runbook: `docs/04-operations/RUNBOOKS/RB-trace-quality-policy-enable.md`
