import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ThemePreviewCard } from './ThemePreviewCard';

const meta: Meta<typeof ThemePreviewCard> = {
  title: 'Components/Theme/ThemePreviewCard',
  component: ThemePreviewCard,
  tags: ['autodocs'],
  argTypes: {
    selected: { control: 'boolean' },
  },
};
export default meta;
type Story = StoryObj<typeof ThemePreviewCard>;

export const Default: Story = {
  args: {
    selected: false,
  },
};

export const Selected: Story = {
  args: {
    selected: true,
  },
};

export const CustomLocale: Story = {
  args: {
    localeText: {
      titleText: 'Sayfa Basligi',
      secondaryText: 'Alt metin',
      saveLabel: 'Uygula',
      selectedLabel: 'Secili',
    },
  },
};

export const MultipleCards: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 12 }}>
      <ThemePreviewCard selected />
      <ThemePreviewCard />
      <ThemePreviewCard />
    </div>
  ),
};
