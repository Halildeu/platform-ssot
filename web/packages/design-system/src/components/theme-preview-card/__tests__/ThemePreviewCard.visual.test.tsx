import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { ThemePreviewCard } from '../ThemePreviewCard';

describe('ThemePreviewCard Visual Regression', () => {
  it('default card matches screenshot', async () => {
    const screen = render(
      <div style={{ padding: 20, background: '#fff', width: 200 }}>
        <ThemePreviewCard />
      </div>,
    );
    await expect(screen.container).toMatchScreenshot();
  });

  it('selected card matches screenshot', async () => {
    const screen = render(
      <div style={{ padding: 20, background: '#fff', width: 200 }}>
        <ThemePreviewCard selected />
      </div>,
    );
    await expect(screen.container).toMatchScreenshot();
  });
});
