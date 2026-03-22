import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { Rating } from '../Rating';

describe('Rating (Browser)', () => {
  it('renders 5 stars by default', async () => {
    const screen = render(<Rating />);
    const group = screen.getByRole('radiogroup');
    await expect.element(group).toBeVisible();
    const stars = screen.container.querySelectorAll('[role="radio"]');
    expect(stars).toHaveLength(5);
  });

  it('renders with initial value', async () => {
    const screen = render(<Rating defaultValue={3} showValue />);
    await expect.element(screen.getByText('3')).toBeVisible();
  });

  it('renders custom max stars', async () => {
    const screen = render(<Rating max={10} />);
    const stars = screen.container.querySelectorAll('[role="radio"]');
    expect(stars).toHaveLength(10);
  });
});
