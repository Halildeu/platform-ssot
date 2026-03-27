import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { FlowBuilder } from './FlowBuilder';
import type { FlowNode, FlowEdge } from './FlowBuilder';

const sampleNodes: FlowNode[] = [
  { id: 's1', type: 'start', label: 'Start', x: 100, y: 200 },
  { id: 't1', type: 'task', label: 'Submit Request', x: 300, y: 200 },
  { id: 'd1', type: 'decision', label: 'Approved?', x: 500, y: 200 },
  { id: 't2', type: 'task', label: 'Process Order', x: 700, y: 150 },
  { id: 'e1', type: 'end', label: 'Done', x: 900, y: 200 },
];

const sampleEdges: FlowEdge[] = [
  { id: 'ed1', from: 's1', to: 't1' },
  { id: 'ed2', from: 't1', to: 'd1' },
  { id: 'ed3', from: 'd1', to: 't2', label: 'Yes' },
  { id: 'ed4', from: 't2', to: 'e1' },
];

function StatefulWrapper(props: React.ComponentProps<typeof FlowBuilder>) {
  const [nodes, setNodes] = useState(props.nodes);
  const [edges, setEdges] = useState(props.edges);
  return (
    <FlowBuilder
      {...props}
      nodes={nodes}
      edges={edges}
      onNodesChange={setNodes}
      onEdgesChange={setEdges}
    />
  );
}

const meta: Meta<typeof FlowBuilder> = {
  title: 'Enterprise/FlowBuilder',
  component: FlowBuilder,
  tags: ['autodocs'],
  argTypes: {
    readOnly: { control: 'boolean' },
    showGrid: { control: 'boolean' },
    showMinimap: { control: 'boolean' },
    showToolbar: { control: 'boolean' },
    snapToGrid: { control: 'boolean' },
    gridSize: { control: { type: 'number', min: 5, max: 50, step: 5 } },
    height: { control: { type: 'number', min: 300, max: 900 } },
  },
  decorators: [(Story) => <div style={{ padding: '1rem' }}><Story /></div>],
};
export default meta;
type Story = StoryObj<typeof FlowBuilder>;

/** Empty canvas with toolbar — ready for building. */
export const Default: Story = {
  args: {
    nodes: [],
    edges: [],
    showToolbar: true,
    showGrid: true,
  },
  render: (args) => <StatefulWrapper {...args} />,
  play: async ({ canvasElement }) => {
    const btn = canvasElement.querySelector('[data-testid="add-task"]');
    if (btn) (btn as HTMLElement).click();
  },
};

/** Pre-populated with 5 nodes and 4 edges. */
export const WithSampleFlow: Story = {
  args: {
    nodes: sampleNodes,
    edges: sampleEdges,
    showToolbar: true,
    showGrid: true,
    showMinimap: true,
    snapToGrid: true,
  },
  render: (args) => <StatefulWrapper {...args} />,
};

/** Non-editable view — all toolbar actions disabled. */
export const ReadOnly: Story = {
  args: {
    nodes: sampleNodes,
    edges: sampleEdges,
    readOnly: true,
    showToolbar: true,
    showGrid: true,
  },
};
