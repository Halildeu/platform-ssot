SSRM Single-Fetch Test

Amaç: AG Grid Server-Side Row Model (SSRM) ilk açılışta sadece 1 kez `getRows` çağrıldığını test etmek.

Dosya: `docs/tests/ssrm-single-fetch.spec.tsx`

Önkoşullar (frontend repo'nuzda):
- Vitest + jsdom test ortamı
- @testing-library/react
- ag-grid-react, ag-grid-community, ag-grid-enterprise v34+

Kurulum örneği (npm):
- npm i -D vitest @testing-library/react @testing-library/jest-dom
- npm i react react-dom ag-grid-react ag-grid-community ag-grid-enterprise

Vitest ayarı (özet):
- environment: 'jsdom' (vitest.config.ts)
- setupFiles: ['./setup.ts'] → `import '@testing-library/jest-dom/vitest'`

Çalıştırma:
- Test dosyasını frontend projenizde uygun bir `__tests__` klasörüne kopyalayın.
- React.StrictMode KAPALI bir test ağacında render edin (StrictMode dev'de çift çağrıya sebep olur).
- npx vitest run

Beklenen:
- `getRows` sadece 1 kez çağrılır (range 0..50 gibi).
- Prod build'te de tek çağrı kalır.

Notlar:
- Başlangıçta pinned rows veya grid model güncellemeleri yapıyorsanız, bunları `gridOptions` ile verin; açılışta ayrı bir `api.setPinnedTopRowData` tetiklemesi ekstra fetch doğurabilir.
- `blockLoadDebounceMillis` küçük bir değer (örn. 25ms) girmek arka arkaya gelen tetiklemeleri birleştirmeye yardımcı olur.
