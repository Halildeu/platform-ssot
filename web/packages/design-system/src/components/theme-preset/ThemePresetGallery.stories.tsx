import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ThemePresetGallery } from './ThemePresetGallery';
import type { ThemePresetGalleryItem } from './ThemePresetGallery';

const meta: Meta<typeof ThemePresetGallery> = {
  title: 'Components/Theme/ThemePresetGallery',
  component: ThemePresetGallery,
  tags: ['autodocs'],
  argTypes: { disabled: { control: 'boolean' } },
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

export const SinglePreset: Story = {
  args: {
    presets: [presets[0]],
  },
};

export const HighContrastOnly: Story = {
  args: {
    presets: presets.filter((p) => p.isHighContrast),
    selectedPresetId: 'high-contrast',
  },
};

export const ManyPresets: Story = {
  args: {
    presets: [...presets, ...presets.map((p) => ({ ...p, presetId: p.presetId + '-alt', label: p.label + ' Alt' }))],
  },
};
