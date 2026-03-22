import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { page } from 'vitest/browser';
import { NotificationDrawer } from '../NotificationDrawer';

describe('NotificationDrawer Visual Regression', () => {
  it('open drawer matches screenshot', async () => {
    const screen = await render(
      <div style={{ width: 500, height: 400, position: 'relative' }}>
        <NotificationDrawer
          open
          items={[]}
          disablePortal
          title="Bildirimler"
        />
      </div>,
    );
    await expect(page.screenshot()).toMatchImageSnapshot();
  });
});
