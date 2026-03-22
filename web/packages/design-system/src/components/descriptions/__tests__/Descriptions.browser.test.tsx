import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { Descriptions } from '../Descriptions';

const items = [
  { key: 'name', label: 'Name', value: 'John Doe' },
  { key: 'email', label: 'Email', value: 'john@example.com' },
  { key: 'role', label: 'Role', value: 'Admin' },
];

describe('Descriptions (Browser)', () => {
  it('renders key-value pairs', async () => {
    const screen = render(<Descriptions items={items} />);
    await expect.element(screen.getByText('Name')).toBeVisible();
    await expect.element(screen.getByText('John Doe')).toBeVisible();
    await expect.element(screen.getByText('Email')).toBeVisible();
  });

  it('renders title when provided', async () => {
    const screen = render(<Descriptions items={items} title="User Details" />);
    await expect.element(screen.getByText('User Details')).toBeVisible();
  });
});
