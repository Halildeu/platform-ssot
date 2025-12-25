# SPEC-0014: Platform Capabilities Catalog v1

ID: SPEC-0014  
Status: Draft  
Owner: TBD

## 1. AMAÇ

Domain’ler arasında ortak kullanılacak temel yetenekleri (capability) tanımlamak ve tekrar eden implementasyonları engellemek.

Bu doküman:
- business + kontrat seviyesinde SSOT’tur (kod içermez),
- delivery-level SPEC’lerde “Platform Dependencies” bölümüne referans edilir,
- Trace Pack içinde `TARGET_TYPE=PLATFORM_SPEC` hedefi olarak kullanılabilir.

## 2. KURAL

Yeni bir domain ihtiyacı geldiğinde önce “shared capability” olarak ele alınır.
Extraction kriterleri `SPEC-0012` içindeki “Shared Capability First” bölümüne göre değerlendirilir.

## 3. CAPABILITIES (v1)

### 3.1 Notification & Communications

Kapsam (kontrat seviyesi):
- Kanallar: e-mail / SMS / Teams / portal inbox / (opsiyonel) webhook
- Template yönetimi (şablon + değişkenler) ve delivery status takibi
- Rate limit / retry / idempotency beklentileri
- Policy hook: PII / anonimlik / kanal seçimi
- Audit hook: “kim, neyi, kime, ne zaman gönderdi”

### 3.2 Case / Work Item Engine

Kapsam (kontrat seviyesi):
- State machine (case/work item), assignment, task list, timeline
- Case type (ethics/incident/NC vb.) ve visibility policy (need-to-know)
- Escalation hook (SLA breach ile tetiklenebilir)
- Audit trail ile entegrasyon beklentisi (olaylar log’a düşer)

### 3.3 SLA & Calendar

Kapsam (kontrat seviyesi):
- Business day / holiday / timezone semantiği
- SLA hesaplama ve breach tespiti
- Breach → escalation kuralları (policy)

### 3.4 Audit Trail & View Log

Kapsam (kontrat seviyesi):
- Who-did-what: değişiklik/audit olayları
- Who-viewed-what: görüntüleme log’u (need-to-know doğrulaması için)
- Append-only / immutability beklentileri
- Retention ve export beklentileri (uyum/audit)

### 3.5 Evidence / Attachment

Kapsam (kontrat seviyesi):
- Evidence/attachment versioning, “silinmez; yeni sürüm eklenir” beklentisi
- Access logging (view/change) entegrasyonu
- Retention / legal hold policy hook

### 3.6 COI Engine

Kapsam (kontrat seviyesi):
- Conflict detection sinyalleri (organizasyon/raporlama hattı vb.)
- Auto wall: COI varsa erişim engeli
- Bağımsız reassignment (tarafsız atama) beklentisi
- Audit: COI tespit/engel/atama olayları log’a düşer

### 3.7 Search & Reporting

Kapsam (kontrat seviyesi):
- Filter/search/export kontratı (hangi alanlar indekslenir, minimum filtreler)
- KPI/KRI raporlama beklentisi (dashboard/metric contract)
- Permission-aware search (need-to-know)

## 4. LİNKLER

- Üretim sistemi kuralları: `docs/03-delivery/SPECS/SPEC-0012-m3-direct-gen-production-system-v1.md`
- Ethics delivery kontratı: `docs/03-delivery/SPECS/SPEC-0013-ethics-case-management-contract-v1.md`
- Ethics trace exemplar: `docs/03-delivery/TRACES/TRACE-0001-ethics-bm-to-delivery.tsv`
