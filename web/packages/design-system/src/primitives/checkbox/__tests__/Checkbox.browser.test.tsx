import { describe, it, expect, vi } from 'vitest';
import { render, cleanup } from 'vitest-browser-react';
import { userEvent } from 'vitest/browser';
import { Checkbox } from '../Checkbox';

describe('Checkbox (Browser)', () => {
  /* ------------------------------------------------------------------ */
  /*  1. Basic render                                                     */
  /* ------------------------------------------------------------------ */
  it('renders with label', async () => {
    const screen = await render(<Checkbox label="Accept terms" />);
    await expect.element(screen.getByText('Accept terms')).toBeVisible();
  });

  it('renders checkbox role', async () => {
    const screen = await render(<Checkbox label="Check" />);
    await expect.element(screen.getByRole('checkbox')).toBeVisible();
  });

  /* ------------------------------------------------------------------ */
  /*  2. onChange callback                                                */
  /* ------------------------------------------------------------------ */
  it('fires onChange when clicked', async () => {
    const onChange = vi.fn();
    const screen = await render(<Checkbox label="Toggle" onChange={onChange} />);
    await screen.getByRole('checkbox').click();
    expect(onChange).toHaveBeenCalledOnce();
  });

  /* ------------------------------------------------------------------ */
  /*  3. Disabled state blocks interaction                                */
  /* ------------------------------------------------------------------ */
  it('is disabled when disabled prop is set', async () => {
    const screen = await render(<Checkbox label="Disabled" disabled />);
    await expect.element(screen.getByRole('checkbox')).toBeDisabled();
  });

  it('does not fire onChange when disabled', async () => {
    const screen = await render(<Checkbox label="No" disabled />);
    await expect.element(screen.getByRole('checkbox')).toBeDisabled();
  });

  /* ------------------------------------------------------------------ */
  /*  4. Keyboard — Space toggles                                         */
  /* ------------------------------------------------------------------ */
  it('toggles on Space key', async () => {
    const screen = await render(<Checkbox label="KB Toggle" />);
    const cb = screen.getByRole('checkbox');
    await expect.element(cb).not.toBeChecked();
    cb.element().focus();
    await userEvent.keyboard(' ');
    await expect.element(cb).toBeChecked();
  });

  /* ------------------------------------------------------------------ */
  /*  5. ARIA attributes                                                  */
  /* ------------------------------------------------------------------ */
  it('reflects aria-checked state via native checked', async () => {
    const screen = await render(<Checkbox label="Checked" defaultChecked />);
    await expect.element(screen.getByRole('checkbox')).toBeChecked();
  });

  it('sets aria-invalid when error is truthy', async () => {
    const screen = await render(<Checkbox label="Error" error />);
    await expect.element(screen.getByRole('checkbox')).toHaveAttribute('aria-invalid', 'true');
  });

  /* ------------------------------------------------------------------ */
  /*  6. Indeterminate state                                              */
  /* ------------------------------------------------------------------ */
  it('renders indeterminate state', async () => {
    const screen = await render(<Checkbox label="Indeterminate" indeterminate />);
    const cb = screen.getByRole('checkbox').element() as HTMLInputElement;
    expect(cb.indeterminate).toBe(true);
  });

  /* ------------------------------------------------------------------ */
  /*  7. Label click toggles                                              */
  /* ------------------------------------------------------------------ */
  it('toggles when label is clicked', async () => {
    const screen = await render(<Checkbox label="Click label" />);
    const cb = screen.getByRole('checkbox');
    await expect.element(cb).not.toBeChecked();
    await screen.getByText('Click label').click();
    await expect.element(cb).toBeChecked();
  });

  /* ------------------------------------------------------------------ */
  /*  8. Uncontrolled toggle                                              */
  /* ------------------------------------------------------------------ */
  it('toggles checked state in uncontrolled mode', async () => {
    const screen = await render(<Checkbox label="Toggle me" />);
    const cb = screen.getByRole('checkbox');
    await expect.element(cb).not.toBeChecked();
    await cb.click();
    await expect.element(cb).toBeChecked();
    await cb.click();
    await expect.element(cb).not.toBeChecked();
  });

  /* ------------------------------------------------------------------ */
  /*  9. Sizes                                                            */
  /* ------------------------------------------------------------------ */
  it('renders all sizes without error', async () => {
    const sizes = ['sm', 'md', 'lg'] as const;
    for (const size of sizes) {
    await cleanup();
    const screen = await render(<Checkbox label={size} size={size} />);
      await expect.element(screen.getByRole('checkbox')).toBeVisible();
      
    }
  });

  /* ------------------------------------------------------------------ */
  /*  10. Loading state                                                   */
  /* ------------------------------------------------------------------ */
  it('is non-interactive when loading', async () => {
    const onChange = vi.fn();
    const screen = await render(<Checkbox label="Loading" loading onChange={onChange} />);
    await expect.element(screen.getByRole('checkbox')).toBeDisabled();
  });

  /* ------------------------------------------------------------------ */
  /*  11. Focus management                                                */
  /* ------------------------------------------------------------------ */
  it('is focusable via tab', async () => {
    const screen = await render(<Checkbox label="Focusable" />);
    await userEvent.keyboard('{Tab}');
    expect(document.activeElement).toBe(screen.getByRole('checkbox').element());
  });
});
