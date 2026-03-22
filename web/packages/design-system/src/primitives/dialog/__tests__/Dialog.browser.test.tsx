import { describe, it, expect, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { userEvent } from 'vitest/browser';
import { Dialog } from '../Dialog';

describe('Dialog (Browser)', () => {
  /* ------------------------------------------------------------------ */
  /*  1. Basic render                                                     */
  /* ------------------------------------------------------------------ */
  it('renders content when open', async () => {
    render(
      <Dialog open onClose={() => {}}>
        <p>Dialog body content</p>
      </Dialog>,
    );
    await expect.element(screen.getByText('Dialog body content')).toBeVisible();
  });

  it('does not render when closed', async () => {
    render(
      <Dialog open={false} onClose={() => {}}>
        <p>Hidden content</p>
      </Dialog>,
    );
    expect(document.querySelector('dialog')).toBeNull();
  });

  /* ------------------------------------------------------------------ */
  /*  2. Close button fires onClose                                       */
  /* ------------------------------------------------------------------ */
  it('renders title and close button', async () => {
    const onClose = vi.fn();
    render(
      <Dialog open title="Test Dialog" onClose={onClose}>
        <p>Content</p>
      </Dialog>,
    );
    await expect.element(screen.getByText('Test Dialog')).toBeVisible();
    const closeBtn = screen.getByLabelText('Close');
    await expect.element(closeBtn).toBeVisible();
    await closeBtn.click();
    expect(onClose).toHaveBeenCalledOnce();
  });

  /* ------------------------------------------------------------------ */
  /*  3. Escape closes                                                    */
  /* ------------------------------------------------------------------ */
  it('fires onClose on Escape key', async () => {
    const onClose = vi.fn();
    render(
      <Dialog open title="Esc Test" onClose={onClose}>
        <p>Content</p>
      </Dialog>,
    );
    await expect.element(screen.getByText('Content')).toBeVisible();
    await userEvent.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalled();
  });

  it('does not fire onClose on Escape when closeOnEscape is false', async () => {
    const onClose = vi.fn();
    render(
      <Dialog open title="No Esc" onClose={onClose} closeOnEscape={false}>
        <p>Content</p>
      </Dialog>,
    );
    await expect.element(screen.getByText('Content')).toBeVisible();
    await userEvent.keyboard('{Escape}');
    // onClose should only have been called if some other mechanism triggered it, not escape
    expect(onClose).not.toHaveBeenCalled();
  });

  /* ------------------------------------------------------------------ */
  /*  4. Backdrop click                                                   */
  /* ------------------------------------------------------------------ */
  it('fires onClose on backdrop click', async () => {
    const onClose = vi.fn();
    render(
      <Dialog open title="Backdrop" onClose={onClose}>
        <p>Content</p>
      </Dialog>,
    );
    const dialog = document.querySelector('dialog')!;
    dialog.click();
    expect(onClose).toHaveBeenCalled();
  });

  it('does not fire onClose on backdrop when closeOnBackdrop is false', async () => {
    const onClose = vi.fn();
    render(
      <Dialog open title="No Backdrop" onClose={onClose} closeOnBackdrop={false}>
        <p>Content</p>
      </Dialog>,
    );
    const dialog = document.querySelector('dialog')!;
    dialog.click();
    expect(onClose).not.toHaveBeenCalled();
  });

  /* ------------------------------------------------------------------ */
  /*  5. ARIA attributes                                                  */
  /* ------------------------------------------------------------------ */
  it('renders as a <dialog> element (native modal)', async () => {
    render(
      <Dialog open onClose={() => {}}>
        <p>Content</p>
      </Dialog>,
    );
    const dialog = document.querySelector('dialog');
    expect(dialog).not.toBeNull();
  });

  /* ------------------------------------------------------------------ */
  /*  6. Footer                                                           */
  /* ------------------------------------------------------------------ */
  it('renders footer content', async () => {
    render(
      <Dialog open title="Footer" footer={<button>Save</button>} onClose={() => {}}>
        <p>Body</p>
      </Dialog>,
    );
    await expect.element(screen.getByText('Save')).toBeVisible();
  });

  /* ------------------------------------------------------------------ */
  /*  7. Description                                                      */
  /* ------------------------------------------------------------------ */
  it('renders description below title', async () => {
    render(
      <Dialog open title="Main Title" description="Extra context here" onClose={() => {}}>
        <p>Body</p>
      </Dialog>,
    );
    await expect.element(screen.getByText('Extra context here')).toBeVisible();
  });

  /* ------------------------------------------------------------------ */
  /*  8. Sizes                                                            */
  /* ------------------------------------------------------------------ */
  it('renders all sizes without error', async () => {
    const sizes = ['sm', 'md', 'lg', 'xl', 'full'] as const;
    for (const size of sizes) {
      render(
        <Dialog open title={`${size}`} size={size} onClose={() => {}}>
          <p>Content</p>
        </Dialog>,
      );
      await expect.element(screen.getByText('Content')).toBeVisible();
      
    }
  });

  /* ------------------------------------------------------------------ */
  /*  9. Focus management — close button is focusable                     */
  /* ------------------------------------------------------------------ */
  it('close button is focusable', async () => {
    render(
      <Dialog open title="Focus" onClose={() => {}}>
        <p>Content</p>
      </Dialog>,
    );
    const closeBtn = screen.getByLabelText('Close').element();
    closeBtn.focus();
    expect(document.activeElement).toBe(closeBtn);
  });
});
