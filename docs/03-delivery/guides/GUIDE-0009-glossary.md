---
title: "Platform Glossary"
status: in-progress
owner: "@team/platform-docs"
last_review: 2025-11-03
---

# GUIDE-0009: Platform Glossary

## 1. AMAÇ

Mikro-frontend platformunda sık kullanılan terimlerin herkes tarafından aynı anlamla kullanılmasını sağlamak.

## 2. KAPSAM

- Mimari, ürün, süreç, operasyon, lokalizasyon, güvenlik, telemetry ve observability terimleri
- Her terim için kısa tanım, pratik kullanım örneği ve ilgili doküman referansları

## 3. KAPSAM DIŞI

- Domain-spesifik iş terimleri (muhasebe, lojistik vb. -- ilgili BM dokümanlarına bakınız)
- Üçüncü parti araç/kütüphane API referansları

## 4. BAĞLAM / ARKA PLAN

Bu sözlük; proje genelinde terminoloji tutarlılığını sağlar. Yeni terim eklerken `docs/03-delivery/guides/GUIDE-0004-glossary-guide.md` içindeki kuralları ve current docs/operasyon zincirini baz alın.

## 5. ADIM ADIM (KULLANIM)

### 5.1 Mimari & Ürün Terimleri

| Terim | Tanım | Kullanım / Notlar |
| --- | --- | --- |
| Manifest | Mikro-frontend ekranını tanımlayan JSON/yapılandırma dosyası; PageLayout bileşenleri, grid sütunları, aksiyonlar burada tanımlanır. | Ayrıntı: `web/docs/architecture/frontend/frontend-project-layout.md`, `docs/02-architecture/clients/WEB-ARCH.md` |
| Shell | MFE'lerin host uygulaması; servis sözleşmelerini, auth context'i ve ortak UI bileşenlerini sağlar. | Mimari özet: `docs/02-architecture/clients/WEB-ARCH.md` |
| Access Module | `mfe-access` uygulaması; rol ve izin yönetimini manifest tabanlı sunar. | Runbook: `docs/04-operations/RUNBOOKS/RB-mfe-access.md` |
| Audit ID | Mutasyon yanıtlarında dönen benzersiz kimlik; audit log ekranına deep-link sağlar. | Üretim akışı: `web/docs/architecture/frontend/ux/planned-mfe-ux.md` |
| TTFA (Time to First Action) | Kullanıcının ilk etkileşim yapabildiği ana kadar geçen süre; performans SLO metriği. | Gözlemleme: `docs/04-operations/RUNBOOKS/` |

### 5.2 Süreç & Operasyon Terimleri

| Terim | Tanım | Kullanım / Notlar |
| --- | --- | --- |
| Doc Hygiene | Sprint sonunda dokümanların güncelliğini kontrol eden ritüel; backlog maddeleri burada gözden geçirilir. | Süreç: `docs/03-delivery/PROJECT-FLOW.md`, `docs/04-operations/RUNBOOKS/RB-doc-repair-loop.md` |
| Feature Flag | Unleash üzerinde yönetilen, MFE davranışını koşulsal değiştiren yapı. | Yönetişim: `docs/04-operations/RUNBOOKS/RB-feature-flags.md` |
| Guardrail | CI/CD üzerinde kırmızı çizgi adımları (ör. i18n-smoke, security-guardrails). | Örnek: `docs/OPERATIONS/AI-MULTIREPO-OPERATING-CONTRACT.v1.md`, `.github/workflows/i18n-smoke.yml` |
| Runbook | Incident anında uygulanacak prosedürlerin bulunduğu operasyon dokümanı. | Şablon: `docs/99-templates/RUNBOOK.template.md` |
| Rollback | Başarısız release sonrası en son stabil deploy'a geri dönme adımları. | Strateji: `docs/04-operations/RUNBOOKS/RB-insansiz-flow.md`, `docs/04-operations/RUNBOOKS/RB-live-service-schema-cutover.md` |

### 5.3 Lokalizasyon & Güvenlik Terimleri

| Terim | Tanım | Kullanım / Notlar |
| --- | --- | --- |
| TMS (Translation Management System) | Çeviri sözlüklerinin saklandığı servis; `npm run i18n:pull` komutu ile çekilir. | Ayrıntı: `web/docs/architecture/frontend/frontend-project-layout.md`, `docs/02-architecture/clients/WEB-ARCH.md` |
| Pseudolocale | TMS'ten üretilen çeviri dosyası; UI çeviri eksiklerini ve taşmaları yakalamak için kullanılır. | Workflow: `.github/workflows/i18n-smoke.yml` |
| SRI (Subresource Integrity) | Manifest ve remote bundle'lar için hash doğrulaması; güvenli yükleme sağlar. | Rehber: `security/sri-manifest.json`, `docs/02-architecture/clients/WEB-ARCH.md` |
| Vault | Gizli anahtar yönetimi ve dinamik DB secrets için kullanılan HashiCorp Vault kurulumumuz. | Rehber: `docs/04-operations/RUNBOOKS/RB-vault.md` |
| Service Token | Servisler arası kimlik doğrulamada kullanılan token tipi; AppRole veya statik key ile üretilir. | Referans: `docs/04-operations/RUNBOOKS/RB-keycloak.md` |

### 5.4 Telemetry & Observability Terimleri

| Terim | Tanım | Kullanım / Notlar |
| --- | --- | --- |
| OTEL (OpenTelemetry) | Uygulama metrik/log/trace toplamak için kullanılan standard. | Referans: `docs/OPERATIONS/OBSERVABILITY-COVERAGE-MATRIX.v1.md` |
| SendBeacon Fallback | Shell telemetry client'ının tarayıcı kapanırken veri göndermek için kullandığı yöntem. | Kod: `web/apps/mfe-shell/src/app/telemetry/telemetry-client.ts` |
| Synthetic Check | Grafana üzerinden TTFA ve uptime için koşulan otomatik test. | Dashboard referansı: `docs/04-operations/RUNBOOKS/RB-mfe-access.md` |
| Error Budget | SLO hedefi aşıldığında kalan hata payı; release kararlarında referans alınır. | Açıklama: `docs/04-operations/SLO-SLA.md` |

### 5.5 Ek Terimler & Kısaltmalar

- **MFE:** Micro Frontend.
- **ADR:** Architecture Decision Record.
- **SLA/SLO:** Service Level Agreement / Objective.
- **CI/CD:** Continuous Integration / Deployment.
- **TTI:** Time to Interactive (baz performans metriği; TTFA ile birlikte izlenir).

## 6. SIK HATALAR / EDGE-CASE

- Yeni terim eklerken alfabetik sırayı koruyun ve mümkünse current delivery veya canonical operasyon dokümanına bağlayın.
- Aynı terimin farklı bağlamlarda farklı anlamlara gelmesi durumunda her bağlamı ayrı satır olarak ekleyin.
- Kısaltmaları hem kısaltma hem de açılımıyla aranabilir tutun.

## 7. LİNKLER

- Glossary ekleme kuralları: `docs/03-delivery/guides/GUIDE-0004-glossary-guide.md`
- Mimari özet: `docs/02-architecture/clients/WEB-ARCH.md`
- Operasyon runbook'ları: `docs/04-operations/RUNBOOKS/`
