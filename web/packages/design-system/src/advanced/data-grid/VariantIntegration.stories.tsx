import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

const meta: Meta = { title: 'Advanced/DataGrid/VariantIntegration' 
  argTypes: { disabled: { control: 'boolean' } },
  decorators: [(Story) => <div style={{ padding: '1rem' }}><Story /></div>],
};
export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => <div>VariantIntegration requires AG Grid modules — see integration docs</div>,
  play: async ({ canvasElement }) => {
    const el = canvasElement.querySelector('[role="button"], button, [data-testid], input, [tabindex]');
    if (el) (el as HTMLElement).click();
  },
};

export const QuartzTheme: Story = {
  render: () => <div>VariantIntegration — Quartz theme variant</div>,
};

export const CompactDensity: Story = {
  render: () => <div>VariantIntegration — compact density mode</div>,
};

export const BalhamTheme: Story = {
  render: () => <div>VariantIntegration — Balham theme variant</div>,
};

export const AlpineTheme: Story = {
  render: () => <div>VariantIntegration — Alpine theme variant</div>,
};

export const MaterialTheme: Story = {
  render: () => <div>VariantIntegration — Material theme variant</div>,
};
