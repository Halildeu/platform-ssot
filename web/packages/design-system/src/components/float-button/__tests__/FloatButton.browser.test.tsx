import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { FloatButton } from '../FloatButton';

describe('FloatButton (Browser)', () => {
  it('renders floating button', async () => {
    const screen = render(<FloatButton />);
    await expect.element(screen.getByTestId('float-button-trigger')).toBeVisible();
  });

  it('renders with custom label', async () => {
    const screen = render(<FloatButton label="Add" />);
    await expect.element(screen.getByText('Add')).toBeVisible();
  });
});
