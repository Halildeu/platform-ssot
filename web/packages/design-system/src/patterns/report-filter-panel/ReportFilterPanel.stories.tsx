import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ReportFilterPanel } from './ReportFilterPanel';

const meta: Meta<typeof ReportFilterPanel> = {
  title: 'Patterns/ReportFilterPanel',
  component: ReportFilterPanel,
  tags: ['autodocs'],
  argTypes: {
    loading: { control: 'boolean' },
  },
};
export default meta;
type Story = StoryObj<typeof ReportFilterPanel>;

const FilterFields = () => (
  <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
    <div>
      <label style={{ fontSize: 12, fontWeight: 500, display: 'block', marginBottom: 4 }}>Tarih Araligi</label>
      <select style={{ padding: '6px 12px', borderRadius: 6, border: '1px solid var(--border-default)', fontSize: 13 }}>
        <option>Son 7 gun</option>
        <option>Son 30 gun</option>
        <option>Son 90 gun</option>
      </select>
    </div>
    <div>
      <label style={{ fontSize: 12, fontWeight: 500, display: 'block', marginBottom: 4 }}>Durum</label>
      <select style={{ padding: '6px 12px', borderRadius: 6, border: '1px solid var(--border-default)', fontSize: 13 }}>
        <option>Tumu</option>
        <option>Aktif</option>
        <option>Pasif</option>
      </select>
    </div>
  </div>
);

export const Default: Story = {
  args: {
    children: <FilterFields />,
    submitLabel: 'Filtrele',
    resetLabel: 'Sifirla',
  },
};

export const Loading: Story = {
  args: {
    children: <FilterFields />,
    loading: true,
  },
};
