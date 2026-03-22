import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { page } from 'vitest/browser';
import { AvatarGroup } from '../AvatarGroup';

const items = [
  { key: '1', name: 'Alice' },
  { key: '2', name: 'Bob' },
  { key: '3', name: 'Charlie' },
];

describe('AvatarGroup Visual Regression', () => {
  it('default group matches screenshot', async () => {
    const screen = await render(
      <div style={{ padding: 20, background: '#fff' }}>
        <AvatarGroup items={items} />
      </div>,
    );
    await expect(page.screenshot()).toMatchImageSnapshot();
  });

  it('with overflow matches screenshot', async () => {
    const screen = await render(
      <div style={{ padding: 20, background: '#fff' }}>
        <AvatarGroup items={[...items, { key: '4', name: 'Diana' }, { key: '5', name: 'Eve' }]} max={3} />
      </div>,
    );
    await expect(page.screenshot()).toMatchImageSnapshot();
  });
});
