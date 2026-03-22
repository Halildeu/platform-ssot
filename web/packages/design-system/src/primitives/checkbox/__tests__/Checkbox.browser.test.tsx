import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { Checkbox } from '../Checkbox';

describe('Checkbox (Browser)', () => {
  it('renders with label', async () => {
    const screen = render(<Checkbox label="Accept terms" />);
    await expect.element(screen.getByText('Accept terms')).toBeVisible();
  });

  it('toggles checked state in uncontrolled mode', async () => {
    const screen = render(<Checkbox label="Toggle me" />);
    const checkbox = screen.getByRole('checkbox');
    await expect.element(checkbox).not.toBeChecked();
    await checkbox.click();
    await expect.element(checkbox).toBeChecked();
  });

  it('is disabled when disabled prop is set', async () => {
    const screen = render(<Checkbox label="Disabled" disabled />);
    const checkbox = screen.getByRole('checkbox');
    await expect.element(checkbox).toBeDisabled();
  });
});
