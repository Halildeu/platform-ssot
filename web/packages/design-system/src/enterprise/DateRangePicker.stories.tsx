import type { Meta, StoryObj } from '@storybook/react';
import { DateRangePicker } from './DateRangePicker';

const meta: Meta<typeof DateRangePicker> = {
  title: 'Enterprise/DateRangePicker',
  component: DateRangePicker,
  tags: ['autodocs'],
  argTypes: { disabled: { control: 'boolean' } },
};
export default meta;
type Story = StoryObj<typeof DateRangePicker>;

export const Default: Story = {
  args: {},
};

export const WithInitialRange: Story = {
  args: {
    value: {
      start: new Date(2024, 0, 1),
      end: new Date(2024, 2, 31),
    },
  },
};

export const WithMinMaxDates: Story = {
  args: {
    minDate: new Date(2023, 0, 1),
    maxDate: new Date(2024, 11, 31),
    placeholder: 'Select a date range within 2023-2024',
  },
};

export const DisabledPresets: Story = {
  args: {
    disabledPresets: ['ytd', 'lastYear'],
    locale: 'tr-TR',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    placeholder: 'Picker is disabled',
  },
};

export const WithLocale: Story = {
  args: {
    locale: 'en-US',
    placeholder: 'Select date range',
  },
};
