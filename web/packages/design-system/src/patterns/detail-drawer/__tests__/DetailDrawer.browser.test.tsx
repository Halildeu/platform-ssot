import { describe, it, expect, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { DetailDrawer } from '../DetailDrawer';

describe('DetailDrawer (Browser)', () => {
  it('renders title and content when open', async () => {
    const screen = render(
      <DetailDrawer open onClose={() => {}} title="Order #1234">
        <p>Order details here</p>
      </DetailDrawer>,
    );
    await expect.element(screen.getByText('Order #1234')).toBeVisible();
    await expect.element(screen.getByText('Order details here')).toBeVisible();
  });

  it('does not render when closed', async () => {
    const screen = render(
      <DetailDrawer open={false} onClose={() => {}} title="Hidden">
        <p>Hidden content</p>
      </DetailDrawer>,
    );
    expect(screen.container.querySelector('[role="dialog"]')).toBeNull();
  });

  it('renders close button', async () => {
    const onClose = vi.fn();
    const screen = render(
      <DetailDrawer open onClose={onClose} title="Closable">
        <p>Content</p>
      </DetailDrawer>,
    );
    const closeBtn = screen.getByLabelText('Close drawer');
    await expect.element(closeBtn).toBeVisible();
  });
});
