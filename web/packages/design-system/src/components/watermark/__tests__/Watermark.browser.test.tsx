import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { Watermark } from '../Watermark';

describe('Watermark (Browser)', () => {
  it('renders children', async () => {
    const screen = render(
      <Watermark content="Confidential">
        <div>Protected Content</div>
      </Watermark>,
    );
    await expect.element(screen.getByText('Protected Content')).toBeVisible();
  });

  it('renders overlay element', async () => {
    const screen = render(
      <Watermark content="Draft">
        <div>Content</div>
      </Watermark>,
    );
    await expect.element(screen.getByTestId('watermark-overlay')).toBeVisible();
  });
});
