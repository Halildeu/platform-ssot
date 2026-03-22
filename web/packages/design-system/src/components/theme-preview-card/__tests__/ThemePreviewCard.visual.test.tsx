import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { page } from 'vitest/browser';
import { ThemePreviewCard } from '../ThemePreviewCard';

describe('ThemePreviewCard Visual Regression', () => {
  it('default card matches screenshot', async () => {
    const screen = await render(
      <div style={{ padding: 20, background: '#fff', width: 200 }}>
        <ThemePreviewCard />
      </div>,
    );
    await expect(page.screenshot()).toMatchImageSnapshot();
  });

  it('selected card matches screenshot', async () => {
    const screen = await render(
      <div style={{ padding: 20, background: '#fff', width: 200 }}>
        <ThemePreviewCard selected />
      </div>,
    );
    await expect(page.screenshot()).toMatchImageSnapshot();
  });
});
