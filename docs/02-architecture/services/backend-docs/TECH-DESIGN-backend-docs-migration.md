# TECH-DESIGN – Backend Docs → Yeni docs/ Hiyerarşisine Taşıma

Amaç: Eski `backend/docs` ağacındaki dokümanları envanterleyip,
DOCS-PROJECT-LAYOUT.md ve NUMARALANDIRMA-STANDARDI.md ile uyumlu şekilde
`docs/` hiyerarşisine taşınma planını tanımlamak; bugün için kanonik kaynak
olarak sadece `docs/**` yapısını kullanmaktır.

-------------------------------------------------------------------------------
1. ENVANTER (YÜKSEK SEVİYE)
-------------------------------------------------------------------------------

Kaynak envanter (özet, bugün yalnız tarihçe amaçlıdır):

- Eski handbook, architecture, security, delivery, operations ve governance
  dokümanları `backend/docs/legacy/**` altında arşiv olarak tutulur.  
- Aktif ve kanonik içerik; layout, stil, story, acceptance, ADR, runbook ve
  API sözleşmeleri artık sadece `docs/**` altında yer alır.

-------------------------------------------------------------------------------
2. HEDEF KONUMLAR (YENİ docs/ HİYERARŞİSİ)
-------------------------------------------------------------------------------

Referans:
- docs/00-handbook/DOCS-PROJECT-LAYOUT.md
- NUMARALANDIRMA-STANDARDI.md

Mapping prensipleri:

- Genel kurallar / stil / layout:
  - Hedef: `docs/00-handbook/**`
  - Aksiyon: Var olan içerik zaten büyük ölçüde buraya taşındı; backend/docs altındaki
    eşdeğerler `backend/docs/legacy/00-handbook/**` altına alınacak (sadece arşiv).

- Sistem ve servis mimarisi (system overview, services, security):
  - Hedef: `docs/02-architecture/**`
  - Örnek:
    - 01-system/*.md → SYSTEM-OVERVIEW / SYSTEM-ARCHITECTURE altına özetlenir.
    - 03-services/*.md → services/<servis>/TECH-DESIGN-*.md / DATA-MODEL-*.md olarak yeniden yazılır.
    - 04-security/** → security ile ilgili TECH-DESIGN/ADR veya RUNBOOK/OPERATIONS dokümanlarına referans olur.

- Security / identity / vault rehberleri:
  - Hedef:  
    - Teknik mimari kısmı → `docs/02-architecture/**` (TECH-DESIGN + ADR)  
    - Operasyonel kısmı → `docs/04-operations/RUNBOOKS/**` ve MONITORING

- Delivery / CI / test stratejisi:
  - Hedef: `docs/03-delivery/**`
  - Örnek:
    - ci/** → TEST-PLAN veya operasyona yakınsa RUNBOOK notlarına referans.
    - testing/test-strategy.md → `docs/03-delivery/TEST-PLANS/TP-XXXX-*.md` içine taşınacak özet.

- Governance (story/spec/acceptance/feature-requests):
  - Hedef:  
    - Story’ler → `docs/03-delivery/STORIES/STORY-XXXX-*.md`  
    - Acceptance → `docs/03-delivery/ACCEPTANCE/AC-XXXX-*.md`  
    - Specs → `docs/02-architecture/**` (SPEC veya TECH-DESIGN olarak)  
    - PROJECT_FLOW → `docs/03-delivery/PROJECT-FLOW.md` ile birleştirilmiş görünüm.

- Runbook’lar:
  - Hedef: `docs/04-operations/RUNBOOKS/RB-<servis>.md`
  - Eski çok sayıda runbook, servis bazlı tekil RB dosyalarına konsolide edilecek.

- Agents:
  - Hedef: İlgili AGENT-CODEX.*.md dokümanlarında özet kurallar; detaylı “operasyon talimatı”
    niteliğindekiler RUNBOOK veya TECH-DESIGN altında referanslanacak.

-------------------------------------------------------------------------------
3. ADIMLAR (YÜKSEK SEVİYE PLAN)
-------------------------------------------------------------------------------

1) Envanterin detaylandırılması
   - backend/docs altındaki md dosyaları için kategori bazlı liste oluştur (handbook, story, acceptance, spec, runbook, guide, template, agent).

2) Mapping tablosu
   - Her önemli doc için şu alanlarla tablo hazırlanır:
     - Kaynak path
     - Tür (handbook/story/acceptance/spec/runbook/guide/template/agent/legacy)
     - Hedef path (docs/..)
     - Aksiyon (özetle, aynen taşı, legacy’ye al, birleştir, iptal)

-------------------------------------------------------------------------------
4. MAPPING TABLOSU – İLK DİLİM (Tarihi Örnek)
-------------------------------------------------------------------------------

| Kaynak path                                                        | Tür       | Hedef path                                  | Aksiyon                             |
|--------------------------------------------------------------------|-----------|---------------------------------------------|--------------------------------------|
| backend/docs/03-delivery/templates/01-rfc/feature-spec-template.md | template  | docs/99-templates/TECH-DESIGN.template.md   | İçerik yeni şablonla hizalı, legacy |
| backend/docs/03-delivery/templates/02-adr/adr-template.md          | template  | docs/99-templates/TECH-DESIGN.template.md   | ADR kısmı için referans, legacy     |
| backend/docs/03-delivery/templates/03-runbook/runbook-template.md  | template  | docs/99-templates/RUNBOOK.template.md       | Yeni RUNBOOK şablonu kullan, legacy |
| backend/docs/03-delivery/templates/05-release/release-checklist.md | template  | docs/99-templates/TEST-PLAN.template.md     | Release checklist’i test plana özet |
| backend/docs/03-delivery/templates/06-glossary/glossary-entry.md   | template  | (ileride) docs/03-delivery/guides/glossary  | Glossary formatı için rehbere özet  |

Notlar:
- Bu dilimdeki tüm eski template dosyaları `backend/docs/legacy/03-delivery/templates/**` altına alınacaktır.  
- Yeni doküman üretimi için yalnızca `docs/99-templates/**` altındaki şablonlar kullanılacaktır.

-------------------------------------------------------------------------------
5. MAPPING TABLOSU – RUNBOOKLAR (Tarihi Örnek)
-------------------------------------------------------------------------------

| Kaynak path                                                   | Tür      | Hedef path                                       | Aksiyon                                          |
|---------------------------------------------------------------|----------|--------------------------------------------------|--------------------------------------------------|
| backend/docs/legacy/04-operations/01-runbooks/77-vault-runbook.md   | runbook  | docs/04-operations/RUNBOOKS/RB-vault.md         | Yeni RB-vault oluştur, detaylar legacy’e referans|
| backend/docs/legacy/04-operations/01-runbooks/vault-*.md            | runbook  | docs/04-operations/RUNBOOKS/RB-vault.md         | Vault için tek runbook altında özetle, legacy    |
| backend/docs/legacy/04-operations/01-runbooks/52-mfe-access-runbook.md | runbook | docs/04-operations/RUNBOOKS/RB-mfe-access.md    | FE access için ayrı runbook, legacy’e referans   |
| backend/docs/legacy/04-operations/01-runbooks/keycloak-*.md         | runbook  | docs/04-operations/RUNBOOKS/RB-keycloak.md      | Keycloak için tek runbook altında özetle, legacy |
| backend/docs/legacy/04-operations/01-runbooks/54-unleash-flag-governance.md | guide/runbook | docs/04-operations/RUNBOOKS/RB-feature-flags.md | Feature flag yönetimi için operasyonel özet      |

Notlar:
- Detaylı operasyon adımları geçmişte backend/docs altında yazılmıştır; bugün
  için güncel ve kanonik runbook içerikleri yalnızca `docs/04-operations` altında
  tutulur.

-------------------------------------------------------------------------------
6. MAPPING TABLOSU – GUIDES (Tarihi Örnek)
-------------------------------------------------------------------------------

| Kaynak path                                   | Tür    | Hedef path                                   | Aksiyon                                  |
|-----------------------------------------------|--------|----------------------------------------------|-------------------------------------------|
| backend/docs/03-delivery/guides/*.md          | guide  | docs/03-delivery/guides/*.md                 | Yapı korunur, yeni docs/ altında tutulur  |
| backend/docs/03-delivery/guides/theme/*.md    | guide  | docs/03-delivery/guides/theme/*.md           | Tema/UX rehberleri olarak taşınır        |
| backend/docs/03-delivery/guides/releases/*.md | guide  | docs/03-delivery/TEST-PLANS/TP-XXXX-*.md     | İçerik release test planlarına özetlenir |

Notlar:
- Guides çoğunlukla konsept ve süreç anlatır; bire bir taşınırken sadece path’ler
  yeni docs/ yapısına uyarlanacaktır.

-------------------------------------------------------------------------------
7. MAPPING TABLOSU – GOVERNANCE (Tarihi Örnek)
-------------------------------------------------------------------------------

| Kaynak path                          | Tür        | Hedef path                                           | Aksiyon                                   |
|--------------------------------------|-----------|------------------------------------------------------|--------------------------------------------|
| backend/docs/05-governance/01-handbook/*.md | handbook  | docs/00-handbook/*.md                                | İçerik uygun handbook dosyalarına özetlenir|
| backend/docs/05-governance/02-stories/*.md  | story     | docs/03-delivery/STORIES/STORY-XXXX-*.md            | Yeni STORY-XXXX dosyalarına taşınır        |
| backend/docs/05-governance/04-adrs/*.md     | adr       | docs/02-architecture/services/<servis>/ADR/ADR-XXXX-*.md | Servis bazlı ADR dosyalarına bölünür  |
| backend/docs/05-governance/05-adr/*.md      | adr       | docs/02-architecture/services/<servis>/ADR/ADR-XXXX-*.md | Aynı şekilde ADR’lere taşınır         |
| backend/docs/05-governance/06-specs/*.md    | spec      | docs/02-architecture/** (SPEC veya TECH-DESIGN)      | İlgili servis/spec dokümanına özetlenir    |
| backend/docs/05-governance/07-acceptance/*.md | acceptance | docs/03-delivery/ACCEPTANCE/AC-XXXX-*.md           | Yeni acceptance dosyalarına taşınır        |
| backend/docs/05-governance/PROJECT_FLOW.md  | project   | docs/03-delivery/PROJECT-FLOW.md                     | Yeni PROJECT-FLOW ile birleştirilir        |

Notlar:
- Governance dokümanları, yeni STORY/AC/ADR/SPEC zinciriyle uyumlu olacak
  şekilde kademeli olarak taşınacaktır.

3) Taşıma fazı
   - Yeni dokümanları `docs/` altında oluştur:
     - STORY-XXXX, AC-XXXX, TP-XXXX, ADR-XXXX, RUNBOOK, TECH-DESIGN, DATA-MODEL.
   - Eski backend/docs dosyalarını:
     - ya `backend/docs/legacy/**` altına taşı,
     - ya tamamen `docs/` altındaki yeni dokümana referans veren kısa bir “migrated” notuna indir.

4) Temizlik ve doğrulama
   - NUMARALANDIRMA-STANDARDI.md’ye göre ID’ler ve dosya adları kontrol edilir.
   - PROJECT-FLOW ve DEV-GUIDE ile uyum doğrulanır.
   - backend/docs kökünde README güncellenerek “aktif dokümantasyon docs/ altında” notu eklenir.

-------------------------------------------------------------------------------
8. NOTLAR
-------------------------------------------------------------------------------

- Bu dosya, gerçek taşıma öncesi tasarım rehberi niteliğindedir; her doküman için
  detaylı mapping ayrı bir tablo veya ek dokümanla takip edilebilir.
- Taşıma sırasında acceptance kriterleri:  
  - STORY-0001-backend-docs-refactor  
  - AC-0001-backend-docs-refactor  
  - ADR-0001-backend-docs-reorg
