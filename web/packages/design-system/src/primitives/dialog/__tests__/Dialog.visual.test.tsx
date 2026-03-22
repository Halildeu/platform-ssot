import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { page } from 'vitest/browser';
import { Dialog } from '../Dialog';

describe('Dialog Visual Regression', () => {
  /* ---- 1. Default open ---- */
  it('open dialog with title matches screenshot', async () => {
    const screen = await render(
      <div style={{ padding: 20, background: '#fff', minHeight: 300 }}>
        <Dialog open title="Confirm Action" footer={<button>Confirm</button>} onClose={() => {}}>
          <p>Are you sure you want to proceed?</p>
        </Dialog>
      </div>,
    );
    await expect(page.screenshot()).toMatchImageSnapshot();
  });

  /* ---- 2. All sizes ---- */
  it('small dialog matches screenshot', async () => {
    const screen = await render(
      <div style={{ padding: 20, background: '#fff', minHeight: 300 }}>
        <Dialog open title="Small Dialog" size="sm" onClose={() => {}}>
          <p>Compact content</p>
        </Dialog>
      </div>,
    );
    await expect(page.screenshot()).toMatchImageSnapshot();
  });

  it('large dialog matches screenshot', async () => {
    const screen = await render(
      <div style={{ padding: 20, background: '#fff', minHeight: 300 }}>
        <Dialog open title="Large Dialog" size="lg" onClose={() => {}}>
          <p>Spacious content area</p>
        </Dialog>
      </div>,
    );
    await expect(page.screenshot()).toMatchImageSnapshot();
  });

  /* ---- 3. With description ---- */
  it('dialog with description matches screenshot', async () => {
    const screen = await render(
      <div style={{ padding: 20, background: '#fff', minHeight: 300 }}>
        <Dialog open title="Settings" description="Manage your preferences" onClose={() => {}}>
          <p>Settings content</p>
        </Dialog>
      </div>,
    );
    await expect(page.screenshot()).toMatchImageSnapshot();
  });

  /* ---- 4. With footer ---- */
  it('dialog with footer matches screenshot', async () => {
    const screen = await render(
      <div style={{ padding: 20, background: '#fff', minHeight: 300 }}>
        <Dialog
          open
          title="Save Changes"
          footer={
            <>
              <button>Cancel</button>
              <button>Save</button>
            </>
          }
          onClose={() => {}}
        >
          <p>Your changes will be saved.</p>
        </Dialog>
      </div>,
    );
    await expect(page.screenshot()).toMatchImageSnapshot();
  });

  /* ---- 5. Dark mode ---- */
  it('dark theme matches screenshot', async () => {
    const screen = await render(
      <div data-theme="dark" style={{ padding: 20, background: '#1a1a2e', minHeight: 300 }}>
        <Dialog open title="Dark Dialog" onClose={() => {}}>
          <p>Dark themed content</p>
        </Dialog>
      </div>,
    );
    await expect(page.screenshot()).toMatchImageSnapshot();
  });
});
