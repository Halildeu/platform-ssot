 
import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { page } from 'vitest/browser';
import { Avatar } from '../Avatar';
import { LIGHT_BG_HEX } from '../../../__tests__/visual-constants';

describe('Avatar Visual Regression', () => {
  it('initials avatar matches screenshot', async () => {
    await render(
      <div style={{ padding: 20, background: LIGHT_BG_HEX }}>
        <Avatar initials="JD" size="lg" />
      </div>,
    );
    await expect(page.screenshot()).toMatchImageSnapshot();
  });

  it('fallback icon avatar matches screenshot', async () => {
    await render(
      <div style={{ padding: 20, background: LIGHT_BG_HEX }}>
        <Avatar size="lg" />
      </div>,
    );
    await expect(page.screenshot()).toMatchImageSnapshot();
  });

  it('different sizes match screenshot', async () => {
    await render(
      <div style={{ padding: 20, background: LIGHT_BG_HEX, display: 'flex', gap: 8, alignItems: 'center' }}>
        <Avatar initials="XS" size="xs" />
        <Avatar initials="SM" size="sm" />
        <Avatar initials="MD" size="md" />
        <Avatar initials="LG" size="lg" />
      </div>,
    );
    await expect(page.screenshot()).toMatchImageSnapshot();
  });
});
