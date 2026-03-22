import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { page } from 'vitest/browser';
import { EntitySummaryBlock } from '../EntitySummaryBlock';

describe('EntitySummaryBlock Visual Regression', () => {
  it('summary block matches screenshot', async () => {
    render(
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
    await expect(page.screenshot()).toMatchImageSnapshot();
  });
});
