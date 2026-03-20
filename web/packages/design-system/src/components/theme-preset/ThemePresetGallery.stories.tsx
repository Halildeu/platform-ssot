import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ThemePresetGallery } from './ThemePresetGallery';
import type { ThemePresetGalleryItem } from './ThemePresetGallery';

const meta: Meta<typeof ThemePresetGallery> = {
  title: 'Components/Theme/ThemePresetGallery',
  component: ThemePresetGallery,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof ThemePresetGallery>;

const presets: ThemePresetGalleryItem[] = [
  { presetId: 'light', label: 'Acik Tema', themeMode: 'light', appearance: 'modern' },
  { presetId: 'dark', label: 'Koyu Tema', themeMode: 'dark', appearance: 'modern' },
  { presetId: 'high-contrast', label: 'Yuksek Kontrast', isHighContrast: true },
  { presetId: 'default', label: 'Varsayilan', isDefaultMode: true },
];

export const Default: Story = {
  args: {
    presets,
  },
};

export const WithSelection: Story = {
  args: {
    presets,
    selectedPresetId: 'dark',
  },
};

export const Empty: Story = {
  args: {
    presets: [],
  },
};
