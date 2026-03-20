# Antd Lockfile & Dependency Audit

**Tarih:** 2026-03-20

## Tarama Sonuclari

### package.json dosyalarinda antd

| Dosya | Referans | Durum |
|-------|----------|-------|
| `package.json` (root) | Yalnizca `lint:no-antd` script | Temiz (guard scripti) |
| `packages/shared-types/package.json` | -- | Temiz |
| `packages/platform-capabilities/package.json` | -- | Temiz |
| `packages/shared-http/package.json` | -- | Temiz |
| `packages/i18n-dicts/package.json` | -- | Temiz |
| `packages/design-system/package.json` | -- | Temiz |
| `apps/mfe-shell/package.json` | -- | Temiz |
| `apps/mfe-audit/package.json` | -- | Temiz |
| `apps/mfe-ethic/package.json` | -- | Temiz |
| `apps/mfe-suggestions/package.json` | -- | Temiz |
| `apps/mfe-access/package.json` | -- | Temiz |
| `apps/mfe-reporting/package.json` | -- | Temiz |
| `apps/mfe-users/package.json` | -- | Temiz |

> **Not:** Hicbir package.json dosyasinda (root haric) dogrudan `antd` veya `@ant-design` referansi bulunmamaktadir.

### Lockfile'larda antd izleri

| Dosya | Satir Sayisi | Durum | Aksiyon |
|-------|-------------|-------|---------|
| `pnpm-lock.yaml` | 0 | Temiz | -- |
| `package-lock.json` (root) | 0 | Temiz | -- |
| `apps/mfe-shell/package-lock.json` | 0 | Temiz | -- |
| `apps/mfe-audit/package-lock.json` | -- | Dosya yok | -- |
| `apps/mfe-ethic/package-lock.json` | 0 | Temiz | -- |
| `apps/mfe-suggestions/package-lock.json` | 0 | Temiz | -- |
| `apps/mfe-access/package-lock.json` | 29 | Residue | Temizle |
| `apps/mfe-reporting/package-lock.json` | 30 | Residue | Temizle |
| `apps/mfe-users/package-lock.json` | 29 | Residue | Temizle |

#### Detay: Lockfile residue kaynagi

Bu 3 lockfile'da antd **dogrudan dependency olarak** tanimlidir (lockfile icerisindeki `packages[""]` blogundan):

- **mfe-access:** `"antd": "^5.27.4"` (direct dep) + `@ant-design/*` transitive deps
- **mfe-reporting:** `"antd": "^5.19.4"` + `"@ant-design/icons": "^5.3.6"` (direct deps) + transitive deps
- **mfe-users:** `"antd": "^5.27.4"` (direct dep) + `@ant-design/*` transitive deps

> **Kritik:** Her ne kadar bu app'lerin kendi `package.json` dosyalarinda antd listelenmemis olsa da, lockfile'lar eski bir `npm install` sirasinda olusmus ve temizlenmemistir. Bu lockfile'lar stale (bayat) durumdadir.

### Build config'lerde antd

| Dosya | Referans | Durum |
|-------|----------|-------|
| `webpack.config.*` | -- | Temiz |
| `next.config.*` | -- | Temiz |
| `vite.config.*` | -- | Temiz |
| `*.config.{js,ts}` | -- | Temiz |

> Hicbir build konfigurasyonunda antd referansi bulunmamaktadir.

### Kaynak kodda antd importlari

| Kapsam | `from 'antd'` | `from '@ant-design/*'` | Durum |
|--------|---------------|----------------------|-------|
| `apps/` | 0 | 0 | Temiz |
| `packages/` | 0 | 0 | Temiz |

> Kaynak kodda hicbir antd importu kalmamistir. Guard mekanizmasi basarili calismaktadir.

### ESLint kurallari

- `packages/design-system/eslint-rules/no-new-ant-import.js`: Yeni antd importlarini engelleyen ozel ESLint kurali mevcut.
- `packages/design-system/src/legacy/ant-exit-plan.ts`: Cikis plani dokumantasyonu mevcut.

## Guard Mekanizmasi

- `npm run lint:no-antd`: **PASS** (root package.json satirda 130'da tanimli)
- `check-no-antd.mjs`: **Mevcut** (`scripts/check-no-antd.mjs`)
  - `from 'antd'` ve `from '@ant-design/icons'` pattern'lerini tarayan git-tracked `.ts/.tsx/.js/.jsx` dosyalarinda arama yapar
  - Violation bulursa exit code 1 ile cikar
- CI enforcement: **Aktif** (`.github/workflows/chromatic.yml` satir 44: `npm run lint:no-antd`)

## Karar

### Temizlenmesi gerekenler

1. **`apps/mfe-access/package-lock.json`** -- Lockfile icerisinde stale antd dependency tanimli. `package.json`'dan antd zaten cikarilmis, ancak lockfile yeniden generate edilmemis. `rm package-lock.json && npm install` ile temizlenebilir.

2. **`apps/mfe-reporting/package-lock.json`** -- Ayni durum. Ek olarak `@ant-design/icons` de dogrudan dependency olarak kalmis. Lockfile yeniden generate edilmeli.

3. **`apps/mfe-users/package-lock.json`** -- Ayni durum. Lockfile yeniden generate edilmeli.

### Kabul edilenler

- **Root `pnpm-lock.yaml`** ve **root `package-lock.json`**: Temiz, aksiyon gerektirmez.
- **ESLint rule** (`no-new-ant-import.js`) ve **guard script** (`check-no-antd.mjs`): Bunlar antd referansi icerirler ancak bu beklenen bir durumdur (guard amacli).
- **`ant-exit-plan.ts`**: Dokumantasyon dosyasi, antd'yi referans eder ancak import etmez.

### Onerilen aksiyonlar

1. Uc app lockfile'ini regenerate et (`mfe-access`, `mfe-reporting`, `mfe-users`)
2. Guard scriptinin lockfile'lari da taramasini degerlendir (su an sadece kaynak koda bakiyor)
3. `mfe-reporting/package.json`'da `@ant-design/icons`'un hala listelenmedigini teyit et (lockfile'da var ama package.json'da yok -- anomali)
