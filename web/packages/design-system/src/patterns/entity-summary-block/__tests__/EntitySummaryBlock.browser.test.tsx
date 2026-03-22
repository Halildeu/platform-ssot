import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { EntitySummaryBlock } from '../EntitySummaryBlock';

describe('EntitySummaryBlock (Browser)', () => {
  it('renders title and description items', async () => {
    const screen = render(
      <EntitySummaryBlock
        title="John Doe"
        subtitle="Software Engineer"
        items={[
          { key: 'dept', label: 'Department', value: 'Engineering' },
          { key: 'loc', label: 'Location', value: 'Istanbul' },
        ]}
      />,
    );
    await expect.element(screen.getByText('John Doe')).toBeVisible();
    await expect.element(screen.getByText('Engineering')).toBeVisible();
  });

  it('renders with badge', async () => {
    const screen = render(
      <EntitySummaryBlock
        title="Entity"
        badge={<span>Active</span>}
        items={[{ key: 'k1', label: 'L1', value: 'V1' }]}
      />,
    );
    await expect.element(screen.getByText('Active')).toBeVisible();
  });
});
