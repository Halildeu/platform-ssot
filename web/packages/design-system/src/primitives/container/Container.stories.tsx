import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Container } from './Container';

const meta: Meta<typeof Container> = {
  title: 'Components/Primitives/Container',
  component: Container,
  tags: ['autodocs'],
  argTypes: {
    maxWidth: { control: 'select', options: ['sm', 'md', 'lg', 'xl', '2xl', 'full', false] },
    centered: { control: 'boolean' },
    padding: { control: 'boolean' },
    fluid: { control: 'boolean' },
  },
};
export default meta;
type Story = StoryObj<typeof Container>;

const Inner = () => (
  <div className="rounded-lg border border-border-subtle bg-surface-muted px-4 py-8 text-center text-sm">Container content</div>
);

export const Default: Story = {
  render: () => <Container maxWidth="xl"><Inner /></Container>,
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      {(['sm', 'md', 'lg', 'xl', '2xl'] as const).map((size) => (
        <div key={size}>
          <p className="mb-1 text-xs text-text-secondary">maxWidth="{size}"</p>
          <Container maxWidth={size}>
            <div className="rounded-lg border border-border-subtle bg-surface-muted px-4 py-3 text-center text-sm">{size}</div>
          </Container>
        </div>
      ))}
    </div>
  ),
};

export const Fluid: Story = {
  render: () => <Container fluid><Inner /></Container>,
};
