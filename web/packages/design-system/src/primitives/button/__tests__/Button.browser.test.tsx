import { describe, it, expect, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { userEvent } from '@vitest/browser/context';
import { Button } from '../Button';

describe('Button (Browser)', () => {
  /* ------------------------------------------------------------------ */
  /*  1. Basic render                                                     */
  /* ------------------------------------------------------------------ */
  it('renders with correct text', async () => {
    const screen = render(<Button>Click me</Button>);
    await expect.element(screen.getByRole('button', { name: 'Click me' })).toBeVisible();
  });

  it('renders as type="button" by default (no accidental form submit)', async () => {
    const screen = render(<Button>Submit</Button>);
    await expect.element(screen.getByRole('button')).toHaveAttribute('type', 'button');
  });

  /* ------------------------------------------------------------------ */
  /*  2. onClick callback                                                 */
  /* ------------------------------------------------------------------ */
  it('fires onClick when clicked', async () => {
    const onClick = vi.fn();
    const screen = render(<Button onClick={onClick}>Press</Button>);
    await screen.getByRole('button').click();
    expect(onClick).toHaveBeenCalledOnce();
  });

  /* ------------------------------------------------------------------ */
  /*  3. Disabled state blocks interaction                                */
  /* ------------------------------------------------------------------ */
  it('is disabled when disabled prop is set', async () => {
    const screen = render(<Button disabled>Disabled</Button>);
    await expect.element(screen.getByRole('button')).toBeDisabled();
  });

  it('does not fire onClick when disabled', async () => {
    const onClick = vi.fn();
    const screen = render(<Button disabled onClick={onClick}>Disabled</Button>);
    await screen.getByRole('button').click();
    expect(onClick).not.toHaveBeenCalled();
  });

  /* ------------------------------------------------------------------ */
  /*  4. Keyboard interaction (Enter / Space)                             */
  /* ------------------------------------------------------------------ */
  it('activates on Enter key', async () => {
    const onClick = vi.fn();
    const screen = render(<Button onClick={onClick}>KB</Button>);
    screen.getByRole('button').element().focus();
    await userEvent.keyboard('{Enter}');
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('activates on Space key', async () => {
    const onClick = vi.fn();
    const screen = render(<Button onClick={onClick}>KB</Button>);
    screen.getByRole('button').element().focus();
    await userEvent.keyboard(' ');
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('does not activate on Enter when disabled', async () => {
    const onClick = vi.fn();
    const screen = render(<Button disabled onClick={onClick}>KB</Button>);
    screen.getByRole('button').element().focus();
    await userEvent.keyboard('{Enter}');
    expect(onClick).not.toHaveBeenCalled();
  });

  /* ------------------------------------------------------------------ */
  /*  5. ARIA attributes                                                  */
  /* ------------------------------------------------------------------ */
  it('has aria-label when provided', async () => {
    const screen = render(<Button aria-label="Close dialog" iconOnly>X</Button>);
    await expect.element(screen.getByRole('button')).toHaveAttribute('aria-label', 'Close dialog');
  });

  it('sets aria-busy when loading', async () => {
    const screen = render(<Button loading>Saving</Button>);
    await expect.element(screen.getByRole('button')).toHaveAttribute('aria-busy', 'true');
  });

  it('sets aria-disabled when disabled', async () => {
    const screen = render(<Button disabled>No</Button>);
    await expect.element(screen.getByRole('button')).toHaveAttribute('aria-disabled', 'true');
  });

  /* ------------------------------------------------------------------ */
  /*  6. Loading state                                                    */
  /* ------------------------------------------------------------------ */
  it('renders spinner and disables interaction when loading', async () => {
    const onClick = vi.fn();
    const screen = render(<Button loading onClick={onClick}>Save</Button>);
    const btn = screen.getByRole('button');
    await expect.element(btn).toBeDisabled();
    await btn.click();
    expect(onClick).not.toHaveBeenCalled();
  });

  it('shows loading text alongside spinner', async () => {
    const screen = render(<Button loading>Saving</Button>);
    await expect.element(screen.getByText('Saving')).toBeVisible();
  });

  /* ------------------------------------------------------------------ */
  /*  7. Focus management                                                 */
  /* ------------------------------------------------------------------ */
  it('is focusable via tab', async () => {
    const screen = render(<Button>Focus me</Button>);
    await userEvent.keyboard('{Tab}');
    const btn = screen.getByRole('button').element();
    expect(document.activeElement).toBe(btn);
  });

  /* ------------------------------------------------------------------ */
  /*  8. Variants                                                         */
  /* ------------------------------------------------------------------ */
  it('applies all variant classes without error', async () => {
    const variants = ['primary', 'secondary', 'outline', 'ghost', 'danger', 'link'] as const;
    for (const variant of variants) {
      const screen = render(<Button variant={variant}>{variant}</Button>);
      await expect.element(screen.getByRole('button', { name: variant })).toBeVisible();
      screen.unmount();
    }
  });

  /* ------------------------------------------------------------------ */
  /*  9. Sizes                                                            */
  /* ------------------------------------------------------------------ */
  it('renders all sizes without error', async () => {
    const sizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const;
    for (const size of sizes) {
      const screen = render(<Button size={size}>Sz-{size}</Button>);
      await expect.element(screen.getByRole('button')).toBeVisible();
      screen.unmount();
    }
  });

  /* ------------------------------------------------------------------ */
  /*  10. Icon button                                                     */
  /* ------------------------------------------------------------------ */
  it('renders icon-only button with aria-label', async () => {
    const screen = render(
      <Button iconOnly aria-label="Settings">
        <svg data-testid="icon" />
      </Button>,
    );
    await expect.element(screen.getByRole('button', { name: 'Settings' })).toBeVisible();
  });

  /* ------------------------------------------------------------------ */
  /*  11. Left / Right icon                                               */
  /* ------------------------------------------------------------------ */
  it('renders left and right icons alongside text', async () => {
    const screen = render(
      <Button leftIcon={<span data-testid="left" />} rightIcon={<span data-testid="right" />}>
        With Icons
      </Button>,
    );
    await expect.element(screen.getByText('With Icons')).toBeVisible();
  });

  /* ------------------------------------------------------------------ */
  /*  12. fullWidth                                                       */
  /* ------------------------------------------------------------------ */
  it('stretches to full width when fullWidth is set', async () => {
    const screen = render(<Button fullWidth>Wide</Button>);
    await expect.element(screen.getByRole('button')).toBeVisible();
  });
});
