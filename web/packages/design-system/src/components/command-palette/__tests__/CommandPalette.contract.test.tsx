// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CommandPalette, type CommandPaletteItem } from '../CommandPalette';
import { expectNoA11yViolations } from '../../../__tests__/a11y-utils';

afterEach(() => {
  cleanup();
});

/* ------------------------------------------------------------------ */
/*  Test data                                                          */
/* ------------------------------------------------------------------ */

const sampleItems: CommandPaletteItem[] = [
  { id: 'nav-1', title: 'Go to Dashboard', group: 'Navigation', shortcut: '⌘D', keywords: ['home', 'overview'] },
  { id: 'nav-2', title: 'Go to Settings', group: 'Navigation', shortcut: '⌘,' },
  { id: 'act-1', title: 'Create Policy', description: 'Start a new policy wizard', group: 'Actions' },
  { id: 'act-2', title: 'Run Analysis', description: 'AI-powered risk analysis', group: 'Actions', keywords: ['ai', 'risk'] },
  { id: 'act-3', title: 'Export Report', group: 'Actions', disabled: true },
];

/* ------------------------------------------------------------------ */
/*  Contract: Opens and renders search input                           */
/* ------------------------------------------------------------------ */

describe('CommandPalette contract — opens and renders search input', () => {
  it('renders a dialog with role="dialog" when open', () => {
    render(<CommandPalette open items={sampleItems} />);
    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveAttribute('aria-modal', 'true');
  });

  it('renders a text input for search', () => {
    render(<CommandPalette open items={sampleItems} />);
    const input = screen.getByRole('textbox');
    expect(input).toBeInTheDocument();
  });

  it('renders nothing when open=false', () => {
    const { container } = render(<CommandPalette open={false} items={sampleItems} />);
    expect(container.innerHTML).toBe('');
  });

  it('respects custom placeholder on the search input', () => {
    render(<CommandPalette open items={sampleItems} placeholder="Search commands..." />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('placeholder', 'Search commands...');
  });
});

/* ------------------------------------------------------------------ */
/*  Contract: Search filtering works                                   */
/* ------------------------------------------------------------------ */

describe('CommandPalette contract — search filtering', () => {
  it('filters items by title match', () => {
    render(<CommandPalette open items={sampleItems} query="Dashboard" />);
    expect(screen.getByText('Go to Dashboard')).toBeInTheDocument();
    expect(screen.queryByText('Go to Settings')).not.toBeInTheDocument();
    expect(screen.queryByText('Create Policy')).not.toBeInTheDocument();
  });

  it('filters items by keyword match', () => {
    render(<CommandPalette open items={sampleItems} query="risk" />);
    expect(screen.getByText('Run Analysis')).toBeInTheDocument();
    expect(screen.queryByText('Go to Dashboard')).not.toBeInTheDocument();
  });

  it('filters items by description match', () => {
    render(<CommandPalette open items={sampleItems} query="wizard" />);
    expect(screen.getByText('Create Policy')).toBeInTheDocument();
    expect(screen.queryByText('Run Analysis')).not.toBeInTheDocument();
  });

  it('shows empty state when no items match the query', () => {
    render(<CommandPalette open items={sampleItems} query="zzzznotfound" />);
    expect(screen.getByText('Eslesen komut bulunamadi.')).toBeInTheDocument();
  });

  it('fires onQueryChange when user types in the search input', async () => {
    const handleQueryChange = vi.fn();
    render(<CommandPalette open items={sampleItems} onQueryChange={handleQueryChange} />);
    await userEvent.clear(screen.getByRole('textbox'));
    await userEvent.type(screen.getByRole('textbox'), 'policy');
    expect(handleQueryChange).toHaveBeenCalledWith('policy');
  });

  it('shows all items when query is empty', () => {
    render(<CommandPalette open items={sampleItems} query="" />);
    expect(screen.getByText('Go to Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Go to Settings')).toBeInTheDocument();
    expect(screen.getByText('Create Policy')).toBeInTheDocument();
    expect(screen.getByText('Run Analysis')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Contract: Keyboard navigation                                      */
/* ------------------------------------------------------------------ */

describe('CommandPalette contract — keyboard navigation', () => {
  it('ArrowDown moves active index forward', () => {
    const handleSelect = vi.fn();
    render(<CommandPalette open items={sampleItems} onSelect={handleSelect} />);
    const input = screen.getByRole('textbox');
    // Initial active is index 0 (nav-1). Press ArrowDown to move to index 1.
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(handleSelect).toHaveBeenCalledWith('nav-2', sampleItems[1]);
  });

  it('ArrowUp moves active index backward', () => {
    const handleSelect = vi.fn();
    render(<CommandPalette open items={sampleItems} onSelect={handleSelect} />);
    const input = screen.getByRole('textbox');
    // Move down twice then up once: 0 -> 1 -> 2 -> 1
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    fireEvent.keyDown(input, { key: 'ArrowUp' });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(handleSelect).toHaveBeenCalledWith('nav-2', sampleItems[1]);
  });

  it('Enter selects the currently active item', () => {
    const handleSelect = vi.fn();
    render(<CommandPalette open items={sampleItems} onSelect={handleSelect} />);
    const input = screen.getByRole('textbox');
    fireEvent.keyDown(input, { key: 'Enter' });
    // Default active is the first non-disabled item
    expect(handleSelect).toHaveBeenCalledWith('nav-1', sampleItems[0]);
  });

  it('ArrowDown skips disabled items', () => {
    const handleSelect = vi.fn();
    render(<CommandPalette open items={sampleItems} onSelect={handleSelect} />);
    const input = screen.getByRole('textbox');
    // Items: nav-1(0), nav-2(1), act-1(2), act-2(3), act-3(4,disabled)
    // ArrowDown 4 times from 0: -> 1 -> 2 -> 3 -> skips 4 -> wraps to 0
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(handleSelect).toHaveBeenCalledWith('nav-1', sampleItems[0]);
  });

  it('Enter on a disabled item does not fire onSelect', () => {
    const disabledOnlyItems: CommandPaletteItem[] = [
      { id: 'd1', title: 'Disabled A', disabled: true },
      { id: 'd2', title: 'Disabled B', disabled: true },
    ];
    const handleSelect = vi.fn();
    render(<CommandPalette open items={disabledOnlyItems} onSelect={handleSelect} />);
    const input = screen.getByRole('textbox');
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(handleSelect).not.toHaveBeenCalled();
  });
});

/* ------------------------------------------------------------------ */
/*  Contract: Escape closes                                            */
/* ------------------------------------------------------------------ */

describe('CommandPalette contract — Escape closes', () => {
  it('pressing Escape fires onClose', () => {
    const handleClose = vi.fn();
    render(<CommandPalette open items={sampleItems} onClose={handleClose} />);
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('clicking the backdrop fires onClose', async () => {
    const handleClose = vi.fn();
    render(<CommandPalette open items={sampleItems} onClose={handleClose} />);
    const backdrop = document.querySelector('[role="presentation"]');
    expect(backdrop).not.toBeNull();
    await userEvent.click(backdrop!);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('clicking the close button fires onClose', async () => {
    const handleClose = vi.fn();
    render(<CommandPalette open items={sampleItems} onClose={handleClose} />);
    await userEvent.click(screen.getByLabelText('Close command palette'));
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('selecting an item also fires onClose', async () => {
    const handleClose = vi.fn();
    const handleSelect = vi.fn();
    render(
      <CommandPalette open items={sampleItems} onSelect={handleSelect} onClose={handleClose} />,
    );
    await userEvent.click(screen.getByText('Go to Dashboard'));
    expect(handleSelect).toHaveBeenCalledTimes(1);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});

/* ------------------------------------------------------------------ */
/*  Contract: Command groups render                                    */
/* ------------------------------------------------------------------ */

describe('CommandPalette contract — command groups render', () => {
  it('renders group headings from item.group values', () => {
    render(<CommandPalette open items={sampleItems} />);
    expect(screen.getByText('Navigation')).toBeInTheDocument();
    expect(screen.getByText('Actions')).toBeInTheDocument();
  });

  it('groups items correctly under their group headings', () => {
    render(<CommandPalette open items={sampleItems} />);
    // Navigation group should contain both nav items
    expect(screen.getByText('Go to Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Go to Settings')).toBeInTheDocument();
    // Actions group should contain its items
    expect(screen.getByText('Create Policy')).toBeInTheDocument();
    expect(screen.getByText('Run Analysis')).toBeInTheDocument();
    expect(screen.getByText('Export Report')).toBeInTheDocument();
  });

  it('defaults to "General" group when item.group is not specified', () => {
    const ungrouped: CommandPaletteItem[] = [
      { id: 'u1', title: 'Ungrouped Command' },
    ];
    render(<CommandPalette open items={ungrouped} />);
    expect(screen.getByText('General')).toBeInTheDocument();
    expect(screen.getByText('Ungrouped Command')).toBeInTheDocument();
  });

  it('renders shortcut badges when provided', () => {
    render(<CommandPalette open items={sampleItems} />);
    expect(screen.getByText('⌘D')).toBeInTheDocument();
    expect(screen.getByText('⌘,')).toBeInTheDocument();
  });

  it('renders descriptions when provided', () => {
    render(<CommandPalette open items={sampleItems} />);
    expect(screen.getByText('Start a new policy wizard')).toBeInTheDocument();
    expect(screen.getByText('AI-powered risk analysis')).toBeInTheDocument();
  });
});

describe('CommandPalette — accessibility', () => {
  it('has no accessibility violations', async () => {
    const { container } = render(<CommandPalette open items={sampleItems} />);
    await expectNoA11yViolations(container);
  });
});
