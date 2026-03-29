 
import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { page } from 'vitest/browser';
import { Mentions } from '../Mentions';
import { LIGHT_BG_HEX } from '../../../__tests__/visual-constants';

const options = [
  { key: 'alice', label: 'Alice' },
  { key: 'bob', label: 'Bob' },
];

describe('Mentions Visual Regression', () => {
  it('default state matches screenshot', async () => {
    await render(
      <div style={{ padding: 20, background: LIGHT_BG_HEX, width: 400 }}>
        <Mentions options={options} label="Comment" />
      </div>,
    );
    await expect(page.screenshot()).toMatchImageSnapshot();
  });
});
