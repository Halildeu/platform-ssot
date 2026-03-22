import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { SmartDashboard } from '../SmartDashboard';

describe('SmartDashboard (Browser)', () => {
  it('renders widgets', async () => {
    const screen = render(
      <SmartDashboard
        widgets={[
          { key: 'w1', title: 'Users', type: 'kpi', value: '1,234' },
          { key: 'w2', title: 'Revenue', type: 'kpi', value: '$56K' },
        ]}
      />,
    );
    await expect.element(screen.getByText('Users')).toBeVisible();
    await expect.element(screen.getByText('1,234')).toBeVisible();
  });

  it('renders greeting banner', async () => {
    const screen = render(
      <SmartDashboard widgets={[]} greeting="Good morning, Admin" />,
    );
    await expect.element(screen.getByText('Good morning, Admin')).toBeVisible();
  });
});
