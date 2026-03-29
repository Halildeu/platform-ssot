import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Calendar } from './Calendar';
import type { CalendarEvent } from './Calendar';

const meta: Meta<typeof Calendar> = {
  title: 'Components/DataDisplay/Calendar',
  component: Calendar,
  tags: ['autodocs'],
  argTypes: {
    mode: {
      control: 'select',
      options: ['single', 'multiple', 'range'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    firstDayOfWeek: {
      control: 'select',
      options: [0, 1],
    },
    showWeekNumbers: { control: 'boolean' },
    showOutsideDays: { control: 'boolean' },
    numberOfMonths: {
      control: 'select',
      options: [1, 2, 3],
    },
  },
  decorators: [(Story) => <div style={{ padding: '1rem' }}><Story /></div>],
};
export default meta;
type Story = StoryObj<typeof Calendar>;

export const Default: Story = {
  args: {
    mode: 'single',
    size: 'md',
  },
  play: async ({ canvasElement }) => {
    const el = canvasElement.querySelector('[role="button"], button, [data-testid], input, [tabindex]');
    if (el) (el as HTMLElement).click();
  },
};

export const SingleSelection: Story = {
  render: () => {
    const [value, setValue] = useState<Date | null>(new Date(2024, 2, 15));
    return (
      <Calendar
        mode="single"
        value={value}
        onValueChange={(v) => setValue(v as Date)}
        defaultMonth={new Date(2024, 2, 1)}
      />
    );
  },
};

export const RangeSelection: Story = {
  render: () => {
    const [value, setValue] = useState<Date[] | null>(null);
    return (
      <div>
        <Calendar
          mode="range"
          value={value}
          onValueChange={(v) => setValue(v as Date[])}
          defaultMonth={new Date(2024, 2, 1)}
        />
        {value && Array.isArray(value) && value.length === 2 && (
          <div style={{ marginTop: 12, fontSize: 13, color: 'var(--text-secondary)' }}>
            Secilen aralik: {value[0].toLocaleDateString('tr-TR')} - {value[1].toLocaleDateString('tr-TR')}
          </div>
        )}
      </div>
    );
  },
};

export const WithEvents: Story = {
  args: {
    mode: 'single',
    defaultMonth: new Date(2024, 2, 1),
    events: [
      { date: new Date(2024, 2, 5), label: 'Toplanti', color: 'var(--action-primary)' },
      { date: new Date(2024, 2, 5), label: 'Egitim', color: 'var(--state-success-text)' },
      { date: new Date(2024, 2, 12), label: 'Teslim Tarihi', color: 'var(--state-danger-text)' },
      { date: new Date(2024, 2, 18), label: 'Izin', color: 'var(--state-warning-text)' },
      { date: new Date(2024, 2, 22), label: 'Sprint Demo', color: 'var(--action-primary)' },
      { date: new Date(2024, 2, 28), label: 'Denetim', color: 'var(--action-primary)' },
    ] as CalendarEvent[],
  },
};

export const WithMinMaxDate: Story = {
  args: {
    mode: 'single',
    defaultMonth: new Date(2024, 2, 1),
    minDate: new Date(2024, 2, 5),
    maxDate: new Date(2024, 2, 25),
  },
};

export const SmallSize: Story = {
  args: {
    mode: 'single',
    size: 'sm',
  },
};

export const LargeSize: Story = {
  args: {
    mode: 'single',
    size: 'lg',
  },
};

export const WithWeekNumbers: Story = {
  args: {
    mode: 'single',
    showWeekNumbers: true,
  },
};

export const TwoMonths: Story = {
  args: {
    mode: 'range',
    numberOfMonths: 2,
    defaultMonth: new Date(2024, 2, 1),
  },
};

export const SundayFirst: Story = {
  name: 'Pazar Ilk Gun',
  args: {
    mode: 'single',
    firstDayOfWeek: 0,
  },
};
