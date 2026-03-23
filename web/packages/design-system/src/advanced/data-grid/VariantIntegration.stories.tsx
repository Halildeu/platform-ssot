import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

const meta: Meta = { title: 'Advanced/DataGrid/VariantIntegration' };
export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => <div>VariantIntegration requires AG Grid modules — see integration docs</div>,
};

export const QuartzTheme: Story = {
  render: () => <div>VariantIntegration — Quartz theme variant</div>,
};

export const CompactDensity: Story = {
  render: () => <div>VariantIntegration — compact density mode</div>,
};
