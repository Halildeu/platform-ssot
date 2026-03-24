/* eslint-disable semantic-theme/no-inline-color-literals */
import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { page } from 'vitest/browser';
import { Cascader } from '../Cascader';
import { LIGHT_BG_HEX } from '../../../__tests__/visual-constants';

const options = [
  { value: 'asia', label: 'Asia', children: [{ value: 'china', label: 'China' }] },
  { value: 'europe', label: 'Europe', children: [{ value: 'germany', label: 'Germany' }] },
];

describe('Cascader Visual Regression', () => {
  it('closed state matches screenshot', async () => {
    await render(
      <div style={{ padding: 20, background: LIGHT_BG_HEX, width: 300 }}>
        <Cascader options={options} placeholder="Select..." />
      </div>,
    );
    await expect(page.screenshot()).toMatchImageSnapshot();
  });
});
