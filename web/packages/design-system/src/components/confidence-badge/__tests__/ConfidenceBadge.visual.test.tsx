 
import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { page } from 'vitest/browser';
import { ConfidenceBadge } from '../ConfidenceBadge';
import { LIGHT_BG_HEX } from '../../../__tests__/visual-constants';

describe('ConfidenceBadge Visual Regression', () => {
  it('high confidence matches screenshot', async () => {
    await render(
      <div style={{ padding: 20, background: LIGHT_BG_HEX }}>
        <ConfidenceBadge level="high" score={95} sourceCount={3} />
      </div>,
    );
    await expect(page.screenshot()).toMatchImageSnapshot();
  });
});
