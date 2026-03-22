# Phase Governance — Proje Yönetim Parametreleri

> **Tarih:** 2026-03-22
> **Prensip:** Her faz, ölçülebilir kriterlere bağlıdır. Kriter karşılanmadan faz "DONE" ilan edilmez.
> **Kapsam:** F4 → F5 → F6 → F7 → F8
> **Vizyon:** Dünya standardı AI-native design system liderliği. Ant Design / MUI / shadcn/ui'ı geçmek.
> **SSOT:** Bu dosya **tek authoritative kaynak**tır. Diğer dokümanlar (PLATFORM-ROADMAP.md, QUALITY-GATE.md, design-platform-roadmap.md) mirror'dır ve bu dosyayla çeliştiğinde bu dosya geçerlidir.

### Faz Durumu (Güncel)
| Faz | Durum | Son Doğrulama |
|-----|-------|--------------|
| F0 — Release Truth | ✅ DONE | 2026-03-20 (13/13 gate PASS — 14 total, 1 skippable: clean-tree; build + test + pack + publish + consumer smoke + visual regression + designlab:index) |
| F1 — Package Topology | ✅ DONE | 2026-03-20 (15 deep imports + boundary enforcement) |
| F2 — Foundation | ✅ DONE | 2026-03-20 (51 icon + 8 hook + token pipeline + axe-core) |
| F3 — Core Completeness | ✅ DONE | 2026-03-20 (0 deprecated + 95 contract + 86 dark mode contract + 5,321 tests + migration guide) |
| F4 — Gap Closer & Enterprise Suite | ⬜ Başlamadı | — |
| F5 — AI-First Leapfrog | ⬜ Bekliyor (F4 done) | — |
| F6 — DX & Ecosystem | ⬜ Bekliyor (F5 done) | — |
| F7 — Commercial Hardening | ⬜ Bekliyor (F6 done) | — |
| F8 — AI Runtime Intelligence | ⬜ Bekliyor (F7 done) | — |

### Rekabet Hedef Skorkartı (/60)
| Boyut | Şimdi | F4 | F5 | F8 | Ant | MUI |
|-------|:---:|:---:|:---:|:---:|:---:|:---:|
| Bileşen genişliği | 4 | 5 | 5 | 5 | 5 | 4 |
| Enterprise derinlik | 5 | 5 | 5 | 5 | 4 | 5 |
| Token & Theming | 5 | 5 | 5 | 5 | 4 | 4 |
| Accessibility | 4 | 5 | 5 | 5 | 4 | 4 |
| Docs & DX | 4 | 4 | 4 | 5 | 5 | 5 |
| Test coverage | 4 | 5 | 5 | 5 | 5 | 5 |
| Form sistemi | 1 | 4 | 4 | 5 | 5 | 2 |
| Animasyon | 2 | 4 | 4 | 4 | 4 | 3 |
| Data grid | 5 | 5 | 5 | 5 | 3 | 4 |
| SSR/RSC | 4 | 4 | 5 | 5 | 3 | 4 |
| Bundle opt. | 4 | 5 | 5 | 5 | 3 | 4 |
| **AI-native** | 3 | 3 | 5 | 5 | 0 | 0 |
| **Toplam** | **45** | **50** | **52** | **55** | **45** | **44** |

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

## F4 — Gap Closer & Enterprise Suite (~12 hafta)

### Hedef
Rekabet gap'lerini kapat (form validation, animation, RTL) + ağır enterprise yüzeyler (Scheduler, Kanban, Editor, FormBuilder) tamamla. F4 sonunda rakip skorunu 50/60'a çıkar.

### 4A — Form Validation Adapter (Hafta 1-3)

| # | Adım | Çıktı | Effort |
|---|---|---|---|
| F4A.1 | `src/form/` deep import oluştur | `@mfe/design-system/form` entry point | M |
| F4A.2 | `useFormField()` hook | react-hook-form + zod adapter | L |
| F4A.3 | `FormProvider` | ThemeProvider ile entegre form context | M |
| F4A.4 | `createFormSchema()` | DS field types → Zod types builder | L |
| F4A.5 | Tüm field bileşenlerini Controller-uyumlu yap | Input, Select, Checkbox, DatePicker, Combobox, Radio, Switch, Slider, Upload | L |
| F4A.6 | `AdaptiveForm` güncelle | External validation engine desteği | M |
| F4A.7 | 15+ form recipe | Login, CRUD, wizard, conditional, array fields | L |

**Peer deps:** `react-hook-form`, `zod` (consumer tarafında install)
**Bundle budget:** form module ≤ 45KB (peer dep'ler hariç)

### 4B — Motion & Animation System (Hafta 2-4)

| # | Adım | Çıktı | Effort |
|---|---|---|---|
| F4B.1 | `src/motion/` deep import oluştur | `@mfe/design-system/motion` entry point | M |
| F4B.2 | `AnimatePresence` | Mount/unmount animasyonları | L |
| F4B.3 | `useMotion()` hook | Token-driven animasyon (duration + easing consume) | M |
| F4B.4 | `Transition` component | Enter/exit/layout transitions | L |
| F4B.5 | `StaggerGroup` | Sıralı çocuk animasyonu | M |
| F4B.6 | Overlay entegrasyonu | Modal, Dialog, Drawer, Popover, Tooltip, Dropdown → enter/exit | L |
| F4B.7 | `prefers-reduced-motion` saygı | Motion token instant'a düşer | S |

**Strateji:** Zero-dependency — Web Animations API + CSS transitions. Framer Motion opsiyonel peer dep.
**Bundle budget:** motion module ≤ 12KB

### 4C — RTL & Logical CSS Migration (Hafta 3-5)

| # | Adım | Çıktı | Effort |
|---|---|---|---|
| F4C.1 | Physical → logical CSS migration | 84+ bileşen: ml→ms, mr→me, pl→ps, pr→pe, left→inline-start | XL |
| F4C.2 | `DirectionProvider` güçlendir | Cascade + context inheritance | M |
| F4C.3 | RTL visual regression suite | Playwright 50+ RTL snapshot | L |
| F4C.4 | ESLint `no-physical-properties` rule | Yeni fiziksel CSS kullanımını engelle | M |
| F4C.5 | Tailwind logical utilities | Config güncelleme | S |

**Drift guard:** `no-physical-properties` ESLint rule → CI'da blocking

### 4D — Enterprise X Suite (Hafta 4-12)

| # | Adım | Çıktı | Effort | Bağımlılık |
|---|---|---|---|---|
| F4D.1 | X-Grid recipe catalog genişlet | 30+ grid variant recipe | M | — |
| F4D.2 | X-Grid server-side integration | SSP, SSF, SSS helper hooks | L | F4D.1 |
| F4D.3 | X-Grid export (CSV, Excel) | Export utility + UI | M | F4D.1 |
| F4D.4 | X-Charts theme integration | Dark mode, accent, density aware charts | M | — |
| F4D.5 | X-Charts 10 chart type | Bar, Line, Area, Pie, Donut, Scatter, Heatmap, Treemap, Funnel, Radar | L | F4D.4 |
| F4D.6 | Scheduler — data model + hooks | Event CRUD, date range, collision | L | — |
| F4D.7 | Scheduler — UI (haftalık/aylık/günlük) | 3 view mode | XL | F4D.6 |
| F4D.8 | Kanban — data model + hooks | Column/card CRUD, drag state | L | — |
| F4D.9 | Kanban — UI (board + swimlane) | Drag-drop board | XL | F4D.8 |
| F4D.10 | Rich Text Editor | Tiptap integration, toolbar, mention, slash | XL | — |
| F4D.11 | Form Builder — schema engine | JSON schema → form rendering | L | — |
| F4D.12 | Form Builder — designer UI | Drag-drop field placer | XL | F4D.11 |
| F4D.13 | Tüm X paketi testleri + docs | Her X modülü: test + story + doc | L | F4D.1-12 |

### Tamamlanma Kriterleri

| Kriter | Ölçüm | Hedef |
|---|---|---|
| Form adapter | `useFormField()` + `FormProvider` + `createFormSchema()` çalışıyor | ✅ |
| Form testleri | Form validation + error + async + conditional | ≥ 30 test |
| Motion module | AnimatePresence + Transition + StaggerGroup + overlay entegrasyonu | ✅ |
| Motion a11y | `prefers-reduced-motion` → animasyon sıfır | ✅ |
| RTL migration | 0 physical CSS property violation (ESLint gate) | 0 violation |
| RTL visual | Playwright RTL snapshot | ≥ 50 snapshot |
| Grid recipe sayısı | `find src/advanced -name "*.recipe.*" \| wc -l` | ≥ 30 |
| Chart türü sayısı | Unique chart component count | ≥ 10 |
| Scheduler view | Haftalık + Aylık + Günlük render | 3 view |
| Kanban | Drag-drop çalışıyor, swimlane desteği | ✅ |
| Editor | Rich text + mention + slash command | ✅ |
| FormBuilder | JSON → form render + conditional logic | ✅ |
| Her X modülü bundle | Ayrı deep import, gzip < 100KB (grid hariç) | ✅ |
| Test sayısı | `npx vitest run` | ≥ 6,000 |
| Story sayısı | `find src -name "*.stories.tsx" \| wc -l` | ≥ 120 |
| Release gates | `pre-release-check.mjs` | 16/16 PASS (mevcut 14 + form-gate + rtl-gate) |

### F4 Drift Guardları (CI Gates)
```yaml
ci_gates:
  - gate-form-validation     # Form adapter testleri → block on fail
  - gate-motion-a11y         # prefers-reduced-motion enforcement → block on fail
  - gate-rtl-logical-css     # ESLint no-physical-properties → block on fail
  - gate-x-suite-isolation   # X bileşenleri core bundle'a sızmaz → block on fail
  - gate-bundle-budget       # Per-module KB limitleri → block on fail
  - gate-api-stability       # Breaking change detection (730+ exports) → block on fail
```

### Riskler

| Risk | Olasılık | Etki | Önlem |
|---|---|---|---|
| RTL migration'da 84+ dosya değişikliği → regression | YÜKSEK | YÜKSEK | Playwright RTL visual suite + ESLint gate. Batch migration (10 comp/PR). |
| Form adapter react-hook-form API değişikliği | DÜŞÜK | ORTA | Peer dep version pin. Adapter pattern izole eder. |
| Motion system performansı overlay'larda | ORTA | ORTA | 60fps benchmark. Web Animations API → GPU compositing. |
| Tiptap/ProseMirror bundle size patlaması | YÜKSEK | YÜKSEK | Lazy loading + code splitting. Editor ayrı deep import. Budget: < 150KB gzip. |
| Drag-drop kütüphane seçimi (Kanban) | ORTA | ORTA | @dnd-kit veya native HTML5 DnD. PoC ile karar verilecek. |
| AG Grid lisans maliyeti artarsa | DÜŞÜK | YÜKSEK | Abstraction layer mevcut. Gerekirse TanStack Table'a geçiş mümkün. |
| Scheduler karmaşıklığı scope creep | YÜKSEK | ORTA | MVP: sadece haftalık/aylık view + event CRUD. Gantt F6'ya taşınır. |

### Başarı Metriği
- **Lider gösterge:** Rekabet skoru 45 → 50/60
- **Gecikme göstergesi:** Enterprise demo app çalışıyor (form + motion + RTL + X modülleri entegre)

---

## F5 — AI-First Leapfrog (~10 hafta)

### Hedef
AI-native yeteneklerle rakipleri geç. MCP v2 (20+ tool), AI-powered testing, intelligent component runtime. Hiçbir rakibin (Ant Design, MUI, shadcn) olmadığı bir boyutta liderlik kur. F5 sonunda AI-native skoru 3 → 5.

### 5A — AI Developer Copilot (Hafta 1-4)

| # | Adım | Çıktı | Effort |
|---|---|---|---|
| F5A.1 | MCP server v2 — 20+ tool | Mevcut 9 tool → 20+ tool (proposeLayout, reviewAccessibility, suggestTestCases, migrateComponent, explainDecision, generateVariant, optimizeBundle, auditTokenUsage, translateI18n, scaffoldPage, compareComponents) | XL |
| F5A.2 | `npx @mfe/ds copilot <command>` CLI | Terminal'den MCP tool erişimi | L |
| F5A.3 | VS Code extension | Component autocomplete + inline docs | L |
| F5A.4 | Grounding test suite | Tüm MCP tool'ları catalog-verified output üretir, halüsinasyon yok | L |

### 5B — AI-Powered Testing (Hafta 3-6)

| # | Adım | Çıktı | Effort |
|---|---|---|---|
| F5B.1 | `generateContractTest(component)` | Bileşen API'sından otomatik contract test üretimi | L |
| F5B.2 | `generateA11yTest(component)` | WCAG kurallarından test senaryosu | L |
| F5B.3 | `generateVisualScenarios(component)` | Theme × density × state matris üretimi | M |
| F5B.4 | `suggestEdgeCases(component)` | Kenar durum analizi | M |
| F5B.5 | Test generation pipeline | MCP tool → Vitest dosyası → CI'da çalıştır | L |
| F5B.6 | "Test debt" dashboard | Design Lab'da hangi bileşenlerin test eksik | M |

### 5C — Intelligent Component Runtime (Hafta 5-10)

| # | Adım | Çıktı | Effort |
|---|---|---|---|
| F5C.1 | `useAdaptiveLayout()` hook | Viewport + context + user preference → layout seçimi | L |
| F5C.2 | `SmartDashboard` v2 | Widget priority AI ile hesaplanır (usage frequency, error rate) | L |
| F5C.3 | `AdaptiveForm` v2 | Field ordering AI ile optimize (completion rate data) | L |
| F5C.4 | `ContextAwareTooltip` | Tooltip içeriği kullanıcı rolüne/deneyimine göre adapte | M |
| F5C.5 | `SmartSearch` | Fuzzy + semantic search, component catalog üzerinden | L |
| F5C.6 | Privacy audit | Tüm adaptasyon client-side, zero external data transmission | S |

### Tamamlanma Kriterleri

| Kriter | Ölçüm | Hedef |
|---|---|---|
| MCP tools | Unique tool count | ≥ 20 |
| CLI komutları | Smoke test PASS count | ≥ 10 |
| Grounding | Halüsinasyon oranı | 0% (catalog-verified) |
| AI test generation | Üretilen testler compile + %95+ PASS | ✅ |
| Test debt dashboard | Design Lab'da canlı | ✅ |
| Adaptive components | useAdaptiveLayout + SmartDashboard v2 + AdaptiveForm v2 | ✅ |
| Privacy | Zero external data transmission audit | ✅ |
| Fallback | AI off → standard behavior testi | ✅ |
| Perf overhead | Adaptive logic ≤ 5ms | ✅ |
| Test sayısı | Toplam | ≥ 6,500 |

### F5 Drift Guardları (CI Gates)
```yaml
ci_gates:
  - gate-mcp-grounding       # MCP tool çıktıları catalog-verified → block on fail
  - gate-ai-test-quality     # Üretilen testler assertion depth check → block on fail
  - gate-privacy-audit       # Zero external data transmission → block on fail
  - gate-adaptive-fallback   # AI off → standard behavior testi → block on fail
  - gate-ai-perf-overhead    # Adaptive logic ≤ 5ms → block on fail
```

### Riskler

| Risk | Olasılık | Etki | Önlem |
|---|---|---|---|
| MCP tool halüsinasyonu (yanlış component önerisi) | ORTA | YÜKSEK | Grounding test: tüm output catalog-verified. CI gate. |
| AI test generation düşük kalite | ORTA | ORTA | Üretilen testlerin assertion depth'i mevcut testlerle benchmark. |
| Adaptive component'ler kullanıcı beklentisini karşılamaz | DÜŞÜK | ORTA | A/B test framework: adaptation on/off karşılaştırma. |
| Privacy endişesi (client-side telemetry) | DÜŞÜK | YÜKSEK | Zero external data. Client-side only. Privacy audit CI gate. |
| LLM API dependency (copilot CLI) | ORTA | ORTA | Offline fallback: catalog-based suggestion. LLM opsiyonel. |

### Başarı Metriği
- **Lider gösterge:** AI-native skor 3 → 5/5
- **Gecikme göstergesi:** Developer copilot CLI günlük kullanımda

---

## F6 — DX & Ecosystem (~8 hafta)

### Hedef
Blocks marketplace + public docs portal + Figma round-trip. shadcn/ui seviyesi DX (tek komutla block ekle) + Ant Design seviyesi docs kalitesi.

### 6A — Blocks Marketplace (Hafta 1-4)

| # | Adım | Çıktı | Effort |
|---|---|---|---|
| F6A.1 | Block mimarisi — interface + registry | Block contract type, manifest | M |
| F6A.2 | Dashboard blocks (4) | MetricCard, ChartPanel, ActivityFeed, KPIGrid | L |
| F6A.3 | CRUD blocks (4) | ListBlock, FilterBlock, DetailBlock, FormBlock | L |
| F6A.4 | Admin blocks (3) | SettingsPanel, UserManagement, RoleMatrix | L |
| F6A.5 | Review blocks (3) | ApprovalFlow, AuditTimeline, ComparisonView | L |
| F6A.6 | `npx @mfe/ds add <block-name>` CLI | Tek komutla block ekle (shadcn DX) | L |
| F6A.7 | 30+ block catalog | Searchable, previewable, Design Lab entegre | M |

### 6B — Public Documentation Portal (Hafta 3-6)

| # | Adım | Çıktı | Effort |
|---|---|---|---|
| F6B.1 | Docs portal altyapısı | Astro/Starlight veya Nextra setup | M |
| F6B.2 | Otomatik API reference | TypeDoc/TSDoc → HTML, her component | L |
| F6B.3 | Interactive playground | CodeSandbox/StackBlitz embed, "Try it" button | L |
| F6B.4 | Component selection wizard | "Hangi bileşeni kullanmalıyım?" karar ağacı | M |
| F6B.5 | Search | Algolia/Orama (semantic + keyword) | M |
| F6B.6 | Versioned docs | v1.x / v2.x ayrı URL | M |
| F6B.7 | TR + EN dil desteği | i18n-dicts entegrasyonu | M |

### 6C — Figma Round-Trip (Hafta 5-8)

| # | Adım | Çıktı | Effort |
|---|---|---|---|
| F6C.1 | Figma → code pipeline | Token değişikliği otomatik PR açar | L |
| F6C.2 | Code → Figma pipeline | Component API değişikliği Figma kit'e yansır | L |
| F6C.3 | Token diff raporu | Figma vs code karşılaştırma | M |
| F6C.4 | `figma-sync.yml` workflow | GitHub Actions otomasyonu | M |

### Tamamlanma Kriterleri

| Kriter | Ölçüm | Hedef |
|---|---|---|
| Block sayısı | Unique block components | ≥ 30 |
| Block CLI | `npx @mfe/ds add` → çalışan block | ✅ |
| Her block | dark mode + responsive + a11y tested | %100 |
| Docs portal | Public URL, search çalışıyor, versioned | ✅ |
| API reference | Tüm public API'lar dokümante | %100 |
| Interactive examples | Unique example count | ≥ 50 |
| Lighthouse | Performance ≥ 95, Accessibility ≥ 100 | ✅ |
| Figma sync | Token change → PR ≤ 5 dakika | ✅ |
| Figma parity | Token divergence | 0 |

### F6 Drift Guardları (CI Gates)
```yaml
ci_gates:
  - gate-docs-coverage        # %100 public API documented → block on fail
  - gate-block-quality        # Her block: test + a11y + visual → block on fail
  - gate-figma-parity         # Token divergence = 0 → block on fail
  - gate-docs-lighthouse      # Perf ≥ 95, A11y = 100 → block on fail
```

### Riskler

| Risk | Olasılık | Etki | Önlem |
|---|---|---|---|
| Block'lar arası coupling | ORTA | YÜKSEK | Her block izole. Dependency sadece aşağı katmana. |
| Docs framework seçimi yanlış | ORTA | YÜKSEK | PoC: Astro Starlight + Nextra benchmark. |
| Figma plugin effort beklenenden büyük | ORTA | DÜŞÜK | İlk adım: token JSON export. Full round-trip F7'ye taşınabilir. |
| Docs bakım yükü | YÜKSEK | ORTA | API ref otomatik. Manual sadece "why" bölümleri. |

### Başarı Metriği
- **Lider gösterge:** `npx @mfe/ds add` → 30 saniyede çalışan block
- **Gecikme göstergesi:** Docs portal bounce rate < %30, onboarding < 2 saat

---

## F7 — Commercial Hardening (~6 hafta)

### Hedef
Enterprise-grade release channels, migration automation, RFC process, adoption telemetry.

### Adımlar

| # | Adım | Çıktı | Effort |
|---|---|---|---|
| F7.1 | Release channels (Canary/Stable/LTS) | CI pipeline + npm dist-tags. Canary=her commit, Stable=haftalık, LTS=3 aylık | L |
| F7.2 | Semantic release automation | Conventional commits → version bump → auto CHANGELOG | M |
| F7.3 | RFC process | RFC template + 7 gün review + 2 approver minimum | M |
| F7.4 | Migration automation (`npx @mfe/ds migrate`) | AST codemod engine: prop rename, import path, component swap. Dry-run mode. | L |
| F7.5 | Migration test suite | 50+ transform senaryosu | L |
| F7.6 | Adoption telemetry (opt-in) | Anonymous component usage analytics + Design Lab dashboard | L |
| F7.7 | Deprecation usage tracking | Hangi consumer deprecated API kullanıyor | M |
| F7.8 | Support + Security policy | SLA, vulnerability disclosure, patch cadence | S |
| F7.9 | İlk LTS release | v2.x.x LTS (6 ay destek, kritik bugfix only) | M |

### Tamamlanma Kriterleri

| Kriter | Ölçüm | Hedef |
|---|---|---|
| Release channels | Canary + Stable + LTS dist-tags | 3 |
| LTS release | npm'de LTS tag'li versiyon | ≥ 1 |
| Migration CLI | `npx @mfe/ds migrate --from v1 --to v2` → dry-run çalışıyor | ✅ |
| Migration tests | Transform senaryosu | ≥ 50 |
| Codemod idempotent | 2x çalıştır → same result | ✅ |
| RFC process | Completed RFC | ≥ 3 |
| Adoption dashboard | Real data ile canlı | ✅ |
| Telemetry privacy | Zero PII collection audit | ✅ |
| CHANGELOG | Otomatik üretim çalışıyor | ✅ |

### F7 Drift Guardları (CI Gates)
```yaml
ci_gates:
  - gate-semver-compliance    # Conventional commit → correct version → block on fail
  - gate-lts-backport         # LTS branch: only bugfix commits → block on fail
  - gate-codemod-idempotent   # Migration 2x çalıştır → same result → block on fail
  - gate-telemetry-privacy    # Zero PII collection → block on fail
```

### Riskler

| Risk | Olasılık | Etki | Önlem |
|---|---|---|---|
| LTS bakım yükü | YÜKSEK | ORTA | LTS sadece critical/security patch. Feature freeze. Max 12 ay LTS. |
| Adoption telemetry GDPR/privacy | ORTA | YÜKSEK | Strictly opt-in. Sadece component usage count (no PII). |
| RFC process bürokratikleşir | ORTA | ORTA | RFC sadece breaking change + yeni X modülü için zorunlu. |
| AST codemod edge case'leri | ORTA | ORTA | Dry-run mode zorunlu. Transform → snapshot test. |

### Başarı Metriği
- **Lider gösterge:** LTS release + migration CLI yayınlandı
- **Gecikme göstergesi:** 3+ RFC tamamlandı, adoption dashboard aktif

---

## F8 — AI Runtime Intelligence (~8 hafta)

### Hedef
AI ile design system kullanım kalitesini otomatik denetle, pattern öner, a11y guardian çalıştır. Rakiplerin hiçbirinde olmayan dünya-ilk yetenekler.

### 8A — AI Design Review (Hafta 1-4)

| # | Adım | Çıktı | Effort |
|---|---|---|---|
| F8A.1 | PR review bot | Design system kullanım kalitesini değerlendir | L |
| F8A.2 | Pattern detection | Anti-pattern tespiti (hardcoded color, missing a11y, wrong component) | L |
| F8A.3 | Fix suggestion | Otomatik düzeltme önerisi (MCP tool → codemod) | M |
| F8A.4 | Quality score | Her PR'a design system uyumluluk skoru (0-100) | M |

### 8B — Predictive Component Intelligence (Hafta 3-6)

| # | Adım | Çıktı | Effort |
|---|---|---|---|
| F8B.1 | Usage pattern analysis | "Bu sayfada muhtemelen DataGrid lazım" önerisi | L |
| F8B.2 | Component combination patterns | "FilterBar + DataGrid + DetailDrawer sık birlikte kullanılıyor" | M |
| F8B.3 | Performance prediction | "Bu bileşen kombinasyonu X KB bundle ekler" | M |
| F8B.4 | Design Lab Intelligence entegrasyonu | Prediction paneli | M |

### 8C — AI Accessibility Guardian (Hafta 5-8)

| # | Adım | Çıktı | Effort |
|---|---|---|---|
| F8C.1 | Runtime a11y monitoring | Canlı sayfada WCAG ihlal tespiti | L |
| F8C.2 | Screen reader simulation | Component output sesli okuma preview | L |
| F8C.3 | Color contrast auto-fix | Tema token'larını contrast ratio'ya göre ayarla | M |
| F8C.4 | Cognitive load analyzer | Sayfa karmaşıklık skoru | M |

### Tamamlanma Kriterleri

| Kriter | Ölçüm | Hedef |
|---|---|---|
| PR review bot | Design system uyumluluk skoru çalışıyor | ✅ |
| False positive rate | Yanlış alarm oranı | ≤ %5 |
| Pattern detection | Anti-pattern türü | ≥ 10 tür |
| Runtime a11y monitor | Performance overhead | ≤ 2ms |
| Prediction grounding | Öneriler catalog-verified | ✅ |
| Contrast auto-fix | WCAG AA compliance | %100 |
| Test sayısı | Toplam | ≥ 7,500 |
| Release gates | Toplam gate sayısı | ≥ 20 |

### F8 Drift Guardları (CI Gates)
```yaml
ci_gates:
  - gate-ai-review-accuracy   # False positive rate ≤ %5 → block on fail
  - gate-a11y-guardian-perf    # Runtime monitor ≤ 2ms overhead → block on fail
  - gate-prediction-grounding  # Öneriler catalog-verified → block on fail
```

### Riskler

| Risk | Olasılık | Etki | Önlem |
|---|---|---|---|
| PR review bot fazla noise üretir | ORTA | YÜKSEK | False positive gate ≤ %5. Tuning döngüsü. |
| Runtime a11y monitor performansı | ORTA | ORTA | ≤ 2ms overhead gate. Production'da opt-in. |
| Prediction engine data gerektiriyor | ORTA | ORTA | Statik analiz + catalog data. External data gereksiz. |

### Başarı Metriği
- **Lider gösterge:** Rekabet skoru 52 → 55/60
- **Gecikme göstergesi:** PR review bot aktif kullanımda, a11y guardian canlı

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

| Faz | Durum | Hedef Test | Hedef Skor | Risk |
|---|---|---|---|---|
| F0 | ✅ DONE | 5,321 (baseline) | — | — |
| F1 | ✅ DONE | — | — | — |
| F2 | ✅ DONE | — | — | — |
| F3 | ✅ DONE | 5,321 | 45/60 | — |
| F4 | ⬜ Sırada (~12 hf) | ≥ 6,000 | 50/60 | ⚠️ RTL migration regression, Tiptap bundle |
| F5 | ⬜ Bekliyor (~10 hf) | ≥ 6,500 | 52/60 | ⚠️ MCP grounding, privacy |
| F6 | ⬜ Bekliyor (~8 hf) | ≥ 7,000 | 53/60 | ⚠️ Docs framework, Figma plugin effort |
| F7 | ⬜ Bekliyor (~6 hf) | ≥ 7,200 | 54/60 | ⚠️ LTS bakım, codemod edge case |
| F8 | ⬜ Bekliyor (~8 hf) | ≥ 7,500 | 55/60 | ⚠️ AI review noise, runtime perf |

---

## Anti-Drift Master Framework

### Sürekli Enforcement (Tüm Fazlarda Aktif)

| Guard | Trigger | Fail Action |
|-------|---------|-------------|
| **Bundle Budget** | Her PR | Block merge |
| **API Stability** | Her PR | Breaking change → major version zorunlu |
| **Test Coverage** | Her PR | Yeni bileşen ≤ %80 coverage → block |
| **Visual Regression** | Her PR | Pixel diff > %1 → manual review |
| **a11y Audit** | Her PR | axe-core violation → block |
| **No Physical CSS** | Her PR (F4C sonrası) | Physical property → block |
| **Token Compliance** | Her PR | Hardcoded color/spacing → block |
| **MCP Grounding** | Her PR (F5 sonrası) | Unverified AI output → block |
| **Deprecation Window** | Her release | Deprecated API 2 minor'dan fazla → block |
| **SSR Safety** | Her PR | Server entry client import → block |
| **i18n Coverage** | Her release | Missing locale key → warning |
| **Semver Compliance** | Her release | Incorrect version bump → block |

### Güvenli Evrim İlkeleri
1. **Her yeni capability = peer dependency veya lazy-loaded** — core bundle'a etki 0
2. **Experimental → Stable pipeline** — yeni bileşen minimum 1 minor release Experimental kalır
3. **Codemod-first breaking change** — migration tool olmadan breaking change yasak
4. **Fallback-first AI** — AI feature kapalıyken standard behavior garanti
5. **Privacy-first intelligence** — zero external data, client-side only adaptation

---

## Sonraki Aksiyonlar

1. **F3 DONE → F4 başla:** 4A Form Adapter + 4B Motion (paralel) → 4C RTL (paralel X Suite ile)
2. **F4 ortası → F4D:** Scheduler, Kanban, Editor, FormBuilder (en yüksek effort)
3. **F4 DONE → F5:** AI-First Leapfrog (MCP v2 + AI testing + intelligent runtime)
4. **F5 DONE → F6:** Blocks marketplace + public docs + Figma round-trip
5. **F6 DONE → F7:** Release channels + LTS + migration automation + RFC
6. **F7 DONE → F8:** AI design review + predictive intelligence + a11y guardian
