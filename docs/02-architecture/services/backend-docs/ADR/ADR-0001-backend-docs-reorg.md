# ADR-0001 – Backend Dokümantasyonunun docs/ Hiyerarşisine Taşınması

ID: ADR-0001  
Status: Accepted  
Tarih: 2025-01-XX  
Sahip: Halil K.

## Context

Backend’e ait dokümantasyon tarihsel olarak `backend/docs` altında tutulmaktaydı.
Bu yapı:
- Tek bir standarda bağlı değildi,
- Agent-Codex ve yeni doküman mimarisi (docs/00–05) ile uyumlu değildi,
- Yeni gelenler için “hangi dosya doğru?” sorusunu artırıyordu.

Bu sırada yeni dokümantasyon yapısı aşağıdaki gibi tanımlandı:
- Genel kurallar ve layout/stil → docs/00-handbook
- Ürün/iş gereksinimleri → docs/01-product
- Teknik mimari → docs/02-architecture
- Story/Acceptance/Test → docs/03-delivery
- Operasyon → docs/04-operations
- AI/ML → docs/05-ml-ai
- Şablonlar → docs/99-templates

## Decision

Backend’e özgü dokümantasyonun tek doğruluk kaynağı artık `docs/` ağacıdır.

- Genel backend kuralları, layout ve stil:
  - docs/00-handbook/BACKEND-PROJECT-LAYOUT.md
  - docs/00-handbook/STYLE-BE-001.md
- Servis bazlı mimari:
  - docs/02-architecture/services/<servis>/TECH-DESIGN-*.md
  - docs/02-architecture/services/<servis>/DATA-MODEL-*.md
  - docs/02-architecture/services/<servis>/ADR/ADR-*.md
- Geliştirme süreci:
  - docs/03-delivery/STORIES, ACCEPTANCE, TEST-PLANS, PROJECT-FLOW.md
- Operasyon:
  - docs/04-operations/RUNBOOKS, MONITORING, RELEASE-NOTES, SLO-SLA.md
- AI/ML ve veri setleri:
  - docs/05-ml-ai/DATA-CARDS, MODEL-CARDS, EVALUATION-REPORTS

`backend/docs` altındaki mevcut dokümanlar:
- İçeriklerine göre yukarıdaki lokasyonlara özetlenerek taşınacaktır.
- Eski dosyalar silinmeyecek, `backend/docs/legacy` altında arşivlenecektir.
- Yeni doküman üretimi sadece `docs/` hiyerarşisi üzerinden yapılacaktır.

## Consequences

Artılar:
- Tek ve tutarlı doküman mimarisi.
- Hem insanlar hem AI agent’lar için “tek kaynak” (SSOT) oluşur.
- Yeni dokümanlar için nereye yazılacağı netleşir.
- PROJECT-FLOW ve AGENT-CODEX dokümanları ile tam uyum sağlanır.

Eksiler:
- İlk taşıma sırasında ek emek gerekir (envanter + mapping + taşıma).
- Kısa bir süre “eski backend/docs” ve “yeni docs/” birlikte var olmaya devam eder;
  bu süre sonunda backend/docs yalnızca legacy arşivi olarak kullanılmalıdır.

## Linkler

- Story: docs/03-delivery/STORIES/STORY-0001-backend-docs-refactor.md  
- Acceptance: docs/03-delivery/ACCEPTANCE/AC-0001-backend-docs-refactor.md
