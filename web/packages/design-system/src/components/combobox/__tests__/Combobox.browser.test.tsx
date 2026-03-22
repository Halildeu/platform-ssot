import { describe, it, expect, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { userEvent } from 'vitest/browser';
import { Combobox } from '../Combobox';

const options = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
  { label: 'Cherry', value: 'cherry' },
];

describe('Combobox (Browser)', () => {
  it('renders label and placeholder', async () => {
    render(
      <Combobox label="Fruit" placeholder="Select a fruit" options={options} />,
    );
    await expect.element(screen.getByText('Fruit')).toBeVisible();
    await expect.element(screen.getByPlaceholderText('Select a fruit')).toBeVisible();
  });

  it('shows options when opened and filters on type', async () => {
    render(
      <Combobox label="Fruit" options={options} placeholder="Search..." />,
    );
    const input = screen.getByPlaceholderText('Search...');
    await input.click();
    await expect.element(screen.getByText('Apple')).toBeVisible();
    await expect.element(screen.getByText('Banana')).toBeVisible();
    await userEvent.type(input.element(), 'ch');
    await expect.element(screen.getByText('Cherry')).toBeVisible();
  });

  it('selects option and fires onValueChange', async () => {
    const onValueChange = vi.fn();
    render(
      <Combobox label="Fruit" options={options} onValueChange={onValueChange} defaultOpen />,
    );
    await screen.getByText('Banana').click();
    expect(onValueChange).toHaveBeenCalledWith('banana', expect.objectContaining({ value: 'banana' }));
  });

  it('navigates options with keyboard and selects with Enter', async () => {
    const onValueChange = vi.fn();
    render(
      <Combobox label="Fruit" options={options} onValueChange={onValueChange} placeholder="Pick" />,
    );
    const input = screen.getByPlaceholderText('Pick');
    await input.click();
    await userEvent.keyboard('{ArrowDown}');
    await userEvent.keyboard('{ArrowDown}');
    await userEvent.keyboard('{Enter}');
    expect(onValueChange).toHaveBeenCalled();
  });

  it('closes dropdown on Escape', async () => {
    render(
      <Combobox label="Fruit" options={options} defaultOpen />,
    );
    await expect.element(screen.getByText('Apple')).toBeVisible();
    await userEvent.keyboard('{Escape}');
    // After escape the listbox should be hidden
    expect(document.querySelector('[role="listbox"]')).toBeNull();
  });

  it('renders combobox ARIA role and attributes', async () => {
    render(
      <Combobox label="Fruit" options={options} placeholder="Pick" />,
    );
    const input = screen.getByRole('combobox');
    await expect.element(input).toBeVisible();
    await expect.element(input).toHaveAttribute('aria-autocomplete', 'list');
  });

  it('shows error message when error prop is provided', async () => {
    render(
      <Combobox label="Fruit" options={options} error="Selection required" />,
    );
    await expect.element(screen.getByText('Selection required')).toBeVisible();
  });

  it('shows loading state', async () => {
    render(
      <Combobox label="Fruit" options={[]} loading defaultOpen />,
    );
    await expect.element(screen.getByText('Loading...')).toBeVisible();
  });

  it('shows no-options text when nothing matches', async () => {
    render(
      <Combobox label="Fruit" options={options} placeholder="Search..." noOptionsText="No results" />,
    );
    const input = screen.getByPlaceholderText('Search...');
    await input.click();
    await userEvent.type(input.element(), 'zzzzz');
    await expect.element(screen.getByText('No results')).toBeVisible();
  });
});
