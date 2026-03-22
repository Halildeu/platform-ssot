import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { page } from 'vitest/browser';
import { Drawer } from '../Drawer';

describe('Drawer Visual Regression', () => {
  /* ---- 1. Default (right placement) ---- */
  it('right placement drawer matches screenshot', async () => {
    render(
      <div style={{ padding: 20, background: '#fff', minHeight: 300, position: 'relative' }}>
        <Drawer open onClose={() => {}} title="Detail Panel" size="sm">
          <p>Drawer content here</p>
        </Drawer>
      </div>,
    );
    await expect(page.screenshot()).toMatchImageSnapshot();
  });

  /* ---- 2. Left placement ---- */
  it('left placement drawer matches screenshot', async () => {
    render(
      <div style={{ padding: 20, background: '#fff', minHeight: 300, position: 'relative' }}>
        <Drawer open onClose={() => {}} title="Left Panel" placement="left" size="sm">
          <p>Left drawer content</p>
        </Drawer>
      </div>,
    );
    await expect(page.screenshot()).toMatchImageSnapshot();
  });

  /* ---- 3. With footer ---- */
  it('drawer with footer matches screenshot', async () => {
    render(
      <div style={{ padding: 20, background: '#fff', minHeight: 300, position: 'relative' }}>
        <Drawer open onClose={() => {}} title="With Footer" footer={<button>Save</button>}>
          <p>Body content</p>
        </Drawer>
      </div>,
    );
    await expect(page.screenshot()).toMatchImageSnapshot();
  });

  /* ---- 4. All sizes ---- */
  it('large size drawer matches screenshot', async () => {
    render(
      <div style={{ padding: 20, background: '#fff', minHeight: 300, position: 'relative' }}>
        <Drawer open onClose={() => {}} title="Large Drawer" size="lg">
          <p>Spacious drawer content</p>
        </Drawer>
      </div>,
    );
    await expect(page.screenshot()).toMatchImageSnapshot();
  });

  /* ---- 5. With description ---- */
  it('drawer with description matches screenshot', async () => {
    render(
      <div style={{ padding: 20, background: '#fff', minHeight: 300, position: 'relative' }}>
        <Drawer open onClose={() => {}} title="Settings" description="Configure preferences" size="md">
          <p>Drawer body</p>
        </Drawer>
      </div>,
    );
    await expect(page.screenshot()).toMatchImageSnapshot();
  });

  /* ---- 6. Dark mode ---- */
  it('dark theme matches screenshot', async () => {
    render(
      <div data-theme="dark" style={{ padding: 20, background: '#1a1a2e', minHeight: 300, position: 'relative' }}>
        <Drawer open onClose={() => {}} title="Dark Drawer" size="sm">
          <p>Dark content</p>
        </Drawer>
      </div>,
    );
    await expect(page.screenshot()).toMatchImageSnapshot();
  });
});
