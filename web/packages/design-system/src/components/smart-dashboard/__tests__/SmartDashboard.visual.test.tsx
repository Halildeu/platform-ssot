import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { SmartDashboard } from '../SmartDashboard';

describe('SmartDashboard Visual Regression', () => {
  it('dashboard with KPIs matches screenshot', async () => {
    const screen = render(
      <div style={{ padding: 20, background: '#fff', width: 700 }}>
        <SmartDashboard
          title="Overview"
          widgets={[
            { key: 'w1', title: 'Users', type: 'kpi', value: '1,234' },
            { key: 'w2', title: 'Revenue', type: 'kpi', value: '$56K', tone: 'success' },
          ]}
        />
      </div>,
    );
    await expect(screen.container).toMatchScreenshot();
  });
});
