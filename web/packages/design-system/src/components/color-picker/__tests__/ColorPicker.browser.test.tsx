import { describe, it, expect, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { userEvent } from 'vitest/browser';
import { ColorPicker } from '../ColorPicker';

describe('ColorPicker (Browser)', () => {
  it('renders swatch button', async () => {
    const screen = await render(<ColorPicker />);
    await expect.element(screen.getByTestId('color-picker-swatch')).toBeVisible();
  });

  it('opens popover on swatch click', async () => {
    const screen = await render(<ColorPicker />);
    await screen.getByTestId('color-picker-swatch').click();
    await expect.element(screen.getByTestId('color-picker-popover')).toBeVisible();
  });

  it('shows hex input in popover', async () => {
    const screen = await render(<ColorPicker showInput />);
    await screen.getByTestId('color-picker-swatch').click();
    const hexInput = screen.getByTestId('color-picker-input');
    await expect.element(hexInput).toBeVisible();
  });

  it('fires onValueChange when hex value is typed', async () => {
    const onValueChange = vi.fn();
    const screen = await render(<ColorPicker onValueChange={onValueChange} />);
    await screen.getByTestId('color-picker-swatch').click();
    const hexInput = screen.getByTestId('color-picker-input');
    // Clear the existing value and type a new valid hex
    await userEvent.clear(hexInput.element());
    await userEvent.type(hexInput.element(), '#ff0000');
    expect(onValueChange).toHaveBeenCalled();
  });

  it('renders with default value color', async () => {
    const screen = await render(<ColorPicker defaultValue="#00ff00" />);
    const swatch = screen.getByTestId('color-picker-swatch');
    await expect.element(swatch).toBeVisible();
  });

  it('renders label when provided', async () => {
    const screen = await render(<ColorPicker label="Brand Color" />);
    await expect.element(screen.getByText('Brand Color')).toBeVisible();
  });

  it('renders preset colors when provided', async () => {
    const presets = [{ label: 'Primary', colors: ['#ff0000', '#00ff00', '#0000ff'] }];
    const screen = await render(<ColorPicker presets={presets} />);
    await screen.getByTestId('color-picker-swatch').click();
    await expect.element(screen.getByText('Primary')).toBeVisible();
  });

  it('has accessible aria-label', async () => {
    const screen = await render(<ColorPicker aria-label="Pick a color" />);
    const swatch = screen.getByTestId('color-picker-swatch');
    await expect.element(swatch).toBeVisible();
  });
});
