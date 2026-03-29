 
import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { page } from 'vitest/browser';
import { Switch } from '../Switch';
import { LIGHT_BG_HEX, DARK_BG_HEX } from '../../../__tests__/visual-constants';

describe('Switch Visual Regression', () => {
  /* ---- 1. Default (off) state ---- */
  it('off state matches screenshot', async () => {
    await render(
      <div style={{ padding: 20, background: LIGHT_BG_HEX }}>
        <Switch label="Off" />
      </div>,
    );
    await expect(page.screenshot()).toMatchImageSnapshot();
  });

  /* ---- 2. On state ---- */
  it('on state matches screenshot', async () => {
    await render(
      <div style={{ padding: 20, background: LIGHT_BG_HEX }}>
        <Switch label="On" defaultChecked />
      </div>,
    );
    await expect(page.screenshot()).toMatchImageSnapshot();
  });

  /* ---- 3. All sizes ---- */
  it('all sizes match screenshot', async () => {
    await render(
      <div style={{ padding: 20, background: LIGHT_BG_HEX, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <Switch label="Small" size="sm" defaultChecked />
        <Switch label="Medium" size="md" defaultChecked />
        <Switch label="Large" size="lg" defaultChecked />
      </div>,
    );
    await expect(page.screenshot()).toMatchImageSnapshot();
  });

  /* ---- 4. Disabled ---- */
  it('disabled states match screenshot', async () => {
    await render(
      <div style={{ padding: 20, background: LIGHT_BG_HEX, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <Switch label="Disabled off" disabled />
        <Switch label="Disabled on" disabled defaultChecked />
      </div>,
    );
    await expect(page.screenshot()).toMatchImageSnapshot();
  });

  /* ---- 5. Destructive variant ---- */
  it('destructive variant matches screenshot', async () => {
    await render(
      <div style={{ padding: 20, background: LIGHT_BG_HEX, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <Switch label="Destructive off" variant="destructive" />
        <Switch label="Destructive on" variant="destructive" defaultChecked />
      </div>,
    );
    await expect(page.screenshot()).toMatchImageSnapshot();
  });

  /* ---- 6. Dark mode ---- */
  it('dark theme matches screenshot', async () => {
    await render(
      <div data-theme="dark" style={{ padding: 20, background: DARK_BG_HEX, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <Switch label="Off" />
        <Switch label="On" defaultChecked />
      </div>,
    );
    await expect(page.screenshot()).toMatchImageSnapshot();
  });
});
