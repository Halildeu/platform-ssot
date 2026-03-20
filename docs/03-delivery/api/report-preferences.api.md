## Report Preferences API Sozlesmesi

Amac: Web ve mobil raporlama yuzeylerinin ayni rapor kimligini kullanirken
favori raporlar ve kayitli filtreler icin tek bir persistence sozlesmesine
baglanmasini saglamak.

-------------------------------------------------------------------------------
1) Canonical Ownership
-------------------------------------------------------------------------------

- Backend ownership:
  - Servis: `variant-service`
  - Canonical REST path: `/api/v1/variants`
- Yetki:
  - Okuma: `VARIANTS_READ`
  - Yazma: `VARIANTS_WRITE`
- Ownership ilkesi:
  - `favorite reports` ve `saved filters` business entity degil, kullaniciya ozel
    gorunum tercihidir.
  - Bu nedenle canonical persistence yuzeyi `variant-service` olarak sabitlenir.
  - Rapor tercihleri baska servislerin tablolarina dagitilmaz.

-------------------------------------------------------------------------------
2) Grid Kimlikleri
-------------------------------------------------------------------------------

- Favori raporlar:
  - `gridId = reports.catalog.preferences`
  - `name = favorite-reports`
- Kayitli filtreler:
  - `gridId = reports.saved-filters.{channel}.{reportId}`
  - Ornekler:
    - `reports.saved-filters.web.audit-activity`
    - `reports.saved-filters.web.users-overview`
    - `reports.saved-filters.mobile.audit-activity`

Notlar:
- `reportId`, shared report catalog icindeki canonical kimliktir.
- `channel`, `web|mobile` olarak ayrilir.
- Bugunku uygulama modelinde hem web hem mobil kendi kanal presetlerini
  uretebilir.
- Mobil istemci ayni anda hem `web` hem `mobile` presetlerini okuyup
  uygulayabilir.

-------------------------------------------------------------------------------
3) Favori Rapor State Modeli
-------------------------------------------------------------------------------

- Varyant state:
```json
{
  "filterModel": {
    "favorites": ["audit-activity", "roles-access"]
  }
}
```

Kurallar:
- `favorites` yalniz canonical `SharedReportId` listesi tasir.
- Bos favori listesi varsa `favorite-reports` varyanti silinebilir.
- Ayni kullanici icin tek aktif favori varyanti vardir.

-------------------------------------------------------------------------------
4) Kayitli Filtre State Modeli
-------------------------------------------------------------------------------

- Varyant state:
```json
{
  "filterModel": {
    "search": "session",
    "level": "WARN"
  }
}
```

Kurallar:
- `filterModel`, shared report catalog’daki `filterParity` sozlugune uyan
  anahtarlar tasir.
- Kayitli filtreler rapor bazli ve kanal bazlidir.
- Varsayilan soft limit: rapor+kanal basina `5` preset.
- Bu limit UI ve client mapping tarafinda zorunlu kabul edilir; backendde daha
  buyuk liste dursa bile istemci en yeni `5` preset ile calisir.

-------------------------------------------------------------------------------
5) Web ve Mobil Tuketim Modeli
-------------------------------------------------------------------------------

- Web:
  - favori ekleme/cikarma yapar
  - preset kaydeder/gunceller/siler
  - local cache tutar, ama canonical kaynak sunucudur
- Mobil:
  - favori ekleme/cikarma yapar
  - web ve mobile kanallarindaki presetleri okuyabilir
  - mobile kanalinda preset create/update/delete yapabilir
  - presetleri report detail ekraninda `apply` eder

-------------------------------------------------------------------------------
6) Export Delivery Modeli
-------------------------------------------------------------------------------

- Bugunku canonical durum:
  - `audit-activity` web export mode = `job`
  - export endpoint zinciri:
    - `POST /api/audit/events/export-jobs`
    - `GET /api/audit/events/export-jobs/{jobId}`
    - `GET /api/audit/events/export-jobs/{jobId}/download`
  - demo oturumunda `audit-export` izni yoksa istemci export aksiyonunu acmaz
- Fail-closed kural:
  - Async export job capability’si backendde resmi olarak acilmadan,
    istemciler sahte `jobId/status polling` modeli uydurmaz.
  - `exportMode = job` ancak backend tarafinda ayri capability tanimi,
    status endpoint’i ve audit semantics acildiginda kullanilabilir.

-------------------------------------------------------------------------------
7) Kabul Kriterleri
-------------------------------------------------------------------------------

- Ayni kullanicinin webde isaretledigi favori rapor mobilde gorunur.
- Webde kaydedilen preset, mobil detail ekraninda okunup uygulanabilir.
- Mobilde kaydedilen `mobile` kanal preset'i ayni kullanici icin sonraki oturumda
  tekrar okunabilir.
- Mobilde secili `mobile` preset'i ayni variant kaydi uzerinden yeniden
  adlandirilabilir veya filtre modeli guncellenebilir.
- Variant-service gecici olarak erisilemezse istemci local cache ile fail-open
  UX saglayabilir; canonical state yazimi basarisizsa UI bozulmaz.
- Export akisinda backend job capability’si yoksa istemci direct download
  disinda davranis uretmez.

-------------------------------------------------------------------------------
8) Baglantilar
-------------------------------------------------------------------------------

- Shared catalog: `web/packages/platform-capabilities/src/index.ts`
- Variant API: `backend/docs/legacy/root/03-delivery/api/variant.api.md`
- Audit export: `docs/03-delivery/api/audit-events.api.md`
