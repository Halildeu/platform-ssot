import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { Drawer } from '../Drawer';

describe('Drawer Visual Regression', () => {
  it('open drawer matches screenshot', async () => {
    const screen = render(
      <div style={{ padding: 20, background: '#fff', minHeight: 300, position: 'relative' }}>
        <Drawer open onClose={() => {}} title="Detail Panel" size="sm">
          <p>Drawer content here</p>
        </Drawer>
      </div>,
    );
    await expect(screen.container).toMatchScreenshot();
  });

  it('drawer with footer matches screenshot', async () => {
    const screen = render(
      <div style={{ padding: 20, background: '#fff', minHeight: 300, position: 'relative' }}>
        <Drawer open onClose={() => {}} title="With Footer" footer={<button>Save</button>}>
          <p>Body content</p>
        </Drawer>
      </div>,
    );
    await expect(screen.container).toMatchScreenshot();
  });
});
