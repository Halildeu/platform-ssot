import { describe, it, expect, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { NotificationDrawer } from '../NotificationDrawer';

describe('NotificationDrawer (Browser)', () => {
  it('renders nothing when closed', async () => {
    const screen = await render(
      <NotificationDrawer open={false} items={[]} disablePortal />,
    );
    expect(document.body.textContent).toBe('');
  });

  it('renders drawer title when open', async () => {
    const screen = await render(
      <NotificationDrawer open items={[]} disablePortal title="Bildirimler" />,
    );
    await expect.element(screen.getByText('Bildirimler')).toBeVisible();
  });

  it('renders notification items when open', async () => {
    const screen = await render(
      <NotificationDrawer
        open
        disablePortal
        items={[
          { id: '1', title: 'New message', description: 'You have a new message', timestamp: 'Just now' },
        ]}
      />,
    );
    await expect.element(screen.getByText('New message')).toBeVisible();
  });

  it('renders close button when open', async () => {
    const screen = await render(
      <NotificationDrawer open items={[]} disablePortal />,
    );
    const closeBtn = document.querySelector('[aria-label]');
    expect(closeBtn).not.toBeNull();
  });

  it('calls onClose when close button is clicked', async () => {
    const onClose = vi.fn();
    const screen = await render(
      <NotificationDrawer open items={[]} disablePortal onClose={onClose} />,
    );
    const closeBtn = screen.getByLabelText('Bildirim merkezini kapat');
    await closeBtn.click();
    expect(onClose).toHaveBeenCalled();
  });

  it('renders with custom dialog label', async () => {
    const screen = await render(
      <NotificationDrawer open items={[]} disablePortal dialogLabel="Notifications Panel" />,
    );
    const dialog = document.querySelector('[aria-label="Notifications Panel"]');
    expect(dialog).not.toBeNull();
  });

  it('renders empty state when no items', async () => {
    const screen = await render(
      <NotificationDrawer open items={[]} disablePortal />,
    );
    await expect.element(screen.getByText('Bildirimler')).toBeVisible();
  });
});
