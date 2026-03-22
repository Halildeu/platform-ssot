import { describe, it, expect, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { Alert } from '../Alert';

describe('Alert (Browser)', () => {
  /* ------------------------------------------------------------------ */
  /*  1. Basic render                                                     */
  /* ------------------------------------------------------------------ */
  it('renders with title and description', async () => {
    render(
      <Alert title="Heads up">This is an info alert.</Alert>,
    );
    await expect.element(screen.getByText('Heads up')).toBeVisible();
    await expect.element(screen.getByText('This is an info alert.')).toBeVisible();
  });

  it('renders description-only alert', async () => {
    const screen = await render(<Alert>Simple alert message</Alert>);
    await expect.element(screen.getByText('Simple alert message')).toBeVisible();
  });

  /* ------------------------------------------------------------------ */
  /*  2. Closable fires onClose                                           */
  /* ------------------------------------------------------------------ */
  it('renders close button when closable and fires onClose', async () => {
    const onClose = vi.fn();
    render(
      <Alert closable onClose={onClose}>Closable alert</Alert>,
    );
    const closeBtn = screen.getByLabelText('Dismiss');
    await expect.element(closeBtn).toBeVisible();
    await closeBtn.click();
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('does not render close button when not closable', async () => {
    const screen = await render(<Alert>Not closable</Alert>);
    expect(document.querySelector('[aria-label="Dismiss"]')).toBeNull();
  });

  /* ------------------------------------------------------------------ */
  /*  3. ARIA attributes                                                  */
  /* ------------------------------------------------------------------ */
  it('has role="alert"', async () => {
    const screen = await render(<Alert>Alert content</Alert>);
    await expect.element(screen.getByRole('alert')).toBeVisible();
  });

  /* ------------------------------------------------------------------ */
  /*  4. All variants render correct icon                                 */
  /* ------------------------------------------------------------------ */
  it('renders all variants without error', async () => {
    const variants = ['info', 'success', 'warning', 'error'] as const;
    for (const variant of variants) {
      render(
        <Alert variant={variant} title={variant}>
          {variant} message
        </Alert>,
      );
      await expect.element(screen.getByRole('alert')).toBeVisible();
      await expect.element(screen.getByText(`${variant} message`)).toBeVisible();
      
    }
  });

  it('renders default icon for each variant', async () => {
    const variants = ['info', 'success', 'warning', 'error'] as const;
    for (const variant of variants) {
      render(
        <Alert variant={variant}>Content</Alert>,
      );
      // Each variant should render an SVG icon
      const alert = screen.getByRole('alert');
      expect(alert.element().querySelector('svg')).not.toBeNull();
      
    }
  });

  /* ------------------------------------------------------------------ */
  /*  5. Custom icon                                                      */
  /* ------------------------------------------------------------------ */
  it('renders custom icon when provided', async () => {
    render(
      <Alert icon={<span data-testid="custom-icon">!</span>}>Custom</Alert>,
    );
    await expect.element(screen.getByText('!')).toBeVisible();
  });

  /* ------------------------------------------------------------------ */
  /*  6. Action node                                                      */
  /* ------------------------------------------------------------------ */
  it('renders action node', async () => {
    render(
      <Alert action={<button>Retry</button>}>Something failed</Alert>,
    );
    await expect.element(screen.getByText('Retry')).toBeVisible();
  });

  /* ------------------------------------------------------------------ */
  /*  7. Focus management — close button is focusable                     */
  /* ------------------------------------------------------------------ */
  it('close button is focusable', async () => {
    render(
      <Alert closable onClose={() => {}}>Closable</Alert>,
    );
    const closeBtn = screen.getByLabelText('Dismiss').element();
    closeBtn.focus();
    expect(document.activeElement).toBe(closeBtn);
  });
});
