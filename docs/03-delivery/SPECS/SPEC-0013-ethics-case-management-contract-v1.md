# SPEC-0013: Ethics Case Management Contract v1 (MVP)

ID: SPEC-0013  
Status: Draft  
Owner: @team/platform

## 1. AMAÇ

`PRD-0004` kapsamındaki etik speak-up ve vaka yönetimi (MVP) için “uygulama kontratı”nı tanımlamak:
- domain sınırları
- yetki modeli (need-to-know)
- COI (çıkar çatışması) ve audit/evidence ilkeleri
- AI kullanım sınırları (governance)

## 2. KAPSAM

- Ethics case lifecycle (intake → triage → inceleme → karar → aksiyon → kapanış) için business-level kontrat.
- Need-to-know görünürlük, COI, audit/evidence ve AI governance minimum seti.
- Kapsam dışı: endpoint/DTO alan bazında tanımlar (INTERFACE-CONTRACT alanı) ve implementasyon adımları (Tech-Design/STORY alanı).

## 3. KONTRAT (SSOT)

### Kaynaklar (Trace)

- PB: `PB-0004`
- PRD: `PRD-0004`
- BM: `BM-0001` (CORE/CTRL/MET)
- BENCH: `BENCH-0001` (matrix + gaps/trends/ai)
- TRACE: `docs/03-delivery/TRACES/TRACE-0001-ethics-bm-to-delivery.tsv`

### Platform Dependencies

Bu delivery kontratı aşağıdaki ortak (shared) yetenekleri “platform dependency” olarak kabul eder (SSOT: `SPEC-0014`).

- Notification & Communications: case mailbox / check-in bildirimleri, delivery status, redaksiyon/policy hook.
- Case / Work Item Engine: state machine, assignment, timeline, vaka tipi ve visibility policy, retaliation vakası açma.
- SLA & Calendar: business day/holiday/timezone semantiği ve breach/escalation kuralları.
- Audit Trail & View Log: who-did-what + who-viewed-what, append-only beklentisi.
- Evidence / Attachment: versioning, immutability beklentisi, access logging entegrasyonu.
- COI Engine: COI tespiti, erişim engeli ve bağımsız reassignment.
- Search & Reporting: KPI/closure quality score raporlama, permission-aware sorgulama.

### Domain Sınırları

- Vaka tipleri (minimum): Etik / İK / InfoSec / Finans / Misilleme.
- Yönlendirme:
  - Etik dışı tipler ilgili sürece devredilir.
  - Devredilen vakalarda audit trail korunur (kim/neyi/ne zaman yönlendirdi).
- Misilleme:
  - Misilleme iddiaları ayrı vaka tipi olarak ele alınabilir (BM-0001-CTRL-GRD-006).

### Yetki İlkeleri (Need-to-know)

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

### COI (Çıkar Çatışması)

- `BM-0001-CTRL-GRD-001` zorunlu:
  - atama öncesi COI kontrolü
  - COI varsa erişim engeli
  - bağımsız atama zorunluluğu

### Evidence / Delil Politikası (Business-level)

- `BM-0001-CTRL-GRD-003`: Delil silinmez; yeni sürüm/ek olarak eklenir.
- `BM-0001-CTRL-GRD-004`: Görüntüleme/değiştirme audit log zorunlu.

### Kapanış Kalitesi

- `BM-0001-MET-KPI-009` modeli MVP’de uygulanır.
- MVP minimum kriter seti: en az 5 kriterin puanlanması ve raporlanması.

### AI Kullanım Sınırları (Governance)

- İzinli (asistan rolü):
  - özetleme, triage önerisi, PII redaksiyon (kontrollü)
- Yasak:
  - yaptırım önerisi
  - suçlama/niyet okuma
  - insan onayı olmadan karar üretimi
- Risk kontrolleri: `BENCH-0001` içindeki “AI Risk Kontrolleri (Minimum Set)” ile uyumlu olmalı.

## 4. GOVERNANCE (DEĞİŞİKLİK POLİTİKASI)

- Breaking kontrat değişiklikleri yeni SPEC versiyonu ile yapılır.

## 5. LİNKLER

- PB: `docs/01-product/PROBLEM-BRIEFS/PB-0004-ethics-speakup-and-case-management.md`
- PRD: `docs/01-product/PRD/PRD-0004-ethics-speakup-and-case-management-mvp.md`
- BM Pack: `docs/01-product/BUSINESS-MASTERS/ETHICS/`
- BENCH Pack: `docs/01-product/BENCHMARKS/ETHICS/`
- Platform Capabilities: `docs/03-delivery/SPECS/SPEC-0014-platform-capabilities-catalog-v1.md`
