import { describe, it, expect, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { Drawer } from '../Drawer';

describe('Drawer (Browser)', () => {
  it('renders content when open', async () => {
    const screen = render(
      <Drawer open onClose={() => {}} title="Test Drawer">
        <p>Drawer body</p>
      </Drawer>,
    );
    await expect.element(screen.getByText('Drawer body')).toBeVisible();
  });

  it('does not render when closed', async () => {
    const screen = render(
      <Drawer open={false} onClose={() => {}}>
        <p>Hidden content</p>
      </Drawer>,
    );
    expect(screen.container.querySelector('[role="dialog"]')).toBeNull();
  });

  it('shows close button', async () => {
    const onClose = vi.fn();
    const screen = render(
      <Drawer open onClose={onClose} title="Closable Drawer">
        <p>Content</p>
      </Drawer>,
    );
    const closeBtn = screen.getByLabelText('Close');
    await expect.element(closeBtn).toBeVisible();
  });
});
