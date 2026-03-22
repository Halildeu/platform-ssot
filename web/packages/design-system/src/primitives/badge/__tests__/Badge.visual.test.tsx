import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { Badge } from '../Badge';

describe('Badge Visual Regression', () => {
  it('default variant matches screenshot', async () => {
    const screen = render(
      <div style={{ padding: 20, background: '#fff' }}>
        <Badge>Default</Badge>
      </div>,
    );
    await expect(screen.container).toMatchScreenshot();
  });

  it('success variant matches screenshot', async () => {
    const screen = render(
      <div style={{ padding: 20, background: '#fff' }}>
        <Badge variant="success">Success</Badge>
      </div>,
    );
    await expect(screen.container).toMatchScreenshot();
  });

  it('warning and error variants match screenshot', async () => {
    const screen = render(
      <div style={{ padding: 20, background: '#fff', display: 'flex', gap: 8 }}>
        <Badge variant="warning">Warning</Badge>
        <Badge variant="error">Error</Badge>
      </div>,
    );
    await expect(screen.container).toMatchScreenshot();
  });
});
