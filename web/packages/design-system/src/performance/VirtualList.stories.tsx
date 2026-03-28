import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { VirtualList } from './VirtualList';

interface DemoItem {
  id: number;
  name: string;
  email: string;
  department: string;
}

const generateItems = (count: number): DemoItem[] =>
  Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: `Employee ${i + 1}`,
    email: `employee${i + 1}@company.com`,
    department: ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance'][i % 5],
  }));

function VirtualListDemo({ itemCount = 1000, height = 400 }: { itemCount?: number; height?: number }) {
  const items = React.useMemo(() => generateItems(itemCount), [itemCount]);

  return (
    <VirtualList<DemoItem>
      items={items}
      itemHeight={56}
      containerHeight={height}
      aria-label="Employee list"
      renderItem={(item, index, style) => (
        <div
          key={item.id}
          style={{
            ...style,
            display: 'flex',
            alignItems: 'center',
            padding: '0 16px',
            borderBottom: '1px solid #e5e7eb',
            background: index % 2 === 0 ? '#ffffff' : '#f9fafb',
          }}
        >
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 500, fontSize: 14 }}>{item.name}</div>
            <div style={{ fontSize: 12, color: '#6b7280' }}>{item.email}</div>
          </div>
          <div style={{ fontSize: 12, color: '#9ca3af' }}>{item.department}</div>
        </div>
      )}
    />
  );
}

const meta: Meta = {
  title: 'Performance/VirtualList',
  component: VirtualList,
  tags: ['autodocs'],
  decorators: [(Story) => <div style={{ padding: '1rem' }}><Story /></div>],
};
export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => <VirtualListDemo />,
};

export const LargeDataset: Story = {
  render: () => <VirtualListDemo itemCount={10_000} height={500} />,
};

export const CompactHeight: Story = {
  render: () => <VirtualListDemo itemCount={500} height={250} />,
};

export const SmallDataset: Story = {
  render: () => <VirtualListDemo itemCount={10} height={300} />,
};

export const TallContainer: Story = {
  render: () => <VirtualListDemo itemCount={2000} height={600} />,
};

export const MinimalItems: Story = {
  render: () => <VirtualListDemo itemCount={3} height={200} />,
};
