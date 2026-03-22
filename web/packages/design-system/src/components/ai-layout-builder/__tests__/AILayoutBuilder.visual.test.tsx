import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { AILayoutBuilder } from '../AILayoutBuilder';

describe('AILayoutBuilder Visual Regression', () => {
  it('overview layout matches screenshot', async () => {
    const screen = render(
      <div style={{ padding: 20, background: '#fff', width: 600 }}>
        <AILayoutBuilder
          blocks={[
            { key: 'b1', type: 'metric', title: 'Revenue', content: <span>$1000</span> },
            { key: 'b2', type: 'chart', title: 'Chart', content: <span>Chart area</span> },
          ]}
          title="Layout"
        />
      </div>,
    );
    await expect(screen.container).toMatchScreenshot();
  });
});
