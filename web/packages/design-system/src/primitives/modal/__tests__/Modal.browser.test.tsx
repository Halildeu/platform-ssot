import { describe, it, expect, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { Modal } from '../Modal';

describe('Modal (Browser)', () => {
  it('renders content when open', async () => {
    const screen = render(
      <Modal open title="Test Modal" disablePortal>
        <p>Modal body content</p>
      </Modal>,
    );
    await expect.element(screen.getByText('Modal body content')).toBeVisible();
  });

  it('does not render when closed', async () => {
    const screen = render(
      <Modal open={false} title="Hidden Modal" disablePortal>
        <p>Should not be visible</p>
      </Modal>,
    );
    expect(screen.container.querySelector('dialog')).toBeNull();
  });

  it('renders close button and calls onClose', async () => {
    const onClose = vi.fn();
    const screen = render(
      <Modal open title="Closable" onClose={onClose} disablePortal>
        <p>Content</p>
      </Modal>,
    );
    const closeBtn = screen.getByLabelText('Close');
    await expect.element(closeBtn).toBeVisible();
    await closeBtn.click();
    expect(onClose).toHaveBeenCalledWith('close-button');
  });

  it('renders footer content', async () => {
    const screen = render(
      <Modal open title="With Footer" footer={<button>Save</button>} disablePortal>
        <p>Body</p>
      </Modal>,
    );
    await expect.element(screen.getByText('Save')).toBeVisible();
  });
});
