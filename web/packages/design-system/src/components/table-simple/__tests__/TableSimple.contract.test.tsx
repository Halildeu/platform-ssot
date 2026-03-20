// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { TableSimple } from '../TableSimple';
import { expectNoA11yViolations } from '../../../__tests__/a11y-utils';

afterEach(() => cleanup());

type Row = { id: string; name: string; value: number };

const columns = [
  { key: 'name', label: 'Name' },
  { key: 'value', label: 'Value' },
];

const rows: Row[] = [
  { id: '1', name: 'Alpha', value: 10 },
  { id: '2', name: 'Beta', value: 20 },
];

describe('TableSimple contract', () => {
  /* ---- Identity ---- */
  it('has displayName', () => {
    expect(TableSimple.displayName).toBe('TableSimple');
  });

  /* ---- Default render ---- */
  it('renders table with column headers', () => {
    render(<TableSimple columns={columns} rows={rows} />);
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Value')).toBeInTheDocument();
  });

  it('renders row data', () => {
    render(<TableSimple columns={columns} rows={rows} />);
    expect(screen.getByText('Alpha')).toBeInTheDocument();
    expect(screen.getByText('Beta')).toBeInTheDocument();
  });

  it('sets data-component attribute', () => {
    const { container } = render(<TableSimple columns={columns} rows={rows} />);
    expect(container.querySelector('[data-component="table-simple"]')).toBeInTheDocument();
  });

  /* ---- Empty state ---- */
  it('renders empty state when rows is empty', () => {
    const { container } = render(<TableSimple columns={columns} rows={[]} />);
    // Should not render a table element
    expect(container.querySelector('table')).not.toBeInTheDocument();
  });

  /* ---- Caption ---- */
  it('renders caption when provided', () => {
    render(<TableSimple columns={columns} rows={rows} caption="Sales data" />);
    expect(screen.getByText('Sales data')).toBeInTheDocument();
  });

  /* ---- Loading ---- */
  it('renders loading skeletons when loading=true', () => {
    const { container } = render(<TableSimple columns={columns} rows={[]} loading />);
    expect(container.querySelector('table')).toBeInTheDocument();
  });

  /* ---- Access hidden ---- */
  it('renders nothing when access=hidden', () => {
    const { container } = render(<TableSimple columns={columns} rows={rows} access="hidden" />);
    expect(container.innerHTML).toBe('');
  });

  /* ---- Custom column render ---- */
  it('supports custom render function on columns', () => {
    const cols = [
      { key: 'name', label: 'Name', render: (row: Row) => <strong>{row.name}</strong> },
    ];
    render(<TableSimple columns={cols} rows={rows} />);
    expect(screen.getByText('Alpha').tagName).toBe('STRONG');
  });
});

describe('TableSimple — accessibility', () => {
  it('has no axe-core a11y violations', async () => {
    const { container } = render(<TableSimple columns={columns} rows={rows} />);
    await expectNoA11yViolations(container);
  });
});
