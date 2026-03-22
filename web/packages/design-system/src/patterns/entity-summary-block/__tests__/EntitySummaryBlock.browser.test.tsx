import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { EntitySummaryBlock } from '../EntitySummaryBlock';

const items = [
  { key: 'dept', label: 'Department', value: 'Engineering' },
  { key: 'loc', label: 'Location', value: 'Istanbul' },
];

describe('EntitySummaryBlock (Browser)', () => {
  it('renders title', async () => {
    const screen = await render(<EntitySummaryBlock title="John Doe" items={items} />);
    await expect.element(screen.getByText('John Doe')).toBeVisible();
  });

  it('renders subtitle', async () => {
    render(
      <EntitySummaryBlock title="John" subtitle="Software Engineer" items={items} />,
    );
    await expect.element(screen.getByText('Software Engineer')).toBeVisible();
  });

  it('renders description items', async () => {
    const screen = await render(<EntitySummaryBlock title="John" items={items} />);
    await expect.element(screen.getByText('Department')).toBeVisible();
    await expect.element(screen.getByText('Engineering')).toBeVisible();
    await expect.element(screen.getByText('Istanbul')).toBeVisible();
  });

  it('renders badge', async () => {
    render(
      <EntitySummaryBlock title="Entity" badge={<span>Active</span>} items={items} />,
    );
    await expect.element(screen.getByText('Active')).toBeVisible();
  });

  it('renders actions slot', async () => {
    render(
      <EntitySummaryBlock title="Entity" items={items} actions={<button>Edit</button>} />,
    );
    await expect.element(screen.getByText('Edit')).toBeVisible();
  });

  it('renders data-component attribute', async () => {
    const screen = await render(<EntitySummaryBlock title="Test" items={items} />);
    const el = document.querySelector('[data-component="entity-summary-block"]');
    expect(el).not.toBeNull();
  });

  it('renders nothing when access is hidden', async () => {
    const screen = await render(<EntitySummaryBlock title="Hidden" items={items} access="hidden" />);
    expect(document.querySelector('[data-component="entity-summary-block"]')).toBeNull();
  });
});
