# Token Pipeline — Sahiplik Kontrati

## Iki Pipeline

### Runtime Tokens (tokens:build:theme)
- **Komut:** `npm run tokens:build:theme`
- **Script:** `scripts/theme/generate-theme-css.mjs`
- **Girdi:** `design-tokens/figma.tokens.json`
- **Cikti:**
  - `apps/mfe-shell/src/styles/theme.css` — CSS custom properties (appearance, density, radius, elevation, motion axisleri)
  - `design-tokens/generated/theme-contract.json` — Theme contract manifest
- **Rol:** ThemeProvider runtime styling — CSS custom properties (`data-theme`, `data-radius`, `data-density`, `data-elevation`, `data-motion` attribute'lari ile axis bazli selector'lar uretir). Token Bridge blogu ile component-level alias'lar da dahil.
- **Ne zaman calisir:**
  - CI: `security-guardrails.yml` workflow'unda `npm run tokens:build` step'i ile (her PR ve main push)
  - `--check` modu ile drift tespiti yapilabilir
- **Sahip:** Design System team

### Design-time Tokens (tokens:build)
- **Komut:** `npm run tokens:build`
- **Script:** `scripts/tokens/build-tokens.mjs`
- **Girdi:** `packages/design-system/src/tokens/` altindaki `.ts` kaynak dosyalar (color.ts, spacing.ts, radius.ts, typography.ts, motion.ts, zIndex.ts, elevation.ts, opacity.ts, density.ts, focusRing.ts, semantic.ts)
- **Cikti:** `packages/design-system/src/tokens/build/` dizinine:
  - `tokens.json` — Tum token'lar kategoriye gore JSON
  - `tokens.css` — CSS custom properties (:root blogu)
  - `token-types.ts` — TypeScript union type'lar (her token kategorisi icin)
  - `docs.json` — Design Lab token viewer icin dokumanasyon verisi
- **Rol:** Design Lab, documentation, type safety, Figma export
- **Ne zaman calisir:**
  - CI: `design-system-gate.yml` workflow'unda `tokens:validate` sonrasi `Build tokens` step'i ile (design-system veya token dosyalarina dokunan PR'larda)
  - CI: `security-guardrails.yml` workflow'unda `npm run tokens:build` step'i ile (her PR ve main push)
- **Sahip:** Design System team

## Validation Gate
- **Komut:** `npm run tokens:validate`
- **Script:** `scripts/tokens/validate-tokens.mjs`
- **Ne kontrol eder:**
  - Duplicate token name tespiti (export seviyesinde ve leaf-level cross-file)
  - Color dosyalarinda gecersiz renk degeri kontrolu (hex, rgb, rgba, hsl, hsla, CSS var, named color)
  - Spacing/size dosyalarinda gecersiz boyut degeri kontrolu (px, rem, em, vb.)
  - Undefined veya bos referans kontrolu
- **CI'da nerede:** `design-system-gate.yml` — `Validate tokens` step'i (`tokens:build` oncesinde calisir)
- **Fail olursa:** PR merge edilemez (exit code 1 doner)

## Release Iliskisi
- Token degisikligi -> design-system minor/patch release gerektirir
- `tokens:build` ciktisi `dist/`'e dahil mi? **Evet** — `src/tokens/build/` dizini `src/` altinda oldugundan ve `package.json`'daki `files` alani `"src"` icerdiginden, publish edilen pakete dahildir
- `tokens:build:theme` ciktisi nerede tuketiliyor? `apps/mfe-shell/src/styles/theme.css` olarak uretilir ve mfe-shell uygulamasi tarafindan import edilir. ThemeProvider, `DesignSystemProvider` uzerinden runtime'da CSS custom property'leri `data-*` attribute'lari ile uygular.

## Akis Diyagrami
```
Token source (figma.tokens.json)
  └── tokens:build:theme → theme.css + theme-contract.json → mfe-shell → ThemeProvider → Runtime

Token source (.ts dosyalari: color, spacing, radius, typography, motion, zIndex, elevation, opacity, density, focusRing, semantic)
  ├── tokens:build → tokens.json + tokens.css + token-types.ts + docs.json → Design Lab + Types + Figma export
  └── tokens:validate → CI gate (duplicate/gecersiz deger/undefined ref kontrolu)
```

## Sorumluluklar
| Aksiyon | Sorumlu | Ne zaman |
|---------|---------|----------|
| Token ekleme/degistirme (.ts kaynaklar) | Design System team | Feature branch |
| figma.tokens.json guncelleme | Design System team | Figma sync sonrasi |
| tokens:validate calistirma | CI (otomatik, design-system-gate.yml) | design-system veya token dosyalarina dokunan her PR |
| tokens:build calistirma | CI (otomatik, design-system-gate.yml + security-guardrails.yml) | Her PR ve main merge |
| tokens:build:theme calistirma | CI (otomatik, security-guardrails.yml) | Her PR ve main push |
| Drift kontrolu (--check modu) | CI (otomatik) | TBD — dogrulanmali |
| Release notu yazma | Design System team | Her token degisikliginde |
