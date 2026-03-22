import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { Checkbox } from '../Checkbox';

describe('Checkbox Visual Regression', () => {
  it('unchecked state matches screenshot', async () => {
    const screen = render(
      <div style={{ padding: 20, background: '#fff' }}>
        <Checkbox label="Unchecked" />
      </div>,
    );
    await expect(screen.container).toMatchScreenshot();
  });

  it('checked state matches screenshot', async () => {
    const screen = render(
      <div style={{ padding: 20, background: '#fff' }}>
        <Checkbox label="Checked" defaultChecked />
      </div>,
    );
    await expect(screen.container).toMatchScreenshot();
  });

  it('disabled state matches screenshot', async () => {
    const screen = render(
      <div style={{ padding: 20, background: '#fff' }}>
        <Checkbox label="Disabled" disabled />
      </div>,
    );
    await expect(screen.container).toMatchScreenshot();
  });
});
