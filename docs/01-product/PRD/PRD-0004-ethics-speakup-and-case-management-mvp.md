# PRD-0004 – Etik Bildirim ve Vaka Yönetimi (MVP)

ID: PRD-0004  
Status: Draft  
Owner: TBD  
Problem Brief: PB-0004

-------------------------------------------------------------------------------
## 1. AMAÇ
-------------------------------------------------------------------------------

- Çok kanallı intake ve güvenli takip (case mailbox) deneyimini tanımlamak.
- COI ve gizlilik guardrail’leri ile tarafsız vaka yönetimini işletilebilir hale getirmek.
- Kapanış kalite skoru ve temel raporlama ile program etkinliğini ölçmek.

-------------------------------------------------------------------------------
## 2. KAPSAM
-------------------------------------------------------------------------------

Dahil (MVP):
- Intake:
  - Anonimlik politikası (BM-0001-CORE-DEC-001)
  - Güvenli iki yönlü iletişim / case mailbox (BM-0001-CORE-DEC-002)
- Controls:
  - COI erişim engeli ve bağımsız atama (BM-0001-CTRL-GRD-001)
  - Delil immutability beklentisi + view/change audit (BM-0001-CTRL-GRD-003/004)
- Metrics:
  - Kapanış kalite skoru modeli (BM-0001-MET-KPI-009)
  - Minimum KPI alt kümesi (BM-0001-MET-KPI-001..008)

-------------------------------------------------------------------------------
## 3. KULLANICI SENARYOLARI
-------------------------------------------------------------------------------

- Senaryo 1 (Reporter): Güvenli kanaldan bildirim yapar ve case mailbox üzerinden takip eder.
- Senaryo 2 (Case Manager): Vaka tipini sınıflandırır, COI kontrolü sonrası atama yapar, delil ekler.
- Senaryo 3 (Committee): Karar verir; aksiyon planı ve kapanış kalite kontrolü yapılır.
- Senaryo 4 (Auditor): Read-only erişimle audit trail ve view log üzerinden denetim yapar.

-------------------------------------------------------------------------------
## 4. DAVRANIŞ / GEREKSİNİMLER
-------------------------------------------------------------------------------

Fonksiyonel:
- Vaka tipleri ve yönlendirme kuralı tanımlıdır (etik dışı tipler ilgili sürece devredilir; audit korunur).
- COI sinyali varsa erişim engeli + bağımsız atama zorunludur.
- Evidence/ekler silinmez; yeni sürüm olarak eklenir; görüntüleme/değişiklik audit log’a düşer.
- Misilleme koruması için kapanış sonrası check-in süreci tanımlıdır (30/60/90 gün).

Non-functional (business-level):
- Gizlilik: need-to-know görünürlük; reporter kimliği varsayılan gizli.
- İzlenebilirlik: kritik olaylar için write audit + view log zorunlu.

AI (Governance):
- İzinli: özetleme, triage önerisi, PII redaksiyon (kontrollü).
- Yasak: yaptırım önerisi, suçlama/niyet okuma, insan onayı olmadan karar.

-------------------------------------------------------------------------------
## 5. NON-GOALS (KAPSAM DIŞI)
-------------------------------------------------------------------------------

- Otomatik yaptırım kararı.
- İnsan onayı olmadan AI ile karar üretimi.
- “Tam HR/discipline sistemi” (etik dışı süreçler ayrı domain).

-------------------------------------------------------------------------------
## 6. ACCEPTANCE KRİTERLERİ ÖZETİ
-------------------------------------------------------------------------------

- Doc zinciri (PB→PRD→SPEC→STORY→AC/TP) eksiksizdir ve Doc QA gate seti PASS olur.
- COI, evidence immutability ve audit/view log kararları delivery seviyesinde (SPEC/ADR) izlenebilir.
- Kapanış kalite skoru MVP kriter setiyle ölçülebilir tanımlanır.

-------------------------------------------------------------------------------
## 7. RİSKLER / BAĞIMLILIKLAR
-------------------------------------------------------------------------------

Kritik riskler:
- Gizlilik ihlali → erişim sınırları + audit/view log zorunluluğu.
- COI atama hatası → policy block + bağımsız yeniden atama.
- “Hız” baskısı → kapanış kalite skoru ile dengele.

Bağımlılıklar:
- Platform capabilities (SPEC-0014): Notification/Comms, Case Engine, SLA/Calendar, Audit, Evidence, COI, Reporting.
- Benchmark referansları: BENCH-0001 (matrix + gaps/trends/ai).

-------------------------------------------------------------------------------
## 8. ÖZET
-------------------------------------------------------------------------------

- MVP, speak-up ve vaka yönetimini “güven + tarafsızlık + denetlenebilirlik” ilkeleriyle tanımlar.
- Başarı, kapanış kalite skoru ve KPI seti ile ölçülebilir hale gelir.

-------------------------------------------------------------------------------
## 9. LİNKLER / SONRAKİ ADIMLAR
-------------------------------------------------------------------------------

- PB: `docs/01-product/PROBLEM-BRIEFS/PB-0004-ethics-speakup-and-case-management.md`
- BM Pack: `docs/01-product/BUSINESS-MASTERS/ETHICS/`
- BENCH Pack: `docs/01-product/BENCHMARKS/ETHICS/`
- TRACE: `docs/03-delivery/TRACES/TRACE-0001-ethics-bm-to-delivery.tsv`
- Delivery SPEC: `docs/03-delivery/SPECS/SPEC-0013-ethics-case-management-contract-v1.md`
