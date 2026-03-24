import type { Meta, StoryObj } from '@storybook/react';
import { FilterPresets } from './FilterPresets';
import type { FilterPreset } from './FilterPresets';

const samplePresets: FilterPreset[] = [
  { id: 'p1', name: 'Active Orders', filters: { status: 'active', dateRange: 'last30d' }, isDefault: true },
  { id: 'p2', name: 'High Priority', filters: { priority: 'high', status: 'active' } },
  { id: 'p3', name: 'Overdue Items', filters: { status: 'overdue' } },
  { id: 'p4', name: 'Team Shared View', filters: { department: 'engineering', status: 'all' }, isShared: true },
  { id: 'p5', name: 'My Assignments', filters: { assignee: 'current-user', status: 'active' } },
];

const meta: Meta<typeof FilterPresets> = {
  title: 'Enterprise/FilterPresets',
  component: FilterPresets,
  tags: ['autodocs'],
  argTypes: { disabled: { control: 'boolean' } },
};
export default meta;
type Story = StoryObj<typeof FilterPresets>;

export const Default: Story = {
  args: {
    presets: samplePresets,
    activePresetId: 'p1',
    onSelect: (preset) => console.log('Selected:', preset.name),
  },
  play: async ({ canvasElement }) => {
    const chip = canvasElement.querySelector('button, [role="button"], [data-testid]');
    if (chip) (chip as HTMLElement).click();
  },
};

export const WithSaveAction: Story = {
  args: {
    presets: samplePresets,
    activePresetId: null,
    onSelect: (preset) => console.log('Selected:', preset.name),
    onSave: (name, filters) => console.log('Save:', name, filters),
    onDelete: (id) => console.log('Delete:', id),
    onSetDefault: (id) => console.log('Set default:', id),
    currentFilters: { status: 'pending', category: 'finance' },
  },
};

export const EmptyPresets: Story = {
  args: {
    presets: [],
    onSelect: () => {},
    onSave: (name, filters) => console.log('Save:', name, filters),
    currentFilters: { status: 'active' },
  },
};

export const SinglePreset: Story = {
  args: {
    presets: [{ id: 'p1', name: 'Default View', filters: { status: 'all' }, isDefault: true }],
    activePresetId: 'p1',
    onSelect: (preset) => console.log('Selected:', preset.name),
  },
};

export const ManyPresets: Story = {
  args: {
    presets: Array.from({ length: 10 }, (_, i) => ({
      id: `p${i}`,
      name: `Preset ${i + 1}`,
      filters: { status: i % 2 === 0 ? 'active' : 'inactive' },
      isDefault: i === 0,
    })),
    activePresetId: 'p0',
    onSelect: (preset) => console.log('Selected:', preset.name),
  },
};

export const SharedPresets: Story = {
  args: {
    presets: samplePresets.map((p) => ({ ...p, isShared: true })),
    activePresetId: 'p1',
    onSelect: (preset) => console.log('Selected:', preset.name),
  },
};
