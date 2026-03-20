import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { MasterDetail } from './MasterDetail';

const meta: Meta<typeof MasterDetail> = {
  title: 'Patterns/MasterDetail',
  component: MasterDetail,
  tags: ['autodocs'],
  argTypes: {
    ratio: {
      control: 'select',
      options: ['1:2', '1:3', '2:3', '1:1'],
    },
    collapsible: { control: 'boolean' },
    divider: { control: 'boolean' },
  },
};
export default meta;
type Story = StoryObj<typeof MasterDetail>;

const MasterPanel = () => (
  <div style={{ padding: 16 }}>
    {['Kayit 1', 'Kayit 2', 'Kayit 3', 'Kayit 4'].map((item, i) => (
      <div key={i} style={{ padding: '10px 12px', borderBottom: '1px solid var(--border-subtle)', fontSize: 14, cursor: 'pointer' }}>
        {item}
      </div>
    ))}
  </div>
);

const DetailPanel = () => (
  <div style={{ padding: 24 }}>
    <h3 style={{ margin: '0 0 8px', fontSize: 18 }}>Kayit Detayi</h3>
    <p style={{ margin: 0, fontSize: 14, color: 'var(--text-secondary)' }}>
      Secilen kaydin detay bilgileri burada gorunur.
    </p>
  </div>
);

export const Default: Story = {
  args: {
    master: <MasterPanel />,
    detail: <DetailPanel />,
    masterHeader: <span style={{ fontWeight: 600 }}>Liste</span>,
    detailHeader: <span style={{ fontWeight: 600 }}>Detay</span>,
  },
  decorators: [
    (Story) => (
      <div style={{ height: 400, border: '1px solid var(--border-subtle)', borderRadius: 12 }}>
        <Story />
      </div>
    ),
  ],
};

export const WithEmptyDetail: Story = {
  args: {
    master: <MasterPanel />,
    detail: null,
    hasSelection: false,
    detailEmpty: (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: 14, color: 'var(--text-secondary)' }}>
        Bir kayit secin
      </div>
    ),
  },
  decorators: [
    (Story) => (
      <div style={{ height: 400, border: '1px solid var(--border-subtle)', borderRadius: 12 }}>
        <Story />
      </div>
    ),
  ],
};

export const Collapsible: Story = {
  args: {
    master: <MasterPanel />,
    detail: <DetailPanel />,
    collapsible: true,
    ratio: '1:2',
  },
  decorators: [
    (Story) => (
      <div style={{ height: 400, border: '1px solid var(--border-subtle)', borderRadius: 12 }}>
        <Story />
      </div>
    ),
  ],
};
