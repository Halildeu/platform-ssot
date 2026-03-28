/* eslint-disable semantic-theme/no-inline-color-literals */
import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { page } from 'vitest/browser';
import { SmartDashboard } from '../SmartDashboard';
import { LIGHT_BG_HEX } from '../../../__tests__/visual-constants';

describe('SmartDashboard Visual Regression', () => {
  it('dashboard with KPIs matches screenshot', async () => {
    await render(
      <div style={{ padding: 20, background: LIGHT_BG_HEX, width: 700 }}>
        <SmartDashboard
          title="Overview"
          widgets={[
            { key: 'w1', title: 'Users', type: 'kpi', value: '1,234' },
            { key: 'w2', title: 'Revenue', type: 'kpi', value: '$56K', tone: 'success' },
          ]}
        />
      </div>,
    );
    await expect(page.screenshot()).toMatchImageSnapshot();
  });
});
