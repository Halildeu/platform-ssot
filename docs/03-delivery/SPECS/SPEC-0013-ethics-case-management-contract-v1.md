# SPEC-0013: Ethics Case Management Contract v1 (MVP)

ID: SPEC-0013  
Status: Draft  
Owner: TBD

## 1. AMAÇ

`PRD-0004` kapsamındaki etik speak-up ve vaka yönetimi (MVP) için “uygulama kontratı”nı tanımlamak:
- domain sınırları
- yetki modeli (need-to-know)
- COI (çıkar çatışması) ve audit/evidence ilkeleri
- AI kullanım sınırları (governance)

## 2. KAYNAKLAR (TRACE)

- PB: `PB-0004`
- PRD: `PRD-0004`
- BM: `BM-0001` (CORE/CTRL/MET)
- BENCH: `BENCH-0001` (matrix + gaps/trends/ai)
- TRACE: `docs/03-delivery/TRACES/TRACE-0001-ethics-bm-to-delivery.tsv`

## 2.1 PLATFORM DEPENDENCIES

Bu delivery kontratı aşağıdaki ortak (shared) yetenekleri “platform dependency” olarak kabul eder (SSOT: `SPEC-0014`).

- Notification & Communications: case mailbox / check-in bildirimleri, delivery status, redaksiyon/policy hook.
- Case / Work Item Engine: state machine, assignment, timeline, vaka tipi ve visibility policy, retaliation vakası açma.
- SLA & Calendar: business day/holiday/timezone semantiği ve breach/escalation kuralları.
- Audit Trail & View Log: who-did-what + who-viewed-what, append-only beklentisi.
- Evidence / Attachment: versioning, immutability beklentisi, access logging entegrasyonu.
- COI Engine: COI tespiti, erişim engeli ve bağımsız reassignment.
- Search & Reporting: KPI/closure quality score raporlama, permission-aware sorgulama.

## 3. DOMAIN SINIRLARI

- Vaka tipleri (minimum): Etik / İK / InfoSec / Finans / Misilleme.
- Yönlendirme:
  - Etik dışı tipler ilgili sürece devredilir.
  - Devredilen vakalarda audit trail korunur (kim/neyi/ne zaman yönlendirdi).
- Misilleme:
  - Misilleme iddiaları ayrı vaka tipi olarak ele alınabilir (BM-0001-CTRL-GRD-006).

## 4. YETKİ İLKELERİ (NEED-TO-KNOW)

- Reporter (bildiren):
  - vaka oluşturma
  - kendi vaka “case mailbox” takibi (BM-0001-CORE-DEC-002)
- Case Manager:
  - triage + inceleme
  - rol bazlı görünürlük (need-to-know)
- Committee:
  - karar + aksiyon takibi
- Auditor:
  - read-only görünürlük
  - audit log erişimi

## 5. COI (ÇIKAR ÇATIŞMASI)

- `BM-0001-CTRL-GRD-001` zorunlu:
  - atama öncesi COI kontrolü
  - COI varsa erişim engeli
  - bağımsız atama zorunluluğu

## 6. EVIDENCE / DELİL POLİTİKASI (BUSINESS-LEVEL)

- `BM-0001-CTRL-GRD-003`: Delil silinmez; yeni sürüm/ek olarak eklenir.
- `BM-0001-CTRL-GRD-004`: Görüntüleme/değiştirme audit log zorunlu.

## 7. KAPANIŞ KALİTESİ

- `BM-0001-MET-KPI-009` modeli MVP’de uygulanır.
- MVP minimum kriter seti: en az 5 kriterin puanlanması ve raporlanması.

## 8. AI KULLANIM SINIRLARI (GOVERNANCE)

- İzinli (asistan rolü):
  - özetleme, triage önerisi, PII redaksiyon (kontrollü)
- Yasak:
  - yaptırım önerisi
  - suçlama/niyet okuma
  - insan onayı olmadan karar üretimi
- Risk kontrolleri: `BENCH-0001` içindeki “AI Risk Kontrolleri (Minimum Set)” ile uyumlu olmalı.

## 9. LİNKLER

- PB: `docs/01-product/PROBLEM-BRIEFS/PB-0004-ethics-speakup-and-case-management.md`
- PRD: `docs/01-product/PRD/PRD-0004-ethics-speakup-and-case-management-mvp.md`
- BM Pack: `docs/01-product/BUSINESS-MASTERS/ETHICS/`
- BENCH Pack: `docs/01-product/BENCHMARKS/ETHICS/`
- Platform Capabilities: `docs/03-delivery/SPECS/SPEC-0014-platform-capabilities-catalog-v1.md`
