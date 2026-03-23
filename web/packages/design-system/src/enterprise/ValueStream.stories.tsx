import type { Meta, StoryObj } from '@storybook/react';
import { ValueStream } from './ValueStream';
import type { ValueStreamStep, ValueStreamWait } from './ValueStream';

const manufacturingSteps: ValueStreamStep[] = [
  { id: 's1', label: 'Receiving', processTime: 15, resources: 2, fpy: 99, category: 'value-add' },
  { id: 's2', label: 'Inspection', processTime: 30, resources: 1, fpy: 95, category: 'necessary-waste' },
  { id: 's3', label: 'Assembly', processTime: 45, resources: 4, fpy: 92, category: 'value-add' },
  { id: 's4', label: 'Quality Check', processTime: 20, resources: 2, fpy: 97, category: 'necessary-waste' },
  { id: 's5', label: 'Rework', processTime: 60, resources: 2, fpy: 100, category: 'waste' },
  { id: 's6', label: 'Packaging', processTime: 10, resources: 2, fpy: 99, category: 'value-add' },
  { id: 's7', label: 'Shipping', processTime: 5, resources: 1, fpy: 100, category: 'value-add' },
];

const manufacturingWaits: ValueStreamWait[] = [
  { duration: 120, inventory: 50 },
  { duration: 60, inventory: 30 },
  { duration: 240, inventory: 80 },
  { duration: 30, inventory: 20 },
  { duration: 180, inventory: 45 },
  { duration: 45, inventory: 25 },
];

const meta: Meta<typeof ValueStream> = {
  title: 'Enterprise/ValueStream',
  component: ValueStream,
  tags: ['autodocs'],
  argTypes: { disabled: { control: 'boolean' } },
};
export default meta;
type Story = StoryObj<typeof ValueStream>;

export const Default: Story = {
  args: {
    steps: manufacturingSteps,
    waits: manufacturingWaits,
    timeUnit: 'minutes',
  },
};

export const HoursUnit: Story = {
  args: {
    steps: manufacturingSteps.map((s) => ({ ...s, processTime: s.processTime / 60 })),
    waits: manufacturingWaits.map((w) => ({ ...w, duration: w.duration / 60 })),
    timeUnit: 'hours',
  },
};

export const MinimalSteps: Story = {
  args: {
    steps: manufacturingSteps.slice(0, 3),
    waits: manufacturingWaits.slice(0, 2),
    timeUnit: 'minutes',
  },
};

export const SingleStep: Story = {
  args: {
    steps: [manufacturingSteps[0]],
    waits: [],
    timeUnit: 'minutes',
  },
};

export const AllValueAdd: Story = {
  args: {
    steps: manufacturingSteps.filter((s) => s.category === 'value-add'),
    waits: manufacturingWaits.slice(0, 3),
    timeUnit: 'minutes',
  },
};

export const LargeProcess: Story = {
  args: {
    steps: [...manufacturingSteps, ...manufacturingSteps.map((s) => ({ ...s, id: s.id + '-dup', label: s.label + ' (2nd)' }))],
    waits: [...manufacturingWaits, ...manufacturingWaits],
    timeUnit: 'minutes',
  },
};
