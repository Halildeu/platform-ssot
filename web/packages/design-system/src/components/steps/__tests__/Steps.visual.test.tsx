import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { Steps } from '../Steps';

describe('Steps Visual Regression', () => {
  it('default with 3 steps matches screenshot', async () => {
    const screen = render(
      <div style={{ padding: 20, background: '#fff', width: 500 }}>
        <Steps
          items={[
            { key: 'step1', title: 'Step 1' },
            { key: 'step2', title: 'Step 2' },
            { key: 'step3', title: 'Step 3' },
          ]}
          current={1}
        />
      </div>,
    );
    await expect(screen.container).toMatchScreenshot();
  });
});
