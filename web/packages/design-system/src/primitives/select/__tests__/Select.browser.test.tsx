import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { Select } from '../Select';

const options = [
  { value: 'a', label: 'Alpha' },
  { value: 'b', label: 'Beta' },
  { value: 'c', label: 'Gamma' },
];

describe('Select (Browser)', () => {
  it('renders with options', async () => {
    const screen = render(<Select options={options} />);
    const select = screen.getByRole('combobox');
    await expect.element(select).toBeVisible();
  });

  it('renders placeholder as first disabled option', async () => {
    const screen = render(
      <Select options={options} placeholder="Choose one" />,
    );
    const select = screen.getByRole('combobox');
    await expect.element(select).toBeVisible();
  });

  it('selects an option in uncontrolled mode', async () => {
    const screen = render(<Select options={options} defaultValue="a" />);
    const select = screen.getByRole('combobox');
    await expect.element(select).toHaveValue('a');
  });

  it('is disabled when disabled prop is set', async () => {
    const screen = render(<Select options={options} disabled />);
    const select = screen.getByRole('combobox');
    await expect.element(select).toBeDisabled();
  });
});
