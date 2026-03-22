import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { Slider } from '../Slider';

describe('Slider (Browser)', () => {
  it('renders range input', async () => {
    const screen = render(<Slider defaultValue={50} />);
    const input = screen.container.querySelector('input[type="range"]');
    expect(input).not.toBeNull();
  });

  it('shows min and max labels', async () => {
    const screen = render(<Slider min={0} max={100} defaultValue={50} />);
    await expect.element(screen.getByText('0')).toBeVisible();
    await expect.element(screen.getByText('100')).toBeVisible();
  });
});
