import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { TreeTable } from '../TreeTable';

const columns = [{ key: 'status', label: 'Status' }];

const nodes = [
  { key: '1', label: 'Parent', data: { status: 'Active' }, children: [
    { key: '1-1', label: 'Child', data: { status: 'Pending' } },
  ]},
];

describe('TreeTable (Browser)', () => {
  it('renders table with tree column and data columns', async () => {
    const screen = render(<TreeTable nodes={nodes} columns={columns} />);
    await expect.element(screen.getByText('Parent')).toBeVisible();
    await expect.element(screen.getByText('Status')).toBeVisible();
  });

  it('shows children when expanded', async () => {
    const screen = render(<TreeTable nodes={nodes} columns={columns} defaultExpandedKeys={['1']} />);
    await expect.element(screen.getByText('Child')).toBeVisible();
  });
});
