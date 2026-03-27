import { describe, it, expect, vi } from 'vitest';
import { render, cleanup } from 'vitest-browser-react';
import { userEvent } from 'vitest/browser';
import { Drawer } from '../Drawer';

describe('Drawer (Browser)', () => {
  /* ------------------------------------------------------------------ */
  /*  1. Basic render                                                     */
  /* ------------------------------------------------------------------ */
  it('renders content when open', async () => {
    const screen = await render(
      <Drawer open onClose={() => {}} title="Test Drawer">
        <p>Drawer body</p>
      </Drawer>,
    );
    await expect.element(screen.getByText('Drawer body')).toBeVisible();
  });

  it('does not render when closed', async () => {
    await render(
      <Drawer open={false} onClose={() => {}}>
        <p>Hidden content</p>
      </Drawer>,
    );
    expect(document.querySelector('[role="dialog"]')).toBeNull();
  });

  /* ------------------------------------------------------------------ */
  /*  2. Close button fires onClose                                       */
  /* ------------------------------------------------------------------ */
  it('close button fires onClose', async () => {
    const onClose = vi.fn();
    const screen = await render(
      <Drawer open onClose={onClose} title="Closable Drawer">
        <p>Content</p>
      </Drawer>,
    );
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
    const screen = await render(
      <Drawer open onClose={onClose} title="Esc Test">
        <p>Content</p>
      </Drawer>,
    );
    await expect.element(screen.getByText('Content')).toBeVisible();
    await userEvent.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalled();
  });

  it('does not fire onClose on Escape when closeOnEscape is false', async () => {
    const onClose = vi.fn();
    const screen = await render(
      <Drawer open onClose={onClose} closeOnEscape={false} title="No Esc">
        <p>Content</p>
      </Drawer>,
    );
    await expect.element(screen.getByText('Content')).toBeVisible();
    await userEvent.keyboard('{Escape}');
    expect(onClose).not.toHaveBeenCalled();
  });

  /* ------------------------------------------------------------------ */
  /*  4. ARIA attributes                                                  */
  /* ------------------------------------------------------------------ */
  it('has role="dialog" and aria-modal="true"', async () => {
    await render(
      <Drawer open onClose={() => {}} title="ARIA">
        <p>Content</p>
      </Drawer>,
    );
    const dialog = document.querySelector('[role="dialog"]')!;
    expect(dialog).not.toBeNull();
    expect(dialog.getAttribute('aria-modal')).toBe('true');
  });

  it('has aria-labelledby referencing title', async () => {
    await render(
      <Drawer open onClose={() => {}} title="My Drawer">
        <p>Content</p>
      </Drawer>,
    );
    const dialog = document.querySelector('[role="dialog"]')!;
    const labelledby = dialog.getAttribute('aria-labelledby');
    expect(labelledby).toBeTruthy();
    const title = document.getElementById(labelledby!);
    expect(title?.textContent).toBe('My Drawer');
  });

  /* ------------------------------------------------------------------ */
  /*  5. Overlay click closes                                             */
  /* ------------------------------------------------------------------ */
  it('fires onClose on overlay click', async () => {
    const onClose = vi.fn();
    await render(
      <Drawer open onClose={onClose} title="Overlay">
        <p>Content</p>
      </Drawer>,
    );
    const overlay = document.querySelector('[data-testid="drawer-overlay"]')!;
    overlay.click();
    expect(onClose).toHaveBeenCalled();
  });

  it('does not fire onClose on overlay when closeOnOverlayClick is false', async () => {
    const onClose = vi.fn();
    await render(
      <Drawer open onClose={onClose} closeOnOverlayClick={false} title="No overlay">
        <p>Content</p>
      </Drawer>,
    );
    const overlay = document.querySelector('[data-testid="drawer-overlay"]')!;
    overlay.click();
    expect(onClose).not.toHaveBeenCalled();
  });

  /* ------------------------------------------------------------------ */
  /*  6. Placements                                                       */
  /* ------------------------------------------------------------------ */
  it('renders all placements without error', async () => {
    const placements = ['left', 'right', 'top', 'bottom'] as const;
    for (const placement of placements) {
      await cleanup();
      const screen = await render(
        <Drawer open onClose={() => {}} placement={placement} title={`${placement} drawer`}>
          <p>Content</p>
        </Drawer>,
      );
      await expect.element(screen.getByText('Content')).toBeVisible();
    }
  });

  /* ------------------------------------------------------------------ */
  /*  7. Footer                                                           */
  /* ------------------------------------------------------------------ */
  it('renders footer content', async () => {
    const screen = await render(
      <Drawer open onClose={() => {}} title="Footer" footer={<button>Save</button>}>
        <p>Body</p>
      </Drawer>,
    );
    await expect.element(screen.getByText('Save')).toBeVisible();
  });

  /* ------------------------------------------------------------------ */
  /*  8. Sizes                                                            */
  /* ------------------------------------------------------------------ */
  it('renders all sizes without error', async () => {
    const sizes = ['sm', 'md', 'lg', 'full'] as const;
    for (const size of sizes) {
      await cleanup();
      const screen = await render(
        <Drawer open onClose={() => {}} size={size} title={`${size}`}>
          <p>Content</p>
        </Drawer>,
      );
      await expect.element(screen.getByText('Content')).toBeVisible();
    }
  });

  /* ------------------------------------------------------------------ */
  /*  9. Focus management — panel gets focus on open                      */
  /* ------------------------------------------------------------------ */
  it('panel receives focus on open', async () => {
    await render(
      <Drawer open onClose={() => {}} title="Focus">
        <p>Content</p>
      </Drawer>,
    );
    // The panel has tabIndex=-1 and should receive focus
    const panel = document.querySelector('[role="dialog"]')!;
    expect(document.activeElement === panel || panel.contains(document.activeElement)).toBe(true);
  });
});
