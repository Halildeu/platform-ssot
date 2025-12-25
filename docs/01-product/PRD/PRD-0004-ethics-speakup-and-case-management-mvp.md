# PRD-0004: Etik Bildirim ve Vaka Yönetimi (MVP)

ID: PRD-0004
Status: Draft
Owner: TBD
Problem Brief: PB-0004

## Hedefler
- Çok kanallı intake ve güvenli takip deneyimi
- COI ve gizlilik guardrail’leriyle tarafsız vaka yönetimi
- Kapanış kalite skoru ve temel dashboard

## Kapsam (MVP)
### Intake
- Anonimlik politikası (BM-0001-CORE-DEC-001)
- Güvenli iki yönlü iletişim (BM-0001-CORE-DEC-002)

### Controls
- COI erişim engeli (BM-0001-CTRL-GRD-001)
- Delil immutability yaklaşımı (BM-0001-CTRL-GRD-003)

### Metrics
- Kapanış kalite skoru (BM-0001-MET-KPI-009)
- KPI setinin minimum alt kümesi (BM-0001-MET-KPI-001..008)

## Kullanıcı Tipleri
- Bildiren (çalışan/tedarikçi)
- Vaka yöneticisi (triage/inceleme)
- Komite/Onay
- Denetçi

## Kritik Riskler ve Önlemler
- Gizlilik ihlali → erişim sınırları + audit
- COI atama hatası → bağımsız atama + blok
- “hız” baskısı → kapanış kalite skoru ile dengele

## AI Kullanımı (Governance)
- İzinli: özetleme, triage önerisi, PII redaksiyon (kontrollü)
- Yasak: yaptırım önerisi, suçlama/niyet okuma
- Risk kontrolleri: BENCH-0001 (AI Risk Kontrolleri)

## Benchmark / Gap Referansları
- BENCH-0001 capability matrix
- BENCH-0001 gaps/trends/ai

## İzlenebilirlik (Trace)
TRACE-0001-ethics-bm-to-delivery.tsv’de PB-0004 ve PRD-0004 hedefleri işlenecek.
