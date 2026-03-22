import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { NotificationDrawer } from '../NotificationDrawer';

describe('NotificationDrawer (Browser)', () => {
  it('renders nothing when closed', async () => {
    const screen = render(
      <NotificationDrawer open={false} items={[]} disablePortal />,
    );
    // Drawer should not render visible content when closed
    expect(screen.container.textContent).toBe('');
  });

  it('renders drawer when open', async () => {
    const screen = render(
      <NotificationDrawer
        open
        items={[]}
        disablePortal
        title="Bildirimler"
      />,
    );
    await expect.element(screen.getByText('Bildirimler')).toBeVisible();
  });
});
