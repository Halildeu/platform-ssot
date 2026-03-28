/* eslint-disable semantic-theme/no-inline-color-literals */
import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { page } from 'vitest/browser';
import { ThemePreviewCard } from '../ThemePreviewCard';
import { LIGHT_BG_HEX } from '../../../__tests__/visual-constants';

describe('ThemePreviewCard Visual Regression', () => {
  it('default card matches screenshot', async () => {
    await render(
      <div style={{ padding: 20, background: LIGHT_BG_HEX, width: 200 }}>
        <ThemePreviewCard />
      </div>,
    );
    await expect(page.screenshot()).toMatchImageSnapshot();
  });

  it('selected card matches screenshot', async () => {
    await render(
      <div style={{ padding: 20, background: LIGHT_BG_HEX, width: 200 }}>
        <ThemePreviewCard selected />
      </div>,
    );
    await expect(page.screenshot()).toMatchImageSnapshot();
  });
});
