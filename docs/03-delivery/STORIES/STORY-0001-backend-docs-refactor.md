# STORY-0001 – Backend Dokümantasyonunun Yeni Mimariye Taşınması

ID: STORY-0001-backend-docs-refactor  
Epic: EPIC-BACKEND-DOCS  
Status: Done  
Owner: Halil K.  
Upstream: (PB/PRD TBD)  
Downstream: AC-0001, ADR-0001

## 1. AMAÇ

Backend tarafındaki mevcut `backend/docs` içeriğini,
kurulan yeni doküman mimarisi (docs/00-handbook, 01–05, 99-templates)
ile uyumlu hale getirmek; tek bir doküman sistemi üzerinden
agent ve ekiplerin çalışmasını sağlamak.

## 2. TANIM

- Bir backend geliştiricisi olarak, all backend documentation to live under the new `docs/` tree istiyorum; böylece there is a single, tutarlı doküman sistemi.
- Bir agent/ekip arkadaşı olarak, AGENT-CODEX ve DOC-HIERARCHY’nin yalnızca `docs/` altındaki dokümanlara referans vermesini istiyorum; böylece doğru kaynağı hızlıca bulabileyim.

## 3. KAPSAM VE SINIRLAR

Dahil:
- `backend/docs` altındaki tüm .md dosyalarının envanterinin çıkarılması
- Her dosyanın yeni sistemdeki hedefi ile eşleştirilmesi:
  - docs/00-handbook → genel kurallar / stil / layout
  - docs/02-architecture/services/** → TECH-DESIGN, DATA-MODEL, ADR
  - docs/03-delivery → STORIES, ACCEPTANCE, TEST-PLANS
  - docs/04-operations → RUNBOOKS, MONITORING, RELEASE-NOTES
  - docs/05-ml-ai → DATA-CARDS, MODEL-CARDS, EVALUATION-REPORTS (AI ile ilgili ise)
- Gerekli dokümanların yeni lokasyonlara taşınması veya yeniden yazılması
- Eski `backend/docs` içeriğinin `backend/docs/legacy` altına alınması
- AGENT-CODEX ve DOC-HIERARCHY referanslarının yalnız docs/ üzerinden çalışır hale gelmesi

Hariç:
- Yeni business feature geliştirme
- Yeni entegrasyon kodu

## 4. ACCEPTANCE KRİTERLERİ

- [x] Backend’le ilgili dokümanlara erişmek için yalnızca `docs/` hiyerarşisinin kullanılması yeterlidir.
- [x] AGENT-CODEX.* ve DOC-HIERARCHY’nin referans verdiği her doküman fiziksel olarak `docs/` altında bulunur.
- [x] `backend/docs` altında yalnızca `legacy/` altındaki arşiv içerikleri kalır.

## 5. BAĞIMLILIKLAR

- NUMARALANDIRMA-STANDARDI.md ve DOCS-PROJECT-LAYOUT.md
- TECH-DESIGN-backend-docs-migration (`docs/02-architecture/services/backend-docs/TECH-DESIGN-backend-docs-migration.md`)
- AC-0001, TP-0001, ADR-0001 backend docs reorg dokümanları

## 6. ÖZET

- Eski `backend/docs` içeriği envanterlenmiş, yeni `docs/` hiyerarşisine taşınmış ve legacy olarak arşivlenmiştir.
- Agent ve ekipler için backend dokümantasyonu için tek giriş noktası `docs/` olmuştur.

## 7. LİNKLER (İSTEĞE BAĞLI)

- Acceptance: docs/03-delivery/ACCEPTANCE/AC-0001-backend-docs-refactor.md  
- ADR: docs/02-architecture/services/backend-docs/ADR/ADR-0001-backend-docs-reorg.md
