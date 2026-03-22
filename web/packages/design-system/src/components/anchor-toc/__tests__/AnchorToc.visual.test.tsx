import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { AnchorToc } from '../AnchorToc';

describe('AnchorToc Visual Regression', () => {
  it('default toc matches screenshot', async () => {
    const screen = render(
      <div style={{ padding: 20, background: '#fff', width: 280 }}>
        <AnchorToc
          items={[
            { id: 'intro', label: 'Introduction' },
            { id: 'setup', label: 'Setup', level: 2 },
            { id: 'usage', label: 'Usage' },
          ]}
          syncWithHash={false}
        />
      </div>,
    );
    await expect(screen.container).toMatchScreenshot();
  });
});
