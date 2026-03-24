/* eslint-disable semantic-theme/no-inline-color-literals */
import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { page } from 'vitest/browser';
import { List } from '../List';
import { LIGHT_BG_HEX } from '../../../__tests__/visual-constants';

const items = [
  { key: '1', title: 'Item One', description: 'First item' },
  { key: '2', title: 'Item Two', description: 'Second item' },
];

describe('List Visual Regression', () => {
  it('default list matches screenshot', async () => {
    await render(
      <div style={{ padding: 20, background: LIGHT_BG_HEX, width: 400 }}>
        <List items={items} title="Records" />
      </div>,
    );
    await expect(page.screenshot()).toMatchImageSnapshot();
  });
});
