/* eslint-disable semantic-theme/no-inline-color-literals */
import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { page } from 'vitest/browser';
import { IconButton } from '../IconButton';
import { LIGHT_BG_HEX } from '../../../__tests__/visual-constants';

const TestIcon = () => (
  <svg viewBox="0 0 16 16"><circle cx="8" cy="8" r="6" /></svg>
);

describe('IconButton Visual Regression', () => {
  it('ghost variant matches screenshot', async () => {
    await render(
      <div style={{ padding: 20, background: LIGHT_BG_HEX }}>
        <IconButton icon={<TestIcon />} label="Ghost" variant="ghost" />
      </div>,
    );
    await expect(page.screenshot()).toMatchImageSnapshot();
  });

  it('primary variant matches screenshot', async () => {
    await render(
      <div style={{ padding: 20, background: LIGHT_BG_HEX }}>
        <IconButton icon={<TestIcon />} label="Primary" variant="primary" />
      </div>,
    );
    await expect(page.screenshot()).toMatchImageSnapshot();
  });
});
