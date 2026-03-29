 
import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { page } from 'vitest/browser';
import { EntitySummaryBlock } from '../EntitySummaryBlock';
import { LIGHT_BG_HEX } from '../../../__tests__/visual-constants';

describe('EntitySummaryBlock Visual Regression', () => {
  it('summary block matches screenshot', async () => {
    await render(
      <div style={{ padding: 20, background: LIGHT_BG_HEX, width: 500 }}>
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
