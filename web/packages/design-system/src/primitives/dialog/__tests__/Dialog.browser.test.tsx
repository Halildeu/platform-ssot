import { describe, it, expect, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { Dialog } from '../Dialog';

describe('Dialog (Browser)', () => {
  it('renders content when open', async () => {
    const screen = render(
      <Dialog open onClose={() => {}}>
        <p>Dialog body content</p>
      </Dialog>,
    );
    await expect.element(screen.getByText('Dialog body content')).toBeVisible();
  });

  it('does not render when closed', async () => {
    const screen = render(
      <Dialog open={false} onClose={() => {}}>
        <p>Hidden content</p>
      </Dialog>,
    );
    expect(screen.container.querySelector('dialog')).toBeNull();
  });

  it('renders title and close button', async () => {
    const onClose = vi.fn();
    const screen = render(
      <Dialog open title="Test Dialog" onClose={onClose}>
        <p>Content</p>
      </Dialog>,
    );
    await expect.element(screen.getByText('Test Dialog')).toBeVisible();
    const closeBtn = screen.getByLabelText('Close');
    await expect.element(closeBtn).toBeVisible();
  });
});
