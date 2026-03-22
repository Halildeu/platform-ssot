import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { Autocomplete } from '../Autocomplete';

const options = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
];

describe('Autocomplete (Browser)', () => {
  it('renders with placeholder', async () => {
    const screen = render(<Autocomplete options={options} placeholder="Search fruit" />);
    await expect.element(screen.getByPlaceholderText('Search fruit')).toBeVisible();
  });

  it('renders combobox role', async () => {
    const screen = render(<Autocomplete options={options} />);
    await expect.element(screen.getByRole('combobox')).toBeVisible();
  });
});
