/* eslint-disable semantic-theme/no-inline-color-literals */
import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { page } from 'vitest/browser';
import { Transfer } from '../Transfer';
import { LIGHT_BG_HEX } from '../../../__tests__/visual-constants';

const data = [
  { key: 'a', label: 'Item A' },
  { key: 'b', label: 'Item B' },
  { key: 'c', label: 'Item C' },
];

describe('Transfer Visual Regression', () => {
  it('default layout matches screenshot', async () => {
    await render(
      <div style={{ padding: 20, background: LIGHT_BG_HEX, width: 600 }}>
        <Transfer dataSource={data} />
      </div>,
    );
    await expect(page.screenshot()).toMatchImageSnapshot();
  });
});
