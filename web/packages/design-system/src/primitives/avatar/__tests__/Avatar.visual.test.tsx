import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { Avatar } from '../Avatar';

describe('Avatar Visual Regression', () => {
  it('initials avatar matches screenshot', async () => {
    const screen = render(
      <div style={{ padding: 20, background: '#fff' }}>
        <Avatar initials="JD" size="lg" />
      </div>,
    );
    await expect(screen.container).toMatchScreenshot();
  });

  it('fallback icon avatar matches screenshot', async () => {
    const screen = render(
      <div style={{ padding: 20, background: '#fff' }}>
        <Avatar size="lg" />
      </div>,
    );
    await expect(screen.container).toMatchScreenshot();
  });

  it('different sizes match screenshot', async () => {
    const screen = render(
      <div style={{ padding: 20, background: '#fff', display: 'flex', gap: 8, alignItems: 'center' }}>
        <Avatar initials="XS" size="xs" />
        <Avatar initials="SM" size="sm" />
        <Avatar initials="MD" size="md" />
        <Avatar initials="LG" size="lg" />
      </div>,
    );
    await expect(screen.container).toMatchScreenshot();
  });
});
