# Sprint Tracker — @mfe/design-system

> **Güncelleme:** 2026-03-24
> **Mevcut Skor:** 97.3/100 ortalama, 186/186 A-grade
> **Test:** 7,200+, 1120+ dosya
> **Hedef:** Dark mode polish → F8 AI Runtime → F6 Docs Portal → FlowBuilder

---

## Mevcut Durum Özeti

| Metrik | Değer |
|--------|:-----:|
| Bileşen | 186 |
| Enterprise | 38 |
| Test | 7,200+ |
| Story | 187 |
| CI Gate | 24 |
| Scorecard Avg | 97.3/100 |
| A-grade | 186/186 (%100) |

---

## Sprint A: Dark Mode Polish (1 hafta)

**Hedef:** Tüm bileşenlerde dark mode sorunsuz çalışsın.

| # | İş | Öncelik | Tahmini |
|---|-----|:-------:|:-------:|
| A.1 | Bileşen bazında dark mode görsel audit | 🔴 | 2 gün |
| A.2 | Shell app data-mode entegrasyonu doğrulama | 🔴 | 0.5 gün |
| A.3 | Kalan hardcoded renkleri semantic token'a çevir | 🟠 | 1 gün |
| A.4 | Dark mode visual regression testleri genişlet | 🟡 | 1 gün |
| A.5 | Design Lab preview'da dark toggle doğrulama | 🔴 | 0.5 gün |

**Tamamlanma Kriterleri:**
- Token audit %100 clean
- Dark mode visual regression 0 diff
- Design Lab'da tüm bileşenler dark mode'da okunabilir

**Riskler:**
- Shell app'in Figma token sistemi ile dark-mode.css çakışması
- Tailwind v4 arbitrary value syntax'ının dark mode'da davranışı

---

## Sprint B: F8 — AI Runtime Intelligence (2 hafta)

**Hedef:** PR review bot, predictive suggestion, a11y guardian.

| # | İş | Öncelik | Tahmini |
|---|-----|:-------:|:-------:|
| B.1 | PR Review Bot — design system uyumluluk skoru (0-100) | 🔴 | 3 gün |
| B.2 | PR Review Bot — anti-pattern tespiti (hardcoded color, missing a11y, wrong import) | 🔴 | 2 gün |
| B.3 | PR Review Bot — fix suggestion (auto-comment) | 🟠 | 2 gün |
| B.4 | Predictive Intelligence — component recommendation engine | 🟠 | 3 gün |
| B.5 | AI Accessibility Guardian — runtime WCAG monitoring (≤2ms overhead) | 🟡 | 2 gün |
| B.6 | AI Accessibility Guardian — color contrast auto-check | 🟡 | 1 gün |

**Tamamlanma Kriterleri:**
- PR bot GitHub Action çalışıyor, skor veriyor
- Anti-pattern tespiti ≤%5 false positive
- Runtime a11y monitor ≤2ms overhead
- Predictive engine en az 10 pattern tanıyor

**Riskler:**
- GitHub API rate limit
- Runtime monitoring overhead
- False positive yönetimi

---

## Sprint C: F6 — Public Docs Portal (2 hafta)

**Hedef:** Astro/Starlight ile searchable, versioned, TR+EN docs site.

| # | İş | Öncelik | Tahmini |
|---|-----|:-------:|:-------:|
| C.1 | Astro/Starlight project setup | 🔴 | 1 gün |
| C.2 | Component API reference auto-gen entegrasyonu | 🔴 | 2 gün |
| C.3 | Interactive playground (code sandbox) | 🟠 | 3 gün |
| C.4 | Search entegrasyonu (Algolia/Pagefind) | 🟠 | 1 gün |
| C.5 | Versioned docs (v1, v2) | 🟡 | 1 gün |
| C.6 | TR + EN dil desteği | 🟡 | 2 gün |
| C.7 | Deploy pipeline (Vercel/Netlify) | 🟡 | 0.5 gün |

**Tamamlanma Kriterleri:**
- 186 bileşenin API reference'ı yayında
- Playground'da canlı kod çalıştırılabiliyor
- Lighthouse Performance ≥90
- TR + EN tam çeviri

**Riskler:**
- Astro/Starlight Storybook ile çakışma
- Component playground security (eval)
- i18n content maintenance

---

## Sprint D: FlowBuilder (1 hafta)

**Hedef:** No-code akış tasarımcısı bileşeni.

| # | İş | Öncelik | Tahmini |
|---|-----|:-------:|:-------:|
| D.1 | FlowBuilder canvas (SVG/Canvas, pan+zoom) | 🔴 | 2 gün |
| D.2 | Node palette (drag-to-canvas) | 🔴 | 1 gün |
| D.3 | Edge drawing (click-to-connect) | 🟠 | 1 gün |
| D.4 | Node property panel (sidebar) | 🟡 | 1 gün |
| D.5 | ProcessFlow ile entegrasyon (view mode) | 🟡 | 0.5 gün |

**Tamamlanma Kriterleri:**
- Node ekleme/silme/taşıma çalışıyor
- Edge bağlantı/koparma çalışıyor
- Pan + zoom çalışıyor
- Export → ProcessFlow formatı

---

## Genel Riskler

| Risk | Olasılık | Etki | Önlem |
|------|:--------:|:----:|-------|
| Dark mode regression diğer bileşenleri etkiler | Orta | Yüksek | Visual regression suite |
| F8 AI bot false positive | Yüksek | Orta | Configurable threshold |
| Docs portal maintenance | Orta | Orta | Auto-gen from source |
| FlowBuilder scope creep | Yüksek | Orta | MVP: basic CRUD only |
| React 19 migration (gelecek) | Düşük | Yüksek | Compat matrix hazır, ayrı sprint |

---

## Başarı Metrikleri

| Metrik | Şimdi | Sprint A | Sprint B | Sprint C | Sprint D |
|--------|:-----:|:--------:|:--------:|:--------:|:--------:|
| Scorecard Avg | 97.3 | 95 | 95 | 95 | 95 |
| Enterprise bileşen | 38 | 38 | 38 | 38 | 39 |
| CI Gate | 24 | 26 | 28 | 28 | 28 |
| Docs Portal | ⬜ | ⬜ | ⬜ | ✅ | ✅ |
| PR Bot | ⬜ | ⬜ | ✅ | ✅ | ✅ |
| FlowBuilder | ⬜ | ⬜ | ⬜ | ⬜ | ✅ |
