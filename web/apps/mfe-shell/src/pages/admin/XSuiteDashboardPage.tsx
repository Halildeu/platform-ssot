import React from 'react';
import { Text } from '@mfe/design-system';

// X-Charts imports
import {
  ChartDashboard,
  KPICard,
  StatWidget,
  SparklineChart,
  ChartContainer,
  BarChart,
  PieChart,
  ChartLegend,
} from '@mfe/x-charts';

// X-Data-Grid imports
import {
  DataGridFilterChips,
  DataGridSelectionBar,
} from '@mfe/x-data-grid';

// X-Editor imports
import { RichTextEditor } from '@mfe/x-editor';

// X-FormBuilder imports
import { FormRenderer } from '@mfe/x-form-builder';

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
      <section>
        <Text as="h2" className="mb-4 text-lg font-semibold">KPI Overview</Text>
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

      {/* Section 2: Stat Widgets */}
      <section>
        <Text as="h2" className="mb-4 text-lg font-semibold">Stats</Text>
        <div className="grid grid-cols-3 gap-4">
          <StatWidget label="API Çağrıları" value={45230} previousValue={42100} format="number" />
          <StatWidget label="Gelir" value={128500} previousValue={115000} format="currency" prefix="₺" />
          <StatWidget label="Dönüşüm" value={0.0342} previousValue={0.031} format="percent" />
        </div>
      </section>

      {/* Section 3: Charts */}
      <section>
        <Text as="h2" className="mb-4 text-lg font-semibold">Charts</Text>
        <ChartDashboard columns={2} gap="md">
          <ChartContainer title="Aylık Trafik" description="Son 6 ay">
            <BarChart
              data={[
                { label: 'Oca', value: 4500 },
                { label: 'Şub', value: 5200 },
                { label: 'Mar', value: 4800 },
                { label: 'Nis', value: 6100 },
                { label: 'May', value: 5900 },
                { label: 'Haz', value: 7200 },
              ]}
              size="md"
            />
          </ChartContainer>
          <ChartContainer title="Kategori Dağılımı">
            <PieChart
              data={[
                { label: 'Web', value: 45 },
                { label: 'Mobile', value: 30 },
                { label: 'API', value: 25 },
              ]}
              size="md"
              donut
            />
          </ChartContainer>
        </ChartDashboard>
      </section>

      {/* Section 4: Data Grid with Filter Chips */}
      <section>
        <Text as="h2" className="mb-4 text-lg font-semibold">Data Grid</Text>
        <DataGridFilterChips
          filters={[
            { id: '1', field: 'status', label: 'Durum', value: 'Aktif' },
            { id: '2', field: 'role', label: 'Rol', value: 'Admin' },
          ]}
          onRemove={(id) => console.log('remove', id)}
          onClearAll={() => console.log('clear all')}
        />
        <DataGridSelectionBar
          selectedCount={3}
          onClearSelection={() => console.log('clear selection')}
        >
          <button className="rounded bg-action-primary px-3 py-1 text-xs text-white">Toplu Sil</button>
        </DataGridSelectionBar>
      </section>

      {/* Section 5: Rich Text Editor */}
      <section>
        <Text as="h2" className="mb-4 text-lg font-semibold">Rich Text Editor</Text>
        <RichTextEditor
          placeholder="İçerik yazın..."
          minHeight={200}
        />
      </section>

      {/* Section 6: Form Builder */}
      <section>
        <Text as="h2" className="mb-4 text-lg font-semibold">Form Builder</Text>
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
          onSubmit={(values) => console.log('submit', values)}
        />
      </section>

      {/* Section 7: Legend */}
      <section>
        <ChartLegend
          items={[
            { label: 'Web', color: 'var(--action-primary)', value: '45%' },
            { label: 'Mobile', color: 'var(--state-success-text)', value: '30%' },
            { label: 'API', color: 'var(--state-warning-text)', value: '25%' },
          ]}
          direction="horizontal"
        />
      </section>
    </div>
  );
}
