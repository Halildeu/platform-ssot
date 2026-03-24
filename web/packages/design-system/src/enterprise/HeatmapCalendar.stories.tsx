import type { Meta, StoryObj } from '@storybook/react';
import { HeatmapCalendar } from './HeatmapCalendar';
import type { HeatmapDay } from './HeatmapCalendar';

function generateYearData(startYear: number): HeatmapDay[] {
  const data: HeatmapDay[] = [];
  const start = new Date(startYear, 0, 1);
  const end = new Date(startYear, 11, 31);
  const current = new Date(start);

  while (current <= end) {
    const hasActivity = Math.random() > 0.3;
    if (hasActivity) {
      const y = current.getFullYear();
      const m = String(current.getMonth() + 1).padStart(2, '0');
      const d = String(current.getDate()).padStart(2, '0');
      data.push({
        date: `${y}-${m}-${d}`,
        value: Math.floor(Math.random() * 20) + 1,
      });
    }
    current.setDate(current.getDate() + 1);
  }
  return data;
}

const yearData = generateYearData(2025);

const sparseData: HeatmapDay[] = [
  { date: '2025-06-01', value: 5, label: '5 commits on Jun 1' },
  { date: '2025-06-15', value: 12, label: '12 commits on Jun 15' },
  { date: '2025-07-04', value: 3, label: '3 commits on Jul 4' },
  { date: '2025-08-20', value: 18, label: '18 commits on Aug 20' },
  { date: '2025-09-10', value: 7, label: '7 commits on Sep 10' },
];

const meta: Meta<typeof HeatmapCalendar> = {
  title: 'Enterprise/HeatmapCalendar',
  component: HeatmapCalendar,
  tags: ['autodocs'],
  argTypes: {
    showMonthLabels: { control: 'boolean' },
    showDayLabels: { control: 'boolean' },
    showTooltip: { control: 'boolean' },
    access: {
      control: 'select',
      options: ['full', 'readonly', 'disabled', 'hidden'],
    },
  },
};
export default meta;
type Story = StoryObj<typeof HeatmapCalendar>;

export const Default: Story = {
  args: {
    data: sparseData,
    startDate: '2025-01-01',
    endDate: '2025-12-31',
    showMonthLabels: true,
    showDayLabels: true,
    showTooltip: true,
  },
};

export const YearView: Story = {
  args: {
    data: yearData,
    startDate: '2025-01-01',
    endDate: '2025-12-31',
    showMonthLabels: true,
    showDayLabels: true,
    showTooltip: true,
  },
};

export const CustomColors: Story = {
  args: {
    data: yearData,
    startDate: '2025-01-01',
    endDate: '2025-12-31',
    colorScale: ['#dbeafe', '#93c5fd', '#3b82f6', '#1d4ed8', '#1e3a5f'],
    showMonthLabels: true,
    showDayLabels: true,
  },
};
