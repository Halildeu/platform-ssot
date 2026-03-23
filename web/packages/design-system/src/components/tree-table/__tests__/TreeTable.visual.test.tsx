/* eslint-disable semantic-theme/no-inline-color-literals */
import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { page } from 'vitest/browser';
import { TreeTable } from '../TreeTable';

const columns = [{ key: 'status', label: 'Status' }];
const nodes = [
  { key: '1', label: 'Parent', data: { status: 'Active' }, children: [
    { key: '1-1', label: 'Child', data: { status: 'Pending' } },
  ]},
];

describe('TreeTable Visual Regression', () => {
  it('expanded state matches screenshot', async () => {
    await render(
      <div style={{ padding: 20, background: '#fff', width: 500 }}>
        <TreeTable nodes={nodes} columns={columns} defaultExpandedKeys={['1']} />
      </div>,
    );
    await expect(page.screenshot()).toMatchImageSnapshot();
  });
});
