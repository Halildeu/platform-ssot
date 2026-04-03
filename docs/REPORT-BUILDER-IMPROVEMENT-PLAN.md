# Report Builder Platform — Kapsamlı İyileştirme Planı

## ÖNCELİKLİ — Sonraki Session İlk İş

### Header Dropdown Menu (Design Lab Pattern)
Header'daki "Raporlar" nav item'ına Design Lab gibi dropdown ekle:
- **Referans:** `mfe-shell/src/app/layout/DesignLabHeaderMenu.tsx` — Popover + hover-focus trigger
- **Yeni dosya:** `mfe-shell/src/app/layout/ReportingHeaderMenu.tsx`
- **İçerik:**
  - "Yeni Rapor Oluştur" → `/admin/reports/builder`
  - "Dashboard Oluştur" → `/admin/reports/builder/dashboard`
  - "SQL Lab" → `/admin/reports/query-lab` (route henüz yok)
  - "AI ile Rapor" → AI query bar (ReportingHub'a entegre)
  - Son oluşturulan raporlar (recent)
- **Entegrasyon:** `ShellHeaderNavbar.tsx`'te "Raporlar" butonunu ReportingHeaderMenu ile değiştir
- **Wiring tamamlandı:** `/admin/reports/builder`, `/admin/reports/builder/dashboard`, `/admin/reports/builder/edit/:key` route'ları çalışıyor (PR #141 ile merge edildi)

### ReportPage Visualization Toggle Entegrasyonu
- `ReportVisualizationToggle` bileşeni ReportPage'e henüz eklenmedi
- Grid üstüne "Görünüm: Tablo | Bar | Line | Pie" toggle ekle
- Dosya: `mfe-reporting/src/app/reporting/ReportPage.tsx`

## Mevcut Durum Değerlendirmesi

### Gerçek Derinlik (Production-Ready)
- ✅ Column Type System (12 tip, 125 test)
- ✅ Schema-First keşif (tablo/sütun/FK otomatik)
- ✅ Tek iskelet grid (ReportPage)
- ✅ Reporting sidebar (4 kategori, search, chips)
- ✅ Wizard (8 adım) + Canvas + Editor
- ✅ FK drill-down + ID→isim lookup
- ✅ Design Lab native

### Yüzeysel (Sadece Tip Tanımı)
- ⚠️ Semantic layer (sadece MetricDefinition tipi)
- ⚠️ Calculated fields (parser var, grid entegrasyonu yok)
- ⚠️ Alerting/Scheduling (sadece tip)
- ⚠️ Embed/Collaboration (sadece tip)
- ⚠️ Caching (sadece tip)

### Tamamen Eksik (Rakiplerin Hepsinde Var)
- ❌ Chart/Visualization (bar, line, pie, area, scatter...)
- ❌ Dashboard Builder (multi-widget layout)
- ❌ SQL Editor / Query Lab
- ❌ Natural Language → Rapor (AI query)
- ❌ Multi-source join (birden fazla DB birleştirme)
- ❌ Data Catalog (tablo açıklamaları, tag'ler)
- ❌ Audit Trail (kim ne zaman ne değiştirdi)
- ❌ Row-Level Security (RLS) backend
- ❌ White-label embed (CSS override, brand kit)
- ❌ Mobile app / responsive dashboard
- ❌ Export PDF/PNG (dashboard screenshot)
- ❌ Real-time streaming data
- ❌ Predictive analytics / ML entegrasyonu

## Rakip Feature Matrix — Detaylı

```
Özellik                    | Power BI | Metabase | Superset | Looker | Bizde
---------------------------|----------|----------|----------|--------|------
Tablo grid                 | ✅       | ✅       | ✅       | ✅     | ✅ Üstün (column-system)
Bar chart                  | ✅       | ✅       | ✅       | ✅     | ❌
Line chart                 | ✅       | ✅       | ✅       | ✅     | ❌
Pie chart                  | ✅       | ✅       | ✅       | ✅     | ❌
Area chart                 | ✅       | ✅       | ✅       | ✅     | ❌
Scatter/Bubble             | ✅       | ✅       | ✅       | ✅     | ❌
Heatmap                    | ✅       | ❌       | ✅       | ✅     | ❌
Treemap                    | ✅       | ❌       | ✅       | ❌     | ❌
Gauge                      | ✅       | ✅       | ✅       | ❌     | ❌
KPI card                   | ✅       | ✅       | ✅       | ✅     | ✅ (SmartDashboard)
Map/Geo                    | ✅       | ✅       | ✅       | ✅     | ❌
Funnel                     | ✅       | ✅       | ✅       | ❌     | ❌
Waterfall                  | ✅       | ❌       | ✅       | ❌     | ❌
Dashboard builder          | ✅       | ✅       | ✅       | ✅     | ❌
Dashboard filters          | ✅       | ✅       | ✅       | ✅     | ❌
Cross-filter               | ✅       | ❌       | ✅       | ✅     | ❌
Drill-through              | ✅       | ✅       | ✅       | ✅     | ✅ (FK drill-down)
SQL editor                 | ✅ (DAX) | ✅       | ✅       | ✅     | ❌
NL query (AI)              | ✅       | ✅       | ✅       | ❌     | ❌
Semantic layer             | ✅       | ❌       | ❌       | ✅     | ⚠️ Tip var
Calculated fields          | ✅       | ✅       | ✅       | ✅     | ⚠️ Parser var
Alerting                   | ✅       | ✅       | ✅       | ❌     | ⚠️ Tip var
Scheduling                 | ✅       | ✅       | ✅       | ✅     | ⚠️ Tip var
Email/Slack notify         | ✅       | ✅       | ✅       | ✅     | ❌
Embed (iframe)             | ✅       | ✅       | ✅       | ✅     | ⚠️ Tip var
White-label                | ✅       | ✅       | ❌       | ❌     | ❌
Multi-tenant               | ✅       | ❌       | ❌       | ✅     | ❌
Row-level security         | ✅       | ❌       | ✅       | ✅     | ❌ (tip hazır)
Column-level security      | ✅       | ❌       | ❌       | ✅     | ✅ (requiredPermission)
Data catalog               | ✅       | ❌       | ❌       | ✅     | ❌
Audit trail                | ✅       | ✅       | ❌       | ✅     | ❌
Version control            | ❌       | ❌       | ❌       | ✅     | ✅ (wizard)
Report builder wizard      | ❌       | ✅       | ❌       | ❌     | ✅ Üstün
Schema-first discovery     | ❌       | ❌       | ❌       | ❌     | ✅ Benzersiz
FK auto-lookup             | ❌       | ❌       | ❌       | ❌     | ✅ Benzersiz
Column type system         | ❌       | ❌       | ❌       | ❌     | ✅ Benzersiz
Design system native       | ❌       | ❌       | ❌       | ❌     | ✅ Benzersiz
Multi-tier DB              | ❌       | ❌       | ❌       | ❌     | ✅ Benzersiz
Redis/query cache          | ❌       | ✅       | ✅       | ❌     | ⚠️ Tip var
Mobile responsive          | ✅       | ✅       | ❌       | ❌     | ❌
PDF/PNG export             | ✅       | ✅       | ✅       | ✅     | ❌
CSV/Excel export           | ✅       | ✅       | ✅       | ✅     | ✅
Real-time streaming        | ✅       | ❌       | ❌       | ❌     | ❌
Predictive/ML              | ✅       | ❌       | ❌       | ❌     | ❌
Git-based version          | ❌       | ❌       | ❌       | ✅     | ❌
API-first                  | ❌       | ✅       | ✅       | ✅     | ✅
```

## İyileştirme Fazları — Öncelik Sıralı

### Faz A: Visualization Engine (KRİTİK — En büyük eksik)

**Amaç:** Grid-only → çoklu görselleştirme. Design Lab'daki chart bileşenlerini rapor builder'a entegre et.

**Mevcut altyapı:**
- Design Lab'da zaten var: `BarChart`, `LineChart`, `PieChart`, `AreaChart`, `FunnelChart`, `GaugeChart`, `RadarChart`, `SankeyDiagram`, `TreemapChart`, `WaterfallChart`, `ParetoChart`
- SmartDashboard KPI strip var

**Yapılacak:**
```
mfe-reporting/src/visualization/
├── types.ts                    ← ChartConfig, ChartType union
├── ChartRenderer.tsx           ← columnType'a göre doğru chart render
├── chartTypeInference.ts       ← Veri yapısından en uygun chart öner
├── ReportVisualizationToggle.tsx ← Grid ↔ Chart geçiş toolbar butonu
└── presets/
    ├── barChartPreset.ts       ← ColumnMeta → BarChart props
    ├── lineChartPreset.ts
    ├── pieChartPreset.ts
    └── ...
```

**ReportPage entegrasyonu:**
- Grid üstünde "Görünüm: Tablo | Bar | Line | Pie | ..." toggle
- Aynı veri, farklı görselleştirme
- Chart tipi ColumnMeta'dan otomatik önerilir (date x-axis → line, category → bar/pie)

**Yeni tipler:**
```ts
type ChartType = 'grid' | 'bar' | 'line' | 'pie' | 'area' | 'scatter' |
  'heatmap' | 'treemap' | 'gauge' | 'funnel' | 'waterfall' | 'radar';

interface ChartConfig {
  type: ChartType;
  xAxis: string;            // field name
  yAxis: string[];           // field name(s) — multi-series
  groupBy?: string;
  colorBy?: string;
  aggregation?: 'sum' | 'avg' | 'count' | 'min' | 'max';
  showLegend?: boolean;
  showLabels?: boolean;
  stacked?: boolean;
}
```

**ReportDefinition'a ekle:**
```ts
interface ReportDefinition {
  // ... mevcut
  defaultVisualization?: ChartType;
  charts?: ChartConfig[];
}
```

### Faz B: Dashboard Builder

**Amaç:** Multi-widget layout — birden fazla chart/grid/KPI tek sayfada.

**Yapılacak:**
```
mfe-shell/src/pages/admin/reports/dashboard-builder/
├── DashboardBuilder.tsx         ← Drag & drop layout editör
├── DashboardGrid.tsx            ← CSS Grid / react-grid-layout
├── widgets/
│   ├── ChartWidget.tsx          ← Herhangi bir chart tipi
│   ├── GridWidget.tsx           ← Tablo grid
│   ├── KpiWidget.tsx            ← Tek metrik KPI kart
│   ├── FilterWidget.tsx         ← Global filtre (tüm widget'lara)
│   └── TextWidget.tsx           ← Markdown metin bloğu
├── hooks/
│   ├── useDashboardState.ts     ← Layout + widget state
│   └── useCrossFilter.ts        ← Widget'lar arası filtre bağlantısı
└── utils/
    └── generateDashboardConfig.ts
```

**Yeni tipler:**
```ts
interface DashboardDefinition {
  id: string;
  title: string;
  layout: LayoutItem[];          // react-grid-layout format
  widgets: DashboardWidget[];
  filters: DashboardFilter[];    // global filtreler
  refreshInterval?: number;      // saniye
}

interface DashboardWidget {
  id: string;
  type: 'chart' | 'grid' | 'kpi' | 'filter' | 'text';
  reportId?: string;             // bağlı rapor
  chartConfig?: ChartConfig;
  metricId?: string;
  content?: string;              // text widget için markdown
}

interface LayoutItem {
  widgetId: string;
  x: number; y: number;
  w: number; h: number;
  minW?: number; minH?: number;
}
```

### Faz C: SQL Editor / Query Lab

**Amaç:** İleri kullanıcılar için SQL yazma ortamı.

**Yapılacak:**
```
mfe-reporting/src/query-lab/
├── QueryLab.tsx                 ← Ana sayfa: editor + sonuç
├── SqlEditor.tsx                ← Monaco editor (SQL syntax highlight)
├── QueryResultGrid.tsx          ← Sonuç grid (EntityGridTemplate)
├── QueryHistory.tsx             ← Önceki sorgular listesi
├── SchemaExplorerPanel.tsx      ← Sol panel: tablo/sütun ağacı
├── hooks/
│   ├── useQueryExecution.ts     ← SQL çalıştır, sonuç al
│   └── useQueryHistory.ts       ← localStorage geçmiş
└── utils/
    ├── sqlFormatter.ts          ← SQL güzelleştirici
    └── sqlAutocomplete.ts       ← Tablo/sütun otomatik tamamlama
```

**Backend gereksinimi:**
```
POST /api/v1/schema/query
Body: { sql: string, schema: string, limit: number }
Response: { columns: string[], rows: unknown[][], rowCount: number }
```

**Güvenlik:** Read-only connection, query timeout (30s), result limit (10K row).

### Faz D: Natural Language → Rapor (AI Query)

**Amaç:** "Son 3 aydaki faturaları departmana göre göster" → otomatik rapor.

**Yapılacak:**
```
mfe-reporting/src/ai-query/
├── AiQueryBar.tsx               ← Doğal dil input (üst banner)
├── useAiQuery.ts                ← Backend AI endpoint hook
├── AiSuggestions.tsx            ← Öneri kartları
└── aiQueryToReportConfig.ts     ← AI çıktısı → ReportDefinition mapper
```

**Backend gereksinimi:**
```
POST /api/v1/ai/query
Body: { prompt: string, schema: string, context: { tables: string[], domains: string[] } }
Response: { sql: string, columns: ColumnMeta[], chartSuggestion: ChartType, explanation: string }
```

**AI modeli:** Schema snapshot + user prompt → SQL + ColumnMeta üret. Claude API veya OpenAI.

### Faz E: Alert & Schedule Backend (Derinleştirme)

**Mevcut:** Sadece tip tanımları.
**Hedef:** Çalışan alert evaluator + scheduler + notification dispatch.

**Backend:**
```
backend/alert-service/               ← Yeni microservice veya report-service'e ek
├── AlertEvaluator.java              ← Threshold check, anomaly detection
├── AlertScheduler.java              ← Quartz/Spring cron
├── NotificationDispatcher.java      ← Email (SMTP), Slack (webhook), in-app
└── AlertRepository.java             ← PostgreSQL persistence
```

**Frontend:**
```
mfe-reporting/src/alerting/
├── AlertRuleEditor.tsx              ← Kural tanımlama UI
├── AlertHistory.tsx                 ← Tetiklenen alertler listesi
├── ScheduleEditor.tsx               ← Cron builder UI
└── useAlertRules.ts                 ← CRUD hook
```

**API:**
```
POST /v1/reports/{key}/alerts         ← Kural oluştur
GET  /v1/reports/{key}/alerts         ← Kuralları listele
PUT  /v1/reports/{key}/alerts/{id}    ← Güncelle
DELETE /v1/reports/{key}/alerts/{id}  ← Sil
POST /v1/reports/{key}/schedule       ← Zamanlama kaydet
GET  /v1/alerts/history               ← Tetikleme geçmişi
```

### Faz F: Embed Runtime (Derinleştirme)

**Mevcut:** Sadece tip tanımları.
**Hedef:** Çalışan JWT-based iframe embed.

**Backend:**
```
POST /v1/embed/token                  ← JWT embed token üret
GET  /v1/embed/verify                 ← Token doğrula
```

**Frontend:**
```
mfe-reporting/src/embed/
├── EmbedRoute.tsx                   ← /embed/reports/{key}?token=...
├── EmbedProvider.tsx                ← Toolbar/filtre gizleme context
├── useEmbedAuth.ts                  ← Token doğrulama hook
└── EmbedPreviewDialog.tsx           ← Rapor ayarlarında embed önizleme
```

**Güvenlik:** JWT token + domain whitelist + CSP header + rate limit.

### Faz G: Data Catalog & Audit Trail

**Amaç:** Tablo/sütun açıklamaları, business glossary, değişiklik geçmişi.

**Yapılacak:**
```
mfe-schema-explorer/src/catalog/
├── DataCatalog.tsx                  ← Tablo/sütun açıklama editörü
├── BusinessGlossary.tsx             ← Terim sözlüğü (Revenue = ?)
├── useCatalogAnnotations.ts         ← Annotation CRUD hook
└── AuditTrail.tsx                   ← Kim ne zaman ne değiştirdi
```

**Backend:**
```
POST /api/v1/schema/catalog/{table}  ← Tablo açıklaması kaydet
POST /api/v1/schema/glossary         ← Business term ekle
GET  /api/v1/audit/reports           ← Rapor değişiklik geçmişi
```

### Faz H: PDF/PNG Export

**Amaç:** Dashboard ve raporu PDF/PNG olarak indir veya email at.

**Backend:** Puppeteer veya Playwright ile headless render.
```
POST /v1/reports/{key}/export/pdf    ← PDF üret
POST /v1/reports/{key}/export/png    ← Screenshot üret
POST /v1/dashboards/{key}/export/pdf ← Dashboard PDF
```

### Faz I: Real-Time & Streaming

**Amaç:** Canlı veri akışı — WebSocket veya SSE ile grid/chart güncelleme.

**Yapılacak:**
```
mfe-reporting/src/realtime/
├── useRealtimeData.ts               ← WebSocket hook
├── LiveIndicator.tsx                 ← "Canlı" badge
└── StreamingGridAdapter.ts          ← AG Grid + WS birleştirici
```

### Faz J: Mobile Responsive

**Amaç:** Tüm raporlar ve dashboard'lar mobilde kullanılabilir.

**Yapılacak:**
- Dashboard builder: responsive breakpoint'ler (desktop → tablet → mobile layout)
- Grid: horizontal scroll + pinned columns mobile'da
- Chart: touch-friendly, responsive boyut
- Sidebar: drawer pattern (zaten var)

## Öncelik ve Timeline

```
KRİTİK (olmadan rakiplerle yarışılamaz):
  Faz A: Visualization Engine        ← 2 hafta
  Faz B: Dashboard Builder           ← 2 hafta

YÜKSEK (iş değeri yüksek):
  Faz C: SQL Editor                  ← 1 hafta
  Faz D: AI Query                    ← 1 hafta
  Faz E: Alert/Schedule backend      ← 2 hafta

ORTA (enterprise gereksinim):
  Faz F: Embed runtime               ← 1 hafta
  Faz G: Data Catalog + Audit        ← 1 hafta
  Faz H: PDF/PNG export              ← 1 hafta

DÜŞÜK (gelecek):
  Faz I: Real-time streaming         ← 1 hafta
  Faz J: Mobile responsive           ← 1 hafta
```

## Bağımlılık Grafiği

```
Faz A (visualization) ─────────┐
                                ├── Faz B (dashboard builder)
Mevcut Faz 0-8 ────────────────┤
                                ├── Faz C (SQL editor)
                                ├── Faz D (AI query) ← Faz C'den sonra
                                ├── Faz E (alert/schedule backend)
                                ├── Faz F (embed runtime)
                                ├── Faz G (data catalog)
                                └── Faz H (PDF/PNG export) ← Faz A'dan sonra

Faz I (real-time) ← Faz A + B'den sonra
Faz J (mobile) ← Faz A + B'den sonra
```

## Tamamlandığında Skor

```
Özellik                    | Power BI | Metabase | Superset | Looker | Bizde (sonra)
---------------------------|----------|----------|----------|--------|-------------
Visualization              | 100+     | 15       | 40+      | 20     | 12+ (DL)
Dashboard                  | ✅       | ✅       | ✅       | ✅     | ✅
SQL Editor                 | DAX      | ✅       | ✅       | ✅     | ✅
AI Query                   | Copilot  | Metabot  | AI       | ❌     | ✅
Semantic Layer             | ✅       | ❌       | ❌       | LookML | ✅
Schema-First               | ❌       | ❌       | ❌       | ❌     | ✅ Benzersiz
Column Type System         | ❌       | ❌       | ❌       | ❌     | ✅ Benzersiz
Alerting                   | ✅       | ✅       | ✅       | ❌     | ✅
Embed                      | ✅       | ✅       | ✅       | ✅     | ✅
Design System Native       | ❌       | ❌       | ❌       | ❌     | ✅ Benzersiz
```

## Başarı Kriteri

Tüm fazlar tamamlandığında:
- **Visualization:** 12+ chart tipi (Design Lab kütüphanesinden)
- **Dashboard:** Drag & drop multi-widget layout
- **Query:** SQL editor + AI doğal dil
- **Alert:** Çalışan threshold + email/Slack
- **Embed:** JWT + iframe + white-label
- **Catalog:** Tablo açıklamaları + glossary + audit trail
- **Export:** CSV/Excel/PDF/PNG
- **Benzersiz:** Schema-first, column-system, FK lookup, Design Lab native, multi-tier DB

Bu planla rakiplerin hiçbirinde olmayan 5+ benzersiz özellik + tüm standart BI özellikleri.
