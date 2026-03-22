import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { ColorPicker } from '../ColorPicker';

describe('ColorPicker (Browser)', () => {
  it('renders swatch button', async () => {
    const screen = render(<ColorPicker />);
    await expect.element(screen.getByTestId('color-picker-swatch')).toBeVisible();
  });

  it('opens popover on swatch click', async () => {
    const screen = render(<ColorPicker />);
    await screen.getByTestId('color-picker-swatch').click();
    await expect.element(screen.getByTestId('color-picker-popover')).toBeVisible();
  });
});
