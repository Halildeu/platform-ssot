import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { Combobox } from '../Combobox';

const options = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
  { label: 'Cherry', value: 'cherry' },
];

describe('Combobox (Browser)', () => {
  it('renders with label and placeholder', async () => {
    const screen = render(
      <Combobox label="Fruit" placeholder="Select a fruit" options={options} />,
    );
    await expect.element(screen.getByText('Fruit')).toBeVisible();
  });

  it('renders input element', async () => {
    const screen = render(
      <Combobox label="Pick" options={options} placeholder="Search..." />,
    );
    const input = screen.getByPlaceholderText('Search...');
    await expect.element(input).toBeVisible();
  });

  it('shows options when opened', async () => {
    const screen = render(
      <Combobox label="Fruit" options={options} defaultOpen />,
    );
    await expect.element(screen.getByText('Apple')).toBeVisible();
  });
});
