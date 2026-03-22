import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { Dialog } from '../Dialog';

describe('Dialog Visual Regression', () => {
  it('open dialog with title matches screenshot', async () => {
    const screen = render(
      <div style={{ padding: 20, background: '#fff', minHeight: 300 }}>
        <Dialog open title="Confirm Action" footer={<button>Confirm</button>} onClose={() => {}}>
          <p>Are you sure you want to proceed?</p>
        </Dialog>
      </div>,
    );
    await expect(screen.container).toMatchScreenshot();
  });

  it('small dialog matches screenshot', async () => {
    const screen = render(
      <div style={{ padding: 20, background: '#fff', minHeight: 300 }}>
        <Dialog open title="Small Dialog" size="sm" onClose={() => {}}>
          <p>Compact content</p>
        </Dialog>
      </div>,
    );
    await expect(screen.container).toMatchScreenshot();
  });
});
