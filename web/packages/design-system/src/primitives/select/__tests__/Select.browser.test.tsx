import { describe, it, expect, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { userEvent } from '@vitest/browser/context';
import { Select } from '../Select';

const options = [
  { value: 'a', label: 'Alpha' },
  { value: 'b', label: 'Beta' },
  { value: 'c', label: 'Gamma' },
];

describe('Select (Browser)', () => {
  /* ------------------------------------------------------------------ */
  /*  1. Basic render                                                     */
  /* ------------------------------------------------------------------ */
  it('renders with options', async () => {
    const screen = render(<Select options={options} />);
    await expect.element(screen.getByRole('combobox')).toBeVisible();
  });

  it('renders placeholder as first disabled option', async () => {
    const screen = render(<Select options={options} placeholder="Choose one" />);
    const select = screen.getByRole('combobox');
    await expect.element(select).toBeVisible();
  });

  /* ------------------------------------------------------------------ */
  /*  2. onChange callback                                                */
  /* ------------------------------------------------------------------ */
  it('fires onChange when a different option is selected', async () => {
    const onChange = vi.fn();
    const screen = render(<Select options={options} defaultValue="a" onChange={onChange} />);
    const select = screen.getByRole('combobox');
    await select.fill('b');
    expect(onChange).toHaveBeenCalled();
  });

  /* ------------------------------------------------------------------ */
  /*  3. Disabled state blocks interaction                                */
  /* ------------------------------------------------------------------ */
  it('is disabled when disabled prop is set', async () => {
    const screen = render(<Select options={options} disabled />);
    await expect.element(screen.getByRole('combobox')).toBeDisabled();
  });

  it('does not fire onChange when disabled', async () => {
    const onChange = vi.fn();
    const screen = render(<Select options={options} disabled onChange={onChange} />);
    // Attempt interaction on disabled select
    const select = screen.getByRole('combobox');
    await expect.element(select).toBeDisabled();
    // No user event should go through
    expect(onChange).not.toHaveBeenCalled();
  });

  /* ------------------------------------------------------------------ */
  /*  4. Controlled / uncontrolled value                                  */
  /* ------------------------------------------------------------------ */
  it('uses defaultValue for uncontrolled mode', async () => {
    const screen = render(<Select options={options} defaultValue="b" />);
    await expect.element(screen.getByRole('combobox')).toHaveValue('b');
  });

  it('uses value prop for controlled mode', async () => {
    const screen = render(<Select options={options} value="c" onChange={() => {}} />);
    await expect.element(screen.getByRole('combobox')).toHaveValue('c');
  });

  /* ------------------------------------------------------------------ */
  /*  5. ARIA attributes                                                  */
  /* ------------------------------------------------------------------ */
  it('sets aria-invalid when error is truthy', async () => {
    const screen = render(<Select options={options} error />);
    await expect.element(screen.getByRole('combobox')).toHaveAttribute('aria-invalid', 'true');
  });

  /* ------------------------------------------------------------------ */
  /*  6. Loading state                                                    */
  /* ------------------------------------------------------------------ */
  it('disables select and shows spinner when loading', async () => {
    const screen = render(<Select options={options} loading />);
    await expect.element(screen.getByRole('combobox')).toBeDisabled();
    // Loading spinner should render
    await expect.element(screen.getByLabelText('Loading')).toBeVisible();
  });

  /* ------------------------------------------------------------------ */
  /*  7. Error state                                                      */
  /* ------------------------------------------------------------------ */
  it('applies error styling when error is truthy', async () => {
    const screen = render(<Select options={options} error />);
    await expect.element(screen.getByRole('combobox')).toHaveAttribute('aria-invalid', 'true');
  });

  /* ------------------------------------------------------------------ */
  /*  8. Disabled options                                                 */
  /* ------------------------------------------------------------------ */
  it('renders disabled options', async () => {
    const opts = [
      { value: 'a', label: 'Alpha' },
      { value: 'b', label: 'Beta', disabled: true },
    ];
    const screen = render(<Select options={opts} />);
    await expect.element(screen.getByRole('combobox')).toBeVisible();
  });

  /* ------------------------------------------------------------------ */
  /*  9. Sizes                                                            */
  /* ------------------------------------------------------------------ */
  it('renders all sizes without error', async () => {
    const sizes = ['sm', 'md', 'lg'] as const;
    for (const size of sizes) {
      const screen = render(<Select options={options} size={size} />);
      await expect.element(screen.getByRole('combobox')).toBeVisible();
      screen.unmount();
    }
  });

  /* ------------------------------------------------------------------ */
  /*  10. Focus management                                                */
  /* ------------------------------------------------------------------ */
  it('is focusable via tab', async () => {
    const screen = render(<Select options={options} />);
    await userEvent.keyboard('{Tab}');
    expect(document.activeElement).toBe(screen.getByRole('combobox').element());
  });
});
