import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { Input } from '../Input';

describe('Input Visual Regression', () => {
  it('default state matches screenshot', async () => {
    const screen = render(
      <div style={{ padding: 20, background: '#fff' }}>
        <Input placeholder="Enter text" label="Name" />
      </div>,
    );
    await expect(screen.container).toMatchScreenshot();
  });

  it('error state matches screenshot', async () => {
    const screen = render(
      <div style={{ padding: 20, background: '#fff' }}>
        <Input label="Email" error="Invalid email" defaultValue="bad@" />
      </div>,
    );
    await expect(screen.container).toMatchScreenshot();
  });

  it('disabled state matches screenshot', async () => {
    const screen = render(
      <div style={{ padding: 20, background: '#fff' }}>
        <Input label="Disabled" disabled defaultValue="Cannot edit" />
      </div>,
    );
    await expect(screen.container).toMatchScreenshot();
  });
});
