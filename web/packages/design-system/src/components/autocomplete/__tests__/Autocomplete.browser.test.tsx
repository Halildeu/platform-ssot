import { describe, it, expect, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { userEvent } from '@vitest/browser/context';
import { Autocomplete } from '../Autocomplete';

const options = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
];

describe('Autocomplete (Browser)', () => {
  it('renders with placeholder and combobox role', async () => {
    const screen = render(<Autocomplete options={options} placeholder="Search fruit" />);
    const input = screen.getByRole('combobox');
    await expect.element(input).toBeVisible();
    await expect.element(input).toHaveAttribute('placeholder', 'Search fruit');
  });

  it('shows filtered suggestions when typing', async () => {
    const screen = render(<Autocomplete options={options} />);
    const input = screen.getByRole('combobox');
    await input.click();
    await userEvent.type(input.element(), 'ban');
    await expect.element(screen.getByText('Banana')).toBeVisible();
    expect(screen.container.querySelectorAll('[role="option"]')).toHaveLength(1);
  });

  it('selects option on click and fires onChange', async () => {
    const onChange = vi.fn();
    const screen = render(<Autocomplete options={options} onChange={onChange} />);
    const input = screen.getByRole('combobox');
    await input.click();
    await screen.getByText('Apple').click();
    expect(onChange).toHaveBeenCalledWith('apple');
  });

  it('navigates options with ArrowDown/ArrowUp and selects with Enter', async () => {
    const onChange = vi.fn();
    const screen = render(<Autocomplete options={options} onChange={onChange} />);
    const input = screen.getByRole('combobox');
    await input.click();
    await userEvent.keyboard('{ArrowDown}');
    await userEvent.keyboard('{ArrowDown}');
    await userEvent.keyboard('{Enter}');
    expect(onChange).toHaveBeenCalledWith('banana');
  });

  it('closes dropdown on Escape', async () => {
    const screen = render(<Autocomplete options={options} />);
    const input = screen.getByRole('combobox');
    await input.click();
    await expect.element(screen.getByRole('listbox')).toBeVisible();
    await userEvent.keyboard('{Escape}');
    expect(screen.container.querySelector('[role="listbox"]')).toBeNull();
  });

  it('blocks interaction when disabled', async () => {
    const onChange = vi.fn();
    const screen = render(<Autocomplete options={options} disabled onChange={onChange} />);
    const input = screen.getByRole('combobox');
    await expect.element(input).toBeDisabled();
    await userEvent.type(input.element(), 'a');
    expect(onChange).not.toHaveBeenCalled();
  });

  it('renders ARIA attributes for expanded/controls', async () => {
    const screen = render(<Autocomplete options={options} />);
    const input = screen.getByRole('combobox');
    await expect.element(input).toHaveAttribute('aria-expanded', 'false');
    await expect.element(input).toHaveAttribute('aria-autocomplete', 'list');
    await input.click();
    await expect.element(input).toHaveAttribute('aria-expanded', 'true');
  });

  it('shows loading state instead of options', async () => {
    const screen = render(<Autocomplete options={[]} loading />);
    const input = screen.getByRole('combobox');
    await input.click();
    await expect.element(screen.getByText('Loading...')).toBeVisible();
  });

  it('shows error message when error prop is set', async () => {
    const screen = render(<Autocomplete options={options} error="Required field" />);
    await expect.element(screen.getByText('Required field')).toBeVisible();
    const input = screen.getByRole('combobox');
    await expect.element(input).toHaveAttribute('aria-invalid', 'true');
  });
});
