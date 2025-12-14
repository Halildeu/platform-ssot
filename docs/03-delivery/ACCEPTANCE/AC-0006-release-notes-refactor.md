# AC-0006 – Release Notes Dokümantasyonunun Standardizasyonu Acceptance

ID: AC-0006  
Story: STORY-0006-release-notes-refactor  
Status: Done  
Owner: @team/delivery

## 1. AMAÇ

- Release notes dokümantasyonunun `docs/04-operations/RELEASE-NOTES/` altında
  standart bir formatta tutulduğunu ve ilgili TEST-PLAN / RUNBOOK dokümanlarıyla
  bağlı olduğunu doğrulamak.

## 2. KAPSAM

- Prod release’ler için release-notes dokümanlarının konumu.
- Release-notes içinden TEST-PLAN ve RB-* runbook referansları.
- Release sonrası risk ve rollback bilgisinin dokümantasyonda yer alması.

## 3. GIVEN / WHEN / THEN SENARYOLARI

### Genel Kriterler

- [x] Given: Yeni bir prod release planlanmaktadır.  
      When: Geliştirici veya delivery ekibi release dokümanlarını arar.  
      Then: İlgili release’in notları `docs/04-operations/RELEASE-NOTES/`
      altında bulunur.

### Teknik Kriterler

- [x] Given: Release için bir test planı hazırlanmıştır.  
      When: Release-notes dokümanı incelenir.  
      Then: Doküman içinde ilgili TEST-PLAN (ör. `TP-00XX-*.md`) dosyasına
      açık bir referans bulunmaktadır.

- [x] Given: İlgili servisler için RB-* runbook’ları mevcuttur.  
      When: Release-notes dokümanı ve runbook’lar birlikte incelenir.  
      Then: Release sonrası yapılacak smoke-test ve rollback adımları için
      RB-* runbook’lara açık referanslar yer almaktadır.

### Operasyonel Kriterler

- [x] Given: Yeni release yayınlandıktan sonra incident analizi yapılacaktır.  
      When: Release-notes incelenir.  
      Then: Değişen bileşenler, riskli alanlar ve olası geri alma senaryoları
      release-notes içinde net şekilde listelenmiştir.

## 4. NOTLAR / KISITLAR

- Bu acceptance yalnız dokümantasyon tarafını kapsar; CI/CD pipeline değişiklikleri ve
  test otomasyon altyapısı kapsam dışıdır.

## 5. ÖZET

- Release-notes dokümantasyonu standart bir klasör ve format altında toplanmıştır.
- Her release için ilgili test planı ve runbook’lara izlenebilir referanslar kurulmuştur.

## 6. LİNKLER (İSTEĞE BAĞLI)

- Story: docs/03-delivery/STORIES/STORY-0006-release-notes-refactor.md  
- Release Notes klasörü: docs/04-operations/RELEASE-NOTES/  
