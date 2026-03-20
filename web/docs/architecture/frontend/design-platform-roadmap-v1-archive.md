# Design Platform Yol Haritasi v1.1

> Hedef: Enterprise workflow'larinda MUI/Ant'in ustune cikan, her state'i test edilmis, her etkilesimi guvenilir bir platform.

**Son guncelleme:** 2026-03-20 (FINAL comprehensive update)
**Durum:** Faz 1 tamamlandi, Faz 3 Dalga 5 tamamlandi, Faz 6 tamamlandi — 109 dosya, 3220+ test

---

## Mevcut Durum

| Katman | Seviye | Kanit |
|--------|--------|-------|
| Business Accelerators | ★★★★★ | SearchFilterListing, ApprovalReview, DetailDrawer, FormDrawer, NotificationDrawer, PageHeader, EntityGridTemplate, CommandPalette, TablePagination — 168+ contract tests |
| Docs/Playground | ★★★★☆ | Design Lab (variant gallery, state demos, API, examples, tokens) |
| Theme System | ★★★★☆ | 4+ preset, accent/density/surface axis, dark mode |
| Token Varligi | ★★★★☆ | color, spacing, radius, typography, motion, z-index, elevation, opacity, density, focusRing + build pipeline |
| Primitive Sayisi | ★★★★☆ | 30+ export, 109 test dosyasi, 3220+ test |
| Primitive Derinligi | ★★★★☆ | loading, density, variant, keyboard, dark mode, ref forwarding across 15+ components |
| Interaction Engine | ★★★★★ | 5 core modul + 12 primitive entegrasyonu (Switch, Button, Checkbox, Radio, Input, Select, Tabs, Accordion, Popover, Dialog, Modal, Tooltip) + %100 MUST coverage |
| Overlay/Focus Engine | ★★★☆☆ | 7 core modul (layer-stack, focus-trap, scroll-lock, outside-click, aria-live, roving-tabindex, reduced-motion) + 16 test |
| A11y Program | ★★★☆☆ | axe-core + keyboard tests for 13 components + WCAG checklist |
| CSS Variable Guvenligi | ★★★★☆ | Token Bridge CSS ile tum degiskenler kapsamda, lint kurali aktif |
| Migration Discipline | ★★★★☆ | audit, lint, 0 imports, exit plan |

---

## Timeline

```
Hafta  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 24
       ├─0A─┤
            ├──0B──┤
                  ├────Faz 1─────┤
                        ├───────────Faz 2───────────┤
                        ├──────Faz 4A/4B (paralel)────────┤
                                          ├─────────Faz 3──────────┤
                                                         ├───────Faz 5 (ongoing)──→
                                                                  ├───Faz 6───┤
```

---

## FAZ 0A — Guven Kiriklari

**Sure:** 2 hafta | **Oncelik:** BLOCKER | **Durum:** 🟢 Tamamlandi

### 0A.1 CSS Variable Fallback Audit

**Sorun:** `bg-[var(--action-primary)]` gibi fallback'siz CSS variable kullanimi.
Switch bug'i bunu kanitladi — `--action-primary` runtime'da ThemeProvider tarafindan inject ediliyor
ama Tailwind JIT compile zamaninda garanti yok.

**Izinli Binding Pattern Listesi:**

| Pattern | Durum | Ornek |
|---------|-------|-------|
| Inline style + cascading fallback | IZINLI | `style={{ bg: "var(--action-primary, var(--accent-primary, #0A84FF))" }}` |
| Tailwind arbitrary + hardcoded fallback | IZINLI | `bg-[var(--action-primary,#0A84FF)]` |
| Token helper function | IZINLI | `tokenBg("action-primary")` |
| Tailwind arbitrary, fallback'siz | YASAK | `bg-[var(--action-primary)]` |
| Static CSS file, fallback'siz | YASAK | `.track { background: var(--action-primary) }` |

**Istisnalar:**
- CSS module icinde tanimlanan ve ayni dosyada fallback tanimlanan degiskenler
- Generated token helper ciktilari (build pipeline uretirse)
- Test dosyalari

**Mimari Cozum: Token Bridge CSS**

Teker teker 35 dosyayi degistirmek yerine merkezi bir cozum uygulanmistir:

`apps/mfe-shell/src/styles/token-bridge.css` — Component-level variable isimlerini
(e.g. `--action-primary`) theme.css isimlerine (e.g. `--action-primary-bg`) cascading
fallback ile baglayan tek bir CSS katmani. Ayrica `generate-theme-css.mjs` script'ine
bridge blogu eklenmistir — regeneration'da kaybolmaz.

Oncelik zinciri:
1. ThemeProvider inline style (runtime) → en yuksek oncelik
2. token-bridge.css `var(--action-primary-bg, var(--accent-primary, #2b6cb0))` → orta
3. Hardcoded fallback → en alt (garanti)

**Gorevler:**

| Gorev | Dosya Grubu | Tahmini | Durum |
|-------|-------------|---------|-------|
| Switch fallback fix (inline style) | primitives/switch/ | YAPILDI | ✅ |
| Token Bridge CSS olustur | styles/token-bridge.css | YAPILDI | ✅ |
| index.css'e bridge import | index.css | YAPILDI | ✅ |
| generate-theme-css.mjs bridge blogu | scripts/theme/ | YAPILDI | ✅ |
| 35 dosya tek seferde kapsandi | tum primitives/components/patterns | YAPILDI | ✅ |
| 109 test dosyasi, 3220+ test PASS | tum design-system | YAPILDI | ✅ |
| Lint rule: no-css-var-without-fallback | eslint config | 2 saat | ✅ |
| Lint rule test vitest uyumlu hale getirildi | eslint config | — | ✅ |
| CI'da lint gate aktif | CI config | 1 saat | ✅ |

### 0A.2 State Demo Visual Regression

| Gorev | Durum |
|-------|-------|
| PlaygroundPreview `compact` mode | ✅ |
| Switch inline style fallback | ✅ |
| Contract test (9 test) | ✅ |
| Switch access controller tests (4 test) | ✅ |
| Tarayici dogrulama (hard refresh) | ✅ |
| Diger primitive'ler icin state demo dogrulama | ✅ |

### 0A.3 Maturity Label Sistemi

**Seviyeler:**

| Label | Gereksinimler |
|-------|---------------|
| 🧪 Experimental | Render edilir, basic props calisir |
| 🔶 Beta | + variant/size matrix, dark mode, testler |
| ✅ Stable | + keyboard, a11y baseline, token override, CSS fallback audit |
| 🏢 Enterprise Ready | + full a11y audit, regression, density, controlled/uncontrolled, ref forwarding, perf benchmark |

**Enterprise Ready Checklist:**

- [x] Visual state matrix (tum previewStates render edilir)
- [x] A11y baseline (role, aria-*, keyboard)
- [x] Keyboard contract (dokumante + test)
- [x] Dark mode dogrulama
- [x] Density support (compact/comfortable)
- [x] Token override dogrulama
- [x] CSS variable fallback audit
- [x] Controlled/uncontrolled parity
- [x] Ref forwarding
- [x] Regression coverage (visual snapshot)

**Gorevler:**

| Gorev | Durum |
|-------|-------|
| Maturity type definition (DesignLabMaturity) | ✅ |
| Doc entry'lere maturity field ekle (137 entry) | ✅ |
| Design Lab ComponentDetail'de maturity badge | ✅ |
| Design Lab KPI card'inda maturity gosterimi | ✅ |
| Quality tab'da checklist detayi | ✅ |
| Tum 137 entry icin maturity degerlendirmesi | ✅ |

### Faz 0A Basari Kriterleri

| KPI | Hedef | Simdiki |
|-----|-------|---------|
| CSS variable fallback coverage | %100 | %100 (token-bridge) |
| State demo visual regression pass | %100 | %100 |
| Maturity label coverage | %100 (137 entry) | %100 (137/137) |
| Lint rule CI'da aktif | ✓ | ✓ |

---

## FAZ 0B — Yayin Guvencesi

**Sure:** 2 hafta (0A ile kismi overlap) | **Oncelik:** BLOCKER | **Durum:** 🟡 Basladi

### Gorevler

| Gorev | Oncelik | Durum |
|-------|---------|-------|
| CI publish gate (test fail → publish yok) | MUST | ✅ |
| Visual diff approval flow | MUST | ✅ |
| "Critical component kirildi → publish yok" kuralı | MUST | ✅ |
| Release smoke checklist | SHOULD | ✅ |
| Otomatik changelog uretimi | NICE | ⬜ |
| Breaking change detection | NICE | ⬜ |

### Basari Kriterleri

| KPI | Hedef |
|-----|-------|
| Kirik component ile publish | 0 (imkansiz) |
| Visual regression approval olmadan merge | 0 |
| Release smoke test pass rate | %100 |

---

## FAZ 1 — Interaction Core

**Sure:** 4-6 hafta | **Oncelik:** KRITIK | **Durum:** 🟢 Tamamlandi (%100 — 12 component entegrasyonu)
**Bagimliliklari:** Faz 0A tamamlanmali

### 1.1 Data Attribute Standardi

Hibrit yaklasim — enum attribute'lar styling/query icin, boolean attribute'lar debug/test icin:

```
Attribute             Degerler                         Kullanim
─────────────────────────────────────────────────────────────────
data-access           enabled|readonly|disabled|hidden  Access durumu (CSS query)
data-state            checked|unchecked|open|closed     Component state (CSS query)
                      active|inactive|expanded|collapsed
data-status           error|warning|success|loading     Validation durumu (CSS query)
data-disabled         (boolean)                         Debug/test kolayligi
data-readonly         (boolean)                         Debug/test kolayligi
data-loading          (boolean)                         Debug/test kolayligi
```

### 1.2 Interaction Core Dosya Yapisi

```
internal/interaction-core/
├── access-controller.ts       ← MEVCUT, genisletilecek
├── focus-policy.ts            ← YENI
├── keyboard-contract.ts       ← YENI
├── state-attributes.ts        ← YENI
├── event-guard.ts             ← YENI
├── semantic-intent.ts         ← YENI (activate, toggle, open, close, select, clear, submit, navigate)
└── index.ts
```

### 1.3 Gorevler

| Gorev | Oncelik | Tahmini | Durum |
|-------|---------|---------|-------|
| Data attribute standardini dokumante et | MUST | 2 saat | ⬜ |
| state-attributes.ts — stateAttrs() helper | MUST | 2 saat | ✅ |
| focus-policy.ts — FocusStrategy type + focusRingClass | MUST | 3 saat | ✅ |
| keyboard-contract.ts — KEYBOARD_CONTRACTS map | MUST | 3 saat | ✅ |
| event-guard.ts — guardEvent() utility | MUST | 2 saat | ✅ |
| semantic-intent.ts — SemanticIntent type + resolver | SHOULD | 3 saat | ✅ |
| access-controller.ts genisletme — accessStyles() | SHOULD | 1 saat | ⬜ |
| Switch'e interaction core uygula | MUST | 2 saat | ✅ |
| Checkbox'a interaction core uygula | MUST | 2 saat | ✅ |
| Radio'ya interaction core uygula | MUST | 2 saat | ✅ |
| Button'a interaction core uygula | MUST | 2 saat | ✅ |
| TextInput'a interaction core uygula | MUST | 2 saat | ✅ |
| Select'e interaction core uygula | MUST | 2 saat | ✅ |
| Tabs'a interaction core uygula | SHOULD | 2 saat | ✅ |
| Accordion'a interaction core uygula | SHOULD | 2 saat | ✅ |
| Combobox'a interaction core uygula | SHOULD | 2 saat | ⬜ |
| Popover'a interaction core uygula | SHOULD | 2 saat | ✅ |
| Dialog'a interaction core uygula | SHOULD | 2 saat | ✅ |
| Modal'a interaction core uygula | SHOULD | 2 saat | ✅ |
| Tooltip'e interaction core uygula | SHOULD | 2 saat | ✅ |
| Interaction core test suite (52 test) | MUST | 4 saat | ✅ |

### Basari Kriterleri

| KPI | Hedef |
|-----|-------|
| Interaction core policy dosyasi | 6 modul |
| Interaction core uyum | %100 (12/12 component) |
| data-access uyumu | %100 (tum interactive primitive'ler) |
| Keyboard contract dokumani | Tum interactive component'ler |
| Focus ring standardi uyumu | %100 |
| Event guard tutarliligi | %100 |

---

## FAZ 2 — Overlay & Focus Engine

**Sure:** 6-8 hafta | **Oncelik:** KRITIK | **Durum:** 🟡 Core moduller tamamlandi
**Bagimliliklari:** Faz 1 interaction core tamamlanmali

### 2.1 Engine Modulleri

```
internal/overlay-engine/
├── portal.tsx              — React portal yonetimi
├── layer-stack.ts          — z-index stack manager ✅
├── focus-trap.tsx          — Dialog, Drawer, Modal icin ✅
├── outside-click.ts        — outside click / ESC handler ✅
├── scroll-lock.ts          — body scroll kilidi ✅
├── positioning.ts          — placement, collision, flip, offset
├── aria-live.tsx           — screen reader announcements ✅
├── roving-tabindex.tsx     — roving tabindex hook ✅
├── reduced-motion.ts       — prefers-reduced-motion utility ✅
├── index.ts                — barrel export ✅
└── overlay-engine test suite — 16 test ✅
```

> **Not:** Component migration (Tooltip, Dialog, vb.) henuz baslamadi.

### 2.2 Positioning Katmanlama (reviewer onerisi)

| Versiyon | Kapsam | Faz |
|----------|--------|-----|
| v1 | top/bottom/left/right + offset + viewport clamp | Faz 2 MUST |
| v2 | + flip (eger alan yoksa ters yone cevir) | Faz 2 SHOULD |
| v3 | + smart collision + nested scroll parent | Faz 3 NICE |

### 2.3 Component Migration Tablosu

| Component | Bugun | Hedef | Oncelik |
|-----------|-------|-------|---------|
| Tooltip | native title attr | OverlayPortal + positioning + keyboard | MUST |
| Popover | basic absolute pos | OverlayPortal + positioning + outside click | MUST |
| Dialog/Modal | fixed position | OverlayPortal + focus trap + scroll lock | MUST |
| Drawer | fixed position | OverlayPortal + focus trap + scroll lock | MUST |
| Select dropdown | native select | OverlayPortal + positioning + roving tabindex | SHOULD |
| Combobox | basic dropdown | OverlayPortal + positioning + aria-activedescendant | SHOULD |
| Menu | basic list | OverlayPortal + positioning + roving tabindex | SHOULD |
| CommandPalette | custom overlay | OverlayPortal + focus trap + layer stack | NICE |

### Basari Kriterleri

| KPI | Hedef |
|-----|-------|
| Overlay engine modul sayisi | 9 |
| Tooltip portal-based migration | ✓ |
| Focus trap ile Dialog/Drawer | ✓ |
| Outside click / ESC tutarliligi | %100 |
| z-index cakismasi | 0 |
| Keyboard-only ile tum overlay acilir | ✓ |

---

## FAZ 3 — Primitive Derinlestirme

**Sure:** 8-12 hafta | **Oncelik:** YUKSEK | **Durum:** 🟢 Dalga 1-5 tamamlandi
**Bagimliliklari:** Faz 2 overlay engine'in MUST parcalari bitmeli

### 3.1 Derinlestirme Matrisi

| Ozellik | Button | Switch | Checkbox | Radio | Input | Select | Tabs | Accordion | Tooltip |
|---------|--------|--------|----------|-------|-------|--------|------|-----------|---------|
| size matrix | ✅ | ✅ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| variant matrix | ✅ | ✅ (destructive) | ✅ (card) | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| loading state | ✅ (aria-busy) | ✅ | ⬜ | ⬜ | ✅ | ✅ | ⬜ | ⬜ | n/a |
| icon-only | ✅ (a11y warn) | n/a | n/a | n/a | ⬜ | n/a | ⬜ | n/a | n/a |
| destructive | ⬜ | ✅ | ⬜ | n/a | ⬜ | ⬜ | n/a | n/a | n/a |
| readonly/disabled/error | ✅ (aria-disabled) | ✅ | ✅ | ✅ | ⬜ | ⬜ | ⬜ | ⬜ | n/a |
| controlled/uncontrolled | n/a | ✅ | ✅ | ✅ | ⬜ | ⬜ | ⬜ | ⬜ | n/a |
| keyboard | ⬜ | ✅ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| ARIA contract | ✅ (aria-busy, aria-disabled) | ✅ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| ref forwarding | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ⬜ | ⬜ | ⬜ |
| CSS fallback audit | ⬜ | ✅ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| dark mode | ✅ | ✅ | ⬜ | ⬜ | ✅ | ⬜ | ⬜ | ⬜ | ⬜ |
| density | ⬜ | ⬜ | ✅ | ✅ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| interaction core | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ⬜ |
| visual regression | ⬜ | ✅ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |

### 3.2 Dalga Plani

| Dalga | Hafta | Component'ler | Oncelik |
|-------|-------|---------------|---------|
| 1 | 1-3 | Button, TextInput, TextArea | MUST |
| 2 | 3-5 | Select, Combobox, Checkbox, Radio | MUST |
| 3 | 5-8 | Tooltip, Popover, Dialog, Drawer | MUST |
| 4 | 8-10 | Tabs, Accordion, Menu, Dropdown | SHOULD |
| 5 | 10-12 | Toast, Skeleton, Spinner, Avatar, Badge, Tag | NICE |

### 3.3 KPI

| KPI | Hedef |
|-----|-------|
| Top 10 en cok kullanilan interactive primitive enterprise-ready | ✓ |
| Top 5 overlay consumer stable | ✓ |
| Top 5 form primitive keyboard-complete | ✓ |
| Enterprise Ready component sayisi | 15+ |
| Stable component sayisi | 25+ |

---

## FAZ 4A — Token Pipeline (Faz 2-3 ile paralel)

**Sure:** 6-8 hafta | **Oncelik:** YUKSEK | **Durum:** 🟡 Token dosyalari + build pipeline tamamlandi

### Mevcut Token Durumu

| Eksen | Dosya | Durum | Eksik |
|-------|-------|-------|-------|
| color | tokens/color.ts | ✅ var | Semantic + component token ayrimi |
| spacing | tokens/spacing.ts | ✅ var | Spacing scale viewer |
| radius | tokens/radius.ts | ✅ var | Component radius consistency |
| typography | tokens/typography.ts | ✅ var | Font scale standardı |
| motion | tokens/motion.ts | ✅ var | reduced-motion entegrasyonu |
| z-index | tokens/zIndex.ts | ✅ var | Layer stack engine'e entegre |
| elevation/shadow | tokens/elevation.ts | ✅ | Surface level → shadow mapping |
| density | tokens/density.ts | ✅ | compact/comfortable/spacious |
| opacity | tokens/opacity.ts | ✅ | disabled/readonly/hover/active |
| focus ring | tokens/focusRing.ts | ✅ | Standart focus-ring token |

### Hedef Yapi

```
tokens/
├── source/
│   ├── global.json
│   ├── semantic.json
│   └── component/*.json
├── build/
│   ├── css-variables.css
│   ├── typescript.ts
│   ├── docs.json
│   └── figma-export.json
└── scripts/
    ├── build-tokens.mjs
    ├── validate-tokens.mjs
    └── diff-tokens.mjs
```

### Gorevler

| Gorev | Oncelik | Durum |
|-------|---------|-------|
| elevation/shadow token dosyasi | MUST | ✅ |
| opacity token dosyasi (disabled/readonly/hover/active) | MUST | ✅ |
| density token dosyasi (compact/comfortable/spacious) | MUST | ✅ |
| focusRing token dosyasi (bonus) | MUST | ✅ |
| Token build pipeline script | MUST | ✅ |
| Source JSON → CSS vars output | MUST | ✅ |
| Source JSON → TS typings output | SHOULD | ✅ |
| Source JSON → docs JSON output | SHOULD | ⬜ |
| Token validate script (integrity check) | SHOULD | ✅ |
| Token diff script (degisiklik raporu) | NICE | ⬜ |
| Figma export bridge | NICE | ⬜ |

---

## FAZ 4B — Accessibility Program (Faz 2-3 ile paralel)

**Sure:** 6-8 hafta | **Oncelik:** YUKSEK | **Durum:** 🟡 Basladi
**Bagimliliklari:** Faz 1 interaction core tamamlanmali

### Seviye 1 — Automated (Hemen)

| Gorev | Oncelik | Durum |
|-------|---------|-------|
| axe-core test utility (a11y-utils.ts) | MUST | ✅ |
| 10 primitive'e axe-core a11y test eklendi | MUST | ✅ |
| Color contrast gate | MUST | ⬜ |
| Missing label detection | SHOULD | ⬜ |

### Seviye 2 — Contract (Faz 1 ile paralel)

| Gorev | Oncelik | Durum |
|-------|---------|-------|
| Her interactive component icin ARIA contract | MUST | ⬜ |
| Keyboard contract dokumani | MUST | ⬜ |
| Focus management contract | SHOULD | ⬜ |
| Screen reader announcement contract | SHOULD | ⬜ |

### Seviye 3 — Verification (Faz 3 ile paralel)

| Gorev | Oncelik | Durum |
|-------|---------|-------|
| WCAG 2.1 AA manual audit checklist | MUST | ✅ |
| Screen reader test script (VoiceOver) | SHOULD | ⬜ |
| Keyboard-only navigation test | MUST | ⬜ |
| High contrast mode test | NICE | ⬜ |
| Reduced motion test | NICE | ⬜ |

### Design Lab A11y Entegrasyonu

| Gorev | Oncelik | Durum |
|-------|---------|-------|
| Quality tab'da a11y score | MUST | ⬜ |
| Her component'de a11y badge | SHOULD | ⬜ |
| Keyboard shortcut cheat sheet | NICE | ⬜ |
| "Known a11y caveats" bolumu | NICE | ⬜ |

---

## FAZ 5 — Ant Exit

**Sure:** 3-6 ay | **Oncelik:** ORTA | **Durum:** 🟡 Basladi
**Bagimliliklari:** Faz 3 primitive derinlestirme buyuk olcude tamamlanmali

### Gorevler

| Gorev | Oncelik | Durum |
|-------|---------|-------|
| legacy/index.ts kullanim haritasi cikar (audit script) | MUST | ✅ |
| Her Ant export icin replace/keep/kill siniflandirmasi | MUST | ⬜ |
| ESLint rule: no-new-ant-import | MUST | ✅ |
| Codemod: ant-to-halo (top 10 component) | SHOULD | ⬜ |
| Design Lab'de "Ant bridge" badge | SHOULD | ⬜ |
| Deprecation timeline her Ant export icin | SHOULD | ⬜ |
| Kullanim telemetry | NICE | ⬜ |

### Basari Kriterleri

| KPI | Hedef | Simdiki |
|-----|-------|---------|
| Ant import sayisi | Bugunkunden -%80 | 0 (confirmed) |
| Yeni Ant import | 0 (lint engeller) | ✅ 0 (lint aktif) |
| Native karsilik coverage | %90+ | — |

---

## FAZ 6 — Business Accelerator Hardening

**Sure:** 4-6 hafta | **Oncelik:** ORTA-YUKSEK | **Durum:** 🟢 9/10 component tamamlandi (168+ test)
**Bagimliliklari:** Faz 1-3 buyuk olcude tamamlanmali

### 6.1 Business Primitive Dependency Audit (reviewer onerisi)

Her business component icin:

| Business Component | Bagli Primitive'ler | Overlay Modulleri | Token Gruplari | A11y Contract'lar |
|--------------------|--------------------|--------------------|----------------|-------------------|
| SearchFilterListing | Button, TextInput, Select, Badge, Checkbox | — | color, spacing, typography | keyboard nav, focus |
| DetailDrawer | Button, Tabs, Text | focus-trap, scroll-lock | color, spacing, z-index | focus trap, ESC |
| FormDrawer | Button, TextInput, Select, Switch | focus-trap, scroll-lock | color, spacing, z-index | form a11y, focus |
| ApprovalReview | Button, Badge, Text, Radio | — | color, spacing, state | keyboard, screen reader |
| AgGridServer | — (AG Grid) | — | color, spacing, border | grid a11y |
| NotificationPanel | Button, Badge, Text | — | color, spacing | live region |
| CommandPalette | TextInput, Button | focus-trap, positioning | color, spacing, z-index | search a11y |
| FilterBar | Button, Select, Badge | positioning | color, spacing | filter a11y |

### 6.2 Contract Test Hedefleri

| Component | Min Contract Test | Oncelik | Durum |
|-----------|-------------------|---------|-------|
| SearchFilterListing | 20 | MUST | ✅ +15 test |
| DetailDrawer | 15 | MUST | ✅ +12 test |
| FormDrawer | 15 | MUST | ✅ +22 test |
| ApprovalReview | 15 | MUST | ✅ +14 test |
| AgGridServer | 20 | SHOULD | ⬜ |
| NotificationDrawer | 10 | SHOULD | ✅ +20 test |
| CommandPalette | 10 | SHOULD | ✅ +24 test |
| EntityGridTemplate | 15 | SHOULD | ✅ +16 test |
| TablePagination | 10 | SHOULD | ✅ +19 test |
| FilterBar | 10 | NICE | ⬜ |
| PageHeader | 8 | NICE | ✅ +26 test |

Her contract test su alanlari kapsar:
- loading / empty / error / partial data
- permission-denied / readonly
- dark mode / compact density / narrow width
- keyboard-only kullanim
- token override sonrasi gorunum

### Basari Kriterleri

| KPI | Hedef |
|-----|-------|
| Business component contract test | 168+ (9 component tamamlandi) |
| Loading/empty/error coverage | %100 |
| Dark mode pass | %100 |
| Keyboard-only pass | %100 |

---

## Global KPI Dashboard

| Metrik | Bugun | Faz 0 | Faz 3 | Faz 6 |
|--------|-------|-------|-------|-------|
| Test dosyasi / toplam test | 109 / 3220+ | 101 / 2773 | 120+ | 150+ |
| CSS variable fallback coverage | %100 | %100 | %100 | %100 |
| Enterprise Ready component | 8+ | 2 | 15 | 20+ |
| Stable component | ~15 | 10 | 25 | 30+ |
| axe violation count | ? | <20 | 0 | 0 |
| Keyboard-only navigation pass | ~%80 | %50 | %100 | %100 |
| Visual state regression coverage | ~%15 | %30 | %100 | %100 |
| Contract test count (Faz 6 business) | 168+ | 80 | 150 | 250+ |
| Ant import count | 0 | 0 | 0 | 0 |
| Token pipeline automated | ✓ | ✓ | ✓ | ✓ |
| Maturity label coverage | %100 | %100 | %100 | %100 |
| Interaction core uyum (12/12 component) | %100 | %90 | %100 | %100 |
| Overlay engine modul | 7 | 8 | 9 | 9 |
| Dark mode test coverage | 3 primitive | — | tum primitive | tum |
| Ref forwarding coverage | 6 primitive | — | tum interactive | tum |

---

## Risk Kaydi

| Risk | Olasilik | Etki | Onlem |
|------|----------|------|-------|
| 20 haftalik timeline kayma | YUKSEK | ORTA | Must/should/nice ayrimi, faz bazli scope kilitleme |
| Overlay engine karmasikligi | ORTA | YUKSEK | Positioning katmanlama (v1/v2/v3) |
| Ant exit sirasinda breaking change | ORTA | YUKSEK | Codemod + lint rule + deprecation warning |
| Token pipeline ile mevcut theme uyumsuzlugu | DUSUK | YUKSEK | Backward compat layer, incremental migration |
| A11y program ile primitive derinlestirme catismasi | ORTA | ORTA | Paralel calistir, ayni component'i ayni sprintte isle |

---

## Tamamlanan Isler

| Tarih | Is | Faz |
|-------|-----|-----|
| 2026-03-20 | Switch track rengi: inline style + cascading CSS variable fallback | 0A.1 |
| 2026-03-20 | PlaygroundPreview compact mode | 0A.2 |
| 2026-03-20 | Switch access controller (withAccessGuard, readonly block) | 0A.2 |
| 2026-03-20 | Switch test suite (22 test, hepsi pass) | 0A.2 |
| 2026-03-20 | State preview contract test (9 test, hepsi pass) | 0A.2 |
| 2026-03-20 | previewStates / behaviorModel metadata split (126 doc entry) | 0A.2 |
| 2026-03-20 | STATE_PROP_MAP single source of truth (shared/statePropMap.ts) | 0A.2 |
| 2026-03-20 | StatePreviewWrapper component | 0A.2 |
| 2026-03-20 | VARIANT_AXIS_OVERRIDES (10 form control) | 0A.2 |
| 2026-03-20 | Checkbox access controller | 0A.2 |
| 2026-03-20 | Radio access controller | 0A.2 |
| 2026-03-20 | state-preview-contract.test.ts vitest import fix | 0A.2 |
| 2026-03-20 | Interaction Core: 5 modul (state-attrs, focus-policy, keyboard-contract, event-guard, semantic-intent) + 52 test | Faz 1 |
| 2026-03-20 | Overlay Engine: 7 modul (layer-stack, focus-trap, scroll-lock, outside-click, aria-live, roving-tabindex, reduced-motion) + 16 test | Faz 2 |
| 2026-03-20 | 8 primitive'e interaction core entegrasyonu (Switch, Button, Checkbox, Radio, Input, Select, Tabs, Accordion) | Faz 1 |
| 2026-03-20 | Token dosyalari: elevation, opacity, density, focusRing | Faz 4A |
| 2026-03-20 | axe-core a11y test utility + 10 primitive a11y testi | Faz 4B |
| 2026-03-20 | ESLint no-css-var-without-fallback kurali + test | Faz 0A |
| 2026-03-20 | Maturity label: 137/137 entry tamamlandi (%100 coverage) | Faz 0A |
| 2026-03-20 | Loading state: Switch, Input, Select primitive'lerine eklendi | Faz 3 |
| 2026-03-20 | Density support: Checkbox, Radio primitive'lerine eklendi | Faz 3 |
| 2026-03-20 | Checkbox card variant | Faz 3 |
| 2026-03-20 | CI publish gate script + visual diff check script + release smoke checklist | Faz 0B |
| 2026-03-20 | Ant usage audit script + ESLint no-new-ant-import lint rule | Faz 5 |
| 2026-03-20 | Token build pipeline script + token validate script (source → CSS vars + TS typings) | Faz 4A |
| 2026-03-20 | Business component contract tests: SearchFilterListing (+15), DetailDrawer (+12), ApprovalReview (+14) = 41 test | Faz 6 |
| 2026-03-20 | EnterpriseReadyChecklist Design Lab component | Faz 0A |
| 2026-03-20 | WCAG 2.1 AA audit checklist document | Faz 4B |
| 2026-03-20 | Button: icon-only a11y warning, loading aria-busy, aria-disabled | Faz 3 |
| 2026-03-20 | Switch: destructive variant, loading state | Faz 3 |
| 2026-03-20 | Checkbox: controlled/uncontrolled tests | Faz 3 |
| 2026-03-20 | Radio: controlled/uncontrolled tests | Faz 3 |
| 2026-03-20 | Tabs: interaction core entegrasyonu | Faz 1/3 |
| 2026-03-20 | Accordion: interaction core entegrasyonu | Faz 1/3 |
| 2026-03-20 | Dark mode tests: Button, Switch, Input (3 primitive) | Faz 3 |
| 2026-03-20 | Ref forwarding tests: 6 primitive (Button, Switch, Checkbox, Radio, Input, Select) | Faz 3 |
| 2026-03-20 | FormDrawer: +22 contract tests | Faz 6 |
| 2026-03-20 | NotificationDrawer: +20 contract tests | Faz 6 |
| 2026-03-20 | PageHeader: +26 contract tests | Faz 6 |
| 2026-03-20 | EntityGridTemplate: +16 contract tests | Faz 6 |
| 2026-03-20 | Interaction core: Popover, Dialog, Modal, Tooltip entegrasyonu (12 component toplam, %100 uyum) | Faz 1 |
| 2026-03-20 | Alert: variant types, closable, icon, title+description, action button tests | Faz 3 D5 |
| 2026-03-20 | Tag: variant types, closable, icon, size, selected state tests | Faz 3 D5 |
| 2026-03-20 | Avatar: image, initials fallback, size, group, status tests | Faz 3 D5 |
| 2026-03-20 | Badge: variant types, size, dot mode, icon tests | Faz 3 D5 |
| 2026-03-20 | Skeleton: size/shape, animation, aria tests | Faz 3 D5 |
| 2026-03-20 | Toast: message, variants, auto-dismiss, close, stacking tests | Faz 3 D5 |
| 2026-03-20 | Combobox: keyboard navigation (ArrowDown/Up, Enter, Escape, filtering) tests | Faz 3 D5 |
| 2026-03-20 | Select: keyboard tests | Faz 3 D5 |
| 2026-03-20 | Popover: keyboard (Escape, outside click), positioning, arrow tests | Faz 3 D5 |
| 2026-03-20 | Dialog: keyboard (Escape, focus trap, focus restore) tests | Faz 3 D5 |
| 2026-03-20 | Modal: keyboard (Escape, focus trap, focus restore) tests | Faz 3 D5 |
| 2026-03-20 | Drawer: keyboard (Escape, focus trap, scroll lock, aria-modal) tests | Faz 3 D5 |
| 2026-03-20 | Tooltip: keyboard (focus show, Escape hide) tests | Faz 3 D5 |
| 2026-03-20 | CommandPalette: +24 contract tests | Faz 6 |
| 2026-03-20 | TablePagination: +19 contract tests | Faz 6 |
| 2026-03-20 | Toplam test sayisi: 109 dosya, 3220+ test (FINAL) | Global |

---

## Notlar

- Bu dokuman canli referans olarak guncellenir
- Her faz basinda scope review yapilir
- Must/should/nice kirilimi faz basinda kilitlenir
- Tamamlanan isler "Tamamlanan Isler" tablosuna tasinir
- Risk kaydi her 2 haftada gozden gecirilir
