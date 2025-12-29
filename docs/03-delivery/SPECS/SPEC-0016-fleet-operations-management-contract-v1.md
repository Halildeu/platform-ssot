# SPEC-0016: Fleet Operations Management Contract v1 (MVP)

ID: SPEC-0016  
Status: Draft  
Owner: @team/platform

## 1. AMAÇ

`PRD-0006` kapsamındaki Fleet Operations Management (MVP) için “uygulanabilir kontrat” seviyesinde ortak beklentileri tanımlamak.

Hedef:
- Araç kayıt + doküman + bakım + uyum + ceza + yakıt süreçlerini tek sözleşmede netleştirmek.
- Shared capability first ile bildirim/audit/evidence/reporting tekrarını engellemek.

## 2. KAPSAM

- Fleet domain (araç, doküman, bakım, uyum, ceza, yakıt) için MVP kontrat yüzeyi.
- Kapsam dışı: endpoint/DTO alan bazında tanım (INTERFACE-CONTRACT) ve implementasyon adımları (STORY/Tech-Design).

## 3. KONTRAT (SSOT)

### Kaynaklar

- PB: `PB-0006`
- PRD: `PRD-0006`
- BM Pack: `BM-0003` (FLEET)
- Platform Spec: `SPEC-0014`

### Platform Dependencies (Zorunlu)

- Platform Spec: `SPEC-0014`
- Case / Work Item Engine
- SLA & Calendar
- Audit Trail & View Log
- Evidence / Attachment
- Notification & Communications
- Search & Reporting

### Domain Kontratı (MVP)

### 3.1 Entity: Vehicle (Araç)

Minimum alanlar:
- `vehicle_id` (kanonik kimlik)
- `vin` (opsiyonel ama önerilir)
- `plate_current` + `plate_history[]`
- `status` (`active|inactive|sold`)
- `attributes` (opsiyonel: marka/model/yıl/segment)

Kurallar:
- `vin` veya `plate_current` üzerinden duplicate önleme (policy).
- Silme yok; status ile kapatma (BM-0003-CORE-GRD-001).
- Kritik alan değişiklikleri audit’e düşer (BM-0003-CTRL-GRD-001).

### 3.2 Entity: Compliance Document (Doküman)

Doküman tipleri (MVP):
- `registration` (ruhsat)
- `insurance` (sigorta)
- `inspection` (muayene)

Kurallar:
- Doküman silinmez; sürümleme ile yönetilir (BM-0003-CORE-GRD-002).
- Görüntüleme ve değişiklikler `Audit Trail & View Log` üzerinden izlenir.

### 3.3 Work Items (Bakım/Uyum/Ceza)

MVP iş tipleri:
- `maintenance_task`
- `compliance_renewal_task`
- `fine_case`

Kurallar:
- State machine + assignment + timeline ortak yaklaşım (shared capability reuse).
- Due-date ve escalation semantiği `SLA & Calendar` üzerinden (BM-0003-CORE-DEC-003).

### 3.4 Maintenance (Bakım)

Minimum davranış:
- Planlı bakım planı: periyot (zaman veya km) + hatırlatma politikası.
- Bakım kaydı: tarih + km + maliyet + açıklama.

Guardrail:
- Odometre geriye gidemez; istisna için gerekçe + audit (BM-0003-CORE-GRD-005).

### 3.5 Traffic Fine (Trafik Cezası)

MVP akışı:
- kayıt → doğrulama → (ödeme | itiraz) → kapanış

Kurallar:
- Ödeme/itiraz aksiyonu role ile korunur (BM-0003-CTRL-GRD-003).
- Ceza dokümanları evidence olarak saklanır (silme yok).

### 3.6 Fuel Transaction (Yakıt)

Minimum alanlar:
- tarih, litre, tutar, (opsiyonel) odometre

Minimum rapor:
- tüketim (L/100km) ve basit anomali sinyali (BM-0003-CORE-RSK-005).

### Bildirim Sözleşmesi (Policy-first)

Kural:
- Domain içi custom bildirim implementasyonu yoktur; `Notification & Communications` capability kullanılır.

Minimum bildirimler (MVP):
- sigorta/muayene yaklaşan bitiş (30/7/1 gün)
- bakım due-date yaklaşan/geçen
- ceza durum değişimi (kayıt, ödeme, itiraz sonucu)

### Raporlama & Observability (Minimum)

Raporlama SSOT:
- KPI seti: `BM-0003-MET-KPI-001..010`

Minimum:
- Uyumluluk raporu: yaklaşan/geciken muayene-sigorta
- Bakım raporu: overdue ve kapanış süreleri
- Maliyet raporu: yakıt + ceza (aylık)
- Bildirim delivery metriği (kanal bazlı)

### Anti-patterns

- Domain’in kendi SMTP/SMS/notification kodunu yazması.
- “İş günü hesabı”nın modül bazlı çoğaltılması.
- Kritik kayıtların silinmesi veya sürümsüz doküman yönetimi.

## 4. GOVERNANCE (DEĞİŞİKLİK POLİTİKASI)

- Breaking kontrat değişiklikleri yeni SPEC versiyonu ile yapılır.

## 5. LİNKLER

- PB: `docs/01-product/PROBLEM-BRIEFS/PB-0006-fleet-operations-management.md`
- PRD: `docs/01-product/PRD/PRD-0006-fleet-operations-management-mvp.md`
- BM Pack: `docs/01-product/BUSINESS-MASTERS/FLEET/`
- Story: `docs/03-delivery/STORIES/STORY-0315-fleet-operations-management.md`
