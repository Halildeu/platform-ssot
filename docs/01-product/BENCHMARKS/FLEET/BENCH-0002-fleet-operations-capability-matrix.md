# BENCH-0002: Fleet Operations Management — Capability Matrix (v0.1)

-------------------------------------------------------------------------------
1. AMAÇ
-------------------------------------------------------------------------------

Filo yönetimi çözümlerini “kanıtlanabilir kapabilite” kriterleriyle kıyaslamak ve gap analizi için SSOT üretmek.

-------------------------------------------------------------------------------
2. KAPSAM
-------------------------------------------------------------------------------

- Bu doküman BENCH pack’in “capability matrix + kanıt standardı” kısmıdır.
- Trend/gap/AI analizi BENCH pack’in ikinci dokümanında tutulur.

-------------------------------------------------------------------------------
3. CAPABILITY MATRIX (KANIT STANDARDI)
-------------------------------------------------------------------------------

Matrix Boyutları (Kriter Seti):

### Vehicle Registry
- VIN/plaka kimliği ve plaka geçmişi
- Durum yaşam döngüsü (active/inactive/sold)
- Doküman yönetimi (ruhsat/sigorta/muayene)

### Maintenance
- Planlı bakım planı + hatırlatma
- Plansız bakım kaydı + maliyet
- Servis sağlayıcı/iş emri entegrasyonu (opsiyonel)

### Compliance (Inspection/Insurance)
- Due-date takibi + escalation
- Doküman doğrulama ve sürümleme

### Traffic Fines
- Ceza kaydı + doğrulama
- Ödeme/itiraz iş akışı (policy)
- Raporlama (maliyet, kapanış süresi)

### Fuel
- Yakıt kartı/fiş işlemleri
- Tüketim ve anomali sinyali

### Search & Reporting
- Çok boyutlu filtreleme
- KPI dashboard + export

### Integrations & Audit
- Audit trail derinliği
- API/CSV import/export
- Idempotency/retry ve veri tutarlılığı

Kanıt Standardı (Zorunlu):
- Kanıt Türü: `doc` / `demo` / `referans` / `sertifika` / `whitepaper` / `kontrat`
- Kaynak: link veya repo içi referans
- Tarih: `YYYY-MM`
- Not: kısa gözlem

Matrix (Doldurma Şablonu):

| Alan | Kapabilite | Kanıt Türü | Kaynak | Tarih | Not |
|---|---|---|---|---|---|
| Vehicle Registry | VIN/plaka kimliği ve plaka geçmişi | doc | docs/01-product/BUSINESS-MASTERS/FLEET/ | 2025-12 | Baseline kriter seti (repo içi SSOT). |
| Vehicle Registry | Durum yaşam döngüsü (active/inactive/sold) | doc | docs/01-product/BUSINESS-MASTERS/FLEET/ | 2025-12 | Baseline kriter seti (repo içi SSOT). |
| Vehicle Registry | Doküman yönetimi (ruhsat/sigorta/muayene) | doc | docs/01-product/BUSINESS-MASTERS/FLEET/ | 2025-12 | Baseline kriter seti (repo içi SSOT). |
| Maintenance | Planlı bakım planı + hatırlatma | doc | docs/01-product/BUSINESS-MASTERS/FLEET/ | 2025-12 | Baseline kriter seti (repo içi SSOT). |
| Compliance | Due-date takibi + escalation | doc | docs/01-product/BUSINESS-MASTERS/FLEET/ | 2025-12 | Takvim semantiği (timezone/iş günü) benchmark kritik. |
| Traffic Fines | Ceza kaydı + doğrulama | doc | docs/01-product/BUSINESS-MASTERS/FLEET/ | 2025-12 | Baseline kriter seti (repo içi SSOT). |
| Fuel | Tüketim ve anomali sinyali | doc | docs/01-product/BUSINESS-MASTERS/FLEET/ | 2025-12 | Fraud/kalite sinyali benchmark kritik. |
| Search & Reporting | KPI dashboard + export | doc | docs/01-product/BUSINESS-MASTERS/FLEET/ | 2025-12 | Export policy + redaksiyon değerlendirilir. |
| Integrations & Audit | Audit trail derinliği | doc | docs/01-product/BUSINESS-MASTERS/FLEET/ | 2025-12 | who-did-what + değişiklik izi. |
| Integrations & Audit | API/CSV import/export | doc | docs/01-product/BUSINESS-MASTERS/FLEET/ | 2025-12 | Import idempotency/retry değerlendirilir. |

-------------------------------------------------------------------------------
4. TRENDLER
-------------------------------------------------------------------------------

Bu bölüm BENCH pack’in ikinci dokümanında tutulur:
- `docs/01-product/BENCHMARKS/FLEET/BENCH-0002-fleet-operations-gaps-trends-ai.md`

-------------------------------------------------------------------------------
5. BOŞLUKLAR (GAPS)
-------------------------------------------------------------------------------

Bu bölüm BENCH pack’in ikinci dokümanında tutulur:
- `docs/01-product/BENCHMARKS/FLEET/BENCH-0002-fleet-operations-gaps-trends-ai.md`

-------------------------------------------------------------------------------
6. AI YAPILABİLİRLİK + RİSK KONTROLLERİ
-------------------------------------------------------------------------------

Bu bölüm BENCH pack’in ikinci dokümanında tutulur:
- `docs/01-product/BENCHMARKS/FLEET/BENCH-0002-fleet-operations-gaps-trends-ai.md`

-------------------------------------------------------------------------------
7. LİNKLER / KAYNAKLAR
-------------------------------------------------------------------------------

- BENCH Pack (2. doküman): `docs/01-product/BENCHMARKS/FLEET/BENCH-0002-fleet-operations-gaps-trends-ai.md`
- BM Pack: `docs/01-product/BUSINESS-MASTERS/FLEET/`
- PRD: `docs/01-product/PRD/PRD-0006-fleet-operations-management-mvp.md`
