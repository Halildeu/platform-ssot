import { describe, it, expect, vi } from 'vitest';
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

  it('marks last item as current page with aria-current', async () => {
    const screen = render(<Breadcrumb items={items} />);
    const current = screen.container.querySelector('[aria-current="page"]');
    expect(current).not.toBeNull();
    expect(current!.textContent).toBe('Detail');
  });

  it('renders navigation landmark with aria-label', async () => {
    const screen = render(<Breadcrumb items={items} />);
    const nav = screen.getByRole('navigation');
    await expect.element(nav).toHaveAttribute('aria-label', 'Breadcrumb');
  });

  it('fires onClick for non-last items', async () => {
    const onClick = vi.fn();
    const clickableItems = [
      { label: 'Home', onClick },
      { label: 'Products' },
    ];
    const screen = render(<Breadcrumb items={clickableItems} />);
    await screen.getByText('Home').click();
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('renders separators between items', async () => {
    const screen = render(<Breadcrumb items={items} />);
    const separators = screen.container.querySelectorAll('[aria-hidden]');
    // Should have n-1 separators for n items
    expect(separators.length).toBe(items.length - 1);
  });

  it('renders custom separator', async () => {
    const screen = render(<Breadcrumb items={items} separator={<span>/</span>} />);
    const slashes = screen.container.querySelectorAll('[aria-hidden]');
    expect(slashes.length).toBeGreaterThan(0);
  });

  it('collapses items when maxItems is exceeded', async () => {
    const manyItems = [
      { label: 'Root' },
      { label: 'Level 1' },
      { label: 'Level 2' },
      { label: 'Level 3' },
      { label: 'Current' },
    ];
    const screen = render(<Breadcrumb items={manyItems} maxItems={3} />);
    await expect.element(screen.getByText('Root')).toBeVisible();
    await expect.element(screen.getByText('...')).toBeVisible();
    await expect.element(screen.getByText('Current')).toBeVisible();
  });

  it('renders ordered list element', async () => {
    const screen = render(<Breadcrumb items={items} />);
    const ol = screen.container.querySelector('ol');
    expect(ol).not.toBeNull();
  });
});
