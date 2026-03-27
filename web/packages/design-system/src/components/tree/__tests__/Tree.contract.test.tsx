// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Tree, type TreeNode } from '../Tree';
import { expectNoA11yViolations } from '../../../__tests__/a11y-utils';

afterEach(() => cleanup());

const makeNodes = (): TreeNode[] => [
  {
    key: 'node-1',
    label: 'Root Node',
    children: [
      { key: 'node-1-1', label: 'Child A' },
      { key: 'node-1-2', label: 'Child B' },
    ],
  },
  { key: 'node-2', label: 'Leaf Node' },
];

describe('Tree contract', () => {
  /* ---- Identity ---- */
  it('has displayName', () => {
    expect(Tree.displayName).toBe('Tree');
  });

  /* ---- Renders without crashing ---- */
  it('renders without crashing', () => {
    const { container } = render(<Tree nodes={makeNodes()} />);
    expect(container.querySelector('[data-component="tree"]')).toBeInTheDocument();
  });

  /* ---- data-component attribute ---- */
  it('has data-component="tree"', () => {
    const { container } = render(<Tree nodes={makeNodes()} />);
    expect(container.querySelector('[data-component="tree"]')).toBeInTheDocument();
  });

  /* ---- Renders node labels ---- */
  it('renders all root node labels', () => {
    render(<Tree nodes={makeNodes()} />);
    expect(screen.getByText('Root Node')).toBeInTheDocument();
    expect(screen.getByText('Leaf Node')).toBeInTheDocument();
  });

  /* ---- Expand/collapse ---- */
  it('expands children on toggle click', async () => {
    const user = userEvent.setup();
    render(<Tree nodes={makeNodes()} />);
    const expandBtn = screen.getByRole('button', { name: 'Expand branch' });
    await user.click(expandBtn);
    expect(screen.getByText('Child A')).toBeInTheDocument();
    expect(screen.getByText('Child B')).toBeInTheDocument();
  });

  /* ---- Empty state ---- */
  it('renders empty state when no nodes', () => {
    render(<Tree nodes={[]} />);
    expect(screen.getByText('No records found for this tree.')).toBeInTheDocument();
  });

  /* ---- Loading state ---- */
  it('renders loading state', () => {
    render(<Tree nodes={[]} loading />);
    expect(screen.getByTestId('tree-loading-state')).toBeInTheDocument();
  });

  /* ---- Access control: hidden ---- */
  it('returns null when access=hidden', () => {
    const { container } = render(
      <Tree nodes={makeNodes()} access="hidden" />,
    );
    expect(container.firstElementChild).toBeNull();
  });

  /* ---- Title and description ---- */
  it('renders title and description', () => {
    render(
      <Tree nodes={makeNodes()} title="File Tree" description="Browse files" />,
    );
    expect(screen.getByText('File Tree')).toBeInTheDocument();
    expect(screen.getByText('Browse files')).toBeInTheDocument();
  });
});

describe('Tree — accessibility', () => {
  it('has no axe-core a11y violations', async () => {
    const { container } = render(<Tree nodes={makeNodes()} />);
    await expectNoA11yViolations(container);
  });
});
