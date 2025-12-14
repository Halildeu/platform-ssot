SSRM Single-Fetch Test

Amaç: AG Grid Server-Side Row Model (SSRM) ilk açılışta sadece 1 kez `getRows` çağrıldığını test etmek.

Dosya: `docs/frontend/tests/ssrm-single-fetch.spec.tsx`

Önkoşullar (frontend repo’nuzda):
- Jest + jsdom test ortamı
- @testing-library/react
- ag-grid-react, ag-grid-community, ag-grid-enterprise v34+

Kurulum örneği (npm):
- npm i -D jest @types/jest @testing-library/react @testing-library/jest-dom ts-jest
- npm i react react-dom ag-grid-react ag-grid-community ag-grid-enterprise

Jest ayarı (özet):
- testEnvironment: 'jsdom'
- transform: ts-jest (TS kullanıyorsanız)
- setupFilesAfterEnv: ['@testing-library/jest-dom']

Çalıştırma:
- Test dosyasını frontend projenizde uygun bir `__tests__` klasörüne kopyalayın.
- React.StrictMode KAPALI bir test ağacında render edin (StrictMode dev’de çift çağrıya sebep olur).
- npm test

Beklenen:
- `getRows` sadece 1 kez çağrılır (range 0..50 gibi).
- Prod build’te de tek çağrı kalır.

Notlar:
- Başlangıçta pinned rows veya grid model güncellemeleri yapıyorsanız, bunları `gridOptions` ile verin; açılışta ayrı bir `api.setPinnedTopRowData` tetiklemesi ekstra fetch doğurabilir.
- `blockLoadDebounceMillis` küçük bir değer (örn. 25ms) girmek arka arkaya gelen tetiklemeleri birleştirmeye yardımcı olur.
