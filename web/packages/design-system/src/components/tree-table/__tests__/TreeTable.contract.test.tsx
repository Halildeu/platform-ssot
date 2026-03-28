// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TreeTable, type TreeTableNode, type TreeTableColumn } from '../TreeTable';
import { expectNoA11yViolations } from '../../../__tests__/a11y-utils';

afterEach(() => cleanup());

type RowData = { status: string; count: number };

const makeNodes = (): TreeTableNode<RowData>[] => [
  {
    key: 'root',
    label: 'Root Node',
    data: { status: 'active', count: 10 },
    children: [
      { key: 'child1', label: 'Child One', data: { status: 'pending', count: 5 } },
      { key: 'child2', label: 'Child Two', data: { status: 'done', count: 3 } },
    ],
  },
];

const makeColumns = (): TreeTableColumn<RowData>[] => [
  { key: 'status', label: 'Status', accessor: 'status' },
  { key: 'count', label: 'Count', accessor: 'count' },
];

describe('TreeTable contract', () => {
  it('has displayName', () => {
    expect(TreeTable.displayName).toBe('TreeTable');
  });

  it('renders with required props', () => {
    const { container } = render(<TreeTable nodes={makeNodes()} columns={makeColumns()} />);
    expect(container.querySelector('[data-component="tree-table"]')).toBeInTheDocument();
  });

  it('renders table headers', () => {
    render(<TreeTable nodes={makeNodes()} columns={makeColumns()} />);
    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.getByText('Count')).toBeInTheDocument();
  });

  it('renders node labels', () => {
    render(<TreeTable nodes={makeNodes()} columns={makeColumns()} />);
    expect(screen.getByText('Root Node')).toBeInTheDocument();
  });

  it('renders title and description', () => {
    render(<TreeTable nodes={makeNodes()} columns={makeColumns()} title="My Tree" description="A tree table" />);
    expect(screen.getByText('My Tree')).toBeInTheDocument();
    expect(screen.getByText('A tree table')).toBeInTheDocument();
  });

  it('renders empty state when no nodes', () => {
    const { container } = render(<TreeTable nodes={[]} columns={makeColumns()} />);
    expect(container.querySelector('[data-component="tree-table"]')).toBeInTheDocument();
  });

  it('expands children when node is toggled', async () => {
    const user = userEvent.setup();
    render(<TreeTable nodes={makeNodes()} columns={makeColumns()} />);
    const expandButton = screen.getByRole('button', { name: 'Expand branch' });
    await user.click(expandButton);
    expect(screen.getByText('Child One')).toBeInTheDocument();
    expect(screen.getByText('Child Two')).toBeInTheDocument();
  });

  it('sets data-access-state attribute', () => {
    const { container } = render(<TreeTable nodes={makeNodes()} columns={makeColumns()} access="disabled" />);
    expect(container.querySelector('[data-access-state="disabled"]')).toBeInTheDocument();
  });

  it('returns null when access is hidden', () => {
    const { container } = render(<TreeTable nodes={makeNodes()} columns={makeColumns()} access="hidden" />);
    expect(container.querySelector('[data-component="tree-table"]')).not.toBeInTheDocument();
  });
});

describe('TreeTable — accessibility', () => {
  it('has no axe-core a11y violations', async () => {
    const { container } = render(<TreeTable nodes={makeNodes()} columns={makeColumns()} />);
    await expectNoA11yViolations(container);
  });
});
