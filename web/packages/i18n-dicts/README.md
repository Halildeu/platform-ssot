# i18n dictionaries

Manifest tabanlı sözlük paketi. Tüm MFE’ler bu paketten aldığı statik sözlükler ile çalışır.

## Komutlar

- `npm run pull` — TMS’ten sözlükleri çeker, `src/locales/<locale>/<namespace>.ts` dosyalarını ve `manifest.json` kayıtlarını günceller.  
  - Gerekli env: `TMS_BASE_URL`, `TMS_API_TOKEN`  
  - Opsiyonel env: `TMS_ENV`, `I18N_LOCALES`, `I18N_NAMESPACES`  
  - Ek parametreler: `--dry-run` (yalnızca rapor), `--local-only` (TMS olmadan manifest hash yenileme)
- `npm run pull:ci` — CI için non-interactive çalıştırma.
- `npm run pull:dry` — CLI üzerinden hızlı dry-run.
- `npm run generate:pseudo` — Pseudo locale sözlüklerini deterministik üretir.

## Çıktılar

- `manifest.json`  
  - `version`: semver (otomatik artar)  
  - `entries[locale:namespace]`: etag, sha256, key sayısı, değişiklik istatistikleri  
  - `tms`: çekilen ortam bilgisi (base URL, env)
- `src/locales/<locale>/<namespace>.ts`: deterministik formatlanmış sözlük modülleri.

Pseudo locale (`pseudo/`) dosyaları TMS’ten değil base locale’den türetilir; repoda tutulur ancak pipeline’da otomatik üretim yapılır.
