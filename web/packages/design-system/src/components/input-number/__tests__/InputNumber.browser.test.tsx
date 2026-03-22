import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { InputNumber } from '../InputNumber';

describe('InputNumber (Browser)', () => {
  it('renders spinbutton role', async () => {
    const screen = render(<InputNumber />);
    await expect.element(screen.getByRole('spinbutton')).toBeVisible();
  });

  it('renders increment and decrement buttons', async () => {
    const screen = render(<InputNumber defaultValue={5} />);
    await expect.element(screen.getByLabelText('Increment')).toBeVisible();
    await expect.element(screen.getByLabelText('Decrement')).toBeVisible();
  });
});
