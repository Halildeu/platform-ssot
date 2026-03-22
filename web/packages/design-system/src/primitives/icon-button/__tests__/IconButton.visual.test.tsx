import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { IconButton } from '../IconButton';

const TestIcon = () => (
  <svg viewBox="0 0 16 16"><circle cx="8" cy="8" r="6" /></svg>
);

describe('IconButton Visual Regression', () => {
  it('ghost variant matches screenshot', async () => {
    const screen = render(
      <div style={{ padding: 20, background: '#fff' }}>
        <IconButton icon={<TestIcon />} label="Ghost" variant="ghost" />
      </div>,
    );
    await expect(screen.container).toMatchScreenshot();
  });

  it('primary variant matches screenshot', async () => {
    const screen = render(
      <div style={{ padding: 20, background: '#fff' }}>
        <IconButton icon={<TestIcon />} label="Primary" variant="primary" />
      </div>,
    );
    await expect(screen.container).toMatchScreenshot();
  });
});
