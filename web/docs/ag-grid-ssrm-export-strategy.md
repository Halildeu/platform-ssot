# AG Grid SSRM Export (Büyük Veri) Stratejisi

Server-Side Row Model (SSRM) ile 100K+ satır veri setlerinde Excel/CSV export için öneriler ve örnekler.

## 1) Export Modları
- Client Excel Export: `api.exportDataAsExcel(params)`
  - Küçük veri setleri, görüntülenen veri için hızlı çözüm.
- Server-Side Excel Export: `api.serverSideExcelExport(params)`
  - SSRM ile tüm veri (sayfa dışı bloklar dahil). AG Grid gereken blokları arka arkaya ister.
- CSV (stream): Büyük veri için backend stream + indirmeyi tercih edin.

## 2) UI Tarafı Önerileri
- Export öncesi store tazeleme:
  ```ts
  gridApi.refreshServerSideStore({ purge: false });
  gridApi.serverSideExcelExport({ exportAllRows: true, allColumns: true });
  ```
- Fallback: `serverSideExcelExport` hata verirse `exportDataAsExcel`’e düş.
- Filtre/sıralama/varyant durumlarını export param’larına yansıt (audit için).
- Shell telemetry & notify:
  - CSV export butonu, shell servislerine aşağıdaki event’leri gönderir:
    - `users.export_csv.stream.start`
    - `users.export_csv.stream.success`
    - `users.export_csv.stream.rate_limit`
    - `users.export_csv.stream.error`
  - Payload örneği:
    ```ts
    emitShellTelemetry({
      type: 'users.export_csv.stream.start',
      payload: {
        search,
        role,
        status,
        sort,
        advancedFilter: params.advancedFilter ? 'set' : 'none',
        dataSourceMode,
        state: 'start',
      },
    });
    ```
  - Başarı / limit / hata durumlarında shell notify (Ant `message`) ile kullanıcı bilgilendirilir.

## 3) Backend Tasarım (REST)
- İstek modeli (örnek):
  - `GET /api/users/all?page=1&pageSize=500&sort=...&filter=...`
  - SSRM blok boyutu (`cacheBlockSize`) ile uyumlu sayfa boyutları.
- Sorgu motoru:
  - Cursor/tabanlı sayfalama tercih edin (stabil sıralama).
  - Ağır join’leri azaltın; projection (SELECT alanları) daraltın.
  - Zor filtreleri indeksleyin (BTREE/GIN).
- Streaming CSV (tercih edilen büyük veri yöntemi):
  - `GET /api/users/export.csv?filter=...` → `text/csv` + chunked/stream.
  - Memory: satır satır yazım (JDBC fetchSize / Spring `StreamingResponseBody`).

## 4) Performans Ayarları
- SSRM blok boyutu: 200–1000 arası deneyin; ağ RTT’ye göre değişir.
- Max blok cache: `maxBlocksInCache: 1–3` ile bellek kontrolü.
- Backend limit: `pageSize` üst sınırı (örn. 1000) ve toplam satır sayısını (count) ayrı endpoint’te önbelleğe alın.

## 5) Güvenlik/ Uyumluluk
- PII maskeleme: export’ta gereksiz alanları dışarıda bırakın.
- Yetki kontrolü: export izni (`PERMISSIONS.EXPORT`) ayrı değerlendirin.
- Hız limiti: rate-limit ve audit log (kim, ne zaman, hangi filtre ile).

## 6) Örnek Akış (Excel - SSRM)
1. UI: Export tıklandı → SSRM store refresh.
2. Grid: `serverSideExcelExport({ exportAllRows: true })`.
3. Grid → Backend: blok blok `/api/users/all?page=...` istekleri.
4. UI: Tamamlandığında bildirim ve audit kaydı.

## 7) CSV Streaming Akışı (Önerilen)
1. UI: `GET /api/users/export.csv?...` yeni pencerede/indirmede.
2. Backend: Cursor ile chunk chunk yazım; bellek sabit kalır.
3. UI: İnen dosya boyutu büyükse kullanıcıya uyarı/iptal seçeneği.
4. Telemetry zinciri:
   - start → success/error/rate_limit event’leri
   - Payload’a `durationMs`, `message` eklenerek Tempo/Loki’de analiz edilir.
5. Rate-limit senaryosu UI tarafında 8 saniyelik “cooldown” ile kullanıcıya açıklanır; buton disable edilir.

## 8) Test ve İzleme
- Ölçümler: export süresi, hata oranı, satır/saniye, ağ throughput.
- İzleme: Gateway → kullanıcı/boyut/filtre ile audit.
- E2E: 10K/100K/500K örnek veri ile duman testleri, OOM guard.

## 9) Arama / Filtre / Sıralama → API Parametreleri
- `search`: quick filter metni (örn. tüm sütunlarda metin arama). UI: `api.setGridOption('quickFilterText', value)` → SSRM refresh → `search` param.
- `advancedFilter`: AG Grid advanced filter modelinin URL‑encoded JSON hali. Örn: `advancedFilter=%7B...%7D`
- `sort`: Çoklu sütun sırala. Format: `field,dir;field2,dir2` (dir: `asc|desc`).

Örnek İstek
`GET /api/users/all?page=1&pageSize=50&search=john&advancedFilter=%7B...%7D&sort=fullName,asc;email,desc`

Backend Notları
- `advancedFilter` güvenli parse + whitelist (alan/operatör) ve parametre bağlama.
- `search` için ILIKE + ilgili indeksler.
- `sort` için bilinmeyen alan/yonet reddi (400) ve çoklu ORDER BY desteği.
