import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { Switch } from '../Switch';

describe('Switch Visual Regression', () => {
  it('off state matches screenshot', async () => {
    const screen = render(
      <div style={{ padding: 20, background: '#fff' }}>
        <Switch label="Off" />
      </div>,
    );
    await expect(screen.container).toMatchScreenshot();
  });

  it('on state matches screenshot', async () => {
    const screen = render(
      <div style={{ padding: 20, background: '#fff' }}>
        <Switch label="On" defaultChecked />
      </div>,
    );
    await expect(screen.container).toMatchScreenshot();
  });

  it('disabled state matches screenshot', async () => {
    const screen = render(
      <div style={{ padding: 20, background: '#fff' }}>
        <Switch label="Disabled" disabled />
      </div>,
    );
    await expect(screen.container).toMatchScreenshot();
  });
});
