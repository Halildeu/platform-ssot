# RB-ui-library-package-release

ID: RB-ui-library-package-release
Service: ui-library-package-release
Status: Draft
Owner: Frontend Platform

-------------------------------------------------------------------------------
1. AMAÇ
-------------------------------------------------------------------------------

- `mfe-ui-kit` paketinin fail-closed release ve publish akışını, zorunlu evidence
  artefact'larıyla birlikte tanımlamak.
- Storybook, bundle, SRI ve release manifest zincirinin tek release kararına bağlı
  çalışmasını sağlamak.

-------------------------------------------------------------------------------
2. KAPSAM
-------------------------------------------------------------------------------

- Girdi dosyaları:
  - `web/packages/ui-kit/package.json`
  - `docs/04-operations/RELEASE-NOTES/RELEASE-NOTES-ui-library.md`
- Zorunlu gate:
  - `ui-library-release`
- Zorunlu evidence:
  - `web/storybook-static/index.html`
  - `web/dist/ui-kit/remoteEntry.js`
  - `web/dist/ui-kit/ui-library-release-manifest.v1.json`
  - `web/test-results/releases/ui-library/latest/ui-library-release-manifest.v1.json`
  - `web/test-results/releases/ui-library/latest/ui-library-release.summary.v1.json`
  - `web/test-results/diagnostics/frontend-doctor/**/frontend-doctor.summary.v1.json`
  - `web/test-results/diagnostics/ui-library-wave-gate/**/ui-library-wave-gate.summary.v1.json`
  - `web/test-results/diagnostics/ui-library-release-gate/**/ui-library-release-gate.summary.v1.json`

-------------------------------------------------------------------------------
3. BAŞLATMA / DURDURMA
-------------------------------------------------------------------------------

- Ön koşullar:
  - `web/packages/ui-kit/package.json` içindeki version alanı güncel olmalıdır.
  - `docs/04-operations/RELEASE-NOTES/RELEASE-NOTES-ui-library.md` içinde aynı
    version için yeni giriş bulunmalıdır.
  - `ui-library-release` gate `PASS` olmalıdır.

- Başlatma:
  - `npm -C web run gate:ui-library-release`
  - `npm -C web run build-storybook`
  - `npm -C web run security:build-bundle`
  - `npm -C web run release:ui-library:manifest`
  - `CHROMATIC_PROJECT_TOKEN` varsa `npm -C web run chromatic`

- Durdurma:
  - Akış tek-shot çalışır; başarısız bir adım release’i fail-closed durdurur.

-------------------------------------------------------------------------------
4. GÖZLEMLEME / LOG / METRİKLER
-------------------------------------------------------------------------------

- Kanonik çıktı klasörleri:
  - `web/test-results/releases/ui-library/latest/`
  - `web/test-results/diagnostics/ui-library-wave-gate/`
  - `web/test-results/diagnostics/ui-library-release-gate/`
  - `web/test-results/diagnostics/frontend-doctor/`
- Kontrol edilmesi gereken temel artefact'lar:
  - `ui-library-release-manifest.v1.json`
  - `ui-library-release.summary.v1.json`
  - `frontend-doctor.summary.v1.json`
  - `ui-library-wave-gate.summary.v1.json`
  - `ui-library-release-gate.summary.v1.json`

-------------------------------------------------------------------------------
5. ARIZA DURUMLARI VE ADIMLAR
-------------------------------------------------------------------------------

- Release gate `FAIL` ise release yapılmaz; önce gate çıktısı düzeltilir.
- Manifest version ile release notes version uyuşmuyorsa release yapılmaz;
  versiyon kaynakları yeniden hizalanır.
- `publish_bundle` artefact'larından biri eksikse release yapılmaz; bundle ve
  manifest adımları yeniden koşturulur.
- Security build veya SRI adımı düşerse release durdurulur; güvenlik zinciri
  tekrar `PASS` vermeden publish yapılmaz.

-------------------------------------------------------------------------------
6. ÖZET
-------------------------------------------------------------------------------

- `mfe-ui-kit` release akışı, build ve publish kararını tek bir fail-closed
  release zincirine bağlar.
- Storybook, bundle, security ve manifest kanıtları eksiksiz değilse paket
  release edilmez.

-------------------------------------------------------------------------------
7. LİNKLER (İSTEĞE BAĞLI)
-------------------------------------------------------------------------------

- `docs/04-operations/RELEASE-NOTES/RELEASE-NOTES-ui-library.md`
- `web/scripts/ops/run-ui-library-release.mjs`
- `web/scripts/ops/run-ui-library-release-gate.mjs`
