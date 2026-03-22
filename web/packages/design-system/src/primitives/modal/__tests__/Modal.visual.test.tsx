import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { Modal } from '../Modal';

describe('Modal Visual Regression', () => {
  /* ---- 1. Default open modal ---- */
  it('open modal matches screenshot', async () => {
    const screen = render(
      <div style={{ padding: 20, background: '#fff', minHeight: 300 }}>
        <Modal open title="Confirm Action" footer={<button>Confirm</button>} disablePortal>
          <p>Are you sure you want to proceed?</p>
        </Modal>
      </div>,
    );
    await expect(screen.container).toMatchScreenshot();
  });

  /* ---- 2. All sizes ---- */
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

  it('large size modal matches screenshot', async () => {
    const screen = render(
      <div style={{ padding: 20, background: '#fff', minHeight: 300 }}>
        <Modal open title="Large Modal" size="lg" disablePortal>
          <p>Spacious content area</p>
        </Modal>
      </div>,
    );
    await expect(screen.container).toMatchScreenshot();
  });

  /* ---- 3. Destructive variant ---- */
  it('destructive variant matches screenshot', async () => {
    const screen = render(
      <div style={{ padding: 20, background: '#fff', minHeight: 300 }}>
        <Modal open title="Delete Item" variant="destructive" footer={<button>Delete</button>} disablePortal>
          <p>This action cannot be undone.</p>
        </Modal>
      </div>,
    );
    await expect(screen.container).toMatchScreenshot();
  });

  /* ---- 4. Confirm variant ---- */
  it('confirm variant matches screenshot', async () => {
    const screen = render(
      <div style={{ padding: 20, background: '#fff', minHeight: 300 }}>
        <Modal open title="Confirm Changes" variant="confirm" footer={<button>OK</button>} disablePortal>
          <p>Save your changes?</p>
        </Modal>
      </div>,
    );
    await expect(screen.container).toMatchScreenshot();
  });

  /* ---- 5. Dark mode ---- */
  it('dark theme matches screenshot', async () => {
    const screen = render(
      <div data-theme="dark" style={{ padding: 20, background: '#1a1a2e', minHeight: 300 }}>
        <Modal open title="Dark Modal" footer={<button>Action</button>} disablePortal>
          <p>Dark themed content</p>
        </Modal>
      </div>,
    );
    await expect(screen.container).toMatchScreenshot();
  });
});
