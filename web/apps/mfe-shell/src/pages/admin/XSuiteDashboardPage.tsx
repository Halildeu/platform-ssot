import React from 'react';
import { Text } from '@mfe/design-system';

// Direct imports from design-system (already works in mfe-shell)
// X-Charts: only import our custom SVG/React components, not AG Charts wrappers
let ChartDashboard: React.FC<any> | null = null;
let KPICard: React.FC<any> | null = null;
let StatWidget: React.FC<any> | null = null;
let SparklineChart: React.FC<any> | null = null;
let ChartContainer: React.FC<any> | null = null;
let ChartLegend: React.FC<any> | null = null;
let DataGridFilterChips: React.FC<any> | null = null;
let DataGridSelectionBar: React.FC<any> | null = null;
let RichTextEditor: React.FC<any> | null = null;
let FormRenderer: React.FC<any> | null = null;

try {
  const xCharts = require('@mfe/x-charts');
  ChartDashboard = xCharts.ChartDashboard;
  KPICard = xCharts.KPICard;
  StatWidget = xCharts.StatWidget;
  SparklineChart = xCharts.SparklineChart;
  ChartContainer = xCharts.ChartContainer;
  ChartLegend = xCharts.ChartLegend;
} catch (e) {
  console.warn('[X-Suite] x-charts not available:', e);
}

try {
  const xGrid = require('@mfe/x-data-grid');
  DataGridFilterChips = xGrid.DataGridFilterChips;
  DataGridSelectionBar = xGrid.DataGridSelectionBar;
} catch (e) {
  console.warn('[X-Suite] x-data-grid not available:', e);
}

try {
  const xEditor = require('@mfe/x-editor');
  RichTextEditor = xEditor.RichTextEditor;
} catch (e) {
  console.warn('[X-Suite] x-editor not available:', e);
}

try {
  const xFormBuilder = require('@mfe/x-form-builder');
  FormRenderer = xFormBuilder.FormRenderer;
} catch (e) {
  console.warn('[X-Suite] x-form-builder not available:', e);
}

export default function XSuiteDashboardPage() {
  return (
    <div className="space-y-8 p-6">
      <div>
        <Text as="h1" className="text-2xl font-bold text-text-primary">
          Enterprise X Suite Dashboard
        </Text>
        <Text variant="secondary" className="text-sm">
          Tüm X Suite bileşenlerinin canlı entegrasyon örneği
        </Text>
      </div>

      {/* Section 1: KPI Cards */}
      {ChartDashboard && KPICard && SparklineChart && (
        <section>
          <Text as="h2" className="mb-4 text-lg font-semibold text-text-primary">KPI Overview</Text>
          <ChartDashboard columns={4} gap="md">
            <KPICard
              title="Toplam Kullanıcı"
              value="12,847"
              trend={{ direction: 'up', value: '+12.5%', positive: true }}
              chart={<SparklineChart data={[10, 12, 8, 15, 13, 17, 20]} type="area" />}
            />
            <KPICard
              title="Aktif Oturum"
              value="1,234"
              trend={{ direction: 'up', value: '+3.2%', positive: true }}
              chart={<SparklineChart data={[5, 8, 6, 9, 7, 11, 12]} type="line" />}
            />
            <KPICard
              title="Hata Oranı"
              value="0.12%"
              trend={{ direction: 'down', value: '-0.03%', positive: true }}
              chart={<SparklineChart data={[3, 2, 4, 1, 2, 1, 1]} type="bar" />}
            />
            <KPICard
              title="Ortalama Yanıt"
              value="142ms"
              trend={{ direction: 'down', value: '-8ms', positive: true }}
              chart={<SparklineChart data={[180, 165, 150, 155, 148, 145, 142]} type="line" />}
            />
          </ChartDashboard>
        </section>
      )}

      {/* Section 2: Stat Widgets */}
      {StatWidget && (
        <section>
          <Text as="h2" className="mb-4 text-lg font-semibold text-text-primary">Stats</Text>
          <div className="grid grid-cols-3 gap-4">
            <StatWidget label="API Çağrıları" value={45230} previousValue={42100} format="number" />
            <StatWidget label="Gelir" value={128500} previousValue={115000} format="currency" prefix="₺" />
            <StatWidget label="Dönüşüm" value={0.0342} previousValue={0.031} format="percent" />
          </div>
        </section>
      )}

      {/* Section 3: Charts */}
      {ChartContainer && (
        <section>
          <Text as="h2" className="mb-4 text-lg font-semibold text-text-primary">Charts</Text>
          <div className="grid grid-cols-2 gap-4">
            <ChartContainer title="Aylık Trafik" description="Son 6 ay" height={300}>
              <div className="flex h-full items-end gap-2 px-4 pb-4">
                {[4500, 5200, 4800, 6100, 5900, 7200].map((v, i) => (
                  <div key={i} className="flex flex-1 flex-col items-center gap-1">
                    <div
                      className="w-full rounded-t bg-[var(--action-primary,#3b82f6)]"
                      style={{ height: `${(v / 7200) * 200}px` }}
                    />
                    <span className="text-[10px] text-text-secondary">
                      {['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz'][i]}
                    </span>
                  </div>
                ))}
              </div>
            </ChartContainer>
            <ChartContainer title="Kategori Dağılımı" height={300}>
              <div className="flex h-full items-center justify-center gap-8 px-4">
                <svg width="160" height="160" viewBox="0 0 160 160" role="img" aria-label="Pie chart">
                  <circle cx="80" cy="80" r="60" fill="none" stroke="var(--action-primary,#3b82f6)" strokeWidth="30" strokeDasharray="170 377" strokeDashoffset="0" />
                  <circle cx="80" cy="80" r="60" fill="none" stroke="var(--state-success-text,#16a34a)" strokeWidth="30" strokeDasharray="113 377" strokeDashoffset="-170" />
                  <circle cx="80" cy="80" r="60" fill="none" stroke="var(--state-warning-text,#d97706)" strokeWidth="30" strokeDasharray="94 377" strokeDashoffset="-283" />
                </svg>
                {ChartLegend && (
                  <ChartLegend
                    items={[
                      { label: 'Web', color: 'var(--action-primary,#3b82f6)', value: '45%' },
                      { label: 'Mobile', color: 'var(--state-success-text,#16a34a)', value: '30%' },
                      { label: 'API', color: 'var(--state-warning-text,#d97706)', value: '25%' },
                    ]}
                    direction="vertical"
                  />
                )}
              </div>
            </ChartContainer>
          </div>
        </section>
      )}

      {/* Section 4: Data Grid Filter Chips */}
      {DataGridFilterChips && (
        <section>
          <Text as="h2" className="mb-4 text-lg font-semibold text-text-primary">Data Grid</Text>
          <DataGridFilterChips
            filters={[
              { id: '1', field: 'status', label: 'Durum', value: 'Aktif' },
              { id: '2', field: 'role', label: 'Rol', value: 'Admin' },
              { id: '3', field: 'dept', label: 'Departman', value: 'Mühendislik' },
            ]}
            onRemove={(id: string) => console.log('remove', id)}
            onClearAll={() => console.log('clear all')}
          />
          {DataGridSelectionBar && (
            <div className="mt-2">
              <DataGridSelectionBar
                selectedCount={3}
                onClearSelection={() => console.log('clear selection')}
              >
                <button className="rounded bg-[var(--action-primary,#3b82f6)] px-3 py-1 text-xs text-white">
                  Toplu Sil
                </button>
              </DataGridSelectionBar>
            </div>
          )}
        </section>
      )}

      {/* Section 5: Rich Text Editor */}
      {RichTextEditor && (
        <section>
          <Text as="h2" className="mb-4 text-lg font-semibold text-text-primary">Rich Text Editor</Text>
          <RichTextEditor placeholder="İçerik yazın..." minHeight={200} />
        </section>
      )}

      {/* Section 6: Form Builder */}
      {FormRenderer && (
        <section>
          <Text as="h2" className="mb-4 text-lg font-semibold text-text-primary">Form Builder</Text>
          <FormRenderer
            schema={{
              id: 'demo-form',
              title: 'Kullanıcı Bilgileri',
              columns: 2,
              fields: [
                { id: 'name', type: 'text', name: 'name', label: 'Ad Soyad', required: true, span: 1 },
                { id: 'email', type: 'email', name: 'email', label: 'E-posta', required: true, span: 1 },
                { id: 'role', type: 'select', name: 'role', label: 'Rol', options: [
                  { label: 'Admin', value: 'admin' },
                  { label: 'Kullanıcı', value: 'user' },
                  { label: 'Editör', value: 'editor' },
                ], span: 1 },
                { id: 'bio', type: 'textarea', name: 'bio', label: 'Biyografi', span: 2 },
              ],
              submitLabel: 'Kaydet',
            }}
            onSubmit={(values: any) => console.log('submit', values)}
          />
        </section>
      )}

      {/* Fallback: if no X packages loaded */}
      {!ChartDashboard && !DataGridFilterChips && !RichTextEditor && !FormRenderer && (
        <div className="rounded-xl border border-border-subtle bg-surface-canvas p-8 text-center">
          <Text variant="secondary">X Suite paketleri yüklenemedi. pnpm install çalıştırın.</Text>
        </div>
      )}
    </div>
  );
}
