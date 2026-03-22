import { describe, it, expect, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { userEvent } from 'vitest/browser';
import { Modal } from '../Modal';

describe('Modal (Browser)', () => {
  /* ------------------------------------------------------------------ */
  /*  1. Basic render                                                     */
  /* ------------------------------------------------------------------ */
  it('renders content when open', async () => {
    render(
      <Modal open title="Test Modal" disablePortal>
        <p>Modal body content</p>
      </Modal>,
    );
    await expect.element(screen.getByText('Modal body content')).toBeVisible();
  });

  it('does not render when closed', async () => {
    render(
      <Modal open={false} title="Hidden Modal" disablePortal>
        <p>Should not be visible</p>
      </Modal>,
    );
    expect(document.querySelector('dialog')).toBeNull();
  });

  /* ------------------------------------------------------------------ */
  /*  2. Close button fires onClose                                       */
  /* ------------------------------------------------------------------ */
  it('close button fires onClose with reason', async () => {
    const onClose = vi.fn();
    render(
      <Modal open title="Closable" onClose={onClose} disablePortal>
        <p>Content</p>
      </Modal>,
    );
    const closeBtn = screen.getByLabelText('Close');
    await expect.element(closeBtn).toBeVisible();
    await closeBtn.click();
    expect(onClose).toHaveBeenCalledWith('close-button');
  });

  /* ------------------------------------------------------------------ */
  /*  3. Escape closes                                                    */
  /* ------------------------------------------------------------------ */
  it('fires onClose with escape reason on Escape key', async () => {
    const onClose = vi.fn();
    render(
      <Modal open title="Esc Test" onClose={onClose} disablePortal>
        <p>Content</p>
      </Modal>,
    );
    await expect.element(screen.getByText('Content')).toBeVisible();
    await userEvent.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalledWith('escape');
  });

  it('does not fire onClose on Escape when closeOnEscape is false', async () => {
    const onClose = vi.fn();
    render(
      <Modal open title="No Esc" onClose={onClose} closeOnEscape={false} disablePortal>
        <p>Content</p>
      </Modal>,
    );
    await expect.element(screen.getByText('Content')).toBeVisible();
    await userEvent.keyboard('{Escape}');
    expect(onClose).not.toHaveBeenCalledWith('escape');
  });

  /* ------------------------------------------------------------------ */
  /*  4. Backdrop click closes                                            */
  /* ------------------------------------------------------------------ */
  it('fires onClose with overlay reason on backdrop click', async () => {
    const onClose = vi.fn();
    render(
      <Modal open title="Backdrop" onClose={onClose} disablePortal>
        <p>Content</p>
      </Modal>,
    );
    // Click on the dialog element itself (backdrop area)
    const dialog = document.querySelector('dialog')!;
    dialog.click();
    expect(onClose).toHaveBeenCalledWith('overlay');
  });

  it('does not fire onClose on backdrop when closeOnOverlayClick is false', async () => {
    const onClose = vi.fn();
    render(
      <Modal open title="No Backdrop" onClose={onClose} closeOnOverlayClick={false} disablePortal>
        <p>Content</p>
      </Modal>,
    );
    const dialog = document.querySelector('dialog')!;
    dialog.click();
    expect(onClose).not.toHaveBeenCalledWith('overlay');
  });

  /* ------------------------------------------------------------------ */
  /*  5. ARIA attributes                                                  */
  /* ------------------------------------------------------------------ */
  it('renders as a <dialog> element', async () => {
    render(
      <Modal open title="ARIA" disablePortal>
        <p>Content</p>
      </Modal>,
    );
    const dialog = document.querySelector('dialog');
    expect(dialog).not.toBeNull();
  });

  /* ------------------------------------------------------------------ */
  /*  6. Footer                                                           */
  /* ------------------------------------------------------------------ */
  it('renders footer content', async () => {
    render(
      <Modal open title="With Footer" footer={<button>Save</button>} disablePortal>
        <p>Body</p>
      </Modal>,
    );
    await expect.element(screen.getByText('Save')).toBeVisible();
  });

  /* ------------------------------------------------------------------ */
  /*  7. Sizes                                                            */
  /* ------------------------------------------------------------------ */
  it('renders all sizes without error', async () => {
    const sizes = ['sm', 'md', 'lg'] as const;
    for (const size of sizes) {
      render(
        <Modal open title={`Size ${size}`} size={size} disablePortal>
          <p>Content</p>
        </Modal>,
      );
      await expect.element(screen.getByText('Content')).toBeVisible();
      
    }
  });

  /* ------------------------------------------------------------------ */
  /*  8. Variants / Surfaces                                              */
  /* ------------------------------------------------------------------ */
  it('renders all variants without error', async () => {
    const variants = ['base', 'confirm', 'destructive', 'audit'] as const;
    for (const variant of variants) {
      render(
        <Modal open title={variant} variant={variant} disablePortal>
          <p>Content</p>
        </Modal>,
      );
      await expect.element(screen.getByText('Content')).toBeVisible();
      
    }
  });
});
