---
title: "Module Federation — Sorun Giderme"
status: published
owner: "@team/platform-fe"
last_review: 2025-11-08
tags: ["frontend", "module-federation", "troubleshooting"]
---

# Sık Görülen Hatalar ve Çözümler

- useNavigate() may be used only in the context of a <Router>
  - Neden: Remote, host ile aynı `react-router(-dom)` kopyasını paylaşmıyor.
  - Çözüm: Host ve remote `shared` bloklarıyla `react`, `react-dom`, `react-router`, `react-router-dom` için `singleton: true` ayarlayın; sürümleri hizalayın; `yarn/npm dedupe`.
  - Geçici Maskeleme: `apps/mfe-access/src/app/AccessApp.ui.tsx` içinde `useInRouterContext()` kontrolü ile MemoryRouter fallback var. Kalıcı çözüm sonrası kaldırın.

- Invalid hook call / two React copies
  - Neden: Birden fazla `react`/`react-dom` kopyası yükleniyor.
  - Çözüm: `shared.react`, `shared['react-dom']` için `singleton: true`; `yarn why react`, `npm ls react` ile tek kopya doğrulayın; `yarn/npm dedupe` uygulayın.

- Remote yüklenemedi (Failed to fetch remoteEntry.js)
  - Neden: Yanlış port/publicPath veya dev server ayağa kalkmadı.
  - Çözüm: Shell `remotes` URL’lerini doğrulayın; remote dev server portlarını kontrol edin; prod’da path‑bazlı URL kullanın.

- Router geçişlerinde beyaz ekran
  - Neden: Remote mount noktası hatası, Suspense fallback yok.
  - Çözüm: Shell route’larını `React.lazy` + `Suspense` ile sarmalayın; `ErrorBoundary` ile koruyun.

## Doğrulama Checklist
- [ ] Host ve tüm remotelarda `react`, `react-dom`, `react-router`, `react-router-dom` tekil (`singleton: true`)
- [ ] Versiyonlar hizalı (package.json)
- [ ] `yarn/npm dedupe` sonrası `npm ls react-router-dom` tek kopya
- [ ] Shell route’ları `ErrorBoundary` ve `Suspense` ile sarılı
- [ ] Remote’larda Router sarması yok (BrowserRouter/MemoryRouter kaldırıldı)
- [ ] Konsolda Router/hook call hatası yok; `useInRouterContext()` remote içinde `true`

Referans: docs/frontend/module-federation-sharing.md ve docs/frontend/examples/webpack

