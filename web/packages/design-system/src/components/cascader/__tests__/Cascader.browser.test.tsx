import { describe, it, expect, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { userEvent } from '@vitest/browser/context';
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

  it('opens dropdown on click and shows top-level options', async () => {
    const screen = render(<Cascader options={options} />);
    await screen.getByRole('combobox').click();
    await expect.element(screen.getByRole('listbox')).toBeVisible();
    await expect.element(screen.getByText('Asia')).toBeVisible();
    await expect.element(screen.getByText('Europe')).toBeVisible();
  });

  it('shows child options when parent is clicked', async () => {
    const screen = render(<Cascader options={options} />);
    await screen.getByRole('combobox').click();
    await screen.getByText('Asia').click();
    await expect.element(screen.getByText('China')).toBeVisible();
    await expect.element(screen.getByText('Japan')).toBeVisible();
  });

  it('fires onValueChange when leaf is selected', async () => {
    const onValueChange = vi.fn();
    const screen = render(<Cascader options={options} onValueChange={onValueChange} />);
    await screen.getByRole('combobox').click();
    await screen.getByText('Asia').click();
    await screen.getByText('China').click();
    expect(onValueChange).toHaveBeenCalledWith(
      ['asia', 'china'],
      expect.anything(),
    );
  });

  it('closes dropdown on Escape', async () => {
    const screen = render(<Cascader options={options} />);
    await screen.getByRole('combobox').click();
    await expect.element(screen.getByRole('listbox')).toBeVisible();
    await userEvent.keyboard('{Escape}');
    expect(screen.container.querySelector('[role="listbox"]')).toBeNull();
  });

  it('renders with label', async () => {
    const screen = render(<Cascader options={options} label="Region" />);
    await expect.element(screen.getByText('Region')).toBeVisible();
  });

  it('displays selected value in trigger', async () => {
    const screen = render(<Cascader options={options} defaultValue={['asia', 'china']} />);
    await expect.element(screen.getByText('Asia / China')).toBeVisible();
  });

  it('supports searchable mode', async () => {
    const screen = render(<Cascader options={options} searchable />);
    await screen.getByRole('combobox').click();
    await userEvent.type(screen.getByRole('combobox').element(), 'Ger');
    await expect.element(screen.getByText('Germany')).toBeVisible();
  });
});
