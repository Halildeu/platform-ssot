// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Transfer, type TransferItem } from '../Transfer';
import { expectNoA11yViolations } from '../../../__tests__/a11y-utils';

afterEach(() => cleanup());

const makeData = (): TransferItem[] => [
  { key: '1', label: 'Apple' },
  { key: '2', label: 'Banana' },
  { key: '3', label: 'Cherry' },
  { key: '4', label: 'Date' },
];

describe('Transfer contract', () => {
  /* ---- Identity ---- */
  it('has displayName', () => {
    expect(Transfer.displayName).toBe('Transfer');
  });

  it('renders with required props', () => {
    render(<Transfer dataSource={makeData()} />);
    expect(screen.getByTestId('transfer')).toBeInTheDocument();
    expect(screen.getByTestId('transfer-panel-left')).toBeInTheDocument();
    expect(screen.getByTestId('transfer-panel-right')).toBeInTheDocument();
  });

  /* ---- Titles ---- */
  it('renders custom panel titles', () => {
    render(<Transfer dataSource={makeData()} titles={['Source', 'Target']} />);
    expect(screen.getByText('Source')).toBeInTheDocument();
    expect(screen.getByText('Target')).toBeInTheDocument();
  });

  /* ---- Default titles ---- */
  it('renders default panel titles', () => {
    render(<Transfer dataSource={makeData()} />);
    expect(screen.getByText('Kaynak')).toBeInTheDocument();
    expect(screen.getByText('Hedef')).toBeInTheDocument();
  });

  /* ---- Items are rendered ---- */
  it('renders all items in the left panel by default', () => {
    render(<Transfer dataSource={makeData()} />);
    expect(screen.getByText('Apple')).toBeInTheDocument();
    expect(screen.getByText('Banana')).toBeInTheDocument();
    expect(screen.getByText('Cherry')).toBeInTheDocument();
    expect(screen.getByText('Date')).toBeInTheDocument();
  });

  /* ---- Controlled targetKeys ---- */
  it('respects controlled targetKeys', () => {
    render(<Transfer dataSource={makeData()} targetKeys={['2', '3']} />);
    const rightPanel = screen.getByTestId('transfer-panel-right');
    expect(rightPanel).toHaveTextContent('Banana');
    expect(rightPanel).toHaveTextContent('Cherry');
  });

  /* ---- Transfer buttons ---- */
  it('renders move-right and move-left buttons', () => {
    render(<Transfer dataSource={makeData()} />);
    expect(screen.getByTestId('transfer-move-right')).toBeInTheDocument();
    expect(screen.getByTestId('transfer-move-left')).toBeInTheDocument();
  });

  it('move buttons are disabled when no selection', () => {
    render(<Transfer dataSource={makeData()} />);
    expect(screen.getByTestId('transfer-move-right')).toBeDisabled();
    expect(screen.getByTestId('transfer-move-left')).toBeDisabled();
  });

  /* ---- className merge ---- */
  it('merges custom className', () => {
    const { container } = render(<Transfer dataSource={makeData()} className="my-transfer" />);
    expect(container.querySelector('.my-transfer')).toBeInTheDocument();
  });

  /* ---- Searchable ---- */
  it('renders search inputs when searchable', () => {
    render(<Transfer dataSource={makeData()} searchable />);
    expect(screen.getByTestId('transfer-search-left')).toBeInTheDocument();
    expect(screen.getByTestId('transfer-search-right')).toBeInTheDocument();
  });

  /* ---- Access control: hidden ---- */
  it('access=hidden returns null', () => {
    const { container } = render(<Transfer dataSource={makeData()} access="hidden" />);
    expect(container.innerHTML).toBe('');
  });

  /* ---- Sizes ---- */
  it.each(['sm', 'md', 'lg'] as const)('renders size=%s', (size) => {
    render(<Transfer dataSource={makeData()} size={size} />);
    expect(screen.getByTestId('transfer')).toBeInTheDocument();
  });
});

describe('Transfer — accessibility', () => {
  it('has no axe-core a11y violations', async () => {
    const { container } = render(<Transfer dataSource={makeData()} />);
    await expectNoA11yViolations(container);
  });
});
