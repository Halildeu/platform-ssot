import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { List } from '../List';

const items = [
  { key: '1', title: 'Item One', description: 'First item' },
  { key: '2', title: 'Item Two', description: 'Second item' },
];

describe('List Visual Regression', () => {
  it('default list matches screenshot', async () => {
    const screen = render(
      <div style={{ padding: 20, background: '#fff', width: 400 }}>
        <List items={items} title="Records" />
      </div>,
    );
    await expect(screen.container).toMatchScreenshot();
  });
});
