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
});
