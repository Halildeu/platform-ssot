# PRD-0006: Fleet Operations Management (MVP)

ID: PRD-0006
Status: Draft
Owner: TBD
Problem Brief: PB-0006

Not: Aşağıdaki başlıklar ve sıralama **zorunludur**.

-------------------------------------------------------------------------------
## 1. AMAÇ
-------------------------------------------------------------------------------

- Filo operasyonunda uyum (muayene/sigorta), maliyet (bakım/yakıt/ceza) ve izlenebilirliği tek sözleşmede tanımlamak.
- “Hatırlatma + iş takibi + raporlama” üçlüsünü platform yetenekleri üzerinden standardize etmek.

-------------------------------------------------------------------------------
## 2. KAPSAM
-------------------------------------------------------------------------------

Dahil (MVP):
- Araç kaydı: VIN/plaka kimliği, durum, temel özellikler, plaka history.
- Doküman yönetimi: ruhsat/sigorta/muayene dokümanları (sürümleme, silmeme).
- Due-date takibi: sigorta/muayene bitiş tarihleri için hatırlatma ve gecikme raporu.
- Bakım: planlı bakım planı + bakım kaydı (tarih, km, maliyet, not).
- Trafik cezası: kayıt + doğrulama + ödeme/itiraz + kapanış durumları.
- Yakıt: işlem kaydı (fiş/kart) + tüketim raporu + basit anomali sinyali.
- Arama/filtreleme + temel raporlar (uyum ve maliyet).

Hariç (MVP):
- Telematics/IoT cihaz yönetimi ve canlı takip.
- Otomatik karar: ceza/itiraz ve bakım onayı (insansız).
- ERP muhasebe fişi üretimi ve tam finansal entegrasyon.

-------------------------------------------------------------------------------
## 3. KULLANICI SENARYOLARI
-------------------------------------------------------------------------------

- Senaryo 1: Filo yöneticisi yeni aracı kaydeder, dokümanlarını yükler ve durumunu yönetir.
- Senaryo 2: Bakım sorumlusu bakım planını tanımlar; geciken bakımları rapordan görür ve takip eder.
- Senaryo 3: Uyum sorumlusu muayene/sigorta sürelerini izler; hatırlatma bildirimleri ile gecikmeyi azaltır.
- Senaryo 4: Finans kullanıcısı trafik cezalarını kaydeder, ödeme/itiraz sürecini takip eder.
- Senaryo 5: Operasyon yöneticisi yakıt tüketimini ve anomali sinyallerini raporda görür.

-------------------------------------------------------------------------------
## 4. DAVRANIŞ / GEREKSİNİMLER
-------------------------------------------------------------------------------

Fonksiyonel:
- Araç CRUD (silme yok): create/update/deactivate; VIN/plaka duplicate önleme.
- Plaka değişimi history olarak tutulur; raporlar kanonik araç kimliği üzerinden çalışır.
- Doküman/ek yönetimi: sürümleme; silme yok; görüntüleme/değişiklik audit’e düşer.
- Due-date hatırlatma: 30/7/1 gün öncesi varsayılan; policy ile ayarlanabilir.
- Bakım kaydı: tarih + km + maliyet + açıklama; “km geriye gidemez” guardrail.
- Ceza akışı: kayıt → doğrulama → (ödeme | itiraz) → kapanış.
- Yakıt işlemi: tarih + litre + tutar + km (opsiyonel) ile raporlanır; basit anomali sinyali üretilir.

Non-functional (business-level):
- Audit ve izlenebilirlik: kritik alan değişiklikleri audit trail’de görünür olmalıdır.
- Idempotency: import/entegrasyon girişleri duplicate üretmemelidir.
- Veri sınıfı: sürücü/atama verisi (varsa) PII kabul edilir; maskeleme policy ile yönetilir.

-------------------------------------------------------------------------------
## 5. NON-GOALS (KAPSAM DIŞI)
-------------------------------------------------------------------------------

- Predictive maintenance ve ileri seviye telematics analitiği.
- AI ile otomatik ceza/itiraz kararı veya otomatik bakım onayı.
- UI/UX detay tasarımı (ayrı UX çalışması).

-------------------------------------------------------------------------------
## 6. ACCEPTANCE KRİTERLERİ ÖZETİ
-------------------------------------------------------------------------------

- Doküman zinciri (PB→PRD→SPEC→STORY→AC/TP) eksiksizdir ve Doc QA gate seti PASS olur.
- Platform bağımlılıkları `SPEC-0014` üzerinden açıkça listelenir (custom bildirim/audit yok).
- Araç/doküman/uyum/bakım/ceza/yakıt akışları kontrat seviyesinde net ve test edilebilir tanımlanır.

-------------------------------------------------------------------------------
## 7. RİSKLER / BAĞIMLILIKLAR
-------------------------------------------------------------------------------

- Platform Dependencies (Zorunlu):
  - Platform Spec: `SPEC-0014`
  - Case / Work Item Engine
  - SLA & Calendar
  - Audit Trail & View Log
  - Evidence / Attachment
  - Notification & Communications
  - Search & Reporting
- Dış bağımlılık: yakıt kartı/ceza entegrasyonları (MVP’de manuel giriş ile başlayabilir).
- Risk: veri kalitesi ve timezone hataları; migration/clean-up planı gerekir.

-------------------------------------------------------------------------------
## 8. ÖZET
-------------------------------------------------------------------------------

- MVP, filo operasyonunun temel “uyum + maliyet + izlenebilirlik” ihtiyaçlarını tek kontratta toplar.
- Shared capability first ile tekrar eden platform parçaları yeniden yazılmaz.

-------------------------------------------------------------------------------
## 9. LİNKLER / SONRAKİ ADIMLAR
-------------------------------------------------------------------------------

- PB: `docs/01-product/PROBLEM-BRIEFS/PB-0006-fleet-operations-management.md`
- BM Pack: `docs/01-product/BUSINESS-MASTERS/FLEET/`
- BENCH Pack: `docs/01-product/BENCHMARKS/FLEET/`
- Delivery SPEC: `docs/03-delivery/SPECS/SPEC-0016-fleet-operations-management-contract-v1.md`
- Story: `docs/03-delivery/STORIES/STORY-0315-fleet-operations-management.md`
- Acceptance: `docs/03-delivery/ACCEPTANCE/AC-0315-fleet-operations-management.md`
- Test Plan: `docs/03-delivery/TEST-PLANS/TP-0315-fleet-operations-management.md`

