import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { SmartDashboard } from './SmartDashboard';
import type { DashboardWidget } from './SmartDashboard';

const meta: Meta<typeof SmartDashboard> = {
  title: 'Components/Layout/SmartDashboard',
  component: SmartDashboard,
  tags: ['autodocs'],
  argTypes: {
    columns: {
      control: 'select',
      options: [2, 3, 4],
    },
    density: {
      control: 'select',
      options: ['comfortable', 'compact'],
    },
  },
};
export default meta;
type Story = StoryObj<typeof SmartDashboard>;

const widgets: DashboardWidget[] = [
  { key: 'users', title: 'Toplam Kullanici', type: 'kpi', value: '1.234', tone: 'info', trend: { direction: 'up', percentage: 12 }, pinned: true },
  { key: 'revenue', title: 'Aylik Gelir', type: 'kpi', value: '₺45.678', tone: 'success', trend: { direction: 'up', percentage: 8 } },
  { key: 'errors', title: 'Hata Orani', type: 'kpi', value: '%2.3', tone: 'danger', trend: { direction: 'down', percentage: 5 } },
  { key: 'tasks', title: 'Bekleyen Gorevler', type: 'kpi', value: '18', tone: 'warning', trend: { direction: 'stable', percentage: 0 } },
  { key: 'activity', title: 'Son Aktiviteler', type: 'list', size: 'lg', content: <div style={{ fontSize: 13 }}>Aktivite listesi</div> },
];

export const Default: Story = {
  args: {
    widgets,
    title: 'Kontrol Paneli',
    greeting: 'Hos geldiniz, Halil',
  },
};

export const CompactDensity: Story = {
  args: {
    widgets,
    density: 'compact',
    columns: 4,
  },
};

export const ThreeColumns: Story = {
  args: {
    widgets,
    columns: 3,
  },
};

/* ---- Empty state ---- */

export const EmptyState: Story = {
  args: {
    widgets: [],
    title: 'Kontrol Paneli',
    description: 'Henuz widget eklenmedi.',
  },
};

/* ---- Loading state ---- */

const loadingWidgets: DashboardWidget[] = [
  { key: 'loading-1', title: 'Yukleniyor...', type: 'kpi', value: '—', tone: 'default' },
  { key: 'loading-2', title: 'Yukleniyor...', type: 'kpi', value: '—', tone: 'default' },
  { key: 'loading-3', title: 'Yukleniyor...', type: 'kpi', value: '—', tone: 'default' },
];

export const LoadingState: Story = {
  args: {
    widgets: loadingWidgets,
    title: 'Kontrol Paneli',
    description: 'Veriler yukleniyor...',
  },
};

/* ---- Single column ---- */

export const SingleColumn: Story = {
  args: {
    widgets,
    columns: 2,
    title: 'Dar Gorunum',
    description: 'Iki sutunlu minimal yerlesim.',
  },
};

/* ---- Four columns ---- */

export const FourColumns: Story = {
  args: {
    widgets,
    columns: 4,
    title: 'Genis Gorunum',
    description: 'Dort sutunlu maksimum yerlesim.',
  },
};

/* ---- With actions ---- */

const widgetsWithActions: DashboardWidget[] = [
  {
    key: 'revenue-action',
    title: 'Aylik Gelir',
    type: 'kpi',
    value: '₺45.678',
    tone: 'success',
    trend: { direction: 'up', percentage: 8 },
    onRefresh: () => {},
    lastUpdated: '2 dk once',
    pinned: true,
  },
  {
    key: 'errors-action',
    title: 'Hata Orani',
    type: 'kpi',
    value: '%2.3',
    tone: 'danger',
    trend: { direction: 'down', percentage: 5 },
    onRefresh: () => {},
    lastUpdated: '5 dk once',
  },
  {
    key: 'tasks-action',
    title: 'Bekleyen Gorevler',
    type: 'kpi',
    value: '18',
    tone: 'warning',
    trend: { direction: 'stable', percentage: 0 },
    onRefresh: () => {},
    lastUpdated: '1 dk once',
  },
  {
    key: 'custom-action',
    title: 'Ozel Widget',
    type: 'custom',
    content: (
      <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
        <button type="button" style={{ padding: '4px 12px', borderRadius: 6, border: '1px solid #e2e8f0', fontSize: 12 }}>Detay</button>
        <button type="button" style={{ padding: '4px 12px', borderRadius: 6, border: '1px solid #e2e8f0', fontSize: 12 }}>Duzenle</button>
      </div>
    ),
    onRefresh: () => {},
  },
];

export const WithActions: Story = {
  args: {
    widgets: widgetsWithActions,
    title: 'Aksiyonlu Panel',
    onWidgetPin: (key, pinned) => console.log(`Pin: ${key} -> ${pinned}`),
    refreshAll: () => console.log('Refresh all'),
    onTimeRangeChange: (range) => console.log(`Time range: ${range}`),
    timeRange: '7d',
  },
};

/* ---- All densities ---- */

export const AllDensities: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      <div>
        <h3 style={{ marginBottom: 8, fontWeight: 600 }}>Comfortable</h3>
        <SmartDashboard widgets={widgets.slice(0, 3)} density="comfortable" columns={3} />
      </div>
      <div>
        <h3 style={{ marginBottom: 8, fontWeight: 600 }}>Compact</h3>
        <SmartDashboard widgets={widgets.slice(0, 3)} density="compact" columns={3} />
      </div>
    </div>
  ),
};

/* ---- Responsive columns ---- */

export const Responsive: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      <div>
        <h3 style={{ marginBottom: 8, fontWeight: 600 }}>2 Sutun (minmax 280px)</h3>
        <SmartDashboard widgets={widgets} columns={2} />
      </div>
      <div>
        <h3 style={{ marginBottom: 8, fontWeight: 600 }}>3 Sutun (minmax 220px)</h3>
        <SmartDashboard widgets={widgets} columns={3} />
      </div>
      <div>
        <h3 style={{ marginBottom: 8, fontWeight: 600 }}>4 Sutun (minmax 200px)</h3>
        <SmartDashboard widgets={widgets} columns={4} />
      </div>
    </div>
  ),
};
