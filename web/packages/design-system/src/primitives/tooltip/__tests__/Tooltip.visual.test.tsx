import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { Tooltip } from '../Tooltip';

describe('Tooltip Visual Regression', () => {
  it('visible tooltip matches screenshot', async () => {
    const screen = render(
      <div style={{ padding: 60, background: '#fff', display: 'flex', justifyContent: 'center' }}>
        <Tooltip content="Helpful tip" delay={0}>
          <button>Hover target</button>
        </Tooltip>
      </div>,
    );
    await screen.getByText('Hover target').hover();
    await expect.element(screen.getByRole('tooltip')).toBeVisible();
    await expect(screen.container).toMatchScreenshot();
  });
});
