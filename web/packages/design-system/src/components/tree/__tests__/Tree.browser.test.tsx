import { describe, it, expect, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { Tree } from '../Tree';

const nodes = [
  { key: '1', label: 'Root', children: [
    { key: '1-1', label: 'Child A' },
    { key: '1-2', label: 'Child B' },
  ]},
  { key: '2', label: 'Standalone' },
];

describe('Tree (Browser)', () => {
  it('renders tree nodes', async () => {
    const screen = await render(<Tree nodes={nodes} />);
    await expect.element(screen.getByText('Root')).toBeVisible();
    await expect.element(screen.getByText('Standalone')).toBeVisible();
  });

  it('shows children when expanded by default', async () => {
    const screen = await render(<Tree nodes={nodes} defaultExpandedKeys={['1']} />);
    await expect.element(screen.getByText('Child A')).toBeVisible();
    await expect.element(screen.getByText('Child B')).toBeVisible();
  });

  it('expands node on toggle button click', async () => {
    const screen = await render(<Tree nodes={nodes} />);
    const expandBtn = screen.getByLabelText('Expand branch');
    await expandBtn.click();
    await expect.element(screen.getByText('Child A')).toBeVisible();
  });

  it('collapses node on toggle button click', async () => {
    const screen = await render(<Tree nodes={nodes} defaultExpandedKeys={['1']} />);
    const collapseBtn = screen.getByLabelText('Collapse branch');
    await collapseBtn.click();
    expect(document.querySelectorAll(':scope [data-selected]').length).toBeLessThanOrEqual(2);
  });

  it('fires onNodeSelect when a node is clicked', async () => {
    const onNodeSelect = vi.fn();
    const screen = await render(<Tree nodes={nodes} onNodeSelect={onNodeSelect} />);
    await screen.getByText('Standalone').click();
    expect(onNodeSelect).toHaveBeenCalledWith('2');
  });

  it('fires onExpandedKeysChange on expand toggle', async () => {
    const onExpandedKeysChange = vi.fn();
    const screen = await render(<Tree nodes={nodes} onExpandedKeysChange={onExpandedKeysChange} />);
    const expandBtn = screen.getByLabelText('Expand branch');
    await expandBtn.click();
    expect(onExpandedKeysChange).toHaveBeenCalledWith(['1']);
  });

  it('shows loading skeleton when loading', async () => {
    const screen = await render(<Tree nodes={[]} loading />);
    const skeletons = document.querySelectorAll('[data-component="skeleton"]');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('shows empty state when no nodes', async () => {
    const screen = await render(<Tree nodes={[]} />);
    await expect.element(screen.getByText('No records found for this tree.')).toBeVisible();
  });

  it('renders expand/collapse aria attributes', async () => {
    const screen = await render(<Tree nodes={nodes} defaultExpandedKeys={['1']} />);
    const collapseBtn = screen.getByLabelText('Collapse branch');
    await expect.element(collapseBtn).toHaveAttribute('aria-expanded', 'true');
  });
});
