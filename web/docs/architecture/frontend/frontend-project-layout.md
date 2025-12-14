---
title: "Frontend Monorepo Yapı İlkeleri"
status: published
owner: "@team/platform-arch"
last_review: 2025-11-03
tags: ["architecture", "frontend", "guideline"]
---

# Frontend Monorepo Yapı İlkeleri

Bu belge, mikro-frontend monoreposunu (apps + shared packages) yönetirken uygulanacak klasör düzeni, katmanlama ve kalite kurallarını özetler.

## 1. Monorepo Düzeyi

```
apps/
  mfe-shell/
  mfe-reporting/
  mfe-access/
  mfe-security/
  mfe-audit/
packages/
  ui-kit/
  shared-types/
  config/            # eslint, tsconfig, jest vb.
  i18n-dicts/        # derlenmiş sözlük artefact’ları
infra/
  ci-cd/             # pipeline config’leri
  backstage/         # katalog + portal
security/
  csp/               # CSP report-only politika & ham raporlar
  sri-manifest.json  # remote SRI hash kayıtları
scripts/
  security/          # SRI ve CSP guardrail script’leri
```

- `apps/`: Bağımsız deploy edilen MFE uygulamaları. Rapor ekranları için tek entry point `mfe-reporting`dir; shell `/reports` rotasında bu remote’u yükler.
- `packages/ui-kit`: Ant Design + AG Grid adaptörleri ve ortak bileşenler.
- `packages/config`: ESlint, tsconfig, jest gibi paylaşılan ayarlar.
- `packages/i18n-dicts`: Sözlük artefact’ları; semver ile Gateway/CDN üzerinden dağıtılır.  
  - `npm run i18n:pull` (lokal) / `npm run i18n:pull:ci` (CI) TMS’ten sözlükleri çeker. Gerekli env: `TMS_BASE_URL`, `TMS_API_TOKEN`; opsiyonel: `TMS_ENV`, `I18N_LOCALES`, `I18N_NAMESPACES`.  
  - Komut parametreleri: `--dry-run` yalnızca değişiklikleri raporlar; `--local-only` mevcut dosyalardan manifest güncellemesi yapar (TMS erişimi yoksa).  
  - `npm run i18n:pseudo` pseudo locale dosyalarını deterministik olarak üretir; CI’daki `i18n-smoke` workflow’u bu komutu çalıştırıp pseudo ile render testi yapar.  
  - Sözlükler `src/locales/<locale>/<namespace>.ts` olarak saklanır; `manifest.json` içinde etag/hash bilgisi ve `dictionaryVersion` semveri tutulur, script otomatik günceller.
- `infra/`: CI/CD pipeline script’leri ve Backstage katalog dosyaları.
- `security/`: CSP policy kayıtları, SRI manifesti ve oluşturulan raporlar (CI artefact’ı olarak arşivlenir).
- `scripts/security`: Guardrail doğrulama script’leri (`verify-sri.mjs`, `aggregate-csp.mjs` vb.).

## 1.1 Raporlama Entry Point’i

- `apps/mfe-reporting` tüm rapor ekranlarının (kullanıcı yönetimi grid’i, erişim rolleri raporu, audit feed vb.) tek frontend kaynağıdır.
- Shell menüsündeki “Raporlar” linki yalnızca `VIEW_REPORTS` izni olan kullanıcılara görünür; bu izin `VIEW_USERS` gibi daha geniş yetkiler tarafından transitif olarak verilebilir.
- Reporting MFE içinde React Router ile `/reports/users`, `/reports/access`, `/reports/audit` gibi alt rotalar yönetilir. Shell tarafında ekstra route tanımlamak gerekmez.
- Ortak UI şablonu (PageLayout + ReportFilterPanel + EntityGridTemplate + detay drawer) `packages/ui-kit`ten import edilir; reporting yalnızca domain’e özgü manifest, fetchFn ve drawer içeriklerini sağlar.

## 2. MFE İç Yapısı (Feature-First + Co-Location)

Her uygulama şu katmanları kullanır; dosyalar işlevine en yakın yerde tutulur.

```
apps/<mfe>/src/
  app/            # Router, Theme/i18n Provider, ShellServices entegrasyonu
  manifest/       # Sayfa manifestleri + Zod/JSON schema
  i18n/           # Locale çözümü, sözlük yükleme/cache
  shared/         # Atomik UI, küçük yardımcılar (domain agnostik)
  entities/<entity>/
    model/        # tipler, state, selector
    api/          # entity’ye ait HTTP/query sözleşmeleri
    lib/          # iş kuralı parçaları
    ui/           # küçük görünümler
  features/<feature>/
    ui/           # feature odaklı bileşenler
    model/        # küçük orkestrasyon, hook
    lib/
  widgets/<widget>/   # sayfalar arasında paylaşılan kompozit bloklar
  pages/<route>/
    index.tsx     # manifest + PageLayout kompozisyonu, routing
    manifest/     # sayfaya özel manifest dosyaları
  process/        # (opsiyonel) Çok adımlı akışlar (wizard, onay)
```

**Kompozisyon yönü:** `pages` → `widgets/features` → `entities` → `shared`. Ters bağımlılık yasak.

## 3. Dosya Son Ekleri ve Co-location

- `*.ui.tsx`: UI bileşenleri (AntD/AG Grid adapter’ları hariç).
- `*.model.ts`: State/hook/selector tanımları.
- `*.api.ts`: API/client sözleşmeleri.
- `*.lib.ts`: İş kuralı fonksiyonları.
- `*.types.ts`: Tip tanımları.
- Test, stil ve i18n anahtar dosyaları co-located (aynı klasör).

## 4. Manifest + i18n + AG Grid Yerleşimi

- Manifestler: `pages/<route>/manifest/` içerisinde; başlık, aksiyon, filtre, grid kolonları ve detail sekmeleri burada tanımlanır. Rapor ekranlarında kolon tanımları `i18nKey` alanı ile sözlüklere bağlanır (ör. `reports.users.columns.email`).
- i18n: Tüm metinler anahtar ile yönetilir; sözlük artefact’ları `packages/i18n-dicts`’ten gelir. Shell i18n çekirdeği yükleme/cache ve fallback’i üstlenir; `mfe-reporting` aynı altyapıyı Module Federation üzerinden tüketir.
- AG Grid: Sütun tanımları manifestte; cell renderer/formatter’lar features/widgets içinde adapter olarak bulunur.

## 4.1 i18n Çalışma Akışı ve Kontroller

- TMS’ten sözlük çekmek için:  
  1. `TMS_BASE_URL`, `TMS_API_TOKEN` (gerekiyorsa `TMS_ENV`) env değerlerini ayarla.  
  2. `npm run i18n:pull` (lokalde) ya da `npm run i18n:pull:ci` (CI).  
     - `--dry-run` ile yazma yapmadan farkları görebilirsin, `--local-only` mevcut dosyalardan manifest hash’lerini sıfırlar.  
  3. Çıktı `packages/i18n-dicts/src/locales/<locale>/<namespace>.ts` dosyalarında; manifest hash/versiyon alanı güncellenir, diff’leri incele.
- Pseudolocale testi: `npm run i18n:pseudo` → pseudo sözlükler üretilir.  
  - Lokal smoke: `I18N_LOCALE=pseudo npm run start --prefix web/apps/mfe-shell` ile shell’i pseudo locale’de gözlemleyebilirsin.  
  - CI `.github/workflows/i18n-smoke.yml`: `--dry-run --local-only` çekimiyle guardrail script’ini doğrular, pseudo sözlükleri üretir, drift kontrolü yapar ve `I18N_LOCALE=pseudo npm run build:shell` sonrası build çıktısında `Missing translation` izleri arar.
- Telemetry 404’leri lokal webpack dev server’da beklenir (`/api/telemetry` mock değil). Prod/test ortamlarında gerçek endpoint kullanılacaktır.

## 5. Boyut ve Karmaşıklık Limitleri

CI (ESLint + custom rules) şu limitleri enforce eder:

- UI bileşeni ≤ 250 satır.
- Hook/service ≤ 200 satır.
- Fonksiyon ≤ 40 satır.
- İç içe blok derinliği ≤ 3.
- Büyük form veya grid logic/adapter’ları ayrı küçük bileşenlere bölünür.

Kural aşımlarında build fail; dosya parçalama/pattern uygulaması beklenir.

## 6. Adapter İlkesi

AntD, AG Grid gibi kütüphanelere bağımlı kod adapter dosyalarında tutulur:

- Theme bağlamı `packages/ui-kit/theme/`.
- AG Grid adaptörleri `packages/ui-kit/grid/`.
- İş kuralları ve UI logic birbirine karışmaz.

## 7. İsimlendirme ve Export Kuralları

- Public API: Her slice (entities/features/widgets) kökünde indeks sadece dışa açılacak fonksiyonları export eder. İç klasöre doğrudan import yasaktır (ESLint boundaries ile enforce edilir).
- İsimlendirme: Dosya son ekleri (.ui/.model/.api/.lib/.types) arama ve onboarding’i kolaylaştırır.

## 8. Enforcer Araçlar

- ESLint plugin boundaries: Yasak importları ve cycle’ları engeller.
- Madge/depcruise: Import grafiği; cycle alarmı.
- max-lines/max-depth kuralları: Dosya boyutu ve karmaşıklığı kontrol altında.
- Backstage: Modül başına “en uzun 10 dosya”, cycle sayısı, karmaşıklık ortalaması gibi panolar.

## 9. Geçiş Rehberi (Mevcut Yapıdan)

- `components` → `shared/ui` (atomik) veya `features/widgets/ui`.
- `services` → `entities/*/api` veya `shared/lib`.
- `store` → domain state `entities/*/model`, global store `app/store`.
- `hooks` → `shared/lib` (genel) veya `features/*/model` (bağlamsal).
- `pages` → `pages/` (yalnız kompozisyon).
- `manifest` → `pages/*/manifest`.
- `constants/types` → `shared/config` veya `shared/types`.
- `i18n` → `i18n/` + `packages/i18n-dicts`.

Bu kurallar monorepo büyürken tutarlı bir bilgi mimarisi sağlar; Backstage & guardrail’lerle düzenli takip edilmelidir.
