/* eslint-disable semantic-theme/no-inline-color-literals */
import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { page } from 'vitest/browser';
import { Tree } from '../Tree';
import { LIGHT_BG_HEX } from '../../../__tests__/visual-constants';

const nodes = [
  { key: '1', label: 'Root Node', children: [
    { key: '1-1', label: 'Child One' },
  ]},
  { key: '2', label: 'Standalone' },
];

describe('Tree Visual Regression', () => {
  it('collapsed state matches screenshot', async () => {
    await render(
      <div style={{ padding: 20, background: LIGHT_BG_HEX, width: 400 }}>
        <Tree nodes={nodes} />
      </div>,
    );
    await expect(page.screenshot()).toMatchImageSnapshot();
  });

  it('expanded state matches screenshot', async () => {
    await render(
      <div style={{ padding: 20, background: LIGHT_BG_HEX, width: 400 }}>
        <Tree nodes={nodes} defaultExpandedKeys={['1']} />
      </div>,
    );
    await expect(page.screenshot()).toMatchImageSnapshot();
  });
});
