import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Grid } from './Grid';

const meta: Meta<typeof Grid> = {
  title: 'Components/Primitives/Grid',
  component: Grid,
  tags: ['autodocs'],
  argTypes: {
    columns: { control: 'select', options: [12, 24] },
    gutter: { control: 'select', options: [0, 1, 2, 3, 4, 5, 6, 8, 10, 12] },
    align: { control: 'select', options: ['start', 'center', 'end', 'stretch'] },
  },
  decorators: [(Story) => <div style={{ padding: '1rem' }}><Story /></div>],
};
export default meta;
type Story = StoryObj<typeof Grid>;

const Box = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={`rounded-lg border border-border-subtle bg-surface-muted px-3 py-2 text-center text-sm ${className ?? ''}`}>{children}</div>
);

export const Default: Story = {
  render: () => (
    <Grid columns={12} gutter={4}>
      <Grid.Col span={4}><Box>span=4</Box></Grid.Col>
      <Grid.Col span={4}><Box>span=4</Box></Grid.Col>
      <Grid.Col span={4}><Box>span=4</Box></Grid.Col>
    </Grid>
  ),
};

export const Responsive: Story = {
  render: () => (
    <Grid columns={12} gutter={4}>
      <Grid.Col span={12} md={6} lg={4}><Box>12 → 6 → 4</Box></Grid.Col>
      <Grid.Col span={12} md={6} lg={4}><Box>12 → 6 → 4</Box></Grid.Col>
      <Grid.Col span={12} md={12} lg={4}><Box>12 → 12 → 4</Box></Grid.Col>
    </Grid>
  ),
};

export const WithOffset: Story = {
  render: () => (
    <Grid columns={12} gutter={4}>
      <Grid.Col span={4}><Box>span=4</Box></Grid.Col>
      <Grid.Col span={4} offset={4}><Box>span=4 offset=4</Box></Grid.Col>
    </Grid>
  ),
};

export const GutterSizes: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      {([0, 2, 4, 8] as const).map((g) => (
        <div key={g}>
          <p className="mb-1 text-xs text-text-secondary">gutter={g}</p>
          <Grid columns={12} gutter={g}>
            <Grid.Col span={3}><Box>3</Box></Grid.Col>
            <Grid.Col span={3}><Box>3</Box></Grid.Col>
            <Grid.Col span={3}><Box>3</Box></Grid.Col>
            <Grid.Col span={3}><Box>3</Box></Grid.Col>
          </Grid>
        </div>
      ))}
    </div>
  ),
};

export const TwentyFourColumns: Story = {
  render: () => (
    <Grid columns={24} gutter={2}>
      <Grid.Col span={6}><Box>6/24</Box></Grid.Col>
      <Grid.Col span={12}><Box>12/24</Box></Grid.Col>
      <Grid.Col span={6}><Box>6/24</Box></Grid.Col>
    </Grid>
  ),
};
