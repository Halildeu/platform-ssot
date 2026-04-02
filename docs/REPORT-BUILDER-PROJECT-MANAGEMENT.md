# Report Builder Platform — Proje Yönetimi

## Proje Özeti

| Alan | Değer |
|------|-------|
| Proje Adı | Report Builder Platform |
| Başlangıç | 2026-04-02 |
| Sponsor | Platform Engineering |
| Teknik Lider | — |
| Durum | Planlama Tamamlandı, Faz 0 Bekleniyor |

## Hedefler (OKR)

### Objective 1: Self-Service Rapor Oluşturma
| Key Result | Ölçüm | Hedef |
|-----------|-------|-------|
| KR1.1 | Teknik olmayan kullanıcı wizard ile rapor oluşturabilir | %80 başarı oranı (kullanıcı testi) |
| KR1.2 | Yeni rapor oluşturma süresi | < 10 dakika (basit), < 30 dakika (karmaşık) |
| KR1.3 | Sıfır kod ile rapor oluşturma | Wizard + canvas yeterli, kod yazmaya gerek yok |

### Objective 2: Database-Agnostic Platform
| Key Result | Ölçüm | Hedef |
|-----------|-------|-------|
| KR2.1 | Desteklenen DB sayısı | ≥ 3 (MSSQL + PostgreSQL + MySQL) |
| KR2.2 | Yeni DB ekleme süresi | < 1 gün (driver + schema extractor) |
| KR2.3 | Workcube 3-tier tam destek | Shared + company + yearly schema'lar çalışır |

### Objective 3: Rakip Parite + Farklılaşma
| Key Result | Ölçüm | Hedef |
|-----------|-------|-------|
| KR3.1 | Metabase feature parite skoru | ≥ 90% |
| KR3.2 | Looker semantic layer parite | Metrik katmanı çalışır |
| KR3.3 | Farklılaşma skoru (iç değerlendirme) | ≥ 3 benzersiz özellik (Schema-first, Column type system, Design Lab native) |

### Objective 4: Enterprise Kalite
| Key Result | Ölçüm | Hedef |
|-----------|-------|-------|
| KR4.1 | Test coverage | ≥ 80% (unit + integration) |
| KR4.2 | Graceful degradation | Schema-service kapalıyken sıfır hata |
| KR4.3 | Performance — grid render | < 500ms (50 satır, 10 sütun) |
| KR4.4 | Performance — wizard açılma | < 2s (schema yükleme dahil) |
| KR4.5 | A11y (WCAG 2.1 AA) | Tüm yeni bileşenler |

## Milestone'lar ve Timeline

### M0: Foundation (Hafta 1-2)
**Faz:** 0-1
**Çıktı:** Shared schema types, data source abstraction, sourceTables hook
**Teslim kriteri:**
- [ ] `@mfe/shared-types`'ta schema tipleri export ediliyor
- [ ] Schema Explorer shared types kullanıyor (testler geçiyor)
- [ ] `useReportSchemaContext` hook çalışıyor (mock + live)
- [ ] En az 1 rapor modülü `sourceTables` ile annotated
- [ ] Schema-service kapalıyken sıfır hata (graceful degradation)

### M1: Smart Grid (Hafta 3-4)
**Faz:** 2-5
**Çıktı:** Otomatik sütun tipi, lineage tooltip, ilişkili raporlar, FK drill-down, ID→isim
**Teslim kriteri:**
- [ ] SQL tip → ColumnMeta columnType otomatik çıkarım (20+ tip)
- [ ] Sütun header tooltip'te kaynak tablo.sütun bilgisi
- [ ] Sidebar'da "İlişkili Raporlar" bölümü (ortak tablo bazlı)
- [ ] FK sütun tıklanınca ilgili rapora filtreli navigasyon
- [ ] ID alanlarında isim gösterimi (COMPANY_ID → "ABC Ltd.")
- [ ] Backend `/api/v1/schema/lookup` endpoint çalışıyor
- [ ] 30+ unit test (mapper, enrichment, index, resolver)

### M2: Report Builder Wizard (Hafta 5-7)
**Faz:** 6
**Çıktı:** 8 adımlı wizard ile rapor oluşturma
**Teslim kriteri:**
- [ ] Data source seçimi çalışıyor
- [ ] Schema/tier seçimi çalışıyor (Workcube multi-tier dahil)
- [ ] Tablo seçimi — domain filtre + arama
- [ ] Sütun seçimi — SQL tipi + PK/FK badge
- [ ] FK tablo keşfi — join path ile N-hop
- [ ] ID→isim lookup konfigürasyonu
- [ ] Sütun tipi ayarlama (auto-infer + manual override)
- [ ] Filtre tanımlama
- [ ] Canlı önizleme (gerçek veri)
- [ ] Kaydet → dynamic report olarak çalışır
- [ ] 10 yeni Design Lab bileşeni (Storybook story + contract test)
- [ ] Kullanıcı testi: 5 kişi, %80 başarı

### M3: Visual Designer (Hafta 8-9)
**Faz:** 7-8
**Çıktı:** Drag & drop canvas + rapor düzenleme
**Teslim kriteri:**
- [ ] Tablo ağacından sütun sürükle-bırak
- [ ] Sütun sırası değiştirme
- [ ] Özellikler paneli çalışıyor
- [ ] Canlı önizleme sürükle-bırak ile güncelleniyor
- [ ] Mevcut rapor düzenleme — pre-populated wizard/canvas
- [ ] Versiyon yönetimi — her kayıt version bump
- [ ] Geri alma çalışıyor

### M4: Enterprise Features (Hafta 10-13)
**Faz:** 9-13
**Çıktı:** Semantic layer, calculated fields, alerting, scheduling, embed, caching
**Teslim kriteri:**
- [ ] Metrik tanımlama ve raporda kullanma
- [ ] Hesaplanmış alan formül motoru
- [ ] Alert kural tanımlama + threshold bildirimi
- [ ] Zamanlanmış rapor email/Slack
- [ ] Embed: iframe + JWT token
- [ ] Yorum ve paylaşım
- [ ] Query cache (TTL + incremental)

## Definition of Done (DoD) — Her Faz İçin

### Kod Kalitesi
- [ ] TypeScript strict mode — sıfır `any` (zorunlu generic hariç)
- [ ] Ruff/ESLint — sıfır warning
- [ ] Dosya < 400 satır (script-budget)
- [ ] Public fonksiyonlarda JSDoc
- [ ] `@mfe/design-system` bileşenleri kullanılmış (dış kütüphane yasak)

### Test
- [ ] Her yeni utility: unit test (≥ 3 case)
- [ ] Her yeni bileşen: contract test + Storybook story
- [ ] Her yeni hook: mock + live test
- [ ] Graceful degradation testi (service kapalıyken)
- [ ] Mevcut testler kırılmamış

### i18n
- [ ] Tüm kullanıcıya görünen metinler i18n key ile
- [ ] TR çeviri eklenmiş
- [ ] EN fallback var

### A11y
- [ ] Keyboard navigasyon çalışıyor
- [ ] Screen reader uyumlu (aria-label, role)
- [ ] Renk kontrastı WCAG AA

### Performans
- [ ] İlk yükleme < 2s (LCP)
- [ ] Grid render < 500ms (50 satır)
- [ ] Network çağrıları cached (React Query)
- [ ] Lazy loading uygulanmış (wizard step'leri)

### Dokümantasyon
- [ ] Yeni API endpoint → Swagger/OpenAPI
- [ ] Yeni bileşen → Design Lab'da görünür
- [ ] Yeni tip → shared-types'ta JSDoc

### Review
- [ ] PR açılmış, CI geçmiş
- [ ] En az 1 review (self veya AI)
- [ ] Merge conflict yok

## Risk Matrisi

### Teknik Riskler

| # | Risk | Olasılık | Etki | Mitigasyon |
|---|------|---------|------|-----------|
| R1 | Schema-service 5000+ tabloda yavaş | Orta | Yüksek | React Query 60dk cache, virtualized list, lazy search |
| R2 | FK relationship keşfi yanlış pozitif | Yüksek | Orta | Confidence score filtreleme (< 0.7 gizle), manual override |
| R3 | Multi-DB driver uyumsuzluğu | Orta | Yüksek | Soyutlama katmanı (DataSource interface), her DB ayrı driver testi |
| R4 | Workcube 3-tier schema resolution karmaşık | Düşük | Yüksek | SchemaResolver util ile tier otomatik seçim, fallback |
| R5 | Column type inference hatası | Orta | Düşük | Inference asla explicit override etmez, manual override her zaman mümkün |
| R6 | Wizard state kaybı (uzun session) | Düşük | Orta | localStorage persist, auto-save her adımda |
| R7 | Concurrent rapor düzenleme çakışması | Düşük | Orta | Optimistic locking (version field), conflict dialog |
| R8 | Embed güvenlik açığı | Düşük | Kritik | JWT token + domain whitelist + CSP header |

### Proje Riskleri

| # | Risk | Olasılık | Etki | Mitigasyon |
|---|------|---------|------|-----------|
| P1 | Backend API'ler hazır değil (lookup, save) | Yüksek | Yüksek | Mock API ile frontend geliştirme, backend paralel |
| P2 | Design Lab bileşen geliştirme darboğaz | Orta | Yüksek | Wizard önce mevcut bileşenlerle, DL bileşenler sonra refine |
| P3 | Scope creep — her fazda yeni istek | Yüksek | Orta | Faz bazlı DoD strict, ek istekler sonraki faza |
| P4 | Performans testi geç kalma | Orta | Yüksek | Her milestone sonunda performans benchmark |
| P5 | Kullanıcı testi yapılmama | Orta | Yüksek | M2'de zorunlu 5 kişi kullanıcı testi |

### Bağımlılık Riskleri

| # | Risk | Bağımlılık | Mitigasyon |
|---|------|-----------|-----------|
| D1 | Schema-service değişiklik gerekli | Backend team | Faz 0-4 mevcut API yeterli, Faz 5+ yeni endpoint |
| D2 | `@mfe/shared-types` release | Platform team | Monorepo — aynı PR'da değiştirilebilir |
| D3 | AG Grid lisans/versiyon | 3rd party | v34 pinned, breaking change riski düşük |
| D4 | Design Lab phase-governance | Design team | Yeni bileşenler DL governance'a uygun olmalı |

## Başarı Kriterleri (Proje Geneli)

### Fonksiyonel
- [ ] Teknik olmayan kullanıcı (İK, Finans) wizard ile rapor oluşturabilir
- [ ] Mevcut tüm raporlar skeleton üzerinden çalışır (geriye uyumluluk)
- [ ] Yeni rapor = sıfır kod (wizard + canvas yeterli)
- [ ] ID alanlarında kullanıcı dostu isimler (FK lookup)
- [ ] Tablo ilişkileri otomatik keşfedilir ve navigasyon sağlanır
- [ ] Rapor versiyonlanır, geri alınabilir
- [ ] Schema-service kapalıyken platform %100 çalışır

### Non-Fonksiyonel
- [ ] Grid render < 500ms
- [ ] Wizard < 2s açılma
- [ ] %80+ test coverage
- [ ] WCAG 2.1 AA uyumlu
- [ ] 3+ desteklenen veritabanı
- [ ] Tüm metinler i18n destekli (TR + EN)

### İş Değeri
- [ ] Rapor oluşturma süresi %70 azalma (developer → end-user)
- [ ] IT bağımlılığı azalma (self-service)
- [ ] Tutarlı metrikler (semantic layer ile)
- [ ] Veri keşfi hızlanma (schema-first ile)

## Test Stratejisi

### Katmanlar

```
E2E (Playwright)
  ↓
Integration (Vitest + React Testing Library)
  ↓
Component (Vitest + jsdom)
  ↓
Unit (Vitest — pure functions)
```

### Faz Bazlı Test Gereksinimleri

| Faz | Unit | Component | Integration | E2E |
|-----|------|-----------|-------------|-----|
| 0 | Tip exportları compile eder | — | Schema Explorer import çalışır | — |
| 1 | — | — | useReportSchemaContext mock/live | Schema kapalıyken rapor açılır |
| 2 | schemaColumnMapper (20+ tip), enrichColumnsWithSchema | SchemaLineageTooltip render | — | Tooltip görünür |
| 3 | reportTableIndex, domainCategoryMapper | RelatedReportsSidebar | — | Sidebar'da ilişkili rapor |
| 4 | — | FkDrillDownCell link/text | — | FK tıklama → navigasyon |
| 5 | fkLookupResolver | — | useFkLookup batch fetch | ID → isim grid'de |
| 6 | generateReportConfig | Wizard step'leri render + interaction | Wizard → save → çalışır | Full wizard flow |
| 7 | — | Canvas drag & drop | — | Sürükle-bırak + kaydet |
| 8 | — | Düzenleme pre-populate | Düzenle → kaydet → güncel | Full edit flow |
| 9 | evaluateMetric | MetricSelector | Metrik → rapor | — |
| 10 | expressionParser | AddCalculatedFieldStep | Formül → sütun | — |
| 11 | — | AlertsStep, ScheduleStep | Alert trigger | Alert email gönderilir |
| 12 | — | EmbedRoute, ShareDialog | Embed token doğrulama | iframe render |
| 13 | — | — | Cache hit/miss | — |

### Performans Testi

| Senaryo | Araç | Threshold |
|---------|------|----------|
| Grid 50 satır render | Vitest benchmark | < 500ms |
| Grid 1000 satır SSRM | Playwright | < 2s first page |
| Wizard açılma (5000 tablo schema) | Playwright | < 2s |
| Schema snapshot fetch + cache | Vitest | < 200ms (cache hit) |
| FK lookup batch (100 ID) | Vitest | < 500ms |

### Regression Testi

- Mevcut 63 column-system testi her PR'da çalışır
- Mevcut report-preferences testi kırılmamış
- admin/users grid aynen çalışır (visual regression)
- 4 static rapor modülü kırılmamış

## RACI Matrisi

| Aktivite | Responsible | Accountable | Consulted | Informed |
|----------|-----------|-------------|-----------|----------|
| Shared types tasarımı | Frontend Dev | Tech Lead | Backend Dev | PM |
| Schema Explorer refactor | Frontend Dev | Tech Lead | — | PM |
| Wizard UI geliştirme | Frontend Dev | Tech Lead | UX | PM |
| Design Lab bileşenler | Frontend Dev | DL Owner | UX | PM |
| Backend API (lookup, save) | Backend Dev | Tech Lead | Frontend Dev | PM |
| DB driver ekleme | Backend Dev | Tech Lead | DBA | PM |
| Kullanıcı testi | QA / UX | PM | Frontend Dev | Tech Lead |
| Performans testi | Frontend Dev | Tech Lead | DevOps | PM |
| Güvenlik review (embed) | SecOps | Tech Lead | Frontend Dev | PM |

## Değişiklik Yönetimi

### Faz İçi Değişiklik
- DoD'daki maddeler değişmez — yeni ekleme sonraki faza
- Bug fix: aynı faz içinde
- Feature request: backlog'a, sonraki faz değerlendirmesi

### Faz Arası Değişiklik
- Önceki fazın DoD'u tamamlanmadan sonraki faza geçilmez
- Blokaj varsa: mitigasyon planı yazılır, risk matrisine eklenir
- Faz atlanamaz (bağımlılık grafiği zorunlu)

## Takip ve Raporlama

### Haftalık
- Faz ilerleme yüzdesi
- Tamamlanan / kalan DoD maddeleri
- Yeni riskler
- Blocker'lar

### Milestone Sonunda
- Demo (canlı gösterim)
- Performans benchmark sonuçları
- Test coverage raporu
- Kullanıcı testi sonuçları (M2, M3)
- Retrospektif — ne iyi gitti, ne iyileştirilmeli

### Metrikler

| Metrik | Araç | Frekans |
|--------|------|---------|
| Test coverage | Vitest --coverage | Her PR |
| Bundle size | Vite build | Her PR |
| Performance (LCP, FID) | Lighthouse CI | Haftalık |
| PR merge time | GitHub API | Haftalık |
| Open bugs | GitHub Issues | Haftalık |
| DoD completion rate | Manual | Milestone sonunda |
