import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { GanttTimeline } from './GanttTimeline';
import type { GanttTask } from './GanttTimeline';

const today = new Date();
const d = (offset: number) => {
  const date = new Date(today);
  date.setDate(date.getDate() + offset);
  return date;
};

const sampleTasks: GanttTask[] = [
  { id: 't1', title: 'Requirements Gathering', startDate: d(0), endDate: d(5), progress: 100, group: 'Planning', color: 'var(--action-primary)' },
  { id: 't2', title: 'Architecture Design', startDate: d(3), endDate: d(10), progress: 80, group: 'Planning', color: 'var(--action-primary)' },
  { id: 't3', title: 'Backend Development', startDate: d(8), endDate: d(25), progress: 40, group: 'Development', dependencies: ['t2'] },
  { id: 't4', title: 'Frontend Development', startDate: d(10), endDate: d(28), progress: 30, group: 'Development', dependencies: ['t2'] },
  { id: 't5', title: 'Integration Testing', startDate: d(22), endDate: d(32), progress: 0, group: 'QA', dependencies: ['t3', 't4'] },
  { id: 'm1', title: 'Go-Live', startDate: d(35), endDate: d(35), type: 'milestone', group: 'Delivery', dependencies: ['t5'] },
];

const meta: Meta<typeof GanttTimeline> = {
  title: 'Enterprise/GanttTimeline',
  component: GanttTimeline,
  tags: ['autodocs'],
  argTypes: { disabled: { control: 'boolean' } },
  decorators: [(Story) => <div style={{ padding: '1rem' }}><Story /></div>],
};
export default meta;
type Story = StoryObj<typeof GanttTimeline>;

export const Default: Story = {
  args: {
    tasks: sampleTasks,
    viewMode: 'week',
  },
  play: async ({ canvasElement }) => {
    const task = canvasElement.querySelector('[data-testid], [role="button"], button');
    if (task) (task as HTMLElement).click();
  },
};

export const DayView: Story = {
  args: {
    tasks: sampleTasks.slice(0, 3),
    viewMode: 'day',
  },
};

export const GroupedWithDependencies: Story = {
  args: {
    tasks: sampleTasks,
    viewMode: 'week',
    groupBy: 'group',
    showDependencies: true,
  },
};

export const MonthView: Story = {
  args: {
    tasks: sampleTasks,
    viewMode: 'month',
  },
};

export const SingleTask: Story = {
  args: {
    tasks: [sampleTasks[0]],
    viewMode: 'day',
  },
};

export const MilestonesOnly: Story = {
  args: {
    tasks: sampleTasks.filter((t) => t.type === 'milestone'),
    viewMode: 'week',
  },
};
