import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { page } from 'vitest/browser';
import { Mentions } from '../Mentions';

const options = [
  { key: 'alice', label: 'Alice' },
  { key: 'bob', label: 'Bob' },
];

describe('Mentions Visual Regression', () => {
  it('default state matches screenshot', async () => {
    const screen = await render(
      <div style={{ padding: 20, background: '#fff', width: 400 }}>
        <Mentions options={options} label="Comment" />
      </div>,
    );
    await expect(page.screenshot()).toMatchImageSnapshot();
  });
});
