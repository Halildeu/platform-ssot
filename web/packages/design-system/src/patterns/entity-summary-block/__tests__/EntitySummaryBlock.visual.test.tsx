import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { EntitySummaryBlock } from '../EntitySummaryBlock';

describe('EntitySummaryBlock Visual Regression', () => {
  it('summary block matches screenshot', async () => {
    const screen = render(
      <div style={{ padding: 20, background: '#fff', width: 500 }}>
        <EntitySummaryBlock
          title="Jane Smith"
          subtitle="Product Manager"
          items={[
            { key: 'team', label: 'Team', value: 'Platform' },
            { key: 'joined', label: 'Joined', value: '2024' },
          ]}
        />
      </div>,
    );
    await expect(screen.container).toMatchScreenshot();
  });
});
