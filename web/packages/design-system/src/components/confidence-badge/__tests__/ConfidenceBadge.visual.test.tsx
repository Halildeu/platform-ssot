import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { page } from 'vitest/browser';
import { ConfidenceBadge } from '../ConfidenceBadge';

describe('ConfidenceBadge Visual Regression', () => {
  it('high confidence matches screenshot', async () => {
    render(
      <div style={{ padding: 20, background: '#fff' }}>
        <ConfidenceBadge level="high" score={95} sourceCount={3} />
      </div>,
    );
    await expect(page.screenshot()).toMatchImageSnapshot();
  });
});
