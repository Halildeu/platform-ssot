import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { EmptyState } from '../EmptyState';

describe('EmptyState Visual Regression', () => {
  it('default state matches screenshot', async () => {
    const screen = render(
      <div style={{ padding: 20, background: '#fff', width: 400 }}>
        <EmptyState
          title="No results"
          description="There are no items to display."
        />
      </div>,
    );
    await expect(screen.container).toMatchScreenshot();
  });
});
