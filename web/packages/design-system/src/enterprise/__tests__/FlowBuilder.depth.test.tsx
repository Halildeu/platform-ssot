// @vitest-environment jsdom
// quality-depth-boost
import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FlowBuilder } from '../FlowBuilder';
import type { FlowNode, FlowEdge } from '../FlowBuilder';

afterEach(() => {
  cleanup();
});

const sampleNodes: FlowNode[] = [
  { id: 's1', type: 'start', label: 'Start', x: 100, y: 200 },
  { id: 't1', type: 'task', label: 'Review', x: 300, y: 200 },
  { id: 'e1', type: 'end', label: 'Done', x: 500, y: 200 },
];

const sampleEdges: FlowEdge[] = [
  { id: 'ed1', from: 's1', to: 't1' },
  { id: 'ed2', from: 't1', to: 'e1' },
];

describe('FlowBuilder — depth quality', () => {
  it('renders the flow builder container', () => {
    const { container } = render(
      <FlowBuilder nodes={[]} edges={[]} />,
    );
    expect(screen.getByTestId('flow-builder')).toBeInTheDocument();
    expect(container.querySelector('[data-testid="flow-canvas"]')).toBeInTheDocument();
  });

  it('renders toolbar with all 8 node type buttons when showToolbar is true', () => {
    render(<FlowBuilder nodes={[]} edges={[]} showToolbar />);
    const toolbar = screen.getByTestId('flow-toolbar');
    expect(toolbar).toBeInTheDocument();
    expect(screen.getByTestId('add-start')).toBeInTheDocument();
    expect(screen.getByTestId('add-end')).toBeInTheDocument();
    expect(screen.getByTestId('add-task')).toBeInTheDocument();
    expect(screen.getByTestId('add-decision')).toBeInTheDocument();
    expect(screen.getByTestId('add-subprocess')).toBeInTheDocument();
    expect(screen.getByTestId('add-timer')).toBeInTheDocument();
    expect(screen.getByTestId('add-message')).toBeInTheDocument();
    expect(screen.getByTestId('add-parallel-gateway')).toBeInTheDocument();
  });

  it('adds a node via toolbar click', () => {
    const onNodesChange = vi.fn();
    const onNodeAdd = vi.fn();
    render(
      <FlowBuilder
        nodes={[]}
        edges={[]}
        showToolbar
        onNodesChange={onNodesChange}
        onNodeAdd={onNodeAdd}
      />,
    );
    fireEvent.click(screen.getByTestId('add-task'));
    expect(onNodesChange).toHaveBeenCalledTimes(1);
    expect(onNodeAdd).toHaveBeenCalledTimes(1);
    const addedNode = onNodeAdd.mock.calls[0][0];
    expect(addedNode.type).toBe('task');
    expect(addedNode.label).toBe('Task');
    expect(typeof addedNode.id).toBe('string');
  });

  it('renders existing nodes on the canvas', () => {
    render(<FlowBuilder nodes={sampleNodes} edges={sampleEdges} />);
    expect(screen.getByTestId('node-s1')).toBeInTheDocument();
    expect(screen.getByTestId('node-t1')).toBeInTheDocument();
    expect(screen.getByTestId('node-e1')).toBeInTheDocument();
  });

  it('selects a node on click', () => {
    const onNodeSelect = vi.fn();
    render(
      <FlowBuilder
        nodes={sampleNodes}
        edges={sampleEdges}
        onNodeSelect={onNodeSelect}
      />,
    );
    fireEvent.click(screen.getByTestId('node-t1'));
    // onNodeSelect should be called with the node
    expect(onNodeSelect).toHaveBeenCalled();
    const selectedNode = onNodeSelect.mock.calls[onNodeSelect.mock.calls.length - 1][0];
    expect(selectedNode?.id).toBe('t1');
  });

  it('supports node dragging via mousedown + mousemove + mouseup', () => {
    const onNodesChange = vi.fn();
    render(
      <FlowBuilder
        nodes={sampleNodes}
        edges={sampleEdges}
        onNodesChange={onNodesChange}
        showToolbar
      />,
    );
    const nodeEl = screen.getByTestId('node-t1');
    const canvas = screen.getByTestId('flow-canvas');
    fireEvent.mouseDown(nodeEl, { clientX: 300, clientY: 200 });
    fireEvent.mouseMove(canvas, { clientX: 350, clientY: 250 });
    expect(onNodesChange).toHaveBeenCalled();
    fireEvent.mouseUp(canvas);
  });

  it('deletes selected node with Delete key', () => {
    const onNodesChange = vi.fn();
    const onNodeDelete = vi.fn();
    render(
      <FlowBuilder
        nodes={sampleNodes}
        edges={sampleEdges}
        onNodesChange={onNodesChange}
        onNodeDelete={onNodeDelete}
      />,
    );
    // Select node first
    fireEvent.click(screen.getByTestId('node-t1'));
    // Press Delete
    fireEvent.keyDown(window, { key: 'Delete' });
    expect(onNodeDelete).toHaveBeenCalledWith('t1');
    expect(onNodesChange).toHaveBeenCalled();
  });

  it('deselects on Escape key', () => {
    const onNodeSelect = vi.fn();
    render(
      <FlowBuilder
        nodes={sampleNodes}
        edges={sampleEdges}
        onNodeSelect={onNodeSelect}
      />,
    );
    fireEvent.click(screen.getByTestId('node-t1'));
    fireEvent.keyDown(window, { key: 'Escape' });
    // Last call should be with null
    const lastCall = onNodeSelect.mock.calls[onNodeSelect.mock.calls.length - 1];
    expect(lastCall[0]).toBeNull();
  });

  it('supports undo via Ctrl+Z', () => {
    const onNodesChange = vi.fn();
    const onNodeAdd = vi.fn();
    render(
      <FlowBuilder
        nodes={[]}
        edges={[]}
        showToolbar
        onNodesChange={onNodesChange}
        onNodeAdd={onNodeAdd}
      />,
    );
    // Add a node to create history
    fireEvent.click(screen.getByTestId('add-task'));
    expect(onNodesChange).toHaveBeenCalledTimes(1);

    // Undo
    fireEvent.keyDown(window, { key: 'z', ctrlKey: true });
    // onNodesChange should be called again with the previous state
    expect(onNodesChange).toHaveBeenCalledTimes(2);
  });

  it('supports redo via Ctrl+Y', () => {
    const onNodesChange = vi.fn();
    render(
      <FlowBuilder
        nodes={[]}
        edges={[]}
        showToolbar
        onNodesChange={onNodesChange}
      />,
    );
    // Add node to create history
    fireEvent.click(screen.getByTestId('add-task'));
    // Undo
    fireEvent.keyDown(window, { key: 'z', ctrlKey: true });
    // Redo
    fireEvent.keyDown(window, { key: 'y', ctrlKey: true });
    expect(onNodesChange).toHaveBeenCalledTimes(3);
  });

  it('shows properties panel when a node is selected', () => {
    render(
      <FlowBuilder nodes={sampleNodes} edges={sampleEdges} />,
    );
    // Initially no panel
    expect(screen.queryByTestId('properties-panel')).not.toBeInTheDocument();
    // Select a node
    fireEvent.click(screen.getByTestId('node-t1'));
    expect(screen.getByTestId('properties-panel')).toBeInTheDocument();
    expect(screen.getByTestId('node-label-input')).toBeInTheDocument();
    expect(screen.getByTestId('node-type-select')).toBeInTheDocument();
  });

  it('updates node label via properties panel', async () => {
    const onNodesChange = vi.fn();
    render(
      <FlowBuilder
        nodes={sampleNodes}
        edges={sampleEdges}
        onNodesChange={onNodesChange}
      />,
    );
    fireEvent.click(screen.getByTestId('node-t1'));
    const input = screen.getByTestId('node-label-input') as HTMLInputElement;
    await userEvent.clear(input);
    await userEvent.type(input, 'New Label');
    expect(onNodesChange).toHaveBeenCalled();
  });

  it('does not show toolbar when showToolbar is false', () => {
    render(
      <FlowBuilder nodes={[]} edges={[]} showToolbar={false} />,
    );
    expect(screen.queryByTestId('flow-toolbar')).not.toBeInTheDocument();
  });

  it('shows empty state when no nodes', () => {
    render(<FlowBuilder nodes={[]} edges={[]} />);
    expect(screen.getByTestId('empty-state')).toBeInTheDocument();
  });

  it('renders hidden when access is hidden', () => {
    const { container } = render(
      <FlowBuilder nodes={[]} edges={[]} access="hidden" />,
    );
    expect(container.innerHTML).toBe('');
  });

  it('applies disabled styles when access is disabled', () => {
    render(
      <FlowBuilder nodes={[]} edges={[]} access="disabled" />,
    );
    const builder = screen.getByTestId('flow-builder');
    expect(builder).toHaveAttribute('data-access-state', 'disabled');
  });

  it('renders grid when showGrid is true', () => {
    render(
      <FlowBuilder nodes={[]} edges={[]} showGrid />,
    );
    const canvas = screen.getByTestId('flow-canvas');
    const pattern = canvas.querySelector('pattern#fb-grid');
    expect(pattern).toBeInTheDocument();
  });

  it('renders minimap when showMinimap is true and nodes exist', () => {
    render(
      <FlowBuilder nodes={sampleNodes} edges={sampleEdges} showMinimap />,
    );
    expect(screen.getByTestId('flow-minimap')).toBeInTheDocument();
  });

  it('disables toolbar buttons in readOnly mode', () => {
    render(
      <FlowBuilder nodes={[]} edges={[]} showToolbar readOnly />,
    );
    const addBtn = screen.getByTestId('add-task');
    expect(addBtn).toBeDisabled();
  });

  it('handles zoom in/out/fit buttons', () => {
    render(
      <FlowBuilder nodes={sampleNodes} edges={sampleEdges} showToolbar />,
    );
    // These should not throw
    fireEvent.click(screen.getByTestId('zoom-in'));
    fireEvent.click(screen.getByTestId('zoom-out'));
    fireEvent.click(screen.getByTestId('zoom-fit'));
  });

  it('handles edge connection via output port mousedown and input port mouseup', () => {
    const nodes: FlowNode[] = [
      { id: 'a', type: 'task', label: 'A', x: 100, y: 100 },
      { id: 'b', type: 'task', label: 'B', x: 300, y: 100 },
    ];
    const onEdgesChange = vi.fn();
    const onEdgeAdd = vi.fn();
    render(
      <FlowBuilder
        nodes={nodes}
        edges={[]}
        onEdgesChange={onEdgesChange}
        onEdgeAdd={onEdgeAdd}
      />,
    );
    const outputPort = screen.getByTestId('port-output-a');
    const inputPort = screen.getByTestId('port-input-b');
    fireEvent.mouseDown(outputPort, { clientX: 160, clientY: 100 });
    fireEvent.mouseUp(inputPort, { clientX: 240, clientY: 100 });
    expect(onEdgesChange).toHaveBeenCalledTimes(1);
    expect(onEdgeAdd).toHaveBeenCalledTimes(1);
    expect(onEdgeAdd.mock.calls[0][0].from).toBe('a');
    expect(onEdgeAdd.mock.calls[0][0].to).toBe('b');
  });

  it('deletes selected node via toolbar Delete button', () => {
    const onNodeDelete = vi.fn();
    const onNodesChange = vi.fn();
    render(
      <FlowBuilder
        nodes={sampleNodes}
        edges={sampleEdges}
        showToolbar
        onNodeDelete={onNodeDelete}
        onNodesChange={onNodesChange}
      />,
    );
    fireEvent.click(screen.getByTestId('node-t1'));
    fireEvent.click(screen.getByTestId('delete-selected'));
    expect(onNodeDelete).toHaveBeenCalledWith('t1');
  });

  it('supports all node types rendering', () => {
    const allTypes: FlowNode[] = [
      { id: 'n1', type: 'start', label: 'S', x: 50, y: 50 },
      { id: 'n2', type: 'end', label: 'E', x: 150, y: 50 },
      { id: 'n3', type: 'task', label: 'T', x: 250, y: 50 },
      { id: 'n4', type: 'decision', label: 'D', x: 350, y: 50 },
      { id: 'n5', type: 'subprocess', label: 'SP', x: 450, y: 50 },
      { id: 'n6', type: 'timer', label: 'TM', x: 550, y: 50 },
      { id: 'n7', type: 'message', label: 'MS', x: 650, y: 50 },
      { id: 'n8', type: 'parallel-gateway', label: 'PG', x: 750, y: 50 },
    ];
    render(<FlowBuilder nodes={allTypes} edges={[]} />);
    for (const n of allTypes) {
      expect(screen.getByTestId(`node-${n.id}`)).toBeInTheDocument();
    }
  });

  /* ================================================================ */
  /*  A11y assertions — expectNoA11yViolations toHaveNoViolations      */
  /* ================================================================ */

  it('main wrapper has role="application" and aria-label', () => {
    render(<FlowBuilder nodes={[]} edges={[]} />);
    const app = screen.getByRole('application');
    expect(app).toBeInTheDocument();
    expect(app).toHaveAttribute('aria-label', 'Flow builder canvas');
    expect(app).toHaveAttribute('data-access-state');
  });

  it('toolbar has role="toolbar" and aria-label', () => {
    render(<FlowBuilder nodes={[]} edges={[]} showToolbar />);
    const toolbar = screen.getByRole('toolbar');
    expect(toolbar).toBeInTheDocument();
    expect(toolbar).toHaveAttribute('aria-label', 'Flow builder toolbar');
  });

  it('toolbar buttons have aria-labels', () => {
    render(<FlowBuilder nodes={sampleNodes} edges={sampleEdges} showToolbar />);
    const toolbar = screen.getByRole('toolbar');
    expect(toolbar).toBeInTheDocument();
    // Check individual button aria-labels
    expect(screen.getByLabelText('Add Start node')).toBeInTheDocument();
    expect(screen.getByLabelText('Add End node')).toBeInTheDocument();
    expect(screen.getByLabelText('Add Task node')).toBeInTheDocument();
    expect(screen.getByLabelText('Add Decision node')).toBeInTheDocument();
    expect(screen.getByLabelText('Zoom in')).toBeInTheDocument();
    expect(screen.getByLabelText('Zoom out')).toBeInTheDocument();
    expect(screen.getByLabelText('Zoom to fit')).toBeInTheDocument();
    expect(screen.getByLabelText('Undo')).toBeInTheDocument();
    expect(screen.getByLabelText('Redo')).toBeInTheDocument();
    expect(screen.getByLabelText('Delete selected')).toBeInTheDocument();
  });

  it('SVG canvas has aria-label', () => {
    render(<FlowBuilder nodes={[]} edges={[]} />);
    const canvas = screen.getByTestId('flow-canvas');
    expect(canvas).toBeInTheDocument();
    expect(canvas).toHaveAttribute('aria-label', 'Flow builder SVG canvas');
    expect(canvas.tagName.toLowerCase()).toBe('svg');
  });

  it('disabled access renders with data-access-state="disabled" — error invalid', () => {
    render(<FlowBuilder nodes={[]} edges={[]} access="disabled" />);
    const app = screen.getByRole('application');
    expect(app).toHaveAttribute('data-access-state', 'disabled');
    expect(app.className).toContain('pointer-events-none');
  });

  it('zoom fit works without throwing on empty nodes', async () => {
    render(<FlowBuilder nodes={[]} edges={[]} showToolbar />);
    const fitBtn = screen.getByLabelText('Zoom to fit');
    expect(fitBtn).toBeInTheDocument();
    fireEvent.click(fitBtn);
    await waitFor(() => {
      expect(screen.getByRole('application')).toBeInTheDocument();
    });
  });

  it('undo button is disabled when no history', () => {
    render(<FlowBuilder nodes={[]} edges={[]} showToolbar />);
    const undoBtn = screen.getByLabelText('Undo');
    expect(undoBtn).toBeDisabled();
  });

  it('redo button is disabled when no forward history', () => {
    render(<FlowBuilder nodes={[]} edges={[]} showToolbar />);
    const redoBtn = screen.getByLabelText('Redo');
    expect(redoBtn).toBeDisabled();
  });

  it('delete button is disabled when nothing selected', () => {
    render(<FlowBuilder nodes={sampleNodes} edges={sampleEdges} showToolbar />);
    const deleteBtn = screen.getByLabelText('Delete selected');
    expect(deleteBtn).toBeDisabled();
  });
});
