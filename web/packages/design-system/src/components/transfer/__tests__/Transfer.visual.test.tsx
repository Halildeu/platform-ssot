import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { page } from 'vitest/browser';
import { Transfer } from '../Transfer';

const data = [
  { key: 'a', label: 'Item A' },
  { key: 'b', label: 'Item B' },
  { key: 'c', label: 'Item C' },
];

describe('Transfer Visual Regression', () => {
  it('default layout matches screenshot', async () => {
    const screen = await render(
      <div style={{ padding: 20, background: '#fff', width: 600 }}>
        <Transfer dataSource={data} />
      </div>,
    );
    await expect(page.screenshot()).toMatchImageSnapshot();
  });
});
