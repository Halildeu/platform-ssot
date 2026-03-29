 
import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { page } from 'vitest/browser';
import { Modal } from '../Modal';
import { LIGHT_BG_HEX, DARK_BG_HEX } from '../../../__tests__/visual-constants';

describe('Modal Visual Regression', () => {
  /* ---- 1. Default open modal ---- */
  it('open modal matches screenshot', async () => {
    await render(
      <div style={{ padding: 20, background: LIGHT_BG_HEX, minHeight: 300 }}>
        <Modal open title="Confirm Action" footer={<button>Confirm</button>} disablePortal>
          <p>Are you sure you want to proceed?</p>
        </Modal>
      </div>,
    );
    await expect(page.screenshot()).toMatchImageSnapshot();
  });

  /* ---- 2. All sizes ---- */
  it('small size modal matches screenshot', async () => {
    await render(
      <div style={{ padding: 20, background: LIGHT_BG_HEX, minHeight: 300 }}>
        <Modal open title="Small Modal" size="sm" disablePortal>
          <p>Compact content</p>
        </Modal>
      </div>,
    );
    await expect(page.screenshot()).toMatchImageSnapshot();
  });

  it('large size modal matches screenshot', async () => {
    await render(
      <div style={{ padding: 20, background: LIGHT_BG_HEX, minHeight: 300 }}>
        <Modal open title="Large Modal" size="lg" disablePortal>
          <p>Spacious content area</p>
        </Modal>
      </div>,
    );
    await expect(page.screenshot()).toMatchImageSnapshot();
  });

  /* ---- 3. Destructive variant ---- */
  it('destructive variant matches screenshot', async () => {
    await render(
      <div style={{ padding: 20, background: LIGHT_BG_HEX, minHeight: 300 }}>
        <Modal open title="Delete Item" variant="destructive" footer={<button>Delete</button>} disablePortal>
          <p>This action cannot be undone.</p>
        </Modal>
      </div>,
    );
    await expect(page.screenshot()).toMatchImageSnapshot();
  });

  /* ---- 4. Confirm variant ---- */
  it('confirm variant matches screenshot', async () => {
    await render(
      <div style={{ padding: 20, background: LIGHT_BG_HEX, minHeight: 300 }}>
        <Modal open title="Confirm Changes" variant="confirm" footer={<button>OK</button>} disablePortal>
          <p>Save your changes?</p>
        </Modal>
      </div>,
    );
    await expect(page.screenshot()).toMatchImageSnapshot();
  });

  /* ---- 5. Dark mode ---- */
  it('dark theme matches screenshot', async () => {
    await render(
      <div data-theme="dark" style={{ padding: 20, background: DARK_BG_HEX, minHeight: 300 }}>
        <Modal open title="Dark Modal" footer={<button>Action</button>} disablePortal>
          <p>Dark themed content</p>
        </Modal>
      </div>,
    );
    await expect(page.screenshot()).toMatchImageSnapshot();
  });
});
