 
import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { page } from 'vitest/browser';
import { AvatarGroup } from '../AvatarGroup';
import { LIGHT_BG_HEX } from '../../../__tests__/visual-constants';

const items = [
  { key: '1', name: 'Alice' },
  { key: '2', name: 'Bob' },
  { key: '3', name: 'Charlie' },
];

describe('AvatarGroup Visual Regression', () => {
  it('default group matches screenshot', async () => {
    await render(
      <div style={{ padding: 20, background: LIGHT_BG_HEX }}>
        <AvatarGroup items={items} />
      </div>,
    );
    await expect(page.screenshot()).toMatchImageSnapshot();
  });

  it('with overflow matches screenshot', async () => {
    await render(
      <div style={{ padding: 20, background: LIGHT_BG_HEX }}>
        <AvatarGroup items={[...items, { key: '4', name: 'Diana' }, { key: '5', name: 'Eve' }]} max={3} />
      </div>,
    );
    await expect(page.screenshot()).toMatchImageSnapshot();
  });
});
