import { describe, it, expect, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { userEvent } from '@vitest/browser/context';
import { Switch } from '../Switch';

describe('Switch (Browser)', () => {
  /* ------------------------------------------------------------------ */
  /*  1. Basic render                                                     */
  /* ------------------------------------------------------------------ */
  it('renders with label', async () => {
    const screen = render(<Switch label="Enable notifications" />);
    await expect.element(screen.getByText('Enable notifications')).toBeVisible();
  });

  it('renders switch role', async () => {
    const screen = render(<Switch label="Toggle" />);
    await expect.element(screen.getByRole('switch')).toBeVisible();
  });

  /* ------------------------------------------------------------------ */
  /*  2. onChange / onCheckedChange fires                                  */
  /* ------------------------------------------------------------------ */
  it('fires onCheckedChange when toggled', async () => {
    const onCheckedChange = vi.fn();
    const screen = render(<Switch label="Toggle" onCheckedChange={onCheckedChange} />);
    await screen.getByRole('switch').click();
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  /* ------------------------------------------------------------------ */
  /*  3. Disabled state                                                   */
  /* ------------------------------------------------------------------ */
  it('is disabled when disabled prop is set', async () => {
    const screen = render(<Switch label="Disabled" disabled />);
    await expect.element(screen.getByRole('switch')).toBeDisabled();
  });

  it('does not toggle when disabled', async () => {
    const onCheckedChange = vi.fn();
    const screen = render(<Switch label="No" disabled onCheckedChange={onCheckedChange} />);
    await screen.getByRole('switch').click();
    expect(onCheckedChange).not.toHaveBeenCalled();
  });

  /* ------------------------------------------------------------------ */
  /*  4. Keyboard — Space toggles                                         */
  /* ------------------------------------------------------------------ */
  it('toggles on Space key', async () => {
    const screen = render(<Switch label="KB" />);
    const sw = screen.getByRole('switch');
    await expect.element(sw).not.toBeChecked();
    sw.element().focus();
    await userEvent.keyboard(' ');
    await expect.element(sw).toBeChecked();
  });

  /* ------------------------------------------------------------------ */
  /*  5. ARIA attributes                                                  */
  /* ------------------------------------------------------------------ */
  it('has role="switch"', async () => {
    const screen = render(<Switch label="A" />);
    await expect.element(screen.getByRole('switch')).toBeVisible();
  });

  it('reflects checked state', async () => {
    const screen = render(<Switch label="On" defaultChecked />);
    await expect.element(screen.getByRole('switch')).toBeChecked();
  });

  it('sets aria-invalid when error is truthy', async () => {
    const screen = render(<Switch label="Err" error />);
    await expect.element(screen.getByRole('switch')).toHaveAttribute('aria-invalid', 'true');
  });

  /* ------------------------------------------------------------------ */
  /*  6. Label association                                                */
  /* ------------------------------------------------------------------ */
  it('toggles when label is clicked', async () => {
    const screen = render(<Switch label="Click label" />);
    const sw = screen.getByRole('switch');
    await expect.element(sw).not.toBeChecked();
    await screen.getByText('Click label').click();
    await expect.element(sw).toBeChecked();
  });

  /* ------------------------------------------------------------------ */
  /*  7. Uncontrolled toggle                                              */
  /* ------------------------------------------------------------------ */
  it('toggles on/off in uncontrolled mode', async () => {
    const screen = render(<Switch label="Toggle" />);
    const sw = screen.getByRole('switch');
    await expect.element(sw).not.toBeChecked();
    await sw.click();
    await expect.element(sw).toBeChecked();
    await sw.click();
    await expect.element(sw).not.toBeChecked();
  });

  /* ------------------------------------------------------------------ */
  /*  8. Loading state                                                    */
  /* ------------------------------------------------------------------ */
  it('is non-interactive when loading', async () => {
    const onCheckedChange = vi.fn();
    const screen = render(<Switch label="Loading" loading onCheckedChange={onCheckedChange} />);
    await expect.element(screen.getByRole('switch')).toBeDisabled();
  });

  /* ------------------------------------------------------------------ */
  /*  9. Sizes                                                            */
  /* ------------------------------------------------------------------ */
  it('renders all sizes without error', async () => {
    const sizes = ['sm', 'md', 'lg'] as const;
    for (const size of sizes) {
      const screen = render(<Switch label={size} size={size} />);
      await expect.element(screen.getByRole('switch')).toBeVisible();
      screen.unmount();
    }
  });

  /* ------------------------------------------------------------------ */
  /*  10. Focus management                                                */
  /* ------------------------------------------------------------------ */
  it('is focusable via tab', async () => {
    const screen = render(<Switch label="Focusable" />);
    await userEvent.keyboard('{Tab}');
    expect(document.activeElement).toBe(screen.getByRole('switch').element());
  });
});
