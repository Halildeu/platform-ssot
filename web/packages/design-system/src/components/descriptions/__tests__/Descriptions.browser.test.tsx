import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { Descriptions } from '../Descriptions';

const items = [
  { key: 'name', label: 'Name', value: 'John Doe' },
  { key: 'email', label: 'Email', value: 'john@example.com' },
  { key: 'role', label: 'Role', value: 'Admin' },
];

describe('Descriptions (Browser)', () => {
  it('renders all key-value pairs', async () => {
    const screen = await render(<Descriptions items={items} />);
    await expect.element(screen.getByText('Name')).toBeVisible();
    await expect.element(screen.getByText('John Doe')).toBeVisible();
    await expect.element(screen.getByText('Email')).toBeVisible();
    await expect.element(screen.getByText('john@example.com')).toBeVisible();
    await expect.element(screen.getByText('Role')).toBeVisible();
    await expect.element(screen.getByText('Admin')).toBeVisible();
  });

  it('renders title when provided', async () => {
    const screen = await render(<Descriptions items={items} title="User Details" />);
    await expect.element(screen.getByText('User Details')).toBeVisible();
  });

  it('renders description text', async () => {
    const screen = await render(<Descriptions items={items} description="Basic info" />);
    await expect.element(screen.getByText('Basic info')).toBeVisible();
  });

  it('renders with different column counts', async () => {
    const screen = await render(<Descriptions items={items} columns={3} />);
    // All items should still be visible with 3 columns
    await expect.element(screen.getByText('Name')).toBeVisible();
    await expect.element(screen.getByText('Email')).toBeVisible();
    await expect.element(screen.getByText('Role')).toBeVisible();
  });

  it('shows empty state when no items', async () => {
    const screen = await render(<Descriptions items={[]} />);
    await expect.element(screen.getByText('No data available')).toBeVisible();
  });

  it('renders bordered variant', async () => {
    const screen = await render(<Descriptions items={items} bordered />);
    await expect.element(screen.getByText('Name')).toBeVisible();
  });

  it('renders helper text for items', async () => {
    const helperItems = [
      { key: 'name', label: 'Name', value: 'John', helper: 'Full legal name' },
    ];
    const screen = await render(<Descriptions items={helperItems} />);
    await expect.element(screen.getByText('Full legal name')).toBeVisible();
  });

  it('renders compact density', async () => {
    const screen = await render(<Descriptions items={items} density="compact" />);
    await expect.element(screen.getByText('Name')).toBeVisible();
  });
});
