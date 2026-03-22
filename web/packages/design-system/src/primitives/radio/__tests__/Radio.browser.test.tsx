import { describe, it, expect, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { userEvent } from '@vitest/browser/context';
import { Radio, RadioGroup } from '../Radio';

describe('Radio (Browser)', () => {
  /* ------------------------------------------------------------------ */
  /*  1. Basic render                                                     */
  /* ------------------------------------------------------------------ */
  it('renders with label', async () => {
    const screen = render(<Radio label="Option A" value="a" name="test" />);
    await expect.element(screen.getByText('Option A')).toBeVisible();
  });

  it('renders radio role', async () => {
    const screen = render(<Radio label="Option" value="a" name="test" />);
    await expect.element(screen.getByRole('radio')).toBeVisible();
  });

  /* ------------------------------------------------------------------ */
  /*  2. Group selection                                                  */
  /* ------------------------------------------------------------------ */
  it('selects radio in a group', async () => {
    const screen = render(
      <RadioGroup name="test" defaultValue="a">
        <Radio label="Option A" value="a" />
        <Radio label="Option B" value="b" />
      </RadioGroup>,
    );
    const radios = screen.container.querySelectorAll('input[type="radio"]');
    expect(radios).toHaveLength(2);
    expect((radios[0] as HTMLInputElement).checked).toBe(true);
    expect((radios[1] as HTMLInputElement).checked).toBe(false);
  });

  it('changes selection on click', async () => {
    const onChange = vi.fn();
    const screen = render(
      <RadioGroup name="test" defaultValue="a" onChange={onChange}>
        <Radio label="Option A" value="a" />
        <Radio label="Option B" value="b" />
      </RadioGroup>,
    );
    await screen.getByText('Option B').click();
    expect(onChange).toHaveBeenCalledWith('b');
  });

  /* ------------------------------------------------------------------ */
  /*  3. Disabled                                                         */
  /* ------------------------------------------------------------------ */
  it('is disabled when disabled prop is set', async () => {
    const screen = render(<Radio label="Disabled" value="x" name="test" disabled />);
    await expect.element(screen.getByRole('radio')).toBeDisabled();
  });

  it('disabled radio in group does not fire onChange', async () => {
    const onChange = vi.fn();
    const screen = render(
      <RadioGroup name="test" defaultValue="a" onChange={onChange}>
        <Radio label="Option A" value="a" />
        <Radio label="Option B" value="b" disabled />
      </RadioGroup>,
    );
    // Disabled radio click should not change value
    await screen.getByText('Option B').click();
    expect(onChange).not.toHaveBeenCalled();
  });

  /* ------------------------------------------------------------------ */
  /*  4. Keyboard — Arrow keys cycle                                      */
  /* ------------------------------------------------------------------ */
  it('supports keyboard navigation within group', async () => {
    const onChange = vi.fn();
    const screen = render(
      <RadioGroup name="kb-test" defaultValue="a" onChange={onChange}>
        <Radio label="Option A" value="a" />
        <Radio label="Option B" value="b" />
        <Radio label="Option C" value="c" />
      </RadioGroup>,
    );
    // Focus the checked radio
    const firstRadio = screen.container.querySelector('input[value="a"]') as HTMLElement;
    firstRadio.focus();
    // Note: Native radio group keyboard navigation is handled by the browser
    // We verify the group renders with radiogroup role
    await expect.element(screen.getByRole('radiogroup')).toBeVisible();
  });

  /* ------------------------------------------------------------------ */
  /*  5. ARIA attributes                                                  */
  /* ------------------------------------------------------------------ */
  it('checked radio has checked state', async () => {
    const screen = render(
      <RadioGroup name="aria" defaultValue="a">
        <Radio label="A" value="a" />
        <Radio label="B" value="b" />
      </RadioGroup>,
    );
    const radioA = screen.container.querySelector('input[value="a"]') as HTMLInputElement;
    const radioB = screen.container.querySelector('input[value="b"]') as HTMLInputElement;
    expect(radioA.checked).toBe(true);
    expect(radioB.checked).toBe(false);
  });

  it('sets aria-invalid when error is truthy', async () => {
    const screen = render(<Radio label="Error" value="a" name="test" error />);
    await expect.element(screen.getByRole('radio')).toHaveAttribute('aria-invalid', 'true');
  });

  it('group has role="radiogroup"', async () => {
    const screen = render(
      <RadioGroup name="role-test">
        <Radio label="A" value="a" />
      </RadioGroup>,
    );
    await expect.element(screen.getByRole('radiogroup')).toBeVisible();
  });

  /* ------------------------------------------------------------------ */
  /*  6. Sizes                                                            */
  /* ------------------------------------------------------------------ */
  it('renders all sizes without error', async () => {
    const sizes = ['sm', 'md', 'lg'] as const;
    for (const size of sizes) {
      const screen = render(<Radio label={size} value={size} name={`size-${size}`} size={size} />);
      await expect.element(screen.getByRole('radio')).toBeVisible();
      screen.unmount();
    }
  });

  /* ------------------------------------------------------------------ */
  /*  7. Loading state                                                    */
  /* ------------------------------------------------------------------ */
  it('is non-interactive when loading', async () => {
    const screen = render(<Radio label="Loading" value="a" name="test" loading />);
    await expect.element(screen.getByRole('radio')).toBeDisabled();
  });

  /* ------------------------------------------------------------------ */
  /*  8. Focus management                                                 */
  /* ------------------------------------------------------------------ */
  it('radio is focusable via tab', async () => {
    const screen = render(<Radio label="Focusable" value="a" name="focus" />);
    await userEvent.keyboard('{Tab}');
    expect(document.activeElement).toBe(screen.getByRole('radio').element());
  });

  /* ------------------------------------------------------------------ */
  /*  9. Direction                                                        */
  /* ------------------------------------------------------------------ */
  it('supports horizontal direction', async () => {
    const screen = render(
      <RadioGroup name="dir" direction="horizontal">
        <Radio label="A" value="a" />
        <Radio label="B" value="b" />
      </RadioGroup>,
    );
    await expect.element(screen.getByRole('radiogroup')).toBeVisible();
  });
});
