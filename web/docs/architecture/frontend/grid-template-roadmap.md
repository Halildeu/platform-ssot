# Grid Şablonu Yol Haritası

Bu doküman, mikro-frontend (MFE) tarafındaki tüm listeleme/raporlama ekranlarında aynı grid altyapısını kullanmayı hedefleyen yaklaşımı özetler.

## 1. Varsayılan Çalışma Modu
- `EntityGridTemplate` varsayılan olarak **server-side row model** arayüzünü uygular.
- Grid yüklenirken seçili/varyant varsayılanı uygulanır; kolon düzeni, quick filter vb. ayarlar grid API’sine set edilir.
- Varyant uygulandıktan sonra yalnızca ilgili slice backend’den çekilir (`refreshServerSideStore`).

## 2. İsteğe Bağlı Client Modu
- `dataSourceMode` prop’u ile mod seçilebilir (`'server' | 'client'`).
- Server modda kullanıcı “Veriyi yerelde incele” dediğinde:
  - O anki slice `rowData` olarak toplanır.
  - Grid client-side row modele geçirilir, kolon filtreleri yerelde çalışır.
  - Excel export grid’in lokal API’si ile yapılır.
- Server moda dönüşte güncel `filterModel`, `sortModel`, quick filter gibi bilgiler grid API’sine tekrar set edilerek backend sorgusu aynı kriterlerle tetiklenir.

## 3. Ortak Datasource Katmanı
- `createServerSideDatasource(fetchFn)` yardımcı fonksiyonu, her raporun backend uçlarını tek kontrata oturtur.
  - `fetchFn(request, extraFilters)` parametrik olarak yazılır; export durumunda aynı fonksiyon export flag’iyle çağrılır.
  - `successCallback(rows, rowCount)` / `failCallback()` kullanımı standarttır.
- `EntityGridTemplate` props:
- `columns`, `gridId`, `fetchFn(req)`, `toolbarSlots`, `detailDrawer(row)`, `onRowAction(action,row)`, `onRequestChange(req)`, `reloadSignal`.

- `useGridData`/datasource hook’u (gelecek):
  - Server modda datasource bağlama ve refresh davranışını yönetir.
  - Client modda basit `rowData` dönüşü yapar.
- Excel export çağrısı mod’a göre otomatik seçilir:
  - Server modda `serverSideExcelExport`.
  - Client modda `exportDataAsExcel`.

## 4. Varyant Entegrasyonu
- Her grid bir `gridId` üzerinden varyant kaydeder/uygular.
- Varyant state’i minimumda kolon düzeni ve quick filter’ı içerir; gerekirse sunucu filtre bilgisi de eklenebilir.
- Varyant uygulandıktan sonra server-side datasource `refresh` edilerek veri güncellenir.

## 5. Filtre Deneyimi
- Ekstra üst filtre barı tutulmaz; AG Grid’in kolon filtreleri ve Tool Panel’i server-side filtreye entegre çalışır.
- Rapora özel ek filtre formu gerekirse `EntityGridTemplate` üzerindeki slot ile eklenebilir; eklenmezse standart kolon filtreleri yeterlidir.
- Gelişmiş koşul paneli (Advanced Filter) açıldığında kolon menülerindeki filtrelerle birlikte çalışır; panelde tanımlanan koşullar `filterModel` ile paylaşıldığından, kolon filtreleri ve quick filter kapanmaz. Filtreleri temizlemek için panel veya kolon menüsü ayrı ayrı kullanılmalıdır.

## 6. Rapor Bazlı Uygulama
`mfe-reporting` altında yaşayan her rapor ekranı aşağıdaki parametreleri sağlar; Shell yalnızca `/reports` rotasında bu mikro-frontend’i yükler:
1. `columns`: AG Grid kolon tanımları.
2. `gridId`: Varyant kimliği.
3. `fetchFn`: Backend API adaptörü (`request` parametrelerini alıp REST çağrısı yapan fonksiyon).
4. (Opsiyonel) Toolbar/slot bileşenleri veya ek filtre formları.
5. `detailDrawer`: Satır seçildiğinde açılacak domain’e özgü panel.

> Not: Kolon başlıkları `i18nKey` alanıyla sözlüklere bağlanır (örn. `reports.users.columns.email`). Çeviriler `packages/i18n-dicts` üzerinden çekilir; `ReportFilterPanel` de aynı key’lerle çalışır.

## 7. Backend Gereksinimleri
- API uçları, AG Grid’den gelen `filterModel`, `sortModel`, `startRow`, `endRow` parametrelerini okuyacak şekilde tasarlanır.
- Büyük dataset’ler için index, partition, cache ve rate-limit ihtiyacı değerlendirilir.
- Server-side Excel export durumunda backend, talep edilen dataset’i (gerekirse chunk’lı) stream ederek döner.

## 8. Dokümantasyon ve Örnekler
- Server/client mod kullanım senaryoları ve `dataSourceMode` deklarasyonu.
- Datasource kontratı (`fetchFn`, export flag’i) ve backend örnekleri.
- Varyant davranışı: client → server dönüşünde state’in korunması.
- Toolbar aksiyonları: refresh, export, mod değişimi.
- Örnek ekranlar: kullanıcı yönetimi, audit listesi, rapor ekranı.

Uygulamadaki iskelet dosyalar:
- `packages/ui-kit/src/lib/grid/EntityGridTemplate.tsx`
- `packages/ui-kit/src/lib/grid/AgGridServerAdapter.tsx` (placeholder)
- `packages/ui-kit/src/lib/grid/types.ts`
- `web/apps/mfe-users/src/entities/users/api/usersApi.ts`
- `web/apps/mfe-users/src/widgets/user-management/ui/UsersGrid.ui.tsx`
- `web/apps/mfe-users/src/pages/users/index.tsx`
- `web/apps/mfe-reporting/src/app/reporting/ReportingApp.tsx`
- `web/apps/mfe-reporting/src/modules/*` (yeni raporlar için manifest + fetchFn + drawer)

Notlar
- Gerçek AG Grid SSRM entegrasyonu için `ag-grid-community` + `ag-grid-react` bağımlılıklarını ekleyin ve `AgGridServerAdapter` içinde GridOptions→fetchFn köprüsünü kurun.

Bu yol haritası takip edildiğinde, tüm MFE grid’leri aynı şablonu kullanarak tutarlı bir kullanıcı deneyimi sunar ve bakım maliyetini azaltır.
