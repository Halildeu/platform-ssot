import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { TableSimple } from '../TableSimple';

const columns = [
  { key: 'name', label: 'Name' },
  { key: 'age', label: 'Age' },
];

const rows = [
  { name: 'Alice', age: 30 },
  { name: 'Bob', age: 25 },
];

describe('TableSimple (Browser)', () => {
  it('renders column headers', async () => {
    const screen = render(<TableSimple columns={columns} rows={rows} />);
    await expect.element(screen.getByText('Name')).toBeVisible();
    await expect.element(screen.getByText('Age')).toBeVisible();
  });

  it('renders row data', async () => {
    const screen = render(<TableSimple columns={columns} rows={rows} />);
    await expect.element(screen.getByText('Alice')).toBeVisible();
    await expect.element(screen.getByText('Bob')).toBeVisible();
  });

  it('renders table element with role', async () => {
    const screen = render(<TableSimple columns={columns} rows={rows} />);
    const table = screen.container.querySelector('table');
    expect(table).not.toBeNull();
  });

  it('renders empty state when no rows', async () => {
    const screen = render(<TableSimple columns={columns} rows={[]} />);
    const el = screen.container.querySelector('[data-component="table-simple"]');
    expect(el).not.toBeNull();
  });

  it('renders caption when provided', async () => {
    const screen = render(<TableSimple columns={columns} rows={rows} caption="User Table" />);
    await expect.element(screen.getByText('User Table')).toBeVisible();
  });

  it('renders data-component attribute', async () => {
    const screen = render(<TableSimple columns={columns} rows={rows} />);
    const el = screen.container.querySelector('[data-component="table-simple"]');
    expect(el).not.toBeNull();
  });

  it('renders nothing when access is hidden', async () => {
    const screen = render(<TableSimple columns={columns} rows={rows} access="hidden" />);
    expect(screen.container.querySelector('table')).toBeNull();
  });

  it('renders with custom render function', async () => {
    const screen = render(
      <TableSimple
        columns={[
          { key: 'name', label: 'Name' },
          { key: 'status', label: 'Status', render: () => <span>Active</span> },
        ]}
        rows={[{ name: 'Alice', status: 'active' }]}
      />,
    );
    await expect.element(screen.getByText('Active')).toBeVisible();
  });
});
