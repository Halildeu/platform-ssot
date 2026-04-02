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

**Tam ReportDefinition tipi (tüm fazlar dahil — gelecek alanlar opsiyonel):**
```ts
interface ReportDefinition {
  // --- Temel (Faz 6) ---
  id: string;
  title: string;
  description: string;
  category: string;
  version: number;
  createdBy: string;
  createdAt: string;

  // --- Data Source (Faz 0-1) ---
  dataSourceId?: string;
  sourceSchema: string;
  sourceTables: string[];
  columns: ColumnMeta[];
  joins: JoinDefinition[];
  filters: FilterDefinition[];
  lookups: FkLookupDefinition[];
  defaultSort?: { field: string; direction: 'asc' | 'desc' };

  // --- Hesaplanmış (Faz 9-10) ---
  metrics?: string[];                    // metrik ID referansları
  calculatedFields?: CalculatedFieldDef[];

  // --- Uyarı & Zamanlama (Faz 11) ---
  alerts?: AlertRule[];
  schedule?: ScheduleConfig;

  // --- Embed & İşbirliği (Faz 12) ---
  embed?: EmbedConfig;
  parameters?: ParameterDef[];
  sharing?: ShareConfig;
  exportFormats?: ('csv' | 'excel' | 'pdf' | 'png' | 'json')[];

  // --- Performans (Faz 13) ---
  cache?: CacheConfig;

  // --- Yetki (gelecek) ---
  accessPolicy?: {
    schemaAccess?: string[];
    tableAccess?: string[];
    columnBlacklist?: string[];
    rowFilter?: string;                  // SQL WHERE clause
  };
}
```

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

### Faz 9: Semantic Layer (Metrik Katmanı)

**Amaç:** Aynı metrik (aylık gelir, müşteri kaybı oranı) her raporda tutarlı hesaplansın. Tekrar tanımlama yok.

**Neden kritik:** Looker LookML, dbt Semantic Layer, Power BI Measures — 2026'da standart. Yoksa her rapor kendi formülünü yazar, tutarsızlık kaçınılmaz.

**Yeni tipler:**
```ts
interface MetricDefinition {
  id: string;
  name: string;                        // "Aylık Gelir"
  nameKey?: string;                    // i18n
  formula: string;                     // "SUM(INVOICE.TOTAL) - SUM(INVOICE.TAX)"
  sourceTables: string[];
  filters?: MetricFilter[];            // varsayılan filtreler
  format: 'number' | 'currency' | 'percent';
  formatConfig?: { decimals?: number; currencyCode?: string; suffix?: string };
  category: string;                    // "Finans", "İK"
  owner: string;                       // metric sahibi
  certified: boolean;                  // onaylanmış metrik mi
  tags?: string[];
}

interface MetricFilter {
  field: string;
  operator: 'eq' | 'neq' | 'gt' | 'lt' | 'between' | 'in';
  value: unknown;
}
```

**Yeni dosyalar:**
```
mfe-reporting/src/metrics/
├── types.ts                          ← MetricDefinition, MetricFilter
├── useMetricRegistry.ts              ← Metrik listesi hook (API'den)
├── MetricSelector.tsx                ← Wizard'da metrik seç bileşeni
└── evaluateMetric.ts                 ← SQL expression builder
```

**Backend:** `GET /v1/metrics` — metrik registry, `POST /v1/metrics` — yeni metrik tanımla

**Wizard entegrasyonu:** `SelectColumnsStep`'te "Hesaplanmış Metrik Ekle" butonu → MetricSelector açılır

### Faz 10: Calculated Fields (Hesaplanmış Alanlar)

**Amaç:** Kullanıcı `revenue - cost` gibi formül yazıp raporda yeni sütun oluşturur.

**Yeni tipler:**
```ts
// ColumnMeta'ya eklenir (BaseColumnMeta genişler)
interface BaseColumnMeta {
  // ... mevcut alanlar
  expression?: string;                 // "price * quantity" — hesaplanmış alan formülü
  expressionDeps?: string[];           // bağımlı sütunlar ["price", "quantity"]
}
```

**Yeni dosyalar:**
```
builder/steps/AddCalculatedFieldStep.tsx  ← Formül editörü + alan seçici
builder/utils/expressionParser.ts         ← Basit ifade parser (validasyon)
builder/utils/expressionEvaluator.ts      ← Client-side hesaplama (preview için)
```

**Wizard:** `ConfigureColumnsStep`'e "Hesaplanmış Alan Ekle" butonu. Formül: alan seçici + operatör + değer.

### Faz 11: Alerting & Scheduling

**Amaç:** "Stok < 100 olduğunda bildir", "Her Pazartesi 09:00'da email at."

**Yeni tipler:**
```ts
interface AlertRule {
  id: string;
  field: string;
  condition: 'gt' | 'lt' | 'eq' | 'change' | 'anomaly';
  threshold: number | string;
  channels: AlertChannel[];
  frequency: 'realtime' | 'hourly' | 'daily';
  enabled: boolean;
}

interface AlertChannel {
  type: 'email' | 'slack' | 'webhook' | 'in-app';
  target: string;                      // email adresi, slack channel, webhook URL
}

interface ScheduleConfig {
  enabled: boolean;
  cron: string;                        // "0 9 * * 1" = her Pazartesi 09:00
  timezone: string;
  recipients: string[];
  format: 'pdf' | 'excel' | 'csv' | 'png';
  subject?: string;
  includeFilters?: boolean;            // filtreleri email'e dahil et
}
```

**ReportDefinition'a eklenir:**
```ts
interface ReportDefinition {
  // ... mevcut
  alerts?: AlertRule[];
  schedule?: ScheduleConfig;
}
```

**Yeni dosyalar:**
```
builder/steps/ConfigureAlertsStep.tsx     ← Alert kural tanımlama UI
builder/steps/ConfigureScheduleStep.tsx   ← Zamanlama UI (cron builder)
mfe-reporting/src/components/AlertBadge.tsx ← Grid'de alert threshold aşımı göstergesi
```

**Backend:**
- `POST /v1/reports/{key}/alerts` — alert kaydet
- `POST /v1/reports/{key}/schedule` — zamanlama kaydet
- Scheduler service: cron job runner (Quartz veya Spring Scheduler)
- Alert evaluator: threshold check + notification dispatch

### Faz 12: Embedded Analytics + Parametrik URL + Collaboration

**Amaç:** Raporu başka uygulamaya embed et, URL parametresiyle filtrele, ekip olarak çalış.

**Yeni tipler:**
```ts
interface EmbedConfig {
  enabled: boolean;
  token: string;                       // JWT embed token
  allowedDomains: string[];            // iframe izinli domainler
  expiresAt?: string;
  hideToolbar?: boolean;
  hideFilters?: boolean;
  theme?: 'light' | 'dark' | 'auto';
}

interface ParameterDef {
  key: string;
  label: string;
  type: 'string' | 'number' | 'date' | 'enum';
  required: boolean;
  defaultValue?: unknown;
  enumValues?: string[];               // set parametreleri
}

interface ReportComment {
  id: string;
  userId: string;
  userName: string;
  text: string;
  createdAt: string;
  cellRef?: { row: number; column: string };  // belirli hücreye yorum
  resolved: boolean;
}

interface ShareConfig {
  sharedWith: ShareTarget[];
  publicLink?: string;
  linkExpiry?: string;
}

interface ShareTarget {
  type: 'user' | 'role' | 'team';
  id: string;
  permission: 'view' | 'edit' | 'admin';
}
```

**ReportDefinition'a eklenir:**
```ts
interface ReportDefinition {
  // ... mevcut
  embed?: EmbedConfig;
  parameters?: ParameterDef[];
  comments?: ReportComment[];
  sharing?: ShareConfig;
  exportFormats?: ('csv' | 'excel' | 'pdf' | 'png' | 'json')[];
}
```

**Yeni dosyalar:**
```
mfe-reporting/src/embed/
├── EmbedProvider.tsx                  ← Embed mode context (toolbar/filtre gizleme)
├── useEmbedToken.ts                  ← Token doğrulama hook
└── EmbedRoute.tsx                    ← /embed/reports/{key}?token=...

mfe-reporting/src/collaboration/
├── ReportComments.tsx                ← Yorum paneli (sağ drawer)
├── useReportComments.ts              ← WebSocket veya polling ile yorumlar
├── ShareDialog.tsx                   ← Paylaşım dialog
└── ReportActivityLog.tsx             ← Kim ne zaman değiştirdi
```

### Faz 13: Data Caching + Query Optimization

**Amaç:** Her sorgu DB'ye gitmez, akıllı cache katmanı.

**Strateji:**
- Frontend: React Query (mevcut, 60dk staleTime)
- Backend: Redis/Caffeine cache — query hash bazlı
- Incremental: sadece değişen veri çekilir (son fetch'ten sonraki delta)
- Materialized views: sık kullanılan raporlar için backend'de önceden hesaplanmış veri

**ReportDefinition'a:**
```ts
interface CacheConfig {
  strategy: 'none' | 'ttl' | 'incremental' | 'materialized';
  ttlMinutes?: number;
  refreshSchedule?: string;            // materialized view refresh cron
}
```

## Bağımlılık Grafiği (Güncel)

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
  ↓
Faz 9 (semantic layer)          [Faz 6'dan sonra]
Faz 10 (calculated fields)      [Faz 6'dan sonra]
Faz 11 (alerting + scheduling)  [Faz 8'den sonra, backend ağır]
Faz 12 (embed + collab)         [Faz 8'den sonra]
Faz 13 (caching + optimization) [sürekli, her fazda iyileşir]
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
