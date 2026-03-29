// @vitest-environment jsdom
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { DataListBlock } from '../blocks/crud/DataListBlock';

interface TestItem {
  id: string;
  name: string;
  status: string;
}

const items: TestItem[] = [
  { id: '1', name: 'Alpha', status: 'active' },
  { id: '2', name: 'Beta', status: 'inactive' },
  { id: '3', name: 'Gamma', status: 'active' },
  { id: '4', name: 'Delta', status: 'inactive' },
];

const columns = [
  { key: 'name' as const, label: 'Name' },
  { key: 'status' as const, label: 'Status' },
];

describe('DataListBlock', () => {
  it('renders all items', () => {
    render(<DataListBlock items={items} columns={columns} searchKey="name" />);
    expect(screen.getByText('Alpha')).toBeInTheDocument();
    expect(screen.getByText('Beta')).toBeInTheDocument();
    expect(screen.getByText('Gamma')).toBeInTheDocument();
    expect(screen.getByText('Delta')).toBeInTheDocument();
  });

  it('renders column headers', () => {
    render(<DataListBlock items={items} columns={columns} searchKey="name" />);
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
  });

  it('filters items by search', () => {
    render(<DataListBlock items={items} columns={columns} searchKey="name" />);
    const input = screen.getByPlaceholderText('Search...');
    fireEvent.change(input, { target: { value: 'alp' } });
    expect(screen.getByText('Alpha')).toBeInTheDocument();
    expect(screen.queryByText('Beta')).not.toBeInTheDocument();
  });

  it('shows empty state when no matches', () => {
    render(<DataListBlock items={items} columns={columns} searchKey="name" />);
    const input = screen.getByPlaceholderText('Search...');
    fireEvent.change(input, { target: { value: 'zzz' } });
    expect(screen.getByText('No items found.')).toBeInTheDocument();
  });

  it('calls onItemClick when a row is clicked', () => {
    const onClick = vi.fn();
    render(
      <DataListBlock items={items} columns={columns} searchKey="name" onItemClick={onClick} />,
    );
    fireEvent.click(screen.getByText('Alpha'));
    expect(onClick).toHaveBeenCalledWith(items[0]);
  });

  it('paginates items', () => {
    render(<DataListBlock items={items} columns={columns} searchKey="name" pageSize={2} />);
    expect(screen.getByText('Alpha')).toBeInTheDocument();
    expect(screen.getByText('Beta')).toBeInTheDocument();
    expect(screen.queryByText('Gamma')).not.toBeInTheDocument();

    fireEvent.click(screen.getByText('Next'));
    expect(screen.getByText('Gamma')).toBeInTheDocument();
    expect(screen.queryByText('Alpha')).not.toBeInTheDocument();
  });

  it('renders custom column renderers', () => {
    const customColumns = [
      { key: 'name' as const, label: 'Name' },
      {
        key: 'status' as const,
        label: 'Status',
        render: (value: string) => <span data-testid="badge">{value.toUpperCase()}</span>,
      },
    ];
    render(<DataListBlock items={items} columns={customColumns} searchKey="name" />);
    const badges = screen.getAllByTestId('badge');
    expect(badges[0]).toHaveTextContent('ACTIVE');
  });

  it('renders actions slot', () => {
    render(
      <DataListBlock
        items={items}
        columns={columns}
        searchKey="name"
        actions={<button>Add</button>}
      />,
    );
    expect(screen.getByText('Add')).toBeInTheDocument();
  });
});
