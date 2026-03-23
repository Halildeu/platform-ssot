import type { Meta, StoryObj } from '@storybook/react';
import { ThemePresetCompare } from './ThemePresetCompare';
import type { ThemePresetGalleryItem } from './ThemePresetGallery';

const leftPreset: ThemePresetGalleryItem = {
  presetId: 'corporate-light',
  label: 'Corporate Light',
  appearance: 'flat',
  density: 'comfortable',
  intent: 'neutral',
  isHighContrast: false,
  themeMode: 'light',
};

const rightPreset: ThemePresetGalleryItem = {
  presetId: 'executive-dark',
  label: 'Executive Dark',
  appearance: 'elevated',
  density: 'compact',
  intent: 'brand',
  isHighContrast: true,
  themeMode: 'dark',
};

const meta: Meta<typeof ThemePresetCompare> = {
  title: 'Components/ThemePresetCompare',
  component: ThemePresetCompare,
  tags: ['autodocs'],
  argTypes: { disabled: { control: 'boolean' } },
};
export default meta;
type Story = StoryObj<typeof ThemePresetCompare>;

export const Default: Story = {
  args: {
    leftPreset,
    rightPreset,
  },
};

export const CustomAxes: Story = {
  args: {
    leftPreset,
    rightPreset,
    axes: ['appearance', 'density', 'intent', 'contrast', 'mode'],
    title: 'Theme Comparison',
    description: 'Side-by-side analysis of two theme presets.',
  },
};

export const SinglePreset: Story = {
  args: {
    leftPreset,
    rightPreset: null,
    title: 'Incomplete Comparison',
    description: 'Select a second preset to begin comparison.',
  },
};

export const NoPresets: Story = {
  args: {
    leftPreset: undefined,
    rightPreset: undefined,
  },
};

export const Disabled: Story = {
  args: {
    leftPreset,
    rightPreset,
    access: 'disabled',
    accessReason: 'Insufficient permissions',
  },
};

export const WithDescription: Story = {
  args: {
    leftPreset,
    rightPreset,
    title: 'Full Comparison',
    description: 'Detailed side-by-side preset analysis with all axes visible.',
  },
};
