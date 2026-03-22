import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { Alert } from '../Alert';

describe('Alert Visual Regression', () => {
  it('info variant matches screenshot', async () => {
    const screen = render(
      <div style={{ padding: 20, background: '#fff' }}>
        <Alert variant="info" title="Info">
          Informational message.
        </Alert>
      </div>,
    );
    await expect(screen.container).toMatchScreenshot();
  });

  it('success variant matches screenshot', async () => {
    const screen = render(
      <div style={{ padding: 20, background: '#fff' }}>
        <Alert variant="success" title="Success">
          Operation completed.
        </Alert>
      </div>,
    );
    await expect(screen.container).toMatchScreenshot();
  });

  it('error variant matches screenshot', async () => {
    const screen = render(
      <div style={{ padding: 20, background: '#fff' }}>
        <Alert variant="error" title="Error">
          Something went wrong.
        </Alert>
      </div>,
    );
    await expect(screen.container).toMatchScreenshot();
  });
});
