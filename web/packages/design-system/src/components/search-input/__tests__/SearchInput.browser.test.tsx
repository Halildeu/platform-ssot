import { describe, it, expect, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { page, userEvent } from 'vitest/browser';
import { SearchInput } from '../SearchInput';

describe('SearchInput (Browser)', () => {
  it('renders with placeholder', async () => {
    await render(<SearchInput placeholder="Search..." />);
    await expect.element(page.getByPlaceholder('Search...')).toBeVisible();
  });

  it('renders search input type', async () => {
    await render(<SearchInput placeholder="Search..." />);
    const input = document.querySelector('input[type="search"]');
    expect(input).not.toBeNull();
  });

  it('shows clear button when value is present and fires onClear', async () => {
    const onClear = vi.fn();
    const screen = await render(
      <SearchInput value="test query" onChange={() => {}} onClear={onClear} />,
    );
    const clearBtn = screen.getByLabelText('Clear search');
    await expect.element(clearBtn).toBeVisible();
    await clearBtn.click();
    expect(onClear).toHaveBeenCalledOnce();
  });

  it('hides clear button when value is empty', async () => {
    await render(<SearchInput value="" onChange={() => {}} />);
    expect(document.querySelector('[aria-label="Clear search"]')).toBeNull();
  });

  it('is disabled when disabled prop is set', async () => {
    await render(<SearchInput placeholder="Disabled" disabled />);
    await expect.element(page.getByPlaceholder('Disabled')).toBeDisabled();
  });

  it('fires onChange on typing', async () => {
    const onChange = vi.fn();
    await render(<SearchInput placeholder="Type here" onChange={onChange} />);
    const input = page.getByPlaceholder('Type here');
    await userEvent.type(input.element(), 'hello');
    expect(onChange).toHaveBeenCalled();
  });

  it('shows shortcut hint when no value', async () => {
    const screen = await render(<SearchInput shortcutHint="⌘K" value="" onChange={() => {}} />);
    await expect.element(screen.getByText('⌘K')).toBeVisible();
  });

  it('shows loading spinner instead of clear button', async () => {
    await render(
      <SearchInput value="loading" onChange={() => {}} loading />,
    );
    // Loading state should show spinner, not clear button
    expect(document.querySelector('[aria-label="Clear search"]')).toBeNull();
    const spinner = document.querySelector('.animate-spin');
    expect(spinner).not.toBeNull();
  });
});
