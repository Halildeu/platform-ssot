/* eslint-disable semantic-theme/no-inline-color-literals */
import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { page } from 'vitest/browser';
import { EmptyErrorLoading } from '../EmptyErrorLoading';
import { LIGHT_BG_HEX } from '../../../__tests__/visual-constants';

describe('EmptyErrorLoading Visual Regression', () => {
  it('empty mode matches screenshot', async () => {
    await render(
      <div style={{ padding: 20, background: LIGHT_BG_HEX, width: 400 }}>
        <EmptyErrorLoading mode="empty" />
      </div>,
    );
    await expect(page.screenshot()).toMatchImageSnapshot();
  });
});
