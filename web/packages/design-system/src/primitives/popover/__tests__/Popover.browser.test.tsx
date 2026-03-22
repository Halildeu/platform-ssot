import { describe, it, expect, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { userEvent } from 'vitest/browser';
import { Popover } from '../Popover';

describe('Popover (Browser)', () => {
  /* ------------------------------------------------------------------ */
  /*  1. Basic render                                                     */
  /* ------------------------------------------------------------------ */
  it('renders trigger element', async () => {
    render(
      <Popover trigger={<button>Open</button>} content="Popover content" disablePortal />,
    );
    await expect.element(screen.getByText('Open')).toBeVisible();
  });

  /* ------------------------------------------------------------------ */
  /*  2. Click trigger opens                                              */
  /* ------------------------------------------------------------------ */
  it('opens popover on trigger click', async () => {
    render(
      <Popover trigger={<button>Toggle</button>} content="Visible content" disablePortal />,
    );
    await screen.getByText('Toggle').click();
    await expect.element(screen.getByText('Visible content')).toBeVisible();
  });

  /* ------------------------------------------------------------------ */
  /*  3. Shows/hides based on open prop (controlled)                      */
  /* ------------------------------------------------------------------ */
  it('shows popover content when controlled open', async () => {
    render(
      <Popover trigger={<button>Toggle</button>} content="Controlled" open disablePortal />,
    );
    await expect.element(screen.getByText('Controlled')).toBeVisible();
  });

  it('hides popover content when controlled closed', async () => {
    render(
      <Popover trigger={<button>Toggle</button>} content="Hidden" open={false} disablePortal />,
    );
    expect(document.querySelector('[role="dialog"]')).toBeNull();
  });

  /* ------------------------------------------------------------------ */
  /*  4. Escape closes                                                    */
  /* ------------------------------------------------------------------ */
  it('closes popover on Escape key', async () => {
    const onOpenChange = vi.fn();
    render(
      <Popover
        trigger={<button>Toggle</button>}
        content="Escapable"
        onOpenChange={onOpenChange}
        disablePortal
      />,
    );
    await screen.getByText('Toggle').click();
    await expect.element(screen.getByText('Escapable')).toBeVisible();
    await userEvent.keyboard('{Escape}');
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  /* ------------------------------------------------------------------ */
  /*  5. ARIA attributes                                                  */
  /* ------------------------------------------------------------------ */
  it('trigger has aria-haspopup="dialog"', async () => {
    render(
      <Popover trigger={<button>Open</button>} content="Content" disablePortal />,
    );
    await expect.element(screen.getByText('Open')).toHaveAttribute('aria-haspopup', 'dialog');
  });

  it('trigger has aria-expanded when open', async () => {
    render(
      <Popover trigger={<button>Open</button>} content="Content" open disablePortal />,
    );
    await expect.element(screen.getByText('Open')).toHaveAttribute('aria-expanded', 'true');
  });

  it('trigger has aria-expanded=false when closed', async () => {
    render(
      <Popover trigger={<button>Open</button>} content="Content" open={false} disablePortal />,
    );
    await expect.element(screen.getByText('Open')).toHaveAttribute('aria-expanded', 'false');
  });

  it('popover panel has role="dialog"', async () => {
    render(
      <Popover trigger={<button>Open</button>} content="Dialog" open disablePortal />,
    );
    const dialog = document.querySelector('[role="dialog"]');
    expect(dialog).not.toBeNull();
  });

  /* ------------------------------------------------------------------ */
  /*  6. Title                                                            */
  /* ------------------------------------------------------------------ */
  it('renders title when provided', async () => {
    render(
      <Popover trigger={<button>Open</button>} content="Body" title="Info" open disablePortal />,
    );
    await expect.element(screen.getByText('Info')).toBeVisible();
  });

  /* ------------------------------------------------------------------ */
  /*  7. onOpenChange callback                                            */
  /* ------------------------------------------------------------------ */
  it('fires onOpenChange when toggled', async () => {
    const onOpenChange = vi.fn();
    render(
      <Popover trigger={<button>Toggle</button>} content="Content" onOpenChange={onOpenChange} disablePortal />,
    );
    await screen.getByText('Toggle').click();
    expect(onOpenChange).toHaveBeenCalledWith(true);
  });

  /* ------------------------------------------------------------------ */
  /*  8. Keyboard trigger (Enter/Space opens)                             */
  /* ------------------------------------------------------------------ */
  it('opens on Enter key', async () => {
    render(
      <Popover trigger={<button>Open</button>} content="KB content" disablePortal />,
    );
    screen.getByText('Open').element().focus();
    await userEvent.keyboard('{Enter}');
    await expect.element(screen.getByText('KB content')).toBeVisible();
  });

  it('opens on Space key', async () => {
    render(
      <Popover trigger={<button>Open</button>} content="Space content" disablePortal />,
    );
    screen.getByText('Open').element().focus();
    await userEvent.keyboard(' ');
    await expect.element(screen.getByText('Space content')).toBeVisible();
  });
});
