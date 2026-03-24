import type { Meta, StoryObj } from '@storybook/react';
import { ProcessFlow } from './ProcessFlow';
import type { ProcessNode, ProcessEdge } from './ProcessFlow';

const sampleNodes: ProcessNode[] = [
  { id: 'start', type: 'start', label: 'Start', status: 'completed' },
  { id: 'submit', type: 'task', label: 'Submit Request', status: 'completed' },
  { id: 'review', type: 'task', label: 'Manager Review', status: 'active' },
  { id: 'decision', type: 'decision', label: 'Approved?', status: 'idle' },
  { id: 'process', type: 'subprocess', label: 'Process Order', status: 'idle' },
  { id: 'reject', type: 'task', label: 'Send Rejection', status: 'idle' },
  { id: 'notify', type: 'message', label: 'Send Notification', status: 'idle' },
  { id: 'end', type: 'end', label: 'End', status: 'idle' },
];

const sampleEdges: ProcessEdge[] = [
  { from: 'start', to: 'submit' },
  { from: 'submit', to: 'review' },
  { from: 'review', to: 'decision' },
  { from: 'decision', to: 'process', label: 'Yes' },
  { from: 'decision', to: 'reject', label: 'No' },
  { from: 'process', to: 'notify' },
  { from: 'notify', to: 'end' },
  { from: 'reject', to: 'end' },
];

const meta: Meta<typeof ProcessFlow> = {
  title: 'Enterprise/ProcessFlow',
  component: ProcessFlow,
  tags: ['autodocs'],
  argTypes: { disabled: { control: 'boolean' } },
};
export default meta;
type Story = StoryObj<typeof ProcessFlow>;

export const Default: Story = {
  args: {
    nodes: sampleNodes,
    edges: sampleEdges,
  },
  play: async ({ canvasElement }) => {
    const node = canvasElement.querySelector('[data-testid], [role="button"], button');
    if (node) (node as HTMLElement).click();
  },
};

export const Vertical: Story = {
  args: {
    nodes: sampleNodes,
    edges: sampleEdges,
    orientation: 'vertical',
  },
};

export const WithHighlightedPath: Story = {
  args: {
    nodes: sampleNodes,
    edges: sampleEdges,
    highlightPath: ['start', 'submit', 'review', 'decision', 'process', 'notify', 'end'],
  },
};

export const AllCompleted: Story = {
  args: {
    nodes: sampleNodes.map((n) => ({ ...n, status: 'completed' as const })),
    edges: sampleEdges,
  },
};

export const SingleNode: Story = {
  args: {
    nodes: [sampleNodes[0]],
    edges: [],
  },
};

export const AllIdle: Story = {
  args: {
    nodes: sampleNodes.map((n) => ({ ...n, status: 'idle' as const })),
    edges: sampleEdges,
  },
};
