import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { Divider } from '../Divider';

describe('Divider (Browser)', () => {
  it('renders horizontal divider', async () => {
    const screen = render(<Divider data-testid="h-divider" />);
    await expect.element(screen.getByTestId('h-divider')).toBeVisible();
  });

  it('renders vertical divider', async () => {
    const screen = render(
      <div style={{ height: 40, display: 'flex' }}>
        <Divider orientation="vertical" data-testid="v-divider" />
      </div>,
    );
    await expect.element(screen.getByTestId('v-divider')).toBeVisible();
  });
});
