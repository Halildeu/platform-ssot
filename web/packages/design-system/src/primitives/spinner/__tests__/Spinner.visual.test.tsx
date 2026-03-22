import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { Spinner } from '../Spinner';

describe('Spinner Visual Regression', () => {
  it('default spinner matches screenshot', async () => {
    const screen = render(
      <div style={{ padding: 20, background: '#fff' }}>
        <Spinner />
      </div>,
    );
    await expect(screen.container).toMatchScreenshot();
  });

  it('different sizes match screenshot', async () => {
    const screen = render(
      <div style={{ padding: 20, background: '#fff', display: 'flex', gap: 12, alignItems: 'center' }}>
        <Spinner size="xs" />
        <Spinner size="sm" />
        <Spinner size="md" />
        <Spinner size="lg" />
        <Spinner size="xl" />
      </div>,
    );
    await expect(screen.container).toMatchScreenshot();
  });

  it('block mode matches screenshot', async () => {
    const screen = render(
      <div style={{ padding: 20, background: '#fff' }}>
        <Spinner mode="block" label="Loading data" />
      </div>,
    );
    await expect(screen.container).toMatchScreenshot();
  });
});
