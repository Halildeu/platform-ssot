# STORY-0005 – Monitoring Dokümanlarının 04-operations Altına Taşınması

ID: STORY-0005-monitoring-docs-refactor  
Epic: OPS-MONITORING  
Status: Planned  
Owner: @team/ops  
Downstream: AC-0005

## 1. AMAÇ

Alert, metric ve dashboard yönetimi için kullanılan monitoring dokümanlarını
tek bir standart altında toplamak ve `docs/04-operations/MONITORING` klasörü
altında erişilebilir hale getirmek.

## 2. TANIM

- Ops ekibi olarak, tüm monitoring rehberlerinin `docs/04-operations/MONITORING` altında toplanmasını istiyoruz; böylece servis metriklerini tek yerden yönetebilelim.
- Bir geliştirici olarak, runbook ve SLO/SLA ile hizalı bir monitoring dökümanı istiyorum; böylece incident anında hangi metriğe bakacağımı hızlıca görebileyim.

## 3. KAPSAM VE SINIRLAR

Dahil:
- Servis/metrik bazlı monitoring rehberinin oluşturulması
  (`docs/04-operations/MONITORING/`).
- SLO/SLA hedefleri ile metriklerin hizalanması (`SLO-SLA.md`).
- RB-* runbook’ları ile monitoring rehberi arasında çapraz referans kurulması.

Hariç:
- Yeni metrik ekleme ya da observability stack değişikliği (Grafana/Prometheus
  ayarları). Bu story yalnız doküman tarafını kapsar.

## 4. ACCEPTANCE KRİTERLERİ

- [ ] En az bir örnek monitoring rehberi `docs/04-operations/MONITORING/` altında
  bulunur (örneğin: `MONITORING-backend-services.md`).
- [ ] Rehberde kullanılan metrikler ve hedefler `docs/04-operations/SLO-SLA.md`
  ile uyumludur.
- [ ] RB-vault, RB-keycloak, RB-mfe-access ve RB-feature-flags runbook’ları
  monitoring rehberine referans verir.

## 5. BAĞIMLILIKLAR

- SLO-SLA dokümanı (`docs/04-operations/SLO-SLA.md`)
- RB-vault, RB-keycloak, RB-mfe-access, RB-feature-flags
- İlgili monitoring dashboard ve alert tanımları

## 6. ÖZET

- Monitoring rehberleri 04-operations altında tek bir klasörde toplanarak SLO/SLA ve runbook’larla hizalanacaktır.
- En az bir örnek rehber ve runbook referansları üzerinden incident yönetimi daha izlenebilir hale gelecektir.

## 7. LİNKLER (İSTEĞE BAĞLI)

- Acceptance: docs/03-delivery/ACCEPTANCE/AC-0005-monitoring-docs-refactor.md  
- SLO/SLA: docs/04-operations/SLO-SLA.md  
- RUNBOOKS: docs/04-operations/RUNBOOKS/RB-vault.md, RB-keycloak.md, RB-mfe-access.md, RB-feature-flags.md  
