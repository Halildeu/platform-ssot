import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { NotificationDrawer } from '../NotificationDrawer';

describe('NotificationDrawer Visual Regression', () => {
  it('open drawer matches screenshot', async () => {
    const screen = render(
      <div style={{ width: 500, height: 400, position: 'relative' }}>
        <NotificationDrawer
          open
          items={[]}
          disablePortal
          title="Bildirimler"
        />
      </div>,
    );
    await expect(screen.container).toMatchScreenshot();
  });
});
