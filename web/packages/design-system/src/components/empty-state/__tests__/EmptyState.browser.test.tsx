import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { EmptyState } from '../EmptyState';

describe('EmptyState (Browser)', () => {
  it('renders with title and description', async () => {
    const screen = await render(
      <EmptyState title="No data found" description="Try adjusting your filters." />,
    );
    await expect.element(screen.getByText('No data found')).toBeVisible();
    await expect.element(screen.getByText('Try adjusting your filters.')).toBeVisible();
  });

  it('renders with icon', async () => {
    const screen = await render(
      <EmptyState
        title="Empty"
        icon={<svg data-testid="empty-icon"><circle cx="8" cy="8" r="6" /></svg>}
      />,
    );
    await expect.element(screen.getByTestId('empty-icon')).toBeVisible();
  });

  it('renders primary action button', async () => {
    const screen = await render(
      <EmptyState title="No items" action={<button>Create New</button>} />,
    );
    await expect.element(screen.getByText('Create New')).toBeVisible();
  });

  it('renders secondary action', async () => {
    const screen = await render(
      <EmptyState
        title="No items"
        action={<button>Create</button>}
        secondaryAction={<button>Import</button>}
      />,
    );
    await expect.element(screen.getByText('Import')).toBeVisible();
  });

  it('renders compact variant', async () => {
    const screen = await render(
      <EmptyState title="Nothing here" compact />,
    );
    await expect.element(screen.getByText('Nothing here')).toBeVisible();
  });

  it('renders nothing when access is hidden', async () => {
    const screen = await render(
      <EmptyState title="Hidden" access="hidden" />,
    );
    expect(screen.container.innerHTML.trim()).toBe('');
  });

  it('renders without description when not provided', async () => {
    const screen = await render(<EmptyState title="Title only" />);
    await expect.element(screen.getByText('Title only')).toBeVisible();
  });
});
