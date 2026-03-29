# Variant Manager — Global Default E2E/Regresyon Senaryoları

Bu doküman, AG Grid tabanlı rapor ekranlarında kullanılan Variant Manager’ın (global varsayılan + kullanıcı varsayılanı) için gereken E2E/regresyon test kapsamını tanımlar. Kaynak bileşenler:

- UI: `apps/mfe-reporting/src/components/entity-grid/EntityGridTemplate.tsx`
- Variant state: `apps/mfe-reporting/src/lib/grid-variants/use-grid-variants.ts`
- API katmanı: `apps/mfe-reporting/src/lib/grid-variants/variants.api.ts`

## 1. Test Ortamı
- Grid manifest’i `gridId` parametresiyle açılabilen herhangi bir rapor (örn. Users grid).
- Mock API: `/api/reporting/variants` endpoints (create/update/delete/clone/preference).
- Test kullanıcı rolleri:
  - `admin`: global variant oluşturma/varsayılan yapma yetkisi.
  - `viewer`: yalnız kullanıcı seviyesinde variant kaydedebilir, globali sadece okuyabilir.

## 2. Senaryo Matrisi

| ID | Senaryo | Beklenen Davranış | Notlar |
| --- | --- | --- | --- |
| V1 | Global varsayılan fallback | Kullanıcı query param (`?variant=`) ve kullanıcı varsayılanı yoksa `isGlobalDefault=true` olan varyant otomatik seçilir, grid filtreleri uygulanır. | Doğrulama: manifest url’inde `variant` param yok, grid filter panel state global varyantla eşleşmeli. |
| V2 | Kullanıcı varsayılanı globali override eder | Kullanıcı `Set as default` ile kişisel (non-global) varyantı varsayılan yapınca `isUserDefault=true` kaydedilir ve global varsayılan artık seçilmez. | `updateVariantPreference` çağrısı, `isUserDefault` bayrağını set etmeli. |
| V3 | Global varsayılan değiştirme | Admin global varyant listesinde `Make default` aksiyonunu seçtiğinde yalnız bir varyant `isGlobalDefault=true` kalmalı; önceki global default otomatik sıfırlanmalı. | `useGridVariants` içindeki `updated.isGlobal && updated.isGlobalDefault` kodu tetiklenmeli. |
| V4 | Global varsayılan silinince fallback | Admin mevcut global varsayılanı sildiğinde, backend’den dönen liste yeni global default içermiyorsa grid default seçimi kullanıcı varsayılanına (varsa) veya ilk varyanta düşmeli; URL `variant` param temizlenmeli. | `deleteVariant` sonrası `queryClient` invalidate + `getInitialSelectedId` kontrolü. |
| V5 | Query param → variant seçimi | `/report?variant=<id>` ile açıldığında, `<id>` kullanıcının yetkisi olmasa bile (readonly) grid o varyantla yüklenir, toolbar’da “Variant applied from link” etiketi görünebilir. | `getInitialSelectedId` query param branch. |
| V6 | Save/Update dirty state | Kullanıcı filtreleri değiştirip kayıtlı varyanta döndüğünde “Update variant” butonu etkinleşir; kaydettikten sonra `isDirty=false` ve toast gösterilir. | local state `isDirty`. |
| V7 | Clone → default flag temizliği | Global varyant klonlandığında yeni kayıt `isGlobalDefault=false` başlamalı, kullanıcı defaultları etkilenmemeli. | `cloneGridVariant` response kontrolü. |
| V8 | Kullanıcı varsayılanını temizleme | Kullanıcı “Unset default” seçince `isUserDefault=false`, global default tekrar uygulanabilir. | `updateVariantPreference` payload `isDefault:false`. |

## 3. Playwright Önerileri
1. **Fixture Hazırlığı:** `tests/playwright/fixtures/variants/global-default.json` dosyasıyla API cevaplarını stub’layın (MSW veya `page.route()` intercept).
2. **Helper:** `applyVariantFilters(page, gridId, filters)` fonksiyonu variant’ın grid’e gerçekten uygulandığını doğrular (kolon sayısı, filter chip).
3. **Test Dizini:** `tests/playwright/variants/global-default.spec.ts` (bu dosya global varsayılan, kullanıcı varsayılanı ve query param senaryolarını kapsar).
4. **UI Kontrolleri:**
   - Variant dropdown/metni.
   - “Set as default” toggle butonu.
   - Toast mesajları (`message.success|warning`).
   - Telemetry event’i (opsiyonel): `await page.evaluate(() => window.__mfeShellServices?.telemetry?.emit)`.

## 4. Regresyon Checklist
- [ ] Tek global default kuralı ihlal edilmiyor.
- [ ] Global default → user default geçişlerinde lokal-storage/kullanıcı session state karışmıyor.
- [ ] URL paramı `variant` roundtrip (shareable link) bozulmuyor.
- [ ] Karanlık/açık tema altında variant dropdown kontrastı uyumlu.
- [ ] Telemetry/audit event’leri doğru payload’la tetikleniyor (start → success/error).

Bu kapsama göre Playwright senaryolarını ekledikten sonra roadmap’teki “variant yöneticisi için E2E/regresyon senaryoları” maddesini tamamlanmış sayabiliriz.
