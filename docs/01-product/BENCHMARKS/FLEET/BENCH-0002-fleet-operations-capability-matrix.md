# BENCH-0002: Fleet Operations Management — Capability Matrix (v0.1)

## Amaç
Filo yönetimi çözümlerini “kanıtlanabilir kapabilite” kriterleriyle kıyaslamak ve gap analizi için SSOT üretmek.

## Matrix Boyutları (Kriter Seti)
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

## Kanıt Standardı (Zorunlu)
Benchmark doldurulurken her kriter için aşağıdaki alanlar tutulur:
- Kanıt Türü: `doc` / `demo` / `referans` / `sertifika` / `whitepaper` / `kontrat`
- Kaynak: link veya repo içi referans
- Tarih: `YYYY-MM`
- Not: kısa gözlem

## Matrix (Doldurma Şablonu)

| Alan | Kapabilite | Kanıt Türü | Kaynak | Tarih | Not |
|---|---|---|---|---|---|
| Vehicle Registry | (örn. VIN + plaka history) | doc/demo | TBD | TBD | TBD |

