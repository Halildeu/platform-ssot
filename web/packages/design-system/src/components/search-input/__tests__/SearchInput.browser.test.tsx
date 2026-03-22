import { describe, it, expect, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { SearchInput } from '../SearchInput';

describe('SearchInput (Browser)', () => {
  it('renders with placeholder', async () => {
    const screen = render(<SearchInput placeholder="Search..." />);
    const input = screen.getByPlaceholderText('Search...');
    await expect.element(input).toBeVisible();
  });

  it('shows clear button when value is present', async () => {
    const screen = render(
      <SearchInput value="test query" onChange={() => {}} onClear={() => {}} />,
    );
    const clearBtn = screen.getByLabelText('Clear search');
    await expect.element(clearBtn).toBeVisible();
  });

  it('is disabled when disabled prop is set', async () => {
    const screen = render(<SearchInput placeholder="Disabled" disabled />);
    const input = screen.getByPlaceholderText('Disabled');
    await expect.element(input).toBeDisabled();
  });
});
