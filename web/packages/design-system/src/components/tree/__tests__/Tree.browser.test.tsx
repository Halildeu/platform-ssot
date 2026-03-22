import { describe, it, expect } from 'vitest';
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
    const screen = render(<Tree nodes={nodes} />);
    await expect.element(screen.getByText('Root')).toBeVisible();
    await expect.element(screen.getByText('Standalone')).toBeVisible();
  });

  it('expands node to show children', async () => {
    const screen = render(<Tree nodes={nodes} defaultExpandedKeys={['1']} />);
    await expect.element(screen.getByText('Child A')).toBeVisible();
    await expect.element(screen.getByText('Child B')).toBeVisible();
  });
});
