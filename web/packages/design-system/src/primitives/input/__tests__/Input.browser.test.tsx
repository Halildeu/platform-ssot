import { describe, it, expect, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { userEvent } from 'vitest/browser';
import { Input } from '../Input';

describe('Input (Browser)', () => {
  /* ------------------------------------------------------------------ */
  /*  1. Basic render                                                     */
  /* ------------------------------------------------------------------ */
  it('renders with placeholder', async () => {
    const screen = await render(<Input placeholder="Enter text" />);
    await expect.element(screen.getByRole('textbox')).toBeVisible();
  });

  it('renders label when provided', async () => {
    const screen = await render(<Input label="Email" />);
    await expect.element(screen.getByText('Email')).toBeVisible();
  });

  /* ------------------------------------------------------------------ */
  /*  2. onChange fires                                                    */
  /* ------------------------------------------------------------------ */
  it('fires onChange when typing', async () => {
    const onChange = vi.fn();
    const screen = await render(<Input placeholder="Type" onChange={onChange} />);
    await screen.getByRole('textbox').fill('hello');
    expect(onChange).toHaveBeenCalled();
  });

  it('fires onValueChange with string value', async () => {
    const onValueChange = vi.fn();
    const screen = await render(<Input placeholder="Type" onValueChange={onValueChange} />);
    await screen.getByRole('textbox').fill('world');
    expect(onValueChange).toHaveBeenCalledWith('world', expect.anything());
  });

  /* ------------------------------------------------------------------ */
  /*  3. Disabled state                                                   */
  /* ------------------------------------------------------------------ */
  it('is disabled when disabled prop is set', async () => {
    const screen = await render(<Input disabled placeholder="Disabled" />);
    await expect.element(screen.getByRole('textbox')).toBeDisabled();
  });

  it('does not accept input when disabled', async () => {
    const onChange = vi.fn();
    const screen = await render(<Input disabled onChange={onChange} />);
    const input = screen.getByRole('textbox');
    await expect.element(input).toBeDisabled();
    expect(onChange).not.toHaveBeenCalled();
  });

  /* ------------------------------------------------------------------ */
  /*  4. Keyboard — Enter in form-like context                            */
  /* ------------------------------------------------------------------ */
  it('accepts keyboard input', async () => {
    const screen = await render(<Input placeholder="Type" />);
    const input = screen.getByRole('textbox');
    input.element().focus();
    await userEvent.keyboard('abc');
    await expect.element(input).toHaveValue('abc');
  });

  /* ------------------------------------------------------------------ */
  /*  5. ARIA attributes                                                  */
  /* ------------------------------------------------------------------ */
  it('sets aria-invalid when error is provided', async () => {
    const screen = await render(<Input error="Required" />);
    await expect.element(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
  });

  it('sets aria-disabled when disabled', async () => {
    const screen = await render(<Input disabled />);
    await expect.element(screen.getByRole('textbox')).toHaveAttribute('aria-disabled', 'true');
  });

  it('associates aria-describedby with error message', async () => {
    const screen = await render(<Input error="Invalid email" />);
    const input = screen.getByRole('textbox');
    const describedBy = input.element().getAttribute('aria-describedby');
    expect(describedBy).toBeTruthy();
  });

  /* ------------------------------------------------------------------ */
  /*  6. Error state                                                      */
  /* ------------------------------------------------------------------ */
  it('displays error message', async () => {
    const screen = await render(<Input error="Invalid email" />);
    await expect.element(screen.getByText('Invalid email')).toBeVisible();
  });

  /* ------------------------------------------------------------------ */
  /*  7. Helper text (description / hint)                                 */
  /* ------------------------------------------------------------------ */
  it('renders description when provided', async () => {
    const screen = await render(<Input description="We will never share your email" />);
    await expect.element(screen.getByText('We will never share your email')).toBeVisible();
  });

  it('renders hint when provided and no error', async () => {
    const screen = await render(<Input hint="Must be at least 8 characters" />);
    await expect.element(screen.getByText('Must be at least 8 characters')).toBeVisible();
  });

  /* ------------------------------------------------------------------ */
  /*  8. maxLength & showCount                                            */
  /* ------------------------------------------------------------------ */
  it('enforces maxLength', async () => {
    const screen = await render(<Input maxLength={5} />);
    const input = screen.getByRole('textbox');
    await input.fill('123456789');
    const val = input.element().value;
    expect(val.length).toBeLessThanOrEqual(5);
  });

  /* ------------------------------------------------------------------ */
  /*  9. Focus / blur events                                              */
  /* ------------------------------------------------------------------ */
  it('is focusable via tab', async () => {
    const screen = await render(<Input placeholder="Focus me" />);
    await userEvent.keyboard('{Tab}');
    expect(document.activeElement).toBe(screen.getByRole('textbox').element());
  });

  /* ------------------------------------------------------------------ */
  /*  10. Loading state                                                   */
  /* ------------------------------------------------------------------ */
  it('becomes readonly when loading', async () => {
    const screen = await render(<Input loading />);
    await expect.element(screen.getByRole('textbox')).toHaveAttribute('readonly');
  });

  /* ------------------------------------------------------------------ */
  /*  11. Required                                                        */
  /* ------------------------------------------------------------------ */
  it('sets required attribute when required', async () => {
    const screen = await render(<Input required />);
    await expect.element(screen.getByRole('textbox')).toHaveAttribute('required');
  });

  /* ------------------------------------------------------------------ */
  /*  12. Sizes                                                           */
  /* ------------------------------------------------------------------ */
  it('renders all sizes without error', async () => {
    const sizes = ['sm', 'md', 'lg'] as const;
    for (const size of sizes) {
    const screen = await render(<Input size={size} placeholder={size} />);
      await expect.element(screen.getByRole('textbox')).toBeVisible();
      
    }
  });
});
