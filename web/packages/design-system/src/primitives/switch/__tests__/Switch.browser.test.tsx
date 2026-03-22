import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { Switch } from '../Switch';

describe('Switch (Browser)', () => {
  it('renders with label', async () => {
    const screen = render(<Switch label="Enable notifications" />);
    await expect.element(screen.getByText('Enable notifications')).toBeVisible();
  });

  it('toggles on/off in uncontrolled mode', async () => {
    const screen = render(<Switch label="Toggle" />);
    const toggle = screen.getByRole('switch');
    await expect.element(toggle).not.toBeChecked();
    await toggle.click();
    await expect.element(toggle).toBeChecked();
  });

  it('is disabled when disabled prop is set', async () => {
    const screen = render(<Switch label="Disabled" disabled />);
    const toggle = screen.getByRole('switch');
    await expect.element(toggle).toBeDisabled();
  });
});
