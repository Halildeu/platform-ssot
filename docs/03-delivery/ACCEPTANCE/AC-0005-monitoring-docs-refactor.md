# AC-0005 – Monitoring Dokümanlarının 04-operations Altına Taşınması Acceptance

ID: AC-0005  
Story: STORY-0005-monitoring-docs-refactor  
Status: Done  
Owner: @team/ops

## 1. AMAÇ

- Monitoring dokümanlarının `docs/04-operations/MONITORING/` altında
  toplandığını, SLO-SLA ile hizalı olduğunu ve ilgili runbook’larla
  çapraz referans kurulduğunu doğrulamak.

## 2. KAPSAM

- Monitoring rehberlerinin konumu ve kapsamı.
- SLO/SLA hedefleri ile metriklerin uyumu.
- RB-* runbook referanslarının doğruluğu.

## 3. GIVEN / WHEN / THEN SENARYOLARI

### Genel Kriterler

- [x] Given: Monitoring ihtiyacı olan servisler belirlenmiştir.  
      When: Geliştirici veya ops mühendisi monitoring dokümanı arar.  
      Then: İlgili rehber `docs/04-operations/MONITORING/` altında bulunur.

### Teknik Kriterler

- [x] Given: SLO/SLA hedefleri `docs/04-operations/SLO-SLA.md` içinde
      tanımlanmıştır.  
      When: Monitoring rehberi incelenir.  
      Then: Belirtilen metrikler ve eşik değerleri SLO/SLA dokümanı ile uyumludur.

- [x] Given: Runbook’lar (RB-vault, RB-keycloak, RB-mfe-access,
      RB-feature-flags) mevcuttur.  
      When: Monitoring rehberi içindeki referanslar kontrol edilir.  
      Then: İlgili runbook’lara giden linkler doğru ve çalışır durumdadır.

### Operasyonel Kriterler

- [x] Given: Yeni incident veya alert tanımı yapılacaktır.  
      When: Monitoring rehberi güncellenir.  
      Then: Değişiklikler ilgili RB-* runbook ve SLO-SLA dokümanlarına da
      yansıtılır; eski backend/docs notları gerekli ise legacy altında saklanır.

## 4. NOTLAR / KISITLAR

- Bu acceptance, monitoring dokümanlarının konum ve içerik hizalamasını kapsar;
  yeni metrik tanımı veya observability stack değişiklikleri kapsam dışıdır.

## 5. ÖZET

- Monitoring rehberleri 04-operations altında toplanmış ve SLO/SLA ile uyumlu hale getirilmiştir.
- RB-* runbook’larıyla çift yönlü referans kurularak incident yönetimi daha izlenebilir olmuştur.

## 6. LİNKLER (İSTEĞE BAĞLI)

- Story: docs/03-delivery/STORIES/STORY-0005-monitoring-docs-refactor.md  
- Rehber (örnek): docs/04-operations/MONITORING/MONITORING-backend-services.md (oluşturulacak)  
