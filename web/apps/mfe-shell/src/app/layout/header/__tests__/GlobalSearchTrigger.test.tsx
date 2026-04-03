// @vitest-environment jsdom
import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { GlobalSearchTrigger } from '../GlobalSearchTrigger';

/* ---- mocks ---- */

const mockOpen = vi.fn();
const mockClose = vi.fn();
const mockSetQuery = vi.fn();
const mockHandleSelect = vi.fn();

vi.mock('../useGlobalSearch', () => ({
  useGlobalSearch: () => ({
    isOpen: false,
    open: mockOpen,
    close: mockClose,
    items: [],
    query: '',
    setQuery: mockSetQuery,
    handleSelect: mockHandleSelect,
  }),
}));

vi.mock('../../../i18n', () => ({
  useShellCommonI18n: () => ({
    t: (key: string) => {
      const map: Record<string, string> = {
        'shell.search.trigger': 'Search',
        'shell.search.placeholder': 'Search pages...',
        'shell.search.palettePlaceholder': 'Type to search...',
        'shell.search.noResults': 'No results',
        'shell.search.title': 'Search',
      };
      return map[key] ?? key;
    },
  }),
}));

vi.mock('@mfe/design-system', async () => {
  const actual = await vi.importActual<Record<string, unknown>>('@mfe/design-system');
  return {
    ...actual,
    CommandPalette: ({ open }: { open: boolean }) =>
      open ? <div data-testid="command-palette" /> : null,
  };
});

/* ---- tests ---- */

describe('GlobalSearchTrigger', () => {
  it('renders search trigger button with aria-label', () => {
    render(<GlobalSearchTrigger />);
    expect(screen.getByLabelText('Search')).toBeInTheDocument();
  });

  it('calls open on trigger click', () => {
    render(<GlobalSearchTrigger />);
    fireEvent.click(screen.getByLabelText('Search'));
    expect(mockOpen).toHaveBeenCalled();
  });

  it('shows keyboard shortcut hint', () => {
    render(<GlobalSearchTrigger />);
    // Either ⌘K or Ctrl+K depending on platform
    const kbd = screen.getByText(/(⌘K|Ctrl\+K)/);
    expect(kbd).toBeInTheDocument();
  });
});
