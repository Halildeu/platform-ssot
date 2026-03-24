# Phase Governance — Proje Yonetim Parametreleri

> **Tarih:** 2026-03-24
> **Prensip:** Her faz, olculebilir kriterlere baglidir. Kriter karsilanmadan faz "DONE" ilan edilmez.
> **Kapsam:** F0 → F1 → F2 → F3 → F4 → F5 → F6 → F7 → F8
> **Vizyon:** Dunya standardi AI-native design system liderligi. Ant Design / MUI / shadcn/ui'i gecmek.
> **SSOT:** Bu dosya **tek authoritative kaynak**tir. Diger dokumanlar (PLATFORM-ROADMAP.md, QUALITY-GATE.md, design-platform-roadmap.md) mirror'dir ve bu dosyayla celistiginde bu dosya gecerlidir.

### Faz Durumu (Guncel — 2026-03-24)
| Faz | Durum | Son Dogrulama |
|-----|-------|--------------|
| F0 — Release Truth | ✅ DONE | 2026-03-20 (13/13 gate PASS — 14 total, 1 skippable: clean-tree) |
| F1 — Package Topology | ✅ DONE | 2026-03-20 (15 deep imports + boundary enforcement) |
| F2 — Foundation | ✅ DONE | 2026-03-20 (51 icon + 8 hook + token pipeline + axe-core) |
| F3 — Core Completeness | ✅ DONE | 2026-03-20 (0 deprecated + 95 contract + 86 dark mode contract + 5,321 tests + migration guide) |
| F4 — Gap Closer & Enterprise Suite | ✅ DONE | 2026-03-24 (form validation + motion system + RTL migration + Enterprise X Suite tamamlandi) |
| F5 — AI-First Leapfrog | 🟡 KISMEN | MCP 18 tool (hedef 20), AI testing kismen, intelligent runtime baslamadi |
| F6 — DX & Ecosystem | 🟡 KISMEN | Blocks CLI 48 block tamamlandi, docs portal yapilmadi, Figma round-trip yapilmadi |
| F7 — Commercial Hardening | 🟡 KISMEN | Semver check + migration tooling tamamlandi, LTS/RFC yapilmadi |
| F8 — AI Runtime Intelligence | ⬜ Baslamadi | Siradaki oncelik |

### Rekabet Hedef Skorkarti (/60)
| Boyut | Simdi | F8 Hedef | Ant | MUI |
|-------|:---:|:---:|:---:|:---:|
| Bilesen genisligi | 5 | 5 | 5 | 4 |
| Enterprise derinlik | 5 | 5 | 4 | 5 |
| Token & Theming | 5 | 5 | 4 | 4 |
| Accessibility | 5 | 5 | 4 | 4 |
| Docs & DX | 4 | 5 | 5 | 5 |
| Test coverage | 5 | 5 | 5 | 5 |
| Form sistemi | 5 | 5 | 5 | 2 |
| Animasyon | 4 | 4 | 4 | 3 |
| Data grid | 5 | 5 | 3 | 4 |
| SSR/RSC | 4 | 5 | 3 | 4 |
| Bundle opt. | 4 | 5 | 3 | 4 |
| **AI-native** | 4 | 5 | 0 | 0 |
| **Toplam** | **~54** | **55** | **45** | **44** |

---

## Temel Olcum Noktasi (Baseline — 2026-03-24)

```
Test Dosyasi:       430+
Test Sayisi:      7,200+
Bilesen Sayisi:    174 (24 primitiv + 60 component + 10 pattern + 38 enterprise + 6 advanced + 7 form + 3 motion + 4 provider + 8 internal + 2 performance + 12 other)
Stories:            163
Release Gates:      28+ (original 14 + a11y-gate + mutation-gate + token-audit + keyboard-matrix + license-audit + bundle-report + changelog + scorecard-dashboard + perf-benchmark)
Scorecard Average:  94.2/100
Grade Distribution: 174/174 A-grade
Deep Imports:       17
Enterprise Bilesen: 38 (BulletChart, ProcessFlow, FineKinney, PivotTable, OrgChart, BoxPlot, etc.)
CI Scripts:         12+ automated quality gates
ESLint:             0 error
Bundle (ESM):       ~5 MB
Bundle (CJS):       ~9 MB
```

---

## Faz Gecis Protokolu

```
Her faz gecisi icin ZORUNLU:
  1. Tum "Tamamlanma Kriterleri" karsilanmis
  2. pre-release-check.mjs → 28+ gate PASS
  3. 0 test failure
  4. 0 lint error
  5. Bundle budget asilmamis
  6. Dokumantasyon guncel (QUALITY-GATE.md, PLATFORM-ROADMAP.md)
  7. Risk matrisi guncel — tum CRITICAL riskler cozulmus
```

---

## F3 — Core Completeness ✅ DONE

### Hedef
Styled core library %100 tutarli, tum deprecated API'ler temizlenmis, v2.0.0 yayinlanabilir durumda.

### Tamamlanma Ozeti
- 0 deprecated annotation (107 removed)
- 95/95 contract test
- 86 dark mode contract
- 5,321 test (baseline)
- Migration guide tamamlandi

---

## Public API Taksonomisi

### Export Yuzeyi Karari

| Subpath | Tier | Semver Korumali | Hedef Kullanici |
|---------|------|-----------------|-----------------|
| `@mfe/design-system` | Public | ✅ Evet | Tum consumer'lar |
| `./primitives` | Public | ✅ Evet | UI gelistirme |
| `./components` | Public | ✅ Evet | UI gelistirme |
| `./patterns` | Public | ✅ Evet | Sayfa duzeni |
| `./tokens` | Public | ✅ Evet | Tema/styling |
| `./theme` | Public | ✅ Evet | Tema yonetimi |
| `./providers` | Public | ✅ Evet | Context saglama |
| `./icons` | Public | ✅ Evet | Ikonlar |
| `./a11y` | Public | ✅ Evet | A11y araclari |
| `./performance` | Public | ✅ Evet | Perf monitoring |
| `./headless` | Public | ✅ Evet | Headless hooks — custom component building |
| `./advanced` | Public | ✅ Evet | AG Grid / Charts entegrasyonu |
| `./advanced/data-grid/setup` | Public | ✅ Evet | AG Grid lisans + modul setup |
| `./form` | Public | ✅ Evet | Form validation adapter (react-hook-form + zod) |
| `./motion` | Public | ✅ Evet | Animasyon sistemi (AnimatePresence, Transition, StaggerGroup) |
| `./enterprise` | Public | ✅ Evet | 38 enterprise bilesen (BulletChart, ProcessFlow, etc.) |
| `./internal/interaction-core` | **Internal** | ⚠️ Unstable | Sadece DS katkilcilari. `./headless` uzerinden erisin. |
| `./internal/overlay-engine` | **Internal** | ⚠️ Unstable | Sadece DS katkilcilari. `./headless` uzerinden erisin. |

**Kural:** `./internal/*` export'lari semver korumasi altinda DEGILDIR. Bu API'ler `./headless` uzerinden public olarak sunulur. `./internal/*` dogrudan kullanim kendi riskinizedir.

**Stabilite Sinyalleri:**
- Her internal barrel dosyasinda `@internal` + `@unstable` JSDoc marker'i bulunur
- Development ortaminda (`NODE_ENV === 'development'`) ilk import'ta `console.warn` uyarisi verilir
- Production build'lerde uyari tree-shake ile kaldirilir
- Detayli stability contract: `src/internal/README.md`

---

## F4 — Gap Closer & Enterprise Suite ✅ DONE

### Hedef
Rekabet gap'lerini kapat (form validation, animation, RTL) + agir enterprise yuzeyler tamamla. F4 sonunda rakip skorunu 50/60'a cikar.

### Tamamlanma Ozeti (2026-03-24)

**4A — Form Validation Adapter:** ✅
- `useFormField()` hook, `FormProvider`, `createFormSchema()` tamamlandi
- react-hook-form + zod adapter calisiyor
- 7 form bileseni Controller-uyumlu
- 15+ form recipe (Login, CRUD, wizard, conditional, array fields)

**4B — Motion & Animation System:** ✅
- AnimatePresence, Transition, StaggerGroup tamamlandi
- `useMotion()` hook — token-driven animasyon
- Overlay entegrasyonu (Modal, Dialog, Drawer, Popover, Tooltip, Dropdown)
- `prefers-reduced-motion` tam destek

**4C — RTL & Logical CSS Migration:** ✅
- Physical → logical CSS migration tamamlandi
- ESLint `no-physical-properties` rule aktif
- DirectionProvider guclendirildi

**4D — Enterprise X Suite:** ✅
- 38 enterprise bilesen tamamlandi
- BulletChart, ProcessFlow, FineKinney, PivotTable, OrgChart, BoxPlot ve digerleri
- Tum X modulleri ayri deep import ile erisiliyor

### Basari Metrikleri
- Rekabet skoru: 45 → ~54/60
- Test sayisi: 5,321 → 7,200+
- Bilesen sayisi: 94 → 174
- Stories: 95 → 163
- Release gates: 14 → 28+
- Scorecard: 174/174 A-grade (94.2 ortalama)

---

## Kalan Yol Haritasi (Mart 2026+)

### Sprint A: Dark Mode Polish (1 hafta)
- Bilesen bazinda dark mode gorsel kontrol
- Shell app data-mode entegrasyonu dogrulama
- Dark mode visual regression genisletme

### Sprint B: F8 — AI Runtime Intelligence (2 hafta)
- PR review bot (design system uyumluluk skoru)
- Predictive component suggestion
- AI Accessibility Guardian (runtime WCAG monitoring)

### Sprint C: F6 — Docs Portal (2 hafta)
- Astro/Starlight public docs site
- API reference, playground, search
- TR+EN versioned documentation

### Sprint D: FlowBuilder (1 hafta)
- No-code akis tasarimcisi bileseni
- Node + edge + canvas pattern
- ProcessFlow uzerine insa

---

## F5 — AI-First Leapfrog 🟡 KISMEN

### Hedef
AI-native yeteneklerle rakipleri gec. MCP v2 (20+ tool), AI-powered testing, intelligent component runtime. Hicbir rakibin (Ant Design, MUI, shadcn) olmadigi bir boyutta liderlik kur. F5 sonunda AI-native skoru 5.

### Mevcut Durum (2026-03-24)

| Alt-Faz | Durum | Detay |
|---------|-------|-------|
| 5A — AI Developer Copilot | 🟡 | MCP 18 tool (hedef 20). CLI mevcut. VS Code extension yapilmadi. |
| 5B — AI-Powered Testing | 🟡 | Kismen tamamlandi. Test generation pipeline calisiyor. |
| 5C — Intelligent Runtime | ⬜ | Baslamadi. useAdaptiveLayout, SmartDashboard v2, AdaptiveForm v2 bekliyor. |

### Kalan Isler

| # | Is | Effort |
|---|---|---|
| F5.1 | MCP 18 → 20 tool tamamla (2 eksik tool ekle) | M |
| F5.2 | VS Code extension | L |
| F5.3 | Grounding test suite genislet | M |
| F5.4 | useAdaptiveLayout() hook | L |
| F5.5 | SmartDashboard v2 | L |
| F5.6 | AdaptiveForm v2 | L |
| F5.7 | ContextAwareTooltip | M |
| F5.8 | SmartSearch | L |
| F5.9 | Privacy audit | S |

### Tamamlanma Kriterleri

| Kriter | Olcum | Hedef | Durum |
|---|---|---|---|
| MCP tools | Unique tool count | ≥ 20 | 18/20 |
| CLI komutlari | Smoke test PASS count | ≥ 10 | ✅ |
| Grounding | Halusinasyon orani | 0% (catalog-verified) | ✅ |
| AI test generation | Uretilen testler compile + %95+ PASS | ✅ | 🟡 |
| Adaptive components | useAdaptiveLayout + SmartDashboard v2 + AdaptiveForm v2 | ✅ | ⬜ |
| Privacy | Zero external data transmission audit | ✅ | ⬜ |
| Fallback | AI off → standard behavior testi | ✅ | ⬜ |

### F5 Drift Guardlari (CI Gates)
```yaml
ci_gates:
  - gate-mcp-grounding       # MCP tool ciktilari catalog-verified → block on fail
  - gate-ai-test-quality     # Uretilen testler assertion depth check → block on fail
  - gate-privacy-audit       # Zero external data transmission → block on fail
  - gate-adaptive-fallback   # AI off → standard behavior testi → block on fail
  - gate-ai-perf-overhead    # Adaptive logic ≤ 5ms → block on fail
```

### Riskler

| Risk | Olasilik | Etki | Onlem |
|---|---|---|---|
| MCP tool halusinasyonu (yanlis component onerisi) | ORTA | YUKSEK | Grounding test: tum output catalog-verified. CI gate. |
| AI test generation dusuk kalite | ORTA | ORTA | Uretilen testlerin assertion depth'i mevcut testlerle benchmark. |
| Adaptive component'ler kullanici beklentisini karsilamaz | DUSUK | ORTA | A/B test framework: adaptation on/off karsilastirma. |
| Privacy endisesi (client-side telemetry) | DUSUK | YUKSEK | Zero external data. Client-side only. Privacy audit CI gate. |

---

## F6 — DX & Ecosystem 🟡 KISMEN

### Hedef
Blocks marketplace + public docs portal + Figma round-trip. shadcn/ui seviyesi DX (tek komutla block ekle) + Ant Design seviyesi docs kalitesi.

### Mevcut Durum (2026-03-24)

| Alt-Faz | Durum | Detay |
|---------|-------|-------|
| 6A — Blocks Marketplace | ✅ | 48 block tamamlandi, CLI calisiyor |
| 6B — Public Docs Portal | ⬜ | Baslamadi. Astro/Starlight setup bekliyor. |
| 6C — Figma Round-Trip | ⬜ | Baslamadi. Token sync pipeline bekliyor. |

### Kalan Isler

| # | Is | Effort |
|---|---|---|
| F6.1 | Docs portal altyapisi (Astro/Starlight) | M |
| F6.2 | Otomatik API reference (TypeDoc/TSDoc → HTML) | L |
| F6.3 | Interactive playground (CodeSandbox/StackBlitz embed) | L |
| F6.4 | Search (Algolia/Orama) | M |
| F6.5 | Versioned docs (v1.x / v2.x) | M |
| F6.6 | TR + EN dil destegi | M |
| F6.7 | Figma → code pipeline (token degisikligi otomatik PR acar) | L |
| F6.8 | Code → Figma pipeline | L |
| F6.9 | Token diff raporu | M |

### Tamamlanma Kriterleri

| Kriter | Olcum | Hedef | Durum |
|---|---|---|---|
| Block sayisi | Unique block components | ≥ 30 | ✅ (48) |
| Block CLI | `npx @mfe/ds add` → calisan block | ✅ | ✅ |
| Her block | dark mode + responsive + a11y tested | %100 | ✅ |
| Docs portal | Public URL, search calisiyor, versioned | ✅ | ⬜ |
| API reference | Tum public API'lar dokumante | %100 | ⬜ |
| Interactive examples | Unique example count | ≥ 50 | ⬜ |
| Figma sync | Token change → PR ≤ 5 dakika | ✅ | ⬜ |
| Figma parity | Token divergence | 0 | ⬜ |

### F6 Drift Guardlari (CI Gates)
```yaml
ci_gates:
  - gate-docs-coverage        # %100 public API documented → block on fail
  - gate-block-quality        # Her block: test + a11y + visual → block on fail
  - gate-figma-parity         # Token divergence = 0 → block on fail
  - gate-docs-lighthouse      # Perf ≥ 95, A11y = 100 → block on fail
```

### Riskler

| Risk | Olasilik | Etki | Onlem |
|---|---|---|---|
| Docs framework secimi yanlis | ORTA | YUKSEK | PoC: Astro Starlight + Nextra benchmark. |
| Figma plugin effort beklenenden buyuk | ORTA | DUSUK | Ilk adim: token JSON export. Full round-trip sonraya tasinabilir. |
| Docs bakim yuku | YUKSEK | ORTA | API ref otomatik. Manual sadece "why" bolumleri. |

---

## F7 — Commercial Hardening 🟡 KISMEN

### Hedef
Enterprise-grade release channels, migration automation, RFC process, adoption telemetry.

### Mevcut Durum (2026-03-24)

| Alt-Faz | Durum | Detay |
|---------|-------|-------|
| Semver check | ✅ | Conventional commits + breaking change detection aktif |
| Migration tooling | ✅ | AST codemod engine, dry-run mode, snapshot testler tamamlandi |
| Release channels (LTS) | ⬜ | Canary/Stable/LTS dist-tags kurulmadi |
| RFC process | ⬜ | RFC template + review sureci tanimlanmadi |
| Adoption telemetry | ⬜ | Dashboard kurulmadi |

### Kalan Isler

| # | Is | Effort |
|---|---|---|
| F7.1 | Release channels (Canary/Stable/LTS) CI pipeline + npm dist-tags | L |
| F7.2 | RFC process (template + 7 gun review + 2 approver) | M |
| F7.3 | Adoption telemetry (opt-in anonymous usage analytics) | L |
| F7.4 | Deprecation usage tracking | M |
| F7.5 | Support + Security policy (SLA, vulnerability disclosure) | S |
| F7.6 | Ilk LTS release (v2.x.x) | M |

### Tamamlanma Kriterleri

| Kriter | Olcum | Hedef | Durum |
|---|---|---|---|
| Semver compliance | Conventional commit → correct version | ✅ | ✅ |
| Migration CLI | `npx @mfe/ds migrate` → dry-run calisiyor | ✅ | ✅ |
| Migration tests | Transform senaryosu | ≥ 50 | ✅ |
| Codemod idempotent | 2x calistir → same result | ✅ | ✅ |
| Release channels | Canary + Stable + LTS dist-tags | 3 | ⬜ |
| LTS release | npm'de LTS tag'li versiyon | ≥ 1 | ⬜ |
| RFC process | Completed RFC | ≥ 3 | ⬜ |
| Adoption dashboard | Real data ile canli | ✅ | ⬜ |
| CHANGELOG | Otomatik uretim calisiyor | ✅ | ✅ |

### F7 Drift Guardlari (CI Gates)
```yaml
ci_gates:
  - gate-semver-compliance    # Conventional commit → correct version → block on fail
  - gate-lts-backport         # LTS branch: only bugfix commits → block on fail
  - gate-codemod-idempotent   # Migration 2x calistir → same result → block on fail
  - gate-telemetry-privacy    # Zero PII collection → block on fail
```

### Riskler

| Risk | Olasilik | Etki | Onlem |
|---|---|---|---|
| LTS bakim yuku | YUKSEK | ORTA | LTS sadece critical/security patch. Feature freeze. Max 12 ay LTS. |
| Adoption telemetry GDPR/privacy | ORTA | YUKSEK | Strictly opt-in. Sadece component usage count (no PII). |
| RFC process burokratiklesir | ORTA | ORTA | RFC sadece breaking change + yeni X modulu icin zorunlu. |

---

## F8 — AI Runtime Intelligence ⬜ BASLAMADI (Siradaki Oncelik)

### Hedef
AI ile design system kullanim kalitesini otomatik denetle, pattern oner, a11y guardian calistir. Rakiplerin hicbirinde olmayan dunya-ilk yetenekler.

### 8A — AI Design Review (2 hafta)

| # | Adim | Cikti | Effort |
|---|---|---|---|
| F8A.1 | PR review bot | Design system kullanim kalitesini degerlendir | L |
| F8A.2 | Pattern detection | Anti-pattern tespiti (hardcoded color, missing a11y, wrong component) | L |
| F8A.3 | Fix suggestion | Otomatik duzeltme onerisi (MCP tool → codemod) | M |
| F8A.4 | Quality score | Her PR'a design system uyumluluk skoru (0-100) | M |

### 8B — Predictive Component Intelligence (2 hafta)

| # | Adim | Cikti | Effort |
|---|---|---|---|
| F8B.1 | Usage pattern analysis | "Bu sayfada muhtemelen DataGrid lazim" onerisi | L |
| F8B.2 | Component combination patterns | "FilterBar + DataGrid + DetailDrawer sik birlikte kullaniliyor" | M |
| F8B.3 | Performance prediction | "Bu bilesen kombinasyonu X KB bundle ekler" | M |
| F8B.4 | Design Lab Intelligence entegrasyonu | Prediction paneli | M |

### 8C — AI Accessibility Guardian (2 hafta)

| # | Adim | Cikti | Effort |
|---|---|---|---|
| F8C.1 | Runtime a11y monitoring | Canli sayfada WCAG ihlal tespiti | L |
| F8C.2 | Screen reader simulation | Component output sesli okuma preview | L |
| F8C.3 | Color contrast auto-fix | Tema token'larini contrast ratio'ya gore ayarla | M |
| F8C.4 | Cognitive load analyzer | Sayfa karmasiklik skoru | M |

### Tamamlanma Kriterleri

| Kriter | Olcum | Hedef |
|---|---|---|
| PR review bot | Design system uyumluluk skoru calisiyor | ✅ |
| False positive rate | Yanlis alarm orani | ≤ %5 |
| Pattern detection | Anti-pattern turu | ≥ 10 tur |
| Runtime a11y monitor | Performance overhead | ≤ 2ms |
| Prediction grounding | Oneriler catalog-verified | ✅ |
| Contrast auto-fix | WCAG AA compliance | %100 |
| Test sayisi | Toplam | ≥ 7,500 |
| Release gates | Toplam gate sayisi | ≥ 30 |

### F8 Drift Guardlari (CI Gates)
```yaml
ci_gates:
  - gate-ai-review-accuracy   # False positive rate ≤ %5 → block on fail
  - gate-a11y-guardian-perf    # Runtime monitor ≤ 2ms overhead → block on fail
  - gate-prediction-grounding  # Oneriler catalog-verified → block on fail
```

### Riskler

| Risk | Olasilik | Etki | Onlem |
|---|---|---|---|
| PR review bot fazla noise uretir | ORTA | YUKSEK | False positive gate ≤ %5. Tuning dongusu. |
| Runtime a11y monitor performansi | ORTA | ORTA | ≤ 2ms overhead gate. Production'da opt-in. |
| Prediction engine data gerektiriyor | ORTA | ORTA | Statik analiz + catalog data. External data gereksiz. |

---

## Risk Siniflandirma Referansi

| Seviye | Tanim | Aksiyon |
|---|---|---|
| **CRITICAL** | Faz ilerleyemez, sistem kirik | HEMEN coz. Diger is durur. |
| **YUKSEK** | Fazi geciktirebilir veya kaliteyi dusurur | Sprint icinde coz. Mitigation plani zorunlu. |
| **ORTA** | Yonetilebilir ama dikkat gerektirir | Sprint planlama'da ele al. Watchlist'te tut. |
| **DUSUK** | Bilinmesi yeterli, aktif aksiyon gerekmez | Kayit altina al. Gerekirse backlog'a ekle. |

---

## Guncel Risk Matrisi (2026-03-24)

| Risk | Olasilik | Etki | Durum | Onlem |
|---|---|---|---|---|
| Dark mode gorsel regresyon (174 bilesen) | ORTA | ORTA | AKTIF | Sprint A ile ele alinacak. Visual regression suite genisletilecek. |
| MCP tool halusinasyonu (18 tool) | ORTA | YUKSEK | AKTIF | Grounding test mevcut. 2 eksik tool eklenince kapsamlilik artacak. |
| Docs portal yoklugu → developer onboarding yavasi | YUKSEK | YUKSEK | AKTIF | Sprint C planlandi. API ref + playground + search. |
| Bundle size artisi (ESM ~5MB, CJS ~9MB) | ORTA | ORTA | IZLENIYOR | Per-module budget gate aktif. Tree-shaking calisiyor. |
| LTS/release channel yoklugu → enterprise adoption riski | ORTA | YUKSEK | AKTIF | F7 kalan isler planlandi. |
| AG Grid lisans maliyeti artarsa | DUSUK | YUKSEK | IZLENIYOR | Abstraction layer mevcut. TanStack Table'a gecis mumkun. |
| Figma-code parity drift | ORTA | ORTA | AKTIF | Token JSON export ilk adim. Full round-trip F6 kapsaminda. |

---

## Effort Referansi

| Etiket | Tanim |
|---|---|
| **S** | 1-2 saat. Tek dosya/script degisikligi. |
| **M** | 4-8 saat. Birden fazla dosya, test, doc. |
| **L** | 1-3 gun. Yeni modul veya major refactor. |
| **XL** | 3-7 gun. Tamamen yeni sistem (Scheduler, Editor vb.). |

---

## Faz Durumu Ozet Tablosu

| Faz | Durum | Test Sayisi | Skor | Risk |
|---|---|---|---|---|
| F0 | ✅ DONE | 5,321 (baseline) | — | — |
| F1 | ✅ DONE | — | — | — |
| F2 | ✅ DONE | — | — | — |
| F3 | ✅ DONE | 5,321 | 45/60 | — |
| F4 | ✅ DONE | 7,200+ | ~54/60 | — |
| F5 | 🟡 KISMEN | 7,200+ | ~54/60 | ⚠️ MCP 18/20, intelligent runtime baslamadi |
| F6 | 🟡 KISMEN | 7,200+ | ~54/60 | ⚠️ Docs portal yok, Figma round-trip yok |
| F7 | 🟡 KISMEN | 7,200+ | ~54/60 | ⚠️ LTS/RFC yok |
| F8 | ⬜ Sirada | Hedef: 7,500+ | Hedef: 55/60 | ⚠️ AI review noise, runtime perf |

---

## Anti-Drift Master Framework

### Surekli Enforcement (Tum Fazlarda Aktif)

| Guard | Trigger | Fail Action |
|-------|---------|-------------|
| **Bundle Budget** | Her PR | Block merge |
| **API Stability** | Her PR | Breaking change → major version zorunlu |
| **Test Coverage** | Her PR | Yeni bilesen ≤ %80 coverage → block |
| **Visual Regression** | Her PR | Pixel diff > %1 → manual review |
| **a11y Audit** | Her PR | axe-core violation → block |
| **No Physical CSS** | Her PR | Physical property → block |
| **Token Compliance** | Her PR | Hardcoded color/spacing → block |
| **Scorecard Gate** | Her PR | A-grade altina dusus → block |
| **Mutation Gate** | Her PR | Mutation coverage check |
| **License Audit** | Her PR | Uyumsuz lisans → block |
| **Keyboard Matrix** | Her PR | Klavye navigasyon kontrolu |
| **Perf Benchmark** | Her PR | Performance regression → block |
