# Phase Governance — Proje Yönetim Parametreleri

> **Tarih:** 2026-03-20
> **Prensip:** Her faz, ölçülebilir kriterlere bağlıdır. Kriter karşılanmadan faz "DONE" ilan edilmez.
> **Kapsam:** F4 → F5 → F6 → F7
> **SSOT:** Bu dosya **tek authoritative kaynak**tır. Diğer dokümanlar (PLATFORM-ROADMAP.md, QUALITY-GATE.md, design-platform-roadmap.md) mirror'dır ve bu dosyayla çeliştiğinde bu dosya geçerlidir.

### Faz Durumu (Güncel)
| Faz | Durum | Son Doğrulama |
|-----|-------|--------------|
| F0 — Release Truth | ✅ DONE | 2026-03-20 (13/13 gate PASS — 14 total, 1 skippable: clean-tree; build + test + pack + publish + consumer smoke + visual regression + designlab:index) |
| F1 — Package Topology | ✅ DONE | 2026-03-20 (15 deep imports + boundary enforcement) |
| F2 — Foundation | ✅ DONE | 2026-03-20 (51 icon + 8 hook + token pipeline + axe-core) |
| F3 — Core Completeness | ✅ DONE | 2026-03-20 (0 deprecated + 95 contract + 86 dark mode contract + 5,321 tests + migration guide) |
| F4 — Enterprise X Suite | ⬜ Başlamadı | — |
| F5 — Blocks & App Kits | ⬜ Başlamadı | — |
| F6 — Docs & DX | ⬜ Başlamadı | — |
| F7 — Commercial Readiness | ⬜ Başlamadı | — |

---

## Temel Ölçüm Noktası (Baseline — 2026-03-20)

```
Test Dosyası:       224
Test Sayısı:      5,321
Primitives:          24
Components:          60
Patterns:            10
Icons:               51
Headless Hooks:       8
Contract Tests:      95 dosya (95/95 component kapsama)
Dark Mode Tests:     86 contract + 447 visual (149 scenarios × 3 browsers)
Visual Test:        447 (149 scenarios × 3 browsers: chromium, firefox, webkit)
Deep Imports:        15
Stories:             95/95 component (100% kapsama)
Release Gates:    14 total (1 skippable: clean-tree) — 13/13 PASS (canlı doğrulanmış)
Deprecated:           0 annotation (107 removed in F3)
Hardcoded Colors:     0 violation (12 dosya temizlendi)
Lint:             0 error, 147 warning (ESLint — non-blocking, quiet-green build/test)
Bundle (ESM):      4.1 MB
Bundle (CJS):      7.6 MB
```

---

## Faz Geçiş Protokolü

```
Her faz geçişi için ZORUNLU:
  1. Tüm "Tamamlanma Kriterleri" karşılanmış
  2. pre-release-check.mjs → 13/13 PASS (14 gates, 1 skippable: clean-tree)
  3. 0 test failure
  4. 0 lint error
  5. Bundle budget aşılmamış
  6. Dokümantasyon güncel (QUALITY-GATE.md, PLATFORM-ROADMAP.md)
  7. Risk matrisi güncel — tüm CRITICAL riskler çözülmüş
```

---

## F3 — Core Completeness (Kalan İş)

### Hedef
Styled core library %100 tutarlı, tüm deprecated API'ler temizlenmiş, v2.0.0 yayınlanabilir durumda.

### Adımlar

| # | Adım | Çıktı | Effort |
|---|---|---|---|
| F3.1 | Deprecated annotation audit — kategorize et | Her annotation için: sil / yeniden adlandır / codemod | S |
| F3.2 | Codemod güncelle — tüm deprecated dönüşümlerini kapsasın | `scripts/codemods/` genişlet | M |
| F3.3 | Consumer app'lerde codemod çalıştır + doğrula | 0 kırık import | M |
| F3.4 | 107 deprecated annotation'ı temizle | 0 @deprecated kaldı | M |
| F3.5 | v2.0.0 yayınla | Breaking change release + CHANGELOG | S |
| F3.6 | Migration guide güncelle | `docs/MIGRATION-NOTES.md` güncel | S |

### Tamamlanma Kriterleri

| Kriter | Ölçüm | Hedef |
|---|---|---|
| Deprecated annotation sayısı | `grep -rn "@deprecated" src \| wc -l` | 0 |
| Codemod kapsam | Tüm deprecated → yeni API dönüşümü | %100 |
| Test sayısı | `npx vitest run` | ≥ 5,321 ✅ |
| Build | `npm run build` | 0 error ✅ |
| Consumer smoke | `consumer-smoke.mjs` | PASS (SSR render + CJS) ✅ |
| Release gates | `pre-release-check.mjs` | 13/13 PASS (14 total, 1 skippable: clean-tree) ✅ |
| Migration guide | `docs/MIGRATION-NOTES.md` | v1→v2 tamam |

### Riskler

| Risk | Olasılık | Etki | Önlem |
|---|---|---|---|
| Consumer app'ler codemod sonrası kırılır | ORTA | YÜKSEK | Codemod'u önce dry-run, sonra apply. Her app için ayrı test. |
| Deprecated API'yi silen PR, consumer'ı bloklar | ORTA | YÜKSEK | Consumer'lar önce codemod ile güncellenir, sonra deprecated silinir. |
| v2.0.0 breaking change adoption'ı yavaş kalır | DÜŞÜK | ORTA | 6 ay önceden deprecation warning verildi. Codemod sağlandı. |

### Başarı Metriği
- **Lider gösterge:** Deprecated annotation sayısı → 0
- **Gecikme göstergesi:** Consumer app build'leri → yeşil

---

## Public API Taksonomi

### Export Yüzeyi Kararı

| Subpath | Tier | Semver Korumalı | Hedef Kullanıcı |
|---------|------|-----------------|-----------------|
| `@mfe/design-system` | Public | ✅ Evet | Tüm consumer'lar |
| `./primitives` | Public | ✅ Evet | UI geliştirme |
| `./components` | Public | ✅ Evet | UI geliştirme |
| `./patterns` | Public | ✅ Evet | Sayfa düzeni |
| `./tokens` | Public | ✅ Evet | Tema/styling |
| `./theme` | Public | ✅ Evet | Tema yönetimi |
| `./providers` | Public | ✅ Evet | Context sağlama |
| `./icons` | Public | ✅ Evet | İkonlar |
| `./a11y` | Public | ✅ Evet | A11y araçları |
| `./performance` | Public | ✅ Evet | Perf monitoring |
| `./headless` | Public | ✅ Evet | Headless hooks — custom component building |
| `./advanced` | Public | ✅ Evet | AG Grid / Charts entegrasyonu |
| `./advanced/data-grid/setup` | Public | ✅ Evet | AG Grid lisans + modül setup |
| `./internal/interaction-core` | **Internal** | ⚠️ Unstable | Sadece DS katkıcıları. `./headless` üzerinden erişin. |
| `./internal/overlay-engine` | **Internal** | ⚠️ Unstable | Sadece DS katkıcıları. `./headless` üzerinden erişin. |
| `./headless/overlay` | **Internal** | ⚠️ Unstable | `./headless` ile birleştirilecek (F4+) |

**Kural:** `./internal/*` export'ları semver koruması altında DEĞİLDİR. Bu API'ler `./headless` üzerinden public olarak sunulur. `./internal/*` doğrudan kullanım kendi riskinizedir.

**Stabilite Sinyalleri:**
- Her internal barrel dosyasında `@internal` + `@unstable` JSDoc marker'ı bulunur
- Development ortamında (`NODE_ENV === 'development'`) ilk import'ta `console.warn` uyarısı verilir
- Production build'lerde uyarı tree-shake ile kaldırılır
- Detaylı stability contract: `src/internal/README.md`

---

## F4 — Enterprise X Suite

### Hedef
Ağır enterprise yüzeyler (Grid maturity, Charts maturity, Scheduler, Kanban, Editor, FormBuilder) ayrı deep import olarak tamamlanmış, test edilmiş, belgelenmiş.

### Adımlar

| # | Adım | Çıktı | Effort | Bağımlılık |
|---|---|---|---|---|
| F4.1 | X-Grid recipe catalog genişlet | 30+ grid variant recipe | M | — |
| F4.2 | X-Grid server-side integration | SSP, SSF, SSS helper hooks | L | F4.1 |
| F4.3 | X-Grid export (CSV, Excel) | Export utility + UI | M | F4.1 |
| F4.4 | X-Charts theme integration | Dark mode, accent, density aware charts | M | — |
| F4.5 | X-Charts 10 chart type | Bar, Line, Area, Pie, Donut, Scatter, Heatmap, Treemap, Funnel, Radar | L | F4.4 |
| F4.6 | Scheduler — data model + hooks | Event CRUD, date range, collision | L | — |
| F4.7 | Scheduler — UI (haftalık/aylık/günlük) | 3 view mode | XL | F4.6 |
| F4.8 | Kanban — data model + hooks | Column/card CRUD, drag state | L | — |
| F4.9 | Kanban — UI (board + swimlane) | Drag-drop board | XL | F4.8 |
| F4.10 | Rich Text Editor | Tiptap integration, toolbar, mention, slash | XL | — |
| F4.11 | Form Builder — schema engine | JSON schema → form rendering | L | — |
| F4.12 | Form Builder — designer UI | Drag-drop field placer | XL | F4.11 |
| F4.13 | Tüm X paketi testleri + docs | Her X modülü: test + story + doc | L | F4.1-12 |

### Tamamlanma Kriterleri

| Kriter | Ölçüm | Hedef |
|---|---|---|
| Grid recipe sayısı | `find src/advanced -name "*.recipe.*" \| wc -l` | ≥ 30 |
| Chart türü sayısı | Unique chart component count | ≥ 10 |
| Scheduler view | Haftalık + Aylık + Günlük render | 3 view |
| Kanban | Drag-drop çalışıyor, swimlane desteği | ✅ |
| Editor | Rich text + mention + slash command | ✅ |
| FormBuilder | JSON → form render + conditional logic | ✅ |
| Her X modülü bundle | Ayrı deep import, gzip < 100KB (grid hariç) | ✅ |
| Test sayısı | `npx vitest run` | ≥ 4800 |
| Story sayısı | `find src -name "*.stories.tsx" \| wc -l` | ≥ 120 |
| Release gates | `pre-release-check.mjs` | 13/13 PASS |

### Riskler

| Risk | Olasılık | Etki | Önlem |
|---|---|---|---|
| Tiptap/ProseMirror bundle size patlaması | YÜKSEK | YÜKSEK | Lazy loading + code splitting. Editor ayrı deep import. Budget: < 150KB gzip. |
| Drag-drop kütüphane seçimi (Kanban) | ORTA | ORTA | @dnd-kit veya native HTML5 DnD. Poc ile karar verilecek. |
| AG Grid lisans maliyeti artarsa | DÜŞÜK | YÜKSEK | Abstraction layer mevcut. Gerekirse TanStack Table'a geçiş mümkün. |
| Scheduler karmaşıklığı scope creep | YÜKSEK | ORTA | MVP: sadece haftalık/aylık view + event CRUD. Gantt F5'e taşınır. |
| Overlay engine Kanban drag sırasında conflict | ORTA | ORTA | Drag sırasında overlay'i devre dışı bırak. Layer stack priority. |

### Başarı Metriği
- **Lider gösterge:** X modülü sayısı → 6 (grid, charts, scheduler, kanban, editor, formbuilder)
- **Gecikme göstergesi:** Enterprise demo app çalışıyor (tüm X modülleri entegre)

---

## F5 — Blocks & App Kits

### Hedef
Copy-paste ready uygulama blokları, starter template'ler ve CLI scaffold aracı.

### Adımlar

| # | Adım | Çıktı | Effort | Bağımlılık |
|---|---|---|---|---|
| F5.1 | Block mimarisi — Block interface + registry | Block contract type, block manifest | M | F4 done |
| F5.2 | Dashboard blocks (4) | MetricCard, ChartPanel, ActivityFeed, KPIGrid | L | F5.1 |
| F5.3 | CRUD blocks (4) | ListBlock, FilterBlock, DetailBlock, FormBlock | L | F5.1 |
| F5.4 | Admin blocks (3) | SettingsPanel, UserManagement, RoleMatrix | L | F5.1 |
| F5.5 | Review blocks (3) | ApprovalFlow, AuditTimeline, ComparisonView | L | F5.1 |
| F5.6 | Starter template: Dashboard | Template + scaffold script | M | F5.2 |
| F5.7 | Starter template: CRUD App | Template + scaffold script | M | F5.3 |
| F5.8 | Starter template: Admin Panel | Template + scaffold script | M | F5.4 |
| F5.9 | `npx @mfe/create-app` CLI | Interactive scaffold, template seçimi | L | F5.6-8 |
| F5.10 | Block catalog + registry UI | Searchable, previewable | M | F5.2-5 |

### Tamamlanma Kriterleri

| Kriter | Ölçüm | Hedef |
|---|---|---|
| Block sayısı | Unique block components | ≥ 14 |
| Template sayısı | Working scaffold templates | ≥ 3 |
| CLI | `npx @mfe/create-app` → working app | ✅ |
| Her block dark mode | Dark mode test PASS | %100 |
| Her block responsive | Mobile + desktop render | %100 |
| Her block a11y | axe-core 0 violation | %100 |
| Test sayısı | Toplam | ≥ 5200 |
| Release gates | `pre-release-check.mjs` | 13/13 PASS |

### Riskler

| Risk | Olasılık | Etki | Önlem |
|---|---|---|---|
| Block'lar arası coupling (A block'u B block'a bağımlı) | ORTA | YÜKSEK | Her block izole. Dependency sadece aşağı katmana. Block interface contract. |
| Template maintenance yükü (React versiyon upgrade vb.) | ORTA | ORTA | Template'i minimal tut. Core logic block'ta, template sadece layout. |
| CLI cross-platform uyumsuzluk (Windows/macOS/Linux) | DÜŞÜK | ORTA | Node.js 18+ hedefle. `fs/path` cross-platform API'ler. CI'da 3 OS test. |

### Başarı Metriği
- **Lider gösterge:** `npx @mfe/create-app` → 5 dakikada çalışan app
- **Gecikme göstergesi:** İlk 3 ayda 10+ internal proje scaffold kullanıyor

---

## F6 — Docs & DX

### Hedef
Tek birleşik docs portal, live playground, component selection guide, migration assistant.

### Adımlar

| # | Adım | Çıktı | Effort | Bağımlılık |
|---|---|---|---|---|
| F6.1 | Docs portal altyapısı | Nextra/Docusaurus/VitePress seçimi + setup | M | — |
| F6.2 | Component docs — otomatik API reference | Props table, examples, code | L | F6.1 |
| F6.3 | Live playground (StackBlitz/CodeSandbox) | Her component'te "Try it" button | L | F6.1 |
| F6.4 | Interactive examples | Editable props + live preview | L | F6.3 |
| F6.5 | Component selection guide | "Ne yapacaksan → bu component'i kullan" karar ağacı | M | F6.1 |
| F6.6 | Learning tracks (5) | Form building, data display, overlay, layout, enterprise | L | F6.1 |
| F6.7 | Migration assistant CLI | `npx @mfe/migrate v1 v2` → otomatik guide | M | F3.6 |
| F6.8 | Figma ↔ Code sync | Token pipeline Figma export | L | — |
| F6.9 | Versioned docs | v1 / v2 ayrı URL | M | F6.1 |

### Tamamlanma Kriterleri

| Kriter | Ölçüm | Hedef |
|---|---|---|
| Docs portal | Public URL, search çalışıyor | ✅ |
| Interactive examples | Unique example count | ≥ 50 |
| Learning tracks | Track sayısı | ≥ 5 |
| Migration CLI | v1→v2 guide çıktısı | ✅ |
| Selection guide | Karar ağacı %90+ use case kapsar | ✅ |
| Figma sync | Token export çalışıyor | ✅ |
| Docs page count | Unique pages | ≥ 100 |

### Riskler

| Risk | Olasılık | Etki | Önlem |
|---|---|---|---|
| Docs framework seçimi yanlış → sonra göç gerekir | ORTA | YÜKSEK | PoC: VitePress + Nextra benchmark. MDX uyumu test et. |
| Live playground yavaş kalır (StackBlitz cold start) | DÜŞÜK | ORTA | CodeSandbox alternatif. Fallback: statik preview. |
| Docs bakım yükü (her component değişikliğinde güncelle) | YÜKSEK | ORTA | API ref otomatik üretilsin. Manual sadece "why" bölümleri. |
| Figma plugin geliştirme effort'u beklenenden büyük | ORTA | DÜŞÜK | İlk adım: token JSON export. Plugin F7'ye taşınabilir. |

### Başarı Metriği
- **Lider gösterge:** Docs portal bounce rate < %30
- **Gecikme göstergesi:** Yeni geliştirici onboarding süresi < 2 saat

---

## F7 — Commercial Readiness

### Hedef
Enterprise-grade governance, support, security, release cadence ve adoption telemetry.

### Adımlar

| # | Adım | Çıktı | Effort | Bağımlılık |
|---|---|---|---|---|
| F7.1 | Release channels (Canary/Stable/LTS) | CI pipeline + npm dist-tags | L | — |
| F7.2 | Conventional commits + auto CHANGELOG | commitlint + changelog generator | M | F7.1 |
| F7.3 | Support policy document | Response times, escalation, SLA | S | — |
| F7.4 | Security policy | Vulnerability disclosure process | S | — |
| F7.5 | RFC process | Proposal template + review workflow | M | — |
| F7.6 | Adoption telemetry (opt-in) | Usage tracking dashboard | L | — |
| F7.7 | Breaking change policy | 6 ay deprecation window, codemod zorunlu | S | F3.2 |
| F7.8 | İlk LTS release | v2.x.x LTS | M | F7.1 |

### Tamamlanma Kriterleri

| Kriter | Ölçüm | Hedef |
|---|---|---|
| Release channels | Canary + Stable + LTS dist-tags | 3 |
| LTS release | npm'de LTS tag'li versiyon | ≥ 1 |
| Support SLA | Documented response times | ✅ |
| Security policy | Published disclosure process | ✅ |
| RFC process | Completed RFC | ≥ 3 |
| Adoption metrics | Dashboard with real data | ✅ |
| Breaking change policy | 6 ay window documented | ✅ |
| CHANGELOG | Otomatik üretim çalışıyor | ✅ |

### Riskler

| Risk | Olasılık | Etki | Önlem |
|---|---|---|---|
| LTS bakım yükü (security patch eski versiyona) | YÜKSEK | ORTA | LTS sadece critical/security patch. Feature freeze. Max 12 ay LTS. |
| Adoption telemetry GDPR/privacy endişesi | ORTA | YÜKSEK | Strictly opt-in. Sadece component usage count (no PII). |
| RFC process bürokratikleşir → yavaşlık | ORTA | ORTA | RFC sadece breaking change + yeni X modülü için zorunlu. Minor change RFC gerektirmez. |

### Başarı Metriği
- **Lider gösterge:** LTS release yayınlandı
- **Gecikme göstergesi:** 3+ RFC tamamlandı, adoption dashboard aktif

---

## Risk Sınıflandırma Referansı

| Seviye | Tanım | Aksiyon |
|---|---|---|
| **CRITICAL** | Faz ilerleyemez, sistem kırık | HEMEN çöz. Diğer iş durur. |
| **YÜKSEK** | Fazı geciktirebilir veya kaliteyi düşürür | Sprint içinde çöz. Mitigation planı zorunlu. |
| **ORTA** | Yönetilebilir ama dikkat gerektirir | Sprint planlama'da ele al. Watchlist'te tut. |
| **DÜŞÜK** | Bilinmesi yeterli, aktif aksiyon gerekmez | Kayıt altına al. Gerekirse backlog'a ekle. |

---

## Effort Referansı

| Etiket | Tanım |
|---|---|
| **S** | 1-2 saat. Tek dosya/script değişikliği. |
| **M** | 4-8 saat. Birden fazla dosya, test, doc. |
| **L** | 1-3 gün. Yeni modül veya major refactor. |
| **XL** | 3-7 gün. Tamamen yeni sistem (Scheduler, Editor vb.). |

---

## Faz Durumu Özet Tablosu

| Faz | Durum | Test | Component | Risk |
|---|---|---|---|---|
| F0 | ✅ DONE | 5,321 (baseline) | 95 contract | — |
| F1 | ✅ DONE | — | 15 deep import + boundary | — |
| F2 | ✅ DONE | — | 51 icon + 8 hook + token | — |
| F3 | ✅ DONE | 5,321 (224 dosya) | 0 deprecated, v2.0.0 ready, 95/95 stories | — |
| F4 | ⬜ Sırada | — | +6 X modül hedef | ⚠️ Tiptap bundle, drag-drop seçimi |
| F5 | ⬜ Bekliyor | — | +14 block, 3 template | ⚠️ block coupling |
| F6 | ⬜ Bekliyor | — | docs portal | ⚠️ framework seçimi |
| F7 | ⬜ Bekliyor | — | governance | ⚠️ LTS bakım yükü |

---

## Sonraki Aksiyonlar

1. **F3 DONE → F4 başla:** X-Grid recipes + X-Charts theme (paralel çalışılabilir)
2. **F4 ortası → F4 XL items:** Scheduler, Kanban, Editor (en yüksek effort)
3. **F4 DONE → F5:** Blocks & App Kits
