import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { Button } from '../Button';

describe('Button Visual Regression', () => {
  it('primary button matches screenshot', async () => {
    const screen = render(
      <div style={{ padding: 20, background: '#fff' }}>
        <Button variant="primary">Primary Button</Button>
      </div>
    );
    await expect(screen.container).toMatchScreenshot();
  });

  it('secondary button matches screenshot', async () => {
    const screen = render(
      <div style={{ padding: 20, background: '#fff' }}>
        <Button variant="secondary">Secondary</Button>
      </div>
    );
    await expect(screen.container).toMatchScreenshot();
  });

  it('disabled button matches screenshot', async () => {
    const screen = render(
      <div style={{ padding: 20, background: '#fff' }}>
        <Button disabled>Disabled</Button>
      </div>
    );
    await expect(screen.container).toMatchScreenshot();
  });
});
