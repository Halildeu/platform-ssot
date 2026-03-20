// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { List, type ListItem } from '../List';
import { expectNoA11yViolations } from '../../../__tests__/a11y-utils';

afterEach(() => cleanup());

const makeItems = (): ListItem[] => [
  { key: '1', title: 'Item One', description: 'First item' },
  { key: '2', title: 'Item Two', description: 'Second item' },
  { key: '3', title: 'Item Three' },
];

describe('List contract', () => {
  /* ---- Identity ---- */
  it('has displayName', () => {
    expect(List.displayName).toBe('List');
  });

  it('renders with required props', () => {
    render(<List items={makeItems()} />);
    expect(screen.getByText('Item One')).toBeInTheDocument();
    expect(screen.getByText('Item Two')).toBeInTheDocument();
    expect(screen.getByText('Item Three')).toBeInTheDocument();
  });

  /* ---- Title and description ---- */
  it('renders title', () => {
    render(<List items={makeItems()} title="My List" />);
    expect(screen.getByText('My List')).toBeInTheDocument();
  });

  it('renders description', () => {
    render(<List items={makeItems()} description="A list of things" />);
    expect(screen.getByText('A list of things')).toBeInTheDocument();
  });

  /* ---- Empty state ---- */
  it('renders empty state when items is empty', () => {
    render(<List items={[]} />);
    expect(screen.getByText('No records found for this list.')).toBeInTheDocument();
  });

  it('renders custom emptyStateLabel', () => {
    render(<List items={[]} emptyStateLabel="Nothing here" />);
    expect(screen.getByText('Nothing here')).toBeInTheDocument();
  });

  /* ---- Loading state ---- */
  it('renders loading state', () => {
    const { container } = render(<List items={[]} loading />);
    expect(container.querySelector('[data-loading="true"]')).toBeInTheDocument();
  });

  /* ---- onItemSelect callback ---- */
  it('fires onItemSelect when interactive item is clicked', async () => {
    const handler = vi.fn();
    const user = userEvent.setup();
    render(<List items={makeItems()} onItemSelect={handler} />);
    await user.click(screen.getByText('Item One'));
    expect(handler).toHaveBeenCalledWith('1');
  });

  /* ---- Selected state ---- */
  it('renders selected item with aria-current', () => {
    const { container } = render(<List items={makeItems()} selectedKey="2" onItemSelect={() => {}} />);
    const selectedBtn = container.querySelector('[aria-current="true"]');
    expect(selectedBtn).toBeInTheDocument();
  });

  /* ---- Access control: hidden ---- */
  it('access=hidden returns null', () => {
    const { container } = render(<List items={makeItems()} access="hidden" />);
    expect(container.innerHTML).toBe('');
  });

  /* ---- Density ---- */
  it.each(['comfortable', 'compact'] as const)('renders density=%s', (density) => {
    render(<List items={makeItems()} density={density} />);
    expect(screen.getByText('Item One')).toBeInTheDocument();
  });
});

describe('List — accessibility', () => {
  it('has no axe-core a11y violations', async () => {
    const { container } = render(<List items={makeItems()} />);
    await expectNoA11yViolations(container);
  });
});
