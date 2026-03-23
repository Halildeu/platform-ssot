import type { Meta, StoryObj } from '@storybook/react';
import { DataExportDialog } from './DataExportDialog';

const meta: Meta<typeof DataExportDialog> = {
  title: 'Enterprise/DataExportDialog',
  component: DataExportDialog,
  tags: ['autodocs'],
  argTypes: { disabled: { control: 'boolean' } },
};
export default meta;
type Story = StoryObj<typeof DataExportDialog>;

export const Default: Story = {
  args: {
    open: true,
    onClose: () => {},
    onExport: (opts) => console.log('Export:', opts),
    recordCounts: { visible: 25, all: 1420, selected: 5, filtered: 120 },
  },
};

export const LimitedFormats: Story = {
  args: {
    open: true,
    onClose: () => {},
    onExport: (opts) => console.log('Export:', opts),
    formats: ['pdf', 'excel'],
    scopes: ['visible', 'all'],
    defaultFormat: 'pdf',
    recordCounts: { visible: 50, all: 500, selected: 0, filtered: 200 },
  },
};

export const CsvOnly: Story = {
  args: {
    open: true,
    onClose: () => {},
    onExport: (opts) => console.log('Export:', opts),
    formats: ['csv'],
    defaultFormat: 'csv',
    defaultScope: 'all',
    recordCounts: { visible: 100, all: 10_000, selected: 0, filtered: 3_500 },
  },
};

export const Closed: Story = {
  args: {
    open: false,
    onClose: () => {},
    onExport: (opts) => console.log('Export:', opts),
    recordCounts: { visible: 10, all: 100, selected: 0, filtered: 50 },
  },
};

export const AllFormats: Story = {
  args: {
    open: true,
    onClose: () => {},
    onExport: (opts) => console.log('Export:', opts),
    formats: ['csv', 'excel', 'pdf', 'json'],
    recordCounts: { visible: 200, all: 5000, selected: 10, filtered: 1000 },
  },
};

export const WithSelection: Story = {
  args: {
    open: true,
    onClose: () => {},
    onExport: (opts) => console.log('Export:', opts),
    defaultScope: 'selected',
    recordCounts: { visible: 50, all: 500, selected: 15, filtered: 200 },
  },
};
