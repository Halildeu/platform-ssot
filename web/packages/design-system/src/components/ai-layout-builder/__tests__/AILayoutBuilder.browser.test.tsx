import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { AILayoutBuilder } from '../AILayoutBuilder';

describe('AILayoutBuilder (Browser)', () => {
  it('renders blocks in a grid', async () => {
    const screen = render(
      <AILayoutBuilder
        blocks={[
          { key: 'b1', type: 'metric', title: 'Revenue', content: <span>$1000</span> },
          { key: 'b2', type: 'chart', title: 'Sales chart', content: <span>Chart</span> },
        ]}
      />,
    );
    await expect.element(screen.getByText('Revenue')).toBeVisible();
    await expect.element(screen.getByText('Sales chart')).toBeVisible();
  });

  it('renders with title and description', async () => {
    const screen = render(
      <AILayoutBuilder
        blocks={[{ key: 'b1', type: 'text', content: <span>Hello</span> }]}
        title="Dashboard"
        description="Overview of metrics"
      />,
    );
    await expect.element(screen.getByText('Dashboard')).toBeVisible();
  });
});
