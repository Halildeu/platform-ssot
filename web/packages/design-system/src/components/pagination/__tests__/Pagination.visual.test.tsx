/* eslint-disable semantic-theme/no-inline-color-literals */
import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { page } from 'vitest/browser';
import { Pagination } from '../Pagination';
import { LIGHT_BG_HEX } from '../../../__tests__/visual-constants';

describe('Pagination Visual Regression', () => {
  it('default state matches screenshot', async () => {
    await render(
      <div style={{ padding: 20, background: LIGHT_BG_HEX }}>
        <Pagination total={100} current={3} pageSize={10} />
      </div>,
    );
    await expect(page.screenshot()).toMatchImageSnapshot();
  });
});
