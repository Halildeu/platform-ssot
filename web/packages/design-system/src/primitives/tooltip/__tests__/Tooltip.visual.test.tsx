import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { page } from 'vitest/browser';
import { Tooltip } from '../Tooltip';

describe('Tooltip Visual Regression', () => {
  /* ---- 1. Default (top placement) ---- */
  it('top placement visible tooltip matches screenshot', async () => {
    render(
      <div style={{ padding: 80, background: '#fff', display: 'flex', justifyContent: 'center' }}>
        <Tooltip content="Helpful tip" delay={0} placement="top">
          <button>Hover target</button>
        </Tooltip>
      </div>,
    );
    await screen.getByText('Hover target').hover();
    await expect.element(screen.getByRole('tooltip')).toBeVisible();
    await expect(page.screenshot()).toMatchImageSnapshot();
  });

  /* ---- 2. Bottom placement ---- */
  it('bottom placement tooltip matches screenshot', async () => {
    render(
      <div style={{ padding: 80, background: '#fff', display: 'flex', justifyContent: 'center' }}>
        <Tooltip content="Bottom tip" delay={0} placement="bottom">
          <button>Hover below</button>
        </Tooltip>
      </div>,
    );
    await screen.getByText('Hover below').hover();
    await expect.element(screen.getByRole('tooltip')).toBeVisible();
    await expect(page.screenshot()).toMatchImageSnapshot();
  });

  /* ---- 3. With arrow ---- */
  it('tooltip with arrow matches screenshot', async () => {
    render(
      <div style={{ padding: 80, background: '#fff', display: 'flex', justifyContent: 'center' }}>
        <Tooltip content="Arrow tip" delay={0} showArrow>
          <button>Hover me</button>
        </Tooltip>
      </div>,
    );
    await screen.getByText('Hover me').hover();
    await expect.element(screen.getByRole('tooltip')).toBeVisible();
    await expect(page.screenshot()).toMatchImageSnapshot();
  });

  /* ---- 4. Dark mode ---- */
  it('dark theme tooltip matches screenshot', async () => {
    render(
      <div data-theme="dark" style={{ padding: 80, background: '#1a1a2e', display: 'flex', justifyContent: 'center' }}>
        <Tooltip content="Dark tooltip" delay={0}>
          <button>Hover dark</button>
        </Tooltip>
      </div>,
    );
    await screen.getByText('Hover dark').hover();
    await expect.element(screen.getByRole('tooltip')).toBeVisible();
    await expect(page.screenshot()).toMatchImageSnapshot();
  });
});
