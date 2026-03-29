 
import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { page } from 'vitest/browser';
import { EmptyState } from '../EmptyState';
import { LIGHT_BG_HEX } from '../../../__tests__/visual-constants';

describe('EmptyState Visual Regression', () => {
  it('default state matches screenshot', async () => {
    await render(
      <div style={{ padding: 20, background: LIGHT_BG_HEX, width: 400 }}>
        <EmptyState
          title="No results"
          description="There are no items to display."
        />
      </div>,
    );
    await expect(page.screenshot()).toMatchImageSnapshot();
  });
});
