# STYLE-WEB-001 – Web Frontend Kodlama Stili (Compact Version)

Amaç: Web MFE kodlarının tutarlı, okunabilir ve genişleyebilir şekilde yazılmasını sağlamak. Bu belge agent'ların davranış belirlemesi için gerekli minimum kuralları içerir.

-------------------------------------------------------------------------------
1. DOSYA & PROJE YAPISI
-------------------------------------------------------------------------------
Kod yeri:
- MFE özel kod: apps/<mfe>/src/**
- Ortak kod: packages/**
- Tema & design system: design-tokens/**
- Test: tests/, stories/, cypress/

Modern MFE src yapısı:
apps/<mfe>/src/
  app/          → routing, layout, provider’lar
  entities/     → domain modelleri ve entity-level logic
  features/     → use-case odaklı UI + logic (örn: user-profile, login)
  pages/        → route-level UI compose
  widgets/      → tekrar kullanılabilir büyük UI blokları
  shared/       → yerel ortak kod (küçük UI, helpers, hook)
  i18n/         → çeviri dosyaları
  manifest/     → runtime config, federation manifest
  main.tsx      → giriş noktası

Legacy klasörler (yeni geliştirmede kullanılmaz):
components/, hooks/, services/, utils/

-------------------------------------------------------------------------------
2. COMPONENT STANDARTLARI
-------------------------------------------------------------------------------
- Component’ler stateless olmalıdır; side-effect içermez.
- Logic UI’dan ayrılır; data fetch, state yönetimi feature veya hook içindedir.
- İsimlendirme: PascalCase (UserCard.tsx)
- Dosya yapısı:
  ComponentName/
    ComponentName.tsx
    ComponentName.types.ts
    index.ts
- JSX okunabilir olmalıdır; uzun bloklar küçük bileşenlere ayrılır.

-------------------------------------------------------------------------------
3. STATE YÖNETİMİ
-------------------------------------------------------------------------------
- UI state: component içi (useState)
- Domain state: feature içindeki özel hook’lar (örn: useUserList)
- App-level global state: app/store (tema, session vb.)
- Komponent sadece data + handler alır; business logic içermez.
- Rule of thumb (i18n + memo invalidation):
  - Ne zaman: Locale switch sonrası UI güncellenmiyorsa (stale UI) ve memo/cache kullanımı varsa.
  - Neden: `useMemo`/`useCallback` sadece dependency referansı değişince invalid olur.
  - Nasıl: i18n hook’larında `t/formatNumber/formatDate` callback’lerini `locale` dependency’sine bağla; UI tarafında `useMemo([t])` kullan.
  - Örnek: `const t = useCallback(..., [manager, locale])`
  - Örnek: `const labels = useMemo(() => ..., [t])`

-------------------------------------------------------------------------------
4. API KULLANIM STANDARTLARI
-------------------------------------------------------------------------------
- API çağrıları sadece packages/shared-http üzerinden yapılır.
- API isimlendirme:
  userApi.getList()
  userApi.getById(id)
  userApi.create(payload)
- Response UI’ya verilmeden önce UI modeline dönüştürülür.
- Error handling ortak error handler ile yapılır.

-------------------------------------------------------------------------------
5. DESIGN TOKENS & TAILWIND
-------------------------------------------------------------------------------
- Görsel SSOT: `web/design-tokens/**` + generated theme contract + CSS variables zinciridir.
- `packages/ui-kit` ortak component katmanıdır; Button/Input/Drawer/Grid gibi paylaşılan primitive veya composite burada doğar.
- Tailwind tasarım sistemi değildir; render ve layout yardımcı katmandır.
- Uygulama akışı:
  1. design token kararı
  2. `packages/ui-kit` component API'si
  3. Tailwind utility ile render/layout compose
- Hard-coded renk/gradient/shadow/ring/focus değeri yasaktır.
- Tailwind config token kaynaklarına bağlıdır; semantic class veya `var(--...)` dışı görsel değer kullanılmaz.
- `apps/**` altında yeni ortak primitive yazılmaz; sayfa/layout compose yapılır.
- Aynı işi yapan Button/Input/Card/Badge primitive'i `apps/**` altında tekrar üretilmez.
- `Design Lab` kanonik canlı preview yüzeyidir; Storybook ikincil dokümantasyon yüzeyidir.
- `Design Lab`te görünmeyen ortak component release edilmez.
- `variant-service` tema ve kişiselleştirme backend sahibidir; frontend tema persistence mantığı paralel bir local sistem kurmaz.

5.1 Tailwind kullanım sınırı
- `packages/ui-kit` içinde Tailwind kullanılabilir; amaç component implementasyonudur.
- `apps/**` içinde Tailwind kullanılabilir; amaç ekran compose, responsive grid, spacing akışı ve sayfa yerleşimidir.
- `apps/**` içinde Tailwind ile ortak primitive inşa etmek yasaktır.
- Raw color class (`bg-[#...]`, `text-[#...]`, `rgb(...)`, `hsl(...)`) yasaktır.
- Raw spacing/radius/font-size gibi arbitrary class'lar yeni ortak component API'sine dönüşmesi gereken tekrar eden görsel kararlar için kullanılmaz.
- Tek seferlik layout ölçüleri sadece sayfa compose veya demo scaffolding ihtiyacında, token karşılığı yoksa ve tekrar etmiyorsa kullanılabilir.

5.2 UI kit release kuralı
- Yeni ortak component önce `web/packages/ui-kit/src/catalog/component-registry.v1.json` içine eklenir.
- Ardından export yüzeyi güncellenir.
- Ardından `designlab:index` yeniden üretilir.
- Ardından `DesignLabPage` üstünde görünür/denetlenebilir hale gelir.
- Bu zincir tek patch içinde kapanmadan component tamamlanmış sayılmaz.

5.3 Anti-drift kuralları
- Runtime dependency olarak `antd`, `@mui/material` veya benzeri UI framework eklenmez.
- Bu kütüphaneler yalnız benchmark/referans olarak değerlendirilir.
- `shared-http` dışından frontend API istemcisi yazılmaz.
- Tema kararı `design-tokens -> generated contract -> ui-kit runtime theme controller` zinciri dışından verilmez.

-------------------------------------------------------------------------------
6. IMPORT SIRASI
-------------------------------------------------------------------------------
1. React / framework
2. 3rd party libs
3. packages/**
4. entities → features → shared
5. local dosyalar

-------------------------------------------------------------------------------
7. TEST STANDARTLARI
-------------------------------------------------------------------------------
- Unit: tests/**
- Component: stories ve testing-library
- E2E: cypress/
- Hook ve feature logic testleri zorunludur.
- Kritik UI bileşenleri test edilir (filter panel, grid wrapper vb.)

-------------------------------------------------------------------------------
8. MFE SINIRI KURALI
-------------------------------------------------------------------------------
- apps/<mfe> içindeki kod sadece kendi MFE’si tarafından kullanılabilir.
- Bir MFE diğer MFE’den import yapmaz.
- Ortak kod packages/ üzerinden paylaşılır.

-------------------------------------------------------------------------------
9. AGENT DAVRANIŞ NOTU
-------------------------------------------------------------------------------
[WEB] tipindeki bir görevde agent şu sırayı izlemelidir:
1. AGENT-CODEX.core.md
2. AGENTS.md
3. WEB-PROJECT-LAYOUT.md
4. STYLE-WEB-001.md (bu dosya)
5. apps/<mfe>/src/** yapısını dikkate alır
6. packages/** içindeki paylaşılan modülleri kullanır
7. Çıktı formatı:
   - Keşif Özeti
   - FE Tasarım
   - Uygulama Adımları (dosya yolu + yapılacak değişiklik)

-------------------------------------------------------------------------------
10. ÖZET
-------------------------------------------------------------------------------
Bu belge, web MFE geliştirme için minimum ama keskin kuralları tanımlar:
- doğru klasör
- doğru component yapısı
- doğru state modeli
- doğru API kullanımı
- doğru design token kullanımı
- doğru test yaklaşımı

-------------------------------------------------------------------------------
11. STORY ID REFERANSI (DOKÜMAN ↔ KOD İZLENEBİLİRLİĞİ)
-------------------------------------------------------------------------------

- Bir STORY dokümanı (örn. `STORY-0009-fe-spa-login-standardization.md`)
  frontend tarafında uygulanıyorsa:
  - En az bir **test** veya **kod** dosyasında ilgili STORY ID açıkça
    referans verilmelidir.
- Önerilen kullanım şekilleri:
  - Jest/Testing Library test adı veya describe:
    - `describe("STORY-0009 – FE SPA Login Standardization", () => { ... })`
  - Kod yorum satırı:
    - `// STORY-0009-fe-spa-login-standardization`
  - Commit mesajında STORY ID kullanımı teşvik edilir, ancak bu stil kuralı
    özellikle kod/test dosyası içinde görünür ID referansını zorunlu kılar.
- Bu sayede:
  - `docs/03-delivery/PROJECT-FLOW.md` içindeki STORY satırları ile
    web kodu arasındaki ilişki, otomatik script’ler ve kalite kontrolleri
    tarafından daha kolay izlenebilir hale gelir.
