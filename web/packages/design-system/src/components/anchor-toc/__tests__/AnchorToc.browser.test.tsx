import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { AnchorToc } from '../AnchorToc';

describe('AnchorToc (Browser)', () => {
  it('renders toc items', async () => {
    const screen = render(
      <AnchorToc
        items={[
          { id: 'intro', label: 'Introduction' },
          { id: 'details', label: 'Details', level: 2 },
        ]}
        syncWithHash={false}
      />,
    );
    await expect.element(screen.getByText('Introduction')).toBeVisible();
    await expect.element(screen.getByText('Details')).toBeVisible();
  });

  it('shows item count badge', async () => {
    const screen = render(
      <AnchorToc
        items={[
          { id: 'a', label: 'A' },
          { id: 'b', label: 'B' },
          { id: 'c', label: 'C' },
        ]}
        syncWithHash={false}
      />,
    );
    await expect.element(screen.getByText('3')).toBeVisible();
  });
});
