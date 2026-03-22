import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { Breadcrumb } from '../Breadcrumb';

const items = [
  { label: 'Home' },
  { label: 'Products' },
  { label: 'Detail' },
];

describe('Breadcrumb (Browser)', () => {
  it('renders all breadcrumb items', async () => {
    const screen = render(<Breadcrumb items={items} />);
    await expect.element(screen.getByText('Home')).toBeVisible();
    await expect.element(screen.getByText('Products')).toBeVisible();
    await expect.element(screen.getByText('Detail')).toBeVisible();
  });

  it('marks the last item as current page', async () => {
    const screen = render(<Breadcrumb items={items} />);
    const lastItem = screen.getByText('Detail');
    await expect.element(lastItem).toBeVisible();
  });
});
