import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { Cascader } from '../Cascader';

const options = [
  { value: 'asia', label: 'Asia', children: [
    { value: 'china', label: 'China' },
    { value: 'japan', label: 'Japan' },
  ]},
  { value: 'europe', label: 'Europe', children: [
    { value: 'germany', label: 'Germany' },
  ]},
];

describe('Cascader (Browser)', () => {
  it('renders trigger with placeholder', async () => {
    const screen = render(<Cascader options={options} placeholder="Select region" />);
    await expect.element(screen.getByRole('combobox')).toBeVisible();
    await expect.element(screen.getByText('Select region')).toBeVisible();
  });

  it('opens dropdown on click', async () => {
    const screen = render(<Cascader options={options} />);
    await screen.getByRole('combobox').click();
    await expect.element(screen.getByRole('listbox')).toBeVisible();
  });
});
