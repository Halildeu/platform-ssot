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
  { id: 't1', title: 'Requirements Gathering', startDate: d(0), endDate: d(5), progress: 100, group: 'Planning', color: '#3b82f6' },
  { id: 't2', title: 'Architecture Design', startDate: d(3), endDate: d(10), progress: 80, group: 'Planning', color: '#6366f1' },
  { id: 't3', title: 'Backend Development', startDate: d(8), endDate: d(25), progress: 40, group: 'Development', dependencies: ['t2'] },
  { id: 't4', title: 'Frontend Development', startDate: d(10), endDate: d(28), progress: 30, group: 'Development', dependencies: ['t2'] },
  { id: 't5', title: 'Integration Testing', startDate: d(22), endDate: d(32), progress: 0, group: 'QA', dependencies: ['t3', 't4'] },
  { id: 'm1', title: 'Go-Live', startDate: d(35), endDate: d(35), type: 'milestone', group: 'Delivery', dependencies: ['t5'] },
];

const meta: Meta<typeof GanttTimeline> = {
  title: 'Enterprise/GanttTimeline',
  component: GanttTimeline,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof GanttTimeline>;

export const Default: Story = {
  args: {
    tasks: sampleTasks,
    viewMode: 'week',
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
