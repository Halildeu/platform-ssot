import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { Modal } from '../Modal';

describe('Modal Visual Regression', () => {
  it('open modal matches screenshot', async () => {
    const screen = render(
      <div style={{ padding: 20, background: '#fff', minHeight: 300 }}>
        <Modal
          open
          title="Confirm Action"
          footer={<button>Confirm</button>}
          disablePortal
        >
          <p>Are you sure you want to proceed?</p>
        </Modal>
      </div>,
    );
    await expect(screen.container).toMatchScreenshot();
  });

  it('small size modal matches screenshot', async () => {
    const screen = render(
      <div style={{ padding: 20, background: '#fff', minHeight: 300 }}>
        <Modal open title="Small Modal" size="sm" disablePortal>
          <p>Compact content</p>
        </Modal>
      </div>,
    );
    await expect(screen.container).toMatchScreenshot();
  });
});
