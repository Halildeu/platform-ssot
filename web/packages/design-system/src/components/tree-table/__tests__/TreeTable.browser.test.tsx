import { describe, it, expect, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { TreeTable } from '../TreeTable';

const columns = [{ key: 'status', label: 'Status' }];

const nodes = [
  { key: '1', label: 'Parent', data: { status: 'Active' }, children: [
    { key: '1-1', label: 'Child', data: { status: 'Pending' } },
  ]},
  { key: '2', label: 'Standalone', data: { status: 'Done' } },
];

describe('TreeTable (Browser)', () => {
  it('renders table with tree column and data columns', async () => {
    const screen = await render(<TreeTable nodes={nodes} columns={columns} />);
    await expect.element(screen.getByText('Parent')).toBeVisible();
    await expect.element(screen.getByText('Status')).toBeVisible();
  });

  it('shows children when expanded by default', async () => {
    const screen = await render(<TreeTable nodes={nodes} columns={columns} defaultExpandedKeys={['1']} />);
    await expect.element(screen.getByText('Child')).toBeVisible();
    await expect.element(screen.getByText('Pending')).toBeVisible();
  });

  it('expands row on toggle button click', async () => {
    const screen = await render(<TreeTable nodes={nodes} columns={columns} />);
    const expandBtn = screen.getByLabelText('Expand branch');
    await expandBtn.click();
    await expect.element(screen.getByText('Child')).toBeVisible();
  });

  it('collapses row on toggle button click', async () => {
    const screen = await render(<TreeTable nodes={nodes} columns={columns} defaultExpandedKeys={['1']} />);
    const collapseBtn = screen.getByLabelText('Collapse branch');
    await collapseBtn.click();
    expect(document.body.textContent).not.toContain('Pending');
  });

  it('fires onNodeSelect when clicking a row', async () => {
    const onNodeSelect = vi.fn();
    const screen = await render(<TreeTable nodes={nodes} columns={columns} onNodeSelect={onNodeSelect} />);
    await screen.getByText('Standalone').click();
    expect(onNodeSelect).toHaveBeenCalledWith('2');
  });

  it('fires onExpandedKeysChange when toggling', async () => {
    const onExpandedKeysChange = vi.fn();
    const screen = await render(
      <TreeTable nodes={nodes} columns={columns} onExpandedKeysChange={onExpandedKeysChange} />,
    );
    await screen.getByLabelText('Expand branch').click();
    expect(onExpandedKeysChange).toHaveBeenCalledWith(['1']);
  });

  it('renders column data values', async () => {
    const screen = await render(<TreeTable nodes={nodes} columns={columns} />);
    await expect.element(screen.getByText('Active')).toBeVisible();
    await expect.element(screen.getByText('Done')).toBeVisible();
  });

  it('shows empty state when no nodes', async () => {
    const screen = await render(<TreeTable nodes={[]} columns={columns} />);
    const empty = document.querySelector('[data-component="empty-state"]');
    expect(empty).not.toBeNull();
  });

  it('renders expand/collapse aria attributes', async () => {
    const screen = await render(<TreeTable nodes={nodes} columns={columns} defaultExpandedKeys={['1']} />);
    const collapseBtn = screen.getByLabelText('Collapse branch');
    await expect.element(collapseBtn).toHaveAttribute('aria-expanded', 'true');
  });
});
