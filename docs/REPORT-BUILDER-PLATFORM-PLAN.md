# Report Builder Platform — Database-Agnostic, Schema-Driven

## Vizyon
Herhangi bir veritabanına (MSSQL, PostgreSQL, MySQL, Oracle, ClickHouse...) bağlanarak rapor oluşturan, düzenleyen, keşfeden **self-service BI platformu**.

Sadece Workcube değil — **herhangi bir data source** ile çalışır. Yalın, güçlü, rakiplere göre emsalsiz.

## Rakip Analizi ve Farklılaşma

### Rakipler Ne Yapıyor

| Rakip | Güçlü Yanı | Zayıf Yanı |
|-------|-----------|-------------|
| **Metabase** | Soru-cevap UI, hızlı başlangıç | Custom component yok, limited theming |
| **Apache Superset** | SQL Lab, çok chart tipi | Karmaşık setup, kötü UX |
| **Looker** | LookML semantic layer, governance | Pahalı, vendor lock-in |
| **Redash** | Basit SQL → viz | Ölü proje, limited |
| **Power BI** | Enterprise, DAX | Desktop bağımlı, lisans |

### Bizim Farklılaşma

| Özellik | Rakiplerde | Bizde |
|---------|-----------|-------|
| **Design System Native** | Generic UI, tema yok | Tüm bileşenler Design Lab'dan — tutarlı UX, tema, token |
| **Schema-First** | SQL yaz, şemayı sen bil | Schema otomatik keşif, FK/PK/ilişki görselleştirme |
| **Column Type System** | Manuel format | 12 deklaratif tip, otomatik renderer + filtre |
| **AI-Assisted** | Yok veya ChatGPT wrapper | Doğal dil → tablo keşfi, sütun önerisi, join path |
| **Multi-Tier Schema** | Tek schema | N-tier DB desteği (shared, company, yearly) |
| **Real-Time Preview** | Kaydet → çalıştır döngüsü | Wizard'da canlı grid önizleme |
| **FK Drill-Down** | Manuel link | Otomatik FK → rapor navigasyonu |
| **ID Çözümleme** | Yok | FK lookup ile otomatik isim gösterme |
| **Rapor Versiyonlama** | Yok veya basic | Her düzenleme versiyonlanır, geri alınabilir |
| **Zero-Config Grid** | AG Grid boilerplate | Column metadata → tam grid otomatik |

## Database-Agnostic Mimari

### Data Source Abstraction

```ts
interface DataSource {
  id: string;
  type: 'mssql' | 'postgresql' | 'mysql' | 'oracle' | 'clickhouse' | 'api' | 'csv';
  name: string;
  connectionConfig: ConnectionConfig;
  status: 'active' | 'testing' | 'inactive';
}

interface ConnectionConfig {
  host: string;
  port: number;
  database: string;
  schema?: string;
  username?: string;                    // Vault'tan çekilir
  sslEnabled?: boolean;
  readOnly?: boolean;                   // varsayılan: true
  maxPoolSize?: number;
}
```

Schema Explorer'ın mevcut `SchemaExtractService`'i **driver-agnostic** genişletilir:
- MSSQL: `sys.tables`, `sys.columns` (mevcut)
- PostgreSQL: `information_schema.tables`, `information_schema.columns`
- MySQL: `information_schema.tables`
- Oracle: `ALL_TAB_COLUMNS`
- API source: OpenAPI/Swagger spec parse
- CSV: header satırından schema inference

### Mevcut vs Eklenmesi Gereken

| Schema Explorer Özelliği | Mevcut | Genişletilecek |
|--------------------------|--------|---------------|
| Tablo keşfi | ✅ MSSQL | + PostgreSQL, MySQL, Oracle |
| Sütun metadata | ✅ | DB-agnostic tip eşleme |
| FK ilişki keşfi | ✅ 4 teknik | + `information_schema.key_column_usage` (tüm DB) |
| Domain clustering | ✅ | Agnostic (tablo adı pattern) |
| Join path (BFS) | ✅ | Aynı |
| Impact analysis | ✅ | Aynı |
| View parsing | ✅ MSSQL | + PostgreSQL view parse |
| Multi-schema | ✅ | Workcube tier + generic schema selector |

## Design Lab Entegrasyonu

### Mevcut Kullanılacak Bileşenler

| Bileşen | Kullanım |
|---------|----------|
| `EntityGridTemplate` | Grid önizleme + final rapor |
| `AppSidebar` | Tablo ağacı (wizard/canvas sol panel) |
| `Badge` | PK/FK/Nullable göstergeler, sütun tipi badge |
| `CommandPaletteTrigger` | Tablo/sütun arama |
| `GroupedCardGallery` | Rapor hub gallery |
| `GalleryCard` | Rapor kartları |
| `PageLayout` | Wizard + rapor sayfa layout |
| `ReportFilterPanel` | Filtre UI (varsa kullanılır) |
| `SearchFilterListing` | Tablo listesi |
| `SmartDashboard` | Dashboard tipi raporlar |
| `Tabs` | Wizard adımları |
| `Drawer` | Sütun özellikleri paneli |
| `Toast` | Kaydet/hata bildirimleri |
| `Empty` | Boş durum gösterimi |
| `Skeleton` | Yükleniyor durumu |

### Design Lab'a Eklenmesi Gereken Yeni Bileşenler

| Bileşen | Açıklama | Faz |
|---------|----------|-----|
| `SchemaTableTree` | Tablo/sütun ağacı (draggable, FK badge, search) | 6 |
| `ColumnConfigurator` | Sütun tipi seçici (columnType dropdown + config panel) | 6 |
| `JoinPathVisualizer` | İki tablo arası join yolunu gösteren mini graph | 6 |
| `FkLookupConfigurator` | ID → isim mapping ayarlama UI | 6 |
| `ReportBuilderStepper` | Wizard step indicator (mevcut Stepper'dan türetilir) | 6 |
| `DragDropCanvas` | Sütun sırası drag & drop alanı | 7 |
| `LiveGridPreview` | EntityGridTemplate wrapper — canlı veri ile | 6 |
| `DataSourceSelector` | DB bağlantısı seç/ekle UI | 0 |
| `SchemaLineageBadge` | Sütun header'da kaynak bilgi badge | 2 |
| `RelatedReportsChip` | İlişkili rapor gösterimi (compact) | 3 |

## 9 Faz — Detaylı Plan

### Faz 0: Foundation — Shared Types + Data Source Abstraction

**Yeni dosyalar:**
```
packages/shared-types/src/schema.ts          — DB-agnostic schema tipleri
packages/shared-types/src/data-source.ts     — DataSource interface
```

**Değiştirilen:**
```
packages/shared-types/src/index.ts           — re-export
mfe-schema-explorer/src/api/schemaApi.ts     — shared types kullan
mfe-schema-explorer/src/hooks/useSchemaData.ts — aynı
```

### Faz 1: Schema Context per Report

**Yeni:** `mfe-reporting/src/hooks/useReportSchemaContext.ts`
**Değiştirilen:** `mfe-reporting/src/modules/types.ts` — `sourceTables?`, `sourceSchema?`, `dataSourceId?`
**Değiştirilen:** `ReportPage.tsx` — hook çağrısı

### Faz 2: Column Enrichment + Lineage

**Yeni:** `schemaColumnMapper.ts`, `enrichColumnsWithSchema.ts`, `SchemaLineageTooltip.tsx`
**Değiştirilen:** `design-system/column-system/types.ts` — `schemaLineage?`

**Design Lab'a ekle:** `SchemaLineageBadge` primitive

### Faz 3: İlişkili Raporlar + Domain

**Yeni:** `reportTableIndex.ts`, `RelatedReportsSidebar.tsx`, `domainCategoryMapper.ts`
**Design Lab'a ekle:** `RelatedReportsChip` component

### Faz 4: FK Drill-Down

**Yeni:** `FkDrillDownCell.tsx`, `joinPathResolver.ts`

### Faz 5: FK Lookup (ID → İsim)

**Yeni:** `fkLookupResolver.ts`, `useFkLookup.ts`
**Backend:** `/api/v1/schema/lookup` endpoint

### Faz 6: Report Builder — Wizard

**Design Lab'a ekle:** `SchemaTableTree`, `ColumnConfigurator`, `JoinPathVisualizer`, `FkLookupConfigurator`, `ReportBuilderStepper`, `LiveGridPreview`

**Yeni dosyalar (12):**
```
builder/ReportBuilderWizard.tsx
builder/steps/SelectDataSourceStep.tsx       ← Hangi DB?
builder/steps/SelectSchemaStep.tsx           ← Hangi schema/tier?
builder/steps/SelectTableStep.tsx            ← Ana tablo
builder/steps/SelectColumnsStep.tsx          ← Sütunları seç
builder/steps/AddRelatedTablesStep.tsx       ← FK tabloları
builder/steps/ConfigureLookupStep.tsx        ← ID → isim
builder/steps/ConfigureColumnsStep.tsx       ← Sütun tipleri
builder/steps/ConfigureFiltersStep.tsx       ← Filtreler
builder/steps/PreviewAndSaveStep.tsx         ← Önizle + kaydet
builder/hooks/useBuilderState.ts
builder/hooks/useTableDiscovery.ts
builder/utils/generateReportConfig.ts
```

**Wizard çıktısı:** `ReportDefinition` JSON → `POST /v1/reports`

### Faz 7: Drag & Drop Canvas

**Design Lab'a ekle:** `DragDropCanvas`

**Yeni dosyalar (5):**
```
builder/ReportDesigner.tsx
builder/panels/TableTreePanel.tsx
builder/panels/CanvasPanel.tsx
builder/panels/PropertiesPanel.tsx
builder/LivePreview.tsx
```

### Faz 8: Rapor Düzenleme + Versiyon

- "Düzenle" butonu → wizard/canvas pre-populated
- `PUT /v1/reports/{key}` → versiyon bump
- `GET /v1/reports/{key}/history` → önceki versiyonlar
- Geri alma: önceki versiyon restore

## Bağımlılık Grafiği

```
Faz 0 (shared types + data source)
  ↓
Faz 1 (sourceTables + hook)
  ├── Faz 2 (inference + lineage)
  ├── Faz 3 (related reports)
  ├── Faz 4 (FK drill-down)
  └── Faz 5 (FK lookup — backend)
       ↓
Faz 6 (wizard + DL bileşenler)
  ↓
Faz 7 (canvas)
  ↓
Faz 8 (düzenleme + versiyon)
```

## Dosya Toplamı

| Kategori | Dosya Sayısı |
|----------|-------------|
| Shared types | 2 yeni |
| Schema entegrasyonu (Faz 1-5) | 12 yeni, 7 değiştirilen |
| Report builder (Faz 6-8) | 17 yeni |
| Design Lab yeni bileşenler | 10 yeni |
| Backend endpoints | 4 yeni |
| **Toplam** | **~45 yeni dosya** |

## Backend Gereksinimleri

| Endpoint | Faz | İş |
|----------|-----|----|
| `GET /api/v1/schema/lookup` | 5 | ID → isim batch çözümleme |
| `GET /api/v1/schema/schemas` | 0 | Mevcut — data source listesi |
| `POST /v1/reports` | 6 | Rapor tanımı kaydet |
| `PUT /v1/reports/{key}` | 8 | Rapor güncelle + versiyon |
| `GET /v1/reports/{key}/history` | 8 | Versiyon geçmişi |
| `POST /api/v1/schema/connect` | 0 | Yeni data source bağlantısı test |

## Yetki

### Mevcut (implement edilecek)

| İşlem | Permission |
|-------|-----------|
| Rapor görüntüleme | `REPORT_READ` |
| Rapor builder | `REPORT_BUILDER` |
| Rapor düzenleme | `REPORT_BUILDER` + owner |
| Data source yönetimi | `DATASOURCE_ADMIN` |
| Schema keşfi | `SCHEMA_READ` |

### Gelecek — Granüler Erişim (altyapı hazır, ileride implement)

Tablo ve schema bazlı yetkilendirme — şimdi implement edilmez ama **tüm altyapı buna uygun tasarlanır**.

| Seviye | Açıklama | Altyapı |
|--------|----------|---------|
| **Schema bazlı** | Kullanıcı sadece izinli schema'ları görür | `useReportSchemaContext` hook'a `allowedSchemas` filtresi eklenebilir |
| **Tablo bazlı** | Kullanıcı sadece izinli tabloları görür | Wizard `SelectTableStep`'te tablo listesi filtrelenir |
| **Sütun bazlı** | Hassas sütunlar (maaş, TC no) gizlenir | `ColumnMeta.requiredPermission` zaten var |
| **Satır bazlı (RLS)** | Kullanıcı sadece kendi verilerini görür | `fetchRows` filter inject — backend RLS ile |
| **Rapor bazlı** | Belirli raporlara erişim | `SharedReportCatalogItem.permissionCode` zaten var |

**Tasarım kuralları:**
- Schema snapshot hook'a `filterTables(tables, userPermissions)` enjekte edilebilir noktası bırak
- Wizard adımlarında tablo/sütun listeleme fonksiyonları permission callback kabul etsin
- `ReportDefinition`'a `accessPolicy?: { schemaAccess?, tableAccess?, columnBlacklist? }` alanı şimdiden koy (boş bırakılabilir)
- Backend lookup endpoint'leri kullanıcı token'ından yetki kontrol etsin

## Performans

| Senaryo | Strateji |
|---------|----------|
| 5000+ tablo | React Query 60dk cache, virtualized list, lazy search |
| Çok FK | İlk 2 hop, "daha fazla" genişlet |
| Batch lookup | Sayfa unique ID'leri tek çağrı |
| Multi-DB | Connection pool per source, read-only |
| Büyük veri seti | Server-side pagination (EntityGridTemplate SSRM) |

## Graceful Degradation

| Durum | Davranış |
|-------|----------|
| Schema-service kapalı | Raporlar aynen çalışır, builder disabled |
| Lookup endpoint yok | ID ham gösterilir |
| Data source erişilemiyor | Wizard'da hata, mevcut raporlar cache'ten |
| `sourceTables` yok | Sıfır schema overhead |

## Kalite Standartları

- Tüm yeni bileşenler Design Lab'dan veya Design Lab'a eklenerek
- Her bileşen: contract test + Storybook story
- i18n: tüm metinler `shared.*` veya modül namespace'inden
- A11y: WCAG 2.1 AA uyumlu
- Performans: First Meaningful Paint < 2s, grid render < 500ms
- Responsive: mobile'da wizard, tablet'te canvas
- Offline-tolerant: schema cache + graceful degradation

## Test Planı

### Unit (her faz)
- Schema tipleri, mapper'lar, enrichment, index, resolver fonksiyonları
- Tüm SQL tip eşlemeleri (20+ tip × 5+ DB)
- Wizard state transitions

### Component (her faz)
- SchemaLineageTooltip, FkDrillDownCell, RelatedReportsSidebar
- Wizard step'leri: render + interaction
- Canvas: drag & drop

### Integration
- useReportSchemaContext: mock fetch + cache + failure
- Wizard → ReportDefinition → dynamic report çalışır

### E2E
- Schema-service kapalıyken raporlar çalışır
- Wizard ile rapor oluştur → kaydet → aç → çalışır
- Rapor düzenle → sütun ekle → kaydet → grid güncellenir
- FK drill-down → filtreli navigasyon
- ID lookup → isim gösterimi
